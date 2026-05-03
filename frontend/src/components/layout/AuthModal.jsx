import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Mail, Lock, User, ArrowRight } from 'lucide-react';
import { Button } from '../ui';
import { login, signup, googleAuth } from '../../api';

export function AuthModal({ isOpen, onClose, initialMode = 'choice' }) {
  const [mode, setMode] = useState(initialMode);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Form State
  const [formData, setFormData] = useState({
    name: '',
    username: '',
    email: '',
    password: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const { data } = mode === 'login' 
        ? await login({ email: formData.email, password: formData.password })
        : await signup(formData);
      
      localStorage.setItem('userInfo', JSON.stringify(data));
      onClose();
      window.location.reload(); // Refresh to update navbar state
    } catch (err) {
      setError(err.response?.data?.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-md bg-[#0A0C14] border border-white/10 rounded-[2.5rem] p-8 shadow-2xl overflow-hidden"
        >
          {/* Background Glow */}
          <div className="absolute -top-24 -left-24 w-48 h-48 bg-indigo-600/20 rounded-full blur-[80px]" />
          <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-purple-600/20 rounded-full blur-[80px]" />

          <button 
            onClick={onClose}
            className="absolute top-6 left-6 p-2 rounded-full hover:bg-white/5 text-white/40 hover:text-white transition-all z-10"
          >
            <ArrowLeft size={20} />
          </button>

          <div className="relative z-10">
            {mode === 'choice' ? (
              <div className="text-center py-8">
                <div className="h-20 w-20 bg-indigo-600/10 rounded-full flex items-center justify-center mx-auto mb-8 border border-indigo-500/20">
                  <User size={32} className="text-indigo-400" />
                </div>
                <h2 className="text-3xl font-black italic tracking-tighter text-white mb-4 uppercase">
                  Login or Signup First.
                </h2>
                <p className="text-sm text-white/40 font-medium mb-10 max-w-[240px] mx-auto leading-relaxed italic">
                  You need to have an account to access this feature.
                </p>
                <div className="space-y-4">
                  <Button 
                    onClick={() => setMode('signup')}
                    className="w-full py-5 rounded-2xl font-black text-xs uppercase tracking-[0.2em] bg-white text-black hover:bg-white/90 shadow-xl shadow-white/5"
                  >
                    Signup Now <ArrowRight size={16} className="ml-2 inline" />
                  </Button>
                  <Button 
                    variant="ghost"
                    onClick={() => setMode('login')}
                    className="w-full py-5 rounded-2xl font-black text-xs uppercase tracking-[0.2em] text-white/60 hover:text-white hover:bg-white/5"
                  >
                    Already have an account? Login
                  </Button>
                </div>
              </div>
            ) : (
              <>
                <div className="text-center mb-8">
                  <h2 className="text-3xl font-black italic tracking-tighter text-white mb-2">
                    {mode === 'login' ? 'WELCOME BACK' : 'JOIN ADMYRA'}
                  </h2>
                  <p className="text-sm text-white/40 font-medium">
                    {mode === 'login' ? 'Enter your credentials to continue' : 'Create an account to get started'}
                  </p>
                </div>

                {error && (
                  <motion.div 
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="mb-6 p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-500 text-xs font-bold text-center italic"
                  >
                    {error}
                  </motion.div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                  {mode === 'signup' && (
                    <>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-white/40 ml-1">Full Name</label>
                        <div className="relative group">
                          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-white/20 group-focus-within:text-indigo-400 transition-colors">
                            <User size={18} />
                          </div>
                          <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            className="w-full bg-white/5 border border-white/10 rounded-2xl py-3.5 pl-12 pr-4 text-white placeholder:text-white/10 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all font-medium text-sm"
                            placeholder="John Doe"
                            required
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-white/40 ml-1">Username</label>
                        <div className="relative group">
                          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-white/20 group-focus-within:text-indigo-400 transition-colors">
                            <span className="font-bold text-lg">@</span>
                          </div>
                          <input
                            type="text"
                            name="username"
                            value={formData.username}
                            onChange={handleChange}
                            className="w-full bg-white/5 border border-white/10 rounded-2xl py-3.5 pl-10 pr-4 text-white placeholder:text-white/10 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all font-medium text-sm"
                            placeholder="johndoe"
                            required
                          />
                        </div>
                      </div>
                    </>
                  )}

                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-white/40 ml-1">
                      {mode === 'login' ? 'Email or Username' : 'Email Address'}
                    </label>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-white/20 group-focus-within:text-indigo-400 transition-colors">
                        <Mail size={18} />
                      </div>
                      <input
                        type={mode === 'login' ? 'text' : 'email'}
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full bg-white/5 border border-white/10 rounded-2xl py-3.5 pl-12 pr-4 text-white placeholder:text-white/10 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all font-medium text-sm"
                        placeholder={mode === 'login' ? "Username or email" : "name@example.com"}
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between items-center px-1">
                      <label className="text-[10px] font-black uppercase tracking-widest text-white/40">Password</label>
                      {mode === 'login' && (
                        <button type="button" className="text-[10px] font-bold text-indigo-400 hover:underline">Forgot?</button>
                      )}
                    </div>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-white/20 group-focus-within:text-indigo-400 transition-colors">
                        <Lock size={18} />
                      </div>
                      <input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        className="w-full bg-white/5 border border-white/10 rounded-2xl py-3.5 pl-12 pr-4 text-white placeholder:text-white/10 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all font-medium text-sm"
                        placeholder="••••••••"
                        required
                      />
                    </div>
                  </div>

                  <Button 
                    type="submit" 
                    disabled={loading}
                    className="w-full py-4 rounded-2xl font-black text-xs uppercase tracking-[0.2em] bg-white text-black hover:bg-white/90 shadow-xl shadow-white/5 mt-4"
                  >
                    {loading ? 'PROCESSING...' : (mode === 'login' ? 'LOGIN NOW' : 'CREATE ACCOUNT')}
                  </Button>

                  <div className="mt-8 text-center">
                    <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest">
                      {mode === 'login' ? "Don't have an account?" : "Already have an account?"}
                      <button 
                        type="button"
                        onClick={() => setMode(mode === 'login' ? 'signup' : 'login')}
                        className="ml-2 text-indigo-400 hover:text-indigo-300 transition-colors"
                      >
                        {mode === 'login' ? 'SIGNUP NOW' : 'LOGIN HERE'}
                      </button>
                    </p>
                  </div>
                </form>
              </>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
