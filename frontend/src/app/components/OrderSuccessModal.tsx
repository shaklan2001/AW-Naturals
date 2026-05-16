import { useEffect, useId, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'motion/react';
import Lottie from 'lottie-react';
import { Button } from './ui/button';
import { CheckCircle2 } from 'lucide-react';

export interface OrderSuccessModalProps {
  open: boolean;
  orderId: string | null;
  onContinue: () => void;
}

export function OrderSuccessModal({ open, orderId, onContinue }: OrderSuccessModalProps) {
  const titleId = useId();
  const lottieRef = useRef<any>(null);
  const [animationData, setAnimationData] = useState<unknown | null>(null);
  const [lottieFailed, setLottieFailed] = useState(false);
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    if (!open) return;
    let cancelled = false;
    if (animationData !== null || lottieFailed) return;
    fetch('/lottie/order-success.json')
      .then((r) => {
        if (!r.ok) throw new Error('Failed to load animation');
        return r.json();
      })
      .then((d) => {
        if (!cancelled) setAnimationData(d);
      })
      .catch(() => {
        if (!cancelled) setLottieFailed(true);
      });
    return () => {
      cancelled = true;
    };
  }, [open, animationData, lottieFailed]);

  useEffect(() => {
    if (!open) {
      setShowContent(false);
      return;
    }
    // Let the "cart -> tick" sequence lead, then reveal the copy.
    const timer = window.setTimeout(() => setShowContent(true), 1150);
    return () => window.clearTimeout(timer);
  }, [open, orderId]);

  useEffect(() => {
    if (!open || !lottieRef.current) return;
    lottieRef.current.setSpeed?.(1.45);
  }, [open, animationData]);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  if (typeof document === 'undefined') return null;

  const modal = (
    <AnimatePresence>
      {open && (
        <motion.div
          key="order-success-overlay"
          role="presentation"
          className="fixed inset-0 z-[220] flex items-center justify-center p-4 sm:p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.22 }}
        >
          <div
            className="absolute inset-0 bg-gradient-to-br from-sky-400/20 via-cyan-900/25 to-emerald-950/35 backdrop-blur-[10px] backdrop-saturate-[1.35] sm:backdrop-blur-[14px]"
            aria-hidden
          />
          <div
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_90%_55%_at_50%_-10%,rgba(186,230,253,0.35),transparent_52%)]"
            aria-hidden
          />
          <div
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_70%_50%_at_80%_100%,rgba(52,211,153,0.12),transparent_45%)]"
            aria-hidden
          />

          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            className="relative w-full max-w-[440px] overflow-hidden rounded-[28px] border border-[#e8dcc8] bg-[#FAF5EB] px-8 pb-9 pt-10 text-center text-[#2a2620] shadow-[0_28px_70px_-12px_rgba(0,0,0,0.45),0_0_0_1px_rgba(212,175,55,0.22),inset_0_1px_0_rgba(255,255,255,0.75)] sm:px-10 sm:pb-10 sm:pt-11"
            initial={{ opacity: 0, y: 20, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.98 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          >
            <div
              className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#D4AF37]/50 to-transparent"
              aria-hidden
            />

            <div className="mx-auto flex h-[120px] w-[120px] items-center justify-center sm:h-[132px] sm:w-[132px]">
              {animationData && !lottieFailed ? (
                <Lottie
                  key={orderId ?? 'success'}
                  lottieRef={lottieRef}
                  animationData={animationData}
                  loop={false}
                  className="h-full w-full"
                  aria-hidden
                />
              ) : lottieFailed ? (
                <div className="flex h-[88px] w-[88px] items-center justify-center rounded-full bg-[#D4AF37]/15 ring-2 ring-[#D4AF37]/35">
                  <CheckCircle2 className="h-12 w-12 text-[#9a7320]" aria-hidden />
                </div>
              ) : (
                <div
                  className="h-16 w-16 animate-pulse rounded-full bg-[#D4AF37]/15 ring-2 ring-[#D4AF37]/20"
                  aria-hidden
                />
              )}
            </div>

            <AnimatePresence mode="wait">
              {showContent ? (
                <motion.div
                  key="content"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.28 }}
                >
                  <p className="mt-2 font-['Inter'] text-[10px] font-semibold uppercase tracking-[0.34em] text-[#9a7320]">
                    Thank you
                  </p>
                  <h2
                    id={titleId}
                    className="mt-2 font-['Gloock'] text-[2rem] tracking-tight text-[#1f1c18] sm:text-[2.25rem]"
                    style={{ fontWeight: 400 }}
                  >
                    Order confirmed
                  </h2>

                  {orderId ? (
                    <p className="mt-3 font-['Inter'] text-sm font-medium text-[#6b5b38]">Order #{orderId}</p>
                  ) : null}

                  <p className="mx-auto mt-4 max-w-sm font-['Inter'] text-[15px] font-light leading-relaxed text-[#5c554c]">
                    We&apos;ll email you shipping updates shortly. You can keep exploring the collection from home.
                  </p>

                  <Button
                    type="button"
                    onClick={onContinue}
                    size="lg"
                    className="mt-8 h-12 w-full rounded-full bg-[#D4AF37] font-semibold text-[#1a1815] shadow-[0_4px_14px_rgba(212,175,55,0.35)] transition-all hover:bg-[#c9a42f]"
                  >
                    Continue shopping
                  </Button>
                </motion.div>
              ) : (
                <motion.div
                  key="waiting"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="mt-4 h-[164px]"
                  aria-hidden
                />
              )}
            </AnimatePresence>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  return createPortal(modal, document.body);
}
