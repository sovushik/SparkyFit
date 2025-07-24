import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle, AlertCircle, AlertTriangle, Info } from 'lucide-react';

// Store
import { useAppStore } from '../store';

// Types
import { Notification } from '../types';

// Utils
import { cn } from '../utils';

const NotificationSystem: React.FC = () => {
  const { notifications, removeNotification } = useAppStore();

  const getIcon = (type: Notification['type']) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="w-5 h-5" />;
      case 'error':
        return <AlertCircle className="w-5 h-5" />;
      case 'warning':
        return <AlertTriangle className="w-5 h-5" />;
      case 'info':
      default:
        return <Info className="w-5 h-5" />;
    }
  };

  const getStyles = (type: Notification['type']) => {
    switch (type) {
      case 'success':
        return {
          container: 'bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800',
          icon: 'text-green-600 dark:text-green-400',
          title: 'text-green-900 dark:text-green-100',
          message: 'text-green-700 dark:text-green-200',
          closeButton: 'text-green-500 hover:text-green-600 dark:text-green-400 dark:hover:text-green-300'
        };
      case 'error':
        return {
          container: 'bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-800',
          icon: 'text-red-600 dark:text-red-400',
          title: 'text-red-900 dark:text-red-100',
          message: 'text-red-700 dark:text-red-200',
          closeButton: 'text-red-500 hover:text-red-600 dark:text-red-400 dark:hover:text-red-300'
        };
      case 'warning':
        return {
          container: 'bg-yellow-50 border-yellow-200 dark:bg-yellow-900/20 dark:border-yellow-800',
          icon: 'text-yellow-600 dark:text-yellow-400',
          title: 'text-yellow-900 dark:text-yellow-100',
          message: 'text-yellow-700 dark:text-yellow-200',
          closeButton: 'text-yellow-500 hover:text-yellow-600 dark:text-yellow-400 dark:hover:text-yellow-300'
        };
      case 'info':
      default:
        return {
          container: 'bg-blue-50 border-blue-200 dark:bg-blue-900/20 dark:border-blue-800',
          icon: 'text-blue-600 dark:text-blue-400',
          title: 'text-blue-900 dark:text-blue-100',
          message: 'text-blue-700 dark:text-blue-200',
          closeButton: 'text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300'
        };
    }
  };

  const handleClose = (id: string) => {
    removeNotification(id);
  };

  // Auto-remove notifications after their duration
  React.useEffect(() => {
    const timers: NodeJS.Timeout[] = [];

    notifications.forEach((notification) => {
      if (notification.duration && notification.duration > 0) {
        const timer = setTimeout(() => {
          removeNotification(notification.id);
        }, notification.duration);
        timers.push(timer);
      }
    });

    return () => {
      timers.forEach(clearTimeout);
    };
  }, [notifications, removeNotification]);

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2 max-w-sm w-full pointer-events-none">
      <AnimatePresence>
        {notifications.slice(0, 5).map((notification) => {
          const styles = getStyles(notification.type);
          
          return (
            <motion.div
              key={notification.id}
              initial={{ opacity: 0, x: 300, scale: 0.9 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 300, scale: 0.9 }}
              transition={{
                type: 'spring',
                stiffness: 300,
                damping: 30
              }}
              className={cn(
                'pointer-events-auto rounded-lg border p-4 shadow-lg backdrop-blur-sm',
                styles.container
              )}
            >
              <div className="flex items-start space-x-3">
                {/* Icon */}
                <div className={cn('flex-shrink-0', styles.icon)}>
                  {getIcon(notification.type)}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  {notification.title && (
                    <p className={cn('text-sm font-medium', styles.title)}>
                      {notification.title}
                    </p>
                  )}
                  <p className={cn('text-sm', styles.message, notification.title && 'mt-1')}>
                    {notification.message}
                  </p>
                  
                  {/* Actions */}
                  {notification.actions && notification.actions.length > 0 && (
                    <div className="mt-3 flex space-x-2">
                      {notification.actions.map((action, index) => (
                        <button
                          key={index}
                          onClick={() => {
                            action.handler();
                            if (action.closeOnClick !== false) {
                              handleClose(notification.id);
                            }
                          }}
                          className={cn(
                            'text-xs font-medium px-2 py-1 rounded border transition-colors',
                            action.variant === 'primary' ? styles.icon : styles.closeButton,
                            action.variant === 'primary' 
                              ? 'border-current bg-current bg-opacity-10 hover:bg-opacity-20'
                              : 'border-current hover:bg-current hover:bg-opacity-10'
                          )}
                        >
                          {action.label}
                        </button>
                      ))}
                    </div>
                  )}

                  {/* Timestamp */}
                  {notification.showTimestamp && (
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                      {new Date(notification.timestamp).toLocaleTimeString('ru-RU', {
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  )}
                </div>

                {/* Close Button */}
                <button
                  onClick={() => handleClose(notification.id)}
                  className={cn(
                    'flex-shrink-0 rounded-md p-1 transition-colors',
                    styles.closeButton
                  )}
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Progress Bar for timed notifications */}
              {notification.duration && notification.duration > 0 && (
                <motion.div
                  className="mt-3 h-1 bg-current bg-opacity-20 rounded-full overflow-hidden"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  <motion.div
                    className="h-full bg-current"
                    initial={{ width: '100%' }}
                    animate={{ width: '0%' }}
                    transition={{
                      duration: notification.duration / 1000,
                      ease: 'linear'
                    }}
                  />
                </motion.div>
              )}
            </motion.div>
          );
        })}
      </AnimatePresence>

      {/* Overflow indicator */}
      {notifications.length > 5 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="pointer-events-auto bg-gray-800 dark:bg-gray-200 text-white dark:text-gray-800 text-xs px-3 py-2 rounded-full text-center font-medium"
        >
          +{notifications.length - 5} уведомлений
        </motion.div>
      )}
    </div>
  );
};

export default NotificationSystem;