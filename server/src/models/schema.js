import { pgTable, serial, varchar, text, integer, decimal, timestamp, boolean } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// Users table
export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  email: varchar('email', { length: 100 }).unique().notNull(),
  password: varchar('password', { length: 255 }).notNull(),
  firstName: varchar('first_name', { length: 50 }).notNull(),
  lastName: varchar('last_name', { length: 50 }).notNull(),
  role: varchar('role', { length: 20 }).default('user'), // 'admin' or 'user'
  isActive: boolean('is_active').default(true),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// Suppliers table
export const suppliers = pgTable('suppliers', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 100 }).notNull(),
  email: varchar('email', { length: 100 }),
  phone: varchar('phone', { length: 20 }),
  address: text('address'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// Products table
export const products = pgTable('products', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 100 }).notNull(),
  description: text('description'),
  sku: varchar('sku', { length: 50 }).unique().notNull(),
  category: varchar('category', { length: 50 }),
  price: decimal('price', { precision: 10, scale: 2 }).notNull(),
  costPrice: decimal('cost_price', { precision: 10, scale: 2 }),
  currentStock: integer('current_stock').default(0),
  minStockLevel: integer('min_stock_level').default(10),
  supplierId: integer('supplier_id').references(() => suppliers.id),
  isActive: boolean('is_active').default(true),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// Transactions table
export const transactions = pgTable('transactions', {
  id: serial('id').primaryKey(),
  productId: integer('product_id').references(() => products.id).notNull(),
  type: varchar('type', { length: 20 }).notNull(), // 'purchase' or 'sale'
  quantity: integer('quantity').notNull(),
  unitPrice: decimal('unit_price', { precision: 10, scale: 2 }).notNull(),
  totalAmount: decimal('total_amount', { precision: 10, scale: 2 }).notNull(),
  notes: text('notes'),
  transactionDate: timestamp('transaction_date').defaultNow(),
  createdAt: timestamp('created_at').defaultNow(),
});

// Relations
export const suppliersRelations = relations(suppliers, ({ many }) => ({
  products: many(products),
}));

export const productsRelations = relations(products, ({ one, many }) => ({
  supplier: one(suppliers, {
    fields: [products.supplierId],
    references: [suppliers.id],
  }),
  transactions: many(transactions),
}));

export const transactionsRelations = relations(transactions, ({ one }) => ({
  product: one(products, {
    fields: [transactions.productId],
    references: [products.id],
  }),
}));

export const usersRelations = relations(users, ({ many }) => ({
  // Add relations as needed
}));
