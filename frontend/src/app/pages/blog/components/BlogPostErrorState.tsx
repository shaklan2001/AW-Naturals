import { Link } from 'react-router';

export interface BlogPostErrorStateProps {
    message?: string;
}

export function BlogPostErrorState({ message }: BlogPostErrorStateProps) {
    return (
        <div className="pt-24 min-h-screen bg-[#0B0B0B] flex flex-col items-center justify-center px-6">
            <p className="text-[#F5F5DC]/80 mb-2">{message ?? 'Article not found'}</p>
            <Link to="/blog" className="text-[#D4AF37] hover:underline font-['Inter']">
                Back to Blog
            </Link>
        </div>
    );
}
