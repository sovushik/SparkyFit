import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { format, parseISO, isValid, startOfDay, endOfDay, subDays, addDays } from 'date-fns';
import { ru } from 'date-fns/locale';

// ================== CLASSNAME UTILITIES ==================
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// ================== DATE UTILITIES ==================
export const dateUtils = {
  format: (date: string | Date, formatStr: string = 'dd.MM.yyyy'): string => {
    try {
      const parsedDate = typeof date === 'string' ? parseISO(date) : date;
      if (!isValid(parsedDate)) return '';
      return format(parsedDate, formatStr, { locale: ru });
    } catch {
      return '';
    }
  },

  formatTime: (date: string | Date): string => {
    return dateUtils.format(date, 'HH:mm');
  },

  formatDateTime: (date: string | Date): string => {
    return dateUtils.format(date, 'dd.MM.yyyy HH:mm');
  },

  formatRelative: (date: string | Date): string => {
    try {
      const parsedDate = typeof date === 'string' ? parseISO(date) : date;
      if (!isValid(parsedDate)) return '';
      
      const now = new Date();
      const diffInHours = Math.abs(now.getTime() - parsedDate.getTime()) / (1000 * 60 * 60);
      
      if (diffInHours < 1) {
        const diffInMinutes = Math.round(diffInHours * 60);
        return `${diffInMinutes} мин. назад`;
      } else if (diffInHours < 24) {
        return `${Math.round(diffInHours)} ч. назад`;
      } else {
        const diffInDays = Math.round(diffInHours / 24);
        if (diffInDays === 1) return 'Вчера';
        return `${diffInDays} дн. назад`;
      }
    } catch {
      return '';
    }
  },

  toISODate: (date: string | Date): string => {
    try {
      const parsedDate = typeof date === 'string' ? parseISO(date) : date;
      if (!isValid(parsedDate)) return '';
      return format(parsedDate, 'yyyy-MM-dd');
    } catch {
      return '';
    }
  },

  toISODateTime: (date: string | Date): string => {
    try {
      const parsedDate = typeof date === 'string' ? parseISO(date) : date;
      if (!isValid(parsedDate)) return '';
      return parsedDate.toISOString();
    } catch {
      return '';
    }
  },

  today: (): string => {
    return dateUtils.toISODate(new Date());
  },

  yesterday: (): string => {
    return dateUtils.toISODate(subDays(new Date(), 1));
  },

  tomorrow: (): string => {
    return dateUtils.toISODate(addDays(new Date(), 1));
  },

  startOfDay: (date: string | Date): Date => {
    const parsedDate = typeof date === 'string' ? parseISO(date) : date;
    return startOfDay(parsedDate);
  },

  endOfDay: (date: string | Date): Date => {
    const parsedDate = typeof date === 'string' ? parseISO(date) : date;
    return endOfDay(parsedDate);
  },

  weekRange: (date: string | Date = new Date()): { startDate: string; endDate: string } => {
    const parsedDate = typeof date === 'string' ? parseISO(date) : date;
    const start = subDays(parsedDate, 6);
    return {
      startDate: dateUtils.toISODate(start),
      endDate: dateUtils.toISODate(parsedDate),
    };
  },
};

// ================== NUMBER UTILITIES ==================
export const numberUtils = {
  round: (value: number, decimals: number = 1): number => {
    return Math.round(value * Math.pow(10, decimals)) / Math.pow(10, decimals);
  },

  formatNumber: (value: number, options?: Intl.NumberFormatOptions): string => {
    return new Intl.NumberFormat('ru-RU', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 1,
      ...options,
    }).format(value);
  },

  formatPercent: (value: number): string => {
    return numberUtils.formatNumber(value, {
      style: 'percent',
      minimumFractionDigits: 0,
      maximumFractionDigits: 1,
    });
  },

  formatCalories: (value: number): string => {
    return `${numberUtils.formatNumber(value)} ккал`;
  },

  formatWeight: (value: number): string => {
    return `${numberUtils.formatNumber(value)} кг`;
  },

  formatDistance: (value: number): string => {
    if (value >= 1000) {
      return `${numberUtils.formatNumber(value / 1000)} км`;
    }
    return `${numberUtils.formatNumber(value)} м`;
  },

  formatDuration: (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;

    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  },

  clamp: (value: number, min: number, max: number): number => {
    return Math.min(Math.max(value, min), max);
  },
};

// ================== VALIDATION UTILITIES ==================
export const validationUtils = {
  email: (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  },

  password: (password: string): { isValid: boolean; errors: string[] } => {
    const errors: string[] = [];
    
    if (password.length < 8) {
      errors.push('Пароль должен содержать минимум 8 символов');
    }
    
    if (!/[A-Z]/.test(password)) {
      errors.push('Пароль должен содержать заглавную букву');
    }
    
    if (!/[a-z]/.test(password)) {
      errors.push('Пароль должен содержать строчную букву');
    }
    
    if (!/\d/.test(password)) {
      errors.push('Пароль должен содержать цифру');
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  },

  username: (username: string): boolean => {
    const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/;
    return usernameRegex.test(username);
  },

  phone: (phone: string): boolean => {
    const phoneRegex = /^\+?[1-9]\d{1,14}$/;
    return phoneRegex.test(phone.replace(/\s/g, ''));
  },

  required: (value: any): boolean => {
    if (typeof value === 'string') {
      return value.trim().length > 0;
    }
    return value !== null && value !== undefined;
  },
};

// ================== STORAGE UTILITIES ==================
export const storageUtils = {
  set: (key: string, value: any): void => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error('Error saving to localStorage:', error);
    }
  },

  get: <T>(key: string, defaultValue?: T): T | null => {
    try {
      const item = localStorage.getItem(key);
      if (item === null) return defaultValue || null;
      return JSON.parse(item);
    } catch (error) {
      console.error('Error reading from localStorage:', error);
      return defaultValue || null;
    }
  },

  remove: (key: string): void => {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error('Error removing from localStorage:', error);
    }
  },

  clear: (): void => {
    try {
      localStorage.clear();
    } catch (error) {
      console.error('Error clearing localStorage:', error);
    }
  },

  // Session storage variants
  sessionSet: (key: string, value: any): void => {
    try {
      sessionStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error('Error saving to sessionStorage:', error);
    }
  },

  sessionGet: <T>(key: string, defaultValue?: T): T | null => {
    try {
      const item = sessionStorage.getItem(key);
      if (item === null) return defaultValue || null;
      return JSON.parse(item);
    } catch (error) {
      console.error('Error reading from sessionStorage:', error);
      return defaultValue || null;
    }
  },
};

// ================== URL UTILITIES ==================
export const urlUtils = {
  buildQuery: (params: Record<string, any>): string => {
    const searchParams = new URLSearchParams();
    
    Object.entries(params).forEach(([key, value]) => {
      if (value !== null && value !== undefined && value !== '') {
        searchParams.append(key, String(value));
      }
    });
    
    const queryString = searchParams.toString();
    return queryString ? `?${queryString}` : '';
  },

  parseQuery: (search: string): Record<string, string> => {
    const params = new URLSearchParams(search);
    const result: Record<string, string> = {};
    
    params.forEach((value, key) => {
      result[key] = value;
    });
    
    return result;
  },

  isValidUrl: (url: string): boolean => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  },
};

// ================== FILE UTILITIES ==================
export const fileUtils = {
  formatFileSize: (bytes: number): string => {
    if (bytes === 0) return '0 Б';
    
    const sizes = ['Б', 'КБ', 'МБ', 'ГБ', 'ТБ'];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    
    return `${numberUtils.formatNumber(bytes / Math.pow(1024, i))} ${sizes[i]}`;
  },

  getFileExtension: (filename: string): string => {
    return filename.slice((filename.lastIndexOf('.') - 1 >>> 0) + 2);
  },

  isImageFile: (file: File): boolean => {
    return file.type.startsWith('image/');
  },

  readFileAsDataURL: (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  },
};

// ================== ANALYTICS UTILITIES ==================
export const analyticsUtils = {
  calculateBMI: (weight: number, height: number): number => {
    // height in cm, weight in kg
    const heightInMeters = height / 100;
    return numberUtils.round(weight / (heightInMeters * heightInMeters));
  },

  getBMICategory: (bmi: number): string => {
    if (bmi < 18.5) return 'Недостаточный вес';
    if (bmi < 25) return 'Нормальный вес';
    if (bmi < 30) return 'Избыточный вес';
    return 'Ожирение';
  },

  calculateCaloriesFromMacros: (protein: number, carbs: number, fat: number): number => {
    // Protein: 4 kcal/g, Carbs: 4 kcal/g, Fat: 9 kcal/g
    return numberUtils.round((protein * 4) + (carbs * 4) + (fat * 9));
  },

  calculateMacroPercentage: (macro: number, totalCalories: number, caloriesPerGram: number): number => {
    const macroCalories = macro * caloriesPerGram;
    return totalCalories > 0 ? numberUtils.round((macroCalories / totalCalories) * 100) : 0;
  },

  calculateProgress: (current: number, target: number): number => {
    if (target === 0) return 0;
    return numberUtils.clamp((current / target) * 100, 0, 100);
  },

  generateId: (): string => {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  },
};

// ================== DEBOUNCE & THROTTLE ==================
export const debounce = <T extends (...args: any[]) => void>(
  func: T,
  delay: number
): ((...args: Parameters<T>) => void) => {
  let timeoutId: NodeJS.Timeout;
  
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
};

export const throttle = <T extends (...args: any[]) => void>(
  func: T,
  limit: number
): ((...args: Parameters<T>) => void) => {
  let inThrottle: boolean;
  
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
};

// ================== COLOR UTILITIES ==================
export const colorUtils = {
  getProgressColor: (percentage: number): string => {
    if (percentage >= 100) return 'text-success-600';
    if (percentage >= 75) return 'text-primary-600';
    if (percentage >= 50) return 'text-warning-600';
    return 'text-danger-600';
  },

  getProgressBgColor: (percentage: number): string => {
    if (percentage >= 100) return 'bg-success-600';
    if (percentage >= 75) return 'bg-primary-600';
    if (percentage >= 50) return 'bg-warning-600';
    return 'bg-danger-600';
  },

  hexToRgb: (hex: string): { r: number; g: number; b: number } | null => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null;
  },
};

// ================== EXPORT ALL ==================
export * from './api';