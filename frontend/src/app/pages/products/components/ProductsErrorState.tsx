export interface ProductsErrorStateProps {
    message?: string;
}

export function ProductsErrorState({ message }: ProductsErrorStateProps) {
    return (
        <div className="pt-24 min-h-[100vh] bg-[#0B0B0B] flex flex-col items-center justify-center px-6 text-center">
            <p className="font-['Inter'] text-red-400 mb-2">{message ?? 'Failed to load products'}</p>
            <p className="text-[#F5F5DC]/60 text-sm italic">Establish API connection to view formulations.</p>
        </div>
    );
}
