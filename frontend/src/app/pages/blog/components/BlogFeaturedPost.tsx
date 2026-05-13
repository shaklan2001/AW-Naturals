import { motion } from 'motion/react';
import { Link } from 'react-router';
import { Calendar, User, ArrowRight } from 'lucide-react';
import { ImageWithFallback } from '@/shared/components/ImageWithFallback';
import type { BlogListPost } from './blogUtils';
import { excerptFromPost, formatPostDate } from './blogUtils';

const noiseBg = `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.08'/%3E%3C/svg%3E")`;

const cardSurfaceStyle = {
    background: 'linear-gradient(135deg, #EBE3CE 0%, #DDD0AE 100%)',
    border: '1px solid #E8E1CD',
    boxShadow: '0 15px 30px rgba(0,0,0,0.2)',
} as const;

export interface BlogFeaturedPostProps {
    post: BlogListPost;
}

export function BlogFeaturedPost({ post }: BlogFeaturedPostProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mb-24"
        >
            <Link to={`/blog/${post.slug}`} className="group block">
                <div className="relative overflow-hidden rounded-[32px]" style={cardSurfaceStyle}>
                    <div
                        className="pointer-events-none absolute inset-0 z-0 opacity-[0.25] mix-blend-multiply"
                        style={{ backgroundImage: noiseBg }}
                    />

                    <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12">
                        <div className="relative m-3 h-[280px] overflow-hidden rounded-[24px] sm:h-[340px] lg:col-span-7 lg:h-[min(560px,72vh)]">
                            <ImageWithFallback
                                src={post.coverImage}
                                alt={post.title}
                                className="h-full w-full object-cover grayscale-[0.2] group-hover:grayscale-0 transition-[filter] duration-1000"
                            />
                            <div className="absolute left-4 top-4 rounded-full border border-white/10 bg-black/80 px-4 py-1.5 font-['Inter'] text-[10px] font-bold uppercase tracking-[0.2em] text-[#D4AF37] backdrop-blur-md">
                                {post.category}
                            </div>
                        </div>

                        <div className="relative flex flex-col justify-center px-8 pb-10 pt-2 lg:col-span-5 lg:px-10 lg:pb-12 lg:pt-8 xl:px-14">
                            <div className="mb-4 flex items-center font-['Inter'] text-[11px] font-bold uppercase tracking-widest text-[#0B0B0B]/50">
                                <Calendar className="mr-2 h-3.5 w-3.5" />
                                {formatPostDate(post.createdAt)}
                            </div>

                            <h2 className="mb-6 font-['Cormorant_Garamond',serif] font-semibold text-[28px] leading-tight text-[#1A1A1A] lg:text-[36px] xl:text-[40px]">
                                {post.title}
                            </h2>

                            <p className="mb-10 font-['Inter'] text-[15px] font-medium leading-relaxed text-[#333333] opacity-70 lg:text-[16px]">
                                {excerptFromPost(post)}
                            </p>

                            <div className="mt-auto flex items-center justify-between border-t border-black/5 pt-8">
                                <div className="flex items-center font-['Inter'] text-[12px] font-bold tracking-wide text-[#1A1A1A]">
                                    <div className="mr-3 flex h-8 w-8 items-center justify-center rounded-full border border-black/10 bg-[#0B0B0B]/5">
                                        <User className="h-3.5 w-3.5 text-black/40" />
                                    </div>
                                    {post.author}
                                </div>
                                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#0B0B0B] text-[#D4AF37] shadow-lg transition-transform duration-300 group-hover:scale-110">
                                    <ArrowRight className="h-5 w-5" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </Link>
        </motion.div>
    );
}
