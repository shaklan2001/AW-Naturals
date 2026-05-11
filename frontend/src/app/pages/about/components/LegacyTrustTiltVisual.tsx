import React, { useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'motion/react';

const spring = { stiffness: 380, damping: 34 };

const creamShellStyle = {
    background: 'linear-gradient(145deg, rgba(20,20,20,0.95) 0%, rgba(10,10,10,0.98) 100%)',
    boxShadow: '0 28px 64px rgba(0,0,0,0.48), inset 0 1px 0 rgba(255,255,255,0.05)',
} as const;

export function LegacyTrustTiltVisual() {
    const wrapRef = useRef<HTMLDivElement>(null);
    const mx = useMotionValue(0);
    const my = useMotionValue(0);

    const rotateX = useSpring(useTransform(my, [-0.5, 0.5], [7.5, -7.5]), spring);
    const rotateY = useSpring(useTransform(mx, [-0.5, 0.5], [-11, 11]), spring);

    const setFromEvent = (clientX: number, clientY: number) => {
        const el = wrapRef.current;
        if (!el) return;
        const r = el.getBoundingClientRect();
        mx.set((clientX - r.left) / r.width - 0.5);
        my.set((clientY - r.top) / r.height - 0.5);
    };

    const handlePointerMove = (e: React.PointerEvent) => {
        setFromEvent(e.clientX, e.clientY);
    };

    const handlePointerLeave = () => {
        mx.set(0);
        my.set(0);
    };

    return (
        <div
            ref={wrapRef}
            className="legacy-trust-tilt group relative flex w-full max-w-[520px] items-center justify-center [perspective:1400px]"
            onPointerMove={handlePointerMove}
            onPointerLeave={handlePointerLeave}
            onPointerCancel={handlePointerLeave}
        >
            {/* Soft gold halo behind card (mild 3D depth) */}
            <div
                className="pointer-events-none absolute left-1/2 top-1/2 z-0 aspect-square w-[min(108%,460px)] -translate-x-1/2 -translate-y-1/2 md:w-[min(118%,500px)]"
                style={{
                    background:
                        'radial-gradient(circle at 50% 48%, rgba(212, 175, 55, 0.2) 0%, rgba(200, 168, 75, 0.07) 38%, transparent 68%)',
                    filter: 'blur(1.5px)',
                }}
                aria-hidden
            />
            <motion.div
                className="relative z-[1] mx-auto w-full max-w-[min(88vw,420px)] origin-center will-change-transform md:max-w-[440px]"
                style={{
                    rotateX,
                    rotateY,
                    transformStyle: 'preserve-3d',
                }}
            >
                    <div className="relative aspect-square w-[min(88vw,420px)] overflow-hidden rounded-[1.35rem] border border-[#b8a88c]/30 shadow-[0_26px_60px_rgba(0,0,0,0.52)] md:max-w-[440px] md:rounded-[1.5rem]" style={{ transform: 'translateZ(24px)' }}>
                        <div
                            className="pointer-events-none absolute inset-0 z-[2] bg-gradient-to-tr from-black/20 via-transparent to-[#c8a84b]/[0.06]"
                            aria-hidden
                        />
                        <div
                            className="pointer-events-none absolute inset-x-0 bottom-0 z-[2] h-1/3 bg-gradient-to-t from-black/45 to-transparent"
                            aria-hidden
                        />
                        <img
                            src="/assets/trust_us.webp"
                            alt="Craft, trust, and botanical care at AW Naturals"
                            className="absolute inset-0 z-[1] h-full w-full object-cover"
                            loading="lazy"
                            decoding="async"
                        />
                    </div>
                {/* Tight ground glow — minimal extra vertical space */}
                <div
                    className="pointer-events-none absolute -bottom-3 left-[10%] right-[10%] z-0 h-10 rounded-[50%] bg-black/45 blur-xl md:h-12"
                    style={{ transform: 'translateZ(-40px) scale(0.9)' }}
                    aria-hidden
                />
            </motion.div>
        </div>
    );
}
