import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { Link } from 'react-router';
import { motion } from 'motion/react';
import { cn } from './ui/utils';

const gradientStyle = { background: 'linear-gradient(90deg, #C6A85B, #E5D08A)' } as const;

function GoldCtaInner({ children }: { children: ReactNode }) {
    return (
        <>
            <span className="relative z-10 flex items-center justify-center gap-2 font-['Inter'] text-[14px] font-medium tracking-[0.02em] text-[#0B0B0B] sm:justify-start">
                {children}
                <svg
                    className="h-4 w-4 shrink-0 transition-transform duration-300 group-hover:translate-x-1"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    aria-hidden
                >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
            </span>
            <div
                className="pointer-events-none absolute inset-0 z-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                style={{ boxShadow: '0 0 24px rgba(212,175,55,0.4)' }}
            />
            <motion.div
                initial={{ x: '-100%' }}
                animate={{ x: '200%' }}
                transition={{
                    repeat: Infinity,
                    repeatDelay: 1.5,
                    duration: 2,
                    ease: 'linear',
                }}
                className="pointer-events-none absolute left-0 top-0 z-0 h-full w-[40%] -skew-x-[20deg]"
                style={{
                    background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.5), transparent)',
                }}
            />
        </>
    );
}

const surfaceClassName =
    'group relative w-full overflow-hidden rounded-full px-8 py-4 transition-all duration-300 sm:w-auto';

export interface PremiumGoldCtaLinkProps {
    to: string;
    children: ReactNode;
    className?: string;
}

/** Matches home hero Shop Now — gold gradient pill, arrow, shine sweep. */
export function PremiumGoldCtaLink({ to, children, className }: PremiumGoldCtaLinkProps) {
    return (
        <Link to={to} className={cn('inline-flex w-full sm:w-auto', className)}>
            <span
                className={cn(surfaceClassName, 'flex items-center justify-center sm:justify-start')}
                style={gradientStyle}
            >
                <GoldCtaInner>{children}</GoldCtaInner>
            </span>
        </Link>
    );
}

export interface PremiumGoldCtaButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'className'> {
    children: ReactNode;
    className?: string;
}

export function PremiumGoldCtaButton({ children, className, type = 'button', disabled, ...rest }: PremiumGoldCtaButtonProps) {
    if (disabled) {
        return (
            <button
                type={type}
                disabled
                className={cn(
                    "inline-flex min-h-[52px] items-center justify-center gap-2 rounded-full bg-white/5 px-8 py-4 font-['Inter'] text-[14px] font-medium tracking-[0.02em] text-white/25",
                    className,
                )}
                {...rest}
            >
                {children}
                <svg className="h-4 w-4 shrink-0 opacity-40" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
            </button>
        );
    }

    return (
        <button
            type={type}
            className={cn(surfaceClassName, 'inline-flex items-center justify-center', className)}
            style={gradientStyle}
            {...rest}
        >
            <GoldCtaInner>{children}</GoldCtaInner>
        </button>
    );
}

export interface PremiumGoldCtaAnchorProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
    children: ReactNode;
    className?: string;
}

export function PremiumGoldCtaAnchor({ children, className, href, ...rest }: PremiumGoldCtaAnchorProps) {
    return (
        <a href={href} className={cn('inline-flex w-full sm:w-auto', className)} {...rest}>
            <span
                className={cn(surfaceClassName, 'flex items-center justify-center sm:justify-start')}
                style={gradientStyle}
            >
                <GoldCtaInner>{children}</GoldCtaInner>
            </span>
        </a>
    );
}
