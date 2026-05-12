import { useCallback, useRef, useState } from 'react';
import { cn } from '../../../../utils';

export interface SpotlightCardProps {
    children: React.ReactNode;
    className?: string;
    /** Spotlight tint — default gold for AW Naturals */
    spotlightColor?: string;
}

/**
 * Cursor-following radial highlight (ReactBits-style spotlight card).
 */
export function SpotlightCard({
    children,
    className,
    spotlightColor = 'rgba(212, 175, 55, 0.14)',
}: SpotlightCardProps) {
    const ref = useRef<HTMLDivElement>(null);
    const [pos, setPos] = useState({ x: 0, y: 0 });
    const [active, setActive] = useState(false);

    const onMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
        if (!ref.current) return;
        const r = ref.current.getBoundingClientRect();
        setPos({ x: e.clientX - r.left, y: e.clientY - r.top });
    }, []);

    return (
        <div
            ref={ref}
            role="presentation"
            onMouseMove={onMove}
            onMouseEnter={() => setActive(true)}
            onMouseLeave={() => {
                setActive(false);
            }}
            className={cn('relative overflow-hidden rounded-2xl border border-white/[0.08]', className)}
            style={{
                background: active
                    ? `radial-gradient(520px circle at ${pos.x}px ${pos.y}px, ${spotlightColor}, rgba(18,18,18,0.97) 45%)`
                    : 'rgba(18,18,18,0.85)',
            }}
        >
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-white/[0.04] to-transparent" />
            {children}
        </div>
    );
}
