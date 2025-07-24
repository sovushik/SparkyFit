// ================== API REQUEST TYPES ==================
export interface CreateFoodEntryRequest {
  foodId: string;
  quantity: number;
  mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  date: string;
}

export interface UpdateFoodEntryRequest {
  quantity?: number;
  mealType?: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  date?: string;
}

export interface CreateWorkoutRequest {
  name: string;
  description?: string;
  date: string;
  exercises: Array<{
    exerciseId: string;
    sets: Array<{
      reps?: number;
      weight?: number;
      duration?: number;
      distance?: number;
      restTime?: number;
    }>;
    order: number;
    notes?: string;
  }>;
}

export interface UpdateWorkoutRequest {
  name?: string;
  description?: string;
  status?: 'planned' | 'in_progress' | 'completed' | 'skipped';
  startTime?: string;
  endTime?: string;
  notes?: string;
}

export interface CreateMeasurementRequest {
  date: string;
  weight?: number;
  bodyFat?: number;
  muscleMass?: number;
  chest?: number;
  waist?: number;
  hips?: number;
  bicep?: number;
  thigh?: number;
  neck?: number;
  notes?: string;
}

export interface CreateWaterIntakeRequest {
  amount: number;
  date: string;
  time: string;
}

export interface CreateGoalRequest {
  title: string;
  description?: string;
  type: 'weight_loss' | 'weight_gain' | 'muscle_gain' | 'endurance' | 'strength' | 'custom';
  targetValue: number;
  currentValue: number;
  unit: string;
  deadline?: string;
  priority: 'low' | 'medium' | 'high';
}

export interface UpdateGoalRequest {
  title?: string;
  description?: string;
  targetValue?: number;
  currentValue?: number;
  deadline?: string;
  status?: 'active' | 'paused' | 'completed' | 'cancelled';
  priority?: 'low' | 'medium' | 'high';
}

export interface UpdateProfileRequest {
  firstName?: string;
  lastName?: string;
  dateOfBirth?: string;
  gender?: 'male' | 'female' | 'other';
  height?: number;
  currentWeight?: number;
  targetWeight?: number;
  activityLevel?: 'sedentary' | 'light' | 'moderate' | 'active' | 'very_active';
  goalType?: 'lose_weight' | 'maintain_weight' | 'gain_weight' | 'build_muscle';
  dailyCalorieGoal?: number;
  dailyProteinGoal?: number;
  dailyCarbGoal?: number;
  dailyFatGoal?: number;
  dailyWaterGoal?: number;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export interface SendAIMessageRequest {
  message: string;
  conversationId?: string;
  context?: {
    includeNutritionData?: boolean;
    includeWorkoutData?: boolean;
    includeMeasurementData?: boolean;
    includeGoalData?: boolean;
    dateRange?: {
      startDate: string;
      endDate: string;
    };
  };
}

// ================== API ENDPOINT TYPES ==================
export interface ApiEndpoints {
  // Auth endpoints
  login: '/auth/login';
  register: '/auth/register';
  refreshToken: '/auth/refresh';
  logout: '/auth/logout';
  forgotPassword: '/auth/forgot-password';
  resetPassword: '/auth/reset-password';
  
  // User endpoints
  profile: '/user/profile';
  updateProfile: '/user/profile';
  changePassword: '/user/change-password';
  deleteAccount: '/user/delete-account';
  exportData: '/user/export-data';
  
  // Nutrition endpoints
  foods: '/nutrition/foods';
  searchFoods: '/nutrition/foods/search';
  foodByBarcode: '/nutrition/foods/barcode';
  foodEntries: '/nutrition/entries';
  nutritionSummary: '/nutrition/summary';
  
  // Workout endpoints
  exercises: '/workouts/exercises';
  workouts: '/workouts';
  workoutTemplates: '/workouts/templates';
  
  // Measurement endpoints
  measurements: '/measurements';
  waterIntake: '/measurements/water';
  waterSummary: '/measurements/water/summary';
  
  // Goal endpoints
  goals: '/goals';
  goalTemplates: '/goals/templates';
  
  // AI Coach endpoints
  aiConversations: '/ai/conversations';
  aiMessages: '/ai/messages';
  aiRecommendations: '/ai/recommendations';
  
  // Analytics endpoints
  dashboardStats: '/analytics/dashboard';
  userActivity: '/analytics/activity';
  
  // System endpoints
  health: '/system/health';
  version: '/system/version';
  updates: '/system/updates';
}

// ================== HTTP CLIENT TYPES ==================
export interface HttpClientConfig {
  baseURL: string;
  timeout: number;
  headers: Record<string, string>;
  withCredentials: boolean;
}

export interface RequestConfig {
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  url: string;
  data?: any;
  params?: Record<string, any>;
  headers?: Record<string, string>;
}

// ================== ERROR TYPES ==================
export interface ApiError {
  code: string;
  message: string;
  details?: any;
  field?: string;
}

export interface ValidationError {
  field: string;
  message: string;
  code: string;
}

export interface HttpError extends Error {
  status: number;
  statusText: string;
  data?: any;
}

// ================== CACHE TYPES ==================
export interface CacheConfig {
  key: string;
  ttl: number; // seconds
  staleWhileRevalidate?: boolean;
}

export interface CacheEntry<T> {
  data: T;
  timestamp: number;
  ttl: number;
}