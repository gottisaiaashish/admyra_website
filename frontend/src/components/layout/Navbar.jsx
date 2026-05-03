import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { GraduationCap, Sun, Moon, Menu, X, ShieldCheck, PlusSquare, User as UserIcon, LogOut } from 'lucide-react';
import { Button } from '../ui';
import { cn } from '../../lib/utils';
import { useTheme } from '../ThemeProvider';
import { AuthModal } from './AuthModal';

export function Navbar() {
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [loggedInUser, setLoggedInUser] = useState(null);

  // Safety check for profile page to hide navbar
  const isProfilePage = location.pathname && location.pathname.startsWith('/profile');

  // Load user data safely
  useEffect(() => {
    try {
      const saved = localStorage.getItem('userInfo');
      if (saved && saved !== "undefined") {
        setLoggedInUser(JSON.parse(saved));
      } else {
        setLoggedInUser(null);
      }
    } catch (e) {
      console.error('Failed to parse user info', e);
      setLoggedInUser(null);
    }
  }, [location.pathname]);

  if (isProfilePage) return null;

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Colleges', path: '/colleges' },
    { name: 'Predictor', path: '/predictor' },
    { name: 'AI Mentor', path: '/aimentor' },
  ];

  const handleProfileClick = () => {
    if (loggedInUser) {
      navigate(`/profile/${loggedInUser.id}`);
    } else {
      setIsAuthModalOpen(true);
    }
  };

  return (
    <>
      <nav className={cn(
        "floating-navbar transition-all duration-300 overflow-hidden",
        isOpen ? "h-auto pb-4" : ""
      )}>
        <div className=" hidden md:block px-2 sm:px-8 lg:px-0 max-w-7xl mx-auto">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-8">
              <NavLink to="/" className="text-xl font-bold text-text-main mr-4">
                Admyra
              </NavLink>
              <div className="hidden md:block">
                <div className="flex items-baseline space-x-8">
                  {navLinks.map((link) => (
                    <NavLink
                      key={link.name}
                      to={link.path}
                      className={({ isActive }) => cn(
                        "text-sm font-medium transition-colors hover:text-primary-start inline-flex items-center gap-2",
                        isActive ? "text-accent-cyan" : "text-text-muted"
                      )}
                    >
                      <span>{link.name}</span>
                    </NavLink>
                  ))}
                </div>
              </div>
            </div>

            <div className="hidden md:flex items-center gap-4">
              <button
                onClick={toggleTheme}
                className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-800 transition text-text-muted hover:text-text-main mr-2"
                aria-label="Toggle Theme"
              >
                {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              </button>

              {loggedInUser ? (
                <div className="flex items-center gap-4">
                  <button 
                    onClick={() => { localStorage.clear(); window.location.href = '/'; }}
                    className="p-2 rounded-full transition text-rose-500/60 hover:text-rose-500 hover:bg-rose-500/5"
                    title="Logout"
                  >
                    <LogOut className="h-5 w-5" />
                  </button>

                  <div onClick={handleProfileClick} className="h-10 w-10 rounded-full overflow-hidden border border-white/5 hover:border-indigo-500/50 transition-all duration-500 cursor-pointer">
                    <div className="w-full h-full bg-[#0A0C14] flex items-center justify-center">
                      {loggedInUser?.avatar ? (
                        <img src={loggedInUser.avatar} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <UserIcon className="h-5 w-5 text-indigo-500/50" />
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                <button 
                  onClick={handleProfileClick}
                  className="p-2 rounded-full transition text-text-muted hover:text-text-main"
                  aria-label="Login"
                >
                  <UserIcon className="h-5 w-5" />
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="md:hidden px-4">
          <div className="flex items-center justify-between h-16">
            <NavLink to="/" className="text-lg font-bold text-text-main">
              Admyra
            </NavLink>
            
            <div className="flex items-center gap-2">
              {loggedInUser && (
                <button 
                  onClick={() => { localStorage.clear(); window.location.href = '/'; }}
                  className="p-2 rounded-full transition text-rose-500/60"
                >
                  <LogOut className="h-5 w-5" />
                </button>
              )}
              <button 
                onClick={handleProfileClick}
                className="p-2 rounded-full transition text-text-muted hover:text-text-main"
              >
                <UserIcon className="h-5 w-5" />
              </button>
              <button 
                onClick={toggleTheme} 
                className="p-2 rounded-full transition text-text-muted hover:text-text-main"
              >
                {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              </button>
              <button 
                onClick={() => setIsOpen(!isOpen)}
                className="p-2 rounded-lg text-text-muted transition-all active:scale-95"
              >
                {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </button>
            </div>
          </div>

          {/* Mobile Menu Dropdown with Animation */}
          <AnimatePresence>
            {isOpen && (
              <motion.div 
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3, ease: 'easeInOut' }}
                className="overflow-hidden"
              >
                <div className="pt-2 pb-6 space-y-1">
                  {navLinks.map((link) => (
                    <NavLink
                      key={link.name}
                      to={link.path}
                      onClick={() => setIsOpen(false)}
                      className={({ isActive }) => cn(
                        "block px-4 py-3 rounded-xl text-sm font-bold transition-all",
                        isActive 
                          ? "text-text-main" 
                          : "text-text-muted hover:text-text-main"
                      )}
                    >
                      {link.name}
                    </NavLink>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </nav>

      <AuthModal 
        isOpen={isAuthModalOpen} 
        onClose={() => setIsAuthModalOpen(false)} 
      />
    </>
  );
}
