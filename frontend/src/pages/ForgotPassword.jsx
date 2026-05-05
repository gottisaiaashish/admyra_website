import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, Key, ArrowRight, ShieldCheck, ChevronLeft, Eye, EyeOff } from 'lucide-react';
import { Button } from '../components/ui';
import { forgotPassword, verifyOTP, resetPassword } from '../api';
import SEO from '../components/SEO';

export function ForgotPassword() {
  const [step, setStep] = useState(1); // 1: Identifier, 2: OTP, 3: New Password
  const [identifier, setIdentifier] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleSendOTP = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await forgotPassword(identifier);
      setStep(2);
      setSuccess('OTP sent to your registered email');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await verifyOTP(identifier, otp);
      setStep(3);
      setSuccess('OTP verified! Set your new password');
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid or expired OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    setLoading(true);
    setError('');
    try {
      await resetPassword({ identifier, otp, newPassword });
      setSuccess('Password reset successful! Redirecting to login...');
      setTimeout(() => navigate('/login'), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to reset password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center p-4">
      <SEO 
        title="Reset Your Password"
        description="Recover your Admyra account access securely. Enter your email or username to receive a password reset OTP."
      />
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-sm"
      >
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 shadow-2xl relative overflow-hidden">
          {/* Background Glow */}
          <div className="absolute -top-24 -right-24 w-48 h-48 bg-indigo-500/20 blur-[80px] rounded-full pointer-events-none" />
          
          <div className="text-center mb-6 relative">
            <Link to="/login" className="absolute left-0 top-1 text-white/40 hover:text-white transition-colors">
              <ChevronLeft size={20} />
            </Link>
            <h1 className="text-xl font-bold text-white">Reset Password</h1>
            <p className="text-[11px] text-white/40 mt-1">Securely recover your account access</p>
          </div>

          <AnimatePresence mode="wait">
            {error && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-rose-500/10 border border-rose-500/20 text-rose-500 text-[10px] p-3 rounded-xl mb-4 text-center font-bold"
              >
                {error}
              </motion.div>
            )}

            {success && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-[10px] p-3 rounded-xl mb-4 text-center font-bold"
              >
                {success}
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.form 
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                onSubmit={handleSendOTP} 
                className="space-y-4"
              >
                <div className="space-y-2">
                  <label className="text-xs font-medium text-text-muted ml-1 uppercase tracking-widest">Identify Yourself</label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-text-muted group-focus-within:text-indigo-400 transition-colors">
                      <Mail size={18} />
                    </div>
                    <input
                      type="text"
                      value={identifier}
                      onChange={(e) => setIdentifier(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-2xl py-3.5 pl-12 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all placeholder:text-white/20"
                      placeholder="Email or Username"
                      required
                    />
                  </div>
                </div>
                <Button 
                  type="submit" 
                  disabled={loading}
                  className="w-full py-4 rounded-2xl font-black flex items-center justify-center text-xs uppercase tracking-widest gap-2"
                >
                  {loading ? 'Sending OTP...' : 'Send OTP'}
                  <ArrowRight size={14} />
                </Button>
              </motion.form>
            )}

            {step === 2 && (
              <motion.form 
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                onSubmit={handleVerifyOTP} 
                className="space-y-4"
              >
                <div className="space-y-2">
                  <label className="text-xs font-medium text-text-muted ml-1 uppercase tracking-widest text-center block w-full">Enter 6-Digit OTP</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-indigo-400">
                      <Key size={18} />
                    </div>
                    <input
                      type="text"
                      maxLength={6}
                      value={otp}
                      onChange={(e) => setOtp(e.target.value.replace(/[^0-9]/g, ''))}
                      className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-center text-2xl font-black tracking-[0.5em] text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all"
                      placeholder="000000"
                      required
                    />
                  </div>
                </div>
                <Button 
                  type="submit" 
                  disabled={loading}
                  className="w-full py-4 rounded-2xl font-black flex items-center justify-center text-xs uppercase tracking-widest gap-2"
                >
                  {loading ? 'Verifying...' : 'Verify OTP'}
                  <ShieldCheck size={16} />
                </Button>
                <button 
                  type="button" 
                  onClick={() => setStep(1)}
                  className="w-full text-center text-[10px] text-white/40 hover:text-white transition-colors uppercase font-bold"
                >
                  Change Email/Username
                </button>
              </motion.form>
            )}

            {step === 3 && (
              <motion.form 
                key="step3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                onSubmit={handleResetPassword} 
                className="space-y-4"
              >
                <div className="space-y-3">
                  <div className="space-y-2">
                    <label className="text-xs font-medium text-text-muted ml-1 uppercase tracking-widest">New Password</label>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-text-muted group-focus-within:text-indigo-400">
                        <Lock size={18} />
                      </div>
                      <input
                        type={showPassword ? "text" : "password"}
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-2xl py-3.5 pl-12 pr-12 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all placeholder:text-white/20"
                        placeholder="••••••••"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-0 pr-4 flex items-center text-white/20 hover:text-white/60 transition-colors"
                      >
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-medium text-text-muted ml-1 uppercase tracking-widest">Confirm Password</label>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-text-muted group-focus-within:text-indigo-400">
                        <Lock size={18} />
                      </div>
                      <input
                        type={showPassword ? "text" : "password"}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-2xl py-3.5 pl-12 pr-12 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all placeholder:text-white/20"
                        placeholder="••••••••"
                        required
                      />
                    </div>
                  </div>
                </div>

                <Button 
                  type="submit" 
                  disabled={loading}
                  className="w-full py-4 rounded-2xl font-black flex items-center justify-center text-xs uppercase tracking-widest gap-2"
                >
                  {loading ? 'Resetting...' : 'Update Password'}
                </Button>
              </motion.form>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}
