import { InputHTMLAttributes, ReactNode, forwardRef } from "react";
import { LucideIcon } from "lucide-react";

/* ------------------------------------------------------------------ */
/*  Props                                                              */
/* ------------------------------------------------------------------ */
interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  /** Label displayed above the field */
  label?: string;
  /** Error message displayed below the field (turns border red) */
  error?: string;
  /** Optional Lucide icon rendered inside the input on the left */
  icon?: LucideIcon;
  /** Optional element rendered inside the input on the right (e.g. password toggle) */
  rightElement?: ReactNode;
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */
const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, icon: Icon, rightElement, className = "", id, ...rest }, ref) => {
    const inputId = id ?? label?.toLowerCase().replace(/\s+/g, "-");

    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label
            htmlFor={inputId}
            className="text-sm font-medium text-slate-700 dark:text-slate-300"
          >
            {label}
          </label>
        )}

        <div className="relative">
          {Icon && (
            <Icon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          )}
          <input
            ref={ref}
            id={inputId}
            className={`
              w-full rounded-xl border bg-white dark:bg-slate-900
              px-4 py-3 text-sm text-slate-900 dark:text-slate-100
              placeholder:text-slate-400
              transition-colors duration-200
              focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent
              ${Icon ? "pl-10" : ""}
              ${rightElement ? "pr-10" : ""}
              ${error
                ? "border-red-400 focus:ring-red-500"
                : "border-slate-200 dark:border-slate-700"
              }
              ${className}
            `}
            {...rest}
          />
          {rightElement && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2">
              {rightElement}
            </div>
          )}
        </div>

        {error && (
          <p className="text-xs font-medium text-red-500">{error}</p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";
export default Input;
