import React from 'react';
import { motion } from 'framer-motion';
import { 
  Settings as SettingsIcon, 
  Moon, 
  Sun, 
  Bell, 
  Shield, 
  Download,
  Smartphone,
  Globe,
  Database
} from 'lucide-react';

// Components
import { Card, CardHeader, CardContent } from '../components/ui/Card';

// Store
import { useAppStore } from '../store';

const Settings: React.FC = () => {
  const { theme, setTheme, updateSettings } = useAppStore();

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    
    if (newTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Настройки
        </h1>
        <p className="text-gray-600 dark:text-gray-300 mt-1">
          Персонализация и конфигурация приложения
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Appearance Settings */}
        <Card>
          <CardHeader title="Внешний вид" />
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                {theme === 'dark' ? (
                  <Moon className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                ) : (
                  <Sun className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                )}
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">
                    Темная тема
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Переключение между светлой и темной темой
                  </p>
                </div>
              </div>
              <button
                onClick={toggleTheme}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  theme === 'dark' ? 'bg-primary-600' : 'bg-gray-200 dark:bg-gray-700'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    theme === 'dark' ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          </CardContent>
        </Card>

        {/* Notifications */}
        <Card>
          <CardHeader title="Уведомления" />
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Bell className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">
                    Push уведомления
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Получать уведомления о тренировках и целях
                  </p>
                </div>
              </div>
              <button
                className="relative inline-flex h-6 w-11 items-center rounded-full bg-primary-600"
              >
                <span className="inline-block h-4 w-4 transform rounded-full bg-white translate-x-6" />
              </button>
            </div>
          </CardContent>
        </Card>

        {/* Privacy & Security */}
        <Card>
          <CardHeader title="Конфиденциальность и безопасность" />
          <CardContent>
            <div className="text-center py-8">
              <Shield className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                Настройки безопасности
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Расширенные настройки безопасности находятся в разработке
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Data & Storage */}
        <Card>
          <CardHeader title="Данные и хранилище" />
          <CardContent>
            <div className="text-center py-8">
              <Database className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                Управление данными
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Экспорт, импорт и управление данными находятся в разработке
              </p>
            </div>
          </CardContent>
        </Card>

        {/* PWA Settings */}
        <Card>
          <CardHeader title="Приложение (PWA)" />
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-3">
              <Smartphone className="w-5 h-5 text-primary-600 dark:text-primary-400" />
              <div>
                <p className="font-medium text-gray-900 dark:text-white">
                  Progressive Web App
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  SparkyFit работает как нативное приложение
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Download className="w-5 h-5 text-green-600 dark:text-green-400" />
              <div>
                <p className="font-medium text-gray-900 dark:text-white">
                  Автообновления
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Приложение обновляется автоматически
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Language & Region */}
        <Card>
          <CardHeader title="Язык и регион" />
          <CardContent>
            <div className="text-center py-8">
              <Globe className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                Локализация
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Настройки языка и региона находятся в разработке
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Development Notice */}
      <Card>
        <CardContent className="text-center py-8">
          <SettingsIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            Расширенные настройки в разработке
          </h3>
          <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Полная система настроек находится в разработке. Скоро здесь будут доступны 
            настройки профиля, целей, уведомлений, интеграций, экспорта данных и многое другое.
          </p>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default Settings;