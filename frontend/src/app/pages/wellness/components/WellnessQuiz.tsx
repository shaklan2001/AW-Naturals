import { motion } from 'motion/react';
import { ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router';
import { ImageWithFallback } from '@/shared/components/ImageWithFallback';

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

/** Home-page CTA strip that routes into `/find-your-blend` (wellness assessment quiz). */
export function WellnessQuiz() {
    const navigate = useNavigate();

    const handleFindBlend = () => {
        navigate('/find-your-blend');
    };

    return (
        <section className="py-24 bg-[#0B0B0B] relative overflow-hidden">
            <div
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-[600px] opacity-10 pointer-events-none"
                style={{ background: 'radial-gradient(ellipse at center, #D4AF37 0%, transparent 70%)' }}
            />

            <div className="max-w-[1400px] mx-auto px-6 sm:px-8 relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        className="w-full relative"
                    >
                        <div className="absolute -inset-4 border border-[#C6A85B]/20 rounded-3xl z-0 pointer-events-none" />

                        <div className="relative z-10 rounded-2xl overflow-hidden bg-[#1A1A1A] w-full aspect-[4/5] sm:aspect-square lg:aspect-[4/5] flex items-center justify-center p-0 group">
                            <div
                                className="absolute inset-0 opacity-40 mix-blend-overlay group-hover:opacity-60 transition-opacity duration-700"
                                style={{ background: 'linear-gradient(45deg, #0B0B0B 0%, #C6A85B 100%)' }}
                            />

                            <ImageWithFallback
                                src="/assets/confuse.webp"
                                alt="Confused about which tea to choose"
                                className="w-full h-full scale-105 object-cover rounded-xl filter brightness-[0.8] contrast-[1.1]"
                            />

                            <div className="absolute bottom-4 left-4 right-4 sm:bottom-6 sm:left-6 sm:right-6 p-4 sm:p-6 rounded-xl bg-black/40 backdrop-blur-md border border-white/10 group-hover:border-[#C6A85B]/40 transition-colors duration-500">
                                <p className="font-['Playfair_Display'] text-[#F5F5DC] text-[14px] sm:text-[18px] lg:text-[20px] italic leading-snug">
                                    &quot;Which botanical blend is exactly what my body needs right now?&quot;
                                </p>
                            </div>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        className="w-full flex flex-col items-start text-left"
                    >
                        <div className="mb-6 inline-flex px-4 py-1.5 rounded-full border border-[#C6A85B]/30 bg-[#151515] backdrop-blur-md">
                            <span className="font-['Inter'] text-[10px] sm:text-[11px] font-medium tracking-[0.2em] uppercase text-[#C6A85B]">
                                Wellness assessment
                            </span>
                        </div>

                        <h2 className="font-['Cormorant_Garamond',serif] font-semibold text-[40px] sm:text-[48px] lg:text-[56px] text-white leading-[1.05] mb-6">
                            Still confused about what's best for your health?
                        </h2>

                        <h3 className="font-['Playfair_Display'] text-[28px] sm:text-[34px] text-white/80 mb-6">
                            Three questions — <GradientText>your blend</GradientText>
                        </h3>

                        <p className="font-['Inter'] text-[16px] sm:text-[18px] text-white/60 font-light leading-[1.7] mb-12 max-w-[500px]">
                            Take the guided wellness assessment on Find your blend. Answer three quick prompts and we
                            map you to the infusion our clinicians recommend — energy, sleep, or metabolic support —
                            plus clear next steps to shop.
                        </p>

                        <button
                            type="button"
                            onClick={handleFindBlend}
                            className="group relative px-10 py-5 rounded-full font-['Inter'] text-[14px] tracking-[0.02em] text-[#0B0B0B] transition-all duration-300 overflow-hidden w-full sm:w-auto"
                            style={{ fontWeight: 500, background: 'linear-gradient(90deg, #C6A85B, #E5D08A)' }}
                        >
                            <div
                                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-0"
                                style={{ boxShadow: '0 0 24px rgba(212,175,55,0.4)' }}
                            />
                            <motion.div
                                initial={{ x: '-100%' }}
                                animate={{ x: '200%' }}
                                transition={{ repeat: Infinity, repeatDelay: 1.5, duration: 2, ease: 'linear' }}
                                className="absolute top-0 left-0 z-0 pointer-events-none"
                                style={{
                                    background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.5), transparent)',
                                    width: '40%',
                                    height: '100%',
                                    transform: 'skewX(-20deg)',
                                }}
                            />
                            <span className="relative z-10 flex items-center justify-center gap-4">
                                Find your blend
                                <span className="w-8 h-8 rounded-full bg-[#0B0B0B]/10 flex flex-col items-center justify-center group-hover:bg-[#0B0B0B]/20 transition-colors">
                                    <ArrowRight className="w-4 h-4 text-[#0B0B0B] group-hover:translate-x-1 transition-transform" />
                                </span>
                            </span>
                        </button>
                        <p className="font-['Inter'] text-[13px] text-white/40 mt-6 pl-4 flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#C6A85B]" />
                            About one minute · No account required
                        </p>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
