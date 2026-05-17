import { motion } from 'motion/react';
import { PremiumSectionChip } from '../../../components/PremiumSectionChip';

export function BlogArchiveHero() {
    return (
        <section className="pt-36 pb-24 px-6 relative overflow-hidden">
            <div className="max-w-4xl mx-auto text-center relative z-10">
                <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
                    <div className="mb-8 flex justify-center">
                        <PremiumSectionChip>Clinical Archive</PremiumSectionChip>
                    </div>

                    <h1 className="font-['Gloock'] text-[48px] md:text-[72px] mb-6 text-[#F5F5DC] tracking-tight leading-tight">
                        Wellness{' '}
                        <span className="italic text-transparent bg-clip-text bg-gradient-to-r from-[#C6A85B] via-[#E5D08A] to-[#C6A85B] animate-shine">
                            Insights
                        </span>
                    </h1>
                    <p className="font-['Inter'] text-[16px] md:text-[18px] text-[#F5F5DC]/60 max-w-2xl mx-auto font-light leading-relaxed">
                        Expert perspectives on botanical efficacy, biological rhythms, and the clinical evolution of
                        Ayurveda.
                    </p>
                </motion.div>
            </div>

            <style>{`
          @keyframes shine {
            0% { background-position: 200% center; }
            100% { background-position: -200% center; }
          }
          .animate-shine {
            background-size: 200% auto;
            animation: shine 3s linear infinite;
          }
        `}</style>
        </section>
    );
}
