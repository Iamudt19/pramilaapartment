'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'secondary' | 'outline' | 'ghost' | 'destructive' | 'white' | 'glass';
  size?: 'sm' | 'default' | 'lg' | 'icon';
  loading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'default', size = 'default', loading = false, disabled, children, ...props }, ref) => {
    const baseStyles =
      'inline-flex items-center justify-center whitespace-nowrap rounded-xl text-xs font-semibold ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98] select-none';

    const variants = {
      default: 'bg-white text-black hover:bg-neutral-200 shadow-md',
      white: 'bg-white text-black hover:bg-neutral-100 shadow-lg shadow-white/5 font-bold',
      secondary: 'bg-neutral-900 text-neutral-100 hover:bg-neutral-800 border border-neutral-800',
      outline: 'border border-neutral-700 bg-transparent text-neutral-200 hover:bg-neutral-900 hover:text-white',
      ghost: 'text-neutral-300 hover:bg-neutral-900 hover:text-white',
      destructive: 'bg-red-950/80 border border-red-800/80 text-red-200 hover:bg-red-900',
      glass: 'bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/20',
    };

    const sizes = {
      sm: 'h-8 px-3 text-[11px] gap-1.5',
      default: 'h-10 px-4 py-2 gap-2',
      lg: 'h-12 px-6 text-sm gap-2.5 font-bold',
      icon: 'h-9 w-9 p-0',
    };

    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        {...props}
      >
        {loading && <Loader2 className="w-3.5 h-3.5 animate-spin shrink-0" />}
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';
