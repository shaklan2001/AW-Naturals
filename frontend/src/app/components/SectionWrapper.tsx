import * as React from "react";
import { cn } from "./ui/utils";
import { motion, HTMLMotionProps } from "motion/react";

export interface SectionWrapperProps extends HTMLMotionProps<"section"> {
  children: React.ReactNode;
  innerClassName?: string;
}

export const SectionWrapper = React.forwardRef<HTMLElement, SectionWrapperProps>(
  ({ className, innerClassName, children, ...props }, ref) => {
    return (
      <motion.section
        ref={ref}
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className={cn("py-24 md:py-32 relative", className)}
        {...props}
      >
        <div className={cn("container mx-auto px-6 md:px-12 max-w-7xl", innerClassName)}>
          {children}
        </div>
      </motion.section>
    );
  }
);

SectionWrapper.displayName = "SectionWrapper";
