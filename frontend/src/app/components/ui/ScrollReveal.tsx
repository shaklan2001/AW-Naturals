import React, { useRef, useMemo } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';

export interface ScrollRevealProps {
    children: React.ReactNode;
    className?: string;
    revealSpeed?: number;
    wordAnimation?: boolean; // if false, animates letters instead of words
}

export function ScrollReveal({
    children,
    className = '',
    wordAnimation = true,
}: ScrollRevealProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ['start 80%', 'start 20%'],
    });

    const words = useMemo(() => {
        if (typeof children !== 'string') {
            return String(children).split(' ');
        }
        return children.split(' ');
    }, [children]);

    return (
        <span ref={containerRef} className={`inline-flex flex-wrap ${className}`}>
            {words.map((word, i) => {
                const start = i / words.length;
                const end = start + 1 / words.length;
                return (
                    <Word key={i} progress={scrollYProgress} range={[start, end]}>
                        {word}
                    </Word>
                );
            })}
        </span>
    );
}

function Word({ children, progress, range }: { children: string; progress: any; range: [number, number] }) {
    const opacity = useTransform(progress, range, [0.15, 1]);
    const filter = useTransform(progress, range, ['blur(4px)', 'blur(0px)']);
    
    return (
        <span className="relative mr-[0.25em]">
            <motion.span style={{ opacity: opacity, filter: filter }}>
                {children}
            </motion.span>
        </span>
    );
}
