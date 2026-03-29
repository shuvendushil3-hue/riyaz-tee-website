import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { useAuth } from '../context/AuthContext';
import { toast } from 'sonner';

export const RegisterPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const result = await register(email, password, name);
    setLoading(false);
    if (result.success) {
      toast.success('Registration successful!');
      navigate('/');
    } else {
      toast.error(result.error || 'Registration failed');
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center py-12 px-4" data-testid="register-page">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h1 className="text-4xl sm:text-5xl tracking-tighter font-black text-white mb-2" data-testid="register-title">
            Join Riyaz Tee
          </h1>
          <p className="text-neutral-400" data-testid="register-subtitle">Create an account to start shopping</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-[#171717] p-8 rounded-sm space-y-6" data-testid="register-form">
          <div>
            <Label htmlFor="name" className="text-neutral-300 font-bold">Name</Label>
            <Input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-2 bg-[#0a0a0a] border-[#262626] text-white focus-visible:ring-yellow-400 rounded-sm"
              placeholder="Your name"
              required
              data-testid="register-name-input"
            />
          </div>

          <div>
            <Label htmlFor="email" className="text-neutral-300 font-bold">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-2 bg-[#0a0a0a] border-[#262626] text-white focus-visible:ring-yellow-400 rounded-sm"
              placeholder="your@email.com"
              required
              data-testid="register-email-input"
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
              minLength={6}
              data-testid="register-password-input"
            />
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-yellow-400 text-black hover:bg-yellow-500 rounded-sm font-bold py-6"
            data-testid="register-submit-button"
          >
            {loading ? 'Creating account...' : 'CREATE ACCOUNT'}
          </Button>

          <p className="text-center text-neutral-400 text-sm">
            Already have an account?{' '}
            <Link to="/login" className="text-yellow-400 hover:text-yellow-500 font-bold" data-testid="login-link">
              Login here
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};
