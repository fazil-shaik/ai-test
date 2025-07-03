import { db } from '../src/models/database.js';
import { suppliers, products, transactions } from '../src/models/schema.js';

const sampleSuppliers = [
  {
    name: 'TechCorp Solutions',
    email: 'contact@techcorp.com',
    phone: '(555) 123-4567',
    address: '123 Tech Street, Silicon Valley, CA 94000'
  },
  {
    name: 'Global Electronics Ltd',
    email: 'sales@globalelectronics.com',
    phone: '(555) 987-6543',
    address: '456 Electronics Blvd, Austin, TX 78701'
  },
  {
    name: 'Innovative Hardware Inc',
    email: 'orders@innovativehw.com',
    phone: '(555) 456-7890',
    address: '789 Innovation Drive, Seattle, WA 98101'
  }
];

const sampleProducts = [
  {
    name: 'Wireless Bluetooth Headphones',
    description: 'High-quality wireless headphones with noise cancellation',
    sku: 'WBH-001',
    category: 'Electronics',
    price: '99.99',
    costPrice: '45.00',
    currentStock: 25,
    minStockLevel: 10,
    supplierId: 1
  },
  {
    name: 'USB-C Charging Cable',
    description: 'Fast charging USB-C cable, 6ft length',
    sku: 'USB-C-006',
    category: 'Accessories',
    price: '19.99',
    costPrice: '8.50',
    currentStock: 150,
    minStockLevel: 50,
    supplierId: 2
  },
  {
    name: 'Portable Power Bank',
    description: '10000mAh portable power bank with dual USB ports',
    sku: 'PPB-10K',
    category: 'Electronics',
    price: '39.99',
    costPrice: '18.00',
    currentStock: 8,
    minStockLevel: 15,
    supplierId: 1
  },
  {
    name: 'Wireless Mouse',
    description: 'Ergonomic wireless mouse with precision tracking',
    sku: 'WM-ERG-001',
    category: 'Computer Accessories',
    price: '29.99',
    costPrice: '12.00',
    currentStock: 45,
    minStockLevel: 20,
    supplierId: 3
  },
  {
    name: 'Mechanical Keyboard',
    description: 'RGB backlit mechanical keyboard with blue switches',
    sku: 'MK-RGB-BLUE',
    category: 'Computer Accessories',
    price: '129.99',
    costPrice: '65.00',
    currentStock: 5,
    minStockLevel: 10,
    supplierId: 3
  }
];

const sampleTransactions = [
  {
    productId: 1,
    type: 'purchase',
    quantity: 50,
    unitPrice: '45.00',
    totalAmount: '2250.00',
    notes: 'Initial stock purchase',
    transactionDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) // 30 days ago
  },
  {
    productId: 1,
    type: 'sale',
    quantity: 25,
    unitPrice: '99.99',
    totalAmount: '2499.75',
    notes: 'Bulk sale to corporate client',
    transactionDate: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000) // 15 days ago
  },
  {
    productId: 2,
    type: 'purchase',
    quantity: 200,
    unitPrice: '8.50',
    totalAmount: '1700.00',
    notes: 'Restocking cables',
    transactionDate: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000) // 25 days ago
  },
  {
    productId: 2,
    type: 'sale',
    quantity: 50,
    unitPrice: '19.99',
    totalAmount: '999.50',
    notes: 'Online store sales',
    transactionDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000) // 10 days ago
  },
  {
    productId: 3,
    type: 'purchase',
    quantity: 30,
    unitPrice: '18.00',
    totalAmount: '540.00',
    notes: 'Monthly inventory replenishment',
    transactionDate: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000) // 20 days ago
  },
  {
    productId: 3,
    type: 'sale',
    quantity: 22,
    unitPrice: '39.99',
    totalAmount: '879.78',
    notes: 'Retail store sales',
    transactionDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000) // 5 days ago
  }
];

async function seedDatabase() {
  try {
    console.log('Starting database seeding...');

    // Insert suppliers
    console.log('Inserting suppliers...');
    const insertedSuppliers = await db.insert(suppliers).values(sampleSuppliers).returning();
    console.log(`Inserted ${insertedSuppliers.length} suppliers`);

    // Insert products (update supplier IDs to match inserted suppliers)
    console.log('Inserting products...');
    const productsWithSupplierIds = sampleProducts.map((product, index) => ({
      ...product,
      supplierId: insertedSuppliers[product.supplierId - 1]?.id || null
    }));
    
    const insertedProducts = await db.insert(products).values(productsWithSupplierIds).returning();
    console.log(`Inserted ${insertedProducts.length} products`);

    // Insert transactions (update product IDs to match inserted products)
    console.log('Inserting transactions...');
    const transactionsWithProductIds = sampleTransactions.map(transaction => ({
      ...transaction,
      productId: insertedProducts[transaction.productId - 1]?.id || 1
    }));
    
    const insertedTransactions = await db.insert(transactions).values(transactionsWithProductIds).returning();
    console.log(`Inserted ${insertedTransactions.length} transactions`);

    console.log('Database seeding completed successfully!');
    console.log('\\nSample data includes:');
    console.log('- 3 suppliers (TechCorp Solutions, Global Electronics Ltd, Innovative Hardware Inc)');
    console.log('- 5 products (various electronics and accessories)');
    console.log('- 6 transactions (mix of purchases and sales)');
    console.log('- Some products are intentionally set to low stock for testing alerts');
    
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}

// Run the seed function
seedDatabase();
