import express from 'express';
import { eq, desc, sql } from 'drizzle-orm';
import { db } from '../models/database.js';
import { transactions, products, suppliers } from '../models/schema.js';
import { z } from 'zod';

const router = express.Router();

// Validation schema
const transactionSchema = z.object({
  productId: z.number().int().positive('Product ID is required'),
  type: z.enum(['purchase', 'sale'], 'Type must be either purchase or sale'),
  quantity: z.number().int().positive('Quantity must be positive'),
  unitPrice: z.string().refine((val) => !isNaN(parseFloat(val)) && parseFloat(val) > 0, 'Unit price must be positive'),
  notes: z.string().optional(),
});

// GET /api/transactions - Get all transactions with product info
router.get('/', async (req, res) => {
  try {
    const { limit = 50, offset = 0, type } = req.query;
    
    let query = db
      .select({
        id: transactions.id,
        type: transactions.type,
        quantity: transactions.quantity,
        unitPrice: transactions.unitPrice,
        totalAmount: transactions.totalAmount,
        notes: transactions.notes,
        transactionDate: transactions.transactionDate,
        createdAt: transactions.createdAt,
        product: {
          id: products.id,
          name: products.name,
          sku: products.sku,
        },
        supplier: {
          id: suppliers.id,
          name: suppliers.name,
        }
      })
      .from(transactions)
      .leftJoin(products, eq(transactions.productId, products.id))
      .leftJoin(suppliers, eq(products.supplierId, suppliers.id))
      .orderBy(desc(transactions.transactionDate))
      .limit(parseInt(limit))
      .offset(parseInt(offset));

    if (type && ['purchase', 'sale'].includes(type)) {
      query = query.where(eq(transactions.type, type));
    }

    const allTransactions = await query;
    res.json(allTransactions);
  } catch (error) {
    console.error('Error fetching transactions:', error);
    res.status(500).json({ error: 'Failed to fetch transactions' });
  }
});

// GET /api/transactions/recent - Get recent transactions
router.get('/recent', async (req, res) => {
  try {
    const recentTransactions = await db
      .select({
        id: transactions.id,
        type: transactions.type,
        quantity: transactions.quantity,
        unitPrice: transactions.unitPrice,
        totalAmount: transactions.totalAmount,
        transactionDate: transactions.transactionDate,
        product: {
          id: products.id,
          name: products.name,
          sku: products.sku,
        }
      })
      .from(transactions)
      .leftJoin(products, eq(transactions.productId, products.id))
      .orderBy(desc(transactions.transactionDate))
      .limit(10);

    res.json(recentTransactions);
  } catch (error) {
    console.error('Error fetching recent transactions:', error);
    res.status(500).json({ error: 'Failed to fetch recent transactions' });
  }
});

// GET /api/transactions/:id - Get single transaction
router.get('/:id', async (req, res) => {
  try {
    const transactionId = parseInt(req.params.id);
    
    const transaction = await db
      .select({
        id: transactions.id,
        type: transactions.type,
        quantity: transactions.quantity,
        unitPrice: transactions.unitPrice,
        totalAmount: transactions.totalAmount,
        notes: transactions.notes,
        transactionDate: transactions.transactionDate,
        createdAt: transactions.createdAt,
        product: {
          id: products.id,
          name: products.name,
          sku: products.sku,
          currentStock: products.currentStock,
        },
        supplier: {
          id: suppliers.id,
          name: suppliers.name,
        }
      })
      .from(transactions)
      .leftJoin(products, eq(transactions.productId, products.id))
      .leftJoin(suppliers, eq(products.supplierId, suppliers.id))
      .where(eq(transactions.id, transactionId))
      .limit(1);

    if (transaction.length === 0) {
      return res.status(404).json({ error: 'Transaction not found' });
    }

    res.json(transaction[0]);
  } catch (error) {
    console.error('Error fetching transaction:', error);
    res.status(500).json({ error: 'Failed to fetch transaction' });
  }
});

// POST /api/transactions - Create new transaction
router.post('/', async (req, res) => {
  try {
    const validatedData = transactionSchema.parse(req.body);
    const { productId, type, quantity, unitPrice } = validatedData;
    
    // Calculate total amount
    const totalAmount = (quantity * parseFloat(unitPrice)).toFixed(2);
    
    // Start transaction
    const result = await db.transaction(async (tx) => {
      // Create the transaction record
      const newTransaction = await tx
        .insert(transactions)
        .values({
          ...validatedData,
          totalAmount,
        })
        .returning();

      // Update product stock based on transaction type
      const currentProduct = await tx
        .select({ currentStock: products.currentStock })
        .from(products)
        .where(eq(products.id, productId))
        .limit(1);

      if (currentProduct.length === 0) {
        throw new Error('Product not found');
      }

      const currentStock = currentProduct[0].currentStock;
      let newStock;

      if (type === 'purchase') {
        // Purchase increases stock
        newStock = currentStock + quantity;
      } else {
        // Sale decreases stock
        newStock = currentStock - quantity;
        if (newStock < 0) {
          throw new Error('Insufficient stock for sale');
        }
      }

      // Update product stock
      await tx
        .update(products)
        .set({ 
          currentStock: newStock,
          updatedAt: new Date()
        })
        .where(eq(products.id, productId));

      return newTransaction[0];
    });

    res.status(201).json(result);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ 
        error: 'Validation failed', 
        details: error.errors 
      });
    }
    
    if (error.message === 'Product not found') {
      return res.status(404).json({ error: 'Product not found' });
    }
    
    if (error.message === 'Insufficient stock for sale') {
      return res.status(400).json({ error: 'Insufficient stock for sale' });
    }
    
    console.error('Error creating transaction:', error);
    res.status(500).json({ error: 'Failed to create transaction' });
  }
});

// DELETE /api/transactions/:id - Delete transaction (and revert stock changes)
router.delete('/:id', async (req, res) => {
  try {
    const transactionId = parseInt(req.params.id);
    
    const result = await db.transaction(async (tx) => {
      // Get transaction details first
      const transactionToDelete = await tx
        .select({
          id: transactions.id,
          productId: transactions.productId,
          type: transactions.type,
          quantity: transactions.quantity,
        })
        .from(transactions)
        .where(eq(transactions.id, transactionId))
        .limit(1);

      if (transactionToDelete.length === 0) {
        throw new Error('Transaction not found');
      }

      const { productId, type, quantity } = transactionToDelete[0];

      // Get current product stock
      const currentProduct = await tx
        .select({ currentStock: products.currentStock })
        .from(products)
        .where(eq(products.id, productId))
        .limit(1);

      if (currentProduct.length === 0) {
        throw new Error('Product not found');
      }

      const currentStock = currentProduct[0].currentStock;
      let newStock;

      // Reverse the stock change
      if (type === 'purchase') {
        // Reverse purchase (decrease stock)
        newStock = currentStock - quantity;
        if (newStock < 0) {
          throw new Error('Cannot delete transaction: would result in negative stock');
        }
      } else {
        // Reverse sale (increase stock)
        newStock = currentStock + quantity;
      }

      // Update product stock
      await tx
        .update(products)
        .set({ 
          currentStock: newStock,
          updatedAt: new Date()
        })
        .where(eq(products.id, productId));

      // Delete the transaction
      await tx
        .delete(transactions)
        .where(eq(transactions.id, transactionId));

      return { message: 'Transaction deleted and stock reverted successfully' };
    });

    res.json(result);
  } catch (error) {
    if (error.message === 'Transaction not found') {
      return res.status(404).json({ error: 'Transaction not found' });
    }
    
    if (error.message === 'Product not found') {
      return res.status(404).json({ error: 'Associated product not found' });
    }
    
    if (error.message === 'Cannot delete transaction: would result in negative stock') {
      return res.status(400).json({ error: 'Cannot delete transaction: would result in negative stock' });
    }
    
    console.error('Error deleting transaction:', error);
    res.status(500).json({ error: 'Failed to delete transaction' });
  }
});

export default router;
