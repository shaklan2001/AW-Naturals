import type { ReactNode } from 'react';
import { Link } from 'react-router';
import { motion } from 'motion/react';
import { ArrowLeft } from 'lucide-react';
import { SectionWrapper } from '../../components/SectionWrapper';

export interface LegalDocumentShellProps {
  title: string;
  description?: string;
  children: ReactNode;
}

export function LegalDocumentShell({ title, description, children }: LegalDocumentShellProps) {
  return (
    <div className="min-h-screen bg-[#0B0B0B] bg-[radial-gradient(ellipse_at_top,rgba(15,61,46,0.45),transparent_60vw)] text-[#F5F5DC]">
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
            Legal
          </p>
          <h1 className="mt-3 font-['Cormorant_Garamond',serif] font-semibold text-[clamp(2rem,5vw,3rem)] leading-tight tracking-tight text-[#F5F5DC]">
            {title}
          </h1>
          {description ? (
            <p className="mt-4 max-w-2xl font-['Inter'] text-base font-light leading-relaxed text-white/55 md:text-lg">
              {description}
            </p>
          ) : null}
          <p className="mt-6 font-['Inter'] text-xs text-white/35">Last updated: 13 April 2026</p>
        </motion.header>

        <motion.article
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.08 }}
          className="mx-auto max-w-3xl font-['Inter'] text-[15px] font-light leading-relaxed text-white/70 md:text-base [&_h2]:mt-10 [&_h2]:scroll-mt-24 [&_h2]:font-['Playfair_Display'] [&_h2]:text-xl [&_h2]:font-normal [&_h2]:text-[#F5F5DC] md:[&_h2]:text-2xl [&_h2]:first:mt-0 [&_h3]:mt-6 [&_h3]:font-['Inter'] [&_h3]:text-sm [&_h3]:font-semibold [&_h3]:uppercase [&_h3]:tracking-wide [&_h3]:text-[#D4AF37]/90 [&_p]:mt-4 [&_ul]:mt-3 [&_ul]:list-disc [&_ul]:space-y-2 [&_ul]:pl-5 [&_strong]:font-medium [&_strong]:text-white/85 [&_a]:text-[#D4AF37] [&_a]:underline [&_a]:underline-offset-2 [&_a]:hover:text-[#E5C75A]"
        >
          {children}
        </motion.article>
      </SectionWrapper>
    </div>
  );
}
