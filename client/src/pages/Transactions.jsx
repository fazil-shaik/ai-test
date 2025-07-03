import { useState, useEffect } from 'react';
import { Plus, ArrowUpDown, Trash2, ShoppingCart, Package } from 'lucide-react';
import { transactionService, productService } from '../services';
import toast from 'react-hot-toast';

function Transactions() {
  const [transactions, setTransactions] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [filter, setFilter] = useState('all');
  const [formData, setFormData] = useState({
    productId: '',
    type: 'purchase',
    quantity: 1,
    unitPrice: '',
    notes: '',
  });

  useEffect(() => {
    fetchTransactions();
    fetchProducts();
  }, []);

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      const params = filter !== 'all' ? { type: filter } : {};
      const response = await transactionService.getAll(params);
      setTransactions(response.data);
    } catch (error) {
      console.error('Error fetching transactions:', error);
      toast.error('Failed to load transactions');
    } finally {
      setLoading(false);
    }
  };

  const fetchProducts = async () => {
    try {
      const response = await productService.getAll();
      setProducts(response.data);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, [filter]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await transactionService.create({
        ...formData,
        productId: parseInt(formData.productId),
        quantity: parseInt(formData.quantity),
      });
      toast.success('Transaction created successfully');
      setShowModal(false);
      resetForm();
      fetchTransactions();
    } catch (error) {
      console.error('Error creating transaction:', error);
      toast.error(error.response?.data?.error || 'Failed to create transaction');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this transaction? This will revert the stock changes.')) {
      try {
        await transactionService.delete(id);
        toast.success('Transaction deleted successfully');
        fetchTransactions();
      } catch (error) {
        console.error('Error deleting transaction:', error);
        toast.error(error.response?.data?.error || 'Failed to delete transaction');
      }
    }
  };

  const resetForm = () => {
    setFormData({
      productId: '',
      type: 'purchase',
      quantity: 1,
      unitPrice: '',
      notes: '',
    });
  };

  const handleModalClose = () => {
    setShowModal(false);
    resetForm();
  };

  const selectedProduct = products.find(p => p.id === parseInt(formData.productId));

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
      <div className="sm:flex sm:items-center sm:justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Transactions</h1>
          <p className="mt-2 text-sm text-gray-700">
            Record and manage inventory transactions
          </p>
        </div>
        <div className="mt-4 sm:mt-0">
          <button
            onClick={() => setShowModal(true)}
            className="btn-primary"
          >
            <Plus className="h-4 w-4 mr-2" />
            New Transaction
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="mb-6">
        <div className="sm:hidden">
          <select
            className="block w-full rounded-md border-gray-300 focus:border-primary-500 focus:ring-primary-500"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          >
            <option value="all">All Transactions</option>
            <option value="purchase">Purchases</option>
            <option value="sale">Sales</option>
          </select>
        </div>
        <div className="hidden sm:block">
          <nav className="flex space-x-8">
            <button
              onClick={() => setFilter('all')}
              className={`${
                filter === 'all'
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm`}
            >
              All Transactions
            </button>
            <button
              onClick={() => setFilter('purchase')}
              className={`${
                filter === 'purchase'
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm`}
            >
              Purchases
            </button>
            <button
              onClick={() => setFilter('sale')}
              className={`${
                filter === 'sale'
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm`}
            >
              Sales
            </button>
          </nav>
        </div>
      </div>

      {/* Transactions Table */}
      <div className="card">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Product
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Quantity
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Unit Price
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {transactions.map((transaction) => (
                <tr key={transaction.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className={`p-2 rounded-md ${
                        transaction.type === 'purchase' 
                          ? 'bg-green-100' 
                          : 'bg-blue-100'
                      }`}>
                        {transaction.type === 'purchase' ? (
                          <ShoppingCart className={`h-4 w-4 text-green-600`} />
                        ) : (
                          <Package className={`h-4 w-4 text-blue-600`} />
                        )}
                      </div>
                      <div className="ml-3">
                        <span className={`text-sm font-medium capitalize ${
                          transaction.type === 'purchase' 
                            ? 'text-green-800' 
                            : 'text-blue-800'
                        }`}>
                          {transaction.type}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {transaction.product?.name}
                    </div>
                    <div className="text-sm text-gray-500">
                      SKU: {transaction.product?.sku}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {transaction.quantity}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    ${parseFloat(transaction.unitPrice).toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    ${parseFloat(transaction.totalAmount).toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(transaction.transactionDate).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => handleDelete(transaction.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {transactions.length === 0 && (
            <div className="text-center py-8">
              <ArrowUpDown className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No transactions</h3>
              <p className="mt-1 text-sm text-gray-500">
                Get started by recording your first transaction.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={handleModalClose}></div>
            
            <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
              <div className="mb-4">
                <h3 className="text-lg font-medium text-gray-900">
                  New Transaction
                </h3>
              </div>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Transaction Type *
                  </label>
                  <select
                    required
                    className="input-field"
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  >
                    <option value="purchase">Purchase (Stock In)</option>
                    <option value="sale">Sale (Stock Out)</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Product *
                  </label>
                  <select
                    required
                    className="input-field"
                    value={formData.productId}
                    onChange={(e) => setFormData({ ...formData, productId: e.target.value })}
                  >
                    <option value="">Select a product</option>
                    {products.map((product) => (
                      <option key={product.id} value={product.id}>
                        {product.name} (SKU: {product.sku}) - Stock: {product.currentStock}
                      </option>
                    ))}
                  </select>
                </div>

                {selectedProduct && formData.type === 'sale' && (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                    <p className="text-sm text-yellow-800">
                      Current stock: {selectedProduct.currentStock} units
                    </p>
                  </div>
                )}
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Quantity *
                    </label>
                    <input
                      type="number"
                      min="1"
                      required
                      className="input-field"
                      value={formData.quantity}
                      onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Unit Price *
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      required
                      className="input-field"
                      value={formData.unitPrice}
                      onChange={(e) => setFormData({ ...formData, unitPrice: e.target.value })}
                    />
                  </div>
                </div>

                {formData.quantity && formData.unitPrice && (
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                    <p className="text-sm font-medium text-gray-900">
                      Total Amount: ${(parseFloat(formData.quantity) * parseFloat(formData.unitPrice)).toFixed(2)}
                    </p>
                  </div>
                )}
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Notes
                  </label>
                  <textarea
                    className="input-field"
                    rows={3}
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    placeholder="Optional notes about this transaction..."
                  />
                </div>
                
                <div className="flex justify-end space-x-3 mt-6">
                  <button
                    type="button"
                    onClick={handleModalClose}
                    className="btn-secondary"
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn-primary">
                    Create Transaction
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Transactions;
