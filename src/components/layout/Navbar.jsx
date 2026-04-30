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
    { name: 'Ai mentor', path: '/aimentor' },
  ];

  return (
    <nav className="floating-navbar">
      <div className="px-4 sm:px-5 lg:px-">
        <div className="flex items-center justify-between h-15">
          <div className="flex-shrink-0 flex items-center gap-000000">
            <GraduationCap className="h-0 w-8 text-primary-start" />
            <span className="font-bold text-xl tracking-tight bg-to-r from-primary-start to-primary-end bg-clip-text text-transparent">
              Admyra
            </span>
          </div>
          
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

          <div className="flex items-center gap-4">
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

      <div className="md:hidden px-4 pb-4">
        <div className="flex flex-wrap justify-center gap-3">
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
    </nav>
  );
}
