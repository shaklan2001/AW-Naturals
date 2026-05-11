import { memo } from 'react';
import { motion } from 'motion/react';
import { GlassCard } from '@/shared/components/GlassCard';
import type { MissionVisionItem } from './aboutConstants';

export interface MissionVisionCardColumnProps {
    item: MissionVisionItem;
    index: number;
}

export const MissionVisionCardColumn = memo(function MissionVisionCardColumn({
    item,
    index,
}: MissionVisionCardColumnProps) {
    const Icon = item.icon;

    return (
        <motion.div
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{
                duration: 0.65,
                delay: index * 0.08,
                ease: [0.22, 1, 0.36, 1],
            }}
        >
            <GlassCard
                className="h-full min-h-[280px] rounded-[1.75rem] border-2 border-[rgba(184,134,11,0.22)] p-8 md:min-h-[300px] md:rounded-[2rem] md:p-10 lg:p-12"
            >
                <div className="flex h-full flex-col items-center text-center">
                    <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl border border-[rgba(139,90,43,0.18)] bg-gradient-to-br from-[#E5DCC8] to-[#D4C9B0] shadow-[inset_0_1px_0_rgba(255,255,255,0.65)] md:mb-8 md:h-16 md:w-16 md:rounded-[1.1rem]">
                        <Icon
                            className="h-7 w-7 text-[#6B4E2E] md:h-8 md:w-8"
                            strokeWidth={1.35}
                            aria-hidden
                        />
                    </div>
                    <h3
                        className="font-['Gloock'] text-[1.45rem] leading-snug tracking-tight text-[#141210] md:text-[1.65rem] lg:text-[1.75rem]"
                        style={{ fontWeight: 500 }}
                    >
                        {item.title}
                    </h3>
                    <p className="mt-4 max-w-md font-['Inter'] text-[15px] font-light leading-relaxed text-[#2a2620]/88 md:mt-5 md:text-[16px] lg:text-[17px]">
                        {item.body}
                    </p>
                </div>
            </GlassCard>
        </motion.div>
    );
});
