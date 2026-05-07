import React from 'react'
import { cn } from '../../lib/utils'
import { cva } from "class-variance-authority";

const buttonVariants = cva(
    "relative group border text-foreground mx-auto text-center rounded-full transition-all duration-300",
    {
        variants: {
            variant: {
                default: "bg-indigo-500/5 hover:bg-indigo-500/0 border-indigo-500/20 shadow-[0_0_20px_-10px_rgba(99,102,241,0.3)]",
                solid: "bg-indigo-600 hover:bg-indigo-700 text-white border-transparent hover:border-foreground/50 shadow-[0_0_30px_-5px_rgba(99,102,241,0.4)]",
                ghost: "border-transparent bg-transparent hover:border-zinc-600 hover:bg-white/10",
            },
            size: {
                default: "px-12 py-4",
                sm: "px-6 py-2",
                lg: "px-16 py-6",
            },
        },
        defaultVariants: {
            variant: "default",
            size: "default",
        },
    }
);

const NeonButton = React.forwardRef(
    ({ className, neon = true, size, variant, children, ...props }, ref) => {
        return (
            <button
                className={cn(buttonVariants({ variant, size }), className)}
                ref={ref}
                {...props}
            >
                {/* Top Neon Glow Line */}
                <span className={cn(
                  "absolute h-px opacity-0 group-hover:opacity-100 transition-all duration-500 ease-in-out inset-x-0 inset-y-0 bg-gradient-to-r w-3/4 mx-auto from-transparent via-indigo-400 to-transparent", 
                  neon ? "block" : "hidden"
                )} />
                
                {children}
                
                {/* Bottom Neon Glow Line */}
                <span className={cn(
                  "absolute group-hover:opacity-100 transition-all duration-500 ease-in-out inset-x-0 h-px -bottom-px bg-gradient-to-r w-3/4 mx-auto from-transparent via-indigo-400 to-transparent", 
                  neon ? "block" : "hidden"
                )} />

                {/* Pulsing Outer Glow */}
                {neon && (
                  <span className="absolute inset-0 rounded-full bg-indigo-500/5 blur-xl group-hover:bg-indigo-500/10 transition-all duration-500 -z-10" />
                )}
            </button>
        );
    }
)

NeonButton.displayName = 'NeonButton';

export { NeonButton, buttonVariants };
