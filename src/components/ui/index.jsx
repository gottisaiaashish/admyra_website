import React from 'react';
import { cn } from '../../lib/utils';
import { Star } from 'lucide-react';

export const Button = React.forwardRef(({ className, variant = 'primary', size = 'default', ...props }, ref) => {
  const baseStyles = "inline-flex items-center justify-center rounded-xl font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-indigo disabled:opacity-50 disabled:pointer-events-none";
  
  const variants = {
    primary: "bg-gradient-to-r from-primary-start to-primary-end text-white hover:opacity-90 shadow-lg shadow-primary-start/20",
    outline: "border border-border-subtle hover:bg-black/5 dark:hover:bg-white/5 text-text-main",
    ghost: "hover:bg-black/5 dark:hover:bg-white/5 text-text-main"
  };

  const sizes = {
    default: "h-10 py-2 px-4",
    sm: "h-9 px-3 rounded-md",
    lg: "h-12 px-8 rounded-xl text-lg"
  };

  return (
    <button
      ref={ref}
      className={cn(baseStyles, variants[variant], sizes[size], className)}
      {...props}
    />
  );
});
Button.displayName = "Button";

export const Card = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("rounded-2xl border border-border-subtle bg-card text-text-main shadow-sm overflow-hidden", className)}
    {...props}
  />
));
Card.displayName = "Card";

export const Badge = ({ className, variant = 'default', ...props }) => {
  const variants = {
    default: "bg-border-subtle text-text-main",
    success: "bg-green-500/20 text-green-600 dark:text-green-400 border border-green-500/30",
    warning: "bg-yellow-500/20 text-yellow-600 dark:text-yellow-400 border border-yellow-500/30",
    danger: "bg-red-500/20 text-red-600 dark:text-red-400 border border-red-500/30",
    brand: "bg-accent-indigo/20 text-accent-indigo dark:text-indigo-300 border border-accent-indigo/30"
  };
  return (
    <div className={cn("inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-accent-indigo", variants[variant], className)} {...props} />
  );
};

export const Input = React.forwardRef(({ className, type, ...props }, ref) => (
  <input
    type={type}
    className={cn(
      "flex h-12 w-full rounded-xl border border-border-subtle bg-background px-4 py-2 text-sm text-text-main ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-text-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-indigo focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-all",
      className
    )}
    ref={ref}
    {...props}
  />
));
Input.displayName = "Input";

export const Select = React.forwardRef(({ className, children, ...props }, ref) => (
  <select
    className={cn(
      "flex h-12 w-full items-center justify-between rounded-xl border border-border-subtle bg-background px-4 py-2 text-sm text-text-main ring-offset-background placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-accent-indigo focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-all appearance-none",
      className
    )}
    ref={ref}
    {...props}
  >
    {children}
  </select>
));
Select.displayName = "Select";

export const RatingStars = ({ rating }) => {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={cn(
            "w-4 h-4",
            star <= rating ? "fill-yellow-400 text-yellow-500 dark:text-yellow-400" : "text-gray-300 dark:text-gray-600"
          )}
        />
      ))}
    </div>
  );
};
