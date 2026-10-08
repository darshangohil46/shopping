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
      "inline-flex items-center justify-center px-4 py-2 text-sm font-medium transition-colors focus:outline-none focus:ring-1 focus:ring-black disabled:opacity-50 disabled:cursor-not-allowed rounded-sm cursor-pointer";

    const variants = {
      primary: "bg-black text-white hover:bg-neutral-800 border border-black",
      secondary:
        "bg-neutral-100 text-black hover:bg-neutral-200 border border-neutral-300",
      outline: "bg-white text-black hover:bg-neutral-100 border border-black",
      ghost: "bg-transparent text-black hover:bg-neutral-100",
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
