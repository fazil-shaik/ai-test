# API Documentation

## Base URL
```
Development: http://localhost:3001/api
Production: https://your-domain.vercel.app/api
```

## Authentication
All protected endpoints require a Bearer token in the Authorization header:
```
Authorization: Bearer <your-jwt-token>
```

## Endpoints

### Authentication
- `POST /auth/register` - Register new user
- `POST /auth/login` - User login
- `GET /auth/profile` - Get user profile (protected)
- `POST /auth/logout` - User logout

### Products
- `GET /products` - List all products
- `POST /products` - Create new product
- `GET /products/:id` - Get product by ID
- `PUT /products/:id` - Update product
- `DELETE /products/:id` - Delete product

### Suppliers
- `GET /suppliers` - List all suppliers
- `POST /suppliers` - Create new supplier
- `GET /suppliers/:id` - Get supplier by ID
- `PUT /suppliers/:id` - Update supplier
- `DELETE /suppliers/:id` - Delete supplier

### Transactions
- `GET /transactions` - List all transactions
- `POST /transactions` - Create new transaction
- `GET /transactions/:id` - Get transaction by ID
- `PUT /transactions/:id` - Update transaction
- `DELETE /transactions/:id` - Delete transaction

### Reports
- `GET /reports/dashboard` - Dashboard summary
- `GET /reports/inventory-value` - Inventory value report
- `GET /reports/products-by-supplier` - Products grouped by supplier
- `GET /reports/low-stock` - Low stock products
- `GET /reports/sales-summary` - Sales summary report
- `GET /reports/transaction-trends` - Transaction trends

## Request/Response Examples

### Register User
```json
POST /auth/register
{
  "email": "user@example.com",
  "password": "password123",
  "firstName": "John",
  "lastName": "Doe"
}
```

### Create Product
```json
POST /products
{
  "name": "Wireless Headphones",
  "description": "High-quality Bluetooth headphones",
  "sku": "WH-001",
  "category": "Electronics",
  "price": 99.99,
  "costPrice": 50.00,
  "currentStock": 100,
  "minStockLevel": 10,
  "supplierId": 1
}
```

### Error Responses
```json
{
  "error": "Error message",
  "details": "Additional error details"
}
```

## Status Codes
- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `500` - Internal Server Error
