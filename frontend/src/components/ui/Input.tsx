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
          <label htmlFor={id} className="text-xs font-medium text-stone-700">
            {label}
          </label>
        )}
        <input
          id={id}
          ref={ref}
          className={cn(
            "w-full px-3 py-2 text-sm bg-white text-stone-900 border border-stone-300 rounded-sm focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 transition-all placeholder:text-stone-400 shadow-2xs",
            error && "border-rose-500 focus:border-rose-500 focus:ring-rose-500/20",
            className,
          )}
          {...props}
        />
        {error && <p className="text-xs text-rose-600">{error}</p>}
      </div>
    );
  },
);

Input.displayName = "Input";
