import { useParams } from 'react-router';
import { useCart } from '../../context/CartContext';
import { useStorefrontProduct, useStorefrontProducts } from '../../hooks/use-storefront-queries';
import type { Product } from '../../context/CartContext';
import { toCartProduct } from './components/productListUtils';
import { ProductDetailLoadingState } from './components/ProductDetailLoadingState';
import { ProductDetailErrorState } from './components/ProductDetailErrorState';
import { ProductDetailView } from './components/ProductDetailView';

export function ProductDetailPage() {
    const { id } = useParams();
    const { addToCart, getItemQuantity, updateQuantity } = useCart();
    const { data: apiProduct, isPending, isError, error } = useStorefrontProduct(id);
    const { data: allProducts } = useStorefrontProducts();

    if (isPending) {
        return <ProductDetailLoadingState />;
    }

    if (isError || !apiProduct) {
        return <ProductDetailErrorState message={error?.message} />;
    }

    const product: Product = {
        id: apiProduct.id,
        name: apiProduct.name,
        shortDescription: apiProduct.shortDescription,
        benefit: apiProduct.benefit,
        category: apiProduct.category,
        description: apiProduct.description,
        price: apiProduct.price,
        image: apiProduct.image,
        keyBenefitsPoints: apiProduct.keyBenefitsPoints,
        ingredientsPoints: apiProduct.ingredientsPoints,
        clinicalNote: apiProduct.clinicalNote,
        showClinicalNote: apiProduct.showClinicalNote,
        status: apiProduct.status,
    };

    const moreProducts = allProducts
        ? allProducts
              .filter((p) => p.id !== product.id && p.status !== "upcoming")
              .slice(0, 3)
        : [];
    const cartQuantity = getItemQuantity(product.id);

    return (
        <ProductDetailView 
            product={product} 
            moreProducts={moreProducts}
            cartQuantity={cartQuantity}
            updateQuantity={updateQuantity}
            onAddToCart={() => addToCart(product)} 
            onAddMoreToCart={(p) => addToCart(toCartProduct(p))}
        />
    );
}
