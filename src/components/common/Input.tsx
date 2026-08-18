import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  leadingIcon?: React.ReactNode;
  trailingIcon?: React.ReactNode;
  isPassword?: boolean;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      error,
      helperText,
      leadingIcon,
      trailingIcon,
      isPassword = false,
      type = 'text',
      className = '',
      id,
      ...props
    },
    ref
  ) => {
    const [showPassword, setShowPassword] = useState(false);
    const inputId = id || (label ? `input-${label.toLowerCase().replace(/\s+/g, '-')}` : undefined);
    const actualType = isPassword ? (showPassword ? 'text' : 'password') : type;

    return (
      <div className="w-full flex flex-col gap-1.5 text-left">
        {label && (
          <label htmlFor={inputId} className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
            {label}
            {props.required && <span className="text-rose-500 ml-1">*</span>}
          </label>
        )}

        <div className="relative flex items-center">
          {leadingIcon && (
            <div className="absolute left-3.5 flex items-center pointer-events-none text-slate-400">
              {leadingIcon}
            </div>
          )}

          <input
            ref={ref}
            id={inputId}
            type={actualType}
            className={`w-full rounded-xl border bg-white px-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 transition-all duration-150 focus:outline-none focus:ring-2 focus:border-transparent ${
              leadingIcon ? 'pl-10' : ''
            } ${isPassword || trailingIcon ? 'pr-11' : ''} ${
              error
                ? 'border-rose-300 focus:ring-rose-500 bg-rose-50/20'
                : 'border-slate-200 hover:border-slate-300 focus:ring-indigo-500 focus:border-indigo-500'
            } disabled:bg-slate-50 disabled:text-slate-400 disabled:cursor-not-allowed ${className}`}
            {...props}
          />

          {isPassword ? (
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3.5 flex items-center text-slate-400 hover:text-slate-600 focus:outline-none p-1 rounded-md transition-colors"
              aria-label={showPassword ? 'Hide password' : 'Show password'}
              tabIndex={-1}
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          ) : (
            trailingIcon && (
              <div className="absolute right-3.5 flex items-center pointer-events-none text-slate-400">
                {trailingIcon}
              </div>
            )
          )}
        </div>

        {error ? (
          <p className="text-xs text-rose-600 font-medium flex items-center gap-1 mt-0.5">
            {error}
          </p>
        ) : helperText ? (
          <p className="text-xs text-slate-500 mt-0.5">{helperText}</p>
        ) : null}
      </div>
    );
  }
);

Input.displayName = 'Input';
