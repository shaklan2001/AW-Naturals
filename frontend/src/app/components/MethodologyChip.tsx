import type { ReactNode } from 'react';
import { cn } from './ui/utils';

export interface MethodologyChipProps {
    children?: ReactNode;
    className?: string;
}

export function MethodologyChip({ children = 'The AW Naturals Methodology', className }: MethodologyChipProps) {
    return (
        <div
            className={cn(
                'inline-flex items-center gap-2.5 rounded-full border border-[#C6A85B]/50 bg-[#0B0B0B]/20 px-5 py-2 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] backdrop-blur-md sm:gap-3 sm:px-6 sm:py-2.5',
                className,
            )}
        >
            <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-[#D4AF37]" aria-hidden />
            <span className="font-['Inter'] text-[9px] font-medium uppercase tracking-[0.26em] text-[#D4AF37] sm:text-[10px] sm:tracking-[0.3em]">
                {children}
            </span>
        </div>
    );
}
