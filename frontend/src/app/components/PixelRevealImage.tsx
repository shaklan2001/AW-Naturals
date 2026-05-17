import { useMemo } from 'react';
import { ImageWithFallback } from '@/shared/components/ImageWithFallback';
import { cn } from './ui/utils';

export interface PixelRevealImageProps {
    /** Default (visible) image */
    src: string;
    /** If set and different from `src`, hover swaps via pixel-dissolve. Omit for a single static image. */
    hoverSrc?: string;
    alt: string;
    className?: string;
    /** Grid density (trade-off: performance vs. pixel size) */
    cols?: number;
    rows?: number;
}

/**
 * With `hoverSrc`, hover swaps images via staggered pixel-cell opacity.
 * Without `hoverSrc` (or same URL as `src`), shows one image only — no hover swap.
 */
export function PixelRevealImage({ src, hoverSrc, alt, className, cols = 12, rows = 12 }: PixelRevealImageProps) {
    const delaysMs = useMemo(() => {
        const n = cols * rows;
        return Array.from({ length: n }, (_, i) => {
            const col = i % cols;
            const row = Math.floor(i / cols);
            return ((col * 37 + row * 53) % 50) * 8;
        });
    }, [cols, rows]);

    /** Match About legacy card: perfect square + rounded-[1.75rem] md:rounded-[2rem] */
    const frameClass =
        'relative mx-auto w-full max-w-[min(100%,520px)] overflow-hidden rounded-[1.75rem] border border-white/[0.08] bg-[#0a0a0a] shadow-[0_28px_90px_rgba(0,0,0,0.55),0_0_40px_rgba(212,175,55,0.08),inset_0_0_0_1px_rgba(200,168,75,0.12)] md:rounded-[2rem]';

    const swapHover = Boolean(hoverSrc && hoverSrc !== src);

    if (!swapHover) {
        return (
            <div className={cn(frameClass, className)}>
                <div className="relative aspect-square w-full">
                    <ImageWithFallback src={src} alt={alt} className="h-full w-full object-cover" />
                    <div className="pointer-events-none absolute inset-0 z-[2] bg-gradient-to-tr from-[#0B0B0B]/50 to-transparent" />
                </div>
            </div>
        );
    }

    return (
        <div className={cn('group', frameClass, className)}>
            <div className="relative aspect-square w-full">
                <ImageWithFallback
                    src={hoverSrc!}
                    alt=""
                    className="absolute inset-0 z-0 h-full w-full object-cover"
                    aria-hidden
                />
                <div
                    className="absolute inset-0 z-[1] grid h-full w-full"
                    style={{
                        gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`,
                        gridTemplateRows: `repeat(${rows}, minmax(0, 1fr))`,
                    }}
                    aria-hidden
                >
                    {delaysMs.map((delay, i) => {
                        const col = i % cols;
                        const row = Math.floor(i / cols);
                        const x = cols <= 1 ? 0 : (col / (cols - 1)) * 100;
                        const y = rows <= 1 ? 0 : (row / (rows - 1)) * 100;
                        return (
                            <div
                                key={i}
                                className="min-h-0 min-w-0 bg-cover bg-center opacity-100 transition-opacity duration-[480ms] ease-out group-hover:opacity-0"
                                style={{
                                    backgroundImage: `url(${src})`,
                                    backgroundSize: `${cols * 100}% ${rows * 100}%`,
                                    backgroundPosition: `${x}% ${y}%`,
                                    transitionDelay: `${delay}ms`,
                                }}
                            />
                        );
                    })}
                </div>
                <div className="pointer-events-none absolute inset-0 z-[2] bg-gradient-to-tr from-[#0B0B0B]/50 to-transparent" />
            </div>
            <span className="sr-only">{alt}</span>
        </div>
    );
}
