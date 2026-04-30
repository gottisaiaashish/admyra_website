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
    { name: 'Predictor', path: '/predictor' },
  ];

  return (
    <nav className="floating-navbar">
      <div className="px-2 sm:px-5 lg:px-0 max-w-7xl mx-auto">
        <div className="flex items-center justify-between h-5">
          
          <div className="hidden md:block">
            <div className="ml-1 flex items-baseline space-x-8">
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
                    {link.comingSoon && (
                      <span className="rounded-full bg-primary-start/10 text-primary-start text-[10px] font-semibold uppercase tracking-[0.24em] px-2 py-1">
                        Coming soon
                      </span>
                    )}
                  </NavLink>
              ))}
            </div>
          </div>

          <div className="hidden md:flex items-center gap-4">
            <button 
              onClick={toggleTheme} 
              className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-800 transition text-text-muted hover:text-text-main"
              aria-label="Toggle Theme"
            >
              {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>
            <Button variant="ghost"  ></Button>
            <Button variant="ghost"></Button>
          </div>
        </div>
      </div>

      <div className="md:hidden px-3 py-0 pb-2 h-10">
        <div className="flex items-center gap-11">
          <div className="flex-1 flex items-center justify-between gap-4">
            {navLinks.map((link) => (
              <NavLink
                key={link.name}
                to={link.path}
                className={({ isActive }) => cn(
                  "flex-1 min-w-0 text-sm font-semibold transition-colors hover:text-primary-start rounded-full text-center truncate",
                  isActive ? "text-accent-cyan" : "text-text-muted"
                )}
              >
                {link.name}
              </NavLink>
            ))}
          </div>

          <button 
            onClick={toggleTheme} 
            className="px-2 py-0 flex-none p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-800 transition text-text-muted hover:text-text-main"
            aria-label="Toggle Theme"
          >
            {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </button>
        </div>
      </div>
    </nav>
  );
}

