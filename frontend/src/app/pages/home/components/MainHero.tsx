import React from 'react';

export function MainHero() {
    return (
        <section className="relative w-full overflow-hidden flex flex-col z-10 bg-[#0B0B0B] min-h-[100svh]">
            {/* Background Image: full-bleed on mobile, custom-positioned on desktop */}
            <div className="absolute inset-0 z-0 flex items-center justify-center overflow-hidden lg:inset-x-0 lg:bottom-0 lg:top-[1vh]">
                <img
                    src="/assets/home_page.webp"
                    alt="AW Naturals — clinical herbal tea infusions"
                    className="h-full w-full object-cover will-change-transform scale-[1.07] lg:scale-100 object-[center_31%] lg:object-[center_39%] lg:[transform:translate3d(0,18px,0)]"
                />
                {/* Mobile dark backdrop overlay to ensure flawless text legibility */}
                <div className="absolute inset-0 bg-black/35 lg:hidden pointer-events-none" />
                
                {/* Bottom gradient veil blending into the black page background */}
                <div className="absolute bottom-0 left-0 w-full h-[40vh] bg-gradient-to-t from-[#0B0B0B] via-[#0B0B0B]/90 to-transparent pointer-events-none" />
            </div>

            <div className="relative z-10 w-full max-w-screen-2xl mx-auto flex flex-col justify-between h-full min-h-[100svh] pt-[calc(7.5rem+env(safe-area-inset-top,0px))] pb-12 lg:justify-between lg:h-full lg:min-h-[100svh] lg:pt-[15vh] lg:pb-12">
                {/* Heading */}
                <div
                    className="flex flex-col items-center text-center animate-fade-in-up px-4 lg:pt-0 lg:pb-0"
                    style={{ animationDuration: '1.2s' }}
                >
                    <h1 className="flex flex-col items-center justify-center font-['Cormorant_Garamond',serif] text-[#FAF6ED] tracking-tight drop-shadow-2xl">
                        <span className="block text-[1.75rem] sm:text-3xl md:text-3xl lg:text-[2rem] font-semibold tracking-wide opacity-95 mb-1.5 lg:mb-3 drop-shadow-[0_2px_8px_rgba(0,0,0,0.65)]">
                            Your Daily Dose of
                        </span>
                        <span className="block italic font-bold text-[3.5rem] sm:text-6xl md:text-7xl lg:text-[6.5rem] leading-[0.9] drop-shadow-[0_4px_16px_rgba(0,0,0,0.85)]">
                            Clinical Wellness.
                        </span>
                    </h1>
                </div>

                {/* Bottom spacing helper for mobile layout symmetry */}
                <div className="w-full h-12 lg:hidden pointer-events-none" />
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
