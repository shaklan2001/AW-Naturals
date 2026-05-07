import React from "react";
import { cn } from "./utils";

interface StarBorderProps {
  children: React.ReactNode;
  className?: string;
  color?: string;
  speed?: string;
}

/**
 * A glowing, animated border component inspired by React Bits 'Star Border'.
 * It uses a rotating conic gradient behind a masked center to create a sweeping light effect.
 */
export function StarBorder({
  children,
  className,
  color = "white",
  speed = "4s", // default slightly slower for elegance
}: StarBorderProps) {
  return (
    <div
      className={cn(
        "relative inline-flex items-center justify-center rounded-full bg-transparent px-5 py-2",
        className
      )}
    >
      {/* Animated Border Wrapper using CSS Mask to only show the 1px padding area */}
      <div
        className="absolute inset-0 overflow-hidden rounded-full pointer-events-none"
        style={{
          padding: "1px", // the width of the animated border
          WebkitMask:
            "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
          WebkitMaskComposite: "xor",
          maskComposite: "exclude",
        }}
      >
        {/* Rotating Conic Gradient inside the masked wrapper */}
        <div
          className="absolute left-[50%] top-[50%] aspect-square w-[300%] -translate-x-[50%] -translate-y-[50%]"
          style={{
            background: `conic-gradient(from 0deg, transparent 70%, ${color} 100%)`,
            animation: `spin-star ${speed} linear infinite`,
          }}
        />
      </div>

      {/* Subtle fallback border to ensure visibility on all ends */}
      <div className="absolute inset-0 rounded-full border border-white/10 pointer-events-none" />

      {/* The inner content area - fully transparent now */}
      <div className="relative z-10 flex items-center justify-center">
        {children}
      </div>

      <style>{`
        @keyframes spin-star {
          0% { transform: translate(-50%, -50%) rotate(0deg); }
          100% { transform: translate(-50%, -50%) rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
