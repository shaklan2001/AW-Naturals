import { Loader2 } from 'lucide-react';

export function ProductsLoadingState() {
    return (
        <div className="pt-24 min-h-[50vh] flex items-center justify-center text-[#F5F5DC] gap-3">
            <Loader2 className="w-8 h-8 animate-spin text-[#D4AF37]" />
            <span className="font-['Inter']">Loading clinical blends…</span>
        </div>
    );
}
