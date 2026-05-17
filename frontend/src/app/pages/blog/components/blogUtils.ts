import type { BlogListItem } from '@/app/api/public-api';

export interface BlogListPost {
    id: string;
    slug: string;
    title: string;
    category: string;
    coverImage: string;
    createdAt: string;
    author: string;
    seoDescription: string;
}

/** Map published blog row from `/api/v1/blogs` into list-card props. */
export function toBlogListPost(item: BlogListItem): BlogListPost {
    return {
        id: item.id,
        slug: item.slug,
        title: item.title,
        category: item.category,
        coverImage: item.coverImage,
        createdAt: item.createdAt,
        author: item.author,
        seoDescription: item.seoDescription ?? '',
    };
}

export function formatPostDate(iso: string): string {
    try {
        return new Date(iso).toLocaleDateString(undefined, {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    } catch {
        return iso;
    }
}

export function excerptFromPost(p: BlogListPost): string {
    if (p.seoDescription?.trim()) return p.seoDescription;
    return `${p.title} — ${p.category}`;
}
