import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Download } from 'lucide-react';
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

  const downloadCredentials = () => {
    const credentials = `RIYAZ TEE - Admin Login Credentials\n\n` +
      `Admin Email: admin@riyaztee.com\n` +
      `Admin Password: admin123\n\n` +
      `Role: Administrator\n\n` +
      `Access: Product Management, Order Management\n\n` +
      `Note: Please keep these credentials secure and do not share them.\n` +
      `Generated on: ${new Date().toLocaleString()}`;
    
    const blob = new Blob([credentials], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'riyaz-tee-admin-credentials.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
    toast.success('Credentials downloaded!');
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center py-12 px-4" data-testid="login-page">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h1 className="text-4xl sm:text-5xl tracking-tighter font-black text-white mb-2" data-testid="login-title">
            Welcome Back
          </h1>
          <p className="text-neutral-400" data-testid="login-subtitle">Login to access admin panel</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-[#171717] p-8 rounded-2xl space-y-6" data-testid="login-form">
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

          <button
            type="submit"
            disabled={loading}
            className="btn-gradient w-full py-6"
            data-testid="login-submit-button"
          >
            {loading ? 'Logging in...' : 'LOGIN'}
          </button>

          <div className="pt-4 border-t border-[#262626]">
            <Button
              type="button"
              onClick={downloadCredentials}
              variant="outline"
              className="w-full border-yellow-400/30 text-yellow-400 hover:bg-yellow-400/10 rounded-sm font-bold"
              data-testid="download-credentials-button"
            >
              <Download className="w-4 h-4 mr-2" />
              Download Admin Credentials
            </Button>
            <p className="text-xs text-center text-neutral-500 mt-2">
              For admin access only
            </p>
          </div>

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
