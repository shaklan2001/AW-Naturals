import React from 'react';
import { Card } from './Card';
import { Button } from './Button';
import { IconCircle, TagPill, Divider, StepCircle, TipPill } from './Elements';
import { Heart, Sparkles, ShieldCheck, Leaf, ArrowRight, Activity, Moon, Sun } from 'lucide-react';

export function BundleCard({ 
  isFeatured, 
  saveText,
  title,
  subtitle,
  oldPrice,
  price,
  description,
  tag,
  icon: Icon
}: { 
  isFeatured?: boolean, 
  saveText?: string,
  title: string,
  subtitle: string,
  oldPrice: string,
  price: string,
  description: string,
  tag: string,
  icon: React.ElementType
}) {
  return (
    <Card isBundle={isFeatured} className="w-full sm:w-[320px] h-full sm:min-h-[480px] p-6 flex flex-col items-center justify-between">
      {isFeatured && (
        <div className="absolute top-0 left-1/2 -translate-x-1/2 bg-[#3d1a0a] text-[#f0e8d4] font-[Inter] font-bold text-[9.5px] tracking-[1px] uppercase px-[18px] py-[6px] rounded-b-[11px] z-20 whitespace-nowrap">
          Most Popular
        </div>
      )}
      {saveText && (
        <div className="absolute top-0 right-0 bg-[#6b3018] text-[#f5edd6] font-[Inter] font-bold text-[9.5px] tracking-[0.5px] px-[13px] py-[5px] rounded-bl-[10px] z-20 whitespace-nowrap">
          {saveText}
        </div>
      )}
      
      <div className="flex flex-col items-center mt-6 z-10 w-full text-center">
        <IconCircle className="mb-4">
          <Icon className="w-6 h-6" />
        </IconCircle>
        <h3 className="font-['Playfair_Display'] font-semibold text-[22px] text-[#3d1a0a] text-center mb-1">
          {title}
        </h3>
        <p className="font-[Inter] font-medium text-[11.5px] text-[rgba(61,26,10,0.42)] mb-4">
          {subtitle}
        </p>
        <TagPill className="mb-6">{tag}</TagPill>
      </div>

      <div className="w-full flex flex-col items-center z-10 mt-auto">
        <Divider className="mb-4" />
        <div className="flex items-baseline gap-2 mb-1">
          <span className="font-[Inter] font-bold text-[14px] text-[#3d1a0a] opacity-60 line-through">
            {oldPrice}
          </span>
          <span className="font-['Playfair_Display'] font-semibold text-[34px] text-[#3d1a0a]">
            {price}
          </span>
        </div>
        <p className="font-[Inter] font-light text-[12.5px] text-[rgba(61,26,10,0.60)] text-center mb-6 px-2 h-[40px]">
          {description}
        </p>
        <Button variant={isFeatured ? 'solid' : 'ghost'} className="w-full">
          Add to Protocol
        </Button>
      </div>
    </Card>
  );
}
