import { motion } from 'motion/react';
import { Link } from 'react-router';
import { Calendar, User, ArrowRight } from 'lucide-react';
import { ImageWithFallback } from '@/shared/components/ImageWithFallback';
import type { BlogListPost } from './blogUtils';
import { excerptFromPost, formatPostDate } from './blogUtils';

export interface BlogPostCardProps {
    post: BlogListPost;
    index: number;
}

export function BlogPostCard({ post, index }: BlogPostCardProps) {
    return (
        <motion.article
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
        >
            <Link to={`/blog/${post.slug}`} className="block h-full group">
                <div
                    className="relative flex h-full flex-col overflow-hidden rounded-[32px] transition-colors duration-500"
                    style={{
                        background: 'linear-gradient(135deg, #EBE3CE 0%, #DDD0AE 100%)',
                        border: '1px solid #E8E1CD',
                        boxShadow: '0 15px 30px rgba(0,0,0,0.2)',
                    }}
                >
                    <div
                        className="absolute inset-0 pointer-events-none opacity-[0.25] mix-blend-multiply"
                        style={{
                            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.08'/%3E%3C/svg%3E")`,
                        }}
                    />

                    <div className="relative h-64 overflow-hidden m-3 rounded-[24px]">
                        <ImageWithFallback
                            src={post.coverImage}
                            alt={post.title}
                            className="w-full h-full object-cover grayscale-[0.2] group-hover:grayscale-0 transition-[filter] duration-1000"
                        />
                        <div className="absolute top-4 left-4 bg-black/80 backdrop-blur-md border border-white/10 px-4 py-1.5 rounded-full text-[10px] font-bold font-['Inter'] text-[#D4AF37] uppercase tracking-[0.2em]">
                            {post.category}
                        </div>
                    </div>

                    <div className="p-8 pt-4 flex flex-col flex-grow relative z-10">
                        <div className="flex items-center text-[#0B0B0B]/50 text-[11px] font-bold font-['Inter'] mb-4 uppercase tracking-widest">
                            <Calendar className="w-3.5 h-3.5 mr-2" />
                            {formatPostDate(post.createdAt)}
                        </div>

                        <h3 className="mb-4 font-['Gloock'] text-[28px] leading-tight text-[#1A1A1A]">
                            {post.title}
                        </h3>

                        <p className="font-['Inter'] text-[14px] text-[#333333] mb-8 font-medium leading-relaxed opacity-70 flex-grow">
                            {excerptFromPost(post)}
                        </p>

                        <div className="flex items-center justify-between pt-6 border-t border-black/5 mt-auto">
                            <div className="flex items-center text-[#1A1A1A] font-bold font-['Inter'] text-[12px] tracking-wide">
                                <div className="w-8 h-8 rounded-full bg-[#0B0B0B]/5 flex items-center justify-center mr-3 border border-black/10">
                                    <User className="w-3.5 h-3.5 text-black/40" />
                                </div>
                                {post.author}
                            </div>
                            <div className="w-10 h-10 rounded-full bg-[#0B0B0B] flex items-center justify-center text-[#D4AF37] shadow-lg group-hover:scale-110 transition-transform">
                                <ArrowRight className="w-5 h-5" />
                            </div>
                        </div>
                    </div>
                </div>
            </Link>
        </motion.article>
    );
}
