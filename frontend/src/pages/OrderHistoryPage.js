import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Package } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

export const OrderHistoryPage = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const { data } = await axios.get(`${API}/orders`, { withCredentials: true });
      setOrders(data);
    } catch (error) {
      console.error('Failed to fetch orders:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0a0a0a]">
        <div className="text-yellow-400 text-xl font-bold" data-testid="loading-text">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] py-12" data-testid="order-history-page">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl sm:text-5xl tracking-tighter font-black text-white mb-8" data-testid="orders-title">
          Your Orders
        </h1>

        {orders.length === 0 ? (
          <div className="text-center py-12" data-testid="no-orders">
            <Package className="w-16 h-16 text-neutral-600 mx-auto mb-4" />
            <p className="text-neutral-400 text-lg">No orders yet</p>
          </div>
        ) : (
          <div className="space-y-6" data-testid="orders-list">
            {orders.map((order, idx) => (
              <div key={order.id} className="bg-[#171717] p-6 rounded-sm" data-testid={`order-item-${idx}`}>
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <div className="text-xs tracking-[0.2em] uppercase font-bold text-yellow-400 mb-1" data-testid={`order-id-${idx}`}>
                      Order #{order.id}
                    </div>
                    <p className="text-sm text-neutral-400" data-testid={`order-date-${idx}`}>
                      {new Date(order.created_at).toLocaleDateString('en-IN', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-white mb-1" data-testid={`order-total-${idx}`}>₹{order.total}</div>
                    <span className="inline-block px-3 py-1 bg-yellow-400/10 text-yellow-400 text-xs font-bold rounded-sm" data-testid={`order-status-${idx}`}>
                      {order.status.toUpperCase()}
                    </span>
                  </div>
                </div>

                <div className="border-t border-[#262626] pt-4 space-y-3">
                  {order.items.map((item, itemIdx) => (
                    <div key={itemIdx} className="flex justify-between text-sm" data-testid={`order-item-detail-${idx}-${itemIdx}`}>
                      <span className="text-neutral-300">
                        {item.product_name} ({item.size}) x{item.quantity}
                      </span>
                      <span className="text-white">₹{item.price * item.quantity}</span>
                    </div>
                  ))}
                </div>

                <div className="border-t border-[#262626] mt-4 pt-4">
                  <h4 className="text-sm font-bold text-white mb-2">Shipping Address</h4>
                  <p className="text-sm text-neutral-400" data-testid={`order-shipping-${idx}`}>
                    {order.shipping_info.name}<br />
                    {order.shipping_info.address}<br />
                    {order.shipping_info.city}, {order.shipping_info.state} - {order.shipping_info.pincode}<br />
                    Phone: {order.shipping_info.phone}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
