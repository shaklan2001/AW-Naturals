import { memo, useRef } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import PixelBlast from '@/app/components/ui/pixel-blast';

function AnimatedWord({ children, progress, range }: { children: React.ReactNode; progress: any; range: [number, number] }) {
    const opacity = useTransform(progress, range, [0.15, 1]);
    const filter = useTransform(progress, range, ['blur(4px)', 'blur(0px)']);
    return (
        <span className="relative inline-block mr-[0.25em]">
            <motion.span style={{ opacity, filter }} className="inline-block">
                {children}
            </motion.span>
        </span>
    );
}

export const AboutQuoteSection = memo(function AboutQuoteSection() {
    const containerRef = useRef<HTMLElement>(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ['start 85%', 'start 20%'],
    });

    const totalWords = 8;
    const step = 1 / totalWords;

    return (
        <section ref={containerRef} className="quote-section relative w-full overflow-hidden py-48 text-center md:py-56">
            <div className="absolute inset-0 z-0 opacity-25">
                <PixelBlast
                    color="#c8a84b"
                    variant="square"
                    pixelSize={4}
                    patternScale={3}
                    patternDensity={0.7}
                    edgeFade={1}
                />
            </div>
            <div className="relative z-10 mx-auto max-w-6xl px-6 pointer-events-none">
                <h2 className="founder-quote font-['Gloock'] text-4xl leading-[1.15] text-[#F5F5DC] opacity-95 drop-shadow-2xl sm:text-5xl md:text-7xl lg:text-8xl flex flex-wrap justify-center">
                    <AnimatedWord progress={scrollYProgress} range={[0 * step, 1 * step]}>&ldquo;Decades</AnimatedWord>
                    <AnimatedWord progress={scrollYProgress} range={[1 * step, 2 * step]}>of</AnimatedWord>
                    <AnimatedWord progress={scrollYProgress} range={[2 * step, 3 * step]}>
                        <span className="font-['Gloock'] italic bg-gradient-to-r from-[#C6A85B] via-[#E5D08A] to-[#C6A85B] bg-clip-text text-transparent">
                            Experience
                        </span>
                        .
                    </AnimatedWord>
                    
                    <div className="w-full h-0 sm:block hidden" />
                    
                    <AnimatedWord progress={scrollYProgress} range={[3 * step, 4 * step]}>One</AnimatedWord>
                    <AnimatedWord progress={scrollYProgress} range={[4 * step, 5 * step]}>Vision</AnimatedWord>
                    <AnimatedWord progress={scrollYProgress} range={[5 * step, 6 * step]}>for</AnimatedWord>
                    <AnimatedWord progress={scrollYProgress} range={[6 * step, 7 * step]}>the</AnimatedWord>
                    <AnimatedWord progress={scrollYProgress} range={[7 * step, 8 * step]}>
                        <span className="bg-gradient-to-r from-[#C6A85B] via-[#E5D08A] to-[#C6A85B] bg-clip-text text-transparent italic">
                            Future
                        </span>.&rdquo;
                    </AnimatedWord>
                </h2>
            </div>
        </section>
    );
});
