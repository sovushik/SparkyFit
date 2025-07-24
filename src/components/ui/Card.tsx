import React, { forwardRef } from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../utils';

// ================== CARD VARIANTS ==================
const cardVariants = {
  base: 'rounded-lg border bg-white text-gray-950 shadow-sm',
  
  variant: {
    default: 'border-gray-200',
    outlined: 'border-gray-300',
    elevated: 'border-gray-200 shadow-md',
    ghost: 'border-transparent bg-gray-50',
    gradient: 'border-transparent bg-gradient-to-br from-primary-50 to-secondary-50',
  },

  size: {
    sm: 'p-4',
    default: 'p-6',
    lg: 'p-8',
  },
};

// ================== CARD PROPS ==================
export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: keyof typeof cardVariants.variant;
  size?: keyof typeof cardVariants.size;
  hover?: boolean;
  clickable?: boolean;
  loading?: boolean;
  asChild?: boolean;
}

// ================== CARD COMPONENT ==================
export const Card = forwardRef<HTMLDivElement, CardProps>(
  (
    {
      className,
      variant = 'default',
      size = 'default',
      hover = false,
      clickable = false,
      loading = false,
      children,
      onClick,
      ...props
    },
    ref
  ) => {
    const Component = motion.div;

    const cardClass = cn(
      cardVariants.base,
      cardVariants.variant[variant],
      cardVariants.size[size],
      (hover || clickable) && 'transition-all duration-200',
      hover && 'hover:shadow-md hover:-translate-y-1',
      clickable && 'cursor-pointer hover:shadow-md hover:border-primary-300',
      loading && 'pointer-events-none opacity-50',
      className
    );

    const motionProps = (hover || clickable) ? {
      whileHover: { y: -2, boxShadow: '0 10px 25px -5px rgb(0 0 0 / 0.1), 0 4px 6px -2px rgb(0 0 0 / 0.05)' },
      whileTap: clickable ? { scale: 0.98 } : undefined,
    } : {};

    return (
      <Component
        ref={ref}
        className={cardClass}
        onClick={onClick}
        {...motionProps}
        {...props}
      >
        {loading ? (
          <div className="flex items-center justify-center min-h-[100px]">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
          </div>
        ) : (
          children
        )}
      </Component>
    );
  }
);

Card.displayName = 'Card';

// ================== CARD HEADER COMPONENT ==================
export interface CardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string;
  subtitle?: string;
  action?: React.ReactNode;
  border?: boolean;
}

export const CardHeader = forwardRef<HTMLDivElement, CardHeaderProps>(
  ({ className, title, subtitle, action, border = false, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'flex flex-col space-y-1.5',
          border && 'border-b border-gray-200 pb-4 mb-4',
          className
        )}
        {...props}
      >
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            {title && (
              <h3 className="text-lg font-semibold leading-none tracking-tight">
                {title}
              </h3>
            )}
            {subtitle && (
              <p className="text-sm text-gray-600">
                {subtitle}
              </p>
            )}
          </div>
          {action && <div className="flex items-center space-x-2">{action}</div>}
        </div>
        {children}
      </div>
    );
  }
);

CardHeader.displayName = 'CardHeader';

// ================== CARD CONTENT COMPONENT ==================
export interface CardContentProps extends React.HTMLAttributes<HTMLDivElement> {}

export const CardContent = forwardRef<HTMLDivElement, CardContentProps>(
  ({ className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn('text-sm', className)}
        {...props}
      />
    );
  }
);

CardContent.displayName = 'CardContent';

// ================== CARD FOOTER COMPONENT ==================
export interface CardFooterProps extends React.HTMLAttributes<HTMLDivElement> {
  border?: boolean;
  center?: boolean;
}

export const CardFooter = forwardRef<HTMLDivElement, CardFooterProps>(
  ({ className, border = false, center = false, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'flex items-center',
          center ? 'justify-center' : 'justify-between',
          border && 'border-t border-gray-200 pt-4 mt-4',
          className
        )}
        {...props}
      />
    );
  }
);

CardFooter.displayName = 'CardFooter';

// ================== STAT CARD COMPONENT ==================
export interface StatCardProps extends Omit<CardProps, 'children'> {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: React.ReactNode;
  trend?: {
    value: number;
    isPositive: boolean;
    label?: string;
  };
  color?: 'default' | 'primary' | 'success' | 'warning' | 'danger';
}

export const StatCard = forwardRef<HTMLDivElement, StatCardProps>(
  (
    {
      title,
      value,
      subtitle,
      icon,
      trend,
      color = 'default',
      className,
      ...props
    },
    ref
  ) => {
    const colorClasses = {
      default: 'text-gray-900',
      primary: 'text-primary-600',
      success: 'text-success-600',
      warning: 'text-warning-600',
      danger: 'text-danger-600',
    };

    const trendColorClasses = trend?.isPositive 
      ? 'text-success-600 bg-success-50' 
      : 'text-danger-600 bg-danger-50';

    return (
      <Card
        ref={ref}
        variant="elevated"
        hover
        className={cn('relative overflow-hidden', className)}
        {...props}
      >
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <p className="text-sm font-medium text-gray-600">{title}</p>
            <div className="space-y-1">
              <p className={cn('text-2xl font-bold', colorClasses[color])}>
                {value}
              </p>
              {subtitle && (
                <p className="text-xs text-gray-500">{subtitle}</p>
              )}
            </div>
            {trend && (
              <div className={cn(
                'inline-flex items-center px-2 py-1 rounded-full text-xs font-medium',
                trendColorClasses
              )}>
                <span className="mr-1">
                  {trend.isPositive ? '↗' : '↘'}
                </span>
                {Math.abs(trend.value)}%
                {trend.label && <span className="ml-1">{trend.label}</span>}
              </div>
            )}
          </div>
          {icon && (
            <div className={cn(
              'flex h-12 w-12 items-center justify-center rounded-lg',
              color === 'primary' && 'bg-primary-100 text-primary-600',
              color === 'success' && 'bg-success-100 text-success-600',
              color === 'warning' && 'bg-warning-100 text-warning-600',
              color === 'danger' && 'bg-danger-100 text-danger-600',
              color === 'default' && 'bg-gray-100 text-gray-600'
            )}>
              {icon}
            </div>
          )}
        </div>
      </Card>
    );
  }
);

StatCard.displayName = 'StatCard';

// ================== METRIC CARD COMPONENT ==================
export interface MetricCardProps extends Omit<CardProps, 'children'> {
  title: string;
  value: string | number;
  target?: string | number;
  progress?: number; // 0-100
  unit?: string;
  color?: 'default' | 'primary' | 'success' | 'warning' | 'danger';
  icon?: React.ReactNode;
}

export const MetricCard = forwardRef<HTMLDivElement, MetricCardProps>(
  (
    {
      title,
      value,
      target,
      progress,
      unit,
      color = 'primary',
      icon,
      className,
      ...props
    },
    ref
  ) => {
    const progressColors = {
      default: 'bg-gray-600',
      primary: 'bg-primary-600',
      success: 'bg-success-600',
      warning: 'bg-warning-600',
      danger: 'bg-danger-600',
    };

    return (
      <Card
        ref={ref}
        variant="default"
        className={cn('space-y-4', className)}
        {...props}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            {icon && (
              <div className={cn(
                'flex h-10 w-10 items-center justify-center rounded-lg',
                color === 'primary' && 'bg-primary-100 text-primary-600',
                color === 'success' && 'bg-success-100 text-success-600',
                color === 'warning' && 'bg-warning-100 text-warning-600',
                color === 'danger' && 'bg-danger-100 text-danger-600',
                color === 'default' && 'bg-gray-100 text-gray-600'
              )}>
                {icon}
              </div>
            )}
            <div>
              <h3 className="font-medium text-gray-900">{title}</h3>
              <div className="flex items-baseline space-x-1">
                <span className="text-2xl font-bold text-gray-900">{value}</span>
                {unit && <span className="text-sm text-gray-500">{unit}</span>}
                {target && (
                  <span className="text-sm text-gray-500">/ {target}{unit}</span>
                )}
              </div>
            </div>
          </div>
        </div>

        {progress !== undefined && (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Прогресс</span>
              <span className="font-medium">{Math.round(progress)}%</span>
            </div>
            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
              <motion.div
                className={cn('h-full rounded-full', progressColors[color])}
                initial={{ width: 0 }}
                animate={{ width: `${Math.min(progress, 100)}%` }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
              />
            </div>
          </div>
        )}
      </Card>
    );
  }
);

MetricCard.displayName = 'MetricCard';

// ================== EXPORT ALL ==================
export default Card;