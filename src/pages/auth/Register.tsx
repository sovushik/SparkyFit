import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Mail, Lock, User, UserPlus, Check, X } from 'lucide-react';
import toast from 'react-hot-toast';

// Components
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';

// Hooks
import { useAuth } from '../../hooks';

// Types
import { RegisterRequest } from '../../types';

// Utils
import { validationUtils } from '../../utils';

interface PasswordStrength {
  score: number;
  feedback: string[];
  color: string;
}

const Register: React.FC = () => {
  const { register: registerUser } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState<PasswordStrength>({
    score: 0,
    feedback: [],
    color: 'gray'
  });

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    watch,
    setError
  } = useForm<RegisterRequest & { confirmPassword: string }>({
    mode: 'onChange',
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      confirmPassword: ''
    }
  });

  const watchPassword = watch('password');

  // Password strength calculation
  React.useEffect(() => {
    if (!watchPassword) {
      setPasswordStrength({ score: 0, feedback: [], color: 'gray' });
      return;
    }

    const feedback: string[] = [];
    let score = 0;

    // Length check
    if (watchPassword.length >= 8) {
      score += 1;
    } else {
      feedback.push('Минимум 8 символов');
    }

    // Uppercase check
    if (/[A-Z]/.test(watchPassword)) {
      score += 1;
    } else {
      feedback.push('Заглавная буква');
    }

    // Lowercase check
    if (/[a-z]/.test(watchPassword)) {
      score += 1;
    } else {
      feedback.push('Строчная буква');
    }

    // Number check
    if (/[0-9]/.test(watchPassword)) {
      score += 1;
    } else {
      feedback.push('Цифра');
    }

    // Special character check
    if (/[^A-Za-z0-9]/.test(watchPassword)) {
      score += 1;
    } else {
      feedback.push('Специальный символ');
    }

    let color = 'red';
    if (score >= 4) color = 'green';
    else if (score >= 3) color = 'yellow';
    else if (score >= 2) color = 'orange';

    setPasswordStrength({ score, feedback, color });
  }, [watchPassword]);

  const getPasswordStrengthText = () => {
    if (passwordStrength.score === 0) return '';
    if (passwordStrength.score <= 2) return 'Слабый';
    if (passwordStrength.score <= 3) return 'Средний';
    if (passwordStrength.score <= 4) return 'Хороший';
    return 'Отличный';
  };

  const onSubmit = async (data: RegisterRequest & { confirmPassword: string }) => {
    setIsLoading(true);

    try {
      const { confirmPassword, ...registerData } = data;
      await registerUser(registerData);
      toast.success('Регистрация успешна! Проверьте email для подтверждения.');
    } catch (error: any) {
      console.error('Registration failed:', error);
      
      // Handle specific error types
      if (error.message?.includes('Email already exists')) {
        setError('email', { message: 'Пользователь с таким email уже существует' });
      } else if (error.message?.includes('Weak password')) {
        setError('password', { message: 'Пароль слишком слабый' });
      } else {
        toast.error(error.message || 'Произошла ошибка при регистрации');
      }
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
          Создать аккаунт
        </h2>
        <p className="text-gray-600 dark:text-gray-300">
          Присоединяйтесь к SparkyFit и начните свой путь к здоровью
        </p>
      </div>

      {/* Registration Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Name Fields */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Имя"
            type="text"
            leftIcon={User}
            placeholder="Иван"
            error={errors.firstName?.message}
            {...register('firstName', {
              required: 'Имя обязательно',
              minLength: {
                value: 2,
                message: 'Имя должно содержать минимум 2 символа'
              },
              pattern: {
                value: /^[a-zA-Zа-яА-Я\s]+$/,
                message: 'Имя должно содержать только буквы'
              }
            })}
          />

          <Input
            label="Фамилия"
            type="text"
            leftIcon={User}
            placeholder="Иванов"
            error={errors.lastName?.message}
            {...register('lastName', {
              required: 'Фамилия обязательна',
              minLength: {
                value: 2,
                message: 'Фамилия должна содержать минимум 2 символа'
              },
              pattern: {
                value: /^[a-zA-Zа-яА-Я\s]+$/,
                message: 'Фамилия должна содержать только буквы'
              }
            })}
          />
        </div>

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
        <div>
          <Input
            label="Пароль"
            type={showPassword ? 'text' : 'password'}
            leftIcon={Lock}
            rightIcon={showPassword ? EyeOff : Eye}
            onRightIconClick={() => setShowPassword(!showPassword)}
            placeholder="Создайте надежный пароль"
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

          {/* Password Strength Indicator */}
          {watchPassword && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="mt-3"
            >
              <div className="flex items-center justify-between text-sm mb-2">
                <span className="text-gray-600 dark:text-gray-300">
                  Надежность пароля
                </span>
                <span className={`font-medium ${
                  passwordStrength.color === 'green' ? 'text-green-600' :
                  passwordStrength.color === 'yellow' ? 'text-yellow-600' :
                  passwordStrength.color === 'orange' ? 'text-orange-600' :
                  'text-red-600'
                }`}>
                  {getPasswordStrengthText()}
                </span>
              </div>
              
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mb-3">
                <div
                  className={`h-2 rounded-full transition-all duration-300 ${
                    passwordStrength.color === 'green' ? 'bg-green-500' :
                    passwordStrength.color === 'yellow' ? 'bg-yellow-500' :
                    passwordStrength.color === 'orange' ? 'bg-orange-500' :
                    'bg-red-500'
                  }`}
                  style={{ width: `${(passwordStrength.score / 5) * 100}%` }}
                />
              </div>

              {passwordStrength.feedback.length > 0 && (
                <div className="grid grid-cols-2 gap-2 text-xs">
                  {['Минимум 8 символов', 'Заглавная буква', 'Строчная буква', 'Цифра', 'Специальный символ'].map((requirement) => {
                    const isMet = !passwordStrength.feedback.includes(requirement);
                    return (
                      <div
                        key={requirement}
                        className={`flex items-center space-x-1 ${
                          isMet ? 'text-green-600' : 'text-gray-500 dark:text-gray-400'
                        }`}
                      >
                        {isMet ? (
                          <Check className="w-3 h-3" />
                        ) : (
                          <X className="w-3 h-3" />
                        )}
                        <span>{requirement}</span>
                      </div>
                    );
                  })}
                </div>
              )}
            </motion.div>
          )}
        </div>

        {/* Confirm Password */}
        <Input
          label="Подтвердите пароль"
          type={showConfirmPassword ? 'text' : 'password'}
          leftIcon={Lock}
          rightIcon={showConfirmPassword ? EyeOff : Eye}
          onRightIconClick={() => setShowConfirmPassword(!showConfirmPassword)}
          placeholder="Повторите пароль"
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

        {/* Terms and Privacy */}
        <div className="text-sm text-gray-600 dark:text-gray-300">
          Создавая аккаунт, вы соглашаетесь с{' '}
          <a href="#" className="text-primary-600 hover:text-primary-500 dark:text-primary-400 dark:hover:text-primary-300 font-medium">
            Условиями использования
          </a>
          {' '}и{' '}
          <a href="#" className="text-primary-600 hover:text-primary-500 dark:text-primary-400 dark:hover:text-primary-300 font-medium">
            Политикой конфиденциальности
          </a>
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          fullWidth
          loading={isLoading}
          disabled={!isValid || isLoading}
          leftIcon={UserPlus}
        >
          Создать аккаунт
        </Button>
      </form>

      {/* Login Link */}
      <div className="mt-8 text-center">
        <p className="text-sm text-gray-600 dark:text-gray-300">
          Уже есть аккаунт?{' '}
          <Link
            to="/auth/login"
            className="font-medium text-primary-600 hover:text-primary-500 dark:text-primary-400 dark:hover:text-primary-300"
          >
            Войти
          </Link>
        </p>
      </div>
    </motion.div>
  );
};

export default Register;