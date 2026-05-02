import React from 'react';
import { NavLink } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { GraduationCap, Sun, Moon, Menu, X } from 'lucide-react';
import { Button } from '../ui';
import { cn } from '../../lib/utils';
import { useTheme } from '../ThemeProvider';

export function Navbar() {
  const { theme, toggleTheme } = useTheme();
  const [isOpen, setIsOpen] = React.useState(false);
  const loggedInUser = JSON.parse(localStorage.getItem('userInfo'));

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Colleges', path: '/colleges' },
    { name: 'Predictor', path: '/predictor' },
    { name: 'AI Mentor', path: '/aimentor' },
  ];

  return (
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
              <NavLink to="/profile" className="flex items-center gap-3 group">
                <div className="flex flex-col items-end">
                  <span className="text-[10px] font-black text-white uppercase tracking-widest leading-none mb-0.5">{loggedInUser.name}</span>
                  <span className="text-[8px] font-bold text-white/40 uppercase tracking-widest leading-none">View Profile</span>
                </div>
                <div className="h-10 w-10 rounded-xl p-0.5 bg-gradient-to-br from-indigo-500/20 to-purple-500/20 group-hover:from-indigo-500 group-hover:to-purple-500 transition-all duration-500">
                  <div className="w-full h-full rounded-[0.6rem] bg-[#0A0C14] overflow-hidden flex items-center justify-center">
                    {loggedInUser.avatar ? (
                      <img src={loggedInUser.avatar} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <GraduationCap className="h-5 w-5 text-indigo-500/50" />
                    )}
                  </div>
                </div>
              </NavLink>
            ) : (
              <div className="flex items-center gap-2">
                <NavLink to="/login">
                  <Button variant="ghost" className="rounded-xl px-4 py-1.5 h-auto text-xs font-bold hover:bg-white/5">
                    Login
                  </Button>
                </NavLink>
                <div className="h-4 w-px bg-border-subtle mx-1" />
                <NavLink to="/signup">
                  <Button className="rounded-xl px-5 py-1.5 h-auto text-xs font-bold shadow-md">
                    Sign Up
                  </Button>
                </NavLink>
              </div>
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
                <div className="pt-4 px-4 flex flex-col items-center">
                  {loggedInUser ? (
                    <div className="w-full space-y-3">
                      <NavLink 
                        to="/profile" 
                        onClick={() => setIsOpen(false)}
                        className="w-full flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/10"
                      >
                        <div className="h-12 w-12 rounded-xl p-0.5 bg-gradient-to-br from-indigo-500 to-purple-500">
                          <div className="w-full h-full rounded-[0.6rem] bg-[#0A0C14] overflow-hidden flex items-center justify-center">
                            {loggedInUser.avatar ? (
                              <img src={loggedInUser.avatar} alt="" className="w-full h-full object-cover" />
                            ) : (
                              <GraduationCap className="h-6 w-6 text-indigo-500/50" />
                            )}
                          </div>
                        </div>
                        <div className="flex flex-col">
                          <span className="text-sm font-black text-white italic">{loggedInUser.name}</span>
                          <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest">Account Settings</span>
                        </div>
                      </NavLink>
                    </div>
                  ) : (
                    <>
                      <NavLink to="/login" onClick={() => setIsOpen(false)} className="w-full">
                        <Button variant="outline" className="w-full py-3 rounded-xl font-bold text-xs">
                          Login
                        </Button>
                      </NavLink>
                      
                      <div className="flex items-center gap-4 w-full my-3">
                        <div className="h-px bg-border-subtle flex-1" />
                        <span className="text-[10px] text-text-muted font-medium uppercase tracking-widest">or</span>
                        <div className="h-px bg-border-subtle flex-1" />
                      </div>

                      <NavLink to="/signup" onClick={() => setIsOpen(false)} className="w-full">
                        <Button className="w-full py-3 rounded-xl font-bold text-xs shadow-lg">
                          Sign Up
                        </Button>
                      </NavLink>
                    </>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
}

