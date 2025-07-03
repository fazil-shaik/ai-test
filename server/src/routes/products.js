import express from 'express';
import { eq, desc, sql } from 'drizzle-orm';
import { db } from '../models/database.js';
import { products, suppliers } from '../models/schema.js';
import { z } from 'zod';

const router = express.Router();

// Validation schemas
const productSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().optional(),
  sku: z.string().min(1, 'SKU is required'),
  category: z.string().optional(),
  price: z.string().refine((val) => !isNaN(parseFloat(val)) && parseFloat(val) > 0, 'Price must be a positive number'),
  costPrice: z.string().optional(),
  currentStock: z.number().int().min(0, 'Stock cannot be negative').optional(),
  minStockLevel: z.number().int().min(0, 'Minimum stock level cannot be negative').optional(),
  supplierId: z.number().int().positive().optional(),
});

// GET /api/products - Get all products with supplier info
router.get('/', async (req, res) => {
  try {
    const allProducts = await db
      .select({
        id: products.id,
        name: products.name,
        description: products.description,
        sku: products.sku,
        category: products.category,
        price: products.price,
        costPrice: products.costPrice,
        currentStock: products.currentStock,
        minStockLevel: products.minStockLevel,
        isActive: products.isActive,
        createdAt: products.createdAt,
        updatedAt: products.updatedAt,
        supplier: {
          id: suppliers.id,
          name: suppliers.name,
          email: suppliers.email,
        }
      })
      .from(products)
      .leftJoin(suppliers, eq(products.supplierId, suppliers.id))
      .orderBy(desc(products.createdAt));

    res.json(allProducts);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});

// GET /api/products/low-stock - Get products with low stock
router.get('/low-stock', async (req, res) => {
  try {
    const lowStockProducts = await db
      .select({
        id: products.id,
        name: products.name,
        sku: products.sku,
        currentStock: products.currentStock,
        minStockLevel: products.minStockLevel,
        supplier: {
          id: suppliers.id,
          name: suppliers.name,
        }
      })
      .from(products)
      .leftJoin(suppliers, eq(products.supplierId, suppliers.id))
      .where(sql`${products.currentStock} <= ${products.minStockLevel}`)
      .orderBy(products.currentStock);

    res.json(lowStockProducts);
  } catch (error) {
    console.error('Error fetching low stock products:', error);
    res.status(500).json({ error: 'Failed to fetch low stock products' });
  }
});

// GET /api/products/:id - Get single product
router.get('/:id', async (req, res) => {
  try {
    const productId = parseInt(req.params.id);
    const product = await db
      .select({
        id: products.id,
        name: products.name,
        description: products.description,
        sku: products.sku,
        category: products.category,
        price: products.price,
        costPrice: products.costPrice,
        currentStock: products.currentStock,
        minStockLevel: products.minStockLevel,
        isActive: products.isActive,
        createdAt: products.createdAt,
        updatedAt: products.updatedAt,
        supplier: {
          id: suppliers.id,
          name: suppliers.name,
          email: suppliers.email,
        }
      })
      .from(products)
      .leftJoin(suppliers, eq(products.supplierId, suppliers.id))
      .where(eq(products.id, productId))
      .limit(1);

    if (product.length === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }

    res.json(product[0]);
  } catch (error) {
    console.error('Error fetching product:', error);
    res.status(500).json({ error: 'Failed to fetch product' });
  }
});

// POST /api/products - Create new product
router.post('/', async (req, res) => {
  try {
    const validatedData = productSchema.parse(req.body);
    
    const newProduct = await db
      .insert(products)
      .values({
        ...validatedData,
        price: validatedData.price,
        costPrice: validatedData.costPrice || null,
        currentStock: validatedData.currentStock || 0,
        minStockLevel: validatedData.minStockLevel || 10,
        supplierId: validatedData.supplierId || null,
      })
      .returning();

    res.status(201).json(newProduct[0]);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ 
        error: 'Validation failed', 
        details: error.errors 
      });
    }
    
    console.error('Error creating product:', error);
    if (error.code === '23505') { // Unique constraint violation
      return res.status(409).json({ error: 'SKU already exists' });
    }
    res.status(500).json({ error: 'Failed to create product' });
  }
});

// PUT /api/products/:id - Update product
router.put('/:id', async (req, res) => {
  try {
    const productId = parseInt(req.params.id);
    const validatedData = productSchema.partial().parse(req.body);
    
    const updatedProduct = await db
      .update(products)
      .set({
        ...validatedData,
        updatedAt: new Date(),
      })
      .where(eq(products.id, productId))
      .returning();

    if (updatedProduct.length === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }

    res.json(updatedProduct[0]);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ 
        error: 'Validation failed', 
        details: error.errors 
      });
    }
    
    console.error('Error updating product:', error);
    res.status(500).json({ error: 'Failed to update product' });
  }
});

// DELETE /api/products/:id - Delete product
router.delete('/:id', async (req, res) => {
  try {
    const productId = parseInt(req.params.id);
    
    const deletedProduct = await db
      .delete(products)
      .where(eq(products.id, productId))
      .returning();

    if (deletedProduct.length === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }

    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).json({ error: 'Failed to delete product' });
  }
});

export default router;
