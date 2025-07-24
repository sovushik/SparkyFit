import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Play, Edit, Share2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// Components
import { Button } from '../components/ui/Button';
import { Card, CardHeader, CardContent } from '../components/ui/Card';

const WorkoutDetails: React.FC = () => {
  const navigate = useNavigate();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate('/workouts')}
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Детали тренировки
            </h1>
            <p className="text-gray-600 dark:text-gray-300 mt-1">
              Просмотр и редактирование тренировки
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" leftIcon={Edit}>
            Редактировать
          </Button>
          <Button variant="outline" leftIcon={Share2}>
            Поделиться
          </Button>
          <Button leftIcon={Play}>
            Начать тренировку
          </Button>
        </div>
      </div>

      {/* Content */}
      <Card>
        <CardHeader title="Информация о тренировке" />
        <CardContent>
          <div className="text-center py-12">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              Детали тренировки в разработке
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              Эта страница находится в разработке.
            </p>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default WorkoutDetails;