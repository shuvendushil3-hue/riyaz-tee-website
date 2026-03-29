import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Button } from './ui/button';

export const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <nav className="sticky top-0 z-50 bg-black/80 backdrop-blur-xl border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-24">
          <Link to="/" className="flex items-center">
            <img 
              src="https://customer-assets.emergentagent.com/job_rhythm-wear-2/artifacts/eploke4p_logo3.png" 
              alt="Riyaz Tee" 
              className="h-20 w-auto"
              data-testid="navbar-logo"
            />
          </Link>

          <div className="flex items-center space-x-8">
            <Link to="/products" className="text-sm font-semibold text-neutral-300 hover:text-yellow-400 transition-colors tracking-wide" data-testid="nav-products-link">
              PRODUCTS
            </Link>
            
            <Link to="/about" className="text-sm font-semibold text-neutral-300 hover:text-yellow-400 transition-colors tracking-wide" data-testid="nav-about-link">
              ABOUT
            </Link>
            
            <Link to="/contact" className="text-sm font-semibold text-neutral-300 hover:text-yellow-400 transition-colors tracking-wide" data-testid="nav-contact-link">
              CONTACT
            </Link>
            
            {user && user._id && user.role === 'admin' && (
              <Link to="/admin" className="text-sm font-semibold text-neutral-300 hover:text-yellow-400 transition-colors tracking-wide" data-testid="nav-admin-link">
                ADMIN
              </Link>
            )}

            {user && user._id ? (
              <div className="flex items-center space-x-4">
                <span className="text-sm text-neutral-400" data-testid="user-name-display">{user.name}</span>
                <Button
                  onClick={handleLogout}
                  variant="ghost"
                  size="sm"
                  className="text-neutral-300 hover:text-yellow-400"
                  data-testid="logout-button"
                >
                  <LogOut className="w-4 h-4" />
                </Button>
              </div>
            ) : (
              <Link to="/login" data-testid="nav-login-link">
                <button className="btn-gradient px-6 py-3 text-sm" data-testid="login-button">
                  <User className="w-4 h-4 mr-2 inline" />
                  LOGIN
                </button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};
