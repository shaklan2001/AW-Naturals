import { useParams } from 'react-router';
import { useBlogBySlug } from '../../hooks/use-storefront-queries';
import { BlogPostLoadingState } from './components/BlogPostLoadingState';
import { BlogPostErrorState } from './components/BlogPostErrorState';
import { BlogPostView } from './components/BlogPostView';

export function BlogPostPage() {
    const { slug } = useParams();
    const { data: post, isPending, isError, error } = useBlogBySlug(slug);

    if (isPending) {
        return <BlogPostLoadingState />;
    }

    if (isError || !post) {
        return <BlogPostErrorState message={error?.message} />;
    }

    return <BlogPostView post={post} />;
}
