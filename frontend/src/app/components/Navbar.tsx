import React, { useState, useEffect, type ReactNode } from 'react';
import { Link, useLocation } from 'react-router';
import { motion, AnimatePresence } from 'motion/react';
import { ShoppingCart, Menu, X, ChevronDown, User } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useCustomerAuth } from '../context/CustomerAuthContext';
import { cn } from './ui/utils';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
    DropdownMenuSeparator,
    DropdownMenuLabel,
} from './ui/dropdown-menu';
import { SITE_CONTAINER_CLASS } from '../constants/site-layout';
import { PRODUCT_CATEGORY_NAV } from '../constants/product-categories';

const logoImage = '/aw_natural_logo.png';

const linkClass = (active: boolean) =>
    cn(
        'relative inline-flex shrink-0 items-center text-[12px] leading-none tracking-[0.04em] uppercase transition-colors duration-300 pb-1 sm:text-[13px]',
        active ? 'text-[#D4AF37] font-semibold' : 'text-white/50 hover:text-white/90',
    );

export function Navbar() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const [mobileProductsOpen, setMobileProductsOpen] = useState(false);
    const { items } = useCart();
    const { user, isAuthenticated, logout, authModal, openAuthModal } = useCustomerAuth();
    const location = useLocation();

    useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 30);
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        setIsMenuOpen(false);
        setMobileProductsOpen(false);
    }, [location.pathname, location.hash]);

    const cartItemCount = items.reduce((total, item) => total + item.quantity, 0);

    const isProductsRoute = location.pathname.startsWith('/products');
    const isAboutBase = location.pathname === '/about';
    const isScience = location.pathname === '/science';
    const isServices = location.pathname === '/services' || location.pathname.startsWith('/services/');
    const isContact = location.pathname === '/contact';
    const isBlog = location.pathname === '/blog' || location.pathname.startsWith('/blog/');
    const isHome = location.pathname === '/';
    const authPanelOpen = authModal !== null;

    /** Mobile drawer — same destinations as desktop dropdown */
    const productNavLinks = PRODUCT_CATEGORY_NAV;

    return (
        <>
            <motion.nav
                initial={{ y: -80, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.6, ease: 'easeOut' }}
                className={cn(
                    'fixed top-0 left-0 right-0 z-[90] transition-all duration-500',
                    isScrolled
                        ? 'bg-black/75 backdrop-blur-[24px] shadow-[0_0_0_1px_rgba(255,255,255,0.04),0_8px_32px_rgba(0,0,0,0.5)] pb-3 pt-2'
                        : 'bg-transparent pb-5 pt-2',
                )}
            >
                {/* GLOBAL ANNOUNCEMENT BAR */}
                <div className="absolute top-0 left-0 z-[100] flex h-[44px] w-full items-center overflow-hidden bg-black">
                    <div className="flex whitespace-nowrap animate-marquee">
                        {[...Array(2)].map((_, groupIdx) => (
                            <div key={groupIdx} className="flex shrink-0 items-center">
                                {[...Array(4)].map((_, textIdx) => (
                                    <React.Fragment key={textIdx}>
                                        <span className="text-[#FAF6ED] font-['Inter'] text-[10px] sm:text-xs uppercase tracking-[0.2em] font-semibold mx-6 sm:mx-10 cursor-default">
                                            Free Shipping on orders above 299
                                        </span>
                                        <span className="text-[#D4AF37] text-[8px] sm:text-[10px]">✦</span>
                                    </React.Fragment>
                                ))}
                            </div>
                        ))}
                    </div>
                </div>

                <div className={cn(SITE_CONTAINER_CLASS, 'relative mt-[44px] flex min-h-[44px] items-center')}>
                    <div className="relative z-20 flex shrink-0 items-center">
                        <Link to="/" className="flex items-center">
                            <img
                                src={logoImage}
                                alt="AW Naturals"
                                className="h-11 w-11 rounded-full object-cover"
                            />
                        </Link>
                    </div>

                    <div className="pointer-events-none absolute inset-0 z-10 hidden items-center justify-center md:flex">
                        <nav
                            className="pointer-events-auto flex max-w-[min(100%,calc(100vw-14rem))] flex-nowrap items-center justify-center gap-3 sm:max-w-[min(100%,calc(100vw-17rem))] sm:gap-4 lg:gap-6 xl:gap-8"
                            aria-label="Main"
                        >
                        <Link to="/" className={linkClass(isHome)}>
                            Home
                            {isHome && (
                                <motion.span
                                    layoutId="nav-underline"
                                    className="absolute bottom-0 left-0 right-0 h-[1.2px] rounded-full bg-[#D4AF37]"
                                    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                                />
                            )}
                        </Link>
                        <Link
                            to="/about"
                            title="Philosophy of the brand and expertise behind our formulations"
                            className={linkClass(isAboutBase)}
                        >
                            About us
                            {isAboutBase && (
                                <motion.span
                                    layoutId="nav-underline"
                                    className="absolute bottom-0 left-0 right-0 h-[1.2px] rounded-full bg-[#D4AF37]"
                                    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                                />
                            )}
                        </Link>

                        <DropdownMenu>
                            <DropdownMenuTrigger
                                className={cn(
                                    'relative inline-flex h-11 shrink-0 items-center gap-1 border-0 bg-transparent pb-1 text-[12px] leading-none uppercase tracking-[0.04em] outline-none transition-colors duration-300 sm:text-[13px]',
                                    isProductsRoute ? 'font-semibold text-[#D4AF37]' : 'text-white/50 hover:text-white/90',
                                )}
                                aria-label="Shop menu"
                            >
                                Shop
                                <ChevronDown className="h-3.5 w-3.5 opacity-70" aria-hidden />
                                {isProductsRoute && (
                                    <motion.span
                                        layoutId="nav-underline"
                                        className="absolute bottom-0 left-0 right-0 h-[1.2px] rounded-full bg-[#D4AF37]"
                                        transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                                    />
                                )}
                            </DropdownMenuTrigger>
                            <DropdownMenuContent
                                align="center"
                                sideOffset={10}
                                className="min-w-[240px] rounded-xl border border-white/[0.12] bg-[#0a0a0a]/50 text-white shadow-[0_16px_48px_rgba(0,0,0,0.6)] backdrop-blur-3xl"
                            >
                                <DropdownMenuItem
                                    asChild
                                    className="cursor-pointer uppercase tracking-[0.08em] text-[11px] text-white/80 focus:bg-white/[0.06] focus:text-[#D4AF37]"
                                >
                                    <Link to={PRODUCT_CATEGORY_NAV[0].to}>Shop all</Link>
                                </DropdownMenuItem>
                                <DropdownMenuSeparator className="bg-white/10" />
                                <DropdownMenuLabel className="px-2 pb-1 pt-0 text-[10px] uppercase tracking-[0.14em] text-white/45">
                                    Category
                                </DropdownMenuLabel>
                                {PRODUCT_CATEGORY_NAV.slice(1).map((item) => (
                                    <div key={item.value}>
                                        <DropdownMenuItem
                                            asChild
                                            className="cursor-pointer text-[12px] text-white/85 focus:bg-white/[0.06] focus:text-[#D4AF37]"
                                        >
                                            <Link to={item.to}>{item.label}</Link>
                                        </DropdownMenuItem>
                                    </div>
                                ))}
                            </DropdownMenuContent>
                        </DropdownMenu>

                        <Link
                            to="/services"
                            title="Specialized consultations, gut microbiome analysis, and preventative wellness"
                            className={linkClass(isServices)}
                        >
                            Services
                            {isServices && (
                                <motion.span
                                    layoutId="nav-underline"
                                    className="absolute bottom-0 left-0 right-0 h-[1.2px] rounded-full bg-[#D4AF37]"
                                    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                                />
                            )}
                        </Link>

                        <Link
                            to="/blog"
                            title="Read our latest articles"
                            className={linkClass(isBlog)}
                        >
                            Science
                            {isBlog && (
                                <motion.span
                                    layoutId="nav-underline"
                                    className="absolute bottom-0 left-0 right-0 h-[1.2px] rounded-full bg-[#D4AF37]"
                                    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                                />
                            )}
                        </Link>
                        <Link
                            to="/contact"
                            title="Inquiries and consultation bookings"
                            className={linkClass(isContact)}
                        >
                            Contact
                            {isContact && (
                                <motion.span
                                    layoutId="nav-underline"
                                    className="absolute bottom-0 left-0 right-0 h-[1.2px] rounded-full bg-[#D4AF37]"
                                    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                                />
                            )}
                        </Link>
                        </nav>
                    </div>

                    <div className="relative z-20 ml-auto flex shrink-0 items-center gap-2 md:gap-3">
                        <Link
                            to="/products"
                            className="hidden rounded-full bg-[#D4AF37] px-4 py-2 font-['Inter'] text-[13px] font-semibold tracking-wide text-[#0B0B0B] transition-colors duration-300 hover:bg-[#E5C75A] lg:inline-flex"
                        >
                            Shop now
                        </Link>

                        {isAuthenticated ? (
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <button
                                        type="button"
                                        className={cn(
                                            'rounded-full p-2 outline-none transition-colors duration-300 focus-visible:ring-2 focus-visible:ring-[#D4AF37]/50',
                                            'text-white/60 hover:text-[#D4AF37]',
                                        )}
                                        aria-label="Account menu"
                                    >
                                        <User className="h-5 w-5" />
                                    </button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent
                                    align="end"
                                    sideOffset={10}
                                    className="min-w-[200px] rounded-xl border border-white/[0.12] bg-[#0a0a0a]/95 text-white shadow-[0_16px_48px_rgba(0,0,0,0.6)] backdrop-blur-3xl"
                                >
                                    <DropdownMenuLabel className="max-w-[220px] truncate font-normal normal-case tracking-normal text-white/90">
                                        {user?.name}
                                    </DropdownMenuLabel>
                                    <p className="truncate px-2 pb-2 text-xs text-white/45">{user?.email}</p>
                                    <DropdownMenuSeparator className="bg-white/10" />
                                    <DropdownMenuItem
                                        asChild
                                        className="cursor-pointer text-white/80 focus:bg-white/[0.06] focus:text-[#D4AF37]"
                                    >
                                        <Link to="/profile">Edit profile</Link>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                        asChild
                                        className="cursor-pointer text-white/80 focus:bg-white/[0.06] focus:text-[#D4AF37]"
                                    >
                                        <Link to="/profile/orders">Order history</Link>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                        asChild
                                        className="cursor-pointer text-white/80 focus:bg-white/[0.06] focus:text-[#D4AF37]"
                                    >
                                        <Link to="/profile/security">Login & security</Link>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                        className="cursor-pointer text-red-300/90 focus:bg-white/[0.06] focus:text-red-200"
                                        onClick={() => logout()}
                                    >
                                        Log out
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        ) : (
                            <button
                                type="button"
                                onClick={() => openAuthModal('login')}
                                className={cn(
                                    'group rounded-full p-2 transition-colors duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D4AF37]/50',
                                    authPanelOpen ? 'text-[#D4AF37]' : 'text-white/60 hover:text-[#D4AF37]',
                                )}
                                aria-label="Sign in"
                                aria-haspopup="dialog"
                                aria-expanded={authPanelOpen}
                            >
                                <User className="h-5 w-5" />
                            </button>
                        )}

                        <Link to="/cart" className="group relative p-2">
                            <ShoppingCart className="h-5 w-5 text-white/60 transition-colors duration-300 group-hover:text-[#D4AF37]" />
                            <AnimatePresence>
                                {cartItemCount > 0 && (
                                    <motion.span
                                        initial={{ scale: 0, opacity: 0 }}
                                        animate={{ scale: 1, opacity: 1 }}
                                        exit={{ scale: 0, opacity: 0 }}
                                        className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-[#D4AF37] text-[9px] font-bold text-[#0B0B0B]"
                                    >
                                        {cartItemCount}
                                    </motion.span>
                                )}
                            </AnimatePresence>
                        </Link>

                        <button
                            type="button"
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="p-2 text-white/70 transition-colors duration-300 hover:text-[#D4AF37] md:hidden"
                            aria-label="Toggle menu"
                            aria-expanded={isMenuOpen}
                        >
                            {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                        </button>
                    </div>
                </div>
            </motion.nav>

            <AnimatePresence>
                {isMenuOpen && (
                    <>
                        {/* BACKDROP OVERLAY */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            onClick={() => setIsMenuOpen(false)}
                            className="fixed inset-0 z-[120] bg-black/60 backdrop-blur-sm md:hidden"
                        />

                        {/* DRAWER PANEL */}
                        <motion.div
                            initial={{ x: '100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '100%' }}
                            transition={{ type: 'spring', damping: 25, stiffness: 220 }}
                            className="fixed right-0 top-0 bottom-0 h-full w-[85vw] max-w-[340px] z-[130] bg-[#080808]/95 border-l border-white/[0.08] shadow-[0_0_50px_rgba(0,0,0,0.85)] backdrop-blur-[28px] flex flex-col p-6 overflow-y-auto md:hidden"
                        >
                            {/* Drawer Header with Logo and Close Button */}
                            <div className="flex items-center justify-between pb-6 mb-4 border-b border-white/[0.06]">
                                <Link to="/" className="flex items-center" onClick={() => setIsMenuOpen(false)}>
                                    <img
                                        src={logoImage}
                                        alt="AW Naturals"
                                        className="h-9 w-9 rounded-full object-cover"
                                    />
                                    <span className="ml-3 font-['Cormorant_Garamond'] text-[#D4AF37] text-lg font-bold tracking-wider uppercase">AW Naturals</span>
                                </Link>
                                <button
                                    type="button"
                                    onClick={() => setIsMenuOpen(false)}
                                    className="p-2 rounded-full bg-white/[0.03] text-white/70 hover:text-[#D4AF37] hover:bg-white/[0.08] transition-all"
                                    aria-label="Close menu"
                                >
                                    <X className="h-5 w-5" />
                                </button>
                            </div>

                            {/* Navigation Links */}
                            <div className="flex flex-col gap-2 flex-1">
                                <MobileNavLink to="/" active={isHome} onNavigate={() => setIsMenuOpen(false)}>
                                    Home
                                </MobileNavLink>
                                <MobileNavLink to="/about" active={isAboutBase} onNavigate={() => setIsMenuOpen(false)}>
                                    About us
                                </MobileNavLink>
                                
                                {/* Shop Accordion */}
                                <div className="py-1">
                                    <button
                                        type="button"
                                        onClick={() => setMobileProductsOpen((o) => !o)}
                                        className={cn(
                                            'flex w-full items-center justify-between rounded-lg px-3 py-2 text-base transition-all duration-200 font-normal',
                                            isProductsRoute
                                                ? 'bg-white/[0.04] text-[#D4AF37]'
                                                : 'text-white/65 hover:bg-white/[0.03] hover:text-white',
                                        )}
                                        aria-expanded={mobileProductsOpen}
                                    >
                                        Shop
                                        <ChevronDown
                                            className={cn('h-4 w-4 transition-transform duration-200', mobileProductsOpen && 'rotate-180')}
                                            aria-hidden
                                        />
                                    </button>
                                    <AnimatePresence initial={false}>
                                        {mobileProductsOpen && (
                                            <motion.div
                                                initial={{ height: 0, opacity: 0 }}
                                                animate={{ height: 'auto', opacity: 1 }}
                                                exit={{ height: 0, opacity: 0 }}
                                                transition={{ duration: 0.2 }}
                                                className="overflow-hidden pl-2"
                                            >
                                                {productNavLinks.map((item) => (
                                                    <Link
                                                        key={item.label}
                                                        to={item.to}
                                                        onClick={() => setIsMenuOpen(false)}
                                                        className="block rounded-lg py-2 pl-4 text-sm text-white/50 transition-colors hover:text-[#D4AF37]"
                                                    >
                                                        {item.label}
                                                    </Link>
                                                ))}
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>

                                <MobileNavLink to="/services" active={isServices} onNavigate={() => setIsMenuOpen(false)}>
                                    Services
                                </MobileNavLink>

                                <MobileNavLink to="/blog" active={isBlog} onNavigate={() => setIsMenuOpen(false)}>
                                    Science
                                </MobileNavLink>
                                <MobileNavLink to="/contact" active={isContact} onNavigate={() => setIsMenuOpen(false)}>
                                    Contact
                                </MobileNavLink>
                                
                                {isAuthenticated ? (
                                    <div className="mt-4 flex flex-col gap-1 border-t border-white/[0.06] pt-4">
                                        <div className="px-3 py-1.5 flex flex-col">
                                            <span className="text-[11px] uppercase tracking-wider text-white/44">Account</span>
                                            <span className="text-sm font-medium text-white/80 truncate mt-0.5">{user?.name}</span>
                                        </div>
                                        <Link
                                            to="/profile"
                                            onClick={() => setIsMenuOpen(false)}
                                            className="rounded-lg px-3 py-2 text-left text-sm text-white/60 hover:bg-white/[0.03] hover:text-[#D4AF37] transition-all"
                                        >
                                            Edit profile
                                        </Link>
                                        <Link
                                            to="/profile/orders"
                                            onClick={() => setIsMenuOpen(false)}
                                            className="rounded-lg px-3 py-2 text-left text-sm text-white/60 hover:bg-white/[0.03] hover:text-[#D4AF37] transition-all"
                                        >
                                            Order history
                                        </Link>
                                        <Link
                                            to="/profile/security"
                                            onClick={() => setIsMenuOpen(false)}
                                            className="rounded-lg px-3 py-2 text-left text-sm text-white/60 hover:bg-white/[0.03] hover:text-[#D4AF37] transition-all"
                                        >
                                            Login & security
                                        </Link>
                                        <button
                                            type="button"
                                            onClick={() => {
                                                logout();
                                                setIsMenuOpen(false);
                                            }}
                                            className="rounded-lg px-3 py-2 text-left text-sm text-red-300/80 hover:bg-white/[0.03] hover:text-red-200 transition-all"
                                        >
                                            Log out
                                        </button>
                                    </div>
                                ) : (
                                    <div className="mt-4 border-t border-white/[0.06] pt-4">
                                        <button
                                            type="button"
                                            onClick={() => {
                                                openAuthModal('login');
                                                setIsMenuOpen(false);
                                            }}
                                            className={cn(
                                                'w-full rounded-lg px-3 py-2 text-left text-base transition-all duration-200',
                                                authPanelOpen
                                                    ? 'bg-white/[0.04] text-[#D4AF37]'
                                                    : 'text-white/65 hover:bg-white/[0.03] hover:text-white',
                                            )}
                                        >
                                            Account / Sign in
                                        </button>
                                    </div>
                                )}
                            </div>

                            {/* Footer Area inside Drawer */}
                            <div className="mt-auto pt-6 border-t border-white/[0.06] flex flex-col gap-2">
                                <Link
                                    to="/products"
                                    onClick={() => setIsMenuOpen(false)}
                                    className="inline-flex items-center justify-center rounded-full bg-[#D4AF37] px-5 py-3 text-sm font-semibold tracking-wide text-[#0B0B0B] hover:bg-[#E5C75A] active:scale-[0.98] transition-all duration-200 shadow-[0_4px_16px_rgba(212,175,55,0.2)]"
                                >
                                    Shop now
                                </Link>
                                <span className="text-[10px] text-center text-white/35 font-light tracking-[0.1em] uppercase mt-2">✦ Formulated by Clinicians ✦</span>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
            <style dangerouslySetInnerHTML={{
                __html: `
                @keyframes marquee {
                    0% { transform: translateX(0); }
                    100% { transform: translateX(-50%); }
                }
                .animate-marquee {
                    animation: marquee 25s linear infinite;
                }
            `}} />
        </>
    );
}

function MobileNavLink({
    to,
    active,
    children,
    onNavigate,
}: {
    to: string;
    active: boolean;
    children: ReactNode;
    onNavigate: () => void;
}) {
    return (
        <Link
            to={to}
            onClick={onNavigate}
            className={cn(
                'rounded-lg px-3 py-2 text-base transition-all duration-200',
                active ? 'bg-white/[0.04] text-[#D4AF37]' : 'text-white/55 hover:bg-white/[0.03] hover:text-white',
            )}
        >
            {children}
        </Link>
    );
}
