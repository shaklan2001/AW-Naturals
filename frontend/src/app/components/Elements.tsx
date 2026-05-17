import React from 'react';
import { cn } from '../utils';

export function IconCircle({ children, className }: { children: React.ReactNode, className?: string }) {
  return (
    <div 
      className={cn(
        "flex items-center justify-center rounded-full shrink-0",
        "w-[56px] h-[56px]",
        "bg-[rgba(93,40,15,0.08)] border border-[rgba(93,40,15,0.20)] shadow-[inset_0px_1px_3px_rgba(0,0,0,0.08)]",
        "[&_svg]:stroke-[#6b3018] [&_svg]:stroke-[1.5px] [&_svg]:opacity-88",
        className
      )}
    >
      {children}
    </div>
  );
}

export function TagPill({ children, className }: { children: React.ReactNode, className?: string }) {
  return (
    <span 
      className={cn(
        "inline-flex items-center rounded-full px-[10px] py-[3px]",
        "bg-[rgba(184,154,106,0.16)] border border-[rgba(184,154,106,0.45)]",
        "text-[#7a5520] font-[Inter] font-bold text-[9px] tracking-[0.8px] uppercase",
        className
      )}
    >
      {children}
    </span>
  );
}

export function TipPill({ children, className }: { children: React.ReactNode, className?: string }) {
  return (
    <span 
      className={cn(
        "inline-flex items-center rounded-full px-[13px] py-[5px]",
        "bg-[rgba(184,154,106,0.14)] border border-[rgba(184,154,106,0.38)]",
        "text-[#7a5520] font-[Inter] font-bold text-[9.5px] tracking-[0.6px] uppercase",
        className
      )}
    >
      {children}
    </span>
  );
}

export function Divider({ className }: { className?: string }) {
  return (
    <div className={cn("border-t border-[rgba(93,40,15,0.12)] w-full", className)} />
  );
}

export function StepCircle({ number, className }: { number: number, className?: string }) {
  return (
    <div 
      className={cn(
        "flex items-center justify-center shrink-0",
        "w-[38px] h-[38px] rounded-full bg-[#3d1a0a]",
        "text-[#f0e8d4] font-['Playfair_Display'] font-semibold text-[18px]",
        "shadow-[0px_4px_14px_rgba(61,26,10,0.40)]",
        className
      )}
    >
      {number}
    </div>
  );
}
