import api from './api';

export const productService = {
  // Get all products
  getAll: () => api.get('/products'),
  
  // Get single product
  getById: (id) => api.get(`/products/${id}`),
  
  // Get low stock products
  getLowStock: () => api.get('/products/low-stock'),
  
  // Create new product
  create: (productData) => api.post('/products', productData),
  
  // Update product
  update: (id, productData) => api.put(`/products/${id}`, productData),
  
  // Delete product
  delete: (id) => api.delete(`/products/${id}`),
};

export const supplierService = {
  // Get all suppliers
  getAll: () => api.get('/suppliers'),
  
  // Get single supplier
  getById: (id) => api.get(`/suppliers/${id}`),
  
  // Create new supplier
  create: (supplierData) => api.post('/suppliers', supplierData),
  
  // Update supplier
  update: (id, supplierData) => api.put(`/suppliers/${id}`, supplierData),
  
  // Delete supplier
  delete: (id) => api.delete(`/suppliers/${id}`),
};

export const transactionService = {
  // Get all transactions
  getAll: (params = {}) => api.get('/transactions', { params }),
  
  // Get single transaction
  getById: (id) => api.get(`/transactions/${id}`),
  
  // Get recent transactions
  getRecent: () => api.get('/transactions/recent'),
  
  // Create new transaction
  create: (transactionData) => api.post('/transactions', transactionData),
  
  // Delete transaction
  delete: (id) => api.delete(`/transactions/${id}`),
};

export const reportService = {
  // Get dashboard data
  getDashboard: () => api.get('/reports/dashboard'),
  
  // Get inventory value report
  getInventoryValue: () => api.get('/reports/inventory-value'),
  
  // Get products by supplier report
  getProductsBySupplier: () => api.get('/reports/products-by-supplier'),
  
  // Get low stock report
  getLowStock: () => api.get('/reports/low-stock'),
  
  // Get sales summary
  getSalesSummary: (days = 30) => api.get(`/reports/sales-summary?days=${days}`),
  
  // Get transaction trends
  getTransactionTrends: (days = 30) => api.get(`/reports/transaction-trends?days=${days}`),
};
