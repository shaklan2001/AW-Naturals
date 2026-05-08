import React from 'react';

const HERO_IMAGE = '/assets/home_page.webp';

const line1Style: React.CSSProperties = {
    fontSize: 'clamp(1rem, 0.8rem + 0.9vw, 1.8375rem)',
    lineHeight: 1.3,
    fontWeight: 600,
};

const line2Style: React.CSSProperties = {
    fontSize: 'clamp(2.4rem, 1.7rem + 3.6vw, 6.9rem)',
    lineHeight: 1.05,
    fontWeight: 700,
};

export function MainHero() {
    return (
        <section className="relative z-10 min-h-[100svh] w-full overflow-hidden bg-[#0B0B0B]">
            {/* Full-bleed background — always fills viewport on every screen size */}
            <div className="absolute inset-0 z-0">
                <img
                    src={HERO_IMAGE}
                    alt="AW Naturals — clinical herbal tea infusions and wellness products"
                    width={1672}
                    height={941}
                    decoding="async"
                    fetchPriority="high"
                    className="h-full w-full object-cover object-[50%_92%] sm:object-[50%_82%] lg:object-[50%_88%] xl:object-[50%_92%] 2xl:object-[50%_94%]"
                />

                {/* Headline legibility — light touch so products stay visible */}
                <div
                    className="pointer-events-none absolute inset-0"
                    aria-hidden
                    style={{
                        background:
                            'radial-gradient(ellipse 72% 42% at 50% 22%, rgba(0,0,0,0.42) 0%, transparent 68%), linear-gradient(to bottom, rgba(11,11,11,0.35) 0%, transparent 22%, transparent 72%, rgba(11,11,11,0.18) 100%)',
                    }}
                />

                {/* Soft bottom blend into next section */}
                <div
                    className="pointer-events-none absolute inset-x-0 bottom-0 z-[4] h-[6vh] min-h-[30px]"
                    aria-hidden
                    style={{
                        background:
                            'linear-gradient(to bottom, transparent 0%, rgba(11,11,11,0.05) 80%, #0B0B0B 100%)',
                    }}
                />
            </div>

            {/* Headline — centered in the sky area above products */}
            <div
                className="pointer-events-none absolute inset-x-0 z-10 flex items-center justify-center px-4 sm:px-6"
                style={{
                    top: 'calc(clamp(8rem, 24vh, 16rem) + env(safe-area-inset-top, 0px))',
                    height: 'clamp(8rem, 22vh, 22rem)',
                }}
            >
                <div
                    className="animate-fade-in-up mx-auto w-full max-w-[min(100%,42rem)] text-center sm:max-w-2xl md:max-w-3xl lg:max-w-4xl xl:max-w-5xl"
                    style={{ animationDuration: '1.2s' }}
                >
                    <h1 className="flex flex-col items-center gap-1 font-['Cormorant_Garamond',serif] tracking-tight text-[#FAF6ED] text-balance sm:gap-1.5 md:gap-2">
                        <span
                            className="block font-semibold tracking-wide opacity-95 drop-shadow-[0_2px_10px_rgba(0,0,0,0.7)]"
                            style={line1Style}
                        >
                            Elevating Your Daily Rituals for
                        </span>
                        <span
                            className="block font-bold italic leading-[1.05] drop-shadow-[0_4px_18px_rgba(0,0,0,0.85)]"
                            style={line2Style}
                        >
                            Ultimate Well-Being
                        </span>
                    </h1>
                </div>
            </div>

            <style
                dangerouslySetInnerHTML={{
                    __html: `
                @keyframes fade-in-up {
                    0% { opacity: 0; transform: translateY(30px); }
                    100% { opacity: 1; transform: translateY(0); }
                }
                .animate-fade-in-up {
                    animation-name: fade-in-up;
                    animation-timing-function: cubic-bezier(0.16, 1, 0.3, 1);
                }
            `,
                }}
            />
        </section>
    );
}
