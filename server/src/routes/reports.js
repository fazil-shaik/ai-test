import express from 'express';
import { eq, sql, sum, count, desc } from 'drizzle-orm';
import { db } from '../models/database.js';
import { products, suppliers, transactions } from '../models/schema.js';

const router = express.Router();

// GET /api/reports/dashboard - Dashboard summary
router.get('/dashboard', async (req, res) => {
  try {
    // Get total products count
    const totalProducts = await db
      .select({ count: count() })
      .from(products);

    // Get total suppliers count
    const totalSuppliers = await db
      .select({ count: count() })
      .from(suppliers);

    // Get low stock products count
    const lowStockCount = await db
      .select({ count: count() })
      .from(products)
      .where(sql`${products.currentStock} <= ${products.minStockLevel}`);

    // Get total inventory value
    const inventoryValue = await db
      .select({ 
        totalValue: sql`COALESCE(SUM(${products.currentStock} * ${products.price}), 0)` 
      })
      .from(products);

    // Get recent transactions count (last 7 days)
    const recentTransactionsCount = await db
      .select({ count: count() })
      .from(transactions)
      .where(sql`${transactions.transactionDate} >= NOW() - INTERVAL '7 days'`);

    res.json({
      totalProducts: totalProducts[0].count,
      totalSuppliers: totalSuppliers[0].count,
      lowStockCount: lowStockCount[0].count,
      totalInventoryValue: parseFloat(inventoryValue[0].totalValue || 0),
      recentTransactionsCount: recentTransactionsCount[0].count,
    });
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    res.status(500).json({ error: 'Failed to fetch dashboard data' });
  }
});

// GET /api/reports/inventory-value - Total inventory value
router.get('/inventory-value', async (req, res) => {
  try {
    const inventoryValue = await db
      .select({
        product_id: products.id,
        product_name: products.name,
        sku: products.sku,
        current_stock: products.currentStock,
        unit_price: products.price,
        total_value: sql`${products.currentStock} * ${products.price}`,
        supplier_name: suppliers.name,
      })
      .from(products)
      .leftJoin(suppliers, eq(products.supplierId, suppliers.id))
      .where(sql`${products.currentStock} > 0`)
      .orderBy(desc(sql`${products.currentStock} * ${products.price}`));

    // Calculate total
    const totalValue = inventoryValue.reduce((sum, item) => {
      return sum + parseFloat(item.total_value || 0);
    }, 0);

    res.json({
      totalInventoryValue: totalValue,
      products: inventoryValue,
    });
  } catch (error) {
    console.error('Error fetching inventory value:', error);
    res.status(500).json({ error: 'Failed to fetch inventory value' });
  }
});

// GET /api/reports/products-by-supplier - Products grouped by supplier
router.get('/products-by-supplier', async (req, res) => {
  try {
    const productsBySupplier = await db
      .select({
        supplier_id: suppliers.id,
        supplier_name: suppliers.name,
        supplier_email: suppliers.email,
        product_count: count(products.id),
        total_stock_value: sql`COALESCE(SUM(${products.currentStock} * ${products.price}), 0)`,
      })
      .from(suppliers)
      .leftJoin(products, eq(suppliers.id, products.supplierId))
      .groupBy(suppliers.id, suppliers.name, suppliers.email)
      .orderBy(desc(count(products.id)));

    // Get detailed products for each supplier
    const detailedReport = await Promise.all(
      productsBySupplier.map(async (supplier) => {
        const supplierProducts = await db
          .select({
            id: products.id,
            name: products.name,
            sku: products.sku,
            category: products.category,
            currentStock: products.currentStock,
            price: products.price,
            stockValue: sql`${products.currentStock} * ${products.price}`,
          })
          .from(products)
          .where(eq(products.supplierId, supplier.supplier_id));

        return {
          ...supplier,
          products: supplierProducts,
        };
      })
    );

    res.json(detailedReport);
  } catch (error) {
    console.error('Error fetching products by supplier:', error);
    res.status(500).json({ error: 'Failed to fetch products by supplier' });
  }
});

// GET /api/reports/low-stock - Products running low on stock
router.get('/low-stock', async (req, res) => {
  try {
    const lowStockProducts = await db
      .select({
        id: products.id,
        name: products.name,
        sku: products.sku,
        category: products.category,
        currentStock: products.currentStock,
        minStockLevel: products.minStockLevel,
        price: products.price,
        supplier: {
          id: suppliers.id,
          name: suppliers.name,
          email: suppliers.email,
          phone: suppliers.phone,
        }
      })
      .from(products)
      .leftJoin(suppliers, eq(products.supplierId, suppliers.id))
      .where(sql`${products.currentStock} <= ${products.minStockLevel}`)
      .orderBy(sql`${products.currentStock} - ${products.minStockLevel}`);

    res.json({
      count: lowStockProducts.length,
      products: lowStockProducts,
    });
  } catch (error) {
    console.error('Error fetching low stock products:', error);
    res.status(500).json({ error: 'Failed to fetch low stock products' });
  }
});

// GET /api/reports/sales-summary - Sales summary report
router.get('/sales-summary', async (req, res) => {
  try {
    const { days = 30 } = req.query;
    const daysNumber = parseInt(days);
    
    const salesSummary = await db
      .select({
        product_id: products.id,
        product_name: products.name,
        sku: products.sku,
        total_sold: sql`COALESCE(SUM(CASE WHEN ${transactions.type} = 'sale' THEN ${transactions.quantity} ELSE 0 END), 0)`,
        total_purchased: sql`COALESCE(SUM(CASE WHEN ${transactions.type} = 'purchase' THEN ${transactions.quantity} ELSE 0 END), 0)`,
        sales_revenue: sql`COALESCE(SUM(CASE WHEN ${transactions.type} = 'sale' THEN ${transactions.totalAmount} ELSE 0 END), 0)`,
        purchase_cost: sql`COALESCE(SUM(CASE WHEN ${transactions.type} = 'purchase' THEN ${transactions.totalAmount} ELSE 0 END), 0)`,
      })
      .from(products)
      .leftJoin(transactions, eq(products.id, transactions.productId))
      .where(sql`${transactions.transactionDate} >= NOW() - INTERVAL '${sql.raw(daysNumber.toString())} days' OR ${transactions.transactionDate} IS NULL`)
      .groupBy(products.id, products.name, products.sku)
      .orderBy(desc(sql`COALESCE(SUM(CASE WHEN ${transactions.type} = 'sale' THEN ${transactions.totalAmount} ELSE 0 END), 0)`));

    // Calculate totals
    const totals = salesSummary.reduce((acc, item) => ({
      totalSold: acc.totalSold + parseInt(item.total_sold || 0),
      totalPurchased: acc.totalPurchased + parseInt(item.total_purchased || 0),
      totalRevenue: acc.totalRevenue + parseFloat(item.sales_revenue || 0),
      totalCost: acc.totalCost + parseFloat(item.purchase_cost || 0),
    }), { totalSold: 0, totalPurchased: 0, totalRevenue: 0, totalCost: 0 });

    res.json({
      period: `Last ${days} days`,
      summary: totals,
      products: salesSummary,
    });
  } catch (error) {
    console.error('Error fetching sales summary:', error);
    res.status(500).json({ error: 'Failed to fetch sales summary' });
  }
});

// GET /api/reports/transaction-trends - Transaction trends over time
router.get('/transaction-trends', async (req, res) => {
  try {
    const { days = 30 } = req.query;
    const daysNumber = parseInt(days);
    
    const trends = await db
      .select({
        date: sql`DATE(${transactions.transactionDate})`,
        sales_count: sql`COUNT(CASE WHEN ${transactions.type} = 'sale' THEN 1 END)`,
        purchase_count: sql`COUNT(CASE WHEN ${transactions.type} = 'purchase' THEN 1 END)`,
        sales_amount: sql`COALESCE(SUM(CASE WHEN ${transactions.type} = 'sale' THEN ${transactions.totalAmount} ELSE 0 END), 0)`,
        purchase_amount: sql`COALESCE(SUM(CASE WHEN ${transactions.type} = 'purchase' THEN ${transactions.totalAmount} ELSE 0 END), 0)`,
      })
      .from(transactions)
      .where(sql`${transactions.transactionDate} >= NOW() - INTERVAL '${sql.raw(daysNumber.toString())} days'`)
      .groupBy(sql`DATE(${transactions.transactionDate})`)
      .orderBy(sql`DATE(${transactions.transactionDate})`);

    res.json({
      period: `Last ${days} days`,
      trends,
    });
  } catch (error) {
    console.error('Error fetching transaction trends:', error);
    res.status(500).json({ error: 'Failed to fetch transaction trends' });
  }
});

export default router;
