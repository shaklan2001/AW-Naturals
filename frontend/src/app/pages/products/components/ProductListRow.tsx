import { motion, AnimatePresence } from 'motion/react';
import { Link } from 'react-router';
import { ShoppingCart, ArrowRight, Plus, Minus } from 'lucide-react';
import { ImageWithFallback } from '@/shared/components/ImageWithFallback';
import type { StorefrontProduct } from '../../../api/public-api';

export interface ProductListRowProps {
    product: StorefrontProduct;
    index: number;
    quantityInCart: number;
    onAddToCart: (product: StorefrontProduct) => void;
    onDecrease: (productId: string) => void;
}

export function ProductListRow({ product, index, quantityInCart, onAddToCart, onDecrease }: ProductListRowProps) {
    const qty = quantityInCart;
    const isUpcoming = product.status === 'upcoming';

    const handleAdd = () => {
        if (isUpcoming) return;
        onAddToCart(product);
    };

    const handleIncrease = () => {
        if (isUpcoming) return;
        onAddToCart(product);
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
            className="group relative flex flex-col md:flex-row rounded-[32px] overflow-hidden transition-all duration-500 shadow-[0_15px_40px_rgba(0,0,0,0.4)]"
            style={{
                background: 'linear-gradient(135deg, #EBE3CE 0%, #DDD0AE 100%)',
                border: '1px solid #E8E1CD',
            }}
        >
            <Link
                to={`/products/${product.id}`}
                className="relative w-[calc(100%-2rem)] md:w-1/2 aspect-square md:aspect-auto min-h-[220px] md:min-h-[300px] overflow-hidden z-10 mx-4 mt-4 mb-0 md:m-4 rounded-3xl bg-white flex-shrink-0 shadow-inner"
            >
                <ImageWithFallback
                    src={product.image}
                    alt={product.name}
                    className="absolute inset-0 w-full h-full object-cover"
                />
            </Link>

            <div className="w-full md:w-1/2 p-6 sm:p-8 md:p-10 flex flex-col justify-center relative z-10 text-[#0B0B0B]">
                <div className="mb-2 flex flex-wrap items-center gap-2">
                    {(product.benefit || product.category) && (
                    <span className="text-[10px] font-['Inter'] text-[#8B6B22] uppercase tracking-[0.2em] font-bold">
                        {product.benefit || product.category}
                    </span>
                    )}
                    {isUpcoming && (
                        <span className="rounded-full border border-[#8B6B22]/40 bg-[#8B6B22]/15 px-2.5 py-0.5 font-['Inter'] text-[9px] font-bold uppercase tracking-[0.15em] text-[#5a3e00]">
                            Upcoming
                        </span>
                    )}
                </div>

                <Link to={`/products/${product.id}`}>
                    <h3 className="font-['Cormorant_Garamond',serif] font-semibold text-[24px] mb-3 text-[#1A1A1A] hover:text-[#8B6B22] transition-colors duration-300">
                        {product.name}
                    </h3>
                </Link>

                <p className="font-['Inter'] text-[15px] sm:text-[16px] text-[#333333] mb-6 md:mb-8 font-medium leading-relaxed opacity-80 flex-grow">
                    {product.shortDescription ?? product.description}
                </p>

                <div className="flex items-end justify-between mb-6 pb-6 md:mb-8 md:pb-8 border-b border-black/10">
                    <div>
                        <div className="font-['Inter'] text-[36px] sm:text-[40px] font-bold tabular-nums tracking-tight text-[#0B0B0B] leading-none">
                            ₹{product.price}
                        </div>
                    </div>
                    <Link
                        to={`/products/${product.id}`}
                        className="p-4 bg-white/40 backdrop-blur-md rounded-full shadow-sm hover:bg-white/80 transition-colors"
                    >
                        <ArrowRight className="w-6 h-6 text-[#0B0B0B]" />
                    </Link>
                </div>

                {/* Add to Cart / Qty Stepper */}
                <AnimatePresence mode="wait">
                    {isUpcoming ? (
                        <div className="w-full rounded-full border border-[#8B6B22]/35 bg-[#f5f0e6]/90 py-4 text-center font-['Inter'] text-[12px] font-bold uppercase tracking-[0.12em] text-[#5a3e00]">
                            Coming soon — not for sale yet
                        </div>
                    ) : qty === 0 ? (
                        <motion.button
                            key="add-btn"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            transition={{ duration: 0.2 }}
                            type="button"
                            onClick={handleAdd}
                            className="w-full py-4 bg-[#0B0B0B] text-[#D4AF37] rounded-full font-['Inter'] text-[13px] uppercase tracking-widest font-bold hover:scale-[1.03] transition-all shadow-[0_10px_20px_rgba(0,0,0,0.3)] flex items-center justify-center gap-3 active:scale-95"
                        >
                            <ShoppingCart className="w-4 h-4" />
                            Add to Cart
                        </motion.button>
                    ) : (
                        <motion.div
                            key="stepper"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            transition={{ duration: 0.2 }}
                            className="flex items-center rounded-full bg-[#0B0B0B] overflow-hidden shadow-[0_10px_20px_rgba(0,0,0,0.3)]"
                        >
                            <button
                                type="button"
                                onClick={() => onDecrease(product.id)}
                                className="flex items-center justify-center w-14 h-14 text-[#D4AF37] hover:bg-white/10 transition-colors flex-shrink-0"
                            >
                                <Minus className="w-4 h-4" />
                            </button>
                            <span className="flex-1 text-center font-['Cormorant_Garamond',serif] font-semibold text-[20px] text-white leading-none">
                                {qty}
                            </span>
                            <button
                                type="button"
                                onClick={handleIncrease}
                                className="flex items-center justify-center w-14 h-14 text-[#D4AF37] hover:bg-white/10 transition-colors flex-shrink-0"
                            >
                                <Plus className="w-4 h-4" />
                            </button>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </motion.div>
    );
}
