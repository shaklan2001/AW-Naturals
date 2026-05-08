import { memo } from 'react';

const creamShellStyle = {
    background: 'linear-gradient(145deg, rgba(242,235,218,0.98) 0%, rgba(226,214,182,0.96) 100%)',
    boxShadow: '0 28px 64px rgba(0,0,0,0.48), inset 0 1px 0 rgba(255,255,255,0.55)',
} as const;

export type FounderPortraitCardProps = {
    imageSrc?: string;
    name: string;
    initials: string;
};

export const FounderPortraitCard = memo(function FounderPortraitCard({
    imageSrc,
    name,
    initials,
}: FounderPortraitCardProps) {
    const hasPhoto = Boolean(imageSrc);

    return (
        <div className="relative mx-auto w-full max-w-[min(88vw,420px)] md:max-w-[440px]">
            <div className="relative aspect-[4/5] w-full overflow-hidden rounded-[1.35rem] border border-[#b8a88c]/30 shadow-[0_26px_60px_rgba(0,0,0,0.52)] bg-[#141210] md:rounded-[1.5rem]">
                <div
                    className="pointer-events-none absolute inset-0 z-[2] bg-gradient-to-t from-black/20 via-transparent to-white/10"
                    aria-hidden
                />
                {hasPhoto ? (
                    <img
                        src={imageSrc}
                        alt={`${name}, AW Naturals`}
                        className="absolute inset-0 z-[1] h-full w-full object-cover object-[center_15%]"
                        loading="lazy"
                        decoding="async"
                    />
                ) : (
                    <div
                        className="absolute inset-0 z-[1] flex flex-col items-center justify-center bg-gradient-to-b from-[#1c1914] via-[#12100e] to-[#0a0908] px-6 text-center"
                        role="img"
                        aria-label={`Portrait placeholder for ${name}`}
                    >
                        <div
                            className="mb-4 flex h-[min(32vw,120px)] w-[min(32vw,120px)] items-center justify-center rounded-full border border-[#8a7a5c]/50 bg-black/35 font-['Cormorant_Garamond',serif] font-semibold text-[clamp(1.75rem,6vw,2.5rem)] tracking-tight text-[#c8a84b]"
                            style={{ fontWeight: 600 }}
                        >
                            {initials}
                        </div>
                        <p className="font-['Inter'] text-[9px] font-semibold uppercase tracking-[0.24em] text-[#5c574d]">
                            Portrait forthcoming
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
});
