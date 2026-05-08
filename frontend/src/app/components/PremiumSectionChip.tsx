import type { ReactNode } from 'react';
import { cn } from './ui/utils';

export interface PremiumSectionChipProps {
    children: ReactNode;
    className?: string;
    icon?: ReactNode;
}

export function PremiumSectionChip({ children, className, icon }: PremiumSectionChipProps) {
    return (
        <div
            className={cn(
                'inline-flex items-center gap-2 rounded-full border border-[#C6A85B]/30 bg-white/[0.05] px-4 py-1.5 shadow-[0_8px_32px_rgba(0,0,0,0.35),inset_0_1px_0_rgba(255,255,255,0.08)] backdrop-blur-xl sm:gap-2 sm:px-5 sm:py-2',
                className,
            )}
        >
            {icon ? <span className="shrink-0 text-[#E8D5A3]">{icon}</span> : null}
            <span className="font-['Inter'] text-[9px] font-semibold uppercase tracking-[0.22em] text-[#E8D5A3]/90 sm:text-[10px] sm:tracking-[0.24em]">
                {children}
            </span>
        </div>
    );
}
