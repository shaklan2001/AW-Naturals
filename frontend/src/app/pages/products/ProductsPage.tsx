import { useCart } from '../../context/CartContext';
import { useStorefrontProducts } from '../../hooks/use-storefront-queries';
import type { StorefrontProduct } from '../../api/public-api';
import { Link, useSearchParams } from 'react-router';
import { toCartProduct } from './components/productListUtils';
import { ProductsAmbientBackground } from './components/ProductsAmbientBackground';
import { ProductsPageHeader } from './components/ProductsPageHeader';
import { ProductListRow } from './components/ProductListRow';
import { ProductsLoadingState } from './components/ProductsLoadingState';
import { ProductsErrorState } from './components/ProductsErrorState';
import { PremiumSectionChip } from '../../components/PremiumSectionChip';
import { UpcomingProductsSection } from './components/UpcomingProductsSection';
import { PRODUCT_CATEGORY } from '../../constants/product-categories';
import {
    getProductShelfCopy,
    getProductShelfOrder,
    resolveProductShelf,
    type ProductShelfKey,
} from '../../constants/product-category-copy';
import { ProductsCategoryHeading } from './components/ProductsCategoryHeading';

export function ProductsPage() {
    const [searchParams] = useSearchParams();
    const selectedCategory = searchParams.get('category') ?? PRODUCT_CATEGORY.all;
    const isShopAll = selectedCategory === PRODUCT_CATEGORY.all;
    const { addToCart, getItemQuantity, updateQuantity } = useCart();
    const { data: products = [], isPending, isError, error } = useStorefrontProducts(selectedCategory);

    const handleAddToCart = (product: StorefrontProduct) => {
        addToCart(toCartProduct(product));
    };

    const handleDecrease = (productId: string) => {
        const current = getItemQuantity(productId);
        updateQuantity(productId, current - 1);
    };

    if (isPending) {
        return <ProductsLoadingState />;
    }

    if (isError) {
        return <ProductsErrorState message={error?.message} />;
    }

    const catalogProducts = isShopAll
        ? products.filter((product) => product.status !== 'upcoming')
        : products;
    const upcomingProducts = isShopAll ? products.filter((product) => product.status === 'upcoming') : [];

    const productsByShelf = catalogProducts.reduce(
        (acc, product) => {
            const shelf = resolveProductShelf(product);
            if (!acc[shelf]) acc[shelf] = [];
            acc[shelf].push(product);
            return acc;
        },
        {} as Partial<Record<ProductShelfKey, StorefrontProduct[]>>
    );

    const visibleShelves = isShopAll
        ? getProductShelfOrder().filter((shelf) => (productsByShelf[shelf]?.length ?? 0) > 0)
        : null;

    return (
        <div className="bg-[#0B0B0B] bg-[radial-gradient(ellipse_at_top,rgba(15,61,46,0.45),transparent_60vw)] min-h-screen relative">
            <ProductsAmbientBackground />

            <div className="relative z-10 pointer-events-auto">
                <ProductsPageHeader selectedCategory={selectedCategory} />

                <section className="py-12 pb-24 px-6">
                    <div className="max-w-7xl mx-auto">
                        {catalogProducts.length === 0 ? (
                            <div className="mx-auto max-w-md rounded-2xl border border-white/[0.08] bg-white/[0.03] px-8 py-14 text-center backdrop-blur-sm">
                                <p className="font-['Inter'] text-[15px] leading-relaxed text-white/70">
                                    No products match this category filter yet, or nothing is listed under this shelf.
                                </p>
                                <p className="mt-4 font-['Inter'] text-[13px] text-white/45">
                                    Try shop all to see the full catalog.
                                </p>
                                <Link
                                    to="/products"
                                    className="mt-8 inline-flex rounded-full border border-[#D4AF37]/40 px-8 py-3 font-['Inter'] text-[12px] font-semibold uppercase tracking-[0.2em] text-[#D4AF37] transition-colors hover:border-[#D4AF37] hover:bg-[#D4AF37]/10"
                                >
                                    Shop all
                                </Link>
                            </div>
                        ) : isShopAll && visibleShelves ? (
                            visibleShelves.map((shelf) => {
                                const shelfCopy = getProductShelfCopy(shelf);
                                const shelfProducts = productsByShelf[shelf] ?? [];

                                return (
                                    <div key={shelf} className="mb-24 last:mb-0">
                                        <div className="mb-12 mx-auto max-w-3xl text-center">
                                            <div className="mb-5 flex justify-center">
                                                <PremiumSectionChip>{shelfCopy.chip}</PremiumSectionChip>
                                            </div>
                                            <ProductsCategoryHeading copy={shelfCopy} size="section" />
                                        </div>
                                        <div className="grid grid-cols-1 gap-10 max-w-5xl mx-auto">
                                            {shelfProducts.map((product, index) => (
                                                <ProductListRow
                                                    key={product.id}
                                                    product={product}
                                                    index={index}
                                                    quantityInCart={getItemQuantity(product.id)}
                                                    onAddToCart={handleAddToCart}
                                                    onDecrease={handleDecrease}
                                                />
                                            ))}
                                        </div>
                                    </div>
                                );
                            })
                        ) : (
                            <div className="grid grid-cols-1 gap-10 max-w-5xl mx-auto">
                                {catalogProducts.map((product, index) => (
                                    <ProductListRow
                                        key={product.id}
                                        product={product}
                                        index={index}
                                        quantityInCart={getItemQuantity(product.id)}
                                        onAddToCart={handleAddToCart}
                                        onDecrease={handleDecrease}
                                    />
                                ))}
                            </div>
                        )}
                    </div>
                </section>

                {isShopAll ? <UpcomingProductsSection products={upcomingProducts} /> : null}
            </div>
        </div>
    );
}
