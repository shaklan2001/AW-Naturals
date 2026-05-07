import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, PanInfo, useScroll, useTransform } from 'motion/react';
import { Link } from 'react-router';
import { teaProducts } from '../data/teaData';
import { PremiumGoldCtaLink } from './PremiumGoldCtaButton';
import { SITE_CONTAINER_CLASS } from '../constants/site-layout';
import { cn } from './ui/utils';

export function Hero() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(typeof window !== 'undefined' ? window.innerWidth < 1024 : false);
  const heroRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 1024);
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"]
  });

  // Parallax transforms
  const yBgText = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const yContent = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const yImage = useTransform(scrollYProgress, [0, 1], ["0%", "15%"]);

  // Auto-play interval: 20 seconds for slower pace
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % teaProducts.length);
    }, 20000);
    return () => clearInterval(timer);
  }, []);

  const activeTea = teaProducts[activeIndex];

  // Drag handler for the image
  const handleDragEnd = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const swipeThreshold = 50;
    if (info.offset.x < -swipeThreshold) {
      // Swiped left -> next
      setActiveIndex((prev) => (prev + 1) % teaProducts.length);
    } else if (info.offset.x > swipeThreshold) {
      // Swiped right -> prev
      setActiveIndex((prev) => (prev - 1 + teaProducts.length) % teaProducts.length);
    }
  };

  if (isMobile) {
    return (
      <section className="relative flex flex-col justify-center items-center w-full bg-[#0B0B0B] pt-14 pb-16 px-4 overflow-hidden select-none">
        
        {/* Animated Background Gradient */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTea.id + "-mobile-bg"}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.2 }}
            className="absolute inset-0 pointer-events-none z-[0]"
            style={{ background: activeTea.bgGradient }}
          />
        </AnimatePresence>

        <div className="pointer-events-none absolute bottom-0 left-0 z-[5] h-16 w-full bg-gradient-to-t from-[#0B0B0B] to-transparent"></div>

        {/* Brand/Doctor Chip */}
        <div className="mb-4 inline-flex px-4 py-1.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-md shadow-md z-10">
          <span className="font-['Inter'] text-[10px] font-medium tracking-[0.15em] uppercase text-white/70">
            ✦ Doctor Formulated Herbal Infusion
          </span>
        </div>

        {/* Unified Mobile Swiper Container */}
        <div className="relative w-full max-w-[400px] flex flex-col items-center z-10">
          
          {/* Swipable Image */}
          <div className="relative w-full aspect-[4/3] max-h-[min(52vw,240px)] sm:max-h-[280px] flex items-center justify-center mb-2">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTea.id + "-mobile-img"}
                initial={{ opacity: 0, scale: 0.85, x: 50 }}
                animate={{ opacity: 1, scale: 1, x: 0 }}
                exit={{ opacity: 0, scale: 0.85, x: -50 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="relative flex h-full w-full max-w-[min(88vw,320px)] items-center justify-center cursor-grab active:cursor-grabbing touch-pan-y"
                drag="x"
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.25}
                onDragEnd={handleDragEnd}
              >
                <img
                  src={activeTea.showcaseImage}
                  alt={activeTea.namePart1}
                  className="h-full w-full object-contain object-center pointer-events-none drop-shadow-[0_20px_40px_rgba(0,0,0,0.55)]"
                  draggable={false}
                />
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Swipe Indicator Badge */}
          <div className="mb-4 flex items-center gap-1.5 font-['Inter'] text-[10px] text-white/40 tracking-wider uppercase">
            <span>← Swipe to discover →</span>
          </div>

          {/* Content Box */}
          <div className="w-full text-center px-4 flex flex-col items-center">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTea.id + "-mobile-content"}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.4 }}
                className="w-full flex flex-col items-center"
              >
                {/* Title */}
                <h3 className="font-['Gloock'] text-[34px] leading-tight mb-3 text-white">
                  {activeTea.namePart1}{' '}
                  <span className={cn("italic bg-gradient-to-r bg-clip-text text-transparent [background-clip:text] [-webkit-background-clip:text] [-webkit-text-fill-color:transparent]", activeTea.textGradient)}>
                    {activeTea.namePart2}
                  </span>
                </h3>

                {/* Bullets List */}
                <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1.5 mb-4 text-[#F5F5DC]/80 font-['Inter'] text-[12px] font-medium">
                  <span className="flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#C6A85B]" /> Pure Natural
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#C6A85B]" /> Caffeine Free
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#C6A85B]" /> Premium Infusion
                  </span>
                </div>

                {/* Description */}
                <p className="font-['Inter'] text-[14px] leading-relaxed text-[#F5F5DC]/60 max-w-[340px] font-light mb-6">
                  {activeTea.description}
                </p>
              </motion.div>
            </AnimatePresence>

            {/* CTAs */}
            <div className="flex flex-col gap-3 w-full max-w-[280px]">
              <PremiumGoldCtaLink to="/products" className="w-full py-3.5 text-[14px]">
                Shop Now
              </PremiumGoldCtaLink>
              <Link to="/find-your-blend" className="w-full">
                <button className="w-full py-3 bg-white/[0.04] backdrop-blur-md border border-white/10 rounded-full font-['Inter'] text-[13px] tracking-wider text-white/80 transition-all active:scale-95 active:bg-white/10">
                  Find Your Blend
                </button>
              </Link>
            </div>

          </div>
        </div>

        {/* Carousel indicators */}
        <div className="mt-8 flex justify-center gap-2 z-10">
          {teaProducts.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setActiveIndex(idx)}
              className="relative h-[3px] rounded-full transition-all duration-300 overflow-hidden"
              style={{ width: activeIndex === idx ? '24px' : '10px', backgroundColor: 'rgba(255,255,255,0.2)' }}
              aria-label={`Slide ${idx + 1}`}
            >
              {activeIndex === idx && (
                <motion.div
                  layoutId="activeDotMobile"
                  className="absolute inset-0 bg-[#C6A85B]"
                  transition={{ duration: 0.3 }}
                />
              )}
            </button>
          ))}
        </div>

      </section>
    );
  }

  return (
    <section
      ref={heroRef}
      className="relative flex min-h-[100svh] w-full items-center overflow-hidden bg-[#0B0B0B] pb-12 pt-16 selection:bg-[#C6A85B]/35 selection:text-white lg:pb-0 lg:pt-0"
    >
      
      {/* Animated Background Gradients */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTea.id + "-bg"}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 2, ease: "easeInOut" }}
          className="absolute inset-0 pointer-events-none z-[0]"
          style={{ background: activeTea.bgGradient }}
        />
      </AnimatePresence>

      <div className="pointer-events-none absolute bottom-0 left-0 z-[5] h-20 w-full bg-gradient-to-t from-[#0B0B0B] to-transparent"></div>

      {/* Huge Background Typography - Parallax */}
      <motion.div 
        className="absolute inset-0 pointer-events-none flex items-center justify-center z-[1] opacity-[0.03] select-none"
        style={{ y: isMobile ? 0 : yBgText }}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTea.id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            transition={{ duration: 1.2, ease: "easeInOut" }}
            className="whitespace-nowrap font-['Gloock'] text-[15vw] leading-none text-white font-bold tracking-tighter"
          >
            {activeTea.shortName.toUpperCase()}
          </motion.div>
        </AnimatePresence>
      </motion.div>

      <div
        className={cn(
          SITE_CONTAINER_CLASS,
          'relative z-10 flex flex-col items-center justify-between gap-12 lg:flex-row lg:gap-8',
        )}
      >
        
        {/* Left Side Content - Parallax */}
        <motion.div
          className="flex w-full max-w-[600px] flex-col items-start pt-4 text-left order-2 lg:order-1 lg:pt-0"
          style={{ y: isMobile ? 0 : yContent }}
        >
          
          {/* Glassmorphic Badge STATIC */}
          <div className="mb-4 lg:mb-8 inline-flex px-4 py-2 rounded-full bg-white/5 backdrop-blur-md border border-white/10 shadow-[0_4px_30px_rgba(0,0,0,0.1)]">
            <span className="font-['Inter'] text-[10px] sm:text-[11px] font-medium tracking-[0.165em] uppercase text-white/80">
              ✦ Doctor Formulated Herbal Infusion
            </span>
          </div>

          {/* Texts swapping safely flowing to prevent overlap */}
          <div className="w-full relative min-h-0 lg:min-h-[250px] flex flex-col justify-center">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTea.id + "-content"}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="w-full"
              >
                <h1 className="font-['Gloock'] text-[36px] sm:text-[64px] lg:text-[76px] leading-[1.05] tracking-[-0.02em] mb-4 lg:mb-6 text-white isolate" style={{ fontWeight: 400 }}>
                  {activeTea.namePart1}{' '}
                  <span
                    className={cn(
                      'italic bg-gradient-to-r bg-clip-text text-transparent [background-clip:text] [-webkit-background-clip:text] [-webkit-text-fill-color:transparent] transition-all duration-700',
                      activeTea.textGradient,
                    )}
                  >
                    {activeTea.namePart2}
                  </span>
                </h1>
                
                <ul className="mb-4 lg:mb-6 space-y-1.5 lg:space-y-2 font-['Inter'] text-[13px] sm:text-[14px] font-medium tracking-[0.02em] text-white/85">
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#C6A85B]" /> Pure Natural Ingredients
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#C6A85B]" /> Caffeine Free
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#C6A85B]" /> Premium Wellness Tea
                  </li>
                </ul>

                <p className="font-['Inter'] text-[15px] sm:text-[18px] leading-[1.6] text-white/75 max-w-[500px] font-light">
                  {activeTea.description}
                </p>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Original Premium CTAs STATIC and UNMOVING */}
          <div className="flex flex-col sm:flex-row gap-3 justify-start items-center w-full z-10 mt-4 lg:mt-6">
            {/* Primary — shared premium gold CTA */}
            <PremiumGoldCtaLink to="/products" className="w-full sm:w-auto">
              Shop Now
            </PremiumGoldCtaLink>

            {/* Secondary */}
            <Link to="/find-your-blend" className="w-full sm:w-auto">
              <button
                className="w-full group relative px-8 py-3.5 bg-white/[0.04] backdrop-blur-md border border-white/10 rounded-full font-['Inter'] text-[13px] tracking-[0.02em] text-white/80 transition-all duration-300 hover:border-[#D4AF37]/30"
                style={{ fontWeight: 500 }}
              >
                <span className="relative z-10">Find Your Blend</span>
              </button>
            </Link>
          </div>
          
        </motion.div>

        {/* Right Side Image (Draggable & Parallax) */}
        <motion.div
          className="relative order-1 mt-8 flex h-[350px] w-full max-w-[500px] flex-1 items-center justify-center sm:h-[450px] lg:order-2 lg:mt-0 lg:h-[600px] lg:max-w-[620px]"
          style={{ y: isMobile ? 0 : yImage }}
        >
          
          {/* Subtle Swipe Indicator */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2, duration: 1 }}
            className="absolute top-0 right-0 lg:-right-12 z-20 hidden md:flex items-center gap-2 font-['Inter'] text-[11px] text-white/40 tracking-widest uppercase rotate-90 origin-right"
          >
            ← Swipe to discover →
          </motion.div>

          <AnimatePresence mode="wait">
            <motion.div
              key={activeTea.id + "-image"}
              initial={{ opacity: 0, scale: 0.85, x: 40 }}
              animate={{ opacity: 1, scale: 1, x: 0 }}
              exit={{ opacity: 0, scale: 0.95, x: -40 }}
              transition={{ duration: 0.8, ease: "easeInOut" }}
              className="relative w-full h-full flex items-center justify-center cursor-grab active:cursor-grabbing z-20"
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.2}
              onDragEnd={handleDragEnd}
            >
              {/* Product Image - Animation Removed as requested */}
              <motion.div 
                className="pointer-events-none relative z-10 w-[56%] sm:w-[66%] lg:w-[74%]"
              >
                <img 
                  src={activeTea.image} 
                  alt={activeTea.namePart1}
                  className="h-auto w-full object-contain"
                  style={{ filter: 'drop-shadow(0px 24px 36px rgba(0, 0, 0, 0.35)) brightness(1.04)' }}
                  draggable={false}
                />
              </motion.div>
            </motion.div>
          </AnimatePresence>
        </motion.div>
      </div>

      {/* Carousel indicator dots */}
      <motion.div className="absolute bottom-6 left-0 z-20 flex w-full justify-center gap-2">
        {teaProducts.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setActiveIndex(idx)}
            className="relative h-[3px] rounded-full transition-all duration-300 overflow-hidden"
            style={{ width: activeIndex === idx ? '24px' : '10px', backgroundColor: 'rgba(255,255,255,0.2)' }}
            aria-label={`Slide ${idx + 1}`}
          >
            {activeIndex === idx && (
              <motion.div
                layoutId="activeDot"
                className="absolute inset-0 bg-[#C6A85B]"
                transition={{ duration: 0.4 }}
              />
            )}
          </button>
        ))}
      </motion.div>
      
    </section>
  );
}