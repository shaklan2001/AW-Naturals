import { Link } from 'react-router';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'motion/react';
import { ArrowLeft } from 'lucide-react';
import { SectionWrapper } from '../../components/SectionWrapper';
import { fetchProducts, fetchPublishedBlogs } from '../../api/public-api';
import { SITEMAP_SECTIONS } from '../../constants/sitemap';
import { absoluteSiteUrl } from '../../constants/site-url';
import { usePageSeo } from '../../seo/usePageSeo';

export function SitemapPage() {
  const { data: products = [] } = useQuery({
    queryKey: ['sitemap-products'],
    queryFn: () => fetchProducts(),
    staleTime: 1000 * 60 * 10,
  });

  const { data: blogs = [] } = useQuery({
    queryKey: ['sitemap-blogs'],
    queryFn: fetchPublishedBlogs,
    staleTime: 1000 * 60 * 10,
  });

  usePageSeo({
    title: 'Sitemap',
    description:
      'Browse all pages on AW Naturals — products, services, science articles, policies, and wellness tools.',
    path: '/sitemap',
  });

  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'AW Naturals',
    url: absoluteSiteUrl('/'),
    description:
      'Clinical wellness through doctor-formulated herbal infusions. Bridging ancient wisdom with modern science.',
  };

  return (
    <div className="min-h-screen bg-[#0B0B0B] bg-[radial-gradient(ellipse_at_top,rgba(15,61,46,0.45),transparent_60vw)] text-[#F5F5DC]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      <SectionWrapper className="pb-24 pt-28 md:pt-32">
        <Link
          to="/"
          className="mb-10 inline-flex items-center gap-2 font-['Inter'] text-sm font-medium text-[#D4AF37]/80 transition-all hover:gap-3 hover:text-[#D4AF37]"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden />
          Back to home
        </Link>

        <motion.header
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-12 border-b border-white/[0.08] pb-10"
        >
          <p className="font-['Inter'] text-[10px] font-semibold uppercase tracking-[0.32em] text-[#c8a84b]/85">
            Site navigation
          </p>
          <h1 className="mt-3 font-['Cormorant_Garamond',serif] font-semibold text-[clamp(2rem,5vw,3rem)] leading-tight tracking-tight text-[#F5F5DC]">
            Sitemap
          </h1>
          <p className="mt-4 max-w-2xl font-['Inter'] text-base font-light leading-relaxed text-white/55 md:text-lg">
            A complete index of AW Naturals pages for visitors and search engines. Machine-readable XML
            sitemap:{' '}
            <a
              href="/sitemap.xml"
              className="text-[#D4AF37] underline underline-offset-2 hover:text-[#E5C75A]"
            >
              sitemap.xml
            </a>
            .
          </p>
        </motion.header>

        <motion.nav
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.08 }}
          aria-label="Sitemap"
          className="mx-auto max-w-4xl space-y-12"
        >
          {SITEMAP_SECTIONS.map((section) => (
            <section key={section.id} aria-labelledby={`sitemap-${section.id}`}>
              <h2
                id={`sitemap-${section.id}`}
                className="mb-5 font-['Inter'] text-[11px] font-bold uppercase tracking-[0.25em] text-[#D4AF37]/85"
              >
                {section.title}
              </h2>
              <ul className="grid gap-3 sm:grid-cols-2">
                {section.links.map((link) => (
                  <li key={link.path}>
                    <Link
                      to={link.path}
                      className="group block rounded-2xl border border-white/[0.08] bg-white/[0.03] px-5 py-4 transition-colors hover:border-[#D4AF37]/35 hover:bg-white/[0.05]"
                    >
                      <span className="font-['Inter'] text-[15px] font-medium text-[#F5F5DC] transition-colors group-hover:text-[#D4AF37]">
                        {link.title}
                      </span>
                      {link.description ? (
                        <span className="mt-1 block font-['Inter'] text-[13px] font-light leading-relaxed text-white/45">
                          {link.description}
                        </span>
                      ) : null}
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          ))}

          {products.length > 0 ? (
            <section aria-labelledby="sitemap-products">
              <h2
                id="sitemap-products"
                className="mb-5 font-['Inter'] text-[11px] font-bold uppercase tracking-[0.25em] text-[#D4AF37]/85"
              >
                Products
              </h2>
              <ul className="grid gap-3 sm:grid-cols-2">
                {products.map((product) => (
                  <li key={product.id}>
                    <Link
                      to={`/products/${product.id}`}
                      className="group block rounded-2xl border border-white/[0.08] bg-white/[0.03] px-5 py-4 transition-colors hover:border-[#D4AF37]/35 hover:bg-white/[0.05]"
                    >
                      <span className="font-['Inter'] text-[15px] font-medium text-[#F5F5DC] transition-colors group-hover:text-[#D4AF37]">
                        {product.name}
                      </span>
                      {product.shortDescription ? (
                        <span className="mt-1 block font-['Inter'] text-[13px] font-light leading-relaxed text-white/45">
                          {product.shortDescription}
                        </span>
                      ) : null}
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          ) : null}

          {blogs.length > 0 ? (
            <section aria-labelledby="sitemap-blog">
              <h2
                id="sitemap-blog"
                className="mb-5 font-['Inter'] text-[11px] font-bold uppercase tracking-[0.25em] text-[#D4AF37]/85"
              >
                Science &amp; Articles
              </h2>
              <ul className="grid gap-3 sm:grid-cols-2">
                {blogs.map((post) => (
                  <li key={post.id}>
                    <Link
                      to={`/blog/${post.slug}`}
                      className="group block rounded-2xl border border-white/[0.08] bg-white/[0.03] px-5 py-4 transition-colors hover:border-[#D4AF37]/35 hover:bg-white/[0.05]"
                    >
                      <span className="font-['Inter'] text-[15px] font-medium text-[#F5F5DC] transition-colors group-hover:text-[#D4AF37]">
                        {post.title}
                      </span>
                      {post.seoDescription ? (
                        <span className="mt-1 block font-['Inter'] text-[13px] font-light leading-relaxed text-white/45">
                          {post.seoDescription}
                        </span>
                      ) : null}
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          ) : null}
        </motion.nav>
      </SectionWrapper>
    </div>
  );
}
