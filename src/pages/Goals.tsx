import React from 'react';
import { motion } from 'framer-motion';
import { Plus, Target, TrendingUp, CheckCircle } from 'lucide-react';

// Components
import { Button } from '../components/ui/Button';
import { Card, CardHeader, CardContent, StatCard } from '../components/ui/Card';

const Goals: React.FC = () => {
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
            Цели
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mt-1">
            Ставьте и достигайте фитнес-целей
          </p>
        </div>
        <Button leftIcon={Plus}>
          Новая цель
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard
          title="Активные цели"
          value="3"
          target="5"
          icon={Target}
          trend={{ value: 20, isPositive: true }}
          color="primary"
        />
        <StatCard
          title="Выполнено целей"
          value="7"
          target="10"
          icon={CheckCircle}
          trend={{ value: 15, isPositive: true }}
          color="green"
        />
        <StatCard
          title="Средний прогресс"
          value="68%"
          target="80%"
          icon={TrendingUp}
          trend={{ value: 12, isPositive: true }}
          color="blue"
        />
      </div>

      {/* Content */}
      <Card>
        <CardHeader title="Мои цели" />
        <CardContent>
          <div className="text-center py-12">
            <Target className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              Цели в разработке
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              Модуль целей находится в разработке. Скоро здесь будет умная система 
              постановки и отслеживания фитнес-целей с мотивационными элементами.
            </p>
            <Button>
              Поставить первую цель
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default Goals;