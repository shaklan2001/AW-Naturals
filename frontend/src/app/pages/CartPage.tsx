import { motion } from 'motion/react';
import { Link } from 'react-router';
import { Trash2, Plus, Minus, ShoppingCart, ArrowLeft } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { ImageWithFallback } from '@/shared/components/ImageWithFallback';

export function CartPage() {
  const { items, removeFromCart, updateQuantity, totalPrice } = useCart();

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-[#0B0B0B] pt-24 flex items-center justify-center px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-md"
        >
          <div
            className="mx-auto mb-8 flex h-[120px] w-[120px] items-center justify-center rounded-2xl border border-[#D4AF37]/35 bg-[#F5F5DC]/[0.07] shadow-[0_0_0_1px_rgba(212,175,55,0.12),0_20px_48px_-12px_rgba(0,0,0,0.5),inset_0_1px_0_rgba(255,255,255,0.08)] backdrop-blur-sm sm:h-[132px] sm:w-[132px]"
            aria-hidden
          >
            <ShoppingCart
              className="h-[52px] w-[52px] text-[#D4AF37] sm:h-14 sm:w-14"
              strokeWidth={1.35}
              aria-hidden
            />
          </div>
          <h1 className="font-['Cormorant_Garamond',serif] font-semibold text-4xl md:text-5xl mb-4 text-[#F5F5DC]">
            Your Cart is Empty
          </h1>
          <p className="font-['Inter'] text-[#F5F5DC]/70 mb-8 font-light">
            Discover our premium collection of doctor-formulated herbal infusions
          </p>
          <Link
            to="/products"
            className="inline-flex items-center gap-2 px-8 py-4 bg-[#D4AF37] text-[#0B0B0B] rounded-xl font-['Inter'] font-semibold uppercase tracking-widest text-sm hover:bg-[#D4AF37]/90 transition-all duration-300 hover:shadow-[0_0_30px_rgba(212,175,55,0.5)]"
          >
            Shop Products
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="pt-24 min-h-screen">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="mb-8">
          <Link
            to="/products"
            className="inline-flex items-center gap-2 font-['Inter'] text-[13px] font-medium uppercase tracking-[0.1em] text-[#D4AF37]/70 transition-all hover:text-[#D4AF37] hover:gap-3 mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            Continue Shopping
          </Link>
          <h1 className="font-['Cormorant_Garamond',serif] font-semibold text-[clamp(2.5rem,6vw,4rem)] text-[#F5F5DC] tracking-wide">
            Shopping Cart
          </h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -100 }}
                className="rounded-2xl p-4 sm:p-6 transition-all duration-500"
                style={{
                  background: 'linear-gradient(145deg, rgba(242,235,218,0.97) 0%, rgba(226,214,182,0.99) 100%)',
                  boxShadow: '0 8px 28px rgba(0,0,0,0.28), inset 0 1px 0 rgba(255,255,255,0.65)',
                  border: '1px solid rgba(180,155,80,0.35)',
                }}
              >
                <div className="flex gap-4 sm:gap-6">
                  <div className="w-24 h-24 sm:w-28 sm:h-28 flex-shrink-0 rounded-xl overflow-hidden border border-[rgba(184,134,11,0.30)]">
                    <ImageWithFallback
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="flex-1">
                    <div className="flex justify-between items-start mb-1">
                      <div>
                        <span className="font-['Inter'] text-[10px] font-bold uppercase tracking-[0.2em] text-[#7a5c00]">
                          {item.benefit}
                        </span>
                        <h3 className="font-['Cormorant_Garamond',serif] font-semibold text-[1.25rem] sm:text-[1.5rem] text-[#141210] mt-0.5 leading-tight">
                          {item.name}
                        </h3>
                      </div>
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="text-[#141210]/30 hover:text-red-600 transition-colors duration-300 ml-3 mt-1"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <p className="font-['Inter'] text-[12px] sm:text-[13px] font-light text-[#141210]/50 mb-3 sm:mb-4 leading-relaxed">
                      {item.description}
                    </p>

                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mt-3">
                      {/* Stepper & Unit Price Container */}
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-3 rounded-lg px-3 py-1.5 border border-[rgba(184,134,11,0.25)] bg-white/40">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="text-[#8a6200] hover:bg-[rgba(184,134,11,0.15)] rounded p-0.5 transition-colors duration-200"
                            aria-label="Decrease quantity"
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                          <span className="font-['Cormorant_Garamond',serif] font-semibold text-[1rem] text-[#141210] w-6 text-center leading-none">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="text-[#8a6200] hover:bg-[rgba(184,134,11,0.15)] rounded p-0.5 transition-colors duration-200"
                            aria-label="Increase quantity"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        <span className="font-['Inter'] text-[12px] font-light text-[#141210]/50">
                          ₹{item.price} each
                        </span>
                      </div>

                      {/* Total Item Price Container */}
                      <div className="flex flex-row sm:flex-col justify-between sm:justify-center items-center sm:items-end w-full sm:w-auto border-t sm:border-t-0 border-[rgba(184,134,11,0.15)] pt-3 sm:pt-0">
                        <span className="font-['Inter'] text-[12px] font-medium text-[#141210]/60 sm:hidden">
                          Total
                        </span>
                        <div className="flex flex-col items-end">
                          <span className="font-['Cormorant_Garamond',serif] font-semibold text-[1.5rem] sm:text-[1.8rem] text-[#8a6200] leading-none">
                            ₹{(item.price * item.quantity).toFixed(0)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div
              className="rounded-2xl p-8 sticky top-24"
              style={{
                background: 'linear-gradient(145deg, rgba(242,235,218,0.97) 0%, rgba(226,214,182,0.99) 100%)',
                boxShadow: '0 8px 28px rgba(0,0,0,0.28), inset 0 1px 0 rgba(255,255,255,0.65)',
                border: '1px solid rgba(180,155,80,0.35)',
              }}
            >
              <h2 className="font-['Cormorant_Garamond',serif] font-semibold text-[1.8rem] mb-6 text-[#141210] tracking-wide">
                Order Summary
              </h2>

              <div className="space-y-4 mb-6">
                <div className="flex justify-between font-['Inter'] text-[14px]">
                  <span className="text-[#141210]/60">Subtotal</span>
                  <span className="font-medium text-[#141210]">₹{totalPrice.toFixed(0)}</span>
                </div>
                <div className="flex justify-between font-['Inter'] text-[14px]">
                  <span className="text-[#141210]/60">Shipping</span>
                  <span className="font-semibold text-[#8a6200]">Free</span>
                </div>
                <div className="border-t border-[rgba(180,155,80,0.35)] pt-4">
                  <div className="flex justify-between items-baseline">
                    <span className="font-['Cormorant_Garamond',serif] font-semibold text-[1.3rem] text-[#141210]">Total</span>
                    <span className="font-['Cormorant_Garamond',serif] font-semibold text-[1.8rem] text-[#8a6200]">₹{totalPrice.toFixed(0)}</span>
                  </div>
                </div>
              </div>

              <Link to="/checkout" className="block w-full">
                <button
                  className="w-full py-4 rounded-xl font-['Inter'] text-[13px] font-bold uppercase tracking-widest text-[#0B0B0B] transition-all duration-300 mb-4 hover:shadow-[0_6px_24px_rgba(212,175,55,0.4)] hover:scale-[1.01] active:scale-[0.99]"
                  style={{ background: 'linear-gradient(135deg, #d4af37 0%, #c5a028 50%, #b8941f 100%)' }}
                >
                  Proceed to Checkout
                </button>
              </Link>

              <p className="font-['Inter'] text-[12px] font-light text-[#141210]/45 text-center">
                Free shipping on orders over ₹2500
              </p>

              <div className="mt-6 pt-6 border-t border-[rgba(180,155,80,0.35)]">
                <h3 className="font-['Cormorant_Garamond',serif] font-semibold text-[1.1rem] mb-3 text-[#141210]">
                  Order Includes:
                </h3>
                <ul className="space-y-2 font-['Inter'] text-[13px] font-light">
                  {['30-day money-back guarantee', 'Expert wellness support', 'Brewing guide & tips'].map((item) => (
                    <li key={item} className="flex items-center gap-2 text-[#141210]/60">
                      <div className="w-1.5 h-1.5 rounded-full bg-[#D4AF37] flex-shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}