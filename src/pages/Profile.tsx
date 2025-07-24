import React from 'react';
import { motion } from 'framer-motion';
import { Edit, Camera, Mail, Phone, MapPin, Calendar } from 'lucide-react';

// Components
import { Button } from '../components/ui/Button';
import { Card, CardHeader, CardContent } from '../components/ui/Card';

// Hooks
import { useAuth } from '../hooks';

const Profile: React.FC = () => {
  const { user } = useAuth();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Профиль
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mt-1">
            Управление личной информацией
          </p>
        </div>
        <Button leftIcon={Edit}>
          Редактировать
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Card */}
        <div className="lg:col-span-1">
          <Card>
            <CardContent className="text-center p-6">
              <div className="relative inline-block mb-4">
                <div className="w-24 h-24 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                  {user?.firstName?.[0]}{user?.lastName?.[0]}
                </div>
                <Button
                  size="icon-sm"
                  className="absolute bottom-0 right-0 rounded-full"
                >
                  <Camera className="w-3 h-3" />
                </Button>
              </div>
              
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-1">
                {user?.firstName} {user?.lastName}
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                Фитнес энтузиаст
              </p>
              
              <div className="text-sm text-gray-500 dark:text-gray-400 space-y-2">
                <div className="flex items-center justify-center space-x-2">
                  <Calendar className="w-4 h-4" />
                  <span>Присоединился в ноябре 2024</span>
                </div>
                <div className="flex items-center justify-center space-x-2">
                  <MapPin className="w-4 h-4" />
                  <span>Москва, Россия</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Details Card */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader title="Личная информация" />
            <CardContent>
              <div className="text-center py-12">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  Профиль в разработке
                </h3>
                <p className="text-gray-600 dark:text-gray-300 mb-6">
                  Расширенная страница профиля находится в разработке. Скоро здесь будет 
                  полный функционал для управления личными данными, настройками и статистикой.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-md mx-auto">
                  <div className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <Mail className="w-5 h-5 text-gray-400" />
                    <div className="text-left">
                      <p className="text-xs text-gray-500 dark:text-gray-400">Email</p>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {user?.email}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <Phone className="w-5 h-5 text-gray-400" />
                    <div className="text-left">
                      <p className="text-xs text-gray-500 dark:text-gray-400">Телефон</p>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        Не указан
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </motion.div>
  );
};

export default Profile;