import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { useAuth } from '../context/AuthContext';
import { toast } from 'sonner';

export const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const result = await login(email, password);
    setLoading(false);
    if (result.success) {
      toast.success('Login successful!');
      navigate('/');
    } else {
      toast.error(result.error || 'Login failed');
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center py-12 px-4" data-testid="login-page">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h1 className="text-4xl sm:text-5xl tracking-tighter font-black text-white mb-2" data-testid="login-title">
            Welcome Back
          </h1>
          <p className="text-neutral-400" data-testid="login-subtitle">Login to continue shopping</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-[#171717] p-8 rounded-sm space-y-6" data-testid="login-form">
          <div>
            <Label htmlFor="email" className="text-neutral-300 font-bold">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-2 bg-[#0a0a0a] border-[#262626] text-white focus-visible:ring-yellow-400 rounded-sm"
              placeholder="admin@riyaztee.com"
              required
              data-testid="login-email-input"
            />
          </div>

          <div>
            <Label htmlFor="password" className="text-neutral-300 font-bold">Password</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-2 bg-[#0a0a0a] border-[#262626] text-white focus-visible:ring-yellow-400 rounded-sm"
              placeholder="••••••••"
              required
              data-testid="login-password-input"
            />
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-yellow-400 text-black hover:bg-yellow-500 rounded-sm font-bold py-6"
            data-testid="login-submit-button"
          >
            {loading ? 'Logging in...' : 'LOGIN'}
          </Button>

          <p className="text-center text-neutral-400 text-sm">
            Don't have an account?{' '}
            <Link to="/register" className="text-yellow-400 hover:text-yellow-500 font-bold" data-testid="register-link">
              Register here
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};
