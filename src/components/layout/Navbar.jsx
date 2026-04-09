import React from 'react';
import { NavLink } from 'react-router-dom';
import { GraduationCap, Sun, Moon } from 'lucide-react';
import { Button } from '../ui';
import { cn } from '../../lib/utils';
import { useTheme } from '../ThemeProvider';

export function Navbar() {
  const { theme, toggleTheme } = useTheme();
  
  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Colleges', path: '/colleges' },
    { name: 'Predictor', path: '/predictor' }
  ];

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border-subtle bg-background/80 backdrop-blur-md">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex-shrink-0 flex items-center gap-2">
            <GraduationCap className="h-8 w-8 text-primary-start" />
            <span className="font-bold text-xl tracking-tight bg-black from-primary-start to-primary-end bg-clip-text text-transparent">
              Admyra
            </span>
          </div>
          
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-8">
              {navLinks.map((link) => (
                <NavLink
                  key={link.name}
                  to={link.path}
                  className={({ isActive }) => cn(
                    "text-sm font-medium transition-colors hover:text-primary-start",
                    isActive ? "text-accent-cyan" : "text-text-muted"
                  )}
                >
                  {link.name}
                </NavLink>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button 
              onClick={toggleTheme} 
              className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-800 transition text-text-muted hover:text-text-main"
              aria-label="Toggle Theme"
            >
              {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>
            <Button variant="ghost" className="hidden sm:inline-flex">Log in</Button>
            <Button variant="primary">Sign up</Button>
          </div>
        </div>
      </div>
    </nav>
  );
}
