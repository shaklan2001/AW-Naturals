import { useEffect, useState } from 'react';
import { Link } from 'react-router';
import { motion, AnimatePresence } from 'motion/react';
import { ShoppingCart, ArrowLeft, Check, Plus, Minus, Leaf } from 'lucide-react';
import { ImageWithFallback } from '@/shared/components/ImageWithFallback';
import type { Product } from '../../../context/CartContext';
import type { StorefrontProduct } from '../../../api/public-api';
import { useCart } from '../../../context/CartContext';
import { getProductDetailExtra } from './productDetailConstants';
import type { ProductDetailExtra } from './productDetailConstants';
import { toCartProduct } from './productListUtils';

/** Small card used in the "More Formulations" grid — qty reads/writes global cart */
function MoreProductCard({
    p,
    index,
}: {
    p: StorefrontProduct;
    index: number;
}) {
    const { getItemQuantity, addToCart, updateQuantity } = useCart();
    const cartQty = getItemQuantity(p.id);
    const cardUpcoming = p.status === 'upcoming';

    const handleAdd = () => {
        if (cardUpcoming) return;
        addToCart(toCartProduct(p));
    };

    const handleIncrease = () => {
        if (cardUpcoming) return;
        updateQuantity(p.id, cartQty + 1);
    };

    const handleDecrease = () => {
        if (cardUpcoming) return;
        if (cartQty <= 1) {
            updateQuantity(p.id, 0);
            return;
        }
        updateQuantity(p.id, cartQty - 1);
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.12, duration: 0.7 }}
            className="w-full rounded-[22px] overflow-hidden"
            style={{
                background: 'linear-gradient(145deg, rgba(242,235,218,0.98) 0%, rgba(230,218,186,1) 100%)',
                boxShadow: '0 20px 60px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.7)',
                border: '1px solid rgba(180,155,80,0.3)',
            }}
        >
            {/* Square image */}
            <Link to={`/products/${p.id}`} className="block overflow-hidden rounded-t-[22px]">
                <div className="relative aspect-square w-full overflow-hidden">
                    <ImageWithFallback
                        src={p.image}
                        alt={p.name}
                        className="h-full w-full object-cover"
                    />
                </div>
            </Link>

            {/* Card body */}
            <div className="p-5">
                <p className="mb-1 font-['Inter'] text-[10px] font-bold uppercase tracking-[0.22em] text-[#8a6200]/70">
                    {p.category || p.benefit}
                </p>
                <h3 className="mb-1 font-['Gloock'] text-[1.25rem] text-[#141210]">
                    {p.name}
                </h3>
                <p className="mb-4 font-['Gloock'] text-[1.4rem] text-[#8a6200]">
                    ₹{p.price}
                </p>

                {/* Add to Cart / Stepper */}
                <AnimatePresence mode="wait">
                    {cardUpcoming ? (
                        <div className="rounded-xl border border-[#8a6200]/30 bg-[#8a6200]/10 py-2.5 text-center font-['Inter'] text-[11px] font-bold uppercase tracking-[0.1em] text-[#5a3e00]">
                            Coming soon
                        </div>
                    ) : cartQty === 0 ? (
                        <motion.button
                            key="add"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            transition={{ duration: 0.18 }}
                            type="button"
                            onClick={handleAdd}
                            className="flex w-full items-center justify-center gap-2 rounded-xl border border-[#8a6200]/40 bg-[#8a6200]/10 py-2.5 font-['Inter'] text-[12px] font-bold uppercase tracking-[0.12em] text-[#5a3e00] transition-all duration-300 hover:bg-[#D4AF37] hover:border-[#D4AF37] hover:text-[#0B0B0B]"
                        >
                            <Plus className="h-4 w-4" /> Add to Cart
                        </motion.button>
                    ) : (
                        <motion.div
                            key="stepper"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            transition={{ duration: 0.18 }}
                            className="flex items-center rounded-xl overflow-hidden border border-[#8a6200]/40"
                        >
                            <button
                                type="button"
                                onClick={handleDecrease}
                                className="flex items-center justify-center w-10 h-10 bg-[#8a6200]/10 text-[#5a3e00] hover:bg-[#8a6200]/20 transition-colors flex-shrink-0"
                            >
                                <Minus className="h-3.5 w-3.5" />
                            </button>
                            <span className="flex-1 text-center font-['Gloock'] text-[18px] text-[#141210] leading-none py-2">
                                {cartQty}
                            </span>
                            <button
                                type="button"
                                onClick={handleIncrease}
                                className="flex items-center justify-center w-10 h-10 bg-[#D4AF37] text-[#0B0B0B] hover:bg-[#e5c952] transition-colors flex-shrink-0"
                            >
                                <Plus className="h-3.5 w-3.5" />
                            </button>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </motion.div>
    );
}

export interface ProductDetailViewProps {
    product: Product;
    moreProducts?: StorefrontProduct[];
    /** Live quantity from cart for this product id */
    cartQuantity: number;
    updateQuantity: (productId: string, quantity: number) => void;
    onAddToCart: () => void;
}

export function ProductDetailView({
    product,
    moreProducts = [],
    cartQuantity,
    updateQuantity,
    onAddToCart,
}: ProductDetailViewProps) {
    const fallback: ProductDetailExtra = getProductDetailExtra(product.id);
    const useApiPointers = !!(product.keyBenefitsPoints && product.keyBenefitsPoints.length > 0);
    const benefits = useApiPointers ? product.keyBenefitsPoints! : fallback.benefits;
    const benefitsIntro = useApiPointers ? null : fallback.benefitsDescription;
    const useApiIngredients = !!(product.ingredientsPoints && product.ingredientsPoints.length > 0);
    const ingredientsTags = useApiIngredients ? product.ingredientsPoints! : fallback.ingredients;
    const clinicalBody =
        product.showClinicalNote && product.clinicalNote?.trim()
            ? product.clinicalNote.trim()
            : null;
    /** Draft qty when product not in cart yet (stepper hidden until first add). */
    const [qtyLocal, setQtyLocal] = useState(cartQuantity);
    const [added, setAdded] = useState(false);
    const isUpcoming = product.status === 'upcoming';

    useEffect(() => {
        setQtyLocal(cartQuantity);
    }, [cartQuantity, product.id]);

    const shownQty = cartQuantity > 0 ? cartQuantity : qtyLocal;

    const handleStepDec = () => {
        if (isUpcoming) return;
        if (cartQuantity > 0) {
            updateQuantity(product.id, Math.max(1, cartQuantity - 1));
            return;
        }
        setQtyLocal((q) => Math.max(1, q - 1));
    };

    const handleStepInc = () => {
        if (isUpcoming) return;
        if (cartQuantity > 0) {
            updateQuantity(product.id, cartQuantity + 1);
            return;
        }
        setQtyLocal((q) => q + 1);
    };

    const handleAddToCart = () => {
        if (isUpcoming) return;
        const target = qtyLocal === 0 ? 1 : qtyLocal;
        for (let i = 0; i < target; i++) onAddToCart();
        setAdded(true);
        setTimeout(() => setAdded(false), 2000);
    };

    return (
        <div className="min-h-screen bg-[#0B0B0B] pt-24 text-white">
            {/* Back link */}
            <div className="max-w-[1320px] mx-auto px-6 py-6">
                <Link
                    to="/products"
                    className="inline-flex items-center gap-2 font-['Inter'] text-[13px] font-medium uppercase tracking-[0.1em] text-[#D4AF37]/70 transition-all hover:text-[#D4AF37] hover:gap-3"
                >
                    <ArrowLeft className="h-4 w-4" />
                    Back to Products
                </Link>
            </div>

            {/* ── Main grid ─────────────────────────────────────── */}
            <section className="max-w-[1320px] mx-auto px-6 pb-16">
                <div className="grid grid-cols-1 lg:grid-cols-[1fr_1fr] gap-16 items-start">

                    {/* LEFT – sticky square image */}
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.9, ease: 'easeOut' }}
                        className="lg:sticky lg:top-28"
                    >
                        <div className="relative aspect-square w-full overflow-hidden rounded-[24px] border border-[#D4AF37]/20">
                            <ImageWithFallback
                                src={product.image}
                                alt={product.name}
                                className="h-full w-full object-cover"
                            />
                            {/* benefit badge */}
                            <div className="absolute bottom-5 left-5 rounded-full border border-[#D4AF37]/50 bg-black/50 px-4 py-1.5 font-['Inter'] text-[11px] font-semibold uppercase tracking-[0.18em] text-[#D4AF37] backdrop-blur-md">
                                {product.benefit}
                            </div>
                        </div>
                    </motion.div>

                    {/* RIGHT – scrollable content */}
                    <motion.div
                        initial={{ opacity: 0, x: 30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.9, ease: 'easeOut' }}
                        className="flex flex-col gap-8"
                    >
                        {/* Title + description */}
                        <div>
                            <p className="mb-3 font-['Inter'] text-[11px] font-semibold uppercase tracking-[0.3em] text-[#D4AF37]/70">
                                AW Naturals
                            </p>
                            <h1 className="font-['Gloock'] text-[clamp(2rem,5vw,3.5rem)] leading-[1.05] tracking-wide text-[#F5F5DC]">
                                {product.name}
                            </h1>
                            <p className="mt-4 font-['Inter'] text-base font-light leading-relaxed text-[#F5F5DC]/65">
                                {product.description}
                            </p>
                        </div>

                        {/* Price */}
                        <div className="flex items-baseline gap-4 border-b border-white/[0.06] pb-6">
                            <span className="font-['Gloock'] text-[3rem] leading-none text-[#D4AF37]">
                                ₹{product.price}
                            </span>
                            <span className="font-['Inter'] text-sm font-light text-[#F5F5DC]/50">
                                30-day supply
                            </span>
                        </div>

                        {/* Add to Cart + Qty */}
                        <div className="flex flex-col gap-4">
                            {isUpcoming && (
                                <p className="rounded-2xl border border-[#D4AF37]/30 bg-[#D4AF37]/10 px-4 py-3 text-center font-['Inter'] text-[13px] font-semibold uppercase tracking-[0.12em] text-[#D4AF37]">
                                    Upcoming — not available for purchase yet
                                </p>
                            )}
                            <AnimatePresence mode="wait">
                                {!isUpcoming && cartQuantity === 0 && !added ? (
                                    <motion.button
                                        key="add"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        type="button"
                                        onClick={handleAddToCart}
                                        className="flex w-full items-center justify-center gap-3 rounded-2xl bg-[#D4AF37] py-4 font-['Inter'] text-[14px] font-bold uppercase tracking-[0.12em] text-[#0B0B0B] shadow-[0_0_30px_rgba(212,175,55,0.25)] transition-all duration-300 hover:bg-[#e5c952] hover:shadow-[0_0_40px_rgba(212,175,55,0.4)]"
                                    >
                                        <ShoppingCart className="h-5 w-5" />
                                        Add to Cart
                                    </motion.button>
                                ) : !isUpcoming ? (
                                    <motion.div
                                        key="qty"
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0 }}
                                        className="flex items-center justify-between gap-4"
                                    >
                                        {/* Qty stepper — writes directly to cart */}
                                        <div className="flex flex-1 items-center justify-between rounded-xl border border-[#D4AF37]/40 bg-[#111]/80 px-5 py-3">
                                            <button
                                                type="button"
                                                onClick={handleStepDec}
                                                className="flex h-8 w-8 items-center justify-center rounded-full border border-white/10 text-[#D4AF37] transition hover:bg-[#D4AF37]/10"
                                            >
                                                <Minus className="h-4 w-4" />
                                            </button>
                                            <span className="font-['Gloock'] text-2xl text-[#F5F5DC]">
                                                {shownQty}
                                            </span>
                                            <button
                                                type="button"
                                                onClick={handleStepInc}
                                                className="flex h-8 w-8 items-center justify-center rounded-full border border-white/10 text-[#D4AF37] transition hover:bg-[#D4AF37]/10"
                                            >
                                                <Plus className="h-4 w-4" />
                                            </button>
                                        </div>
                                        {cartQuantity > 0 ? (
                                            <Link
                                                to="/cart"
                                                className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-[#D4AF37] py-4 font-['Inter'] text-[13px] font-bold uppercase tracking-[0.1em] text-[#0B0B0B] shadow-[0_0_24px_rgba(212,175,55,0.3)] transition hover:bg-[#e5c952]"
                                            >
                                                <ShoppingCart className="h-4 w-4" />
                                                View cart
                                            </Link>
                                        ) : (
                                            <button
                                                type="button"
                                                onClick={handleAddToCart}
                                                className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-[#D4AF37] py-4 font-['Inter'] text-[13px] font-bold uppercase tracking-[0.1em] text-[#0B0B0B] shadow-[0_0_24px_rgba(212,175,55,0.3)] transition hover:bg-[#e5c952]"
                                            >
                                                <ShoppingCart className="h-4 w-4" />
                                                {added ? '✓ Added!' : 'Update Cart'}
                                            </button>
                                        )}
                                    </motion.div>
                                ) : null}
                            </AnimatePresence>
                        </div>

                        {/* ── CREAM Details Card – Key Benefits ── */}
                        <div
                            className="rounded-[20px] p-7"
                            style={{
                                background: 'linear-gradient(145deg, rgba(242,235,218,0.97) 0%, rgba(226,214,182,0.99) 100%)',
                                boxShadow: '0 20px 56px rgba(0,0,0,0.28), inset 0 1px 0 rgba(255,255,255,0.6)',
                                border: '1px solid rgba(180,155,80,0.35)',
                            }}
                        >
                            <h2 className="mb-3 font-['Gloock'] text-[22px] font-bold tracking-wide text-[#141210]">
                                Key Benefits
                            </h2>
                            {benefitsIntro && (
                                <p className="mb-5 font-['Inter'] text-[13px] font-light leading-relaxed text-[#1a1608]/60">
                                    {benefitsIntro}
                                </p>
                            )}
                            <ul className="grid grid-cols-1 gap-3">
                                {benefits.map((benefit, i) => (
                                    <li key={i} className="flex items-center gap-3">
                                        <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-black/10">
                                            <Check className="h-3 w-3 text-black" />
                                        </span>
                                        <span className="font-['Inter'] text-[14px] font-medium text-[#1a1608]/80">
                                            {benefit}
                                        </span>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* ── Premium ingredients (tags) — hidden if no lines in admin and no legacy fallback ── */}
                        {ingredientsTags.length > 0 && (
                            <div
                                className="rounded-[20px] p-7"
                                style={{
                                    background: 'linear-gradient(145deg, rgba(242,235,218,0.97) 0%, rgba(226,214,182,0.99) 100%)',
                                    boxShadow: '0 20px 56px rgba(0,0,0,0.28), inset 0 1px 0 rgba(255,255,255,0.6)',
                                    border: '1px solid rgba(180,155,80,0.35)',
                                }}
                            >
                                <div className="mb-5 flex items-center gap-3">
                                    <Leaf className="h-5 w-5 text-[#8a6200]" aria-hidden />
                                    <h2 className="font-['Gloock'] text-[22px] font-bold tracking-wide text-[#141210]">
                                        Premium Ingredients
                                    </h2>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    {ingredientsTags.map((ingredient, i) => (
                                        <span
                                            key={`${ingredient}-${i}`}
                                            className="rounded-full border border-[#b89a40]/40 bg-[#b89a40]/10 px-4 py-1.5 font-['Inter'] text-[13px] font-medium text-[#5a3e00]"
                                        >
                                            {ingredient}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* ── Clinical note (only when enabled in admin + text) ── */}
                        {clinicalBody && (
                            <div className="rounded-[20px] border-l-4 border-[#D4AF37] bg-gradient-to-r from-[#D4AF37]/10 to-transparent p-7">
                                <h2 className="mb-3 font-['Gloock'] text-[18px] tracking-wide text-[#D4AF37]">
                                    Clinical Note
                                </h2>
                                <p className="font-['Inter'] text-[14px] font-light leading-relaxed text-[#F5F5DC]/70">
                                    {clinicalBody}
                                </p>
                            </div>
                        )}
                    </motion.div>
                </div>
            </section>

            {/* ── More Formulations – Grid ── */}
            {moreProducts.length > 0 && (
                <section className="mt-8 border-t border-white/[0.05] py-20">
                    <div className="max-w-[1320px] mx-auto px-6">
                        <div className="mb-10">
                            <h2 className="font-['Gloock'] text-[2.4rem] text-[#F5F5DC] tracking-wide">
                                Explore More{' '}
                                <span className="animate-shine bg-gradient-to-r from-[#C6A85B] via-[#E5D08A] to-[#C6A85B] bg-clip-text italic text-transparent">
                                    Formulations
                                </span>
                            </h2>
                        </div>

                        {/* Square card grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {moreProducts.map((p, i) => (
                                <MoreProductCard key={p.id} p={p} index={i} />
                            ))}
                        </div>
                    </div>
                </section>
            )}

            <style>{`
                @keyframes shine {
                    0% { background-position: 200% center; }
                    100% { background-position: -200% center; }
                }
                .animate-shine {
                    background-size: 200% auto;
                    animation: shine 3s linear infinite;
                }
                .scrollbar-hide::-webkit-scrollbar { display: none; }
            `}</style>
        </div>
    );
}
