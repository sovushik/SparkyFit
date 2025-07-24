import React, { useState, useEffect } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Lock, CheckCircle, AlertCircle, ArrowLeft } from 'lucide-react';
import toast from 'react-hot-toast';

// Components
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';

// Utils
import { validationUtils } from '../../utils';
import { authService } from '../../utils/api';

interface ResetPasswordForm {
  password: string;
  confirmPassword: string;
}

const ResetPassword: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isValidToken, setIsValidToken] = useState<boolean | null>(null);
  const [isResetComplete, setIsResetComplete] = useState(false);

  const token = searchParams.get('token');

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    watch
  } = useForm<ResetPasswordForm>({
    mode: 'onChange',
    defaultValues: {
      password: '',
      confirmPassword: ''
    }
  });

  const watchPassword = watch('password');

  // Validate token on component mount
  useEffect(() => {
    const validateToken = async () => {
      if (!token) {
        setIsValidToken(false);
        return;
      }

      try {
        // Validate token with API
        await authService.validateResetToken(token);
        setIsValidToken(true);
      } catch (error) {
        console.error('Token validation failed:', error);
        setIsValidToken(false);
      }
    };

    validateToken();
  }, [token]);

  const onSubmit = async (data: ResetPasswordForm) => {
    if (!token) {
      toast.error('Неверная ссылка для сброса пароля');
      return;
    }

    setIsLoading(true);

    try {
      await authService.resetPassword(token, data.password);
      setIsResetComplete(true);
      toast.success('Пароль успешно изменен!');
    } catch (error: any) {
      console.error('Password reset failed:', error);
      
      if (error.message?.includes('Token expired')) {
        toast.error('Ссылка для сброса пароля истекла. Запросите новую');
      } else if (error.message?.includes('Invalid token')) {
        toast.error('Неверная ссылка для сброса пароля');
      } else if (error.message?.includes('Weak password')) {
        toast.error('Пароль слишком слабый');
      } else {
        toast.error(error.message || 'Произошла ошибка при сбросе пароля');
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Loading state while validating token
  if (isValidToken === null) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="w-full text-center"
      >
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
        <p className="text-gray-600 dark:text-gray-300">Проверяем ссылку...</p>
      </motion.div>
    );
  }

  // Invalid token state
  if (isValidToken === false) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full text-center"
      >
        {/* Error Icon */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
          className="mx-auto w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mb-6"
        >
          <AlertCircle className="w-8 h-8 text-red-600 dark:text-red-400" />
        </motion.div>

        {/* Error Message */}
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          Недействительная ссылка
        </h2>
        <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
          Ссылка для сброса пароля недействительна или истекла. 
          Пожалуйста, запросите новую ссылку.
        </p>

        {/* Actions */}
        <div className="space-y-4">
          <Link to="/auth/forgot-password">
            <Button variant="default" fullWidth>
              Запросить новую ссылку
            </Button>
          </Link>
          
          <Link to="/auth/login">
            <Button variant="ghost" fullWidth leftIcon={ArrowLeft}>
              Вернуться к входу
            </Button>
          </Link>
        </div>
      </motion.div>
    );
  }

  // Success state
  if (isResetComplete) {
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
          Пароль изменен!
        </h2>
        <p className="text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">
          Ваш пароль был успешно изменен. Теперь вы можете войти в свой аккаунт 
          с новым паролем.
        </p>

        {/* Login Button */}
        <Button
          onClick={() => navigate('/auth/login')}
          fullWidth
        >
          Войти в аккаунт
        </Button>
      </motion.div>
    );
  }

  // Reset password form
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
          Создайте новый пароль
        </h2>
        <p className="text-gray-600 dark:text-gray-300">
          Создайте надежный пароль для защиты вашего аккаунта
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* New Password */}
        <Input
          label="Новый пароль"
          type={showPassword ? 'text' : 'password'}
          leftIcon={Lock}
          rightIcon={showPassword ? EyeOff : Eye}
          onRightIconClick={() => setShowPassword(!showPassword)}
          placeholder="Создайте надежный пароль"
          description="Пароль должен содержать минимум 8 символов, включая буквы, цифры и специальные символы"
          error={errors.password?.message}
          {...register('password', {
            required: 'Пароль обязателен',
            minLength: {
              value: 8,
              message: 'Пароль должен содержать минимум 8 символов'
            },
            validate: (value) => {
              if (!validationUtils.isValidPassword(value)) {
                return 'Пароль должен содержать заглавные и строчные буквы, цифры и специальные символы';
              }
              return true;
            }
          })}
        />

        {/* Confirm Password */}
        <Input
          label="Подтвердите пароль"
          type={showConfirmPassword ? 'text' : 'password'}
          leftIcon={Lock}
          rightIcon={showConfirmPassword ? EyeOff : Eye}
          onRightIconClick={() => setShowConfirmPassword(!showConfirmPassword)}
          placeholder="Повторите новый пароль"
          error={errors.confirmPassword?.message}
          {...register('confirmPassword', {
            required: 'Подтверждение пароля обязательно',
            validate: (value) => {
              if (value !== watchPassword) {
                return 'Пароли не совпадают';
              }
              return true;
            }
          })}
        />

        {/* Security Tips */}
        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
          <h3 className="font-medium text-blue-900 dark:text-blue-100 mb-2">
            Советы по безопасности:
          </h3>
          <ul className="text-sm text-blue-700 dark:text-blue-200 space-y-1">
            <li>• Используйте уникальный пароль только для этого аккаунта</li>
            <li>• Включите комбинацию букв, цифр и символов</li>
            <li>• Избегайте очевидных паролей (даты рождения, имена)</li>
            <li>• Рассмотрите использование менеджера паролей</li>
          </ul>
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          fullWidth
          loading={isLoading}
          disabled={!isValid || isLoading}
        >
          Изменить пароль
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
    </motion.div>
  );
};

export default ResetPassword;