import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0a0a0a]">
        <div className="text-yellow-400 text-xl font-bold" data-testid="loading-spinner">Loading...</div>
      </div>
    );
  }

  if (!user || !user._id) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export const AdminRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0a0a0a]">
        <div className="text-yellow-400 text-xl font-bold" data-testid="loading-spinner">Loading...</div>
      </div>
    );
  }

  if (!user || !user._id || user.role !== 'admin') {
    return <Navigate to="/" replace />;
  }

  return children;
};
