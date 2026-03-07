import { ButtonHTMLAttributes, forwardRef } from "react";
import { Loader2 } from "lucide-react";

/* ------------------------------------------------------------------ */
/*  Variant styles                                                     */
/* ------------------------------------------------------------------ */
const variants = {
  primary:
    "bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-lg shadow-indigo-500/25 hover:from-indigo-500 hover:to-violet-500 active:from-indigo-700 active:to-violet-700",
  outline:
    "border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 active:bg-slate-100",
} as const;

type Variant = keyof typeof variants;

/* ------------------------------------------------------------------ */
/*  Props                                                              */
/* ------------------------------------------------------------------ */
interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** Visual style variant */
  variant?: Variant;
  /** Shows a spinning loader and disables the button */
  isLoading?: boolean;
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */
const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = "primary", isLoading = false, children, className = "", disabled, ...rest }, ref) => {
    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={`
          relative flex items-center justify-center gap-2
          w-full rounded-xl px-5 py-3 text-sm font-semibold
          transition-all duration-200 ease-in-out
          disabled:opacity-60 disabled:cursor-not-allowed
          focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2
          ${variants[variant]}
          ${className}
        `}
        {...rest}
      >
        {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";
export default Button;
