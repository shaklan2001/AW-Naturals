import { motion } from 'motion/react';
import { Microscope, CheckCircle, Clock, Leaf } from 'lucide-react';

export function TrustStrip() {
  const features = [
    { icon: Microscope, text: 'Doctor Formulated' },
    { icon: CheckCircle, text: 'Nutritionist Approved' },
    { icon: Clock, text: '40+ Years Expertise' },
    { icon: Leaf, text: '100% Natural Ingredients' },
  ];

  return (
    <section className="relative -mt-10 overflow-hidden bg-[#0B0B0B] py-12 sm:-mt-14 lg:-mt-20 lg:py-24">
      {/* Soft top blend from hero */}
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-[#0B0B0B] via-[#0B0B0B]/80 to-transparent sm:h-28 lg:h-32"
        aria-hidden
      />
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#C6A85B]/20 to-transparent"></div>
      <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse 50% 100% at 50% 0%, rgba(200, 180, 100, 0.03) 0%, transparent 100%)' }}></div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="flex flex-wrap justify-center gap-8 sm:gap-12 md:gap-24">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, delay: index * 0.15, ease: "easeOut" }}
              className="flex flex-col items-center text-center gap-4 md:gap-6 group"
            >
              {/* Premium Icon Container with Glow */}
              <div className="relative">
                {/* Animated Outer Ring */}
                <motion.div 
                  animate={{ rotate: 360 }}
                  transition={{ duration: 20 + index * 5, repeat: Infinity, ease: "linear" }}
                  className="absolute -inset-3 md:-inset-4 rounded-full border border-dashed border-[#C6A85B]/20 opacity-0 group-hover:opacity-100 transition-opacity duration-700"
                ></motion.div>
                
                {/* Solid Glass Circle */}
                <div className="w-16 h-16 md:w-24 md:h-24 rounded-full bg-gradient-to-b from-[#151515] to-[#0A0A0A] backdrop-blur-xl border border-white/[0.05] shadow-[0_0_20px_rgba(198,168,91,0.03)] group-hover:shadow-[0_0_40px_rgba(198,168,91,0.15)] flex items-center justify-center transition-[box-shadow,border-color] duration-500">
                  <feature.icon className="w-7 h-7 md:w-10 md:h-10 text-[#E5D08A]/80 group-hover:text-[#E5D08A] transition-colors duration-500" strokeWidth={1.2} />
                </div>
              </div>

              {/* Typography */}
              <p className="font-['Inter'] text-[12px] md:text-[15px] tracking-[0.05em] text-white/50 group-hover:text-white/80 transition-colors duration-500 uppercase font-medium max-w-[130px] md:max-w-[160px]">
                {feature.text}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}