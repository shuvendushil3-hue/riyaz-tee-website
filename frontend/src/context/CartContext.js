import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from './AuthContext';

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

const CartContext = createContext(null);

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState({ items: [] });
  const { user } = useAuth();

  useEffect(() => {
    if (user && user._id) {
      fetchCart();
    } else {
      setCart({ items: [] });
    }
  }, [user]);

  const fetchCart = async () => {
    try {
      const { data } = await axios.get(`${API}/cart`, { withCredentials: true });
      setCart(data);
    } catch (error) {
      console.error('Failed to fetch cart:', error);
    }
  };

  const addToCart = async (product_id, size, quantity = 1) => {
    try {
      await axios.post(`${API}/cart/add`, { product_id, size, quantity }, { withCredentials: true });
      await fetchCart();
      return { success: true };
    } catch (error) {
      return { success: false, error: error.response?.data?.detail || error.message };
    }
  };

  const updateCartItem = async (product_id, size, quantity) => {
    try {
      await axios.put(`${API}/cart/update`, { product_id, size, quantity }, { withCredentials: true });
      await fetchCart();
    } catch (error) {
      console.error('Failed to update cart:', error);
    }
  };

  const removeFromCart = async (product_id, size) => {
    try {
      await axios.delete(`${API}/cart/remove/${product_id}/${size}`, { withCredentials: true });
      await fetchCart();
    } catch (error) {
      console.error('Failed to remove from cart:', error);
    }
  };

  const cartCount = cart.items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider value={{ cart, addToCart, updateCartItem, removeFromCart, cartCount, fetchCart }}>
      {children}
    </CartContext.Provider>
  );
};
