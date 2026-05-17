import { Link } from 'react-router';
import { motion } from 'motion/react';
import { Calendar, User, ArrowLeft, ArrowRight } from 'lucide-react';
import { ImageWithFallback } from '@/shared/components/ImageWithFallback';
import { SectionWrapper } from '../../../components/SectionWrapper';
import type { BlogDetail } from '../../../api/public-api';
import { formatPostDate } from './blogUtils';

export interface BlogPostViewProps {
    post: BlogDetail;
}

export function BlogPostView({ post }: BlogPostViewProps) {
    return (
        <div className="pt-24 bg-[#0B0B0B] min-h-screen text-[#F5F5DC]">
            <article className="pb-8">
                <div className="max-w-5xl mx-auto px-6 mb-8">
                    <Link
                        to="/blog"
                        className="inline-flex items-center gap-2 text-[#D4AF37] hover:gap-3 transition-all font-['Inter'] text-sm font-medium mb-10"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Back to Blog
                    </Link>
                </div>

                <SectionWrapper className="pb-12">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="max-w-3xl mx-auto px-6 text-center"
                    >
                        <div className="flex flex-wrap items-center justify-center gap-4 mb-6 text-sm">
                            <span className="px-3 py-1 bg-[#D4AF37]/10 text-[#D4AF37] border border-[#D4AF37]/30 rounded-full">
                                {post.category}
                            </span>
                            <span className="flex items-center gap-2 text-[#F5F5DC]/50">
                                <Calendar className="w-4 h-4" />
                                {formatPostDate(post.createdAt)}
                            </span>
                            <span className="flex items-center gap-2 text-[#F5F5DC]/50">
                                <User className="w-4 h-4" />
                                {post.author}
                            </span>
                        </div>
                        <h1 className="font-['Playfair_Display'] text-4xl md:text-6xl mb-6 leading-tight">{post.title}</h1>
                        {post.seoDescription ? (
                            <p className="text-lg text-[#F5F5DC]/70 font-['Inter'] font-light max-w-2xl mx-auto">
                                {post.seoDescription}
                            </p>
                        ) : null}
                    </motion.div>
                </SectionWrapper>

                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8, delay: 0.15 }}
                    className="w-full max-w-5xl mx-auto px-6 mb-16"
                >
                    <div className="relative rounded-3xl overflow-hidden aspect-video shadow-[0_0_40px_rgba(212,175,55,0.15)]">
                        <ImageWithFallback src={post.coverImage} alt={post.title} className="w-full h-full object-cover" />
                    </div>
                </motion.div>

                <SectionWrapper className="pt-0">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.3 }}
                        className="max-w-3xl mx-auto px-6"
                    >
                        <div
                            className="prose prose-invert max-w-none text-lg text-[#F5F5DC]/80 font-light leading-relaxed
                [&>h2]:text-3xl [&>h2]:text-[#F5F5DC] [&>h2]:font-medium [&>h2]:mt-12 [&>h2]:mb-6
                [&>h3]:text-2xl [&>h3]:text-[#F5F5DC] [&>h3]:mt-10 [&>h3]:mb-4
                [&>p]:mb-8 [&>p]:leading-loose
                [&>ul]:list-disc [&>ul]:pl-6 [&>ul]:mb-8 [&>ul>li]:mb-3 [&>ul>li::marker]:text-[#D4AF37]
                [&>blockquote]:border-l-4 [&>blockquote]:border-[#D4AF37] [&>blockquote]:bg-[#1a1a1a] [&>blockquote]:p-6 [&>blockquote]:rounded-r-xl [&>blockquote]:text-[#D4AF37]/90 [&>blockquote]:mb-8 [&>blockquote]:italic"
                            dangerouslySetInnerHTML={{ __html: post.content }}
                        />
                    </motion.div>
                </SectionWrapper>
            </article>

            <SectionWrapper className="bg-[#1a1a1a] border-t border-[#D4AF37]/10 mt-12 py-16">
                <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8 text-center md:text-left px-6">
                    <div>
                        <h3 className="text-2xl font-['Inter'] text-[#F5F5DC] mb-2">Continue Reading</h3>
                        <p className="text-[#F5F5DC]/60 font-['Inter'] font-light">
                            Explore more insights from our clinical experts.
                        </p>
                    </div>
                    <Link to="/blog">
                        <span className="inline-flex px-8 py-4 bg-[#D4AF37] text-[#0B0B0B] font-['Inter'] font-medium rounded-full hover:bg-[#B89B2B] transition-all items-center gap-2 cursor-pointer">
                            View All Articles
                            <ArrowRight className="w-5 h-5" />
                        </span>
                    </Link>
                </div>
            </SectionWrapper>
        </div>
    );
}
