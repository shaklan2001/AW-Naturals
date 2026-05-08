import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { teaProducts } from '../data/teaData';
import { Link } from 'react-router';
import LightRays from './ui/LightRays';

function GradientText({ children }: { children: string }) {
  return (
    <span className="relative inline-block">
      <span className="relative bg-gradient-to-r from-[#C6A85B] via-[#E5D08A] to-[#C6A85B] bg-[length:200%_100%] bg-clip-text text-transparent animate-shine italic">
        {children}
      </span>
      <style>{`
        @keyframes shine {
          0% { background-position: 200% center; }
          100% { background-position: -200% center; }
        }
        .animate-shine {
          animation: shine 3s linear infinite;
        }
      `}</style>
    </span>
  );
}

export function ProductShowcase() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(typeof window !== 'undefined' ? window.innerWidth < 1024 : false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 1024);
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const activeTea = teaProducts[activeIndex];

  // Extract primary hex color from tailwind gradient to pass into WebGL LightRays
  const hexColorMatch = activeTea.textGradient.match(/#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})/);
  const primaryLightColor = hexColorMatch ? hexColorMatch[0] : '#C6A85B';

  /** Shortest arc on the carousel — works for 3+ teas. */
  const getOffset = (index: number) => {
    let diff = index - activeIndex;
    const n = teaProducts.length;
    const halfDown = Math.floor(n / 2);
    if (diff > halfDown) diff -= n;
    if (diff < -halfDown) diff += n;
    return diff;
  };

  const nextSlide = () => setActiveIndex((prev) => (prev + 1) % teaProducts.length);
  const prevSlide = () => setActiveIndex((prev) => (prev - 1 + teaProducts.length) % teaProducts.length);

  return (
    <section className="py-16 md:py-24 bg-[#0B0B0B] relative min-h-[90vh] overflow-hidden flex flex-col justify-center">

      {/* React Bits Authentic Animated Light Rays */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTea.id + "-rays"}
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.6 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.5 }}
          className="absolute top-[5%] left-0 w-full h-[80%] pointer-events-none z-[5]"
        >
          <LightRays
            raysOrigin="top-center"
            raysColor={primaryLightColor}
            raysSpeed={1.5}
            lightSpread={1.5}
            rayLength={2.0}
            pulsating={true}
            fadeDistance={0.8}
            mouseInfluence={0.3}
            noiseAmount={0.05}
          />
        </motion.div>
      </AnimatePresence>

      <div className="max-w-[1400px] w-full mx-auto px-6 sm:px-8 relative z-10 flex flex-col items-center">

        {/* Section Heading */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center max-w-3xl mx-auto mb-8 sm:mb-12 relative z-20"
        >
          <div className="mb-4 inline-flex px-4 py-1.5 rounded-full border border-[#C6A85B]/30 bg-[#151515] backdrop-blur-md">
            <span className="font-['Inter'] text-[10px] font-medium tracking-[0.2em] uppercase text-[#C6A85B]">
              Discover Your Cure
            </span>
          </div>
          <h2 className="font-['Cormorant_Garamond',serif] font-semibold text-[44px] md:text-[56px] mb-2 text-[#F5F5DC] leading-none" style={{ fontWeight: 600 }}>
            Clinical <GradientText>Insights</GradientText>
          </h2>
          <p className="font-['Inter'] text-[16px] md:text-[18px] text-[#F5F5DC]/60 font-light">
            An interactive exploration of targeted wellness.
          </p>
        </motion.div>

        {/* Mobile View Layout — Bespoke, beautiful responsive card view */}
        <div className="lg:hidden w-full max-w-[460px] mx-auto flex flex-col items-center gap-6 mt-4 z-20 px-2">

          {/* Glassmorphic Card Container */}
          <div className="w-full bg-[#121212]/80 border border-white/5 rounded-[32px] p-6 backdrop-blur-xl shadow-2xl relative overflow-hidden flex flex-col items-center">

            {/* Glowing Backdrop Circle behind product */}
            <div
              className="absolute top-[20%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-[250px] h-[250px] rounded-full filter blur-[70px] opacity-20 pointer-events-none transition-all duration-700"
              style={{ backgroundColor: primaryLightColor }}
            />

            {/* Product Image with Left-Right arrows next to it */}
            <div className="relative w-full flex items-center justify-between h-[260px] mb-4">

              {/* Left Arrow */}
              <button
                onClick={prevSlide}
                className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-white/60 active:text-white active:bg-white/5 active:scale-95 transition-all outline-none backdrop-blur-md z-30"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>

              {/* Product Image */}
              <div className="flex-1 h-full flex items-center justify-center relative overflow-hidden px-2 z-20">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeTea.id + "-mobile-img"}
                    initial={{ opacity: 0, scale: 0.85, rotate: -5 }}
                    animate={{ opacity: 1, scale: 1, rotate: 0 }}
                    exit={{ opacity: 0, scale: 0.85, rotate: 5 }}
                    transition={{ duration: 0.4 }}
                    className="w-full h-full flex items-center justify-center"
                  >
                    <img
                      src={activeTea.showcaseImage}
                      alt={activeTea.namePart1}
                      className="max-h-[230px] w-auto object-contain filter drop-shadow-[0_20px_30px_rgba(0,0,0,0.7)]"
                    />
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Right Arrow */}
              <button
                onClick={nextSlide}
                className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-white/60 active:text-white active:bg-white/5 active:scale-95 transition-all outline-none backdrop-blur-md z-30"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>

            {/* Problem & Solution Information Details inside Card */}
            <div className="w-full text-center flex flex-col items-center">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTea.id + "-mobile-details"}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.4 }}
                  className="w-full flex flex-col items-center"
                >
                  {/* The Problem */}
                  <span className="font-['Inter'] text-[11px] text-[#8a6200] font-bold tracking-[2px] uppercase mb-1 drop-shadow-md">
                    The Problem
                  </span>
                  <h3 className="font-['Cormorant_Garamond',serif] font-semibold text-[24px] text-white/95 leading-none mb-4 max-w-[280px]">
                    {activeTea.problem}
                  </h3>

                  {/* Divider line */}
                  <div className="w-12 h-px bg-white/10 mb-4" />

                  {/* The Solution */}
                  <span className="font-['Inter'] text-[11px] text-[#C6A85B] font-bold tracking-[2px] uppercase mb-1 drop-shadow-md">
                    The Solution
                  </span>
                  <h3 className="font-['Cormorant_Garamond',serif] font-semibold text-[28px] leading-[1.1] tracking-tight mb-2 text-white">
                    {activeTea.namePart1}{' '}
                    <span className={`bg-gradient-to-r ${activeTea.textGradient} bg-clip-text text-transparent italic`}>
                      {activeTea.namePart2}
                    </span>
                  </h3>

                  <p className="font-['Inter'] text-[13px] leading-relaxed text-white/60 font-light mb-4 px-2 max-w-[320px]">
                    {activeTea.description}
                  </p>

                  {/* Benefit Pill */}
                  <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-white/5 bg-white/[0.03] backdrop-blur-sm shadow-md mb-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#C6A85B]" />
                    <span className="font-['Inter'] text-[9px] uppercase tracking-wider text-white/70 font-medium">
                      Provides {activeTea.benefitTitle}
                    </span>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

          </div>

          {/* Shop Collection CTA Button placed elegantly below Card */}
          <Link to="/products" className="w-full flex justify-center">
            <button
              className="w-full group relative px-10 py-3.5 rounded-full font-['Inter'] text-[13px] tracking-[0.02em] text-[#0B0B0B] transition-all duration-300 overflow-hidden"
              style={{ fontWeight: 500, background: 'linear-gradient(90deg, #C6A85B, #E5D08A)' }}
            >
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-0" style={{ boxShadow: '0 0 24px rgba(212,175,55,0.4)' }} />
              <span className="relative z-10 flex items-center justify-center gap-2">
                Shop The Collection
                <svg className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </span>
            </button>
          </Link>

        </div>

        {/* Desktop View Layout — Dynamic Stage (Visible only on large devices) */}
        <div className="hidden lg:flex w-full relative flex-row items-center justify-between min-h-[550px]">

          {/* LEFT: The Problem */}
          <div className="w-full lg:w-1/4 flex flex-col items-center lg:items-end text-center lg:text-right px-4 z-20 order-1 lg:order-1 mt-6 lg:mt-0">
            <span className="font-['Inter'] text-[12px] text-[#8a6200] font-bold tracking-[2px] uppercase opacity-80 mb-4 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
              The Problem
            </span>
            <div className="h-[100px] lg:h-[120px] w-full flex justify-center lg:justify-end">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTea.id + "-problem"}
                  initial={{ opacity: 0, x: -30, filter: 'blur(10px)' }}
                  animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
                  exit={{ opacity: 0, x: 30, filter: 'blur(10px)' }}
                  transition={{ duration: 0.6, ease: "easeOut" }}
                >
                  <h3 className="font-['Cormorant_Garamond',serif] font-semibold text-[32px] sm:text-[36px] text-white/90 leading-[1.1] max-w-[220px] drop-shadow-[0_4px_10px_rgba(0,0,0,0.5)]">
                    {activeTea.problem}
                  </h3>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          {/* CENTER: The Orbit Carousel */}
          <div className="w-full lg:w-2/4 h-[320px] sm:h-[450px] lg:h-[550px] relative flex justify-center items-center order-2 lg:order-2 z-10 perspective-1000 mt-4 lg:mt-0">
            {teaProducts.map((product, idx) => {
              const offset = getOffset(idx);
              const isActive = offset === 0;

              // Compute 3D physical traits based on offset
              let scale = 0;
              let y = 0;
              let x = 0;
              let opacity = 0;
              let zIndex = 1;
              let rotateZ = 0;

              if (offset === 0) {
                // Active Center perfectly in the light
                scale = 1;
                y = 0;
                x = 0;
                opacity = 1;
                zIndex = 50;
                rotateZ = 0;
              } else if (offset === 1) {
                // Next item (swings back right)
                scale = isMobile ? 0.7 : 0.6; // Massive back image
                y = isMobile ? 70 : 120;
                x = isMobile ? 120 : 220; // Pushed further right to fit larger scale
                opacity = 0.5;
                zIndex = 10;
                rotateZ = 12;
              } else if (offset === -1) {
                // Prev item (swings back left)
                scale = isMobile ? 0.7 : 0.6; // Massive back image
                y = isMobile ? 70 : 120;
                x = isMobile ? -120 : -220; // Pushed further left
                opacity = 0.5;
                zIndex = 10;
                rotateZ = -12;
              } else {
                // Background hidden item
                scale = 0.4;
                y = isMobile ? 90 : 160;
                x = 0;
                opacity = 0;
                zIndex = 0;
              }

              return (
                <motion.div
                  key={product.id}
                  className="absolute cursor-pointer"
                  onClick={() => setActiveIndex(idx)}
                  animate={{ scale, y, x, opacity, zIndex, rotateZ }}
                  transition={{ type: "spring", stiffness: 100, damping: 20, mass: 1 }}
                  style={{
                    width: isMobile ? '280px' : '500px', // MASSIVE Container Size!
                    height: isMobile ? '280px' : '500px',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center'
                  }}
                >
                  <img
                    src={product.showcaseImage}
                    alt={product.namePart1}
                    className={`max-w-[85%] max-h-[85%] object-contain ${isActive ? 'drop-shadow-[0_50px_60px_rgba(0,0,0,0.8)] filter brightness-[1.1]' : 'drop-shadow-[0_20px_30px_rgba(0,0,0,0.6)] grayscale-[60%] hover:grayscale-0'} transition-all duration-300 pointer-events-none`}
                  />
                </motion.div>
              );
            })}
          </div>

          {/* RIGHT: The Solution */}
          <div className="w-full lg:w-1/4 flex flex-col items-center lg:items-start text-center lg:text-left px-4 z-20 order-3 mt-6 lg:mt-0">
            <span className="font-['Inter'] text-[12px] text-[#C6A85B] font-bold tracking-[2px] uppercase opacity-80 mb-4 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
              The Solution
            </span>
            <div className="min-h-[160px] lg:min-h-[200px] w-full flex flex-col items-center lg:items-start">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTea.id + "-solution"}
                  initial={{ opacity: 0, x: 30, filter: 'blur(10px)' }}
                  animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
                  exit={{ opacity: 0, x: -30, filter: 'blur(10px)' }}
                  transition={{ duration: 0.6, ease: "easeOut" }}
                  className="flex flex-col items-center lg:items-start"
                >
                  <h3 className="font-['Cormorant_Garamond',serif] font-semibold text-[32px] sm:text-[36px] leading-[1.05] tracking-[-0.01em] mb-4 text-white drop-shadow-[0_4px_10px_rgba(0,0,0,0.5)]">
                    {activeTea.namePart1} <br />
                    <span className={`bg-gradient-to-r ${activeTea.textGradient} bg-clip-text text-transparent italic`}>
                      {activeTea.namePart2}
                    </span>
                  </h3>
                  <p className="font-['Inter'] text-[15px] leading-[1.6] text-white/60 font-light mb-6 drop-shadow-[0_2px_4px_rgba(0,0,0,0.6)]">
                    {activeTea.description}
                  </p>

                  {/* Benefit Pill */}
                  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 bg-white/5 backdrop-blur-sm shadow-[0_4px_20px_rgba(0,0,0,0.2)]">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#C6A85B]" />
                    <span className="font-['Inter'] text-[11px] uppercase tracking-widest text-white/80 font-medium drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
                      Provides {activeTea.benefitTitle}
                    </span>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

        </div>

        {/* Desktop View Layout — CTA & Bottom Controls */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="hidden lg:flex mt-12 w-full justify-between items-center z-20 px-12"
        >
          <Link to="/products">
            <button className="group relative px-12 py-4 rounded-full font-['Inter'] text-[14px] tracking-[0.02em] text-[#0B0B0B] transition-all duration-300 overflow-hidden"
              style={{ fontWeight: 500, background: 'linear-gradient(90deg, #C6A85B, #E5D08A)' }}
            >
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-0" style={{ boxShadow: '0 0 24px rgba(212,175,55,0.4)' }} />
              <motion.div
                initial={{ x: "-100%" }}
                animate={{ x: "200%" }}
                transition={{ repeat: Infinity, repeatDelay: 1.5, duration: 2, ease: "linear" }}
                className="absolute top-0 left-0 z-0 pointer-events-none"
                style={{ background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.5), transparent)", width: "40%", height: "100%", transform: "skewX(-20deg)" }}
              />
              <span className="relative z-10 flex items-center gap-3">
                Shop The Collection
                <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </span>
            </button>
          </Link>

          {/* Right: Clean Bottom Arrows for Navigation */}
          <div className="flex gap-4">
            <button onClick={prevSlide} className="pointer-events-auto w-14 h-14 rounded-full border border-white/20 flex items-center justify-center text-white/70 hover:text-white hover:bg-white/10 transition-all outline-none backdrop-blur-md">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19l-7-7 7-7" /></svg>
            </button>
            <button onClick={nextSlide} className="pointer-events-auto w-14 h-14 rounded-full border border-white/20 flex items-center justify-center text-white/70 hover:text-white hover:bg-white/10 transition-all outline-none backdrop-blur-md">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5l7 7-7 7" /></svg>
            </button>
          </div>
        </motion.div>

      </div>
    </section>
  );
}