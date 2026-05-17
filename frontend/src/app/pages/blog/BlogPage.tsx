import { Loader2 } from 'lucide-react';
import { SectionWrapper } from '../../components/SectionWrapper';
import { usePublishedBlogs } from '../../hooks/use-storefront-queries';
import { BlogArchiveHero } from './components/BlogArchiveHero';
import { BlogFeaturedPost } from './components/BlogFeaturedPost';
import { BlogPostCard } from './components/BlogPostCard';
import { toBlogListPost } from './components/blogUtils';
import { Button } from '@/app/components/ui/button';

export function BlogPage() {
    const { data: blogs = [], isPending, isError, error, refetch } = usePublishedBlogs();

    return (
        <div className="bg-[#0B0B0B] bg-[radial-gradient(ellipse_at_top,rgba(15,61,46,0.45),transparent_60vw)] min-h-screen">
            <BlogArchiveHero />

            <SectionWrapper className="pt-0">
                {isPending ? (
                    <div className="flex min-h-[40vh] flex-col items-center justify-center gap-3 py-16 text-[#F5F5DC]">
                        <Loader2 className="h-8 w-8 animate-spin text-[#D4AF37]" aria-hidden />
                        <span className="font-['Inter'] text-sm">Loading articles…</span>
                    </div>
                ) : null}

                {isError ? (
                    <div className="mx-auto max-w-lg rounded-2xl border border-[#D4AF37]/20 bg-[#1a1a1a] px-8 py-10 text-center">
                        <p className="mb-2 font-['Inter'] text-[#F5F5DC]">Could not load articles</p>
                        <p className="mb-6 font-['Inter'] text-sm text-[#F5F5DC]/60">{error?.message}</p>
                        <Button type="button" variant="secondary" onClick={() => void refetch()}>
                            Try again
                        </Button>
                    </div>
                ) : null}

                {!isPending && !isError && blogs.length === 0 ? (
                    <div className="mx-auto max-w-lg py-16 text-center">
                        <p className="font-['Gloock'] text-2xl text-[#F5F5DC]">No articles yet</p>
                        <p className="mt-3 font-['Inter'] text-sm text-[#F5F5DC]/55">
                            Published posts from the admin will appear here.
                        </p>
                    </div>
                ) : null}

                {!isPending && !isError && blogs.length > 0 ? (
                    <>
                        <BlogFeaturedPost post={toBlogListPost(blogs[0]!)} />
                        {blogs.length > 1 ? (
                            <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-2">
                                {blogs.slice(1).map((post, index) => (
                                    <BlogPostCard key={post.id} post={toBlogListPost(post)} index={index} />
                                ))}
                            </div>
                        ) : null}
                    </>
                ) : null}
            </SectionWrapper>
        </div>
    );
}
