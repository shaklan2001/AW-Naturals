import { motion, AnimatePresence } from 'motion/react';
import { Link } from 'react-router';
import { FormEvent, useState } from 'react';
import { Mail, Phone, MapPin, Send, ArrowRight, Leaf, Star } from 'lucide-react';
import Lottie from 'lottie-react';
import { SectionWrapper } from '../components/SectionWrapper';
import { PremiumSectionChip } from '../components/PremiumSectionChip';
import { useCreateContactInquiry } from '../hooks/use-storefront-queries';
import successAnimation from '@/assets/lottie-success.json';

const EMAIL = 'care@awnaturals.in';
const PHONE_DISPLAY = '+91 98765 43210';
const PHONE_TEL = '+919876543210';

const inputClass =
    "h-12 w-full rounded-2xl border border-white/10 bg-white/[0.04] px-5 font-['Inter'] text-sm text-white placeholder:text-white/30 focus:border-[#c8a84b]/60 focus:bg-white/[0.07] focus:outline-none transition-all duration-300";

const labelClass = "font-['Inter'] text-[10px] font-semibold uppercase tracking-[0.18em] text-[#c8a84b]/70";

export function ContactPage() {
    const createContactInquiry = useCreateContactInquiry();
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [email, setEmail] = useState('');
    const [issue, setIssue] = useState('');
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        try {
            await createContactInquiry.mutateAsync({ name, phone, email, issue });
            setName('');
            setPhone('');
            setEmail('');
            setIssue('');
            setSubmitted(true);
        } catch (_error) {
            // error handled below
        }
    };

    return (
        <div className="relative min-h-screen overflow-hidden bg-[#080C08] text-[#F5F5DC]">
            {/* ── Ambient background (flat — no corner vignette) ── */}
            <div className="pointer-events-none absolute inset-0 z-0">
                <div className="absolute inset-0 bg-[#080C08]" />
                {/* Soft top wash only */}
                <div
                    className="absolute inset-x-0 top-0 h-[45vh] max-h-[520px]"
                    style={{
                        background:
                            'linear-gradient(180deg, rgba(14,54,36,0.35) 0%, rgba(8,12,8,0) 100%)',
                    }}
                />
                {/* Gold hairline */}
                <div
                    className="absolute left-1/2 top-0 h-px w-3/4 -translate-x-1/2"
                    style={{
                        background:
                            'linear-gradient(90deg, transparent, rgba(212,175,55,0.35), transparent)',
                        boxShadow: '0 0 80px 8px rgba(212,175,55,0.12)',
                    }}
                />
                {/* Light dot grid — very subtle */}
                <div
                    className="absolute inset-0 opacity-[0.035]"
                    style={{
                        backgroundImage:
                            'radial-gradient(circle, rgba(255,255,255,0.6) 1px, transparent 1px)',
                        backgroundSize: '36px 36px',
                    }}
                />
            </div>

            {/* ── Hero Section ── */}
            <SectionWrapper className="relative z-10 pb-0 pt-36 md:pt-44">
                <div className="mx-auto max-w-3xl text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 32 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.85, ease: 'easeOut' }}
                    >
                        {/* Badge */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.6, delay: 0.1 }}
                            className="mb-6"
                        >
                            <PremiumSectionChip>Clinical Archive</PremiumSectionChip>
                        </motion.div>

                        <h1 className="font-['Cormorant_Garamond',serif] font-semibold text-[48px] md:text-[72px] mb-6 text-[#F5F5DC] tracking-tight leading-tight">
                            We're Here{' '}
                            <span className="italic text-transparent bg-clip-text bg-gradient-to-r from-[#C6A85B] via-[#E5D08A] to-[#C6A85B] animate-shine">
                                For You
                            </span>
                        </h1>
                        <p className="mx-auto mt-6 max-w-2xl font-['Inter'] text-lg font-light leading-relaxed text-white/55 md:text-xl">
                            Have a question about our wellness products, want to book a consultation, or simply
                            say hello? Our expert team responds within 24 hours.
                        </p>
                    </motion.div>
                </div>

                {/* ── Info cards ── */}
                <motion.div
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, delay: 0.25, ease: 'easeOut' }}
                    className="mx-auto mt-14 grid max-w-3xl gap-4 md:grid-cols-3"
                >
                    {[
                        {
                            icon: <Mail className="h-6 w-6" />,
                            label: 'Email Us',
                            value: EMAIL,
                            href: `mailto:${EMAIL}`,
                        },
                        {
                            icon: <Phone className="h-6 w-6" />,
                            label: 'Call Us',
                            value: PHONE_DISPLAY,
                            href: `tel:${PHONE_TEL}`,
                        },
                        {
                            icon: <MapPin className="h-6 w-6" />,
                            label: 'Our Studio',
                            value: 'Mumbai, Maharashtra',
                            href: undefined,
                        },
                    ].map(({ icon, label, value, href }) => {
                        const Wrapper = href ? 'a' : 'div';
                        return (
                            <Wrapper
                                key={label}
                                {...(href ? { href } : {})}
                                className="group relative flex flex-col items-center overflow-hidden rounded-3xl border border-white/[0.07] bg-white/[0.025] px-6 py-8 text-center backdrop-blur-sm transition-all duration-500 hover:border-[#c8a84b]/40 hover:bg-white/[0.05]"
                            >
                                {/* Hover shimmer */}
                                <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-[#c8a84b]/[0.06] to-transparent transition-transform duration-700 group-hover:translate-x-full" />
                                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl border border-[#c8a84b]/20 bg-[#c8a84b]/[0.08] text-[#D4AF37] transition-transform duration-300 group-hover:scale-110">
                                    {icon}
                                </div>
                                <p className="font-['Inter'] text-[9px] font-bold uppercase tracking-[0.2em] text-white/30">
                                    {label}
                                </p>
                                <p className="mt-2 font-['Inter'] text-sm font-medium text-white/75 transition-colors group-hover:text-[#D4AF37]">
                                    {value}
                                </p>
                            </Wrapper>
                        );
                    })}
                </motion.div>
            </SectionWrapper>

            {/* ── Form / Success Section ── */}
            <SectionWrapper className="relative z-10 pb-24 pt-12 md:pb-36 md:pt-16">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, delay: 0.35, ease: 'easeOut' }}
                    className="relative mx-auto max-w-4xl overflow-hidden rounded-[2rem] border border-white/[0.08] bg-[#0a0e0b] shadow-xl backdrop-blur-md"
                    style={{ boxShadow: '0 24px 64px rgba(0,0,0,0.35), 0 0 0 1px rgba(200,168,75,0.06)' }}
                >
                    {/* Card top accent line */}
                    <div
                        className="absolute left-0 right-0 top-0 h-px"
                        style={{
                            background:
                                'linear-gradient(90deg, transparent, rgba(200,168,75,0.5), transparent)',
                        }}
                    />

                    <AnimatePresence mode="wait">
                        {!submitted ? (
                            /* ── FORM STATE ── */
                            <motion.div
                                key="form"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0, scale: 0.97 }}
                                transition={{ duration: 0.4 }}
                                className="grid md:grid-cols-5"
                            >
                                {/* Left panel */}
                                <div
                                    className="relative flex flex-col justify-between overflow-hidden px-8 py-10 md:col-span-2 md:px-10 md:py-12"
                                    style={{
                                        background:
                                            'linear-gradient(160deg, rgba(14,54,36,0.6) 0%, rgba(8,20,12,0.85) 100%)',
                                        borderRight: '1px solid rgba(255,255,255,0.05)',
                                    }}
                                >
                                    {/* Big leaf decoration */}
                                    <div className="pointer-events-none absolute -bottom-10 -right-10 h-48 w-48 opacity-[0.07]">
                                        <Leaf className="h-full w-full" />
                                    </div>

                                    <div>
                                        <div className="mb-2 flex items-center gap-2">
                                            {[...Array(5)].map((_, i) => (
                                                <Star
                                                    key={i}
                                                    className="h-3.5 w-3.5 fill-[#D4AF37] text-[#D4AF37]"
                                                />
                                            ))}
                                        </div>
                                        <h2
                                            className="mt-2 font-['Cormorant_Garamond',serif] font-semibold text-[clamp(1.6rem,3.5vw,2.5rem)] leading-[1.1] tracking-tight text-[#F5F5DC]"
                                            style={{ fontWeight: 600 }}
                                        >
                                            Let's{' '}
                                            <span
                                                style={{
                                                    background:
                                                        'linear-gradient(135deg, #D4AF37, #f0d060)',
                                                    WebkitBackgroundClip: 'text',
                                                    WebkitTextFillColor: 'transparent',
                                                }}
                                            >
                                                Connect
                                            </span>
                                        </h2>
                                        <p className="mt-4 font-['Inter'] text-[14px] leading-relaxed text-white/50">
                                            Whether you have questions about our formulations, need a personalized wellness plan, or are interested in bulk and wholesale orders – our team is here for you.
                                        </p>
                                    </div>

                                    {/* Trust signals */}
                                    <div className="mt-10 space-y-3">
                                        {[
                                            '🌿 100% Natural Formulations',
                                            '🔬 Clinically Validated Science',
                                            '🤝 Personalized Wellness Plans',
                                            '⚡ 24-Hour Expert Response',
                                        ].map((item) => (
                                            <div
                                                key={item}
                                                className="flex items-center gap-3 rounded-xl border border-white/[0.06] bg-white/[0.03] px-4 py-2.5"
                                            >
                                                <span className="font-['Inter'] text-xs text-white/60">
                                                    {item}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Right panel – form */}
                                <div className="bg-[#080a08] px-8 py-10 md:col-span-3 md:px-10 md:py-12">
                                    <p className="mb-8 font-['Inter'] text-xs text-white/40">
                                        All fields marked are required
                                    </p>
                                    <form onSubmit={handleSubmit} className="space-y-5">
                                        <div className="grid gap-4 md:grid-cols-2">
                                            <label className="flex flex-col gap-2">
                                                <span className={labelClass}>Full Name</span>
                                                <input
                                                    required
                                                    value={name}
                                                    onChange={(e) => setName(e.target.value)}
                                                    placeholder="Enter your name"
                                                    className={inputClass}
                                                />
                                            </label>
                                            <label className="flex flex-col gap-2">
                                                <span className={labelClass}>Phone Number</span>
                                                <input
                                                    required
                                                    value={phone}
                                                    onChange={(e) => setPhone(e.target.value)}
                                                    placeholder="+91 98765 43210"
                                                    className={inputClass}
                                                />
                                            </label>
                                        </div>
                                        <label className="flex flex-col gap-2">
                                            <span className={labelClass}>Email Address</span>
                                            <input
                                                type="email"
                                                required
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                                placeholder="you@example.com"
                                                className={inputClass}
                                            />
                                        </label>
                                        <label className="flex flex-col gap-2">
                                            <span className={labelClass}>Your Query or Issue</span>
                                            <textarea
                                                required
                                                minLength={10}
                                                value={issue}
                                                onChange={(e) => setIssue(e.target.value)}
                                                placeholder="Explain your concern, product questions, or consultation request..."
                                                className="min-h-[140px] w-full rounded-2xl border border-white/10 bg-white/[0.04] px-5 py-4 font-['Inter'] text-sm text-white placeholder:text-white/30 focus:border-[#c8a84b]/60 focus:bg-white/[0.07] focus:outline-none transition-all duration-300 resize-none"
                                            />
                                        </label>

                                        {createContactInquiry.isError && (
                                            <motion.p
                                                initial={{ opacity: 0, x: -10 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                className="font-['Inter'] text-sm text-red-400"
                                            >
                                                {createContactInquiry.error.message ??
                                                    'Unable to submit right now. Please try again.'}
                                            </motion.p>
                                        )}

                                        <button
                                            type="submit"
                                            disabled={createContactInquiry.isPending}
                                            className="group relative mt-1 inline-flex h-13 w-full items-center justify-center gap-2.5 overflow-hidden rounded-2xl font-['Inter'] text-sm font-semibold uppercase tracking-[0.14em] text-black transition-all duration-300 disabled:cursor-not-allowed disabled:opacity-60"
                                            style={{
                                                background:
                                                    'linear-gradient(135deg, #D4AF37 0%, #f0d060 50%, #c8a84b 100%)',
                                                height: '52px',
                                            }}
                                        >
                                            {/* Hover shimmer */}
                                            <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-500 group-hover:translate-x-full" />
                                            {createContactInquiry.isPending ? (
                                                <>
                                                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-black/30 border-t-black" />
                                                    Submitting...
                                                </>
                                            ) : (
                                                <>
                                                    <Send className="h-4 w-4" />
                                                    Send Message
                                                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                                                </>
                                            )}
                                        </button>
                                    </form>
                                </div>
                            </motion.div>
                        ) : (
                            /* ── SUCCESS STATE ── */
                            <motion.div
                                key="success"
                                initial={{ opacity: 0, scale: 0.93 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.6, ease: 'easeOut' }}
                                className="flex flex-col items-center px-8 py-16 text-center md:py-20"
                            >
                                {/* Lottie animation */}
                                <div className="w-56 md:w-64">
                                    <Lottie
                                        animationData={successAnimation}
                                        loop={false}
                                        autoplay
                                        style={{ width: '100%', height: 'auto' }}
                                    />
                                </div>

                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.5, duration: 0.55 }}
                                    className="mt-6"
                                >
                                    {/* Gold divider */}
                                    <div className="mx-auto mb-6 h-px w-24 bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent" />

                                    <h2
                                        className="font-['Cormorant_Garamond',serif] font-semibold text-[clamp(1.8rem,5vw,3rem)] leading-tight tracking-tight text-[#F5F5DC]"
                                        style={{ fontWeight: 600 }}
                                    >
                                        Query Received!
                                    </h2>

                                    {/* Main message */}
                                    <motion.div
                                        initial={{ opacity: 0, y: 12 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.75, duration: 0.5 }}
                                        className="mx-auto mt-5 max-w-lg"
                                    >
                                        <p className="font-['Inter'] text-lg font-light leading-relaxed text-white/70 md:text-xl">
                                            Our team will reach out to you shortly regarding your inquiry.
                                        </p>
                                        <p className="mt-4 font-['Inter'] text-sm text-white/45">
                                            We strive to respond within{' '}
                                            <span className="text-[#c8a84b]">24 hours</span>. Thank you for
                                            choosing AW Naturals — India's finest wellness brand.
                                        </p>
                                    </motion.div>

                                    {/* CTA */}
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 1.0, duration: 0.5 }}
                                        className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center"
                                    >
                                        <button
                                            onClick={() => setSubmitted(false)}
                                            className="inline-flex h-12 items-center gap-2 rounded-full border border-[#c8a84b]/30 bg-transparent px-7 font-['Inter'] text-sm font-semibold uppercase tracking-[0.1em] text-[#D4AF37] transition-all hover:border-[#D4AF37] hover:bg-[#c8a84b]/[0.08]"
                                        >
                                            Submit Another Query
                                        </button>
                                        <Link
                                            to="/"
                                            className="inline-flex h-12 items-center gap-2 rounded-full px-7 font-['Inter'] text-sm font-semibold uppercase tracking-[0.1em] text-white/40 transition-colors hover:text-white/70"
                                        >
                                            Back to Home
                                            <ArrowRight className="h-4 w-4" />
                                        </Link>
                                    </motion.div>
                                </motion.div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </motion.div>
            </SectionWrapper>
            <style>{`
                @keyframes shine {
                    0% { background-position: 200% center; }
                    100% { background-position: -200% center; }
                }
                .animate-shine {
                    background-size: 200% auto;
                    animation: shine 3s linear infinite;
                }
            `}</style>
        </div>
    );
}
