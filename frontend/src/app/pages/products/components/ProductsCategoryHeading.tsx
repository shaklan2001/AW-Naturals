import type { CategoryCopy } from '../../../constants/product-category-copy';

type ProductsCategoryHeadingProps = {
  copy: CategoryCopy;
  size?: 'hero' | 'section';
};

export function ProductsCategoryHeading({ copy, size = 'hero' }: ProductsCategoryHeadingProps) {
  const isHero = size === 'hero';

  return (
    <>
      <h2
        className={
          isHero
            ? "font-['Cormorant_Garamond',serif] font-semibold text-[48px] md:text-[72px] mb-6 text-[#F5F5DC] tracking-tight leading-tight"
            : "font-['Cormorant_Garamond',serif] font-semibold text-[32px] md:text-[44px] mb-4 text-[#F5F5DC] tracking-tight leading-tight text-center"
        }
      >
        {copy.title}{' '}
        {copy.titleAccent ? (
          <span className="italic text-transparent bg-clip-text bg-gradient-to-r from-[#C6A85B] via-[#E5D08A] to-[#C6A85B] animate-shine">
            {copy.titleAccent}
          </span>
        ) : null}
      </h2>
      <p
        className={
          isHero
            ? "font-['Inter'] text-[16px] md:text-[18px] text-[#F5F5DC]/60 max-w-2xl mx-auto font-light leading-relaxed"
            : "font-['Inter'] text-[15px] md:text-[16px] text-[#F5F5DC]/55 max-w-2xl mx-auto font-light leading-relaxed text-center"
        }
      >
        {copy.description}
      </p>
    </>
  );
}
