import * as React from "react";
import { cn } from "./utils";
import { motion, HTMLMotionProps } from "motion/react";

export interface ButtonProps extends Omit<HTMLMotionProps<"button">, "children"> {
  variant?: "primary" | "secondary" | "ghost" | "icon";
  size?: "default" | "sm" | "lg" | "icon";
  children?: React.ReactNode;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "default", children, ...props }, ref) => {
    
    const variants = {
      primary: "bg-gradient-to-r from-[#D4AF37] to-[#B89B2B] text-[#0B0B0B] border border-[#D4AF37]/50 shadow-[0_0_15px_rgba(212,175,55,0.15)] hover:shadow-[0_0_25px_rgba(212,175,55,0.4)]",
      secondary: "bg-white/5 backdrop-blur-md border border-white/10 text-[#F5F5DC] hover:bg-white/10 hover:border-[#D4AF37]/50 hover:shadow-[0_0_20px_rgba(212,175,55,0.15)]",
      ghost: "text-[#F5F5DC]/80 hover:text-[#D4AF37] hover:bg-white/5",
      icon: "bg-white/5 backdrop-blur-md border border-white/10 text-[#D4AF37] hover:bg-white/10 hover:border-[#D4AF37]/50 hover:shadow-[0_0_15px_rgba(212,175,55,0.2)] rounded-full",
    };

    const sizes = {
      default: "px-6 py-3 text-sm font-medium",
      sm: "px-4 py-2 text-xs",
      lg: "px-8 py-4 text-base font-medium",
      icon: "w-10 h-10 flex items-center justify-center p-0",
    };

    return (
      <motion.button
        ref={ref}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className={cn(
          "relative overflow-hidden inline-flex items-center justify-center rounded-xl transition-all duration-300 ease-out font-['Inter'] focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/50",
          variants[variant],
          sizes[size],
          className
        )}
        {...props}
      >
        {/* Shiny Effect Overlay */}
        {variant === "primary" && (
          <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: "200%" }}
            transition={{
              repeat: Infinity,
              repeatDelay: 1,
              duration: 2,
              ease: "linear",
            }}
            style={{
              background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)",
              width: "40%",
              height: "100%",
              position: "absolute",
              top: 0,
              transform: "skewX(-20deg)",
              pointerEvents: "none",
              zIndex: 1,
            }}
          />
        )}
        <span className="relative z-10 flex items-center gap-2">
          {children}
        </span>
      </motion.button>
    );
  }
);

Button.displayName = "Button";

export { Button };
