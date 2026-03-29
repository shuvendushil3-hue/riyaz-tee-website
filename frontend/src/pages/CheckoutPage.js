import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { toast } from 'sonner';

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

export const CheckoutPage = () => {
  const { user } = useAuth();
  const { cart, fetchCart } = useCart();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    pincode: ''
  });

  useEffect(() => {
    if (!user || !user._id) {
      navigate('/login');
      return;
    }
    if (!cart.items || cart.items.length === 0) {
      navigate('/cart');
      return;
    }
    fetchProducts();
    setFormData((prev) => ({ ...prev, name: user.name, email: user.email }));
  }, [user, cart]);

  const fetchProducts = async () => {
    try {
      const { data } = await axios.get(`${API}/products`);
      setProducts(data);
    } catch (error) {
      console.error('Failed to fetch products:', error);
    }
  };

  const getProductDetails = (productId) => {
    return products.find((p) => p.id === productId);
  };

  const calculateTotal = () => {
    return cart.items.reduce((total, item) => {
      const product = getProductDetails(item.product_id);
      return total + (product ? product.price * item.quantity : 0);
    }, 0);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Prepare order items with product details
      const orderItems = cart.items.map((item) => {
        const product = getProductDetails(item.product_id);
        return {
          product_id: item.product_id,
          product_name: product?.name || 'Unknown',
          size: item.size,
          quantity: item.quantity,
          price: product?.price || 0
        };
      });

      const total = calculateTotal();

      // Create order with mock Razorpay
      const { data } = await axios.post(
        `${API}/orders/create`,
        {
          items: orderItems,
          shipping_info: formData,
          total
        },
        { withCredentials: true }
      );

      toast.success('Order placed successfully! (Mock Payment)');
      await fetchCart(); // Clear cart
      navigate('/orders');
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Failed to create order');
    } finally {
      setLoading(false);
    }
  };

  const total = calculateTotal();

  return (
    <div className="min-h-screen bg-[#0a0a0a] py-12" data-testid="checkout-page">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl sm:text-5xl tracking-tighter font-black text-white mb-8" data-testid="checkout-title">
          Checkout
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Shipping Form */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="bg-[#171717] p-8 rounded-sm space-y-6" data-testid="checkout-form">
              <h2 className="text-xl font-bold text-white mb-4">Shipping Information</h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name" className="text-neutral-300 font-bold">Full Name</Label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="mt-2 bg-[#0a0a0a] border-[#262626] text-white focus-visible:ring-yellow-400 rounded-sm"
                    required
                    data-testid="checkout-name-input"
                  />
                </div>
                <div>
                  <Label htmlFor="email" className="text-neutral-300 font-bold">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="mt-2 bg-[#0a0a0a] border-[#262626] text-white focus-visible:ring-yellow-400 rounded-sm"
                    required
                    data-testid="checkout-email-input"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="phone" className="text-neutral-300 font-bold">Phone</Label>
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleChange}
                  className="mt-2 bg-[#0a0a0a] border-[#262626] text-white focus-visible:ring-yellow-400 rounded-sm"
                  required
                  data-testid="checkout-phone-input"
                />
              </div>

              <div>
                <Label htmlFor="address" className="text-neutral-300 font-bold">Address</Label>
                <Input
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  className="mt-2 bg-[#0a0a0a] border-[#262626] text-white focus-visible:ring-yellow-400 rounded-sm"
                  required
                  data-testid="checkout-address-input"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="city" className="text-neutral-300 font-bold">City</Label>
                  <Input
                    id="city"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    className="mt-2 bg-[#0a0a0a] border-[#262626] text-white focus-visible:ring-yellow-400 rounded-sm"
                    required
                    data-testid="checkout-city-input"
                  />
                </div>
                <div>
                  <Label htmlFor="state" className="text-neutral-300 font-bold">State</Label>
                  <Input
                    id="state"
                    name="state"
                    value={formData.state}
                    onChange={handleChange}
                    className="mt-2 bg-[#0a0a0a] border-[#262626] text-white focus-visible:ring-yellow-400 rounded-sm"
                    required
                    data-testid="checkout-state-input"
                  />
                </div>
                <div>
                  <Label htmlFor="pincode" className="text-neutral-300 font-bold">Pincode</Label>
                  <Input
                    id="pincode"
                    name="pincode"
                    value={formData.pincode}
                    onChange={handleChange}
                    className="mt-2 bg-[#0a0a0a] border-[#262626] text-white focus-visible:ring-yellow-400 rounded-sm"
                    required
                    data-testid="checkout-pincode-input"
                  />
                </div>
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-yellow-400 text-black hover:bg-yellow-500 rounded-sm font-bold py-6 text-base"
                data-testid="place-order-button"
              >
                {loading ? 'Processing...' : 'PLACE ORDER (MOCK PAYMENT)'}
              </Button>
            </form>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-[#171717] p-6 rounded-sm sticky top-24" data-testid="checkout-summary">
              <h2 className="text-xl font-bold text-white mb-6">Order Summary</h2>
              <div className="space-y-4 mb-6">
                {cart.items.map((item, idx) => {
                  const product = getProductDetails(item.product_id);
                  if (!product) return null;
                  return (
                    <div key={`${item.product_id}-${item.size}`} className="flex justify-between text-sm" data-testid={`summary-item-${idx}`}>
                      <span className="text-neutral-300">
                        {product.name} ({item.size}) x{item.quantity}
                      </span>
                      <span className="text-white">₹{product.price * item.quantity}</span>
                    </div>
                  );
                })}
              </div>
              <div className="border-t border-[#262626] pt-4 space-y-2">
                <div className="flex justify-between text-neutral-300">
                  <span>Subtotal</span>
                  <span data-testid="summary-subtotal">₹{total}</span>
                </div>
                <div className="flex justify-between text-neutral-300">
                  <span>Shipping</span>
                  <span className="text-green-400">FREE</span>
                </div>
                <div className="flex justify-between text-white font-bold text-lg pt-2">
                  <span>Total</span>
                  <span data-testid="summary-total">₹{total}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
