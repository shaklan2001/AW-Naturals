import React from 'react';
import { motion } from 'motion/react';
import { Stethoscope, ExternalLink } from 'lucide-react';

interface DoctorCardProps {
  required: 'Required' | 'Recommended' | 'Optional';
}

export function DoctorCard({ required }: DoctorCardProps) {
  const urgencyColor = required === 'Required' ? '#EF4444' : required === 'Recommended' ? '#F59E0B' : '#22C55E';
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-[#0F0F0F] border border-white/8 rounded-2xl p-6 flex flex-col sm:flex-row items-start sm:items-center gap-6 hover:border-[#D4AF37]/30 transition-all duration-300 shadow-[0_4px_20px_rgba(0,0,0,0.5)]"
    >
      <div className="relative flex-shrink-0">
        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#1a2e1a] to-[#0a150a] border-2 border-[#D4AF37]/30 flex items-center justify-center shadow-[0_0_20px_rgba(212,175,55,0.15)] overflow-hidden">
          {/* Placeholder for doctor image or icon */}
          <Stethoscope className="w-9 h-9 text-[#D4AF37]" strokeWidth={1.5} />
        </div>
        <span className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-[#22C55E] border-2 border-[#0F0F0F]" />
      </div>

      <div className="flex-1">
        <div className="flex flex-wrap items-start justify-between gap-2 mb-1">
          <div>
            <h3 className="font-['Playfair_Display'] text-xl text-[#F5F5DC]">Dr. Neil</h3>
            <p className="font-['Inter'] text-sm text-white/50 italic">Ayurveda & Clinical Nutrition Expert</p>
          </div>
          <span
            className="px-3 py-1 rounded-full font-['Inter'] text-[10px] font-bold uppercase tracking-wider"
            style={{ backgroundColor: `${urgencyColor}20`, color: urgencyColor, border: `1px solid ${urgencyColor}40` }}
          >
            {required}
          </span>
        </div>
        <p className="font-['Inter'] text-sm text-white/40 mt-2 mb-4 leading-relaxed">
          Specializing in tailored botanical protocols and metabolic restoration through Ayurvedic science.
        </p>
        <a
          href="https://www.drneil.co.uk"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-[#D4AF37] to-[#B89B2B] text-[#0B0B0B] rounded-xl font-['Inter'] text-sm font-semibold hover:shadow-[0_0_20px_rgba(212,175,55,0.4)] transition-all duration-300"
        >
          Visit Portfolio <ExternalLink className="w-4 h-4" />
        </a>
      </div>
    </motion.div>
  );
}
