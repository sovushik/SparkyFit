import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import { Mail, ArrowLeft, Send, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';

// Components
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';

// Utils
import { validationUtils } from '../../utils';
import { authService } from '../../utils/api';

interface ForgotPasswordForm {
  email: string;
}

const ForgotPassword: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isEmailSent, setIsEmailSent] = useState(false);
  const [sentEmail, setSentEmail] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors, isValid }
  } = useForm<ForgotPasswordForm>({
    mode: 'onChange',
    defaultValues: {
      email: ''
    }
  });

  const onSubmit = async (data: ForgotPasswordForm) => {
    setIsLoading(true);

    try {
      await authService.forgotPassword(data.email);
      setSentEmail(data.email);
      setIsEmailSent(true);
      toast.success('Инструкции по сбросу пароля отправлены на email');
    } catch (error: any) {
      console.error('Forgot password failed:', error);
      
      if (error.message?.includes('User not found')) {
        toast.error('Пользователь с таким email не найден');
      } else if (error.message?.includes('Too many requests')) {
        toast.error('Слишком много запросов. Попробуйте позже');
      } else {
        toast.error(error.message || 'Произошла ошибка при отправке email');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendEmail = async () => {
    setIsLoading(true);
    
    try {
      await authService.forgotPassword(sentEmail);
      toast.success('Email отправлен повторно');
    } catch (error: any) {
      toast.error('Не удалось отправить email повторно');
    } finally {
      setIsLoading(false);
    }
  };

  if (isEmailSent) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full text-center"
      >
        {/* Success Icon */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
          className="mx-auto w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mb-6"
        >
          <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
        </motion.div>

        {/* Success Message */}
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          Проверьте ваш email
        </h2>
        <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
          Мы отправили инструкции по сбросу пароля на{' '}
          <span className="font-medium text-gray-900 dark:text-white">
            {sentEmail}
          </span>
        </p>

        {/* Instructions */}
        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 mb-6 text-left">
          <h3 className="font-medium text-gray-900 dark:text-white mb-2">
            Что делать дальше:
          </h3>
          <ol className="text-sm text-gray-600 dark:text-gray-300 space-y-1">
            <li>1. Проверьте папку входящих в вашем email</li>
            <li>2. Если письма нет, проверьте папку "Спам"</li>
            <li>3. Перейдите по ссылке в письме</li>
            <li>4. Создайте новый пароль</li>
          </ol>
        </div>

        {/* Actions */}
        <div className="space-y-4">
          <Button
            variant="outline"
            fullWidth
            onClick={handleResendEmail}
            loading={isLoading}
          >
            Отправить повторно
          </Button>
          
          <Link to="/auth/login">
            <Button variant="ghost" fullWidth leftIcon={ArrowLeft}>
              Вернуться к входу
            </Button>
          </Link>
        </div>

        {/* Support */}
        <div className="mt-8 text-sm text-gray-500 dark:text-gray-400">
          Нужна помощь?{' '}
          <a 
            href="mailto:support@sparkyfit.ru" 
            className="text-primary-600 hover:text-primary-500 dark:text-primary-400 dark:hover:text-primary-300 font-medium"
          >
            Свяжитесь с поддержкой
          </a>
        </div>
      </motion.div>
    );
  }

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
          Забыли пароль?
        </h2>
        <p className="text-gray-600 dark:text-gray-300">
          Введите ваш email и мы отправим инструкции по восстановлению
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <Input
          label="Email"
          type="email"
          leftIcon={Mail}
          placeholder="your@email.com"
          description="Мы отправим ссылку для сброса пароля на этот email"
          error={errors.email?.message}
          {...register('email', {
            required: 'Email обязателен',
            validate: (value) => validationUtils.isValidEmail(value) || 'Введите корректный email'
          })}
        />

        <Button
          type="submit"
          fullWidth
          loading={isLoading}
          disabled={!isValid || isLoading}
          leftIcon={Send}
        >
          Отправить инструкции
        </Button>
      </form>

      {/* Back to Login */}
      <div className="mt-8 text-center">
        <Link
          to="/auth/login"
          className="inline-flex items-center text-sm text-primary-600 hover:text-primary-500 dark:text-primary-400 dark:hover:text-primary-300 font-medium"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Вернуться к входу
        </Link>
      </div>

      {/* Help Text */}
      <div className="mt-8 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
        <div className="flex items-start space-x-3">
          <div className="flex-shrink-0">
            <span className="text-2xl">💡</span>
          </div>
          <div className="text-sm">
            <p className="font-medium text-blue-900 dark:text-blue-100 mb-1">
              Совет по безопасности
            </p>
            <p className="text-blue-700 dark:text-blue-200">
              Если вы не запрашивали сброс пароля, просто проигнорируйте это письмо. 
              Ваш пароль останется неизменным.
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ForgotPassword;