import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Plus, Minus } from 'lucide-react';
import { HOME_FAQ_ITEMS } from '../constants/home-faq';

export function FaqSection() {
    const [openId, setOpenId] = useState<string | null>(HOME_FAQ_ITEMS[0]?.id ?? null);

    return (
        <section className="relative overflow-hidden bg-[#0B0B0B] py-28 md:py-36">
            <style>{`
        @keyframes shine {
          0% { background-position: 200% center; }
          100% { background-position: -200% center; }
        }
        .animate-shine {
          animation: shine 3s linear infinite;
        }
      `}</style>
            {/* ── Subtle ambient — no heavy green ── */}
            <div className="pointer-events-none absolute inset-0">
                <div
                    className="absolute inset-0"
                    style={{
                        background:
                            'radial-gradient(ellipse 60% 50% at 50% 0%, rgba(212,175,55,0.07) 0%, transparent 65%)',
                    }}
                />
                {/* Top gold shimmer line */}
                <div
                    className="absolute left-0 right-0 top-0 h-px"
                    style={{
                        background:
                            'linear-gradient(90deg, transparent 10%, rgba(212,175,55,0.25) 50%, transparent 90%)',
                    }}
                />
            </div>

            <div className="relative z-10 mx-auto max-w-3xl px-6">
                {/* ── Header ── */}
                <motion.div
                    initial={{ opacity: 0, y: 28 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.4 }}
                    transition={{ duration: 0.75, ease: 'easeOut' }}
                    className="mb-14 text-center md:mb-16"
                >
                    <div className="mb-6 inline-flex rounded-full border border-[#C6A85B]/30 bg-[#151515] px-4 py-1.5 backdrop-blur-md">
                        <span className="font-['Inter'] text-[10px] font-medium uppercase tracking-[0.2em] text-[#C6A85B] sm:text-[11px]">
                            Frequently Asked
                        </span>
                    </div>

                    <h2
                        className="mb-6 font-['Gloock'] text-[48px] leading-none tracking-tight text-[#F5F5DC] md:text-[56px] lg:text-[64px]"
                        style={{ fontWeight: 400 }}
                    >
                        Answers for your{' '}
                        <span className="relative inline-block">
                            <span className="relative bg-gradient-to-r from-[#C6A85B] via-[#E5D08A] to-[#C6A85B] bg-[length:200%_100%] bg-clip-text italic text-transparent animate-shine">
                                Wellness Journey
                            </span>
                        </span>
                    </h2>
                    <p className="mx-auto max-w-2xl font-['Inter'] text-[16px] font-light text-[#F5F5DC]/60 md:text-[18px]">
                        Common questions about usage, safety, results, and choosing the right AW Naturals
                        protocol.
                    </p>
                </motion.div>

                {/* ── Cream FAQ Cards ── */}
                <div className="space-y-3">
                    {HOME_FAQ_ITEMS.map((item, index) => {
                        const isOpen = openId === item.id;
                        return (
                            <motion.div
                                key={item.id}
                                initial={{ opacity: 0, y: 18 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, amount: 0.2 }}
                                transition={{ duration: 0.5, delay: index * 0.06, ease: 'easeOut' }}
                            >
                                <div
                                    className="overflow-hidden rounded-[20px]"
                                    style={{
                                        background: isOpen
                                            ? 'linear-gradient(135deg, #EBE3CE 0%, #DDD0AE 100%)'
                                            : 'linear-gradient(135deg, #E8E0CB 0%, #D9CCB0 100%)',
                                        border: isOpen
                                            ? '1px solid #C9AB6E'
                                            : '1px solid #D4C49A',
                                        boxShadow: isOpen
                                            ? '0 12px 40px rgba(0,0,0,0.35), inset 0 1px 3px rgba(255,255,255,0.5)'
                                            : '0 4px 20px rgba(0,0,0,0.25), inset 0 1px 2px rgba(255,255,255,0.4)',
                                        transition: 'all 0.35s ease',
                                    }}
                                >
                                    <button
                                        type="button"
                                        onClick={() => setOpenId(isOpen ? null : item.id)}
                                        className="relative flex w-full items-center gap-4 px-6 py-5 text-left"
                                        aria-expanded={isOpen}
                                    >
                                        {/* Question */}
                                        <span
                                            className="flex-1 font-['Inter'] text-[15px] font-semibold leading-snug md:text-[16px]"
                                            style={{ color: isOpen ? '#1A1A1A' : '#2C2409' }}
                                        >
                                            {item.question}
                                        </span>

                                        {/* Toggle icon */}
                                        <span
                                            className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full"
                                            style={{
                                                background: isOpen
                                                    ? 'rgba(26,26,26,0.12)'
                                                    : 'rgba(26,26,26,0.08)',
                                                color: isOpen ? '#1A1A1A' : '#5C4A1A',
                                            }}
                                        >
                                            {isOpen ? (
                                                <Minus className="h-3.5 w-3.5" />
                                            ) : (
                                                <Plus className="h-3.5 w-3.5" />
                                            )}
                                        </span>
                                    </button>

                                    <AnimatePresence initial={false}>
                                        {isOpen && (
                                            <motion.div
                                                key="answer"
                                                initial={{ height: 0, opacity: 0 }}
                                                animate={{ height: 'auto', opacity: 1 }}
                                                exit={{ height: 0, opacity: 0 }}
                                                transition={{ duration: 0.36, ease: [0.4, 0, 0.2, 1] }}
                                                className="overflow-hidden"
                                            >
                                                <div
                                                    className="px-6 pb-6"
                                                    style={{ borderTop: '1px solid rgba(139,107,34,0.2)' }}
                                                >
                                                    <p
                                                        className="pt-4 font-['Inter'] text-sm leading-relaxed md:text-[15px]"
                                                        style={{ color: '#3D2E08' }}
                                                    >
                                                        {item.answer}
                                                    </p>
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
