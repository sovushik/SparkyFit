import React from 'react';
import { Outlet } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Zap } from 'lucide-react';

const AuthLayout: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex">
      {/* Left side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 xl:w-3/5 relative overflow-hidden">
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="flex flex-col justify-center px-12 xl:px-20 w-full relative z-10"
        >
          {/* Logo */}
          <div className="flex items-center space-x-4 mb-8">
            <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-br from-primary-500 to-primary-600 rounded-2xl shadow-lg">
              <Zap className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl xl:text-4xl font-bold text-gray-900 dark:text-white">
                SparkyFit
              </h1>
              <p className="text-lg text-gray-600 dark:text-gray-300">
                Фитнес платформа
              </p>
            </div>
          </div>

          {/* Hero text */}
          <div className="mb-12">
            <h2 className="text-4xl xl:text-5xl font-bold text-gray-900 dark:text-white mb-6 leading-tight">
              Достигайте новых{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-500 to-secondary-500">
                высот
              </span>{' '}
              в фитнесе
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 leading-relaxed">
              Умная платформа для отслеживания тренировок, питания и достижения целей.
              С персональным AI тренером ваш путь к идеальной форме станет проще и эффективнее.
            </p>
          </div>

          {/* Features */}
          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="flex items-center space-x-4"
            >
              <div className="flex items-center justify-center w-12 h-12 bg-primary-100 dark:bg-primary-900/30 rounded-xl">
                <span className="text-2xl">🎯</span>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Умные цели
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Ставьте цели и отслеживайте прогресс в реальном времени
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="flex items-center space-x-4"
            >
              <div className="flex items-center justify-center w-12 h-12 bg-secondary-100 dark:bg-secondary-900/30 rounded-xl">
                <span className="text-2xl">🤖</span>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  AI Тренер
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Персональные рекомендации на основе ваших данных
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="flex items-center space-x-4"
            >
              <div className="flex items-center justify-center w-12 h-12 bg-success-100 dark:bg-success-900/30 rounded-xl">
                <span className="text-2xl">📊</span>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Аналитика
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Подробная статистика и визуализация прогресса
                </p>
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* Background decoration */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-20 w-32 h-32 bg-primary-500 rounded-full blur-xl"></div>
          <div className="absolute bottom-40 right-20 w-40 h-40 bg-secondary-500 rounded-full blur-xl"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-60 h-60 bg-gradient-to-r from-primary-400 to-secondary-400 rounded-full blur-2xl"></div>
        </div>
      </div>

      {/* Right side - Auth form */}
      <div className="w-full lg:w-1/2 xl:w-2/5 flex flex-col">
        {/* Mobile logo */}
        <div className="lg:hidden flex items-center justify-center pt-8 pb-4">
          <div className="flex items-center space-x-3">
            <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl">
              <Zap className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                SparkyFit
              </h1>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Фитнес платформа
              </p>
            </div>
          </div>
        </div>

        {/* Form container */}
        <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="w-full max-w-md"
          >
            <Outlet />
          </motion.div>
        </div>

        {/* Footer */}
        <div className="p-4 text-center">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            © 2024 SparkyFit. Все права защищены.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;