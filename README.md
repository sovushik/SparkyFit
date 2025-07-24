# 🚀 SparkyFit - Enterprise Fitness Tracking Platform

<div align="center">

![SparkyFit Logo](https://via.placeholder.com/200x80/3b82f6/ffffff?text=SparkyFit)

**Полноценная платформа для фитнес-трекинга с AI тренером и системой автообновлений**

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-20232A?logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![PHP](https://img.shields.io/badge/PHP-777BB4?logo=php&logoColor=white)](https://php.net/)
[![MySQL](https://img.shields.io/badge/MySQL-4479A1?logo=mysql&logoColor=white)](https://www.mysql.com/)
[![Redis](https://img.shields.io/badge/Redis-DC382D?logo=redis&logoColor=white)](https://redis.io/)

</div>

---

## 🌟 Ключевые особенности

### ✨ **Enterprise-уровень готовности**
- 🔄 **Система автообновлений** с цифровыми подписями и автоматическим откатом
- 🔒 **Production-ready безопасность** с JWT, Redis blacklisting, malware scanning
- 🚀 **Zero-downtime updates** для бесшовного обновления пользователей
- 📊 **Полная аналитика** обновлений и мониторинг системы

### 🤖 **AI Personal Trainer**
- 💬 **Интеллектуальный чат** с персональным AI тренером
- 📈 **Анализ данных** и персонализированные рекомендации
- 🎯 **Контекстные советы** на основе ваших данных о питании и тренировках
- 🧠 **Интеграция с Ollama** для локального AI (или облачные решения)

### 🍎 **Продвинутое отслеживание питания**
- 🔍 **Умный поиск продуктов** с поддержкой штрих-кодов
- 📱 **Быстрое добавление** и дублирование записей
- 📊 **Детальная аналитика** макронутриентов и калорий
- 🎯 **Персональные цели** и отслеживание прогресса

### 💪 **Комплексное управление тренировками**
- 🏃‍♂️ **База упражнений** с инструкциями и медиа
- 📅 **Планировщик тренировок** с шаблонами
- ⏱️ **Отслеживание подходов** и времени отдыха
- 🔥 **Расчет калорий** по MET значениям

### 📏 **Точные измерения тела**
- ⚖️ **Отслеживание веса** с трендами
- 📐 **Измерения объемов** (талия, грудь, бедра)
- 📈 **BMI и состав тела** с аналитикой
- 📸 **Визуальный прогресс** с графиками

---

## 🛠 Технологический стек

### 🎨 **Frontend (React 18 + TypeScript)**
```
📦 Core Technologies
├── ⚛️ React 18 с TypeScript
├── ⚡ Vite для быстрой разработки
├── 🎨 Tailwind CSS + Framer Motion
├── 📊 Chart.js + Recharts для аналитики
├── 🧭 React Router v6 для навигации
├── 📱 PWA поддержка с Service Workers
└── 🔄 Система автообновлений

🎯 State Management
├── 🐻 Zustand для глобального состояния
├── 🔄 React Query для server state
├── 📝 React Hook Form для форм
└── 🎣 Кастомные хуки

🎨 UI/UX
├── 🎭 Framer Motion анимации
├── 🎨 Кастомная система дизайна
├── 📱 Полностью адаптивный дизайн
├── 🌙 Поддержка темной темы
└── ♿ Accessibility готовность
```

### ⚡ **Backend (PHP 8.3 + Modern Architecture)**
```
🚀 Core Framework
├── 🐘 PHP 8.3+ с современными возможностями
├── 🏃‍♂️ Slim Framework 4 для производительности
├── 🗄️ Eloquent ORM для элегантной работы с БД
├── 🔒 JWT RS256/HS256 для безопасности
├── 📦 PSR стандарты и DI контейнер
└── 🔍 OpenAPI документация

🔄 Auto-Update System ⭐
├── 🔐 Цифровые подписи обновлений
├── 🛡️ Malware scanning и проверка целостности
├── 📦 Автоматический backup и rollback
├── 🚀 Zero-downtime установка
├── 📊 Полная аналитика процесса
└── 🎮 Admin панель управления

🗄️ Database & Cache
├── 🐬 MySQL 8.0+ с JSON поддержкой
├── 🔴 Redis для кеширования и JWT blacklisting
├── 🔄 Система миграций с версионированием
├── 📊 Индексы производительности
└── 🔒 UUID первичные ключи для безопасности
```

---

## 🏗 Архитектура проекта

```
SparkyFit/
├── 📱 frontend/                    # React TypeScript приложение
│   ├── src/
│   │   ├── components/            # React компоненты
│   │   │   ├── ui/               # Базовые UI элементы
│   │   │   ├── auth/             # Аутентификация
│   │   │   ├── dashboard/        # Дашборд и аналитика
│   │   │   ├── nutrition/        # Трекинг питания
│   │   │   ├── workouts/         # Планировщик тренировок
│   │   │   ├── ai-coach/         # AI тренер чат
│   │   │   ├── goals/            # Управление целями
│   │   │   └── system/           # Auto-update компоненты ⭐
│   │   ├── hooks/                # Кастомные React хуки
│   │   ├── store/                # Zustand состояние
│   │   ├── types/                # TypeScript определения
│   │   ├── utils/                # API клиент и утилиты
│   │   └── pages/                # Страницы приложения
│   └── public/
│       └── sw.js                 # Service Worker с auto-updates ⭐
│
├── 🖥️ backend/                     # PHP 8.3 API
│   ├── src/
│   │   ├── Controllers/          # API контроллеры
│   │   │   ├── AuthController.php        # Аутентификация
│   │   │   ├── SystemController.php      # Auto-updates ⭐
│   │   │   ├── NutritionController.php   # Питание
│   │   │   ├── WorkoutController.php     # Тренировки
│   │   │   └── AIController.php          # AI тренер
│   │   ├── Services/             # Бизнес-логика
│   │   │   ├── AutoUpdateService.php     # Основной сервис ⭐
│   │   │   ├── UpdateSecurityService.php # Безопасность ⭐
│   │   │   ├── BackupService.php         # Бэкапы ⭐
│   │   │   ├── AuthService.php           # Аутентификация
│   │   │   └── AIService.php             # AI интеграция
│   │   ├── Models/               # Eloquent модели
│   │   ├── Middleware/           # HTTP middleware
│   │   └── Application/          # Основные классы приложения
│   ├── config/                   # Конфигурация
│   ├── database/                 # Миграции и сиды
│   └── public/                   # Точка входа
│
└── 📚 docs/                       # Документация
    ├── INSTALL_GUIDE.md          # Руководство по установке
    ├── AUTO_UPDATE_GUIDE.md      # Система автообновлений ⭐
    ├── AI_TRAINER_GUIDE.md       # AI персональный тренер
    └── API_DOCUMENTATION.md      # API документация
```

---

## 🚀 Быстрый старт

### 1️⃣ **Клонирование репозитория**
```bash
git clone https://github.com/your-username/sparkyfit.git
cd sparkyfit
```

### 2️⃣ **Frontend установка**
```bash
# Установка зависимостей
npm install

# Запуск в режиме разработки
npm run dev

# Сборка для продакшена
npm run build
```

### 3️⃣ **Backend установка**
```bash
cd backend

# Установка PHP зависимостей
composer install

# Настройка окружения
cp .env.example .env
# Отредактируйте .env файл с вашими настройками

# Запуск миграций
php bin/migrate.php

# Запуск сервера разработки
composer serve
```

### 4️⃣ **Конфигурация базы данных**
```sql
-- Создание базы данных
CREATE DATABASE sparkyfit CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Создание пользователя (опционально)
CREATE USER 'sparkyfit'@'localhost' IDENTIFIED BY 'your_password';
GRANT ALL PRIVILEGES ON sparkyfit.* TO 'sparkyfit'@'localhost';
FLUSH PRIVILEGES;
```

---

## 🔧 Конфигурация

### 🌐 **Производственное развертывание**

#### **Домены проекта:**
- 🏠 **sparkyfit.ru** - Landing Page + основное приложение
- 🔌 **api.sparkyfit.ru** - Backend API
- ⚙️ **admin.sparkyfit.ru** - Админ-панель управления

#### **Сервер для развертывания:**
```
🖥️ Сервер: 80.71.232.26
👤 Логин: root
🔐 Пароль: lS5bO1oA8reJ
```

### 🔒 **Безопасность**
- JWT токены с access/refresh паттерном
- Redis blacklisting для отозванных токенов
- bcrypt хеширование паролей (12 rounds)
- CORS конфигурация для безопасных origins
- Rate limiting для API эндпоинтов
- Цифровые подписи для автообновлений ⭐

---

## 🎯 Основные функции

### 📊 **Dashboard & Analytics**
- Интерактивные графики потребления калорий
- Прогресс тренировок и достижений
- AI рекомендации и советы
- Быстрые действия и метрики

### 🍽️ **Nutrition Tracking**
- Поиск продуктов по названию и штрих-коду
- Автоматический расчет макронутриентов
- Дневные и недельные сводки
- Персональные цели питания

### 🏋️‍♂️ **Workout Management**
- Библиотека упражнений с инструкциями
- Планировщик тренировок с шаблонами
- Отслеживание подходов, повторений и весов
- Расчет сожженных калорий

### 📏 **Body Measurements**
- Отслеживание веса с графиками прогресса
- Измерения объемов тела
- BMI и процент жира
- Визуализация изменений

### 🎯 **Goal Management**
- Умные цели с типизацией
- Отслеживание прогресса в реальном времени
- Система достижений и мотивации
- Милестоуны и награды

### 🤖 **AI Personal Trainer**
- Интеллектуальный чат с персонализированными советами
- Анализ ваших данных для рекомендаций
- Контекстные подсказки по питанию и тренировкам
- История диалогов и улучшение со временем

---

## 🔄 Система автообновлений ⭐

### **Enterprise-класс автообновления**
- 🔐 **Цифровые подписи** - OpenSSL верификация пакетов обновлений
- 🛡️ **Malware сканирование** - Pattern detection для подозрительного кода
- 🔍 **Source validation** - Только доверенные домены
- ✅ **Integrity checks** - SHA256 checksums для всех файлов
- 🔄 **Automatic rollback** - При любых проблемах безопасности

### **Zero-Downtime Experience**
- 📦 **Seamless updates** - Обновления без простоя пользователей
- 💾 **Automatic backups** - Перед каждым обновлением
- 🚀 **Progressive installation** - Поэтапная установка с проверками
- 📊 **Real-time progress** - Красивые индикаторы прогресса
- 🎮 **Admin controls** - Полное управление из админ-панели

---

## 🧪 Тестирование

```bash
# Frontend тесты
npm test

# Backend тесты
composer test

# Покрытие кода
composer test-coverage

# Статический анализ
composer analyse

# Проверка стиля кода
composer cs-check
```

---

## 📈 Производительность

### **Оптимизации Frontend:**
- Code splitting и lazy loading
- Service Worker кеширование
- Image optimization
- Bundle size optimization

### **Оптимизации Backend:**
- Database indexing для быстрых запросов
- Redis caching для JWT и данных
- Query optimization с Eloquent
- JSON compression в API ответах

---

## 🔮 Roadmap

### **v1.1 - Расширенная аналитика**
- [ ] Детальные отчеты прогресса
- [ ] Export данных в различные форматы
- [ ] Интеграция с фитнес устройствами
- [ ] Social features и соревнования

### **v1.2 - AI Enhancement**
- [ ] Улучшенный AI с изучением предпочтений
- [ ] Голосовой интерфейс
- [ ] Фото-анализ еды
- [ ] Предиктивная аналитика

### **v1.3 - Enterprise Features**
- [ ] Multi-tenant архитектура
- [ ] Advanced admin dashboard
- [ ] API для сторонних интеграций
- [ ] Белый лейбл решения

---

## 🤝 Вклад в проект

Мы приветствуем вклад сообщества! Пожалуйста, ознакомьтесь с [CONTRIBUTING.md](CONTRIBUTING.md) для получения инструкций.

### **Как помочь:**
1. 🐛 Сообщить о баге через Issues
2. 💡 Предложить новую функцию
3. 🔧 Отправить Pull Request
4. 📚 Улучшить документацию
5. ⭐ Поставить звезду проекту

---

## 📄 Лицензия

Этот проект лицензирован под [MIT License](LICENSE).

---

## 📞 Поддержка и контакты

- 📧 **Email:** support@sparkyfit.ru
- 💬 **Telegram:** @sparkyfit_support
- 🌐 **Website:** https://sparkyfit.ru
- 📖 **Документация:** https://docs.sparkyfit.ru

---

<div align="center">

**🚀 Создано с ❤️ для здорового образа жизни**

*SparkyFit - Ваш персональный фитнес-трекер нового поколения*

[![GitHub stars](https://img.shields.io/github/stars/your-username/sparkyfit?style=social)](https://github.com/your-username/sparkyfit/stargazers)
[![GitHub forks](https://img.shields.io/github/forks/your-username/sparkyfit?style=social)](https://github.com/your-username/sparkyfit/network/members)

</div>