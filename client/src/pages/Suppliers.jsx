import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Users, Package } from 'lucide-react';
import { supplierService } from '../services';
import toast from 'react-hot-toast';

function Suppliers() {
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingSupplier, setEditingSupplier] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
  });

  useEffect(() => {
    fetchSuppliers();
  }, []);

  const fetchSuppliers = async () => {
    try {
      setLoading(true);
      const response = await supplierService.getAll();
      setSuppliers(response.data);
    } catch (error) {
      console.error('Error fetching suppliers:', error);
      toast.error('Failed to load suppliers');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingSupplier) {
        await supplierService.update(editingSupplier.id, formData);
        toast.success('Supplier updated successfully');
      } else {
        await supplierService.create(formData);
        toast.success('Supplier created successfully');
      }
      setShowModal(false);
      resetForm();
      fetchSuppliers();
    } catch (error) {
      console.error('Error saving supplier:', error);
      toast.error(error.response?.data?.error || 'Failed to save supplier');
    }
  };

  const handleEdit = (supplier) => {
    setEditingSupplier(supplier);
    setFormData({
      name: supplier.name,
      email: supplier.email || '',
      phone: supplier.phone || '',
      address: supplier.address || '',
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this supplier?')) {
      try {
        await supplierService.delete(id);
        toast.success('Supplier deleted successfully');
        fetchSuppliers();
      } catch (error) {
        console.error('Error deleting supplier:', error);
        toast.error(error.response?.data?.error || 'Failed to delete supplier');
      }
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      phone: '',
      address: '',
    });
    setEditingSupplier(null);
  };

  const handleModalClose = () => {
    setShowModal(false);
    resetForm();
  };

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
          <h1 className="text-2xl font-bold text-gray-900">Suppliers</h1>
          <p className="mt-2 text-sm text-gray-700">
            Manage your supplier relationships
          </p>
        </div>
        <div className="mt-4 sm:mt-0">
          <button
            onClick={() => setShowModal(true)}
            className="btn-primary"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Supplier
          </button>
        </div>
      </div>

      {/* Suppliers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {suppliers.map((supplier) => (
          <div key={supplier.id} className="card">
            <div className="card-body">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <div className="bg-primary-100 p-2 rounded-lg">
                    <Users className="h-6 w-6 text-primary-600" />
                  </div>
                  <div className="ml-3">
                    <h3 className="text-lg font-medium text-gray-900">
                      {supplier.name}
                    </h3>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleEdit(supplier)}
                    className="text-primary-600 hover:text-primary-900"
                  >
                    <Edit className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(supplier.id)}
                    className="text-red-600 hover:text-red-900"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                {supplier.email && (
                  <div className="flex items-center text-sm text-gray-600">
                    <span className="font-medium">Email:</span>
                    <span className="ml-2">{supplier.email}</span>
                  </div>
                )}
                {supplier.phone && (
                  <div className="flex items-center text-sm text-gray-600">
                    <span className="font-medium">Phone:</span>
                    <span className="ml-2">{supplier.phone}</span>
                  </div>
                )}
                {supplier.address && (
                  <div className="text-sm text-gray-600">
                    <span className="font-medium">Address:</span>
                    <p className="mt-1">{supplier.address}</p>
                  </div>
                )}
              </div>

              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center text-sm text-gray-500">
                    <Package className="h-4 w-4 mr-1" />
                    <span>{supplier.productCount || 0} products</span>
                  </div>
                  <div className="text-xs text-gray-400">
                    Added {new Date(supplier.createdAt).toLocaleDateString()}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {suppliers.length === 0 && (
        <div className="text-center py-12">
          <Users className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No suppliers</h3>
          <p className="mt-1 text-sm text-gray-500">
            Get started by adding your first supplier.
          </p>
          <div className="mt-6">
            <button
              onClick={() => setShowModal(true)}
              className="btn-primary"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Supplier
            </button>
          </div>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={handleModalClose}></div>
            
            <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
              <div className="mb-4">
                <h3 className="text-lg font-medium text-gray-900">
                  {editingSupplier ? 'Edit Supplier' : 'Add New Supplier'}
                </h3>
              </div>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Supplier Name *
                  </label>
                  <input
                    type="text"
                    required
                    className="input-field"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Email
                  </label>
                  <input
                    type="email"
                    className="input-field"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Phone
                  </label>
                  <input
                    type="tel"
                    className="input-field"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Address
                  </label>
                  <textarea
                    className="input-field"
                    rows={3}
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
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
                    {editingSupplier ? 'Update' : 'Create'} Supplier
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

export default Suppliers;
