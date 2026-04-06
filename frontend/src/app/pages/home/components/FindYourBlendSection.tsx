import { motion } from 'motion/react';
import { ImageWithFallback } from '@/shared/components/ImageWithFallback';
import { PremiumGoldCtaLink } from '../../../components/PremiumGoldCtaButton';
import { SITE_CONTAINER_CLASS } from '../../../constants/site-layout';

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

/** Home-page CTA between Clinical Insights and Brewing Ritual — routes to `/find-your-blend`. */
export function FindYourBlendSection() {
    return (
        <section className="relative overflow-hidden bg-[#0B0B0B] py-24">
            <div
                className="pointer-events-none absolute left-1/2 top-1/2 h-[600px] w-full -translate-x-1/2 -translate-y-1/2 opacity-10"
                style={{ background: 'radial-gradient(ellipse at center, #D4AF37 0%, transparent 70%)' }}
            />

            <div className={SITE_CONTAINER_CLASS}>
                <div className="relative z-10 grid grid-cols-1 items-center gap-16 lg:grid-cols-2 lg:gap-24">
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        className="relative w-full"
                    >
                        <div className="pointer-events-none absolute -inset-4 z-0 rounded-3xl border border-[#C6A85B]/20" />

                        <div className="group relative z-10 flex aspect-[4/5] w-full items-center justify-center overflow-hidden rounded-2xl bg-[#1A1A1A] p-0 sm:aspect-square lg:aspect-[4/5]">
                            <div
                                className="absolute inset-0 opacity-40 mix-blend-overlay transition-opacity duration-700 group-hover:opacity-60"
                                style={{ background: 'linear-gradient(45deg, #0B0B0B 0%, #C6A85B 100%)' }}
                            />

                            <ImageWithFallback
                                src="/assets/confuse.webp"
                                alt="Confused about which tea to choose"
                                className="h-full w-full scale-105 rounded-xl object-cover brightness-[0.8] contrast-[1.1] filter"
                            />

                            <div className="absolute bottom-4 left-4 right-4 rounded-xl border border-white/10 bg-black/40 p-4 backdrop-blur-md transition-colors duration-500 group-hover:border-[#C6A85B]/40 sm:bottom-6 sm:left-6 sm:right-6 sm:p-6">
                                <p className="font-['Playfair_Display'] text-[14px] italic leading-snug text-[#F5F5DC] sm:text-[18px] lg:text-[20px]">
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
                        className="flex w-full flex-col items-start text-left"
                    >
                        <div className="mb-6 inline-flex rounded-full border border-[#C6A85B]/30 bg-[#151515] px-4 py-1.5 backdrop-blur-md">
                            <span className="font-['Inter'] text-[10px] font-medium uppercase tracking-[0.2em] text-[#C6A85B] sm:text-[11px]">
                                Wellness assessment
                            </span>
                        </div>

                        <h2 className="font-['Gloock'] mb-6 text-[40px] leading-[1.05] text-white sm:text-[48px] lg:text-[56px]">
                            Still confused about what&apos;s best for your health?
                        </h2>

                        <h3 className="font-['Playfair_Display'] mb-6 text-[28px] text-white/80 sm:text-[34px]">
                            Three questions — <GradientText>your blend</GradientText>
                        </h3>

                        <p className="mb-12 max-w-[500px] font-['Inter'] text-[16px] font-light leading-[1.7] text-white/60 sm:text-[18px]">
                            Take the guided wellness assessment on Find your blend. Answer three quick prompts and we
                            map you to the infusion our clinicians recommend — energy, sleep, or metabolic support —
                            plus clear next steps to shop.
                        </p>

                        <PremiumGoldCtaLink to="/find-your-blend" className="[&>span]:px-10 [&>span]:py-5">
                            Find your blend
                        </PremiumGoldCtaLink>

                        <p className="mt-6 flex items-center gap-2 pl-4 font-['Inter'] text-[13px] text-white/40">
                            <span className="h-1.5 w-1.5 rounded-full bg-[#C6A85B]" />
                            About one minute · No account required
                        </p>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
