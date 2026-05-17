import { useRef, useLayoutEffect } from 'react';
import gsap from 'gsap';

export function ComingSoonPage() {
  const containerRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      // Cinematic fade-up animation matching the hero
      gsap.from('.anim-element', {
        y: 30,
        opacity: 0,
        duration: 1.2,
        stagger: 0.15,
        ease: 'power3.out',
        delay: 0.2,
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div 
      ref={containerRef}
      className="min-h-screen bg-[#0B0B0B] text-[#FAF6ED] flex flex-col items-center justify-center relative overflow-hidden font-['Inter']"
    >
      {/* Background Image matching MainHero */}
      <div className="absolute inset-0 z-0 flex items-center justify-center overflow-hidden">
        <img
          src="/assets/home_page.webp"
          alt="AW Naturals — Coming Soon"
          className="h-full w-full object-cover scale-[1.07] lg:scale-100 object-[center_31%] lg:object-[center_39%] opacity-40"
        />
        {/* Dark backdrop overlay to ensure flawless text legibility */}
        <div className="absolute inset-0 bg-black/60 pointer-events-none" />
        
        {/* Bottom and top gradient veils blending into the black page background */}
        <div className="absolute bottom-0 left-0 w-full h-[40vh] bg-gradient-to-t from-[#0B0B0B] via-[#0B0B0B]/90 to-transparent pointer-events-none" />
        <div className="absolute top-0 left-0 w-full h-[20vh] bg-gradient-to-b from-[#0B0B0B] to-transparent pointer-events-none" />
      </div>

      <div className="relative z-10 flex flex-col items-center text-center px-6 max-w-3xl mx-auto drop-shadow-2xl">
        {/* Brand Name */}
        <h2 className="anim-element text-sm md:text-base tracking-[0.3em] uppercase text-[#C5A880] mb-8 font-semibold drop-shadow-[0_2px_8px_rgba(0,0,0,0.65)]">
          AW Naturals
        </h2>

        {/* Main Heading matching MainHero typography */}
        <h1 className="anim-element font-['Cormorant_Garamond',serif] text-6xl sm:text-7xl md:text-8xl lg:text-[7.5rem] font-light tracking-tight mb-6 leading-[0.9] drop-shadow-[0_4px_16px_rgba(0,0,0,0.85)]">
          Launching <span className="italic font-bold bg-gradient-to-r from-[#C6A85B] via-[#E5D08A] to-[#C6A85B] bg-[length:200%_100%] bg-clip-text text-transparent animate-shine">Soon.</span>
        </h1>

        {/* Subheading */}
        <p className="anim-element text-[#FAF6ED]/80 text-lg md:text-xl font-light max-w-xl mx-auto leading-relaxed mb-12 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
          We are crafting something pure, natural, and extraordinary. 
          Our premium wellness collection is almost ready for you.
        </p>
      </div>
      <style>{`
        @keyframes shine {
          0% { background-position: 200% center; }
          100% { background-position: -200% center; }
        }
        .animate-shine {
          animation: shine 3s linear infinite;
        }
      `}</style>
    </div>
  );
}
