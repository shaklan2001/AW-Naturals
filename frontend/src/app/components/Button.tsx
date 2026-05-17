import React from 'react';
import { cn } from '../utils';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'solid' | 'ghost' | 'gold';
  children: React.ReactNode;
}

export function Button({ variant = 'solid', className, children, ...props }: ButtonProps) {
  return (
    <button
      className={cn(
        'font-[Inter] text-[13px] rounded-[10px] px-4 py-[12px] transition-all duration-[0.22s] ease-in-out font-semibold',
        variant === 'solid' && 'bg-[#3d1a0a] text-[#f0e8d4] hover:bg-[#5c2d14] hover:-translate-y-[1px] active:bg-[#2e1208] active:scale-98',
        variant === 'ghost' && 'bg-transparent text-[#3d1a0a] border-[1.5px] border-[rgba(61,26,10,0.30)] py-[11px] hover:bg-[rgba(61,26,10,0.07)] hover:border-[rgba(61,26,10,0.45)]',
        variant === 'gold' && 'bg-[#d4af37] text-[#0c0907] hover:brightness-110 active:scale-98',
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}
