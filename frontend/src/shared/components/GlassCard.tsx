import * as React from 'react';
import { cn } from '@/app/components/ui/utils';
import { motion, HTMLMotionProps } from 'motion/react';

export interface GlassCardProps extends HTMLMotionProps<'div'> {
    hoverEffect?: boolean;
}

export const GlassCard = React.forwardRef<HTMLDivElement, GlassCardProps>(
    ({ className, hoverEffect = true, children, ...props }, ref) => {
        return (
            <motion.div
                ref={ref}
                whileHover={hoverEffect ? { scale: 1.02, y: -6 } : undefined}
                transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
                className={cn(
                    'relative bg-gradient-to-br from-[rgba(245,245,220,0.97)] via-[rgba(243,241,213,0.93)] to-[rgba(240,237,205,0.90)]',
                    'border border-[rgba(180,155,80,0.35)]',
                    'rounded-2xl overflow-hidden',
                    'shadow-[0_8px_28px_rgba(0,0,0,0.28),0_2px_6px_rgba(0,0,0,0.10),inset_0_1px_0_rgba(255,255,255,0.65)]',
                    hoverEffect &&
                        'hover:bg-gradient-to-br hover:from-[rgba(245,240,210,0.98)] hover:via-[rgba(243,241,213,0.95)] hover:to-[rgba(240,237,205,0.92)]',
                    hoverEffect && 'hover:border-[rgba(184,134,11,0.55)]',
                    hoverEffect &&
                        'hover:shadow-[0_20px_56px_rgba(0,0,0,0.35),0_4px_16px_rgba(0,0,0,0.15),inset_0_1px_0_rgba(255,255,255,0.75)]',
                    'transition-all duration-[250ms] ease-[cubic-bezier(0.4,0,0.2,1)]',
                    className
                )}
                {...props}
            >
                {/* Grain texture overlay */}
                <div
                    className="pointer-events-none absolute inset-0 opacity-50 mix-blend-overlay rounded-2xl"
                    style={{
                        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.04'/%3E%3C/svg%3E")`,
                    }}
                />

                {/* Light source shimmer (top-left) */}
                <div
                    className="absolute top-0 left-0 w-[52%] h-[44%] rounded-2xl bg-gradient-to-br from-[rgba(255,255,255,0.22)] to-transparent pointer-events-none"
                    style={{ background: 'linear-gradient(135deg, rgba(255,255,255,0.22) 0%, transparent 62%)' }}
                />

                <div className="relative z-10">{children}</div>
            </motion.div>
        );
    }
);

GlassCard.displayName = 'GlassCard';
