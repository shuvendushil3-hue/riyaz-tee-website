import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Trash2, Plus, Minus } from 'lucide-react';
import { Button } from '../components/ui/button';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { toast } from 'sonner';

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

export const CartPage = () => {
  const { user } = useAuth();
  const { cart, updateCartItem, removeFromCart, fetchCart } = useCart();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user && user._id) {
      fetchCartWithProducts();
    } else {
      setLoading(false);
    }
  }, [user, cart]);

  const fetchCartWithProducts = async () => {
    try {
      const { data: allProducts } = await axios.get(`${API}/products`);
      setProducts(allProducts);
    } catch (error) {
      console.error('Failed to fetch products:', error);
    } finally {
      setLoading(false);
    }
  };

  const getProductDetails = (productId) => {
    return products.find((p) => p.id === productId);
  };

  const handleUpdateQuantity = async (productId, size, newQuantity) => {
    if (newQuantity < 1) return;
    await updateCartItem(productId, size, newQuantity);
  };

  const handleRemove = async (productId, size) => {
    await removeFromCart(productId, size);
    toast.success('Item removed from cart');
  };

  const calculateTotal = () => {
    return cart.items.reduce((total, item) => {
      const product = getProductDetails(item.product_id);
      return total + (product ? product.price * item.quantity : 0);
    }, 0);
  };

  if (!user || !user._id) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center" data-testid="cart-login-prompt">
        <div className="text-center space-y-4">
          <h2 className="text-2xl font-bold text-white">Please login to view your cart</h2>
          <Link to="/login">
            <Button className="bg-yellow-400 text-black hover:bg-yellow-500 rounded-sm font-bold" data-testid="cart-login-button">
              LOGIN
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0a0a0a]">
        <div className="text-yellow-400 text-xl font-bold" data-testid="loading-text">Loading...</div>
      </div>
    );
  }

  if (!cart.items || cart.items.length === 0) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center" data-testid="empty-cart">
        <div className="text-center space-y-4">
          <h2 className="text-2xl font-bold text-white">Your cart is empty</h2>
          <Link to="/products">
            <Button className="bg-yellow-400 text-black hover:bg-yellow-500 rounded-sm font-bold" data-testid="continue-shopping-button">
              CONTINUE SHOPPING
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const total = calculateTotal();

  return (
    <div className="min-h-screen bg-[#0a0a0a] py-12" data-testid="cart-page">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl sm:text-5xl tracking-tighter font-black text-white mb-8" data-testid="cart-title">
          Shopping Cart
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4" data-testid="cart-items">
            {cart.items.map((item, idx) => {
              const product = getProductDetails(item.product_id);
              if (!product) return null;

              return (
                <div key={`${item.product_id}-${item.size}`} className="bg-[#171717] p-6 rounded-sm flex items-center space-x-6" data-testid={`cart-item-${idx}`}>
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-24 h-24 object-cover"
                    data-testid={`cart-item-image-${idx}`}
                  />
                  <div className="flex-1">
                    <h3 className="font-bold text-white mb-1" data-testid={`cart-item-name-${idx}`}>{product.name}</h3>
                    <p className="text-sm text-neutral-400 mb-2" data-testid={`cart-item-size-${idx}`}>Size: {item.size}</p>
                    <p className="text-yellow-400 font-bold" data-testid={`cart-item-price-${idx}`}>₹{product.price}</p>
                  </div>
                  <div className="flex items-center space-x-3">
                    <button
                      onClick={() => handleUpdateQuantity(item.product_id, item.size, item.quantity - 1)}
                      className="p-2 bg-[#262626] hover:bg-[#303030] rounded-sm"
                      data-testid={`decrease-quantity-${idx}`}
                    >
                      <Minus className="w-4 h-4 text-white" />
                    </button>
                    <span className="text-white font-bold w-8 text-center" data-testid={`cart-item-quantity-${idx}`}>{item.quantity}</span>
                    <button
                      onClick={() => handleUpdateQuantity(item.product_id, item.size, item.quantity + 1)}
                      className="p-2 bg-[#262626] hover:bg-[#303030] rounded-sm"
                      data-testid={`increase-quantity-${idx}`}
                    >
                      <Plus className="w-4 h-4 text-white" />
                    </button>
                  </div>
                  <button
                    onClick={() => handleRemove(item.product_id, item.size)}
                    className="p-2 text-red-400 hover:text-red-300"
                    data-testid={`remove-item-${idx}`}
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              );
            })}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-[#171717] p-6 rounded-sm sticky top-24" data-testid="order-summary">
              <h2 className="text-xl font-bold text-white mb-6">Order Summary</h2>
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-neutral-300">
                  <span>Subtotal</span>
                  <span data-testid="subtotal-amount">₹{total}</span>
                </div>
                <div className="flex justify-between text-neutral-300">
                  <span>Shipping</span>
                  <span className="text-green-400">FREE</span>
                </div>
                <div className="border-t border-[#262626] pt-3 flex justify-between text-white font-bold text-lg">
                  <span>Total</span>
                  <span data-testid="total-amount">₹{total}</span>
                </div>
              </div>
              <Button
                onClick={() => navigate('/checkout')}
                className="w-full bg-yellow-400 text-black hover:bg-yellow-500 rounded-sm font-bold py-6"
                data-testid="proceed-to-checkout-button"
              >
                PROCEED TO CHECKOUT
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
