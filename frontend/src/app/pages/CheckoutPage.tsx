import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { Link, useNavigate } from 'react-router';
import { ArrowLeft, ShieldCheck } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useCustomerAuth } from '../context/CustomerAuthContext';
import { SectionWrapper } from '../components/SectionWrapper';
import { GlassCard } from '@/shared/components/GlassCard';
import { Button } from '../components/ui/button';
import { ImageWithFallback } from '@/shared/components/ImageWithFallback';
import { OrderSuccessModal } from '../components/OrderSuccessModal';
import {
  createRazorpayCheckoutOrder,
  verifyRazorpayPayment,
  type RazorpayCheckoutPayload,
} from '../api/public-api';
import { loadRazorpayScript, openRazorpayCheckout } from '../lib/razorpayCheckout';

const inrFormatter = new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  maximumFractionDigits: 0,
});

function formatInr(amount: number): string {
  return inrFormatter.format(amount);
}

export function CheckoutPage() {
  const navigate = useNavigate();
  const { items, totalPrice, clearCart } = useCart();
  const { isAuthenticated, customerDetails, updateCustomerDetails } = useCustomerAuth();
  const [successOrderId, setSuccessOrderId] = useState<string | null>(null);
  const [form, setForm] = useState({
    email: '',
    firstName: '',
    lastName: '',
    phone: '',
    address: '',
    city: '',
    pincode: '',
  });

  useEffect(() => {
    if (!isAuthenticated) return;
    setForm((prev) => ({
      ...prev,
      ...customerDetails,
    }));
  }, [isAuthenticated, customerDetails]);

  const [isCreatingRazorpayOrder, setIsCreatingRazorpayOrder] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [paymentError, setPaymentError] = useState<string | null>(null);

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    setPaymentError(null);
    setIsCreatingRazorpayOrder(true);

    const payload: RazorpayCheckoutPayload = {
      customerName: `${form.firstName} ${form.lastName}`.trim(),
      email: form.email,
      phone: form.phone,
      address: form.address,
      city: form.city,
      pincode: form.pincode,
      items: items.map((i) => ({ productId: i.id, quantity: i.quantity })),
    };

    try {
      const rz = await createRazorpayCheckoutOrder(payload);
      await loadRazorpayScript();

      openRazorpayCheckout({
        key: rz.keyId,
        order_id: rz.orderId,
        name: 'AW Naturals',
        description: 'Secure order payment',
        theme: { color: '#0B0B0B' },
        prefill: {
          email: form.email,
          contact: form.phone,
          name: `${form.firstName} ${form.lastName}`.trim(),
        },
        modal: {
          ondismiss: () => {
            setIsCreatingRazorpayOrder(false);
          },
        },
        handler: async (response) => {
          setIsCreatingRazorpayOrder(false);
          setIsVerifying(true);
          setPaymentError(null);
          try {
            const data = await verifyRazorpayPayment({
              ...payload,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            });
            setSuccessOrderId(data.id);
            clearCart();
          } catch (err) {
            setPaymentError(err instanceof Error ? err.message : 'Could not confirm your order.');
          } finally {
            setIsVerifying(false);
          }
        },
      });
    } catch (err) {
      setPaymentError(err instanceof Error ? err.message : 'Could not start payment.');
      setIsCreatingRazorpayOrder(false);
    }
  };

  if (items.length === 0 && !successOrderId) {
    return (
      <div className="pt-24 min-h-screen bg-[#0B0B0B] flex items-center justify-center">
        <div className="text-center">
          <h1 className="font-['Playfair_Display'] text-3xl mb-4 text-[#F5F5DC]">Your cart is empty</h1>
          <Link to="/products" className="text-[#D4AF37] hover:underline font-['Inter']">
            Back to Products
          </Link>
        </div>
      </div>
    );
  }

  const isBusy = isCreatingRazorpayOrder || isVerifying;

  return (
    <>
      {items.length > 0 ? (
        <div className="pt-24 min-h-screen bg-[#0B0B0B]">
          <SectionWrapper className="py-12">
            <Link
              to="/cart"
              className="inline-flex items-center gap-2 text-[#D4AF37] hover:gap-3 transition-all duration-300 font-['Inter'] mb-8 font-medium"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Cart
            </Link>

            <h1 className="font-['Playfair_Display'] text-4xl md:text-5xl mb-12 text-[#F5F5DC] tracking-tight">
              Secure <span className="text-[#D4AF37] italic">Checkout</span>
            </h1>

            {paymentError ? (
              <div className="mb-6 rounded-lg border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-200 font-['Inter']">
                {paymentError}
              </div>
            ) : null}

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
              <div className="lg:col-span-7 space-y-8">
                <form onSubmit={handleCheckout} id="checkout-form">
                  <GlassCard className="p-6 sm:p-8 mb-8" hoverEffect={false}>
                    <h2 className="font-['Playfair_Display'] text-2xl mb-6 text-[#0b0b0b]">Contact Information</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="col-span-2">
                        <label className="block text-sm font-['Inter'] text-[rgba(11,11,11,0.65)] mb-2">
                          Email Address
                        </label>
                        <input
                          required
                          type="email"
                          value={form.email}
                          onChange={(e) => {
                            const next = e.target.value;
                            setForm((f) => ({ ...f, email: next }));
                            updateCustomerDetails({ email: next });
                          }}
                          className="w-full bg-[rgba(255,255,255,0.40)] border border-[rgba(184,134,11,0.25)] rounded-lg px-4 py-3 text-[#0b0b0b] focus:outline-none focus:border-[#b8860b] transition-colors font-['Inter']"
                          placeholder="you@example.com"
                        />
                      </div>
                      <div className="col-span-2 md:col-span-1">
                        <label className="block text-sm font-['Inter'] text-[rgba(11,11,11,0.65)] mb-2">
                          First Name
                        </label>
                        <input
                          required
                          type="text"
                          value={form.firstName}
                          onChange={(e) => {
                            const next = e.target.value;
                            setForm((f) => ({ ...f, firstName: next }));
                            updateCustomerDetails({ firstName: next });
                          }}
                          className="w-full bg-[rgba(255,255,255,0.40)] border border-[rgba(184,134,11,0.25)] rounded-lg px-4 py-3 text-[#0b0b0b] focus:outline-none focus:border-[#b8860b] transition-colors font-['Inter']"
                        />
                      </div>
                      <div className="col-span-2 md:col-span-1">
                        <label className="block text-sm font-['Inter'] text-[rgba(11,11,11,0.65)] mb-2">
                          Last Name
                        </label>
                        <input
                          required
                          type="text"
                          value={form.lastName}
                          onChange={(e) => {
                            const next = e.target.value;
                            setForm((f) => ({ ...f, lastName: next }));
                            updateCustomerDetails({ lastName: next });
                          }}
                          className="w-full bg-[rgba(255,255,255,0.40)] border border-[rgba(184,134,11,0.25)] rounded-lg px-4 py-3 text-[#0b0b0b] focus:outline-none focus:border-[#b8860b] transition-colors font-['Inter']"
                        />
                      </div>
                      <div className="col-span-2">
                        <label className="block text-sm font-['Inter'] text-[rgba(11,11,11,0.65)] mb-2">Phone</label>
                        <input
                          required
                          type="tel"
                          minLength={5}
                          value={form.phone}
                          onChange={(e) => {
                            const next = e.target.value;
                            setForm((f) => ({ ...f, phone: next }));
                            updateCustomerDetails({ phone: next });
                          }}
                          className="w-full bg-[rgba(255,255,255,0.40)] border border-[rgba(184,134,11,0.25)] rounded-lg px-4 py-3 text-[#0b0b0b] focus:outline-none focus:border-[#b8860b] transition-colors font-['Inter']"
                          placeholder="+91 …"
                        />
                      </div>
                    </div>
                  </GlassCard>

                  <GlassCard className="p-6 sm:p-8" hoverEffect={false}>
                    <h2 className="font-['Playfair_Display'] text-2xl mb-6 text-[#0b0b0b]">Shipping Address</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="col-span-2">
                        <label className="block text-sm font-['Inter'] text-[rgba(11,11,11,0.65)] mb-2">
                          Street Address
                        </label>
                        <input
                          required
                          type="text"
                          value={form.address}
                          onChange={(e) => {
                            const next = e.target.value;
                            setForm((f) => ({ ...f, address: next }));
                            updateCustomerDetails({ address: next });
                          }}
                          className="w-full bg-[rgba(255,255,255,0.40)] border border-[rgba(184,134,11,0.25)] rounded-lg px-4 py-3 text-[#0b0b0b] focus:outline-none focus:border-[#b8860b] transition-colors font-['Inter']"
                        />
                      </div>
                      <div className="col-span-2 md:col-span-1">
                        <label className="block text-sm font-['Inter'] text-[rgba(11,11,11,0.65)] mb-2">City</label>
                        <input
                          required
                          type="text"
                          value={form.city}
                          onChange={(e) => {
                            const next = e.target.value;
                            setForm((f) => ({ ...f, city: next }));
                            updateCustomerDetails({ city: next });
                          }}
                          className="w-full bg-[rgba(255,255,255,0.40)] border border-[rgba(184,134,11,0.25)] rounded-lg px-4 py-3 text-[#0b0b0b] focus:outline-none focus:border-[#b8860b] transition-colors font-['Inter']"
                        />
                      </div>
                      <div className="col-span-2 md:col-span-1">
                        <label className="block text-sm font-['Inter'] text-[rgba(11,11,11,0.65)] mb-2">
                          Postal Code
                        </label>
                        <input
                          required
                          type="text"
                          minLength={3}
                          value={form.pincode}
                          onChange={(e) => {
                            const next = e.target.value;
                            setForm((f) => ({ ...f, pincode: next }));
                            updateCustomerDetails({ pincode: next });
                          }}
                          className="w-full bg-[rgba(255,255,255,0.40)] border border-[rgba(184,134,11,0.25)] rounded-lg px-4 py-3 text-[#0b0b0b] focus:outline-none focus:border-[#b8860b] transition-colors font-['Inter']"
                        />
                      </div>
                    </div>
                  </GlassCard>
                </form>
              </div>

              <div className="lg:col-span-5">
                <GlassCard className="p-6 sm:p-8 sticky top-28" hoverEffect={false}>
                  <h3 className="font-['Playfair_Display'] text-2xl mb-6 text-[#0b0b0b]">Order Summary</h3>

                  <div className="space-y-4 mb-6 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                    {items.map((item) => (
                      <div key={item.id} className="flex gap-4 items-center">
                        <div className="w-16 h-16 rounded-lg overflow-hidden border border-[rgba(184,134,11,0.25)] flex-shrink-0">
                          <ImageWithFallback src={item.image} alt={item.name} className="w-full h-full object-cover" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-['Inter'] text-[#0b0b0b] text-sm truncate">{item.name}</h4>
                          <p className="font-['Inter'] text-[rgba(11,11,11,0.50)] text-xs">Qty: {item.quantity}</p>
                        </div>
                        <div className="font-['Inter'] text-[#0b0b0b] text-sm whitespace-nowrap">
                          {formatInr(item.price * item.quantity)}
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="border-t border-[rgba(180,155,80,0.35)] pt-6 space-y-4 mb-8">
                    <div className="flex justify-between font-['Inter'] text-sm">
                      <span className="text-[rgba(11,11,11,0.65)]">Subtotal</span>
                      <span className="text-[#0b0b0b]">{formatInr(totalPrice)}</span>
                    </div>
                    <div className="flex justify-between font-['Inter'] text-sm">
                      <span className="text-[rgba(11,11,11,0.65)]">Shipping</span>
                      <span className="text-[#8a6200]">Free</span>
                    </div>
                    <div className="border-t border-[rgba(180,155,80,0.35)] pt-4 flex justify-between items-center">
                      <span className="font-['Playfair_Display'] text-xl text-[#0b0b0b]">Total</span>
                      <span className="font-['Playfair_Display'] text-2xl text-[#b8860b]">{formatInr(totalPrice)}</span>
                    </div>
                  </div>

                  <p className="mb-4 font-['Inter'] text-xs leading-relaxed text-[rgba(11,11,11,0.55)]">
                    Pay securely with Razorpay (UPI, cards, netbanking, wallets). You will complete payment in the
                    Razorpay window — card details are never entered on this site.
                  </p>

                  <Button type="submit" form="checkout-form" variant="primary" size="lg" className="w-full relative" disabled={isBusy}>
                    {isVerifying ? (
                      <span className="flex items-center gap-2">
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                          className="w-5 h-5 border-2 border-[#0B0B0B]/30 border-t-[#0B0B0B] rounded-full"
                        />
                        Confirming order…
                      </span>
                    ) : isCreatingRazorpayOrder ? (
                      <span className="flex items-center gap-2">
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                          className="w-5 h-5 border-2 border-[#0B0B0B]/30 border-t-[#0B0B0B] rounded-full"
                        />
                        Opening Razorpay…
                      </span>
                    ) : (
                      `Pay ${formatInr(totalPrice)}`
                    )}
                  </Button>

                  <div className="mt-6 flex items-center justify-center gap-2 text-[rgba(11,11,11,0.50)] font-['Inter'] text-xs">
                    <ShieldCheck className="w-4 h-4" />
                    <span>Payments processed by Razorpay</span>
                  </div>
                </GlassCard>
              </div>
            </div>
          </SectionWrapper>
        </div>
      ) : (
        <div className="min-h-screen bg-[#0B0B0B]" aria-hidden />
      )}

      <OrderSuccessModal
        open={!!successOrderId}
        orderId={successOrderId}
        onContinue={() => {
          setSuccessOrderId(null);
          navigate('/');
        }}
      />
    </>
  );
}
