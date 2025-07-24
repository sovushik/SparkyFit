import React from 'react';
import { motion } from 'framer-motion';
import { 
  Activity, 
  Target, 
  Utensils, 
  Dumbbell, 
  TrendingUp, 
  Calendar,
  Award,
  Droplets,
  Plus,
  ArrowRight,
  Heart
} from 'lucide-react';
import { useAuth } from '../hooks';
import { StatCard, MetricCard, Card, CardHeader, CardContent } from '../components/ui/Card';
import Button from '../components/ui/Button';
import { Line, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

// ================== MOCK DATA ==================
const mockStats = {
  todayCalories: { current: 1650, target: 2000 },
  weeklyWorkouts: { completed: 4, planned: 5 },
  waterIntake: { current: 1800, target: 2500 },
  currentWeight: 72.5,
  weeklyProgress: 85,
};

const mockActivities = [
  { id: 1, type: 'workout', title: 'Силовая тренировка', time: '08:30', calories: 350 },
  { id: 2, type: 'meal', title: 'Завтрак добавлен', time: '09:15', calories: 420 },
  { id: 3, type: 'water', title: 'Выпито 500мл воды', time: '10:30', calories: 0 },
  { id: 4, type: 'meal', title: 'Обед добавлен', time: '13:00', calories: 680 },
];

const weeklyCaloriesData = {
  labels: ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'],
  datasets: [
    {
      label: 'Потреблено',
      data: [1800, 2100, 1950, 2200, 1750, 2400, 1650],
      borderColor: 'rgb(59, 130, 246)',
      backgroundColor: 'rgba(59, 130, 246, 0.1)',
      tension: 0.4,
    },
    {
      label: 'Цель',
      data: [2000, 2000, 2000, 2000, 2000, 2000, 2000],
      borderColor: 'rgb(156, 163, 175)',
      backgroundColor: 'rgba(156, 163, 175, 0.1)',
      borderDash: [5, 5],
      tension: 0.4,
    },
  ],
};

const macroDistribution = {
  labels: ['Белки', 'Жиры', 'Углеводы'],
  datasets: [
    {
      data: [25, 30, 45],
      backgroundColor: [
        'rgba(16, 185, 129, 0.8)',
        'rgba(245, 158, 11, 0.8)',
        'rgba(59, 130, 246, 0.8)',
      ],
      borderWidth: 0,
    },
  ],
};

// ================== DASHBOARD COMPONENT ==================
const Dashboard: React.FC = () => {
  const { user } = useAuth();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
      },
    },
  };

  return (
    <motion.div
      className="space-y-8"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Welcome Header */}
      <motion.div variants={itemVariants} className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Добро пожаловать, {user?.firstName}! 👋
          </h1>
          <p className="text-gray-600 mt-1">
            Сегодня {new Date().toLocaleDateString('ru-RU', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </p>
        </div>
        <Button className="btn-gradient">
          <Plus className="w-4 h-4 mr-2" />
          Добавить активность
        </Button>
      </motion.div>

      {/* Quick Stats */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Калории сегодня"
          value={`${mockStats.todayCalories.current}`}
          subtitle={`из ${mockStats.todayCalories.target} ккал`}
          icon={<Utensils className="w-6 h-6" />}
          color="primary"
          trend={{
            value: 12,
            isPositive: true,
            label: 'от вчера',
          }}
        />
        
        <StatCard
          title="Тренировки на неделе"
          value={`${mockStats.weeklyWorkouts.completed}/${mockStats.weeklyWorkouts.planned}`}
          subtitle="тренировок"
          icon={<Dumbbell className="w-6 h-6" />}
          color="success"
          trend={{
            value: 8,
            isPositive: true,
            label: 'от прошлой недели',
          }}
        />
        
        <StatCard
          title="Вода сегодня"
          value={`${mockStats.waterIntake.current}`}
          subtitle={`из ${mockStats.waterIntake.target} мл`}
          icon={<Droplets className="w-6 h-6" />}
          color="warning"
          trend={{
            value: 5,
            isPositive: false,
            label: 'от вчера',
          }}
        />
        
        <StatCard
          title="Текущий вес"
          value={`${mockStats.currentWeight} кг`}
          subtitle="целевой: 70 кг"
          icon={<TrendingUp className="w-6 h-6" />}
          color="danger"
          trend={{
            value: 2,
            isPositive: false,
            label: 'от прошлой недели',
          }}
        />
      </motion.div>

      {/* Progress Metrics */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <MetricCard
          title="Дневная норма калорий"
          value={mockStats.todayCalories.current}
          target={mockStats.todayCalories.target}
          progress={(mockStats.todayCalories.current / mockStats.todayCalories.target) * 100}
          unit=" ккал"
          color="primary"
          icon={<Target className="w-5 h-5" />}
        />
        
        <MetricCard
          title="Недельный прогресс"
          value={mockStats.weeklyProgress}
          progress={mockStats.weeklyProgress}
          unit="%"
          color="success"
          icon={<Award className="w-5 h-5" />}
        />
        
        <MetricCard
          title="Водный баланс"
          value={mockStats.waterIntake.current}
          target={mockStats.waterIntake.target}
          progress={(mockStats.waterIntake.current / mockStats.waterIntake.target) * 100}
          unit=" мл"
          color="warning"
          icon={<Droplets className="w-5 h-5" />}
        />
      </motion.div>

      {/* Charts Section */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Weekly Calories Chart */}
        <Card>
          <CardHeader
            title="Калории за неделю"
            subtitle="Потребление vs цель"
            action={
              <Button variant="ghost" size="sm">
                <Calendar className="w-4 h-4 mr-2" />
                7 дней
              </Button>
            }
          />
          <CardContent>
            <div className="h-64">
              <Line
                data={weeklyCaloriesData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      position: 'top' as const,
                    },
                  },
                  scales: {
                    y: {
                      beginAtZero: true,
                      grid: {
                        color: 'rgba(0, 0, 0, 0.1)',
                      },
                    },
                    x: {
                      grid: {
                        display: false,
                      },
                    },
                  },
                }}
              />
            </div>
          </CardContent>
        </Card>

        {/* Macro Distribution */}
        <Card>
          <CardHeader
            title="Распределение макросов"
            subtitle="Сегодня"
            action={
              <Button variant="ghost" size="sm">
                <Heart className="w-4 h-4 mr-2" />
                Подробнее
              </Button>
            }
          />
          <CardContent>
            <div className="h-64 flex items-center justify-center">
              <Doughnut
                data={macroDistribution}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      position: 'bottom' as const,
                    },
                  },
                }}
              />
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Recent Activity & Quick Actions */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <Card>
          <CardHeader
            title="Последняя активность"
            subtitle="Сегодня"
            action={
              <Button variant="ghost" size="sm">
                Все
                <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            }
          />
          <CardContent>
            <div className="space-y-4">
              {mockActivities.map((activity) => (
                <div key={activity.id} className="flex items-center space-x-3">
                  <div className={`
                    w-10 h-10 rounded-full flex items-center justify-center
                    ${activity.type === 'workout' ? 'bg-success-100 text-success-600' :
                      activity.type === 'meal' ? 'bg-primary-100 text-primary-600' :
                      'bg-warning-100 text-warning-600'}
                  `}>
                    {activity.type === 'workout' ? <Dumbbell className="w-5 h-5" /> :
                     activity.type === 'meal' ? <Utensils className="w-5 h-5" /> :
                     <Droplets className="w-5 h-5" />}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{activity.title}</p>
                    <p className="text-sm text-gray-500">{activity.time}</p>
                  </div>
                  {activity.calories > 0 && (
                    <span className="text-sm font-medium text-gray-600">
                      {activity.calories} ккал
                    </span>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader
            title="Быстрые действия"
            subtitle="Часто используемые функции"
          />
          <CardContent>
            <div className="grid grid-cols-2 gap-3">
              <Button variant="outline" className="h-20 flex-col">
                <Utensils className="w-6 h-6 mb-2" />
                <span className="text-sm">Добавить еду</span>
              </Button>
              <Button variant="outline" className="h-20 flex-col">
                <Dumbbell className="w-6 h-6 mb-2" />
                <span className="text-sm">Начать тренировку</span>
              </Button>
              <Button variant="outline" className="h-20 flex-col">
                <Droplets className="w-6 h-6 mb-2" />
                <span className="text-sm">Выпить воду</span>
              </Button>
              <Button variant="outline" className="h-20 flex-col">
                <Activity className="w-6 h-6 mb-2" />
                <span className="text-sm">Взвеситься</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* AI Coach Recommendation */}
      <motion.div variants={itemVariants}>
        <Card className="bg-gradient-to-r from-primary-50 to-secondary-50 border-primary-200">
          <CardContent className="p-6">
            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-primary-600 rounded-full flex items-center justify-center flex-shrink-0">
                <Activity className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 mb-2">
                  💡 Рекомендация от AI тренера
                </h3>
                <p className="text-gray-700 mb-4">
                  Сегодня вы недобрали 350 ккал до дневной нормы. Рекомендую добавить 
                  полезный перекус: горсть орехов или протеиновый коктейль.
                </p>
                <Button size="sm" className="mr-3">
                  Посмотреть советы
                </Button>
                <Button variant="outline" size="sm">
                  Открыть AI чат
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
};

export default Dashboard;