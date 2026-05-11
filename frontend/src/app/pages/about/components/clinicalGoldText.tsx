import { memo, type ReactNode } from 'react';

export interface ClinicalGoldTextProps {
    children: ReactNode;
    className?: string;
}

export const ClinicalGoldText = memo(function ClinicalGoldText({
    children,
    className = '',
}: ClinicalGoldTextProps) {
    return (
        <span
            className={`italic bg-gradient-to-r from-[#C6A85B] via-[#E5D08A] to-[#C6A85B] bg-clip-text text-transparent drop-shadow-[0_2px_14px_rgba(198,168,91,0.25)] ${className}`}
        >
            {children}
        </span>
    );
});
