import { useState, useEffect } from 'react';
import { 
  FileText, 
  TrendingDown, 
  DollarSign, 
  Users,
  Package,
  AlertTriangle,
  Download
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { reportService } from '../services';
import toast from 'react-hot-toast';

const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];

function Reports() {
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({
    dashboard: null,
    inventoryValue: null,
    productsBySupplier: null,
    lowStock: null,
    salesSummary: null,
  });

  useEffect(() => {
    fetchReportsData();
  }, []);

  const fetchReportsData = async () => {
    try {
      setLoading(true);
      const [dashboard, inventoryValue, productsBySupplier, lowStock, salesSummary] = await Promise.all([
        reportService.getDashboard(),
        reportService.getInventoryValue(),
        reportService.getProductsBySupplier(),
        reportService.getLowStock(),
        reportService.getSalesSummary(30),
      ]);

      setData({
        dashboard: dashboard.data,
        inventoryValue: inventoryValue.data,
        productsBySupplier: productsBySupplier.data,
        lowStock: lowStock.data,
        salesSummary: salesSummary.data,
      });
    } catch (error) {
      console.error('Error fetching reports data:', error);
      toast.error('Failed to load reports data');
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: 'overview', name: 'Overview', icon: FileText },
    { id: 'inventory', name: 'Inventory Value', icon: DollarSign },
    { id: 'suppliers', name: 'By Supplier', icon: Users },
    { id: 'lowstock', name: 'Low Stock', icon: TrendingDown },
    { id: 'sales', name: 'Sales Report', icon: Package },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Reports & Analytics</h1>
        <p className="mt-2 text-sm text-gray-700">
          Insights and analysis of your inventory operations
        </p>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="-mb-px flex space-x-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`${
                activeTab === tab.id
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm flex items-center`}
            >
              <tab.icon className="h-4 w-4 mr-2" />
              {tab.name}
            </button>
          ))}
        </nav>
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            <div className="card">
              <div className="card-body">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <Package className="h-8 w-8 text-blue-500" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        Total Products
                      </dt>
                      <dd className="text-lg font-medium text-gray-900">
                        {data.dashboard?.totalProducts || 0}
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="card">
              <div className="card-body">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <Users className="h-8 w-8 text-green-500" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        Total Suppliers
                      </dt>
                      <dd className="text-lg font-medium text-gray-900">
                        {data.dashboard?.totalSuppliers || 0}
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="card">
              <div className="card-body">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <DollarSign className="h-8 w-8 text-purple-500" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        Inventory Value
                      </dt>
                      <dd className="text-lg font-medium text-gray-900">
                        ${(data.dashboard?.totalInventoryValue || 0).toFixed(2)}
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="card">
              <div className="card-body">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <TrendingDown className="h-8 w-8 text-red-500" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        Low Stock Items
                      </dt>
                      <dd className="text-lg font-medium text-gray-900">
                        {data.dashboard?.lowStockCount || 0}
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Suppliers Chart */}
            <div className="card">
              <div className="card-header">
                <h3 className="text-lg font-medium text-gray-900">Products by Supplier</h3>
              </div>
              <div className="card-body">
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={data.productsBySupplier?.slice(0, 5).map((supplier, index) => ({
                        name: supplier.supplier_name || 'No Supplier',
                        value: parseInt(supplier.product_count),
                        fill: COLORS[index % COLORS.length]
                      }))}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {data.productsBySupplier?.slice(0, 5).map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Sales Summary Chart */}
            <div className="card">
              <div className="card-header">
                <h3 className="text-lg font-medium text-gray-900">Sales Summary (Last 30 Days)</h3>
              </div>
              <div className="card-body">
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="text-center">
                    <p className="text-sm text-gray-500">Total Revenue</p>
                    <p className="text-xl font-bold text-green-600">
                      ${(data.salesSummary?.summary?.totalRevenue || 0).toFixed(2)}
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-gray-500">Units Sold</p>
                    <p className="text-xl font-bold text-blue-600">
                      {data.salesSummary?.summary?.totalSold || 0}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Inventory Value Tab */}
      {activeTab === 'inventory' && (
        <div className="space-y-6">
          <div className="card">
            <div className="card-header flex justify-between items-center">
              <h3 className="text-lg font-medium text-gray-900">Inventory Value Report</h3>
              <div className="text-2xl font-bold text-primary-600">
                Total: ${(data.inventoryValue?.totalInventoryValue || 0).toFixed(2)}
              </div>
            </div>
            <div className="card-body">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Product
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        SKU
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Stock
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Unit Price
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Total Value
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Supplier
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {data.inventoryValue?.products?.map((product) => (
                      <tr key={product.product_id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {product.product_name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {product.sku}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {product.current_stock}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          ${parseFloat(product.unit_price).toFixed(2)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          ${parseFloat(product.total_value).toFixed(2)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {product.supplier_name || 'N/A'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Suppliers Tab */}
      {activeTab === 'suppliers' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {data.productsBySupplier?.map((supplier) => (
              <div key={supplier.supplier_id} className="card">
                <div className="card-header">
                  <h3 className="text-lg font-medium text-gray-900">
                    {supplier.supplier_name || 'No Supplier'}
                  </h3>
                  {supplier.supplier_email && (
                    <p className="text-sm text-gray-500">{supplier.supplier_email}</p>
                  )}
                </div>
                <div className="card-body">
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">Products:</span>
                      <span className="text-sm font-medium">{supplier.product_count}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">Stock Value:</span>
                      <span className="text-sm font-medium">
                        ${parseFloat(supplier.total_stock_value || 0).toFixed(2)}
                      </span>
                    </div>
                  </div>
                  
                  {supplier.products && supplier.products.length > 0 && (
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <h4 className="text-sm font-medium text-gray-900 mb-2">Products:</h4>
                      <div className="space-y-1">
                        {supplier.products.slice(0, 3).map((product) => (
                          <div key={product.id} className="text-xs text-gray-600">
                            {product.name} - Stock: {product.currentStock}
                          </div>
                        ))}
                        {supplier.products.length > 3 && (
                          <div className="text-xs text-gray-500">
                            +{supplier.products.length - 3} more...
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Low Stock Tab */}
      {activeTab === 'lowstock' && (
        <div className="space-y-6">
          <div className="card">
            <div className="card-header">
              <h3 className="text-lg font-medium text-gray-900 flex items-center">
                <AlertTriangle className="h-5 w-5 text-red-500 mr-2" />
                Low Stock Alert ({data.lowStock?.count || 0} items)
              </h3>
            </div>
            <div className="card-body">
              {data.lowStock?.products?.length === 0 ? (
                <div className="text-center py-8">
                  <Package className="mx-auto h-12 w-12 text-green-400" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900">All products well stocked!</h3>
                  <p className="mt-1 text-sm text-gray-500">No products are running low on stock.</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Product
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          SKU
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Current Stock
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Min Level
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Supplier
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Action Needed
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {data.lowStock?.products?.map((product) => (
                        <tr key={product.id} className="hover:bg-red-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <AlertTriangle className="h-5 w-5 text-red-500 mr-3" />
                              <div className="text-sm font-medium text-gray-900">
                                {product.name}
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {product.sku}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="text-sm font-medium text-red-600">
                              {product.currentStock}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {product.minStockLevel}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {product.supplier?.name || 'N/A'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                              Reorder Required
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Sales Report Tab */}
      {activeTab === 'sales' && (
        <div className="space-y-6">
          <div className="card">
            <div className="card-header">
              <h3 className="text-lg font-medium text-gray-900">Sales Summary (Last 30 Days)</h3>
            </div>
            <div className="card-body">
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-6">
                <div className="text-center">
                  <p className="text-sm text-gray-500">Total Revenue</p>
                  <p className="text-2xl font-bold text-green-600">
                    ${(data.salesSummary?.summary?.totalRevenue || 0).toFixed(2)}
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-gray-500">Total Cost</p>
                  <p className="text-2xl font-bold text-red-600">
                    ${(data.salesSummary?.summary?.totalCost || 0).toFixed(2)}
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-gray-500">Units Sold</p>
                  <p className="text-2xl font-bold text-blue-600">
                    {data.salesSummary?.summary?.totalSold || 0}
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-gray-500">Units Purchased</p>
                  <p className="text-2xl font-bold text-purple-600">
                    {data.salesSummary?.summary?.totalPurchased || 0}
                  </p>
                </div>
              </div>
              
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Product
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        SKU
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Units Sold
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Sales Revenue
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Units Purchased
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Purchase Cost
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {data.salesSummary?.products?.map((product) => (
                      <tr key={product.product_id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {product.product_name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {product.sku}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {product.total_sold}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600 font-medium">
                          ${parseFloat(product.sales_revenue || 0).toFixed(2)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {product.total_purchased}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-red-600 font-medium">
                          ${parseFloat(product.purchase_cost || 0).toFixed(2)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Reports;
