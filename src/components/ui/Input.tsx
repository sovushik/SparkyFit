import React, { forwardRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, EyeOff, AlertCircle, CheckCircle, Search, X } from 'lucide-react';
import { cn } from '../../utils';

// ================== INPUT VARIANTS ==================
const inputVariants = {
  base: 'flex w-full rounded-lg border bg-white px-3 py-2 text-sm placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200',
  
  variant: {
    default: 'border-gray-300 focus:border-primary-500 focus:ring-primary-500',
    error: 'border-danger-500 focus:border-danger-500 focus:ring-danger-500',
    success: 'border-success-500 focus:border-success-500 focus:ring-success-500',
    ghost: 'border-transparent bg-gray-50 focus:bg-white focus:border-primary-500 focus:ring-primary-500',
  },

  size: {
    sm: 'h-8 px-2 text-xs',
    default: 'h-10 px-3 text-sm',
    lg: 'h-12 px-4 text-base',
  },
};

// ================== INPUT PROPS ==================
export interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  variant?: keyof typeof inputVariants.variant;
  size?: keyof typeof inputVariants.size;
  label?: string;
  description?: string;
  error?: string;
  success?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  clearable?: boolean;
  loading?: boolean;
  containerClassName?: string;
}

// ================== INPUT COMPONENT ==================
export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      variant = 'default',
      size = 'default',
      type = 'text',
      label,
      description,
      error,
      success,
      leftIcon,
      rightIcon,
      clearable = false,
      loading = false,
      disabled,
      value,
      onChange,
      containerClassName,
      id,
      ...props
    },
    ref
  ) => {
    const [showPassword, setShowPassword] = useState(false);
    const [internalValue, setInternalValue] = useState(value || '');
    
    const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;
    const isPasswordType = type === 'password';
    const hasError = !!error;
    const hasSuccess = !!success && !hasError;
    const currentVariant = hasError ? 'error' : hasSuccess ? 'success' : variant;
    const hasValue = (value !== undefined ? value : internalValue).toString().length > 0;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = e.target.value;
      setInternalValue(newValue);
      onChange?.(e);
    };

    const handleClear = () => {
      const event = {
        target: { value: '' },
        currentTarget: { value: '' },
      } as React.ChangeEvent<HTMLInputElement>;
      
      setInternalValue('');
      onChange?.(event);
    };

    const togglePasswordVisibility = () => {
      setShowPassword(!showPassword);
    };

    const inputType = isPasswordType && showPassword ? 'text' : type;

    return (
      <div className={cn('space-y-1', containerClassName)}>
        {/* Label */}
        {label && (
          <label
            htmlFor={inputId}
            className={cn(
              'block text-sm font-medium',
              hasError ? 'text-danger-700' : 'text-gray-700'
            )}
          >
            {label}
          </label>
        )}

        {/* Input Container */}
        <div className="relative">
          {/* Left Icon */}
          {leftIcon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
              {leftIcon}
            </div>
          )}

          {/* Input */}
          <input
            ref={ref}
            id={inputId}
            type={inputType}
            value={value !== undefined ? value : internalValue}
            onChange={handleChange}
            disabled={disabled || loading}
            className={cn(
              inputVariants.base,
              inputVariants.variant[currentVariant],
              inputVariants.size[size],
              leftIcon && 'pl-10',
              (rightIcon || isPasswordType || clearable || hasError || hasSuccess) && 'pr-10',
              className
            )}
            {...props}
          />

          {/* Right Side Icons */}
          <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center space-x-1">
            {/* Loading Spinner */}
            {loading && (
              <motion.div
                className="h-4 w-4 border-2 border-gray-300 border-t-primary-600 rounded-full"
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
              />
            )}

            {/* Clear Button */}
            {clearable && hasValue && !loading && (
              <button
                type="button"
                onClick={handleClear}
                className="text-gray-400 hover:text-gray-600 transition-colors"
                tabIndex={-1}
              >
                <X className="h-4 w-4" />
              </button>
            )}

            {/* Password Toggle */}
            {isPasswordType && !loading && (
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="text-gray-400 hover:text-gray-600 transition-colors"
                tabIndex={-1}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            )}

            {/* Status Icons */}
            {!loading && !isPasswordType && !clearable && (
              <>
                {hasError && (
                  <AlertCircle className="h-4 w-4 text-danger-500" />
                )}
                {hasSuccess && (
                  <CheckCircle className="h-4 w-4 text-success-500" />
                )}
                {rightIcon}
              </>
            )}
          </div>
        </div>

        {/* Description */}
        {description && !error && !success && (
          <p className="text-xs text-gray-600">{description}</p>
        )}

        {/* Error Message */}
        <AnimatePresence>
          {error && (
            <motion.p
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="text-xs text-danger-600 flex items-center gap-1"
            >
              <AlertCircle className="h-3 w-3" />
              {error}
            </motion.p>
          )}
        </AnimatePresence>

        {/* Success Message */}
        <AnimatePresence>
          {success && (
            <motion.p
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="text-xs text-success-600 flex items-center gap-1"
            >
              <CheckCircle className="h-3 w-3" />
              {success}
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    );
  }
);

Input.displayName = 'Input';

// ================== SEARCH INPUT COMPONENT ==================
export interface SearchInputProps extends Omit<InputProps, 'leftIcon' | 'type'> {
  onSearch?: (query: string) => void;
  onClear?: () => void;
  searchOnEnter?: boolean;
}

export const SearchInput = forwardRef<HTMLInputElement, SearchInputProps>(
  (
    {
      onSearch,
      onClear,
      searchOnEnter = true,
      onChange,
      onKeyDown,
      placeholder = 'Поиск...',
      clearable = true,
      ...props
    },
    ref
  ) => {
    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (searchOnEnter && e.key === 'Enter') {
        const value = (e.target as HTMLInputElement).value;
        onSearch?.(value);
      }
      onKeyDown?.(e);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      if (!searchOnEnter) {
        onSearch?.(value);
      }
      onChange?.(e);
    };

    const handleClear = () => {
      onClear?.();
    };

    return (
      <Input
        ref={ref}
        type="search"
        placeholder={placeholder}
        leftIcon={<Search className="h-4 w-4" />}
        clearable={clearable}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        {...props}
      />
    );
  }
);

SearchInput.displayName = 'SearchInput';

// ================== TEXTAREA COMPONENT ==================
export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  description?: string;
  error?: string;
  success?: string;
  resize?: 'none' | 'vertical' | 'horizontal' | 'both';
  containerClassName?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    {
      className,
      label,
      description,
      error,
      success,
      resize = 'vertical',
      disabled,
      containerClassName,
      id,
      ...props
    },
    ref
  ) => {
    const textareaId = id || `textarea-${Math.random().toString(36).substr(2, 9)}`;
    const hasError = !!error;
    const hasSuccess = !!success && !hasError;

    const resizeClasses = {
      none: 'resize-none',
      vertical: 'resize-y',
      horizontal: 'resize-x',
      both: 'resize',
    };

    return (
      <div className={cn('space-y-1', containerClassName)}>
        {/* Label */}
        {label && (
          <label
            htmlFor={textareaId}
            className={cn(
              'block text-sm font-medium',
              hasError ? 'text-danger-700' : 'text-gray-700'
            )}
          >
            {label}
          </label>
        )}

        {/* Textarea */}
        <textarea
          ref={ref}
          id={textareaId}
          disabled={disabled}
          className={cn(
            'flex w-full rounded-lg border bg-white px-3 py-2 text-sm placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200',
            hasError
              ? 'border-danger-500 focus:border-danger-500 focus:ring-danger-500'
              : hasSuccess
              ? 'border-success-500 focus:border-success-500 focus:ring-success-500'
              : 'border-gray-300 focus:border-primary-500 focus:ring-primary-500',
            resizeClasses[resize],
            className
          )}
          {...props}
        />

        {/* Description */}
        {description && !error && !success && (
          <p className="text-xs text-gray-600">{description}</p>
        )}

        {/* Error Message */}
        <AnimatePresence>
          {error && (
            <motion.p
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="text-xs text-danger-600 flex items-center gap-1"
            >
              <AlertCircle className="h-3 w-3" />
              {error}
            </motion.p>
          )}
        </AnimatePresence>

        {/* Success Message */}
        <AnimatePresence>
          {success && (
            <motion.p
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="text-xs text-success-600 flex items-center gap-1"
            >
              <CheckCircle className="h-3 w-3" />
              {success}
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';

// ================== EXPORT ALL ==================
export default Input;