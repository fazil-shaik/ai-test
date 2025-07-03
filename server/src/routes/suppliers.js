import express from 'express';
import { eq, desc, count } from 'drizzle-orm';
import { db } from '../models/database.js';
import { suppliers, products } from '../models/schema.js';
import { z } from 'zod';

const router = express.Router();

// Validation schema
const supplierSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email format').optional(),
  phone: z.string().optional(),
  address: z.string().optional(),
});

// GET /api/suppliers - Get all suppliers with product count
router.get('/', async (req, res) => {
  try {
    const allSuppliers = await db
      .select({
        id: suppliers.id,
        name: suppliers.name,
        email: suppliers.email,
        phone: suppliers.phone,
        address: suppliers.address,
        createdAt: suppliers.createdAt,
        updatedAt: suppliers.updatedAt,
        productCount: count(products.id),
      })
      .from(suppliers)
      .leftJoin(products, eq(suppliers.id, products.supplierId))
      .groupBy(suppliers.id)
      .orderBy(desc(suppliers.createdAt));

    res.json(allSuppliers);
  } catch (error) {
    console.error('Error fetching suppliers:', error);
    res.status(500).json({ error: 'Failed to fetch suppliers' });
  }
});

// GET /api/suppliers/:id - Get single supplier with products
router.get('/:id', async (req, res) => {
  try {
    const supplierId = parseInt(req.params.id);
    
    // Get supplier details
    const supplier = await db
      .select()
      .from(suppliers)
      .where(eq(suppliers.id, supplierId))
      .limit(1);

    if (supplier.length === 0) {
      return res.status(404).json({ error: 'Supplier not found' });
    }

    // Get supplier's products
    const supplierProducts = await db
      .select({
        id: products.id,
        name: products.name,
        sku: products.sku,
        category: products.category,
        price: products.price,
        currentStock: products.currentStock,
      })
      .from(products)
      .where(eq(products.supplierId, supplierId));

    res.json({
      ...supplier[0],
      products: supplierProducts,
    });
  } catch (error) {
    console.error('Error fetching supplier:', error);
    res.status(500).json({ error: 'Failed to fetch supplier' });
  }
});

// POST /api/suppliers - Create new supplier
router.post('/', async (req, res) => {
  try {
    const validatedData = supplierSchema.parse(req.body);
    
    const newSupplier = await db
      .insert(suppliers)
      .values(validatedData)
      .returning();

    res.status(201).json(newSupplier[0]);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ 
        error: 'Validation failed', 
        details: error.errors 
      });
    }
    
    console.error('Error creating supplier:', error);
    res.status(500).json({ error: 'Failed to create supplier' });
  }
});

// PUT /api/suppliers/:id - Update supplier
router.put('/:id', async (req, res) => {
  try {
    const supplierId = parseInt(req.params.id);
    const validatedData = supplierSchema.partial().parse(req.body);
    
    const updatedSupplier = await db
      .update(suppliers)
      .set({
        ...validatedData,
        updatedAt: new Date(),
      })
      .where(eq(suppliers.id, supplierId))
      .returning();

    if (updatedSupplier.length === 0) {
      return res.status(404).json({ error: 'Supplier not found' });
    }

    res.json(updatedSupplier[0]);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ 
        error: 'Validation failed', 
        details: error.errors 
      });
    }
    
    console.error('Error updating supplier:', error);
    res.status(500).json({ error: 'Failed to update supplier' });
  }
});

// DELETE /api/suppliers/:id - Delete supplier
router.delete('/:id', async (req, res) => {
  try {
    const supplierId = parseInt(req.params.id);
    
    // Check if supplier has products
    const supplierProducts = await db
      .select({ count: count() })
      .from(products)
      .where(eq(products.supplierId, supplierId));

    if (supplierProducts[0].count > 0) {
      return res.status(400).json({ 
        error: 'Cannot delete supplier with associated products. Please reassign or delete products first.' 
      });
    }
    
    const deletedSupplier = await db
      .delete(suppliers)
      .where(eq(suppliers.id, supplierId))
      .returning();

    if (deletedSupplier.length === 0) {
      return res.status(404).json({ error: 'Supplier not found' });
    }

    res.json({ message: 'Supplier deleted successfully' });
  } catch (error) {
    console.error('Error deleting supplier:', error);
    res.status(500).json({ error: 'Failed to delete supplier' });
  }
});

export default router;
