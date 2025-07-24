import React from 'react';
import { motion } from 'framer-motion';
import { Bot, Send, Mic, Paperclip, Sparkles } from 'lucide-react';

// Components
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Card, CardHeader, CardContent } from '../components/ui/Card';

const AICoach: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6 h-full"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            AI Тренер
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mt-1">
            Персональный помощник для достижения ваших целей
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <div className="flex items-center space-x-2 text-sm text-green-600 dark:text-green-400">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span>AI онлайн</span>
          </div>
        </div>
      </div>

      {/* Chat Interface */}
      <div className="flex-1 flex flex-col h-[calc(100vh-200px)]">
        <Card className="flex-1 flex flex-col">
          <CardHeader>
            <div className="flex items-center space-x-3">
              <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full">
                <Bot className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white">
                  SparkyFit AI
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Ваш персональный тренер
                </p>
              </div>
            </div>
          </CardHeader>
          
          <CardContent className="flex-1 flex flex-col">
            {/* Chat Messages */}
            <div className="flex-1 space-y-4 overflow-y-auto mb-4">
              {/* Welcome Message */}
              <div className="flex items-start space-x-3">
                <div className="flex items-center justify-center w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex-shrink-0">
                  <Bot className="w-4 h-4 text-white" />
                </div>
                <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-3 max-w-md">
                  <p className="text-sm text-gray-900 dark:text-white">
                    Привет! 👋 Я ваш персональный AI тренер. Готов помочь вам достичь 
                    ваших фитнес-целей. О чем хотели бы поговорить?
                  </p>
                </div>
              </div>

              {/* Suggestions */}
              <div className="space-y-2">
                <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
                  Попробуйте спросить:
                </p>
                <div className="flex flex-wrap gap-2 justify-center">
                  {[
                    'Составь план тренировок',
                    'Как улучшить питание?',
                    'Анализ моего прогресса',
                    'Мотивационный совет'
                  ].map((suggestion, index) => (
                    <button
                      key={index}
                      className="px-3 py-1 bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 rounded-full text-xs hover:bg-primary-200 dark:hover:bg-primary-900/50 transition-colors"
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              </div>

              {/* Development Notice */}
              <div className="text-center py-8">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-purple-100 dark:bg-purple-900/30 rounded-full mb-4">
                  <Sparkles className="w-8 h-8 text-purple-600 dark:text-purple-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  AI Тренер в разработке
                </h3>
                <p className="text-gray-600 dark:text-gray-300 max-w-md mx-auto">
                  Интегрированный AI тренер на базе Ollama находится в разработке. 
                  Скоро здесь будет полноценный чат с персональными рекомендациями.
                </p>
              </div>
            </div>

            {/* Chat Input */}
            <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
              <div className="flex items-center space-x-2">
                <Button variant="ghost" size="icon">
                  <Paperclip className="w-4 h-4" />
                </Button>
                <div className="flex-1">
                  <Input
                    placeholder="Напишите сообщение AI тренеру..."
                    disabled
                  />
                </div>
                <Button variant="ghost" size="icon">
                  <Mic className="w-4 h-4" />
                </Button>
                <Button size="icon" disabled>
                  <Send className="w-4 h-4" />
                </Button>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 text-center">
                AI тренер обучен на данных фитнеса и питания для персональных рекомендаций
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </motion.div>
  );
};

export default AICoach;