import { AnimatePresence, motion } from 'motion/react';
import { ArrowLeft, ArrowRight, CheckCircle2, Sparkles, Minus, Plus, ShoppingCart, Quote } from 'lucide-react';
import { Link } from 'react-router';
import { useEffect, useMemo, useState } from 'react';
import { useCart } from '../../context/CartContext';
import { useStorefrontProducts } from '../../hooks/use-storefront-queries';
import { toCartProduct } from '../products/components/productListUtils';
import { ImageWithFallback } from '@/shared/components/ImageWithFallback';
import { ProductsAmbientBackground } from '../products/components/ProductsAmbientBackground';
import {
    DOCTOR_CHOICE_LINE,
    QUIZ_HEADLINE,
    QUIZ_OUTCOMES,
    QUIZ_QUESTIONS,
    outcomeFromAnswers,
    type QuizAxis,
    type QuizOutcomeKey,
} from './findYourBlendQuizData';

type Phase = 'intro' | 'quiz' | 'calculating' | 'result';

const labelForAxis = (axis: QuizAxis) =>
    axis === 'A' ? 'A' : axis === 'B' ? 'B' : 'C';

const CALCULATION_STEPS = [
    { label: 'Analyzing your unique wellness profile...', target: 25 },
    { label: 'Consulting Ayurvedic MD & Nutritionist guidelines...', target: 50 },
    { label: 'Evaluating synergistic plant properties...', target: 75 },
    { label: 'Curating your custom daily infusion protocol...', target: 100 },
];

export function FindYourBlendPage() {
    const [phase, setPhase] = useState<Phase>('intro');
    const [stepIndex, setStepIndex] = useState(0);
    const [answers, setAnswers] = useState<Array<QuizAxis | null>>([null, null, null]);
    
    // Calculating Hype Screen State
    const [calculatingProgress, setCalculatingProgress] = useState(0);
    const [completedSteps, setCompletedSteps] = useState<number[]>([]);

    // Cart Context Integration
    const { addToCart, getItemQuantity, updateQuantity } = useCart();
    
    // Fetch Products to render dynamic results with real-time checkout actions
    const { data: products = [] } = useStorefrontProducts('all');

    const currentAnswer = answers[stepIndex];
    const totalSteps = QUIZ_QUESTIONS.length;

    const outcome: QuizOutcomeKey | null = useMemo(() => {
        if (answers.some((a) => a === null)) return null;
        return outcomeFromAnswers(answers as QuizAxis[]);
    }, [answers]);

    // Recommended Storefront Product matching outcome ID
    const recommendedProduct = useMemo(() => {
        if (!outcome || outcome === 'mixed') return null;
        const targetId = outcome === 'energy' ? 'prod_001' : outcome === 'sleep' ? 'prod_002' : 'prod_004';
        return products.find((p) => p.id === targetId) ?? null;
    }, [products, outcome]);

    // All Trio Products for Complete Wellness Bundle (mixed outcome)
    const allBundleProducts = useMemo(() => {
        if (outcome !== 'mixed') return [];
        return products.filter((p) => ['prod_001', 'prod_002', 'prod_004'].includes(p.id));
    }, [products, outcome]);

    // Cart quantities
    const recommendedQty = recommendedProduct ? getItemQuantity(recommendedProduct.id) : 0;

    const resetQuiz = () => {
        setPhase('intro');
        setStepIndex(0);
        setAnswers([null, null, null]);
        setCalculatingProgress(0);
        setCompletedSteps([]);
    };

    const handleSelect = (axis: QuizAxis) => {
        setAnswers((prev) => {
            const next = [...prev];
            next[stepIndex] = axis;
            return next;
        });
    };

    const handleNext = () => {
        if (currentAnswer === null) return;
        if (stepIndex < totalSteps - 1) {
            setStepIndex((s) => s + 1);
            return;
        }
        // Enter stunning curation loading phase instead of directly displaying result
        setPhase('calculating');
    };

    const handleBack = () => {
        if (stepIndex > 0) {
            setStepIndex((s) => s - 1);
        }
    };

    // Calculate sequential steps for the matching process
    useEffect(() => {
        if (phase !== 'calculating') {
            setCalculatingProgress(0);
            setCompletedSteps([]);
            return;
        }

        let progress = 0;
        const interval = setInterval(() => {
            progress += 1;
            setCalculatingProgress(progress);

            if (progress >= 25 && progress < 50) {
                setCompletedSteps((prev) => prev.includes(0) ? prev : [...prev, 0]);
            } else if (progress >= 50 && progress < 75) {
                setCompletedSteps((prev) => prev.includes(1) ? prev : [...prev, 0, 1]);
            } else if (progress >= 75 && progress < 95) {
                setCompletedSteps((prev) => prev.includes(2) ? prev : [...prev, 0, 1, 2]);
            } else if (progress >= 100) {
                setCompletedSteps([0, 1, 2, 3]);
                clearInterval(interval);
                setTimeout(() => {
                    setPhase('result');
                }, 600);
            }
        }, 40); // Total around ~4 seconds of high-fidelity calculation sequence

        return () => clearInterval(interval);
    }, [phase]);

    const resultDetail = outcome ? QUIZ_OUTCOMES[outcome] : null;

    /** Clears fixed navbar (44px bar + logo row + padding ≈ 118–124px). */
    const navClearanceClass =
        'pt-[clamp(7rem,14vw,8.25rem)] pb-16 md:pb-24 lg:pb-28';

    const isIntro = phase === 'intro';

    return (
        <div
            className={`relative flex min-h-svh flex-col overflow-x-clip text-[#F5F5DC] ${navClearanceClass} bg-[#0B0B0B]`}
        >
            <div className="pointer-events-none absolute inset-0 z-0">
                {isIntro ? (
                    <div 
                        className="absolute inset-0"
                        style={{
                            background: 'radial-gradient(ellipse at top, rgba(15,61,46,0.65) 0%, #0B0B0B 75%)',
                        }}
                    />
                ) : (
                    <>
                        <div className="absolute inset-0 bg-[#0B0B0B]" />
                        
                        {/* Harmonic Golden Ambient Glows for assessment phases */}
                        <div
                            className="absolute left-1/2 top-[35%] h-[min(65vh,580px)] w-[min(95vw,850px)] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-[0.22] blur-[90px] md:opacity-[0.28]"
                            style={{
                                background:
                                    'radial-gradient(ellipse at center, rgba(212,175,55,0.28) 0%, rgba(15,61,46,0.18) 45%, transparent 70%)',
                            }}
                        />
                        
                        {/* Secondary Bottom Left Glow */}
                        <div 
                            className="absolute bottom-[-10%] left-[-10%] h-[min(50vh,400px)] w-[min(50vw,400px)] rounded-full opacity-[0.1] blur-[80px] pointer-events-none"
                            style={{
                                background: 'radial-gradient(circle, rgba(15,61,46,0.8) 0%, transparent 80%)',
                            }}
                        />
                    </>
                )}

                {/* Micro-dot Luxury Grid Texture */}
                <div
                    className="absolute inset-0 opacity-[0.03]"
                    style={{
                        backgroundImage:
                            'radial-gradient(circle, rgba(255,255,255,0.55) 1px, transparent 1px)',
                        backgroundSize: '36px 36px',
                    }}
                />
            </div>

            {/* Render pixel sparkles on top of the black & green gradient base overlay */}
            {isIntro && <ProductsAmbientBackground />}

            {/* Assessment Consultation Workspace */}
            <div className="relative z-10 flex flex-col justify-center flex-grow">
                <div className="mx-auto w-full max-w-2xl px-4 md:max-w-3xl md:px-6">
                
                {/* Glowing Brand Eyebrow */}
                <div className="mb-4 flex items-center justify-center gap-2">
                    <span className="h-[1px] w-6 bg-[#D4AF37]/30" />
                    <p className="font-['Inter'] text-[10px] font-bold uppercase tracking-[0.3em] text-[#C6A85B] md:text-[11px]">
                        AW Naturals Wellness Assessment
                    </p>
                    <span className="h-[1px] w-6 bg-[#D4AF37]/30" />
                </div>

                <AnimatePresence mode="wait">
                    {/* Phase 1: Interactive Intro / Launchpad */}
                    {phase === 'intro' && (
                        <motion.div
                            key="intro"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -15 }}
                            transition={{ duration: 0.4, ease: 'easeOut' }}
                            className="text-center"
                        >
                            <h1 className="font-['Gloock'] text-[clamp(2.15rem,5.5vw,3.25rem)] leading-[1.1] tracking-tight text-[#F5F5DC] mb-6">
                                Find your{' '}
                                <span className="bg-gradient-to-r from-[#D4AF37] via-[#F5F5DC] to-[#D4AF37] bg-clip-text text-transparent">
                                    blend
                                </span>
                            </h1>
                            
                            {/* Glassmorphic Description Card */}
                            <div className="mx-auto max-w-xl rounded-3xl border border-white/[0.08] bg-white/[0.03] p-6 md:p-8 backdrop-blur-xl shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
                                <p className="font-['Inter'] text-[16px] font-medium leading-relaxed text-[#F5F5DC] mb-4">
                                    {QUIZ_HEADLINE}
                                </p>
                                <p className="font-['Inter'] text-[14px] font-light leading-relaxed text-white/60">
                                    Take our short diagnostic to discover your unique wellness profile. Guided by clinical Ayurvedic science, we will formulate the precise natural botanicals recommended for your vitality, sleep, or metabolism.
                                </p>
                            </div>

                            {/* Luxury Call-To-Action Button */}
                            <div className="mt-10">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setPhase('quiz');
                                        setStepIndex(0);
                                    }}
                                    className="group relative inline-flex items-center justify-center gap-3 overflow-hidden rounded-full px-12 py-4.5 font-['Inter'] text-[12px] font-bold uppercase tracking-[0.2em] text-[#0B0B0B] transition-all hover:scale-[1.03] active:scale-95 shadow-[0_12px_40px_rgba(212,175,55,0.22)]"
                                    style={{
                                        background: 'linear-gradient(135deg, #D4AF37 0%, #f0d060 55%, #c8a84b 100%)',
                                    }}
                                >
                                    {/* Pulse effect */}
                                    <span className="absolute inset-0 w-full h-full bg-white/20 transform translate-y-full transition-transform duration-300 group-hover:translate-y-0" />
                                    
                                    <span className="relative z-10 flex items-center gap-2">
                                        Start Consultation
                                        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden />
                                    </span>
                                </button>
                            </div>

                            <p className="mt-8 font-['Inter'] text-[12px] text-white/35">
                                Prefer to browse our clinic shelves directly?{' '}
                                <Link
                                    to="/products"
                                    className="text-[#D4AF37] font-semibold underline-offset-4 hover:text-[#E5D08A] hover:underline transition-colors"
                                >
                                    Shop all products
                                </Link>
                            </p>
                        </motion.div>
                    )}

                    {/* Phase 2: High-Class Assessment Quiz Cards */}
                    {phase === 'quiz' && (
                        <motion.div
                            key={`quiz-${stepIndex}`}
                            initial={{ opacity: 0, x: 30 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            transition={{ duration: 0.35, ease: 'easeInOut' }}
                            className="rounded-[2.25rem] border border-white/[0.08] bg-[#0c100e]/85 p-6 shadow-[0_32px_100px_rgba(0,0,0,0.7)] backdrop-blur-2xl md:p-10 relative overflow-hidden"
                            style={{
                                boxShadow: 'inset 0 1px 1px rgba(255,255,255,0.05), 0 32px 100px rgba(0,0,0,0.7)',
                            }}
                        >
                            {/* Inner Subtle Glow */}
                            <div className="absolute -top-24 -right-24 h-48 w-48 rounded-full bg-[#D4AF37]/5 blur-3xl pointer-events-none" />

                            {/* Header progress line */}
                            <div className="mb-8 flex items-center justify-between gap-4">
                                <span className="flex items-center font-['Inter'] text-[11px] font-bold uppercase tracking-[0.25em] text-[#C6A85B]">
                                    Consultation Step {stepIndex + 1} of {totalSteps}
                                </span>
                                
                                {/* Gorgeous Pill-styled Tracker dots */}
                                <div className="flex h-6 items-center gap-2" aria-hidden>
                                    {QUIZ_QUESTIONS.map((q, i) => (
                                        <div
                                            key={q.id}
                                            className={`rounded-full transition-all duration-500 ${
                                                i === stepIndex
                                                    ? 'h-2 w-10 bg-[#D4AF37] shadow-[0_0_10px_rgba(212,175,55,0.5)]'
                                                    : i < stepIndex
                                                      ? 'h-2 w-2.5 bg-[#D4AF37]/50'
                                                      : 'h-2 w-2 bg-white/10'
                                            }`}
                                        />
                                    ))}
                                </div>
                            </div>

                            <h2 className="font-['Gloock'] text-[clamp(1.5rem,4.2vw,2.15rem)] leading-snug text-[#F5F5DC] mb-3">
                                {QUIZ_QUESTIONS[stepIndex].title}
                            </h2>
                            <p className="font-['Inter'] text-[13px] text-white/40 mb-8">
                                Please select the option that aligns closest with your wellness goals:
                            </p>

                            {/* Quiz Option buttons */}
                            <div
                                className="space-y-4"
                                role="radiogroup"
                                aria-labelledby={`quiz-q-${QUIZ_QUESTIONS[stepIndex].id}`}
                            >
                                <span id={`quiz-q-${QUIZ_QUESTIONS[stepIndex].id}`} className="sr-only">
                                    {QUIZ_QUESTIONS[stepIndex].title}
                                </span>
                                {QUIZ_QUESTIONS[stepIndex].options.map((opt) => {
                                    const selected = currentAnswer === opt.axis;
                                    return (
                                        <button
                                            key={opt.axis}
                                            type="button"
                                            role="radio"
                                            aria-checked={selected}
                                            onClick={() => handleSelect(opt.axis)}
                                            className={`flex w-full items-center gap-4 rounded-2xl border px-4 py-4 text-left transition-all duration-300 md:px-6 md:py-5 ${
                                                selected
                                                    ? 'border-[#D4AF37]/60 bg-[#D4AF37]/[0.08] shadow-[0_4px_30px_rgba(212,175,55,0.06)]'
                                                    : 'border-white/[0.06] bg-white/[0.02] hover:border-white/[0.15] hover:bg-white/[0.04]'
                                            }`}
                                        >
                                            {/* Circular Indicator enclosing Label letter */}
                                            <span
                                                className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border font-['Inter'] text-[14px] font-bold transition-all duration-300 ${
                                                    selected
                                                        ? 'border-[#D4AF37]/60 bg-[#D4AF37]/25 text-[#F5F5DC] shadow-[0_0_12px_rgba(212,175,55,0.35)]'
                                                        : 'border-white/10 bg-black/25 text-white/40'
                                                }`}
                                            >
                                                {labelForAxis(opt.axis)}
                                            </span>
                                            
                                            <span className="min-w-0 flex-1 font-['Inter'] text-[14px] leading-relaxed text-white/80 md:text-[15px] font-normal">
                                                {opt.label}
                                            </span>
                                            
                                            {/* Visual Checkmark with elegant pop transition */}
                                            <div className="ml-auto flex items-center justify-center w-5 h-5 shrink-0">
                                                {selected ? (
                                                    <motion.div
                                                        initial={{ scale: 0 }}
                                                        animate={{ scale: 1 }}
                                                        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                                                    >
                                                        <CheckCircle2 className="h-5 w-5 text-[#D4AF37]" aria-hidden />
                                                    </motion.div>
                                                ) : (
                                                    <div className="h-4 w-4 rounded-full border border-white/20 transition-colors group-hover:border-white/40" />
                                                )}
                                            </div>
                                        </button>
                                    );
                                })}
                            </div>

                            {/* Stepper Navigation Panel */}
                            <div className="mt-10 flex flex-col-reverse gap-4 sm:flex-row sm:items-center sm:justify-between border-t border-white/[0.06] pt-8">
                                <button
                                    type="button"
                                    onClick={() => (stepIndex === 0 ? resetQuiz() : handleBack())}
                                    className="inline-flex h-12 items-center justify-center gap-2 rounded-full border border-white/12 px-6 py-3 font-['Inter'] text-[12px] font-bold uppercase tracking-[0.15em] text-white/50 transition-all hover:border-white/25 hover:text-white/80 active:scale-95"
                                >
                                    <ArrowLeft className="h-4 w-4" aria-hidden />
                                    {stepIndex === 0 ? 'Exit Quiz' : 'Previous Step'}
                                </button>
                                <button
                                    type="button"
                                    disabled={currentAnswer === null}
                                    onClick={handleNext}
                                    className="inline-flex h-12 items-center justify-center gap-2 rounded-full px-10 py-3.5 font-['Inter'] text-[12px] font-bold uppercase tracking-[0.18em] text-[#0B0B0B] transition-all disabled:cursor-not-allowed disabled:opacity-30 enabled:hover:brightness-105 active:scale-97 shadow-[0_8px_30px_rgba(212,175,55,0.15)]"
                                    style={{
                                        background:
                                            'linear-gradient(135deg, #D4AF37 0%, #f0d060 50%, #c8a84b 100%)',
                                    }}
                                >
                                    {stepIndex === totalSteps - 1 ? 'Analyze Responses' : 'Continue'}
                                    <ArrowRight className="h-4 w-4" aria-hidden />
                                </button>
                            </div>
                        </motion.div>
                    )}

                    {/* Phase 3: Stunning Sequential "Clinical Curation" Curation Screen */}
                    {phase === 'calculating' && (
                        <motion.div
                            key="calculating"
                            initial={{ opacity: 0, scale: 0.96 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 1.02 }}
                            transition={{ duration: 0.4 }}
                            className="rounded-[2.25rem] border border-white/[0.08] bg-[#0c100e]/85 p-8 shadow-[0_32px_100px_rgba(0,0,0,0.7)] backdrop-blur-2xl text-center max-w-xl mx-auto py-12"
                        >
                            {/* Circular Golden Loading Aura */}
                            <div className="relative flex items-center justify-center w-28 h-28 mx-auto mb-8">
                                {/* Ambient pulsing glow */}
                                <div className="absolute inset-0 rounded-full bg-[#D4AF37]/10 blur-xl animate-pulse" />
                                
                                {/* SVG Ring */}
                                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                                    <circle 
                                        cx="50" 
                                        cy="50" 
                                        r="44" 
                                        stroke="rgba(212,175,55,0.08)" 
                                        strokeWidth="3" 
                                        fill="transparent" 
                                    />
                                    <motion.circle 
                                        cx="50" 
                                        cy="50" 
                                        r="44" 
                                        stroke="url(#goldLoaderGradient)" 
                                        strokeWidth="4" 
                                        fill="transparent"
                                        strokeDasharray={276.4} // 2 * Math.PI * 44 = 276.4
                                        animate={{ strokeDashoffset: 276.4 - (276.4 * calculatingProgress) / 100 }}
                                        transition={{ ease: "easeOut", duration: 0.1 }}
                                        strokeLinecap="round"
                                    />
                                    <defs>
                                        <linearGradient id="goldLoaderGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                                            <stop offset="0%" stopColor="#D4AF37" />
                                            <stop offset="50%" stopColor="#E5D08A" />
                                            <stop offset="100%" stopColor="#C6A85B" />
                                        </linearGradient>
                                    </defs>
                                </svg>
                                
                                {/* Inner percentage readout */}
                                <div className="absolute flex flex-col items-center justify-center text-center">
                                    <span className="font-['Gloock'] text-[30px] font-bold text-[#F5F5DC] leading-none">
                                        {calculatingProgress}%
                                    </span>
                                    <span className="font-['Inter'] text-[8px] uppercase tracking-[0.2em] text-[#C6A85B] mt-1 font-bold">
                                        Analysing
                                    </span>
                                </div>
                            </div>

                            <h2 className="font-['Gloock'] text-[24px] text-white mb-2">
                                Clinical Synthesis
                            </h2>
                            <p className="font-['Inter'] text-[13px] text-white/50 max-w-sm mx-auto mb-8">
                                Please wait while we synthesize your custom botanical formula...
                            </p>

                            {/* Sequential Status Checks */}
                            <div className="mt-8 space-y-3.5 max-w-sm mx-auto text-left">
                                {CALCULATION_STEPS.map((step, idx) => {
                                    const isCompleted = completedSteps.includes(idx);
                                    const isActive = !isCompleted && (
                                        idx === 0 ? calculatingProgress < 25 :
                                        idx === 1 ? calculatingProgress >= 25 && calculatingProgress < 50 :
                                        idx === 2 ? calculatingProgress >= 50 && calculatingProgress < 75 :
                                        calculatingProgress >= 75
                                    );
                                    
                                    return (
                                        <motion.div 
                                            key={idx}
                                            initial={{ opacity: 0, x: -10 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: idx * 0.08 }}
                                            className={`flex items-center gap-4 p-3.5 rounded-xl border transition-all duration-300 ${
                                                isActive 
                                                    ? 'bg-[#D4AF37]/5 border-[#D4AF37]/20 shadow-[0_4px_20px_rgba(212,175,55,0.05)]' 
                                                    : isCompleted
                                                      ? 'bg-transparent border-white/[0.02]'
                                                      : 'opacity-30 bg-transparent border-transparent'
                                            }`}
                                        >
                                            <div className="flex shrink-0 items-center justify-center w-5 h-5">
                                                {isCompleted ? (
                                                    <motion.div
                                                        initial={{ scale: 0 }}
                                                        animate={{ scale: 1 }}
                                                        transition={{ type: 'spring', stiffness: 250 }}
                                                    >
                                                        <CheckCircle2 className="h-5 w-5 text-[#D4AF37]" />
                                                    </motion.div>
                                                ) : isActive ? (
                                                    <div className="relative h-5 w-5 flex items-center justify-center">
                                                        <span className="animate-ping absolute inline-flex h-2 w-2 rounded-full bg-[#D4AF37] opacity-75"></span>
                                                        <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-[#D4AF37]"></span>
                                                    </div>
                                                ) : (
                                                    <div className="h-1.5 w-1.5 rounded-full bg-white/20" />
                                                )}
                                            </div>
                                            
                                            <span className={`font-['Inter'] text-[13px] leading-snug transition-colors duration-300 ${
                                                isActive 
                                                    ? 'text-[#F5F5DC] font-semibold' 
                                                    : isCompleted
                                                      ? 'text-white/60 font-medium'
                                                      : 'text-white/30'
                                            }`}>
                                                {step.label}
                                            </span>
                                        </motion.div>
                                    );
                                })}
                            </div>
                        </motion.div>
                    )}

                    {/* Phase 4: Luxury Result Board with Checkout widget */}
                    {phase === 'result' && resultDetail && (
                        <motion.div
                            key="result"
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.45, ease: 'easeOut' }}
                            className="rounded-[2.5rem] border border-white/[0.08] bg-[#0c100e]/85 p-6 shadow-[0_32px_100px_rgba(0,0,0,0.75)] backdrop-blur-2xl md:p-10 relative overflow-hidden"
                        >
                            {/* Accent gold corner flare */}
                            <div className="absolute top-0 right-0 w-48 h-48 bg-[#D4AF37]/5 rounded-full blur-3xl pointer-events-none" />

                            <div className="flex flex-col items-center text-center mb-8">
                                <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#D4AF37]/25 bg-[#D4AF37]/10 px-4 py-2">
                                    <Sparkles className="h-3.5 w-3.5 text-[#D4AF37]" aria-hidden />
                                    <span className="font-['Inter'] text-[10px] font-bold uppercase tracking-[0.25em] text-[#D4AF37]/90">
                                        Your Customized Prescribed Ritual
                                    </span>
                                </div>
                                <p className="font-['Inter'] text-[11px] font-bold uppercase tracking-[0.3em] text-white/40">
                                    {resultDetail.subtitle}
                                </p>
                                <h2 className="mt-2 font-['Gloock'] text-[clamp(1.75rem,4.5vw,2.5rem)] leading-tight text-[#F5F5DC] max-w-xl">
                                    {resultDetail.title}
                                </h2>
                            </div>

                            {/* Core Recommended Product Checkout Widget */}
                            {outcome !== 'mixed' && (
                                <div className="mb-10">
                                    {recommendedProduct ? (
                                        <div 
                                            className="relative overflow-hidden rounded-3xl border border-[#D4AF37]/35 shadow-[0_15px_40px_rgba(0,0,0,0.5)] transition-all duration-500 hover:border-[#D4AF37]/60"
                                            style={{
                                                background: 'linear-gradient(135deg, rgba(17,24,20,0.95) 0%, rgba(8,11,9,0.98) 100%)',
                                            }}
                                        >
                                            {/* Glow */}
                                            <div className="absolute top-0 right-0 w-32 h-32 bg-[#D4AF37]/5 rounded-full blur-2xl pointer-events-none" />

                                            <div className="flex flex-col md:flex-row">
                                                {/* Left Panel: Image fallback */}
                                                <div className="w-full md:w-[38%] p-5 md:p-6 shrink-0 flex items-center justify-center">
                                                    <Link 
                                                        to={`/products/${recommendedProduct.id}`}
                                                        className="relative w-full aspect-square rounded-2xl overflow-hidden bg-[#070908] border border-white/[0.06] flex items-center justify-center shadow-inner group"
                                                    >
                                                        <ImageWithFallback
                                                            src={recommendedProduct.image}
                                                            alt={recommendedProduct.name}
                                                            className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                                        />
                                                    </Link>
                                                </div>

                                                {/* Right Panel: Content / Price / Cart stepper */}
                                                <div className="w-full md:w-[62%] p-6 md:p-8 flex flex-col justify-between text-[#F5F5DC]">
                                                    <div>
                                                        <span className="inline-block text-[9px] font-['Inter'] text-[#D4AF37] uppercase tracking-[0.2em] font-bold px-2 py-0.5 rounded bg-[#D4AF37]/15 border border-[#D4AF37]/20 mb-3">
                                                            {recommendedProduct.benefit || 'Clinical Choice'}
                                                        </span>

                                                        <Link to={`/products/${recommendedProduct.id}`}>
                                                            <h3 className="font-['Gloock'] text-[22px] md:text-[25px] leading-tight text-white hover:text-[#E5D08A] transition-colors duration-300 mb-2">
                                                                {recommendedProduct.name}
                                                            </h3>
                                                        </Link>

                                                        <p className="font-['Inter'] text-[13px] text-white/60 leading-relaxed font-light mb-6">
                                                            {recommendedProduct.shortDescription ?? recommendedProduct.description}
                                                        </p>
                                                    </div>

                                                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pt-5 border-t border-white/[0.08]">
                                                        {/* Price Tag */}
                                                        <div>
                                                            <span className="block font-['Inter'] text-[9px] font-bold text-white/40 tracking-[0.18em] uppercase">
                                                                Clinically Formulated
                                                            </span>
                                                            <div className="font-['Playfair_Display'] text-[32px] font-bold tracking-tight text-[#D4AF37] leading-none mt-1">
                                                                ₹{recommendedProduct.price}
                                                            </div>
                                                        </div>

                                                        {/* Interactive Add/Stepper */}
                                                        <div className="sm:w-1/2 min-w-[155px]">
                                                            {recommendedQty === 0 ? (
                                                                <button
                                                                    type="button"
                                                                    onClick={() => addToCart(toCartProduct(recommendedProduct))}
                                                                    className="group w-full h-12 inline-flex items-center justify-center gap-2 rounded-full font-['Inter'] text-[11px] font-bold uppercase tracking-[0.15em] text-[#0B0B0B] transition-all hover:scale-[1.02] shadow-[0_6px_20px_rgba(212,175,55,0.22)] active:scale-95"
                                                                    style={{
                                                                        background: 'linear-gradient(135deg, #D4AF37 0%, #f0d060 50%, #c8a84b 100%)',
                                                                    }}
                                                                >
                                                                    <ShoppingCart className="w-3.5 h-3.5" />
                                                                    Add to Cart
                                                                </button>
                                                            ) : (
                                                                <div className="flex items-center h-12 rounded-full bg-[#121614] border border-white/10 overflow-hidden shadow-inner">
                                                                    <button
                                                                        type="button"
                                                                        onClick={() => updateQuantity(recommendedProduct.id, recommendedQty - 1)}
                                                                        className="flex items-center justify-center w-12 h-full text-white/50 hover:text-white hover:bg-white/5 transition-colors"
                                                                    >
                                                                        <Minus className="w-3.5 h-3.5" />
                                                                    </button>
                                                                    <span className="flex-1 text-center font-['Gloock'] text-[17px] text-white leading-none">
                                                                        {recommendedQty}
                                                                    </span>
                                                                    <button
                                                                        type="button"
                                                                        onClick={() => addToCart(toCartProduct(recommendedProduct))}
                                                                        className="flex items-center justify-center w-12 h-full text-white/50 hover:text-white hover:bg-white/5 transition-colors"
                                                                    >
                                                                        <Plus className="w-3.5 h-3.5" />
                                                                    </button>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ) : (
                                        /* Static Elegant Fallback Product Card */
                                        <div 
                                            className="relative overflow-hidden rounded-3xl border border-[#D4AF37]/30 p-6 md:p-8"
                                            style={{
                                                background: 'linear-gradient(135deg, rgba(17,24,20,0.9) 0%, rgba(8,11,9,0.95) 100%)',
                                            }}
                                        >
                                            <h3 className="font-['Gloock'] text-[21px] text-white mb-2">{resultDetail.title}</h3>
                                            <p className="font-['Inter'] text-[13.5px] text-white/60 mb-6 font-light leading-relaxed">
                                                Our premium Ayurvedic botanical infusion curated explicitly for your clinical wellness profile.
                                            </p>
                                            <Link
                                                to={resultDetail.primaryCta.to}
                                                className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl font-['Inter'] text-[12px] font-bold uppercase tracking-[0.15em] text-[#0B0B0B] transition-all hover:brightness-105"
                                                style={{
                                                    background: 'linear-gradient(135deg, #D4AF37 0%, #f0d060 50%, #c8a84b 100%)',
                                                }}
                                            >
                                                {resultDetail.primaryCta.label}
                                                <ArrowRight className="h-4 w-4" />
                                            </Link>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Triple Grid Protocol Widget for Mixed/Bundle Outcome */}
                            {outcome === 'mixed' && (
                                <div className="mb-10">
                                    {allBundleProducts.length > 0 ? (
                                        <div className="space-y-6">
                                            <div className="flex items-center justify-center gap-2 mb-2">
                                                <span className="h-[1px] w-4 bg-[#C6A85B]/35" />
                                                <h3 className="font-['Gloock'] text-[18px] text-[#C6A85B] uppercase tracking-[0.15em] text-center">
                                                    Your Complete Trio Protocol
                                                </h3>
                                                <span className="h-[1px] w-4 bg-[#C6A85B]/35" />
                                            </div>
                                            
                                            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                                                {allBundleProducts.map((p) => {
                                                    const qty = getItemQuantity(p.id);
                                                    return (
                                                        <div 
                                                            key={p.id}
                                                            className="rounded-2xl border border-white/[0.06] bg-[#0c100e]/70 p-4 flex flex-col justify-between shadow-md transition-all duration-300 hover:border-[#D4AF37]/35"
                                                        >
                                                            <div>
                                                                {/* Aspect square with Image fallback */}
                                                                <div className="aspect-square w-full rounded-xl overflow-hidden bg-[#070908] border border-white/[0.04] mb-3.5 relative flex items-center justify-center shadow-inner">
                                                                    <ImageWithFallback
                                                                        src={p.image}
                                                                        alt={p.name}
                                                                        className="absolute inset-0 w-full h-full object-cover"
                                                                    />
                                                                </div>
                                                                <span className="text-[8px] font-['Inter'] text-[#D4AF37] uppercase tracking-[0.18em] font-bold block mb-1.5">
                                                                    {p.benefit}
                                                                </span>
                                                                <Link to={`/products/${p.id}`}>
                                                                    <h4 className="font-['Gloock'] text-[16px] leading-snug text-white hover:text-[#E5D08A] transition-colors mb-2">
                                                                        {p.name}
                                                                    </h4>
                                                                </Link>
                                                            </div>

                                                            <div className="mt-4 pt-3.5 border-t border-white/[0.06] flex items-center justify-between gap-2">
                                                                <span className="font-['Playfair_Display'] text-[17px] font-bold text-[#D4AF37]">
                                                                    ₹{p.price}
                                                                </span>
                                                                
                                                                <div className="w-[100px] shrink-0">
                                                                    {qty === 0 ? (
                                                                        <button
                                                                            type="button"
                                                                            onClick={() => addToCart(toCartProduct(p))}
                                                                            className="w-full h-8 inline-flex items-center justify-center rounded-full font-['Inter'] text-[9px] font-bold uppercase tracking-wider text-[#0B0B0B] transition-all hover:scale-[1.03]"
                                                                            style={{
                                                                                background: 'linear-gradient(135deg, #D4AF37 0%, #f0d060 50%, #c8a84b 100%)',
                                                                            }}
                                                                        >
                                                                            Add to Cart
                                                                        </button>
                                                                    ) : (
                                                                        <div className="flex items-center h-8 rounded-full bg-[#121614] border border-white/10 overflow-hidden shadow-inner">
                                                                            <button
                                                                                type="button"
                                                                                onClick={() => updateQuantity(p.id, qty - 1)}
                                                                                className="flex items-center justify-center w-8 h-full text-white/50 hover:text-white hover:bg-white/5 transition-colors"
                                                                            >
                                                                                <Minus className="w-2.5 h-2.5" />
                                                                            </button>
                                                                            <span className="flex-1 text-center font-['Gloock'] text-[12px] text-white leading-none">
                                                                                {qty}
                                                                            </span>
                                                                            <button
                                                                                type="button"
                                                                                onClick={() => addToCart(toCartProduct(p))}
                                                                                className="flex items-center justify-center w-8 h-full text-white/50 hover:text-white hover:bg-white/5 transition-colors"
                                                                            >
                                                                                <Plus className="w-2.5 h-2.5" />
                                                                            </button>
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    ) : (
                                        /* Static Fallback list for Complete Trio */
                                        <div className="space-y-3.5">
                                            {resultDetail.secondaryLinks?.map((link) => (
                                                <Link
                                                    key={link.to}
                                                    to={link.to}
                                                    className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/[0.02] p-4 text-[#F5F5DC] hover:border-[#D4AF37]/35 hover:bg-[#D4AF37]/5 transition-all"
                                                >
                                                    <span className="font-['Inter'] text-[13px] font-bold uppercase tracking-wider">
                                                        {link.label}
                                                    </span>
                                                    <ArrowRight className="h-4 w-4 text-[#D4AF37]" />
                                                </Link>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Gorgeous MD ayurveda quote block */}
                            <div className="relative border-l-2 border-[#D4AF37]/40 bg-[#0f3d2e]/10 p-6 md:p-8 rounded-r-3xl rounded-bl-3xl border border-white/[0.04] mb-8">
                                <div className="absolute top-4 right-5 opacity-[0.08]">
                                    <Quote className="h-10 w-10 text-[#D4AF37] fill-[#D4AF37]" />
                                </div>
                                <h4 className="font-['Inter'] text-[9px] font-bold uppercase tracking-[0.25em] text-[#C6A85B] mb-2.5">
                                    Clinical Practitioner&apos;s Guideline
                                </h4>
                                <blockquote className="font-['Inter'] text-[14px] md:text-[15px] font-light leading-relaxed text-[#F5F5DC]/80 italic">
                                    &ldquo;{resultDetail.doctorsNote}&rdquo;
                                </blockquote>
                                <div className="mt-4 flex items-center gap-2">
                                    <span className="h-1.5 w-1.5 rounded-full bg-[#D4AF37]" />
                                    <span className="font-['Inter'] text-[10px] font-bold text-white/50 tracking-wider uppercase">
                                        MD (Ayurveda) & Clinical Nutritionist Panel
                                    </span>
                                </div>
                            </div>

                            <p className="text-center font-['Inter'] text-[11px] leading-relaxed text-white/40 mb-8">
                                {DOCTOR_CHOICE_LINE}
                            </p>

                            <button
                                type="button"
                                onClick={resetQuiz}
                                className="w-full rounded-full border border-white/12 py-3.5 font-['Inter'] text-[12px] font-bold uppercase tracking-[0.18em] text-white/40 transition-all hover:border-white/25 hover:text-white/85 hover:bg-white/[0.02] active:scale-97"
                            >
                                Retake Diagnostic Assessment
                            </button>
                        </motion.div>
                    )}
                </AnimatePresence>
                </div>
            </div>
        </div>
    );
}
