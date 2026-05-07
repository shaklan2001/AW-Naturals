"use client";

import type { CSSProperties } from "react";
import { Toaster as Sonner, type ToasterProps } from "sonner";

/** Sonner toasts — theme fixed to light for storefront; z-index above modals (z-[200]). */
function Toaster({ ...props }: ToasterProps) {
  return (
    <Sonner
      theme="light"
      position="top-center"
      className="toaster group"
      style={
        {
          zIndex: 260,
          "--normal-bg": "#fffdf9",
          "--normal-text": "#1f1c18",
          "--normal-border": "#e3d6c4",
        } as CSSProperties
      }
      toastOptions={{
        classNames: {
          error: "border-red-200/90 bg-red-50 text-red-950",
          success: "border-emerald-200/90 bg-emerald-50 text-emerald-950",
        },
      }}
      {...props}
    />
  );
}

export { Toaster };
