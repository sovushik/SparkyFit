import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Mail, Lock, LogIn } from 'lucide-react';
import toast from 'react-hot-toast';

// Components
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';

// Hooks
import { useAuth } from '../../hooks';

// Types
import { LoginRequest } from '../../types';

// Utils
import { validationUtils } from '../../utils';

const Login: React.FC = () => {
  const { login } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    setError
  } = useForm<LoginRequest>({
    mode: 'onChange',
    defaultValues: {
      email: '',
      password: ''
    }
  });

  const onSubmit = async (data: LoginRequest) => {
    setIsLoading(true);
    
    try {
      await login(data);
      toast.success('Добро пожаловать в SparkyFit!');
    } catch (error: any) {
      console.error('Login failed:', error);
      
      // Handle specific error types
      if (error.message?.includes('Invalid credentials')) {
        setError('email', { message: 'Неверный email или пароль' });
        setError('password', { message: 'Неверный email или пароль' });
      } else if (error.message?.includes('Account not verified')) {
        toast.error('Пожалуйста, подтвердите свой email');
      } else if (error.message?.includes('Account locked')) {
        toast.error('Аккаунт заблокирован. Обратитесь в поддержку');
      } else {
        toast.error(error.message || 'Произошла ошибка при входе');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoLogin = async () => {
    setIsLoading(true);
    
    try {
      await login({
        email: 'demo@sparkyfit.ru',
        password: 'DemoPassword123!'
      });
      toast.success('Вход в демо-режиме');
    } catch (error: any) {
      toast.error('Демо-аккаунт недоступен');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full"
    >
      {/* Header */}
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Добро пожаловать!
        </h2>
        <p className="text-gray-600 dark:text-gray-300">
          Войдите в свой аккаунт, чтобы продолжить тренировки
        </p>
      </div>

      {/* Demo Login Button */}
      <div className="mb-6">
        <Button
          variant="outline"
          fullWidth
          onClick={handleDemoLogin}
          loading={isLoading}
          className="border-primary-200 text-primary-700 hover:bg-primary-50 dark:border-primary-700 dark:text-primary-300 dark:hover:bg-primary-900/20"
        >
          <span className="mr-2">🚀</span>
          Попробовать демо
        </Button>
      </div>

      {/* Divider */}
      <div className="relative mb-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-300 dark:border-gray-600" />
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-2 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400">
            или войдите с email
          </span>
        </div>
      </div>

      {/* Login Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Email */}
        <Input
          label="Email"
          type="email"
          leftIcon={Mail}
          placeholder="your@email.com"
          error={errors.email?.message}
          {...register('email', {
            required: 'Email обязателен',
            validate: (value) => validationUtils.isValidEmail(value) || 'Введите корректный email'
          })}
        />

        {/* Password */}
        <Input
          label="Пароль"
          type={showPassword ? 'text' : 'password'}
          leftIcon={Lock}
          rightIcon={showPassword ? EyeOff : Eye}
          onRightIconClick={() => setShowPassword(!showPassword)}
          placeholder="Введите пароль"
          error={errors.password?.message}
          {...register('password', {
            required: 'Пароль обязателен',
            minLength: {
              value: 6,
              message: 'Пароль должен содержать минимум 6 символов'
            }
          })}
        />

        {/* Forgot Password Link */}
        <div className="flex justify-end">
          <Link
            to="/auth/forgot-password"
            className="text-sm text-primary-600 hover:text-primary-500 dark:text-primary-400 dark:hover:text-primary-300 font-medium"
          >
            Забыли пароль?
          </Link>
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          fullWidth
          loading={isLoading}
          disabled={!isValid || isLoading}
          leftIcon={LogIn}
        >
          Войти
        </Button>
      </form>

      {/* Register Link */}
      <div className="mt-8 text-center">
        <p className="text-sm text-gray-600 dark:text-gray-300">
          Нет аккаунта?{' '}
          <Link
            to="/auth/register"
            className="font-medium text-primary-600 hover:text-primary-500 dark:text-primary-400 dark:hover:text-primary-300"
          >
            Зарегистрироваться
          </Link>
        </p>
      </div>

      {/* Social Login (Future) */}
      <div className="mt-8">
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300 dark:border-gray-600" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400">
              Скоро будет доступен вход через
            </span>
          </div>
        </div>
        
        <div className="mt-4 grid grid-cols-2 gap-3">
          <Button
            variant="outline"
            disabled
            className="opacity-50"
          >
            <span className="mr-2">🔵</span>
            VKontakte
          </Button>
          <Button
            variant="outline"
            disabled
            className="opacity-50"
          >
            <span className="mr-2">📱</span>
            Telegram
          </Button>
        </div>
      </div>
    </motion.div>
  );
};

export default Login;