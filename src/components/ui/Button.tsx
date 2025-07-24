import React, { forwardRef } from 'react';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import { cn } from '../../utils';

// ================== BUTTON VARIANTS ==================
const buttonVariants = {
  // Base styles
  base: 'inline-flex items-center justify-center rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
  
  // Variant styles
  variant: {
    default: 'bg-primary-600 text-white hover:bg-primary-700 focus:ring-primary-500 shadow-sm',
    destructive: 'bg-danger-600 text-white hover:bg-danger-700 focus:ring-danger-500 shadow-sm',
    outline: 'border border-gray-300 bg-white text-gray-900 hover:bg-gray-50 focus:ring-primary-500 shadow-sm',
    secondary: 'bg-gray-100 text-gray-900 hover:bg-gray-200 focus:ring-gray-500 shadow-sm',
    ghost: 'text-gray-900 hover:bg-gray-100 focus:ring-gray-500',
    link: 'text-primary-600 underline-offset-4 hover:underline focus:ring-primary-500',
    success: 'bg-success-600 text-white hover:bg-success-700 focus:ring-success-500 shadow-sm',
    warning: 'bg-warning-600 text-white hover:bg-warning-700 focus:ring-warning-500 shadow-sm',
  },
  
  // Size styles
  size: {
    sm: 'h-8 px-3 text-sm',
    default: 'h-10 px-4 py-2',
    lg: 'h-12 px-6 text-lg',
    xl: 'h-14 px-8 text-xl',
    icon: 'h-10 w-10',
    'icon-sm': 'h-8 w-8',
    'icon-lg': 'h-12 w-12',
  },
};

// ================== BUTTON PROPS ==================
export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: keyof typeof buttonVariants.variant;
  size?: keyof typeof buttonVariants.size;
  loading?: boolean;
  loadingText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
  asChild?: boolean;
  href?: string;
  external?: boolean;
}

// ================== MOTION VARIANTS ==================
const motionVariants = {
  tap: { scale: 0.98 },
  hover: { scale: 1.02 },
};

// ================== BUTTON COMPONENT ==================
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = 'default',
      size = 'default',
      loading = false,
      loadingText,
      leftIcon,
      rightIcon,
      fullWidth = false,
      disabled,
      children,
      onClick,
      href,
      external = false,
      ...props
    },
    ref
  ) => {
    const isDisabled = disabled || loading;
    
    const buttonClass = cn(
      buttonVariants.base,
      buttonVariants.variant[variant],
      buttonVariants.size[size],
      fullWidth && 'w-full',
      className
    );

    const content = (
      <>
        {loading && (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        )}
        {!loading && leftIcon && (
          <span className="mr-2">{leftIcon}</span>
        )}
        <span>
          {loading && loadingText ? loadingText : children}
        </span>
        {!loading && rightIcon && (
          <span className="ml-2">{rightIcon}</span>
        )}
      </>
    );

    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      if (isDisabled) return;
      onClick?.(e);
    };

    // If href is provided, render as a link
    if (href) {
      const linkProps = external 
        ? { target: '_blank', rel: 'noopener noreferrer' }
        : {};

      return (
        <motion.a
          href={href}
          className={buttonClass}
          whileTap={motionVariants.tap}
          whileHover={!isDisabled ? motionVariants.hover : undefined}
          {...linkProps}
        >
          {content}
        </motion.a>
      );
    }

    return (
      <motion.button
        ref={ref}
        className={buttonClass}
        disabled={isDisabled}
        onClick={handleClick}
        whileTap={!isDisabled ? motionVariants.tap : undefined}
        whileHover={!isDisabled ? motionVariants.hover : undefined}
        {...props}
      >
        {content}
      </motion.button>
    );
  }
);

Button.displayName = 'Button';

// ================== ICON BUTTON COMPONENT ==================
export interface IconButtonProps extends Omit<ButtonProps, 'leftIcon' | 'rightIcon' | 'children'> {
  icon: React.ReactNode;
  label?: string;
  tooltip?: string;
}

export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(
  ({ icon, label, tooltip, size = 'icon', ...props }, ref) => {
    return (
      <Button
        ref={ref}
        size={size}
        title={tooltip || label}
        aria-label={label}
        {...props}
      >
        {icon}
      </Button>
    );
  }
);

IconButton.displayName = 'IconButton';

// ================== BUTTON GROUP COMPONENT ==================
export interface ButtonGroupProps {
  children: React.ReactNode;
  className?: string;
  orientation?: 'horizontal' | 'vertical';
  size?: keyof typeof buttonVariants.size;
  variant?: keyof typeof buttonVariants.variant;
}

export const ButtonGroup: React.FC<ButtonGroupProps> = ({
  children,
  className,
  orientation = 'horizontal',
  size,
  variant,
}) => {
  const groupClass = cn(
    'inline-flex',
    orientation === 'horizontal' ? 'flex-row' : 'flex-col',
    orientation === 'horizontal' 
      ? '[&>*:not(:first-child)]:ml-0 [&>*:not(:first-child)]:rounded-l-none [&>*:not(:last-child)]:rounded-r-none' 
      : '[&>*:not(:first-child)]:mt-0 [&>*:not(:first-child)]:rounded-t-none [&>*:not(:last-child)]:rounded-b-none',
    className
  );

  const enhancedChildren = React.Children.map(children, (child) => {
    if (React.isValidElement(child) && child.type === Button) {
      return React.cloneElement(child as React.ReactElement<ButtonProps>, {
        size: child.props.size || size,
        variant: child.props.variant || variant,
      });
    }
    return child;
  });

  return (
    <div className={groupClass} role="group">
      {enhancedChildren}
    </div>
  );
};

// ================== FLOATING ACTION BUTTON ==================
export interface FabProps extends Omit<ButtonProps, 'variant' | 'size'> {
  position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';
  size?: 'default' | 'lg';
}

export const Fab: React.FC<FabProps> = ({
  position = 'bottom-right',
  size = 'default',
  className,
  children,
  ...props
}) => {
  const positionClasses = {
    'bottom-right': 'fixed bottom-6 right-6',
    'bottom-left': 'fixed bottom-6 left-6',
    'top-right': 'fixed top-6 right-6',
    'top-left': 'fixed top-6 left-6',
  };

  const sizeClasses = {
    default: 'h-14 w-14',
    lg: 'h-16 w-16',
  };

  return (
    <motion.div
      className={cn(positionClasses[position], 'z-50')}
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
    >
      <Button
        variant="default"
        className={cn(
          'rounded-full shadow-lg',
          sizeClasses[size],
          className
        )}
        {...props}
      >
        {children}
      </Button>
    </motion.div>
  );
};

// ================== EXPORT ALL ==================
export default Button;