import * as React from "react";
import { cn } from "@/utils/cn";
import { cva, type VariantProps } from "class-variance-authority";

const badgeVariants = cva(
  "inline-flex items-center rounded-md px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide transition-colors",
  {
    variants: {
      variant: {
        default: "bg-[rgba(0,184,217,0.16)] text-[#006c9c]",
        secondary: "bg-[#f4f6f8] text-[#637381]",
        destructive: "bg-[rgba(255,86,48,0.16)] text-[#b71d18]",
        success: "bg-[rgba(0,167,111,0.16)] text-[#007867]",
        warning: "bg-[rgba(255,171,0,0.24)] text-[#b76e00]",
        outline: "border border-[rgba(145,158,171,0.32)] text-[#637381]",
      },
    },
    defaultVariants: { variant: "default" },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };
