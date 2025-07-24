import React from 'react';
import { motion } from 'framer-motion';
import { Plus, Search, Filter, Utensils, Target, TrendingUp } from 'lucide-react';

// Components
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Card, CardHeader, CardContent, StatCard } from '../components/ui/Card';

const Nutrition: React.FC = () => {
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
            Питание
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mt-1">
            Отслеживайте калории и нутриенты
          </p>
        </div>
        <Button leftIcon={Plus}>
          Добавить продукт
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard
          title="Калории сегодня"
          value="1,847"
          target="2,200"
          icon={Target}
          trend={{ value: 5, isPositive: true }}
          color="primary"
        />
        <StatCard
          title="Белки"
          value="98г"
          target="120г"
          icon={TrendingUp}
          trend={{ value: 2, isPositive: true }}
          color="green"
        />
        <StatCard
          title="Углеводы"
          value="156г"
          target="200г"
          icon={Utensils}
          trend={{ value: 8, isPositive: false }}
          color="blue"
        />
      </div>

      {/* Search and Filters */}
      <div className="flex items-center space-x-4">
        <div className="flex-1">
          <Input
            type="text"
            placeholder="Поиск продуктов..."
            leftIcon={Search}
          />
        </div>
        <Button variant="outline" leftIcon={Filter}>
          Фильтры
        </Button>
      </div>

      {/* Content */}
      <Card>
        <CardHeader title="Сегодня" />
        <CardContent>
          <div className="text-center py-12">
            <Utensils className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              Питание в разработке
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              Модуль питания находится в разработке. Скоро здесь будет полный функционал 
              для отслеживания питания, калорий и нутриентов.
            </p>
            <Button>
              Добавить первый прием пищи
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default Nutrition;