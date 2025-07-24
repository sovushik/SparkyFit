import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import type { 
  User, 
  UserProfile, 
  Notification,
  UpdateInfo,
  UpdateProgress,
  UpdateSettings 
} from '../types';
import { authService, userService, systemService } from '../utils/api';

// ================== APP STATE INTERFACE ==================
interface AppState {
  // Auth state
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;

  // UI state
  theme: 'light' | 'dark';
  sidebarOpen: boolean;
  notifications: Notification[];

  // Update system state
  updateInfo: UpdateInfo | null;
  updateProgress: UpdateProgress | null;
  updateSettings: UpdateSettings | null;
  hasNewUpdate: boolean;
  
  // Actions
  setUser: (user: User | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  register: (userData: any) => Promise<void>;
  refreshUser: () => Promise<void>;
  
  // UI actions
  setTheme: (theme: 'light' | 'dark') => void;
  toggleSidebar: () => void;
  addNotification: (notification: Omit<Notification, 'id'>) => void;
  removeNotification: (id: string) => void;
  clearNotifications: () => void;

  // Update system actions
  checkForUpdates: () => Promise<void>;
  downloadUpdate: () => Promise<void>;
  installUpdate: () => Promise<void>;
  updateUpdateSettings: (settings: Partial<UpdateSettings>) => Promise<void>;
  clearUpdateInfo: () => void;
}

// ================== MAIN APP STORE ==================
export const useAppStore = create<AppState>()(
  devtools(
    persist(
      (set, get) => ({
        // Initial state
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
        theme: 'light',
        sidebarOpen: false,
        notifications: [],
        updateInfo: null,
        updateProgress: null,
        updateSettings: null,
        hasNewUpdate: false,

        // Auth actions
        setUser: (user) => {
          set({ user, isAuthenticated: !!user }, false, 'setUser');
        },

        setLoading: (isLoading) => {
          set({ isLoading }, false, 'setLoading');
        },

        setError: (error) => {
          set({ error }, false, 'setError');
        },

        login: async (email, password) => {
          set({ isLoading: true, error: null }, false, 'login:start');
          try {
            const response = await authService.login(email, password);
            set({ 
              user: response.user, 
              isAuthenticated: true, 
              isLoading: false 
            }, false, 'login:success');
          } catch (error: any) {
            set({ 
              error: error.message || 'Ошибка входа', 
              isLoading: false 
            }, false, 'login:error');
            throw error;
          }
        },

        logout: async () => {
          set({ isLoading: true }, false, 'logout:start');
          try {
            await authService.logout();
            set({ 
              user: null, 
              isAuthenticated: false, 
              isLoading: false,
              notifications: [] 
            }, false, 'logout:success');
          } catch (error: any) {
            console.error('Logout error:', error);
            // Clear local state even if API call fails
            set({ 
              user: null, 
              isAuthenticated: false, 
              isLoading: false,
              notifications: [] 
            }, false, 'logout:force');
          }
        },

        register: async (userData) => {
          set({ isLoading: true, error: null }, false, 'register:start');
          try {
            const response = await authService.register(userData);
            set({ 
              user: response.user, 
              isAuthenticated: true, 
              isLoading: false 
            }, false, 'register:success');
          } catch (error: any) {
            set({ 
              error: error.message || 'Ошибка регистрации', 
              isLoading: false 
            }, false, 'register:error');
            throw error;
          }
        },

        refreshUser: async () => {
          if (!authService.isAuthenticated()) return;
          
          try {
            const userProfile = await userService.getProfile();
            set({ user: userProfile }, false, 'refreshUser:success');
          } catch (error: any) {
            console.error('Refresh user error:', error);
            // If refresh fails, user might be logged out
            if (error.status === 401) {
              set({ 
                user: null, 
                isAuthenticated: false 
              }, false, 'refreshUser:unauthorized');
            }
          }
        },

        // UI actions
        setTheme: (theme) => {
          set({ theme }, false, 'setTheme');
          // Apply theme to document
          document.documentElement.classList.toggle('dark', theme === 'dark');
        },

        toggleSidebar: () => {
          set((state) => ({ sidebarOpen: !state.sidebarOpen }), false, 'toggleSidebar');
        },

        addNotification: (notification) => {
          const id = Date.now().toString();
          const newNotification = { ...notification, id };
          set((state) => ({ 
            notifications: [...state.notifications, newNotification] 
          }), false, 'addNotification');

          // Auto-remove notification if autoClose is true
          if (notification.autoClose !== false) {
            setTimeout(() => {
              get().removeNotification(id);
            }, notification.duration || 5000);
          }
        },

        removeNotification: (id) => {
          set((state) => ({ 
            notifications: state.notifications.filter(n => n.id !== id) 
          }), false, 'removeNotification');
        },

        clearNotifications: () => {
          set({ notifications: [] }, false, 'clearNotifications');
        },

        // Update system actions
        checkForUpdates: async () => {
          try {
            const updateInfo = await systemService.checkForUpdates();
            set({ 
              updateInfo, 
              hasNewUpdate: !!updateInfo 
            }, false, 'checkForUpdates:success');
            
            if (updateInfo) {
              get().addNotification({
                type: updateInfo.isCritical ? 'warning' : 'info',
                title: 'Доступно обновление',
                message: `Версия ${updateInfo.version} готова к установке`,
                actions: [
                  {
                    label: 'Скачать',
                    onClick: () => get().downloadUpdate(),
                  },
                ],
              });
            }
          } catch (error: any) {
            console.error('Check for updates error:', error);
          }
        },

        downloadUpdate: async () => {
          try {
            set({ updateProgress: { 
              stage: 'downloading', 
              progress: 0, 
              message: 'Скачивание обновления...' 
            }}, false, 'downloadUpdate:start');
            
            await systemService.downloadUpdate();
            
            set({ updateProgress: { 
              stage: 'completed', 
              progress: 100, 
              message: 'Обновление готово к установке' 
            }}, false, 'downloadUpdate:completed');

            get().addNotification({
              type: 'success',
              title: 'Обновление скачано',
              message: 'Нажмите для установки',
              actions: [
                {
                  label: 'Установить',
                  onClick: () => get().installUpdate(),
                },
              ],
            });
          } catch (error: any) {
            set({ updateProgress: { 
              stage: 'error', 
              progress: 0, 
              message: 'Ошибка скачивания', 
              error: error.message 
            }}, false, 'downloadUpdate:error');
          }
        },

        installUpdate: async () => {
          try {
            set({ updateProgress: { 
              stage: 'installing', 
              progress: 0, 
              message: 'Установка обновления...' 
            }}, false, 'installUpdate:start');
            
            await systemService.installUpdate();
            
            set({ updateProgress: { 
              stage: 'completed', 
              progress: 100, 
              message: 'Обновление установлено' 
            }}, false, 'installUpdate:completed');

            get().addNotification({
              type: 'success',
              title: 'Обновление установлено',
              message: 'Приложение будет перезагружено',
              autoClose: false,
            });

            // Reload page after successful update
            setTimeout(() => {
              window.location.reload();
            }, 3000);
          } catch (error: any) {
            set({ updateProgress: { 
              stage: 'error', 
              progress: 0, 
              message: 'Ошибка установки', 
              error: error.message 
            }}, false, 'installUpdate:error');
          }
        },

        updateUpdateSettings: async (settings) => {
          try {
            const updatedSettings = await systemService.updateSettings(settings);
            set({ updateSettings: updatedSettings }, false, 'updateUpdateSettings:success');
          } catch (error: any) {
            console.error('Update settings error:', error);
            get().addNotification({
              type: 'error',
              title: 'Ошибка настроек',
              message: 'Не удалось обновить настройки автообновления',
            });
          }
        },

        clearUpdateInfo: () => {
          set({ 
            updateInfo: null, 
            updateProgress: null, 
            hasNewUpdate: false 
          }, false, 'clearUpdateInfo');
        },
      }),
      {
        name: 'sparkyfit-app-store',
        partialize: (state) => ({
          theme: state.theme,
          updateSettings: state.updateSettings,
        }),
      }
    ),
    { name: 'AppStore' }
  )
);

// ================== NUTRITION STORE ==================
interface NutritionState {
  currentDate: string;
  nutritionSummary: any | null;
  foodEntries: any[];
  isLoading: boolean;
  
  setCurrentDate: (date: string) => void;
  loadNutritionData: (date: string) => Promise<void>;
  addFoodEntry: (entry: any) => Promise<void>;
  updateFoodEntry: (id: string, entry: any) => Promise<void>;
  deleteFoodEntry: (id: string) => Promise<void>;
}

export const useNutritionStore = create<NutritionState>()(
  devtools(
    (set, get) => ({
      currentDate: new Date().toISOString().split('T')[0],
      nutritionSummary: null,
      foodEntries: [],
      isLoading: false,

      setCurrentDate: (date) => {
        set({ currentDate: date }, false, 'setCurrentDate');
        get().loadNutritionData(date);
      },

      loadNutritionData: async (date) => {
        set({ isLoading: true }, false, 'loadNutritionData:start');
        try {
          const [summary, entries] = await Promise.all([
            systemService.get(`/nutrition/summary/${date}`),
            systemService.get('/nutrition/entries', { date }),
          ]);
          
          set({ 
            nutritionSummary: summary,
            foodEntries: entries,
            isLoading: false 
          }, false, 'loadNutritionData:success');
        } catch (error) {
          set({ isLoading: false }, false, 'loadNutritionData:error');
          console.error('Load nutrition data error:', error);
        }
      },

      addFoodEntry: async (entry) => {
        try {
          const newEntry = await systemService.post('/nutrition/entries', entry);
          set((state) => ({
            foodEntries: [...state.foodEntries, newEntry]
          }), false, 'addFoodEntry:success');
          
          // Reload summary
          get().loadNutritionData(get().currentDate);
        } catch (error) {
          console.error('Add food entry error:', error);
          throw error;
        }
      },

      updateFoodEntry: async (id, entry) => {
        try {
          const updatedEntry = await systemService.patch(`/nutrition/entries/${id}`, entry);
          set((state) => ({
            foodEntries: state.foodEntries.map(e => e.id === id ? updatedEntry : e)
          }), false, 'updateFoodEntry:success');
          
          // Reload summary
          get().loadNutritionData(get().currentDate);
        } catch (error) {
          console.error('Update food entry error:', error);
          throw error;
        }
      },

      deleteFoodEntry: async (id) => {
        try {
          await systemService.delete(`/nutrition/entries/${id}`);
          set((state) => ({
            foodEntries: state.foodEntries.filter(e => e.id !== id)
          }), false, 'deleteFoodEntry:success');
          
          // Reload summary
          get().loadNutritionData(get().currentDate);
        } catch (error) {
          console.error('Delete food entry error:', error);
          throw error;
        }
      },
    }),
    { name: 'NutritionStore' }
  )
);

// ================== WORKOUT STORE ==================
interface WorkoutState {
  workouts: any[];
  currentWorkout: any | null;
  exercises: any[];
  isLoading: boolean;
  
  loadWorkouts: (params?: any) => Promise<void>;
  loadWorkout: (id: string) => Promise<void>;
  createWorkout: (workout: any) => Promise<void>;
  updateWorkout: (id: string, workout: any) => Promise<void>;
  deleteWorkout: (id: string) => Promise<void>;
  loadExercises: () => Promise<void>;
}

export const useWorkoutStore = create<WorkoutState>()(
  devtools(
    (set, get) => ({
      workouts: [],
      currentWorkout: null,
      exercises: [],
      isLoading: false,

      loadWorkouts: async (params = {}) => {
        set({ isLoading: true }, false, 'loadWorkouts:start');
        try {
          const workouts = await systemService.get('/workouts', params);
          set({ workouts, isLoading: false }, false, 'loadWorkouts:success');
        } catch (error) {
          set({ isLoading: false }, false, 'loadWorkouts:error');
          console.error('Load workouts error:', error);
        }
      },

      loadWorkout: async (id) => {
        set({ isLoading: true }, false, 'loadWorkout:start');
        try {
          const workout = await systemService.get(`/workouts/${id}`);
          set({ currentWorkout: workout, isLoading: false }, false, 'loadWorkout:success');
        } catch (error) {
          set({ isLoading: false }, false, 'loadWorkout:error');
          console.error('Load workout error:', error);
        }
      },

      createWorkout: async (workout) => {
        try {
          const newWorkout = await systemService.post('/workouts', workout);
          set((state) => ({
            workouts: [...state.workouts, newWorkout]
          }), false, 'createWorkout:success');
        } catch (error) {
          console.error('Create workout error:', error);
          throw error;
        }
      },

      updateWorkout: async (id, workout) => {
        try {
          const updatedWorkout = await systemService.patch(`/workouts/${id}`, workout);
          set((state) => ({
            workouts: state.workouts.map(w => w.id === id ? updatedWorkout : w),
            currentWorkout: state.currentWorkout?.id === id ? updatedWorkout : state.currentWorkout
          }), false, 'updateWorkout:success');
        } catch (error) {
          console.error('Update workout error:', error);
          throw error;
        }
      },

      deleteWorkout: async (id) => {
        try {
          await systemService.delete(`/workouts/${id}`);
          set((state) => ({
            workouts: state.workouts.filter(w => w.id !== id),
            currentWorkout: state.currentWorkout?.id === id ? null : state.currentWorkout
          }), false, 'deleteWorkout:success');
        } catch (error) {
          console.error('Delete workout error:', error);
          throw error;
        }
      },

      loadExercises: async () => {
        try {
          const exercises = await systemService.get('/workouts/exercises');
          set({ exercises }, false, 'loadExercises:success');
        } catch (error) {
          console.error('Load exercises error:', error);
        }
      },
    }),
    { name: 'WorkoutStore' }
  )
);

// ================== EXPORT SELECTORS ==================
export const useAuth = () => useAppStore((state) => ({
  user: state.user,
  isAuthenticated: state.isAuthenticated,
  isLoading: state.isLoading,
  error: state.error,
  login: state.login,
  logout: state.logout,
  register: state.register,
  refreshUser: state.refreshUser,
}));

export const useUI = () => useAppStore((state) => ({
  theme: state.theme,
  sidebarOpen: state.sidebarOpen,
  notifications: state.notifications,
  setTheme: state.setTheme,
  toggleSidebar: state.toggleSidebar,
  addNotification: state.addNotification,
  removeNotification: state.removeNotification,
  clearNotifications: state.clearNotifications,
}));

export const useUpdates = () => useAppStore((state) => ({
  updateInfo: state.updateInfo,
  updateProgress: state.updateProgress,
  updateSettings: state.updateSettings,
  hasNewUpdate: state.hasNewUpdate,
  checkForUpdates: state.checkForUpdates,
  downloadUpdate: state.downloadUpdate,
  installUpdate: state.installUpdate,
  updateUpdateSettings: state.updateUpdateSettings,
  clearUpdateInfo: state.clearUpdateInfo,
}));