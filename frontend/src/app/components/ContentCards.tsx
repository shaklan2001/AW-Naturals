import React from 'react';
import { Card } from './Card';
import { Button } from './Button';
import { IconCircle, TagPill, Divider, StepCircle, TipPill } from './Elements';
import { ShieldCheck, ArrowRight } from 'lucide-react';

export function RitualStepCard({ step, time, title, desc }: { step: number, time: string, title: string, desc: string }) {
  return (
    <Card className="w-full sm:w-[300px] p-5 flex flex-col gap-4 min-h-[220px]">
      <div className="flex justify-between items-start mb-2">
        <StepCircle number={step} />
        <TipPill>{time}</TipPill>
      </div>
      <div className="flex-1">
        <h4 className="font-[Inter] font-bold text-[14px] text-[#3d1a0a] mb-2">
          {title}
        </h4>
        <p className="font-[Inter] font-light text-[13px] text-[rgba(61,26,10,0.60)] leading-[1.6]">
          {desc}
        </p>
      </div>
      <Divider />
      <div className="flex justify-between items-center group cursor-pointer pt-2">
        <span className="font-[Inter] font-semibold text-[12px] text-[#6b3018] group-hover:underline">
          View full details
        </span>
        <ArrowRight className="w-4 h-4 text-[#6b3018] transition-transform group-hover:translate-x-1" />
      </div>
    </Card>
  );
}

export function QuizCard({ selected, icon: Icon, title, desc, onSelect }: { selected?: boolean, icon: React.ElementType, title: string, desc: string, onSelect: () => void }) {
  return (
    <Card isQuizSelected={selected} className="w-full sm:w-[280px] p-5 flex flex-col items-center justify-center min-h-[240px]">
      <IconCircle className="mb-4 mt-2">
        <Icon className="w-6 h-6" />
      </IconCircle>
      <h4 className="font-[Inter] font-bold text-[14px] text-[#3d1a0a] mb-2 text-center">
        {title}
      </h4>
      <p className="font-[Inter] font-light text-[12.5px] text-[rgba(61,26,10,0.60)] text-center mb-6 flex-1 px-2">
        {desc}
      </p>
      <Button variant={selected ? 'solid' : 'ghost'} className="w-full" onClick={onSelect}>
        {selected ? 'Selected ✓' : 'Select'}
      </Button>
    </Card>
  );
}

export function BlogCard({ imagePath, title, date, desc }: { imagePath: string, title: string, date: string, desc: string }) {
  return (
    <Card className="w-full sm:w-[320px] flex flex-col h-full sm:h-[420px] !p-0 overflow-hidden">
      <div className="h-[148px] w-full bg-[#c4b49a] overflow-hidden relative shrink-0">
        <img 
          src={imagePath} 
          alt={title}
          className="w-full h-full object-cover"
        />
      </div>
      <div className="p-6 flex flex-col flex-1 bg-[#f0e8d4]">
        <p className="font-[Inter] font-bold text-[9px] text-[rgba(61,26,10,0.38)] tracking-[2px] uppercase mb-2">
          {date}
        </p>
        <h4 className="font-['Playfair_Display'] font-semibold text-[16px] text-[#3d1a0a] leading-[1.35] mb-3">
          {title}
        </h4>
        <p className="font-[Inter] font-light text-[12.5px] text-[rgba(61,26,10,0.56)] leading-[1.62] mb-auto line-clamp-3">
          {desc}
        </p>
        <span className="font-[Inter] font-semibold text-[12px] text-[#6b3018] border-b-[1.5px] border-[rgba(107,48,24,0.28)] pb-1 w-max cursor-pointer hover:border-[#6b3018] transition-colors mt-6">
          Read More
        </span>
      </div>
    </Card>
  );
}

export function TestimonialCard({ initials, name, review }: { initials: string, name: string, review: string }) {
  return (
    <Card className="w-full sm:w-[350px] flex flex-col h-full !p-0">
      <div className="p-6 pb-6 flex flex-col flex-1 bg-[#f0e8d4]">
        <div className="w-[36px] h-[36px] rounded-full bg-[rgba(93,40,15,0.08)] border border-[rgba(93,40,15,0.16)] flex items-center justify-center mb-6 shrink-0 shadow-[inset_0px_1px_3px_rgba(0,0,0,0.08)]">
           <svg width="14" height="12" viewBox="0 0 14 12" fill="none" xmlns="http://www.w3.org/2000/svg">
             <path d="M4.6 12C3.13333 12 1.96667 11.4 1.1 10.2C0.233333 8.93333 -0.1 7.26667 0.0999997 5.2L1.89999 0H5.5L4.09999 5.4H6.5V12H4.6ZM12.1 12C10.6333 12 9.46666 11.4 8.6 10.2C7.73333 8.93333 7.4 7.26667 7.6 5.2L9.39999 0H13L11.6 5.4H14V12H12.1Z" fill="#6b3018"/>
           </svg>
        </div>
        <p className="font-[Inter] font-light text-[13px] text-[rgba(61,26,10,0.60)] leading-[1.6]">
          "{review}"
        </p>
      </div>
      <div className="border-t border-[rgba(93,40,15,0.10)] px-[22px] py-[14px] flex items-center gap-[10px] bg-[#f0e8d4] z-10 shrink-0">
        <div className="w-[36px] h-[36px] rounded-full bg-[rgba(93,40,15,0.10)] border border-[rgba(93,40,15,0.22)] flex items-center justify-center font-[Inter] font-bold text-[11px] text-[#6b3018]">
          {initials}
        </div>
        <div>
          <h5 className="font-[Inter] font-bold text-[13px] text-[#3d1a0a]">
            {name}
          </h5>
          <p className="font-[Inter] font-normal text-[10px] text-[rgba(61,26,10,0.42)] uppercase tracking-wide">
            Verified Buyer
          </p>
        </div>
      </div>
    </Card>
  );
}
