import { motion } from 'motion/react';
import { ImageWithFallback } from '@/shared/components/ImageWithFallback';

function GradientText({ children }: { children: string }) {
  return (
    <span className="relative inline-block">
      <span className="relative bg-gradient-to-r from-[#C6A85B] via-[#E5D08A] to-[#C6A85B] bg-[length:200%_100%] bg-clip-text text-transparent animate-shine">
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

export function ExpertiseSection() {
  return (
    <section className="py-24 bg-gradient-to-b from-[#0B0B0B] via-[#0F3D2E]/10 to-[#0B0B0B] relative overflow-hidden">
      
      {/* Background Subtle Noise/Texture Overlay */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none mix-blend-overlay" style={{ backgroundImage: 'url("https://www.transparenttextures.com/patterns/asfalt-dark.png")' }} />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          
          {/* Left Column - Image with Clinical Data Badge */}
          <motion.div
            initial={{ opacity: 0, x: -60 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="relative"
          >
            <div className="relative rounded-[32px] overflow-hidden shadow-[0_30px_60px_rgba(0,0,0,0.6),0_0_30px_rgba(212,175,55,0.05)] border border-white/5">
              <ImageWithFallback
                src="/assets/doctor.webp"
                alt="AW Naturals clinical wellness experts"
                className="w-full h-[390px] sm:h-[480px] lg:h-[650px] object-cover filter brightness-[0.9] contrast-[1.05]"
              />
              
              {/* Glassmorphic Stat Badge */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                whileInView={{ opacity: 1, scale: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4, duration: 0.8 }}
                className="absolute bottom-5 left-5 right-5 md:bottom-10 md:left-10 md:right-auto bg-[#0B0B0B]/40 border border-white/10 rounded-2xl p-4 md:p-8 backdrop-blur-xl shadow-2xl"
              >
                <div className="flex items-center gap-4 md:gap-6">
                  <div className="text-[32px] md:text-[52px] font-['Cormorant_Garamond',serif] font-semibold text-[#D4AF37] leading-none drop-shadow-[0_2px_10px_rgba(212,175,55,0.3)]">
                    40+
                  </div>
                  <div className="space-y-0.5 md:space-y-1">
                    <h4 className="text-[#F5F5DC] font-['Cormorant_Garamond',serif] font-semibold text-[16px] md:text-[22px] tracking-tight">Years of Experience</h4>
                    <p className="text-[#F5F5DC]/40 font-['Inter'] text-[10px] md:text-[12px] uppercase tracking-[0.2em] font-semibold">In clinical wellness</p>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>

          {/* Right Column - Content */}
          <motion.div
            initial={{ opacity: 0, x: 60 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="flex flex-col"
          >
            {/* Label Badge */}
            <div className="mb-8 flex">
              <span className="px-4 py-1.5 rounded-full border border-[#D4AF37]/20 bg-[#151515] font-['Inter'] text-[10px] tracking-[0.25em] uppercase text-[#D4AF37]/90 font-bold">
                The AW Naturals Standard
              </span>
            </div>

            {/* Main Heading in Gloock */}
            <h2 className="font-['Cormorant_Garamond',serif] font-semibold text-[44px] md:text-[56px] lg:text-[68px] mb-8 text-white leading-[1.05] tracking-tight" style={{ fontWeight: 600 }}>
              Bridging Ancient Wisdom &<br />
              <span className="italic">
                <GradientText>Modern Science</GradientText>
              </span>
            </h2>
            
            {/* Body Copy - Refined Inter */}
            <div className="space-y-8 mb-12">
              <p className="font-['Inter'] text-[17px] md:text-[19px] text-white/70 font-light leading-relaxed max-w-xl">
                Founded by renowned Ayurvedic practitioners and clinical nutritionists, AW Naturals is built on four decades of clinical experience.
              </p>
              <p className="font-['Inter'] text-[17px] md:text-[19px] text-white/70 font-light leading-relaxed max-w-xl">
                Our formulations are developed in collaboration with leading wellness experts, ensuring each blend delivers measurable health benefits while honoring traditional herbal practices.
              </p>
            </div>

            {/* Signature Quote Block */}
            <div
              className="p-10 rounded-3xl border border-white/5 relative overflow-hidden backdrop-blur-sm group"
              style={{ background: 'linear-gradient(135deg, rgba(15,61,46,0.15) 0%, rgba(11,11,11,0.4) 100%)' }}
            >
              {/* Highlight bar */}
              <div className="absolute top-0 left-0 w-[2px] h-full bg-gradient-to-b from-[#D4AF37] via-[#D4AF37]/50 to-transparent" />
              
              <p className="font-['Cormorant_Garamond',serif] font-semibold text-white/90 text-[22px] md:text-[24px] mb-8 italic leading-[1.4] relative z-10">
                "True well-being is not passive healing—it is an intentional architecture designed at the intersection of time-tested botanical knowledge and rigorous scientific validation."
              </p>
              
              <div className="flex items-center gap-6 relative z-10 translate-y-1">
                <div className="h-px w-12 bg-gradient-to-r from-[#D4AF37] to-transparent" />
                <span className="font-['Inter'] text-[#D4AF37] text-[12px] tracking-[0.3em] uppercase font-bold">
                  — Dr. Neil Rasal, MD (Ayurveda)
                </span>
              </div>
              
              {/* Subtle background glow on hover */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-1000 pointer-events-none" 
                   style={{ background: 'radial-gradient(circle at center, rgba(212,175,55,0.05) 0%, transparent 70%)' }} />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}