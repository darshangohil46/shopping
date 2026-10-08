import React, { ButtonHTMLAttributes } from "react";
import { cn } from "../../utils/general";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost";
  isLoading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      children,
      variant = "primary",
      isLoading = false,
      disabled,
      ...props
    },
    ref,
  ) => {
    const baseStyles =
      "inline-flex items-center justify-center px-4 py-2 text-sm font-medium transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-orange-500/25 disabled:opacity-50 disabled:cursor-not-allowed rounded-sm cursor-pointer";

    const variants = {
      primary:
        "bg-orange-600 text-white hover:bg-orange-700 active:bg-orange-800 border border-orange-600 shadow-xs",
      secondary:
        "bg-stone-100 text-stone-800 hover:bg-stone-200 active:bg-stone-300 border border-stone-200/80",
      outline:
        "bg-white text-stone-800 hover:bg-orange-50/50 hover:border-orange-300 active:bg-orange-50 border border-stone-300 shadow-xs",
      ghost:
        "bg-transparent text-stone-700 hover:bg-stone-100 hover:text-stone-900",
    };

    return (
      <button
        ref={ref}
        className={cn(baseStyles, variants[variant], className)}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading ? (
          <span className="flex items-center gap-2">
            <span className="w-3.5 h-3.5 border-2 border-current border-t-transparent animate-spin rounded-full" />
            <span>Loading...</span>
          </span>
        ) : (
          children
        )}
      </button>
    );
  },
);

Button.displayName = "Button";
