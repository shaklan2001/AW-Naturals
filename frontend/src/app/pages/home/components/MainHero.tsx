import React from 'react';

const HERO_IMAGE = '/assets/home_page.webp';

export function MainHero() {
    return (
        <section className="relative z-10 flex min-h-[100svh] w-full flex-col overflow-hidden bg-[#0B0B0B] pb-0">
            <div className="absolute inset-0 z-0 flex flex-col justify-end bg-[#0B0B0B]">
                <img
                    src={HERO_IMAGE}
                    alt="AW Naturals — clinical herbal tea infusions and wellness products"
                    width={1672}
                    height={941}
                    decoding="async"
                    fetchPriority="high"
                    className="block h-auto w-full max-h-[100svh]"
                />

                {/* Headline legibility — light touch so products stay visible */}
                <div
                    className="pointer-events-none absolute inset-0"
                    aria-hidden
                    style={{
                        background:
                            'radial-gradient(ellipse 80% 50% at 50% 30%, rgba(0,0,0,0.38) 0%, transparent 65%), linear-gradient(to bottom, rgba(11,11,11,0.3) 0%, transparent 18%, transparent 70%, rgba(11,11,11,0.2) 100%)',
                    }}
                />

                {/* Cloudy bottom veil — soft merge into next section */}
                <div
                    className="pointer-events-none absolute inset-x-0 bottom-0 z-[4] h-[12vh] min-h-[60px]"
                    aria-hidden
                    style={{
                        background: 'linear-gradient(to bottom, transparent 0%, rgba(11,11,11,0.4) 60%, #0B0B0B 100%)',
                    }}
                />
            </div>

            <div className="relative z-10 mx-auto flex min-h-[100svh] w-full max-w-screen-2xl flex-col justify-start pt-[calc(7.5rem+env(safe-area-inset-top,0px))] pb-8 sm:pt-[calc(8.5rem+env(safe-area-inset-top,0px))] md:pt-[calc(9.5rem+env(safe-area-inset-top,0px))] lg:pt-[10vh] xl:pt-[12vh] lg:pb-10">
                <div
                    className="flex animate-fade-in-up flex-col items-center px-4 text-center"
                    style={{ animationDuration: '1.2s' }}
                >
                    <h1 className="flex flex-col items-center justify-center font-['Cormorant_Garamond',serif] tracking-tight text-[#FAF6ED] drop-shadow-2xl">
                        <span className="mb-0 block text-[1.75rem] font-semibold tracking-wide opacity-95 drop-shadow-[0_2px_8px_rgba(0,0,0,0.65)] sm:text-3xl md:text-3xl lg:text-[2rem]">
                            Elevating Your Daily Rituals for
                        </span>
                        <span className="-mt-1 block text-[3.5rem] font-bold italic leading-[0.9] drop-shadow-[0_4px_16px_rgba(0,0,0,0.85)] sm:-mt-2 sm:text-6xl md:-mt-3 md:text-7xl lg:-mt-4 lg:text-[6.5rem]">
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
