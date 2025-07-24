import React from 'react';
import { motion } from 'framer-motion';
import { Plus, TrendingUp, Scale, Target } from 'lucide-react';

// Components
import { Button } from '../components/ui/Button';
import { Card, CardHeader, CardContent, StatCard } from '../components/ui/Card';

const Measurements: React.FC = () => {
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
            Измерения
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mt-1">
            Отслеживайте изменения тела и прогресс
          </p>
        </div>
        <Button leftIcon={Plus}>
          Добавить измерение
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard
          title="Текущий вес"
          value="72.5 кг"
          target="70 кг"
          icon={Scale}
          trend={{ value: 2, isPositive: false }}
          color="primary"
        />
        <StatCard
          title="ИМТ"
          value="22.1"
          target="21.0"
          icon={Target}
          trend={{ value: 1, isPositive: false }}
          color="green"
        />
        <StatCard
          title="Прогресс"
          value="+2.5 кг"
          target="-2.5 кг"
          icon={TrendingUp}
          trend={{ value: 5, isPositive: true }}
          color="blue"
        />
      </div>

      {/* Content */}
      <Card>
        <CardHeader title="История измерений" />
        <CardContent>
          <div className="text-center py-12">
            <Scale className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              Измерения в разработке
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              Модуль измерений находится в разработке. Скоро здесь будет полный функционал 
              для отслеживания веса, объемов и других параметров тела.
            </p>
            <Button>
              Добавить первое измерение
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default Measurements;