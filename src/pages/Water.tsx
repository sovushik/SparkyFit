import React from 'react';
import { motion } from 'framer-motion';
import { Plus, Droplet, Target, TrendingUp } from 'lucide-react';

// Components
import { Button } from '../components/ui/Button';
import { Card, CardHeader, CardContent, StatCard } from '../components/ui/Card';

const Water: React.FC = () => {
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
            Вода
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mt-1">
            Отслеживайте потребление воды
          </p>
        </div>
        <Button leftIcon={Plus}>
          Добавить воду
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard
          title="Сегодня выпито"
          value="1.2 л"
          target="2.5 л"
          icon={Droplet}
          trend={{ value: 10, isPositive: true }}
          color="blue"
        />
        <StatCard
          title="Цель на день"
          value="2.5 л"
          target="2.5 л"
          icon={Target}
          trend={{ value: 0, isPositive: true }}
          color="green"
        />
        <StatCard
          title="Среднее в неделю"
          value="2.1 л"
          target="2.5 л"
          icon={TrendingUp}
          trend={{ value: 8, isPositive: true }}
          color="primary"
        />
      </div>

      {/* Content */}
      <Card>
        <CardHeader title="Потребление воды" />
        <CardContent>
          <div className="text-center py-12">
            <Droplet className="w-16 h-16 text-blue-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              Отслеживание воды в разработке
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              Модуль отслеживания воды находится в разработке. Скоро здесь будет 
              удобный интерфейс для мониторинга ежедневного потребления воды.
            </p>
            <Button>
              Добавить первый стакан
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default Water;