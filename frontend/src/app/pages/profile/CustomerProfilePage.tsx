import { FormEvent, useEffect, useState } from 'react';
import { Link } from 'react-router';
import { useCustomerAuth } from '../../context/CustomerAuthContext';
import { SectionWrapper } from '../../components/SectionWrapper';
import { GlassCard } from '@/shared/components/GlassCard';
import { CheckCircle2, Pencil } from 'lucide-react';
import { Button } from '../../components/ui/button';

export function CustomerProfilePage() {
    const { isAuthenticated, customerDetails, updateCustomerDetails, saveCustomerDetails, openAuthModal } =
        useCustomerAuth();
    const [saved, setSaved] = useState(false);
    const [isEditing, setIsEditing] = useState(false);

    useEffect(() => {
        if (!saved) return;
        const timer = setTimeout(() => setSaved(false), 1800);
        return () => clearTimeout(timer);
    }, [saved]);

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        await saveCustomerDetails();
        setIsEditing(false);
        setSaved(true);
    };

    return (
        <div className="min-h-screen bg-[#0B0B0B] pb-20 pt-28 text-[#F5F5DC]">
            <SectionWrapper className="max-w-5xl">
                <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
                    <div>
                        <h1 className="font-['Gloock'] text-4xl tracking-tight text-[#F5F5DC] md:text-5xl">Your Profile</h1>
                        <p className="mt-2 font-['Inter'] text-sm text-white/55">
                            Keep your profile updated for fast checkout and accurate order delivery.
                        </p>
                    </div>
                    <div className="flex items-center gap-2">
                        <Link to="/profile/orders">
                            <Button type="button" variant="secondary">
                                Order History
                            </Button>
                        </Link>
                        <Link to="/profile/security">
                            <Button type="button" variant="secondary">
                                Login & Security
                            </Button>
                        </Link>
                    </div>
                </div>

                <GlassCard className="mx-auto max-w-4xl p-8 md:p-10" hoverEffect={false}>
                    {!isAuthenticated ? (
                        <div className="text-center">
                            <p className="font-['Inter'] text-[#0b0b0b]/80">
                                You&apos;re browsing as a guest. Sign in anytime to save your profile and speed up
                                checkout — it&apos;s optional.
                            </p>
                            <div className="mt-6 flex flex-wrap justify-center gap-3">
                                <Button
                                    type="button"
                                    className="rounded-full bg-gradient-to-r from-[#D4AF37] to-[#b8860b] px-8 text-[#0b0b0b]"
                                    onClick={() => openAuthModal('login')}
                                >
                                    Sign in
                                </Button>
                                <Link
                                    to="/login?next=/profile"
                                    className="inline-flex h-11 items-center justify-center rounded-full border border-[#c9b89a] bg-white/70 px-6 text-sm font-medium text-[#3d382f] transition-colors hover:bg-white"
                                >
                                    Open login page
                                </Link>
                            </div>
                        </div>
                    ) : null}
                    {isAuthenticated ? (
                    <form onSubmit={handleSubmit}>
                        <div className="mb-7 flex items-center justify-between border-b border-[rgba(180,155,80,0.22)] pb-5">
                            <h2 className="font-['Playfair_Display'] text-3xl text-[#0b0b0b]">Profile Details</h2>
                            {!isEditing ? (
                                <button
                                    type="button"
                                    onClick={() => setIsEditing(true)}
                                    className="inline-flex items-center gap-2 rounded-full border border-[rgba(180,155,80,0.35)] bg-white/40 px-5 py-2 text-sm font-semibold text-[#0b0b0b]"
                                >
                                    <Pencil className="h-4 w-4" />
                                    Enable Editing
                                </button>
                            ) : (
                                <span className="rounded-full border border-[rgba(180,155,80,0.35)] bg-[#fff6df] px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.12em] text-[#8a6200]">
                                    Editing
                                </span>
                            )}
                        </div>
                        <div className="grid gap-5 md:grid-cols-2">
                            <label>
                                <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.16em] text-[rgba(11,11,11,0.6)]">First Name</span>
                                <input value={customerDetails.firstName} readOnly={!isEditing} onChange={(e) => updateCustomerDetails({ firstName: e.target.value })} className="h-12 w-full rounded-xl border border-[rgba(180,155,80,0.28)] bg-[rgba(255,255,255,0.4)] px-4 text-[#0b0b0b] outline-none focus:border-[#b8860b]" />
                            </label>
                            <label>
                                <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.16em] text-[rgba(11,11,11,0.6)]">Last Name</span>
                                <input value={customerDetails.lastName} readOnly={!isEditing} onChange={(e) => updateCustomerDetails({ lastName: e.target.value })} className="h-12 w-full rounded-xl border border-[rgba(180,155,80,0.28)] bg-[rgba(255,255,255,0.4)] px-4 text-[#0b0b0b] outline-none focus:border-[#b8860b]" />
                            </label>
                            <label>
                                <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.16em] text-[rgba(11,11,11,0.6)]">Email Address</span>
                                <input value={customerDetails.email} readOnly={!isEditing} onChange={(e) => updateCustomerDetails({ email: e.target.value })} className="h-12 w-full rounded-xl border border-[rgba(180,155,80,0.28)] bg-[rgba(255,255,255,0.4)] px-4 text-[#0b0b0b] outline-none focus:border-[#b8860b]" />
                            </label>
                            <label>
                                <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.16em] text-[rgba(11,11,11,0.6)]">Phone Number</span>
                                <input value={customerDetails.phone} readOnly={!isEditing} onChange={(e) => updateCustomerDetails({ phone: e.target.value })} className="h-12 w-full rounded-xl border border-[rgba(180,155,80,0.28)] bg-[rgba(255,255,255,0.4)] px-4 text-[#0b0b0b] outline-none focus:border-[#b8860b]" />
                            </label>
                            <label className="md:col-span-2">
                                <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.16em] text-[rgba(11,11,11,0.6)]">Full Address</span>
                                <input value={customerDetails.address} readOnly={!isEditing} onChange={(e) => updateCustomerDetails({ address: e.target.value })} className="h-12 w-full rounded-xl border border-[rgba(180,155,80,0.28)] bg-[rgba(255,255,255,0.4)] px-4 text-[#0b0b0b] outline-none focus:border-[#b8860b]" />
                            </label>
                            <label>
                                <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.16em] text-[rgba(11,11,11,0.6)]">City</span>
                                <input value={customerDetails.city} readOnly={!isEditing} onChange={(e) => updateCustomerDetails({ city: e.target.value })} className="h-12 w-full rounded-xl border border-[rgba(180,155,80,0.28)] bg-[rgba(255,255,255,0.4)] px-4 text-[#0b0b0b] outline-none focus:border-[#b8860b]" />
                            </label>
                            <label>
                                <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.16em] text-[rgba(11,11,11,0.6)]">Pincode / Postal Code</span>
                                <input value={customerDetails.pincode} readOnly={!isEditing} onChange={(e) => updateCustomerDetails({ pincode: e.target.value })} className="h-12 w-full rounded-xl border border-[rgba(180,155,80,0.28)] bg-[rgba(255,255,255,0.4)] px-4 text-[#0b0b0b] outline-none focus:border-[#b8860b]" />
                            </label>
                        </div>

                        <div className="mt-8 flex items-center justify-between border-t border-[rgba(180,155,80,0.22)] pt-6">
                            {saved ? (
                                <div className="flex items-center gap-2 text-sm text-[#2f7d32]">
                                    <CheckCircle2 className="h-4 w-4" /> Profile updated
                                </div>
                            ) : (
                                <div />
                            )}

                            {isEditing ? (
                                <button
                                    type="submit"
                                    className="inline-flex h-11 items-center rounded-full bg-gradient-to-r from-[#D4AF37] to-[#b8860b] px-8 text-sm font-semibold text-[#0b0b0b]"
                                >
                                    Save Changes
                                </button>
                            ) : null}
                        </div>
                    </form>
                    ) : null}
                </GlassCard>
            </SectionWrapper>
        </div>
    );
}
