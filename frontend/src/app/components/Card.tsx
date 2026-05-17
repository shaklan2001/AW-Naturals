import React from 'react';
import { cn } from '../utils';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  isBundle?: boolean;
  isQuizSelected?: boolean;
}

export function Card({ children, className, isBundle, isQuizSelected, ...props }: CardProps) {
  // Base shell styles
  const baseClasses = 'relative rounded-[18px] transition-all duration-200 ease-out overflow-hidden bg-[#f0e8d4] group';
  
  const borderClasses = isQuizSelected 
    ? 'border-2 border-[#3d1a0a]' 
    : isBundle 
      ? 'border-[1.5px] border-[#5c2d14]'
      : 'border border-[#c8bba0]';
      
  const bgOverride = isQuizSelected ? 'bg-[#e8ddc6]' : '';

  // Box Shadows
  const baseShadow = '0px 8px 30px rgba(0,0,0,0.30), 0px 2px 6px rgba(0,0,0,0.12), inset 0px 1px 0px rgba(255,255,255,0.70)';
  const hoverShadow = '0px 20px 50px rgba(0,0,0,0.36), 0px 3px 8px rgba(0,0,0,0.15), inset 0px 1px 0px rgba(255,255,255,0.75)';
  const bundleShadow = '0px 12px 40px rgba(61,26,10,0.22), ' + baseShadow;
  const bundleHoverShadow = '0px 24px 60px rgba(61,26,10,0.30), ' + hoverShadow;

  return (
    <div
      className={cn(baseClasses, borderClasses, bgOverride, 'hover:-translate-y-[5px]', className)}
      style={{
        boxShadow: isBundle ? bundleShadow : baseShadow,
        // Using CSS variables to handle the hover state for shadow since arbitrary complex shadows in Tailwind can get messy.
        '--hover-shadow': isBundle ? bundleHoverShadow : hoverShadow,
      } as React.CSSProperties}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLElement).style.boxShadow = isBundle ? bundleHoverShadow : hoverShadow;
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLElement).style.boxShadow = isBundle ? bundleShadow : baseShadow;
      }}
      {...props}
    >
      {/* Top-left shimmer layer */}
      <div 
        className="absolute top-0 left-0 pointer-events-none rounded-[18px] z-0"
        style={{
          width: '54%',
          height: '46%',
          background: 'linear-gradient(135deg, rgba(255,255,255,0.24) 0%, transparent 62%)'
        }}
      />
      {/* Content wrapper */}
      <div className="relative z-10 w-full h-full">
        {children}
      </div>
    </div>
  );
}
