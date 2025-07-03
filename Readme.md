# Mini ERP Inventory Management System

A full-stack ERP inventory management system built for small-scale retail businesses to track products, suppliers, and sales transactions.

## 🚀 Tech Stack

- **Frontend**: React.js with TailwindCSS, Vite
- **Backend**: Node.js + Express.js
- **Database**: PostgreSQL with Drizzle ORM (Neon DB)
- **Deployment**: Vercel
- **Icons**: Lucide React
- **Charts**: Recharts

## 📋 Features Implemented

Based on the assignment requirements:

### Part 1: Frontend (UI/UX) ✅
- **Dashboard**: Product counts, stock alerts, inventory overview, recent transactions
- **Products Page**: Add, update, delete products with supplier association and stock management
- **Suppliers Page**: Manage suppliers and link them to products
- **Transactions Page**: Record purchases and sales with automatic inventory updates
- **Reports Page**: Comprehensive analytics and reporting
- **Responsive Design**: TailwindCSS for modern, mobile-friendly UI

### Part 2: Backend & Database ✅
- **CRUD Operations**: Full create, read, update, delete functionality for all entities
- **Data Relationships**: Products linked to suppliers, transactions update inventory automatically
- **Validations**: Input validation using Zod schema validation
- **Reports System**:
  - Products running low on stock with alerts
  - Total value of inventory calculation
  - Products grouped by supplier with detailed analytics
  - Transaction history and sales analytics
  - Dashboard summary statistics

### Part 3: DevOps & Deployment ✅
- **Vercel Deployment**: Ready for frontend and API deployment
- **Public Access**: No authentication required for evaluation
- **Environment Configuration**: Separate dev/prod environments
- **Database**: Neon PostgreSQL with Drizzle ORM for scalability

## 🛠️ Setup Instructions

### Prerequisites
- Node.js (v18+)
- npm or yarn
- Neon DB account (free tier available)

### Quick Start

1. **Clone and install dependencies**
   ```bash
   git clone <repository-url>
   cd ai-purple
   npm run install:all
   ```

2. **Setup environment variables**
   
   Create `server/.env` file:
   ```env
   DATABASE_URL=your_neon_database_connection_string
   PORT=5000
   NODE_ENV=development
   ```

   Create `client/.env.local` file:
   ```env
   VITE_API_URL=http://localhost:5000/api
   ```

3. **Initialize database**
   ```bash
   npm run db:push
   ```

4. **Seed sample data (optional)**
   ```bash
   npm run db:seed
   ```

5. **Start development servers**
   ```bash
   npm run dev
   ```

   The application will be available at:
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000

## 📁 Project Structure
```
ai-purple/
├── client/                 # React frontend (Vite)
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/         # Main page components
│   │   ├── services/      # API service layer
│   │   └── index.css      # TailwindCSS styles
│   ├── package.json
│   └── vite.config.js
├── server/                # Express backend
│   ├── src/
│   │   ├── routes/        # API routes (products, suppliers, transactions, reports)
│   │   ├── models/        # Database schema (Drizzle ORM)
│   │   └── index.js       # Express app setup
│   ├── scripts/
│   │   └── seed.js        # Sample data seeding
│   ├── drizzle.config.js  # Drizzle configuration
│   └── package.json
├── vercel.json            # Vercel deployment config
├── package.json           # Root package with scripts
└── README.md             # This file
```

## 🔗 API Endpoints

### Products
- `GET /api/products` - Get all products with supplier info
- `POST /api/products` - Create new product
- `PUT /api/products/:id` - Update product
- `DELETE /api/products/:id` - Delete product
- `GET /api/products/low-stock` - Get low stock products

### Suppliers
- `GET /api/suppliers` - Get all suppliers with product count
- `POST /api/suppliers` - Create new supplier
- `PUT /api/suppliers/:id` - Update supplier
- `DELETE /api/suppliers/:id` - Delete supplier
- `GET /api/suppliers/:id` - Get supplier with products

### Transactions
- `GET /api/transactions` - Get all transactions with filtering
- `POST /api/transactions` - Create new transaction (auto-updates inventory)
- `DELETE /api/transactions/:id` - Delete transaction (reverts stock changes)
- `GET /api/transactions/recent` - Get recent transactions

### Reports
- `GET /api/reports/dashboard` - Dashboard summary statistics
- `GET /api/reports/inventory-value` - Total inventory value breakdown
- `GET /api/reports/products-by-supplier` - Products grouped by supplier
- `GET /api/reports/low-stock` - Low stock alert report
- `GET /api/reports/sales-summary` - Sales performance analysis
- `GET /api/reports/transaction-trends` - Transaction trends over time

## 🎯 Assignment Completion Status

✅ **All Core Requirements Met**
- 4 main pages (Dashboard, Products, Suppliers, Transactions) + Reports
- Full CRUD operations with proper data relationships
- Stock management with automatic updates on transactions
- Reporting features for low stock, inventory value, and supplier analysis
- Modern React.js frontend with TailwindCSS
- Node.js + Express.js backend with PostgreSQL
- Vercel deployment configuration
- Comprehensive documentation

🎁 **Bonus Features Implemented**
- **Advanced Reporting**: Multiple report types with charts and analytics
- **Real-time Stock Updates**: Transactions automatically update inventory levels
- **Low Stock Alerts**: Dashboard warnings for products below minimum levels
- **Responsive Design**: Mobile-friendly interface
- **Data Validation**: Comprehensive input validation and error handling
- **Sample Data**: Seed script with realistic sample data
- **Charts & Visualizations**: Using Recharts for data visualization
- **Transaction Management**: Ability to reverse transactions with stock adjustments
- **Search & Filtering**: Filter transactions by type, search products

## 🚀 Deployment to Vercel

1. **Prepare for deployment**
   ```bash
   # Build the client
   npm run build
   ```

2. **Deploy to Vercel**
   - Connect your GitHub repository to Vercel
   - Set environment variables in Vercel dashboard:
     - `DATABASE_URL`: Your Neon DB connection string
     - `NODE_ENV`: production
   - Deploy automatically triggers on git push

3. **Database Setup**
   ```bash
   # Push schema to production database
   npm run db:push
   
   # Optional: Seed production data
   npm run db:seed
   ```

## 💡 Key Features Highlights

- **Inventory Tracking**: Real-time stock levels with automatic updates
- **Low Stock Alerts**: Visual warnings when products fall below minimum levels
- **Supplier Management**: Complete supplier database with product associations
- **Transaction History**: Full audit trail of all inventory movements
- **Comprehensive Reports**: Multiple report types for business insights
- **Modern UI**: Clean, responsive design with TailwindCSS
- **Data Validation**: Robust input validation and error handling
- **Sample Data**: Pre-loaded with realistic sample data for testing

## 🎯 Future Enhancements (Roadmap)

- **AI Integration**: Product reorder quantity suggestions based on sales patterns
- **Barcode Scanning**: Mobile barcode scanning for inventory management
- **Multi-location Support**: Track inventory across multiple warehouses
- **Advanced Analytics**: Profit margin analysis, seasonal trends
- **User Authentication**: Role-based access control
- **Integration APIs**: Connect with popular e-commerce platforms
- **Automated Notifications**: Email/SMS alerts for low stock
- **Export Functionality**: PDF/Excel export for reports

## 📝 License

MIT License - feel free to use this project for learning and development purposes.

## 🤝 Contributing

This project was built as a technical assessment demonstrating full-stack development capabilities. Contributions and feedback are welcome!

Assignment Overview: “Build Your Mini ERP Lite Module”
You are tasked to build a Mini Inventory Management System for a fictional small-scale retail business.
This app will help the business track basic product inventory, suppliers, and sales. The module should be
intuitive, usable, and functional.

Part 1: Front-End (UI/UX)
Objective: Design a user-friendly web app UI (or mobile UI, if using Flutter)
• Create 3–4 pages:
o Dashboard: Basic overview with product counts and stock alerts
o Products Page: Add, update, delete products
o Suppliers Page: Add suppliers and associate them with products
o Transactions Page: Record product purchases or sales

Tech stack (pick any one):
• React.js / Next.js / Flutter / Frappe Framework (if experienced)
• Use TailwindCSS or Bootstrap for styling (if applicable)

Part 2: Back-End Logic & Database
Objective: Demonstrate CRUD operations and data linking logic
• Backend in Node.js + Express.js, Django, Python Flask, or Frappe framework
• Store data in MongoDB / PostgreSQL / MariaDB / SQLite
• Basic validations and input checks
• Ability to fetch reports like:
o Products running low on stock

o Total value of inventory
o Products by supplier

Part 3: DevOps & Deployment
Objective: Show readiness for real-world deployment environments
• Host your app on Vercel / Heroku / Railway / Replit / Render / Frappe Cloud (pick any)
• Ensure basic public accessibility (no login required for evaluation)
• Add a README.md with setup instructions and stack used

Bonus (Optional but Strongly Considered for PPO)
Choose any one of the following bonus tasks to stand out:
1. AI Integration (Mini):
Integrate an AI API (OpenAI/Gemini/Hugging Face) to suggest product reorder quantities based on
current stock and transaction history.
2. ERPNext Readiness Test:
Research and explain (in a short Loom/YouTube/OBS video) how your current app structure could
be adapted or integrated into an ERP system like ERPNext.