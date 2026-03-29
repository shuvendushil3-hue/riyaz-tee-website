import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus, Edit, Trash2, Package } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../components/ui/dialog';
import { toast } from 'sonner';

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

export const AdminDashboard = () => {
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [showProductDialog, setShowProductDialog] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    image: '',
    category: 't-shirt'
  });

  useEffect(() => {
    fetchProducts();
    fetchOrders();
  }, []);

  const fetchProducts = async () => {
    try {
      const { data } = await axios.get(`${API}/products`);
      setProducts(data);
    } catch (error) {
      console.error('Failed to fetch products:', error);
    }
  };

  const fetchOrders = async () => {
    try {
      const { data } = await axios.get(`${API}/orders/admin/all`, { withCredentials: true });
      setOrders(data);
    } catch (error) {
      console.error('Failed to fetch orders:', error);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingProduct) {
        await axios.put(
          `${API}/products/${editingProduct.id}`,
          { ...formData, price: parseFloat(formData.price) },
          { withCredentials: true }
        );
        toast.success('Product updated successfully');
      } else {
        await axios.post(
          `${API}/products`,
          { ...formData, price: parseFloat(formData.price) },
          { withCredentials: true }
        );
        toast.success('Product created successfully');
      }
      setShowProductDialog(false);
      setEditingProduct(null);
      setFormData({ name: '', description: '', price: '', image: '', category: 't-shirt' });
      fetchProducts();
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Failed to save product');
    }
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      description: product.description,
      price: product.price.toString(),
      image: product.image,
      category: product.category
    });
    setShowProductDialog(true);
  };

  const handleDelete = async (productId) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    try {
      await axios.delete(`${API}/products/${productId}`, { withCredentials: true });
      toast.success('Product deleted successfully');
      fetchProducts();
    } catch (error) {
      toast.error('Failed to delete product');
    }
  };

  const handleNewProduct = () => {
    setEditingProduct(null);
    setFormData({ name: '', description: '', price: '', image: '', category: 't-shirt' });
    setShowProductDialog(true);
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] py-12" data-testid="admin-dashboard">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-4xl sm:text-5xl tracking-tighter font-black text-white" data-testid="admin-title">
            Admin Dashboard
          </h1>
        </div>

        {/* Products Section */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-white">Products</h2>
            <Dialog open={showProductDialog} onOpenChange={setShowProductDialog}>
              <DialogTrigger asChild>
                <Button
                  onClick={handleNewProduct}
                  className="bg-yellow-400 text-black hover:bg-yellow-500 rounded-sm font-bold"
                  data-testid="add-product-button"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Product
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-[#171717] text-white border-[#262626] max-w-2xl" data-testid="product-dialog">
                <DialogHeader>
                  <DialogTitle className="text-2xl font-bold">
                    {editingProduct ? 'Edit Product' : 'Add New Product'}
                  </DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4" data-testid="product-form">
                  <div>
                    <Label htmlFor="name" className="text-neutral-300 font-bold">Product Name</Label>
                    <Input
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="mt-2 bg-[#0a0a0a] border-[#262626] text-white focus-visible:ring-yellow-400 rounded-sm"
                      required
                      data-testid="product-name-input"
                    />
                  </div>
                  <div>
                    <Label htmlFor="description" className="text-neutral-300 font-bold">Description</Label>
                    <Textarea
                      id="description"
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      className="mt-2 bg-[#0a0a0a] border-[#262626] text-white focus-visible:ring-yellow-400 rounded-sm"
                      rows={3}
                      required
                      data-testid="product-description-input"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="price" className="text-neutral-300 font-bold">Price (₹)</Label>
                      <Input
                        id="price"
                        name="price"
                        type="number"
                        value={formData.price}
                        onChange={handleChange}
                        className="mt-2 bg-[#0a0a0a] border-[#262626] text-white focus-visible:ring-yellow-400 rounded-sm"
                        required
                        data-testid="product-price-input"
                      />
                    </div>
                    <div>
                      <Label htmlFor="category" className="text-neutral-300 font-bold">Category</Label>
                      <Input
                        id="category"
                        name="category"
                        value={formData.category}
                        onChange={handleChange}
                        className="mt-2 bg-[#0a0a0a] border-[#262626] text-white focus-visible:ring-yellow-400 rounded-sm"
                        required
                        data-testid="product-category-input"
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="image" className="text-neutral-300 font-bold">Image URL</Label>
                    <Input
                      id="image"
                      name="image"
                      value={formData.image}
                      onChange={handleChange}
                      className="mt-2 bg-[#0a0a0a] border-[#262626] text-white focus-visible:ring-yellow-400 rounded-sm"
                      required
                      data-testid="product-image-input"
                    />
                  </div>
                  <Button
                    type="submit"
                    className="w-full bg-yellow-400 text-black hover:bg-yellow-500 rounded-sm font-bold"
                    data-testid="save-product-button"
                  >
                    {editingProduct ? 'Update Product' : 'Create Product'}
                  </Button>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" data-testid="products-grid">
            {products.map((product, idx) => (
              <div key={product.id} className="bg-[#171717] rounded-sm overflow-hidden" data-testid={`admin-product-${idx}`}>
                <img src={product.image} alt={product.name} className="w-full h-48 object-cover" />
                <div className="p-4">
                  <h3 className="font-bold text-white mb-1" data-testid={`admin-product-name-${idx}`}>{product.name}</h3>
                  <p className="text-yellow-400 font-bold text-lg mb-3" data-testid={`admin-product-price-${idx}`}>₹{product.price}</p>
                  <div className="flex space-x-2">
                    <Button
                      onClick={() => handleEdit(product)}
                      size="sm"
                      className="flex-1 bg-[#262626] hover:bg-[#303030] text-white rounded-sm"
                      data-testid={`edit-product-${idx}`}
                    >
                      <Edit className="w-4 h-4 mr-1" />
                      Edit
                    </Button>
                    <Button
                      onClick={() => handleDelete(product.id)}
                      size="sm"
                      className="flex-1 bg-red-600/20 hover:bg-red-600/30 text-red-400 rounded-sm"
                      data-testid={`delete-product-${idx}`}
                    >
                      <Trash2 className="w-4 h-4 mr-1" />
                      Delete
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Orders Section */}
        <div>
          <h2 className="text-2xl font-bold text-white mb-6">Recent Orders</h2>
          {orders.length === 0 ? (
            <div className="text-center py-12 bg-[#171717] rounded-sm" data-testid="no-orders">
              <Package className="w-16 h-16 text-neutral-600 mx-auto mb-4" />
              <p className="text-neutral-400">No orders yet</p>
            </div>
          ) : (
            <div className="space-y-4" data-testid="orders-list">
              {orders.slice(0, 10).map((order, idx) => (
                <div key={order.id} className="bg-[#171717] p-6 rounded-sm" data-testid={`admin-order-${idx}`}>
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="text-xs tracking-[0.2em] uppercase font-bold text-yellow-400 mb-1" data-testid={`admin-order-id-${idx}`}>
                        Order #{order.id}
                      </div>
                      <p className="text-sm text-neutral-400">
                        {new Date(order.created_at).toLocaleDateString('en-IN', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                      <p className="text-sm text-neutral-300 mt-2">
                        {order.shipping_info.name} | {order.shipping_info.phone}
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-white mb-1" data-testid={`admin-order-total-${idx}`}>₹{order.total}</div>
                      <span className="inline-block px-3 py-1 bg-yellow-400/10 text-yellow-400 text-xs font-bold rounded-sm">
                        {order.status.toUpperCase()}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
