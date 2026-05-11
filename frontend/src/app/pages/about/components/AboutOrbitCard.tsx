import { memo, type CSSProperties } from 'react';
import type { OrbitStep } from './aboutConstants';

export interface AboutOrbitCardProps {
    step: OrbitStep;
    phasePct: number;
    delaySec: number;
    rotationDeg: number;
}

export const AboutOrbitCard = memo(function AboutOrbitCard({
    step,
    phasePct,
    delaySec,
    rotationDeg,
}: AboutOrbitCardProps) {
    const motionStyle = {
        offsetDistance: `${phasePct}%`,
        WebkitOffsetDistance: `${phasePct}%`,
        animationDelay: `${delaySec}s`,
        WebkitAnimationDelay: `${delaySec}s`,
    } as CSSProperties;

    const slotStyle = {
        transform: `translate(-50%, calc(-50% - 14px)) rotate(${-rotationDeg}deg)`,
    } as CSSProperties;

    return (
        <div className="about-orbit-layer pointer-events-none absolute inset-0 z-20" style={motionStyle}>
            <div className="pointer-events-auto absolute left-1/2 top-1/2" style={slotStyle}>
                <article
                    className="w-[min(78vw,252px)] max-w-[270px] rounded-[1.25rem] border border-white/40 px-5 py-4 shadow-[0_26px_60px_rgba(0,0,0,0.28)] backdrop-blur-xl sm:w-[258px] sm:px-6 sm:py-[1.15rem] md:w-[268px] md:rounded-[1.35rem] md:py-5"
                    style={{
                        background: 'linear-gradient(145deg, rgba(242,235,218,0.95) 0%, rgba(226,214,182,0.98) 100%)',
                        boxShadow: '0 28px 64px rgba(0,0,0,0.22), inset 0 1px 0 rgba(255,255,255,0.5)',
                    }}
                >
                    <h3
                        className="font-['Gloock'] text-[clamp(1.15rem,2.6vw,1.5rem)] leading-[1.15] tracking-tight text-[#141210] md:text-[1.55rem]"
                        style={{ fontWeight: 500 }}
                    >
                        {step.title}
                    </h3>
                    <p className="mt-2 font-['Inter'] text-[12px] font-light leading-relaxed text-[#2a2620]/85 md:mt-2.5 md:text-[13px]">
                        {step.body}
                    </p>
                </article>
            </div>
        </div>
    );
});
