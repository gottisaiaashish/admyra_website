import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, User, ArrowRight } from 'lucide-react';
import { Button } from '../components/ui';
import { useGoogleLogin } from '@react-oauth/google';
import { signup, googleAuth } from '../api';

export function Signup() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const { data } = await signup({ name, email, password });
      localStorage.setItem('userInfo', JSON.stringify(data));
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Signup failed');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = useGoogleLogin({
    onSuccess: async (response) => {
      try {
        const { data } = await googleAuth(response.access_token);
        localStorage.setItem('userInfo', JSON.stringify(data));
        navigate('/');
      } catch (err) {
        setError('Google login failed');
      }
    },
    onError: () => setError('Google Login Failed'),
  });

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-sm"
      >
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-5 shadow-2xl">
          <div className="text-center mb-4">
            <h1 className="text-xl font-bold text-white">Create Account</h1>
          </div>

          {error && (
            <div className="bg-rose-500/10 border border-rose-500/20 text-rose-500 text-[10px] p-3 rounded-xl mb-4 text-center font-bold">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-3">
            <div className="space-y-2">
              <label className="text-sm font-medium text-text-muted ml-1">Full Name</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-text-muted group-focus-within:text-primary-start transition-colors">
                  <User size={18} />
                </div>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 pl-12 pr-4 text-text-main focus:outline-none focus:ring-2 focus:ring-primary-start/50 focus:border-primary-start transition-all"
                  placeholder="John Doe"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-text-muted ml-1">Email Address</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-text-muted group-focus-within:text-primary-start transition-colors">
                  <Mail size={18} />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 pl-12 pr-4 text-text-main focus:outline-none focus:ring-2 focus:ring-primary-start/50 focus:border-primary-start transition-all"
                  placeholder="name@example.com"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-text-muted ml-1">Password</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-text-muted group-focus-within:text-primary-start transition-colors">
                  <Lock size={18} />
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 pl-12 pr-4 text-text-main focus:outline-none focus:ring-2 focus:ring-primary-start/50 focus:border-primary-start transition-all"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            <div className="flex items-center gap-2 ml-1 pb-1">
              <input type="checkbox" id="terms" required className="w-3 h-3 rounded border-white/10 bg-white/5 text-primary-start focus:ring-primary-start/50" />
              <label htmlFor="terms" className="text-[10px] text-white/40">
                I agree to the <Link to="/terms" name="terms-link" className="text-primary-start hover:underline">Terms</Link> and <Link to="/privacy" name="privacy-link" className="text-primary-start hover:underline">Privacy</Link>
              </label>
            </div>

            <Button 
              type="submit" 
              disabled={loading}
              className="w-full py-3.5 rounded-2xl font-bold flex items-center justify-center text-sm"
            >
              {loading ? 'Creating Account...' : 'Sign Up'}
            </Button>

            <button 
              type="button" 
              onClick={() => handleGoogleLogin()}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-2xl bg-white/5 border border-white/10 text-white/60 hover:bg-white/10 transition-all text-[11px] font-medium mt-1"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
              Continue with Google
            </button>
          </form>

          <p className="mt-4 text-center text-xs text-text-muted">
            Already have an account? {' '}
            <Link to="/login" name="login-link" className="text-primary-start font-bold hover:underline">Login</Link>
          </p>
        </div>
      </motion.div>
  );
}
