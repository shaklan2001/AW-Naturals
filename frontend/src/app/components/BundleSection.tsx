import { useCallback, useRef, useState } from 'react';
import { motion } from 'motion/react';
import { Star, ShoppingCart, Check, Loader2 } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useStorefrontProducts } from '../hooks/use-storefront-queries';
import type { StorefrontProduct } from '../api/public-api';
import { toCartProduct } from '../pages/products/components/productListUtils';

function resolveBundleProducts(
    catalog: StorefrontProduct[],
    names: readonly string[]
): { products: StorefrontProduct[]; missing: string[] } {
    const active = catalog.filter((p) => p.status !== 'upcoming');
    const products: StorefrontProduct[] = [];
    const missing: string[] = [];
    for (const name of names) {
        const n = name.trim().toLowerCase();
        const exact = active.find((p) => p.name.trim().toLowerCase() === n);
        const fuzzy = exact ?? active.find((p) => p.name.toLowerCase().includes(n));
        if (fuzzy) products.push(fuzzy);
        else missing.push(name);
    }
    return { products, missing };
}

// Gradient Text Component for gold shimmer effect
function GradientText({ children }: { children: string }) {
  return (
    <span className="relative inline-block">
      <span className="relative bg-gradient-to-r from-[#C6A85B] via-[#E5D08A] to-[#C6A85B] bg-[length:200%_100%] bg-clip-text text-transparent animate-shine italic">
        {children}
      </span>
      <style>{`
        @keyframes shine {
          0% { background-position: 200% center; }
          100% { background-position: -200% center; }
        }
        .animate-shine {
          animation: shine 3s linear infinite;
        }
      `}</style>
    </span>
  );
}

const BUNDLES = [
    {
        key: 'day-night',
        name: 'Day-to-Night Ritual',
        products: 'Marigold Premium + Chamomile Bliss',
        description:
            'Complete 24-hour wellness support bridging morning vitality with evening restorative calm.',
        price: '₹2,380',
        popular: false,
        productNames: ['Marigold Premium', 'Chamomile Bliss'] as const,
    },
    {
        key: 'mind-body',
        name: 'Mind & Body Balance',
        products: 'Marigold Premium + Ginger & Berberis',
        description: 'Morning vitality meets metabolic support for balanced daytime energy.',
        price: '₹2,480',
        popular: true,
        productNames: ['Marigold Premium', 'Ginger & Berberis'] as const,
    },
    {
        key: 'total',
        name: 'Total Transformation',
        products: 'All 3 Clinical Premium Blends',
        description: 'The complete Ayurvedic protocol orchestrated for total foundational rejuvenation.',
        price: '₹4,150',
        popular: false,
        savings: 'Save ₹680',
        productNames: ['Marigold Premium', 'Chamomile Bliss', 'Ginger & Berberis'] as const,
    },
] as const;

export function BundleSection() {
    const { addToCart } = useCart();
    const { data: catalog = [], isPending: catalogPending, isError: catalogError } = useStorefrontProducts();
    const [addedKey, setAddedKey] = useState<string | null>(null);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const addedTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const handleSelectProtocol = useCallback(
        (bundleKey: string, productNames: readonly string[]) => {
            setErrorMessage(null);
            if (catalogPending || catalog.length === 0) return;

            const { products, missing } = resolveBundleProducts(catalog, productNames);
            if (missing.length > 0) {
                setErrorMessage(
                    `Some items are not in the shop right now (${missing.join(', ')}). Try again after catalog updates.`
                );
                return;
            }

            for (const p of products) {
                addToCart(toCartProduct(p));
            }

            if (addedTimeoutRef.current) clearTimeout(addedTimeoutRef.current);
            setAddedKey(bundleKey);
            addedTimeoutRef.current = setTimeout(() => {
                setAddedKey(null);
                addedTimeoutRef.current = null;
            }, 2800);
        },
        [addToCart, catalog, catalogPending]
    );

  return (
    <section className="py-24 bg-[#0B0B0B] relative overflow-hidden">
      {/* Background Ambient Glow */}
      <div className="absolute top-0 right-1/4 w-[800px] h-[800px] bg-[#D4AF37]/5 rounded-full blur-[150px] pointer-events-none" />

      <div className="max-w-[1400px] w-full mx-auto px-6 sm:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-center mb-20"
        >
          {/* Small Label */}
          <div className="mb-6 inline-flex px-4 py-1.5 rounded-full border border-[#C6A85B]/30 bg-[#151515] backdrop-blur-md">
            <span className="font-['Inter'] text-[10px] sm:text-[11px] font-medium tracking-[0.2em] uppercase text-[#C6A85B]">
              Clinical Regimens
            </span>
          </div>

          <h2 className="font-['Gloock'] text-[48px] md:text-[56px] lg:text-[64px] mb-6 text-[#F5F5DC] tracking-tight leading-none" style={{ fontWeight: 400 }}>
            Premium <GradientText>Bundles</GradientText>
          </h2>
          <p className="font-['Inter'] text-[16px] md:text-[18px] text-[#F5F5DC]/60 font-light max-w-2xl mx-auto">
            Curated clinical combinations for comprehensive wellness and superior value.
          </p>
        </motion.div>

        {errorMessage ? (
          <p
            role="alert"
            className="mx-auto mb-10 max-w-2xl rounded-2xl border border-red-500/30 bg-red-950/40 px-4 py-3 text-center font-['Inter'] text-sm text-red-200/95"
          >
            {errorMessage}
          </p>
        ) : null}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center lg:px-12">
          {BUNDLES.map((bundle, index) => {
            const isPop = bundle.popular;
            const justAdded = addedKey === bundle.key;
            const addDisabled = catalogPending || catalogError || justAdded;
            return (
            <motion.div
              key={bundle.key}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1, ease: "easeOut" }}
              className={`h-full ${isPop ? 'md:-translate-y-4 z-20' : 'z-10'}`}
            >
              <div 
                className="relative h-full flex flex-col p-8 sm:p-10 transition-all duration-500 rounded-[28px] overflow-hidden group"
                style={{
                  background: isPop 
                    ? 'linear-gradient(135deg, #EFE8D6 0%, #E4D6B4 100%)'
                    : 'linear-gradient(135deg, #EBE3CE 0%, #DDD0AE 100%)',
                  borderWidth: '1px',
                  borderStyle: 'solid',
                  borderColor: isPop ? '#F8F4EC' : '#E8E1CD',
                  boxShadow: isPop 
                    ? '0 30px 60px rgba(0,0,0,0.5), inset 0 2px 5px rgba(255,255,255,0.8)'
                    : '0 20px 40px rgba(0,0,0,0.3), inset 0 2px 5px rgba(255,255,255,0.6)',
                }}
              >
                {/* Embedded Noise Vector to make it look like thick paper packaging */}
                <div 
                  className="absolute inset-0 pointer-events-none opacity-[0.25] mix-blend-multiply"
                  style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.08'/%3E%3C/svg%3E")` }}
                />

                {/* Premium Tags */}
                <div className="absolute top-0 left-0 right-0 flex justify-center pointer-events-none z-20">
                  {isPop && (
                    <div className="bg-[#0B0B0B] text-[#C6A85B] px-8 py-1.5 rounded-b-xl font-['Inter'] flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest shadow-[0_4px_15px_rgba(0,0,0,0.2)]">
                      <Star className="w-3 h-3 fill-[#C6A85B]" />
                      Most Popular
                    </div>
                  )}
                  {bundle.savings && (
                    <div className="absolute top-0 right-0 bg-[#0F3D2E] text-[#E4D6B4] px-5 py-2 rounded-bl-2xl font-['Inter'] text-[11px] font-medium tracking-wide border-l border-b border-[#0F3D2E]">
                      {bundle.savings}
                    </div>
                  )}
                </div>

                <div className="pt-8 flex-grow flex flex-col relative z-10 text-[#0B0B0B]">
                  <h3 className="font-['Gloock'] text-[32px] mb-3 text-[#1A1A1A]">
                    {bundle.name}
                  </h3>
                  <p className="font-['Inter'] text-[12px] mb-5 uppercase tracking-[0.15em] font-bold text-[#8B6B22]">
                    {bundle.products}
                  </p>
                  <p className="font-['Inter'] text-[15px] mb-8 font-medium flex-grow text-[#333333] leading-relaxed">
                    {bundle.description}
                  </p>
                  
                  <div className="border-t border-[#0B0B0B]/10 pt-6 mb-8 flex items-end justify-between">
                    <div>
                      <div className="font-['Playfair_Display'] text-[40px] font-bold tracking-tight text-[#0B0B0B] leading-none mb-1">
                        {bundle.price}
                      </div>
                      <div className="font-['Inter'] text-[12px] font-medium text-[#444] tracking-wider uppercase">
                        One-time purchase
                      </div>
                    </div>
                  </div>
                  
                  {/* Standardized Protocol CTA — adds bundle teas to cart */}
                  <button
                    type="button"
                    disabled={addDisabled}
                    aria-busy={catalogPending}
                    onClick={() => handleSelectProtocol(bundle.key, bundle.productNames)}
                    className="group relative w-full overflow-hidden rounded-full bg-[#0B0B0B] py-4 font-['Inter'] text-[14px] tracking-[0.05em] text-[#D4AF37] shadow-[0_10px_30px_rgba(0,0,0,0.5)] transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_15px_40px_rgba(0,0,0,0.6)] disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:scale-100"
                    style={{ fontWeight: 600 }}
                  >
                    <div className="pointer-events-none absolute inset-0 z-0 bg-[#161616] opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-disabled:opacity-0" />

                    <span className="relative z-10 flex items-center justify-center gap-3">
                      {catalogPending ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
                          Loading…
                        </>
                      ) : justAdded ? (
                        <>
                          <Check className="h-4 w-4 text-[#2ecc71]" strokeWidth={2.5} aria-hidden />
                          Added to cart
                        </>
                      ) : (
                        <>
                          Select Protocol
                          <ShoppingCart className="h-4 w-4 transition-transform group-hover:translate-x-0.5" aria-hidden />
                        </>
                      )}
                    </span>
                  </button>
                </div>
              </div>
            </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}