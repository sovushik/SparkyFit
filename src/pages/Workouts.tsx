import React from 'react';
import { motion } from 'framer-motion';
import { Plus, Search, Filter, Dumbbell, Clock, Flame } from 'lucide-react';

// Components
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Card, CardHeader, CardContent, StatCard } from '../components/ui/Card';

const Workouts: React.FC = () => {
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
            Тренировки
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mt-1">
            Планируйте и отслеживайте тренировки
          </p>
        </div>
        <Button leftIcon={Plus}>
          Новая тренировка
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard
          title="Тренировок в неделю"
          value="4"
          target="5"
          icon={Dumbbell}
          trend={{ value: 15, isPositive: true }}
          color="primary"
        />
        <StatCard
          title="Время тренировки"
          value="45 мин"
          target="60 мин"
          icon={Clock}
          trend={{ value: 5, isPositive: true }}
          color="blue"
        />
        <StatCard
          title="Сожжено калорий"
          value="320"
          target="400"
          icon={Flame}
          trend={{ value: 12, isPositive: true }}
          color="orange"
        />
      </div>

      {/* Search and Filters */}
      <div className="flex items-center space-x-4">
        <div className="flex-1">
          <Input
            type="text"
            placeholder="Поиск тренировок и упражнений..."
            leftIcon={Search}
          />
        </div>
        <Button variant="outline" leftIcon={Filter}>
          Фильтры
        </Button>
      </div>

      {/* Content */}
      <Card>
        <CardHeader title="Мои тренировки" />
        <CardContent>
          <div className="text-center py-12">
            <Dumbbell className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              Тренировки в разработке
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              Модуль тренировок находится в разработке. Скоро здесь будет полный функционал 
              для планирования тренировок и отслеживания прогресса.
            </p>
            <Button>
              Создать первую тренировку
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default Workouts;