import { motion } from 'motion/react';
import { Globe, Dna, Tablet, Hospital, Check } from 'lucide-react';
import { SectionWrapper } from '../components/SectionWrapper';
import { PixelRevealImage } from '../components/PixelRevealImage';
import { PremiumGoldCtaButton } from '../components/PremiumGoldCtaButton';
import { PremiumSectionChip } from '../components/PremiumSectionChip';

const creamCardStyle = {
    background: 'linear-gradient(135deg, #EBE3CE 0%, #DDD0AE 100%)',
    border: '1px solid #E8E1CD',
    boxShadow: '0 15px 30px rgba(0,0,0,0.2)',
} as const;

const noiseBg = `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.08'/%3E%3C/svg%3E")`;

export function ServicesPage() {
    const services = [
        {
            icon: Globe,
            title: 'Global Remote Consultations',
            description: 'Access world-class expertise regardless of your location. We offer high-definition virtual consultations for patients in France, Dubai, Turkey, Japan and across India, ensuring continuity of care from the comfort of your home.',
            features: [
                'High-definition virtual sessions',
                'Global expertise access',
                'Digital care continuity',
                'Seamless home-based support',
            ],
            image: '/assets/services/consultation.webp',
        },
        {
            icon: Dna,
            title: 'DNA-Based Health Assessments',
            description: 'We don’t believe in one-size-fits-all health. Our ecosystem integrates your unique genetic blueprint and gut microbiome diagnostics to create a truly personalized preventative roadmap.',
            features: [
                'Unique genetic blueprinting',
                'Gut microbiome diagnostics',
                'Personalized preventative roadmap',
                'Ayurgenomics integration',
            ],
            image: '/assets/services/dna_test.webp',
        },
        {
            icon: Tablet,
            title: 'AURA Medical ID',
            description: 'As part of our commitment to modern healthcare, we have an AURA (Advance Universal Record & Analytics) system. This allows you to maintain a secure, lifelong digital health identity, making your medical history and wellness progress accessible whenever you need it.',
            features: [
                'Secure lifelong digital identity',
                'Centralized medical history',
                'Wellness progress tracking',
                'Global accessibility',
            ],
            image: '/assets/services/aura_medical.webp',
        },
        {
            icon: Hospital,
            title: 'Supervised Clinical Cleansing',
            description: 'For deep systemic restoration, we facilitate supervised in-patient detoxification through our strategic hospital tie-ups. This "physical" touchpoint ensures that your digital wellness plan is anchored by rigorous clinical procedures.',
            features: [
                'In-patient detoxification',
                'Strategic hospital tie-ups',
                'Rigorous clinical procedures',
                'Deep systemic restoration',
            ],
            image: '/assets/services/Supervised_Clinical_Cleansing.webp',
        },
    ];

    return (
        <div className="min-h-screen bg-[#0B0B0B] bg-[radial-gradient(ellipse_at_top,rgba(15,61,46,0.45),transparent_60vw)]">
            <SectionWrapper className="pb-12 pt-36">
                <div className="mx-auto max-w-4xl text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, ease: 'easeOut' }}
                    >
                        <div className="mb-8 flex justify-center">
                            <PremiumSectionChip>Our Services</PremiumSectionChip>
                        </div>
                        <h1 className="mb-6 font-['Cormorant_Garamond',serif] font-semibold text-[48px] leading-tight tracking-tight text-[#F5F5DC] md:text-[64px] lg:text-[72px]">
                            The Phygital{' '}
                            <span className="animate-shine bg-gradient-to-r from-[#C6A85B] via-[#E5D08A] to-[#C6A85B] bg-clip-text italic text-transparent">
                                Ecosystem
                            </span>
                        </h1>
                        <p className="mx-auto max-w-3xl font-['Inter'] text-[16px] md:text-[18px] text-[#F5F5DC]/60 font-light leading-relaxed">
                            Bridging the gap between traditional clinical excellence and modern digital accessibility.
                        </p>
                    </motion.div>
                </div>

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
            </SectionWrapper>

            <SectionWrapper>
                <div className="space-y-32">
                    {services.map((service, index) => (
                        <motion.div
                            key={service.title}
                            initial={{ opacity: 0, y: 40 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: '-100px' }}
                            transition={{ duration: 0.8, ease: 'easeOut' }}
                            className={`grid grid-cols-1 items-center gap-16 lg:grid-cols-2 ${
                                index % 2 === 1 ? 'lg:grid-flow-dense' : ''
                            }`}
                        >
                            <div className={`order-2 lg:order-none ${index % 2 === 1 ? 'lg:col-start-2' : ''}`}>
                                <div className="mb-8 flex items-center gap-6">
                                    <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl border border-white/[0.12] bg-white/[0.06] shadow-[inset_0_1px_0_rgba(255,255,255,0.12),0_8px_32px_rgba(0,0,0,0.25)] backdrop-blur-xl">
                                        <service.icon className="h-8 w-8 text-[#D4AF37]" aria-hidden />
                                    </div>
                                    <h2 className="flex-1 font-['Playfair_Display'] text-3xl leading-tight text-[#F5F5DC] md:text-4xl">
                                        {service.title}
                                    </h2>
                                </div>
                                <p className="mb-14 font-['Inter'] text-lg font-light leading-relaxed text-[#F5F5DC]/70 md:mb-16 lg:mb-20">
                                    {service.description}
                                </p>

                                <div className="relative mb-10 overflow-hidden rounded-[32px] p-8" style={creamCardStyle}>
                                    <div
                                        className="pointer-events-none absolute inset-0 z-0 opacity-[0.25] mix-blend-multiply"
                                        style={{ backgroundImage: noiseBg }}
                                    />
                                    <div className="relative z-10">
                                        <h3 className="mb-6 font-['Cormorant_Garamond',serif] text-2xl font-semibold text-[#1A1A1A]">
                                            What&apos;s Included
                                        </h3>
                                        <ul className="space-y-4">
                                            {service.features.map((feature) => (
                                                <li key={feature} className="flex items-center gap-4">
                                                    <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-[#0B0B0B] bg-[#0B0B0B]">
                                                        <Check className="h-3.5 w-3.5 text-[#D4AF37]" strokeWidth={2.75} aria-hidden />
                                                    </div>
                                                    <span className="font-['Inter'] font-medium leading-relaxed text-[#333333]/90">
                                                        {feature}
                                                    </span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>

                                <PremiumGoldCtaButton type="button" className="w-full sm:w-auto">
                                    Book Session
                                </PremiumGoldCtaButton>
                            </div>

                            <div
                                className={`order-1 lg:order-none flex justify-center ${index % 2 === 1 ? 'lg:col-start-1' : ''}`}
                            >
                                <PixelRevealImage src={service.image} alt={service.title} />
                            </div>
                        </motion.div>
                    ))}
                </div>
            </SectionWrapper>
        </div>
    );
}
