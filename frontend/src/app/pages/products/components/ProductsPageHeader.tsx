import { motion } from 'motion/react';
import { PremiumSectionChip } from '../../../components/PremiumSectionChip';
import { getProductsPageHeaderCopy } from '../../../constants/product-category-copy';
import { ProductsCategoryHeading } from './ProductsCategoryHeading';

type ProductsPageHeaderProps = {
    selectedCategory: string;
};

export function ProductsPageHeader({ selectedCategory }: ProductsPageHeaderProps) {
    const copy = getProductsPageHeaderCopy(selectedCategory);

    return (
        <section className="pt-36 pb-24 px-6 relative overflow-hidden">
            <div className="max-w-4xl mx-auto text-center relative z-10">
                <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
                    <div className="mb-6 flex justify-center">
                        <PremiumSectionChip>{copy.chip}</PremiumSectionChip>
                    </div>

                    <ProductsCategoryHeading copy={copy} size="hero" />
                </motion.div>
            </div>

            <style>{`
          @keyframes shine {
            0% { background-position: 200% center; }
            100% { background-position: -200% center; }
          }
          .animate-shine {
            background-size: 200% auto;
            animation: shine 3s linear infinite;
          }
        `}</style>
        </section>
    );
}
