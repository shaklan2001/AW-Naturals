import { RotateCcw, ShoppingCart } from 'lucide-react';
import { PremiumGoldCtaLink } from '../../../components/PremiumGoldCtaButton';

export interface WellnessResultFooterActionsProps {
    onRetake: () => void;
}

export function WellnessResultFooterActions({ onRetake }: WellnessResultFooterActionsProps) {
    return (
        <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <button
                type="button"
                onClick={onRetake}
                className="flex-1 flex items-center justify-center gap-3 px-8 py-5 bg-white/5 border border-white/10 text-white/50 rounded-full font-['Inter'] text-[13px] uppercase tracking-widest font-bold hover:bg-white/10 hover:text-white transition-all"
            >
                <RotateCcw className="w-4 h-4" /> Retake questionnaire
            </button>
            <PremiumGoldCtaLink to="/products" className="flex-1 [&>span]:w-full [&>span]:justify-center">
                <ShoppingCart className="h-4 w-4 shrink-0" aria-hidden />
                Shop recommendations
            </PremiumGoldCtaLink>
        </div>
    );
}
