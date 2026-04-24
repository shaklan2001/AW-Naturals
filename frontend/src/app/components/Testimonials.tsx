import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { motion, useMotionValue, animate } from 'motion/react';
import { ChevronLeft, ChevronRight, Quote, Loader2 } from 'lucide-react';
import { usePublishedTestimonials } from '../hooks/use-storefront-queries';
import { getUserFacingErrorMessage } from '../api/api-error';

const GAP_PX = 32;

type CardT = { id: string; quote: string; name: string; title: string };

export function Testimonials() {
    const { data = [], isPending, isError, error, refetch } = usePublishedTestimonials();

    const baseTestimonials: CardT[] = useMemo(
        () => data.map((t) => ({ id: t.id, quote: t.quote, name: t.name, title: t.title })),
        [data]
    );

    const infiniteTestimonials = useMemo(
        () => (baseTestimonials.length > 0 ? [...baseTestimonials, ...baseTestimonials] : []),
        [baseTestimonials]
    );

    const x = useMotionValue(0);
    const innerRef = useRef<HTMLDivElement>(null);
    const viewportRef = useRef<HTMLDivElement>(null);
    const loopWRef = useRef(0);
    const pausedRef = useRef(false);
    const arrowAnimRef = useRef(false);
    const dragActiveRef = useRef(false);
    const dragStartRef = useRef({ clientX: 0, x: 0 });
    const hoveringViewportRef = useRef(false);
    const [cardStep, setCardStep] = useState(482);

    const wrapInLoop = useCallback((raw: number) => {
        const W = loopWRef.current;
        if (W <= 0) return raw;
        let t = raw;
        while (t > 0) t -= W;
        while (t <= -W) t += W;
        return t;
    }, []);

    useLayoutEffect(() => {
        const el = innerRef.current;
        if (!el) return;
        const update = () => {
            const half = el.scrollWidth / 2;
            loopWRef.current = half;
            const cards = el.querySelectorAll<HTMLElement>('[data-t-card]');
            const first = cards[0];
            const second = cards[1];
            if (first && second) {
                setCardStep(second.offsetLeft - first.offsetLeft);
            } else if (first) {
                setCardStep(first.offsetWidth + GAP_PX);
            }
        };
        update();
        const ro = new ResizeObserver(update);
        ro.observe(el);
        return () => ro.disconnect();
    }, [infiniteTestimonials.length]);

    useEffect(() => {
        let raf = 0;
        let last = performance.now();
        const SPEED_PX_PER_MS = 0.042;

        const tick = (now: number) => {
            const delta = Math.min(now - last, 64);
            last = now;
            const W = loopWRef.current;
            if (!pausedRef.current && !arrowAnimRef.current && !dragActiveRef.current && W > 0) {
                let next = x.get() - delta * SPEED_PX_PER_MS;
                if (next <= -W) next += W;
                x.set(next);
            }
            raf = requestAnimationFrame(tick);
        };
        raf = requestAnimationFrame(tick);
        return () => cancelAnimationFrame(raf);
    }, [x]);

    const normalizeX = useCallback(
        (raw: number) => {
            return wrapInLoop(raw);
        },
        [wrapInLoop]
    );

    const nudge = useCallback(
        (direction: 'prev' | 'next') => {
            const W = loopWRef.current;
            if (W <= 0) return;
            const step = cardStep;
            const delta = direction === 'next' ? -step : step;
            const target = normalizeX(x.get() + delta);
            arrowAnimRef.current = true;
            animate(x, target, { duration: 0.5, ease: 'easeOut' }).then(() => {
                arrowAnimRef.current = false;
            });
        },
        [cardStep, normalizeX, x]
    );

    const onPointerDown = (e: React.PointerEvent) => {
        if (e.button !== 0) return;
        const vp = viewportRef.current;
        if (!vp) return;
        vp.setPointerCapture(e.pointerId);
        dragActiveRef.current = true;
        pausedRef.current = true;
        dragStartRef.current = { clientX: e.clientX, x: x.get() };
    };

    const onPointerMove = (e: React.PointerEvent) => {
        if (!dragActiveRef.current) return;
        const dx = e.clientX - dragStartRef.current.clientX;
        const next = wrapInLoop(dragStartRef.current.x + dx);
        x.set(next);
    };

    const onPointerUp = (e: React.PointerEvent) => {
        if (!dragActiveRef.current) return;
        const vp = viewportRef.current;
        try {
            vp?.releasePointerCapture(e.pointerId);
        } catch {
            /* ignore */
        }
        dragActiveRef.current = false;
        pausedRef.current = hoveringViewportRef.current;
    };

    const arrowBtnClass =
        'flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-white/25 bg-black/35 text-white backdrop-blur-sm transition-colors hover:border-[#D4AF37]/45 hover:text-[#E8D5A3] md:h-12 md:w-12';

    if (!isPending && !isError && baseTestimonials.length === 0) {
        return null;
    }

    if (isPending) {
        return (
            <section className="relative overflow-hidden bg-[#0B0B0B] py-24">
                <div className="relative z-10 mx-auto max-w-[1680px] px-6 pb-16 text-center">
                    <div className="mb-8 inline-flex rounded-full border border-[#C6A85B]/30 bg-[#151515] px-4 py-1.5 backdrop-blur-md">
                        <span className="font-['Inter'] text-[10px] font-medium uppercase tracking-[0.2em] text-[#C6A85B] sm:text-[11px]">
                            Scientific Consensus
                        </span>
                    </div>
                    <h2
                        className="mb-6 font-['Gloock'] text-[48px] leading-none tracking-tight text-[#F5F5DC] md:text-[56px] lg:text-[64px]"
                        style={{ fontWeight: 400 }}
                    >
                        Clinical <span className="italic text-[#C6A85B]">Validation</span>
                    </h2>
                    <div className="mx-auto mt-12 flex max-w-5xl justify-center gap-4 md:mt-16 md:gap-6">
                        {[0, 1, 2].map((i) => (
                            <div
                                key={i}
                                className="h-[240px] w-[min(calc(100vw-2.5rem),320px)] shrink-0 animate-pulse rounded-[22px] bg-[#1a1a1a] md:h-[320px] md:w-[380px] md:rounded-[28px]"
                            />
                        ))}
                    </div>
                    <div className="mt-10 flex items-center justify-center gap-2 text-sm text-white/50">
                        <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
                        Loading testimonials…
                    </div>
                </div>
            </section>
        );
    }

    if (isError) {
        return (
            <section className="relative overflow-hidden bg-[#0B0B0B] py-24">
                <div className="relative z-10 mx-auto max-w-lg px-6 text-center">
                    <p className="font-['Inter'] text-sm text-[#F5F5DC]/70">
                        {getUserFacingErrorMessage(error?.message)}
                    </p>
                    <p className="mt-2 font-['Inter'] text-xs text-[#F5F5DC]/45">
                        Testimonials are temporarily unavailable.
                    </p>
                    <button
                        type="button"
                        onClick={() => void refetch()}
                        className="mt-4 rounded-full border border-white/20 px-6 py-2 text-sm text-[#D4AF37] transition-colors hover:border-[#D4AF37]/50"
                    >
                        Try again
                    </button>
                </div>
            </section>
        );
    }

    return (
        <section className="relative overflow-hidden bg-[#0B0B0B] py-16 md:py-24">
            <style>{`
        @keyframes shine {
          0% { background-position: 200% center; }
          100% { background-position: -200% center; }
        }
        .animate-shine {
          animation: shine 3s linear infinite;
        }
        @media (max-width: 767px) {
          .testimonials-viewport {
            -webkit-mask-image: none;
            mask-image: none;
          }
        }
      `}</style>

            <div className="pointer-events-none absolute right-1/4 top-0 h-[800px] w-[800px] rounded-full bg-[#D4AF37]/5 blur-[150px]" />

            <div className="relative z-10 w-full pb-16">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, ease: 'easeOut' }}
                    className="mb-12 px-4 text-center sm:px-6 md:mb-32 lg:mb-36"
                >
                    <div className="mb-6 inline-flex rounded-full border border-[#C6A85B]/30 bg-[#151515] px-4 py-1.5 backdrop-blur-md">
                        <span className="font-['Inter'] text-[10px] font-medium uppercase tracking-[0.2em] text-[#C6A85B] sm:text-[11px]">
                            Scientific Consensus
                        </span>
                    </div>

                    <h2
                        className="mb-4 font-['Gloock'] text-[36px] leading-none tracking-tight text-[#F5F5DC] sm:text-[48px] md:mb-6 md:text-[56px] lg:text-[64px]"
                        style={{ fontWeight: 400 }}
                    >
                        Clinical{' '}
                        <span className="relative inline-block">
                            <span className="relative bg-gradient-to-r from-[#C6A85B] via-[#E5D08A] to-[#C6A85B] bg-[length:200%_100%] bg-clip-text italic text-transparent animate-shine">
                                Validation
                            </span>
                        </span>
                    </h2>
                    <p className="mx-auto max-w-2xl px-1 font-['Inter'] text-[14px] font-light leading-relaxed text-[#F5F5DC]/60 sm:text-[16px] md:px-0 md:text-[18px]">
                        Trusted deeply by leading health professionals and discerning wellness advocates globally.
                    </p>
                </motion.div>

                <div className="relative mx-auto max-w-[1680px] px-3 pb-14 sm:px-6 md:pb-20">
                    <div
                        ref={viewportRef}
                        role="region"
                        aria-label="Testimonials carousel, drag horizontally or use arrows"
                        className="testimonials-viewport min-w-0 cursor-grab touch-none overflow-hidden select-none active:cursor-grabbing"
                        style={{
                            maskImage:
                                'linear-gradient(to right, transparent, black 8%, black 92%, transparent)',
                        }}
                        onMouseEnter={() => {
                            hoveringViewportRef.current = true;
                            if (!dragActiveRef.current) pausedRef.current = true;
                        }}
                        onMouseLeave={() => {
                            hoveringViewportRef.current = false;
                            if (!dragActiveRef.current) pausedRef.current = false;
                        }}
                        onPointerDown={onPointerDown}
                        onPointerMove={onPointerMove}
                        onPointerUp={onPointerUp}
                        onPointerCancel={onPointerUp}
                    >
                        <motion.div ref={innerRef} style={{ x }} className="flex w-max gap-4 px-1 md:gap-8 md:px-2">
                            {infiniteTestimonials.map((testimonial, index) => (
                                <div
                                    key={`${testimonial.id}-${index}`}
                                    data-t-card
                                    className="w-[min(calc(100vw-2.5rem),320px)] shrink-0 sm:w-[360px] md:w-[450px]"
                                >
                                    <div
                                        className="relative flex h-full min-h-[240px] flex-col overflow-hidden rounded-[22px] p-6 sm:min-h-[280px] sm:rounded-[28px] sm:p-8 md:min-h-[300px] md:p-10"
                                        style={{
                                            background: 'linear-gradient(135deg, #EBE3CE 0%, #DDD0AE 100%)',
                                            borderWidth: '1px',
                                            borderStyle: 'solid',
                                            borderColor: '#E8E1CD',
                                            boxShadow:
                                                '0 20px 40px rgba(0,0,0,0.3), inset 0 2px 5px rgba(255,255,255,0.6)',
                                        }}
                                    >
                                        <div
                                            className="pointer-events-none absolute inset-0 opacity-[0.25] mix-blend-multiply"
                                            style={{
                                                backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.08'/%3E%3C/svg%3E")`,
                                            }}
                                        />

                                        <div className="absolute right-4 top-4 opacity-[0.12] sm:right-6 sm:top-6">
                                            <Quote className="h-12 w-12 text-[#8B6B22] sm:h-16 sm:w-16" fill="currentColor" />
                                        </div>

                                        <div className="relative z-10 flex min-h-0 flex-1 flex-col">
                                            <div className="mb-4 min-h-0 flex-1 sm:mb-6">
                                                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-[#1A1A1A] shadow-xl sm:mb-5 sm:h-12 sm:w-12">
                                                    <Quote className="h-4 w-4 text-[#E4D6B4] sm:h-5 sm:w-5" fill="currentColor" />
                                                </div>
                                                <p className="line-clamp-6 font-['Inter'] text-[15px] font-light italic leading-relaxed tracking-wide text-[#333333] sm:text-lg">
                                                    &ldquo;{testimonial.quote}&rdquo;
                                                </p>
                                            </div>

                                            <div className="mt-auto flex flex-col border-t border-[#0B0B0B]/10 pt-4 sm:pt-5">
                                                <div className="mb-1 truncate font-['Playfair_Display'] text-lg font-bold tracking-tight text-[#1A1A1A] sm:text-xl">
                                                    {testimonial.name}
                                                </div>
                                                <div className="line-clamp-2 font-['Inter'] text-[10px] font-bold uppercase tracking-[0.12em] text-[#8B6B22] sm:text-[11px] sm:tracking-[0.15em]">
                                                    {testimonial.title}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </motion.div>
                    </div>

                    <div
                        className="pointer-events-auto absolute -bottom-1 right-1 z-30 flex flex-row gap-2 sm:right-4 md:bottom-0 md:right-6 md:gap-3"
                        aria-label="Testimonial carousel controls"
                    >
                        <button
                            type="button"
                            onClick={() => nudge('prev')}
                            className={arrowBtnClass}
                            aria-label="Previous testimonial"
                        >
                            <ChevronLeft className="h-5 w-5 md:h-6 md:w-6" strokeWidth={1.75} aria-hidden />
                        </button>
                        <button
                            type="button"
                            onClick={() => nudge('next')}
                            className={arrowBtnClass}
                            aria-label="Next testimonial"
                        >
                            <ChevronRight className="h-5 w-5 md:h-6 md:w-6" strokeWidth={1.75} aria-hidden />
                        </button>
                    </div>
                </div>
            </div>
        </section>
    );
}
