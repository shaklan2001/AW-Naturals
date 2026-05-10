import { Link } from 'react-router';

export interface ProductDetailErrorStateProps {
    message?: string;
}

export function ProductDetailErrorState({ message }: ProductDetailErrorStateProps) {
    return (
        <div className="pt-24 min-h-screen flex items-center justify-center">
            <div className="text-center">
                <h1 className="font-['Playfair_Display'] text-4xl mb-4 text-[#F5F5DC]">Product not found</h1>
                <p className="text-[#F5F5DC]/60 text-sm mb-4">{message}</p>
                <Link to="/products" className="text-[#D4AF37] hover:underline">
                    Back to Products
                </Link>
            </div>
        </div>
    );
}
