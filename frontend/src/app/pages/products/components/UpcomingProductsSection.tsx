import { motion } from 'motion/react';
import { Link } from 'react-router';
import { PremiumSectionChip } from '../../../components/PremiumSectionChip';
import { ImageWithFallback } from '@/shared/components/ImageWithFallback';
import type { StorefrontProduct } from '../../../api/public-api';

export interface UpcomingProductsSectionProps {
    products: StorefrontProduct[];
}

/** Renders admin-marked `upcoming` products from the API (replaces static placeholders). */
export function UpcomingProductsSection({ products }: UpcomingProductsSectionProps) {
    if (products.length === 0) return null;

    return (
        <section className="relative z-10 border-t border-white/[0.05] px-6 py-24">
            <div className="mx-auto max-w-7xl">
                <div className="flex flex-col items-center pb-16 text-center">
                    <PremiumSectionChip>Future Formulations</PremiumSectionChip>
                    <h2 className="mt-8 font-['Gloock'] text-[36px] leading-tight text-[#F5F5DC] md:text-[48px]">
                        Upcoming{' '}
                        <span className="animate-shine bg-gradient-to-r from-[#C6A85B] via-[#E5D08A] to-[#C6A85B] bg-clip-text italic text-transparent">
                            Releases
                        </span>
                    </h2>
                    <p className="mx-auto mt-4 max-w-xl font-['Inter'] text-[15px] font-light text-[#F5F5DC]/60 md:text-base">
                        Preview products marked as Upcoming in the admin — visible here before they go on sale.
                    </p>
                </div>

                <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
                    {products.map((prod, index) => (
                        <motion.div
                            key={prod.id}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: '-50px' }}
                            transition={{ duration: 0.8, delay: index * 0.15, ease: 'easeOut' }}
                            className="group relative overflow-hidden rounded-[20px] border border-white/[0.08] bg-[#0a0a0a]/50 p-6 shadow-[0_16px_48px_rgba(0,0,0,0.4)] backdrop-blur-[32px] transition-all duration-500 hover:-translate-y-1 hover:border-white/[0.15] hover:bg-[#111111]/80"
                        >
                            <Link to={`/products/${prod.id}`} className="relative mb-6 block aspect-square w-full overflow-hidden rounded-[14px] bg-black/40">
                                <ImageWithFallback
                                    src={prod.image}
                                    alt={prod.name}
                                    className="h-full w-full object-cover opacity-85 transition-all duration-700 group-hover:opacity-100"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-[#0B0B0B]/90 via-[#0B0B0B]/20 to-transparent" />
                                <div className="absolute bottom-4 left-4">
                                    <span className="inline-block rounded-full border border-[#D4AF37]/20 bg-[#D4AF37]/10 px-3 py-1 font-['Inter'] text-[9px] font-bold uppercase tracking-[0.2em] text-[#D4AF37] shadow-sm">
                                        Coming soon
                                    </span>
                                </div>
                            </Link>
                            <div>
                                <h3 className="mb-1 font-['Gloock'] text-2xl tracking-wide text-[#F5F5DC]">{prod.name}</h3>
                                <p className="mb-3 block font-['Inter'] text-[11px] font-semibold uppercase tracking-[0.2em] text-[#D4AF37]/90">
                                    {prod.benefit}
                                </p>
                                <p className="font-['Inter'] text-[14px] font-light leading-relaxed text-[#F5F5DC]/60">
                                    {prod.shortDescription ?? prod.description}
                                </p>
                                {prod.price > 0 && (
                                    <p className="mt-3 font-['Playfair_Display'] text-lg text-[#D4AF37]/80">₹{prod.price}</p>
                                )}
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
