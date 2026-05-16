import { Link } from 'react-router';
import { Instagram, Facebook, Twitter } from 'lucide-react';
import { SITE_CONTAINER_CLASS } from '../constants/site-layout';
import { cn } from './ui/utils';

const logoImage = '/aw_natural_logo.png';

/** Brand column width — matches top + bottom rows so © and Cookie line up with link block start. */
const brandColClass = 'w-full max-w-[280px] lg:w-[280px] shrink-0';

/** Fills space between brand and link cluster (desktop); same in bottom row so Cookie aligns with Quick Links. */
const betweenSessionsSpacerClass = 'hidden min-h-px min-w-8 flex-1 basis-0 lg:block';

export function Footer() {
    return (
        <footer className="relative z-[12] overflow-hidden bg-gradient-to-t from-[#0d2822] via-[#0B0B0B] to-[#0B0B0B] pb-0 pt-24 text-[#F5F5DC]">
            <div className={cn(SITE_CONTAINER_CLASS, 'relative z-10')}>
                {/* Top: brand | flexible middle space | Quick + Legal + Contact */}
                <div className="flex flex-col gap-10 lg:flex-row lg:items-start lg:gap-0">
                    <div className={`flex flex-col ${brandColClass}`}>
                        <Link to="/" className="mb-6 inline-block w-fit">
                            <div className="h-20 w-20 rounded-full border border-[#D4AF37]/20 bg-[#0B0B0B]/50 p-2 shadow-[0_0_30px_rgba(212,175,55,0.1)] backdrop-blur-xl">
                                <img src={logoImage} alt="AW Naturals" className="h-full w-full object-contain" />
                            </div>
                        </Link>
                        <p className="mb-8 max-w-[280px] font-['Inter'] text-[15px] font-light leading-relaxed text-white/50">
                            Nature Perfected by Healthcare Expertise.
                            <br />
                            <br />
                            We combine clinical healthcare roots with the world's most pristine, all-natural ingredients.
                            From functional daily rituals to holistic essentials, we design premium wellness solutions
                            to elevate your everyday health.
                        </p>
                        <div className="flex gap-5">
                            <a
                                href="#"
                                className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 text-white/40 transition-all duration-300 hover:border-[#D4AF37] hover:bg-[#D4AF37] hover:text-[#0B0B0B]"
                            >
                                <Instagram className="h-4 w-4" />
                            </a>
                            <a
                                href="#"
                                className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 text-white/40 transition-all duration-300 hover:border-[#D4AF37] hover:bg-[#D4AF37] hover:text-[#0B0B0B]"
                            >
                                <Facebook className="h-4 w-4" />
                            </a>
                            <a
                                href="#"
                                className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 text-white/40 transition-all duration-300 hover:border-[#D4AF37] hover:bg-[#D4AF37] hover:text-[#0B0B0B]"
                            >
                                <Twitter className="h-4 w-4" />
                            </a>
                        </div>
                    </div>

                    <div className={betweenSessionsSpacerClass} aria-hidden />

                    <div className="flex shrink-0 flex-col gap-10 sm:flex-row sm:gap-8 lg:gap-10 xl:gap-12">
                        <div className="min-w-0 sm:min-w-[140px]">
                            <h4 className="mb-6 font-['Inter'] text-[11px] font-bold uppercase tracking-[0.25em] text-[#D4AF37] opacity-80 lg:mb-8">
                                Quick Links
                            </h4>
                            <ul className="space-y-4 font-['Inter'] text-[14px] text-white/60">
                                <li>
                                    <Link to="/" className="transition-colors hover:text-white">
                                        Home
                                    </Link>
                                </li>
                                <li>
                                    <Link to="/products" className="transition-colors hover:text-white">
                                        Shop Products
                                    </Link>
                                </li>
                                <li>
                                    <Link to="/find-your-blend" className="transition-colors hover:text-white">
                                        Find Your Blend
                                    </Link>
                                </li>
                                <li>
                                    <Link to="/about" className="transition-colors hover:text-white">
                                        Our Story
                                    </Link>
                                </li>
                                <li>
                                    <Link to="/blog" className="transition-colors hover:text-white">
                                        Science
                                    </Link>
                                </li>
                            </ul>
                        </div>

                        <div className="min-w-0 sm:min-w-[140px]">
                            <h4 className="mb-6 font-['Inter'] text-[11px] font-bold uppercase tracking-[0.25em] text-[#D4AF37] opacity-80 lg:mb-8">
                                Legal
                            </h4>
                            <ul className="space-y-4 font-['Inter'] text-[14px] text-white/60">
                                <li>
                                    <Link to="/privacy-policy" className="transition-colors hover:text-white">
                                        Privacy Policy
                                    </Link>
                                </li>
                                <li>
                                    <Link to="/terms-of-service" className="transition-colors hover:text-white">
                                        Terms of Service
                                    </Link>
                                </li>
                                <li>
                                    <Link to="/refund-policy" className="transition-colors hover:text-white">
                                        Refund Policy
                                    </Link>
                                </li>
                                <li>
                                    <Link to="/accessibility" className="transition-colors hover:text-white">
                                        Accessibility
                                    </Link>
                                </li>
                            </ul>
                        </div>

                        <div className="min-w-0 sm:min-w-[180px]">
                            <h4 className="mb-6 font-['Inter'] text-[11px] font-bold uppercase tracking-[0.25em] text-[#D4AF37] opacity-80 lg:mb-8">
                                Contact Us
                            </h4>
                            <div className="space-y-6 font-['Inter'] text-[14px] font-light text-white/60">
                                <div className="space-y-1">
                                    <p className="text-[10px] font-bold uppercase tracking-widest text-white/30">Email</p>
                                    <p className="cursor-pointer text-white/80 transition-colors hover:text-[#D4AF37]">
                                        care@awnaturals.in
                                    </p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-[10px] font-bold uppercase tracking-widest text-white/30">Phone</p>
                                    <p className="cursor-pointer text-white/80 transition-colors hover:text-[#D4AF37]">
                                        +91 98765 43210
                                    </p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-[10px] font-bold uppercase tracking-widest text-white/30">HQ</p>
                                    <p className="leading-relaxed">
                                        Wellness Ave, Suite 400
                                        <br />
                                        Mumbai, MH 400001
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom: brand col + same flexible spacer + Cookie (aligns with Quick Links above) */}
                <div className="mt-10 flex flex-col gap-6 border-t border-white/5 py-10 font-['Inter'] text-[11px] font-medium uppercase tracking-[0.2em] text-white/30 lg:flex-row lg:items-center lg:gap-0">
                    <div className={brandColClass}>
                        <span>© 2026 AW Naturals</span>
                    </div>
                    <div className={betweenSessionsSpacerClass} aria-hidden />
                    <div className="flex shrink-0 flex-wrap gap-8">
                        <span className="cursor-pointer transition-colors hover:text-white">Cookie Policy</span>
                        <Link to="/sitemap" className="transition-colors hover:text-white">
                            Sitemap
                        </Link>
                    </div>
                </div>
            </div>

            <div className="pointer-events-none relative -mb-[2.5vw] flex w-full justify-center overflow-hidden select-none lg:-mb-[4vw]">
                <h1
                    className="whitespace-nowrap text-center font-['Gloock'] leading-[0.75] tracking-tighter text-white"
                    style={{
                        fontSize: '16vw',
                        background: 'linear-gradient(to bottom, rgba(212,175,55,0.12) 0%, rgba(15,61,46,0.02) 100%)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        opacity: 0.6,
                    }}
                >
                    AW NATURALS
                </h1>
            </div>
        </footer>
    );
}
