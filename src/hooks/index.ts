import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { useAppStore } from '../store';
import { 
  authService, 
  nutritionService, 
  workoutService, 
  measurementService,
  goalService,
  aiService,
  systemService,
  handleApiError 
} from '../utils/api';
import { debounce } from '../utils';
import type { SearchFilters, DateRange } from '../types';

// ================== AUTH HOOKS ==================
export const useAuth = () => {
  const { 
    user, 
    isAuthenticated, 
    isLoading, 
    error, 
    login, 
    logout, 
    register, 
    refreshUser 
  } = useAppStore();

  return {
    user,
    isAuthenticated,
    isLoading,
    error,
    login,
    logout,
    register,
    refreshUser,
  };
};

// ================== API QUERY HOOKS ==================

// Nutrition hooks
export const useNutritionSummary = (date: string) => {
  return useQuery(
    ['nutritionSummary', date],
    () => nutritionService.getNutritionSummary(date),
    {
      staleTime: 5 * 60 * 1000, // 5 minutes
      cacheTime: 10 * 60 * 1000, // 10 minutes
    }
  );
};

export const useFoodEntries = (filters: SearchFilters = {}) => {
  return useQuery(
    ['foodEntries', filters],
    () => nutritionService.getFoodEntries(filters),
    {
      staleTime: 2 * 60 * 1000, // 2 minutes
    }
  );
};

export const useFoodSearch = (query: string, enabled: boolean = true) => {
  return useQuery(
    ['foodSearch', query],
    () => nutritionService.searchFoods(query),
    {
      enabled: enabled && query.length > 2,
      staleTime: 10 * 60 * 1000, // 10 minutes
    }
  );
};

// Workout hooks
export const useWorkouts = (filters: SearchFilters = {}) => {
  return useQuery(
    ['workouts', filters],
    () => workoutService.getWorkouts(filters),
    {
      staleTime: 5 * 60 * 1000,
    }
  );
};

export const useWorkout = (id: string) => {
  return useQuery(
    ['workout', id],
    () => workoutService.getWorkout(id),
    {
      enabled: !!id,
      staleTime: 5 * 60 * 1000,
    }
  );
};

export const useExercises = (filters: SearchFilters = {}) => {
  return useQuery(
    ['exercises', filters],
    () => workoutService.getExercises(filters),
    {
      staleTime: 30 * 60 * 1000, // 30 minutes - exercises don't change often
    }
  );
};

// Measurement hooks
export const useMeasurements = (filters: SearchFilters = {}) => {
  return useQuery(
    ['measurements', filters],
    () => measurementService.getMeasurements(filters),
    {
      staleTime: 10 * 60 * 1000,
    }
  );
};

export const useWaterIntake = (date: string) => {
  return useQuery(
    ['waterIntake', date],
    () => measurementService.getWaterSummary(date),
    {
      staleTime: 2 * 60 * 1000,
    }
  );
};

// Goal hooks
export const useGoals = (filters: SearchFilters = {}) => {
  return useQuery(
    ['goals', filters],
    () => goalService.getGoals(filters),
    {
      staleTime: 5 * 60 * 1000,
    }
  );
};

// AI Coach hooks
export const useAIConversations = () => {
  return useQuery(
    ['aiConversations'],
    () => aiService.getConversations(),
    {
      staleTime: 2 * 60 * 1000,
    }
  );
};

export const useAIConversation = (id: string) => {
  return useQuery(
    ['aiConversation', id],
    () => aiService.getConversation(id),
    {
      enabled: !!id,
      staleTime: 30 * 1000, // 30 seconds for active conversations
    }
  );
};

export const useAIRecommendations = () => {
  return useQuery(
    ['aiRecommendations'],
    () => aiService.getRecommendations(),
    {
      staleTime: 5 * 60 * 1000,
    }
  );
};

// ================== MUTATION HOOKS ==================
export const useCreateFoodEntry = () => {
  const queryClient = useQueryClient();
  
  return useMutation(
    (data: any) => nutritionService.createFoodEntry(data),
    {
      onSuccess: (data, variables) => {
        // Invalidate related queries
        queryClient.invalidateQueries(['nutritionSummary', variables.date]);
        queryClient.invalidateQueries(['foodEntries']);
      },
      onError: (error) => {
        console.error('Create food entry error:', error);
      },
    }
  );
};

export const useCreateWorkout = () => {
  const queryClient = useQueryClient();
  
  return useMutation(
    (data: any) => workoutService.createWorkout(data),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['workouts']);
      },
      onError: (error) => {
        console.error('Create workout error:', error);
      },
    }
  );
};

export const useUpdateWorkout = () => {
  const queryClient = useQueryClient();
  
  return useMutation(
    ({ id, data }: { id: string; data: any }) => workoutService.updateWorkout(id, data),
    {
      onSuccess: (data, variables) => {
        queryClient.invalidateQueries(['workouts']);
        queryClient.invalidateQueries(['workout', variables.id]);
      },
      onError: (error) => {
        console.error('Update workout error:', error);
      },
    }
  );
};

export const useSendAIMessage = () => {
  const queryClient = useQueryClient();
  
  return useMutation(
    (data: any) => aiService.sendMessage(data),
    {
      onSuccess: (data, variables) => {
        if (variables.conversationId) {
          queryClient.invalidateQueries(['aiConversation', variables.conversationId]);
        }
        queryClient.invalidateQueries(['aiConversations']);
      },
      onError: (error) => {
        console.error('Send AI message error:', error);
      },
    }
  );
};

// ================== CUSTOM HOOKS ==================

// Auto-update hook
export const useAutoUpdate = () => {
  const { 
    updateInfo, 
    updateProgress, 
    updateSettings, 
    hasNewUpdate,
    checkForUpdates, 
    downloadUpdate, 
    installUpdate 
  } = useAppStore();

  useEffect(() => {
    // Check for updates on mount and periodically
    checkForUpdates();

    const interval = setInterval(() => {
      checkForUpdates();
    }, (updateSettings?.checkInterval || 6) * 60 * 60 * 1000); // Convert hours to ms

    return () => clearInterval(interval);
  }, [checkForUpdates, updateSettings?.checkInterval]);

  return {
    updateInfo,
    updateProgress,
    updateSettings,
    hasNewUpdate,
    checkForUpdates,
    downloadUpdate,
    installUpdate,
  };
};

// Search hook with debouncing
export const useSearch = <T>(
  searchFn: (query: string) => Promise<T[]>,
  delay: number = 300
) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<T[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const debouncedSearch = useCallback(
    debounce(async (searchQuery: string) => {
      if (!searchQuery.trim()) {
        setResults([]);
        setIsSearching(false);
        return;
      }

      setIsSearching(true);
      setError(null);

      try {
        const searchResults = await searchFn(searchQuery);
        setResults(searchResults);
      } catch (err) {
        setError(handleApiError(err));
        setResults([]);
      } finally {
        setIsSearching(false);
      }
    }, delay),
    [searchFn, delay]
  );

  useEffect(() => {
    debouncedSearch(query);
  }, [query, debouncedSearch]);

  return {
    query,
    setQuery,
    results,
    isSearching,
    error,
    clearResults: () => setResults([]),
  };
};

// Local storage hook
export const useLocalStorage = <T>(key: string, initialValue: T) => {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  const setValue = useCallback((value: T | ((val: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error);
    }
  }, [key, storedValue]);

  return [storedValue, setValue] as const;
};

// Media query hook
export const useMediaQuery = (query: string) => {
  const [matches, setMatches] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.matchMedia(query).matches;
    }
    return false;
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const mediaQuery = window.matchMedia(query);
    const handler = (event: MediaQueryListEvent) => setMatches(event.matches);

    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, [query]);

  return matches;
};

// Responsive hook
export const useResponsive = () => {
  const isMobile = useMediaQuery('(max-width: 768px)');
  const isTablet = useMediaQuery('(max-width: 1024px)');
  const isDesktop = useMediaQuery('(min-width: 1025px)');

  return {
    isMobile,
    isTablet,
    isDesktop,
  };
};

// Previous value hook
export const usePrevious = <T>(value: T): T | undefined => {
  const ref = useRef<T>();
  
  useEffect(() => {
    ref.current = value;
  });
  
  return ref.current;
};

// Intersection Observer hook
export const useIntersectionObserver = (
  elementRef: React.RefObject<Element>,
  options: IntersectionObserverInit = {}
) => {
  const [isIntersecting, setIsIntersecting] = useState(false);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => setIsIntersecting(entry.isIntersecting),
      options
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, [elementRef, options]);

  return isIntersecting;
};

// Click outside hook
export const useClickOutside = (
  ref: React.RefObject<HTMLElement>,
  callback: () => void
) => {
  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        callback();
      }
    };

    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [ref, callback]);
};

// Toggle hook
export const useToggle = (initialValue: boolean = false) => {
  const [value, setValue] = useState(initialValue);

  const toggle = useCallback(() => setValue(v => !v), []);
  const setTrue = useCallback(() => setValue(true), []);
  const setFalse = useCallback(() => setValue(false), []);

  return [value, { toggle, setTrue, setFalse }] as const;
};

// Copy to clipboard hook
export const useCopyToClipboard = () => {
  const [isCopied, setIsCopied] = useState(false);

  const copyToClipboard = useCallback(async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
      return true;
    } catch (error) {
      console.error('Failed to copy to clipboard:', error);
      setIsCopied(false);
      return false;
    }
  }, []);

  return [isCopied, copyToClipboard] as const;
};

// Async operation hook
export const useAsync = <T, E = Error>(
  asyncFunction: () => Promise<T>,
  immediate: boolean = true
) => {
  const [status, setStatus] = useState<'idle' | 'pending' | 'success' | 'error'>('idle');
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<E | null>(null);

  const execute = useCallback(async () => {
    setStatus('pending');
    setData(null);
    setError(null);

    try {
      const result = await asyncFunction();
      setData(result);
      setStatus('success');
      return result;
    } catch (error) {
      setError(error as E);
      setStatus('error');
      throw error;
    }
  }, [asyncFunction]);

  useEffect(() => {
    if (immediate) {
      execute();
    }
  }, [execute, immediate]);

  return {
    execute,
    status,
    data,
    error,
    isIdle: status === 'idle',
    isPending: status === 'pending',
    isSuccess: status === 'success',
    isError: status === 'error',
  };
};

// Timer hook
export const useTimer = (initialTime: number = 0) => {
  const [time, setTime] = useState(initialTime);
  const [isRunning, setIsRunning] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const start = useCallback(() => {
    if (!isRunning) {
      setIsRunning(true);
      intervalRef.current = setInterval(() => {
        setTime(prevTime => prevTime + 1);
      }, 1000);
    }
  }, [isRunning]);

  const stop = useCallback(() => {
    if (isRunning && intervalRef.current) {
      setIsRunning(false);
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, [isRunning]);

  const reset = useCallback(() => {
    stop();
    setTime(initialTime);
  }, [stop, initialTime]);

  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  return {
    time,
    isRunning,
    start,
    stop,
    reset,
  };
};

// ================== EXPORT ALL ==================
export * from '../store';