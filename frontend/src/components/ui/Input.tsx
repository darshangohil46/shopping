import React, { InputHTMLAttributes } from "react";
import { cn } from "../../utils/general";

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, id, ...props }, ref) => {
    return (
      <div className="w-full flex flex-col gap-1.5">
        {label && (
          <label htmlFor={id} className="text-xs font-medium text-neutral-800">
            {label}
          </label>
        )}
        <input
          id={id}
          ref={ref}
          className={cn(
            "w-full px-3 py-2 text-sm bg-white text-black border border-neutral-300 rounded-sm focus:outline-none focus:border-black transition-colors placeholder:text-neutral-400",
            error && "border-red-600 focus:border-red-600",
            className,
          )}
          {...props}
        />
        {error && <p className="text-xs text-red-600">{error}</p>}
      </div>
    );
  },
);

Input.displayName = "Input";
