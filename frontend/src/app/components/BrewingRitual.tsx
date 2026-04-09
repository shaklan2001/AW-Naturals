import { useRef } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'motion/react';
import { Thermometer, Timer, Wind } from 'lucide-react';
import { MethodologyChip } from './MethodologyChip';

export function BrewingRitual() {
  const containerRef = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start center", "end center"]
  });

  const beamHeight = useSpring(useTransform(scrollYProgress, [0, 1], ["0%", "100%"]), {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  const steps = [
    {
      icon: Thermometer,
      step: 'Step 01',
      title: 'The Temperature Calibration',
      description: 'Water quality and temperature are vital for preserving the potency of delicate herbs. Use freshly boiled water, then let it sit for 60 seconds (reaching approximately 85°C–90°C).',
      quote: 'Using boiling water directly can "scald" the volatile oils in herbs like Chamomile and Marigold, reducing their therapeutic efficacy.',
    },
    {
      icon: Timer,
      step: 'Step 02',
      title: 'The Steeping Duration',
      subtitle: 'The Activation Phase',
      description: 'Patience is part of the remedy. Cover your cup while steeping for 5 to 7 minutes to trap the botanical essence inside the brewing chamber.',
      quote: 'Covering the cup prevents the essential oils—the active compounds that help with sleep, digestion, and focus—from escaping with the steam. This ensures every sip is packed with the full spectrum of the herbs’ benefits.',
    },
    {
      icon: Wind,
      step: 'Step 03',
      title: 'The Mindful Consumption',
      description: 'The health benefits begin the moment you inhale the aroma. Drink slowly, allowing the active botanicals to work in harmony with your body’s natural rhythm.',
      quote: 'Before your first sip, take a moment to breathe in the natural scent of the infusion to signal your nervous system that it is time to shift gears.',
    },
  ];

  return (
    <section className="relative w-full bg-[#0B0B0B] pb-32 pt-24 selection:bg-[#C6A85B]/35 selection:text-[#FAF6ED]">
      
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="relative isolate mx-auto mb-20 max-w-4xl px-6 text-center"
      >
        <div className="mb-6 flex justify-center">
          <MethodologyChip />
        </div>
        
        <h2 className="font-['Cormorant_Garamond',serif] font-semibold text-[48px] md:text-[64px] leading-[1.1] mb-6">
          <span className="text-white">Brewing</span>{' '}
          <span className="inline-block italic bg-gradient-to-r from-[#C6A85B] to-[#E5D08A] bg-clip-text text-transparent [background-clip:text] [-webkit-background-clip:text] [-webkit-text-fill-color:transparent]">
            Ritual
          </span>
        </h2>
        <p className="font-['Inter'] text-[16px] text-[#F5F5DC]/60 font-light max-w-xl mx-auto leading-relaxed">
          Transforming your daily cup into a highly functional experience. We don't just brew tea; we extract clinical vitality through precise calibration.
        </p>
      </motion.div>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-12 lg:gap-0 relative">
        
        {/* Left Column: Fixed Image with 3D Perspective */}
        <div className="lg:w-[45%] w-full relative px-6 lg:px-0">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, rotateY: 5, rotateX: 2 }}
            whileInView={{ opacity: 1, scale: 1, rotateY: 0, rotateX: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1.2, ease: "easeOut" }}
            className="lg:sticky lg:top-32 w-full h-[50vh] lg:h-[70vh] rounded-[32px] overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.5),0_0_20px_rgba(212,175,55,0.05)] border border-white/5 bg-[#121212]"
            style={{ perspective: "1500px" }}
          >
             <motion.img 
               src="/assets/steps.webp"
               alt="Clinical Protocol"
               className="w-full h-full object-cover object-top"
               style={{
                 transform: "translateZ(20px)",
               }}
             />
             {/* Subtle Ambient Light Effect */}
             <div className="absolute inset-0 bg-gradient-to-tr from-white/5 to-transparent pointer-events-none" />
          </motion.div>
        </div>

        {/* Right Column: Connected Steps */}
        <div className="lg:w-[55%] w-full px-6 lg:pl-16 relative">
          
          {/* Steps Track Container - Used for Scroll calculations */}
          <div className="relative pb-0" ref={containerRef}>
            
            {/* Base Vertical Track Line - Extended to exactly Step 3 content end */}
            <div className="absolute left-[15px] top-[16px] bottom-0 w-[2px] bg-white/5 rounded-full" />
            
            {/* Animated Glowing Beam Line */}
            <motion.div 
              className="absolute left-[15px] top-[16px] w-[2px] rounded-full origin-top"
              style={{ 
                height: beamHeight,
                background: 'linear-gradient(to bottom, transparent, #D4AF37, #FFFFFF)',
                boxShadow: '0 0 15px rgba(212,175,55,0.8)'
              }}
            />

            <div className="space-y-32 relative z-10">
              {steps.map((step, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: 40 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                  className="relative pl-12 md:pl-16"
                >
                  <div className="mb-4 flex items-center gap-3">
                    {/* Step Icon acting as the node exactly over the vertical line */}
                    <div className="absolute left-[-1px] w-8 h-8 rounded-full bg-[#0B0B0B] flex items-center justify-center border border-[#C6A85B]/30 shadow-[0_0_10px_rgba(212,175,55,0.15)] z-20">
                      <step.icon className="w-4 h-4 text-[#C6A85B]" />
                    </div>
                    
                    <span className="font-['Inter'] text-[#D4AF37] font-semibold tracking-[0.15em] text-[13px] uppercase ml-1">
                      {step.step}
                    </span>
                  </div>

                  <h3 className="font-['Cormorant_Garamond',serif] font-semibold text-[32px] md:text-[40px] text-white mb-2 leading-tight">
                    {step.title}
                  </h3>
                  
                  {step.subtitle && (
                    <h4 className="font-['Inter'] text-[14px] uppercase tracking-widest text-[#C6A85B]/70 mb-5 font-medium">
                      {step.subtitle}
                    </h4>
                  )}

                  <p className="font-['Inter'] text-[15px] text-[#F5F5DC]/70 font-light leading-[1.8] mb-8 max-w-md">
                    {step.description}
                  </p>

                  {/* The Clinical Why block */}
                  <div className="relative p-6 md:p-8 rounded-tr-3xl rounded-br-3xl bg-[#111111]/80 backdrop-blur-sm border border-white/5 border-l-2 border-l-[#C6A85B] shadow-lg">
                    <div className="absolute -left-[14px] top-8 w-6 h-6 bg-[#0B0B0B] flex items-center justify-center">
                      <div className="w-1.5 h-1.5 rounded-full bg-[#C6A85B]" />
                    </div>
                    <h5 className="font-['Inter'] text-[10px] tracking-[0.2em] text-[#C6A85B] uppercase mb-3 font-semibold">
                      The Clinical Rationale
                    </h5>
                    <p className="font-['Inter'] text-[14px] italic text-[#F5F5DC]/80 leading-relaxed font-light">
                      "{step.quote}"
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Formulated By Experts Badge returned to the bottom */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
            className="mt-16 pt-12 border-t border-white/5 flex items-center gap-6 relative z-10"
          >
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#D4AF37] to-[#8B6B22] p-[1px]">
              <div className="w-full h-full rounded-full bg-[#0B0B0B] flex items-center justify-center">
                <span className="font-['Cormorant_Garamond',serif] font-semibold text-[#D4AF37] text-2xl">AW</span>
              </div>
            </div>
            <div>
              <h4 className="font-['Inter'] text-white font-medium text-[15px] mb-1">Formulated by Experts</h4>
              <p className="font-['Inter'] text-white/40 text-[13px] max-w-[250px]">
                Clinically designed by Ayurvedic doctors and certified nutritionists.
              </p>
            </div>
          </motion.div>

        </div>
      </div>
      
    </section>
  );
}