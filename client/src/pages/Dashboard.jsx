import { useEffect, useState } from 'react';
import { 
  Package, 
  Users, 
  TrendingDown, 
  DollarSign,
  ArrowUpDown,
  AlertTriangle,
  FileText
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { reportService, transactionService } from '../services';
import toast from 'react-hot-toast';

function Dashboard() {
  const [dashboardData, setDashboardData] = useState(null);
  const [recentTransactions, setRecentTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [dashboardResponse, transactionsResponse] = await Promise.all([
        reportService.getDashboard(),
        transactionService.getRecent()
      ]);
      
      setDashboardData(dashboardResponse.data);
      setRecentTransactions(transactionsResponse.data);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const statsCards = [
    {
      name: 'Total Products',
      value: dashboardData?.totalProducts || 0,
      icon: Package,
      color: 'bg-blue-500',
    },
    {
      name: 'Total Suppliers',
      value: dashboardData?.totalSuppliers || 0,
      icon: Users,
      color: 'bg-green-500',
    },
    {
      name: 'Low Stock Items',
      value: dashboardData?.lowStockCount || 0,
      icon: TrendingDown,
      color: 'bg-red-500',
    },
    {
      name: 'Inventory Value',
      value: `$${(dashboardData?.totalInventoryValue || 0).toFixed(2)}`,
      icon: DollarSign,
      color: 'bg-purple-500',
    },
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
      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        {statsCards.map((stat) => (
          <div key={stat.name} className="card">
            <div className="card-body">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className={`p-3 rounded-md ${stat.color}`}>
                    <stat.icon className="h-6 w-6 text-white" />
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      {stat.name}
                    </dt>
                    <dd className="text-lg font-medium text-gray-900">
                      {stat.value}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Transactions */}
        <div className="card">
          <div className="card-header">
            <h3 className="text-lg font-medium text-gray-900 flex items-center">
              <ArrowUpDown className="h-5 w-5 mr-2" />
              Recent Transactions
            </h3>
          </div>
          <div className="card-body">
            {recentTransactions.length === 0 ? (
              <p className="text-gray-500 text-center py-4">No recent transactions</p>
            ) : (
              <div className="space-y-3">
                {recentTransactions.map((transaction) => (
                  <div key={transaction.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center">
                      <div className={`p-2 rounded-md ${
                        transaction.type === 'purchase' ? 'bg-green-100' : 'bg-blue-100'
                      }`}>
                        <ArrowUpDown className={`h-4 w-4 ${
                          transaction.type === 'purchase' ? 'text-green-600' : 'text-blue-600'
                        }`} />
                      </div>
                      <div className="ml-3">
                        <p className="text-sm font-medium text-gray-900">
                          {transaction.product?.name}
                        </p>
                        <p className="text-sm text-gray-500">
                          {transaction.type} • {transaction.quantity} units
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-gray-900">
                        ${parseFloat(transaction.totalAmount).toFixed(2)}
                      </p>
                      <p className="text-xs text-gray-500">
                        {new Date(transaction.transactionDate).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Low Stock Alert */}
        {dashboardData?.lowStockCount > 0 && (
          <div className="card">
            <div className="card-header">
              <h3 className="text-lg font-medium text-gray-900 flex items-center">
                <AlertTriangle className="h-5 w-5 mr-2 text-red-500" />
                Stock Alerts
              </h3>
            </div>
            <div className="card-body">
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <AlertTriangle className="h-5 w-5 text-red-400" />
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-red-800">
                      Low Stock Warning
                    </h3>
                    <div className="mt-2 text-sm text-red-700">
                      <p>
                        You have {dashboardData.lowStockCount} product(s) running low on stock.
                      </p>
                    </div>
                    <div className="mt-4">
                      <div className="-mx-2 -my-1.5 flex">
                        <button
                          type="button"
                          className="bg-red-50 px-2 py-1.5 rounded-md text-sm font-medium text-red-800 hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                          onClick={() => window.location.href = '/reports'}
                        >
                          View Details
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Quick Actions */}
        <div className="card lg:col-span-2">
          <div className="card-header">
            <h3 className="text-lg font-medium text-gray-900">Quick Actions</h3>
          </div>
          <div className="card-body">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <button
                onClick={() => window.location.href = '/products'}
                className="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <Package className="h-8 w-8 text-blue-500 mb-2" />
                <span className="text-sm font-medium text-gray-900">Add Product</span>
              </button>
              <button
                onClick={() => window.location.href = '/suppliers'}
                className="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <Users className="h-8 w-8 text-green-500 mb-2" />
                <span className="text-sm font-medium text-gray-900">Add Supplier</span>
              </button>
              <button
                onClick={() => window.location.href = '/transactions'}
                className="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <ArrowUpDown className="h-8 w-8 text-purple-500 mb-2" />
                <span className="text-sm font-medium text-gray-900">New Transaction</span>
              </button>
              <button
                onClick={() => window.location.href = '/reports'}
                className="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <FileText className="h-8 w-8 text-orange-500 mb-2" />
                <span className="text-sm font-medium text-gray-900">View Reports</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
