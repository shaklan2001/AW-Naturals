import { Loader2 } from 'lucide-react';

export function BlogPostLoadingState() {
    return (
        <div className="pt-24 min-h-[50vh] flex items-center justify-center bg-[#0B0B0B] text-[#F5F5DC] gap-3">
            <Loader2 className="w-8 h-8 animate-spin text-[#D4AF37]" />
            <span className="font-['Inter']">Loading article…</span>
        </div>
    );
}
