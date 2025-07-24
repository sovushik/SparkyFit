// ================== USER TYPES ==================
export interface User {
  id: string;
  email: string;
  username: string;
  firstName: string;
  lastName: string;
  dateOfBirth?: string;
  gender?: 'male' | 'female' | 'other';
  height?: number; // cm
  activityLevel?: 'sedentary' | 'light' | 'moderate' | 'active' | 'very_active';
  goalType?: 'lose_weight' | 'maintain_weight' | 'gain_weight' | 'build_muscle';
  avatar?: string;
  isEmailVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface UserProfile extends User {
  currentWeight?: number;
  targetWeight?: number;
  weeklyGoal?: number; // kg per week
  dailyCalorieGoal?: number;
  dailyProteinGoal?: number;
  dailyCarbGoal?: number;
  dailyFatGoal?: number;
  dailyWaterGoal?: number; // ml
}

// ================== AUTH TYPES ==================
export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  username: string;
  password: string;
  firstName: string;
  lastName: string;
}

export interface AuthResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

export interface TokenResponse {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

// ================== NUTRITION TYPES ==================
export interface Food {
  id: string;
  name: string;
  brand?: string;
  barcode?: string;
  caloriesPer100g: number;
  proteinPer100g: number;
  carbsPer100g: number;
  fatPer100g: number;
  fiberPer100g?: number;
  sugarPer100g?: number;
  sodiumPer100g?: number;
  servingSize?: number;
  servingUnit?: string;
  category?: string;
  isVerified: boolean;
  createdBy?: string;
  createdAt: string;
  updatedAt: string;
}

export interface FoodEntry {
  id: string;
  userId: string;
  foodId: string;
  food: Food;
  quantity: number; // grams
  mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  date: string; // YYYY-MM-DD
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  createdAt: string;
  updatedAt: string;
}

export interface NutritionSummary {
  date: string;
  totalCalories: number;
  totalProtein: number;
  totalCarbs: number;
  totalFat: number;
  goalCalories: number;
  goalProtein: number;
  goalCarbs: number;
  goalFat: number;
  entries: FoodEntry[];
}

// ================== WORKOUT TYPES ==================
export interface Exercise {
  id: string;
  name: string;
  category: string;
  muscleGroups: string[];
  equipment?: string;
  instructions: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  metValue?: number; // for calorie calculation
  imageUrl?: string;
  videoUrl?: string;
  isCustom: boolean;
  createdBy?: string;
  createdAt: string;
  updatedAt: string;
}

export interface WorkoutSet {
  id: string;
  exerciseId: string;
  reps?: number;
  weight?: number; // kg
  duration?: number; // seconds
  distance?: number; // meters
  restTime?: number; // seconds
  notes?: string;
  completed: boolean;
}

export interface WorkoutExercise {
  id: string;
  workoutId: string;
  exerciseId: string;
  exercise: Exercise;
  sets: WorkoutSet[];
  order: number;
  notes?: string;
}

export interface Workout {
  id: string;
  userId: string;
  name: string;
  description?: string;
  date: string; // YYYY-MM-DD
  startTime?: string;
  endTime?: string;
  duration?: number; // minutes
  status: 'planned' | 'in_progress' | 'completed' | 'skipped';
  exercises: WorkoutExercise[];
  totalCaloriesBurned?: number;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface WorkoutTemplate {
  id: string;
  userId: string;
  name: string;
  description?: string;
  exercises: Omit<WorkoutExercise, 'id' | 'workoutId'>[];
  isPublic: boolean;
  category?: string;
  estimatedDuration?: number; // minutes
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  createdAt: string;
  updatedAt: string;
}

// ================== MEASUREMENT TYPES ==================
export interface BodyMeasurement {
  id: string;
  userId: string;
  date: string; // YYYY-MM-DD
  weight?: number; // kg
  bodyFat?: number; // percentage
  muscleMass?: number; // kg
  chest?: number; // cm
  waist?: number; // cm
  hips?: number; // cm
  bicep?: number; // cm
  thigh?: number; // cm
  neck?: number; // cm
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface WaterIntake {
  id: string;
  userId: string;
  date: string; // YYYY-MM-DD
  amount: number; // ml
  time: string; // HH:MM
  createdAt: string;
  updatedAt: string;
}

export interface WaterSummary {
  date: string;
  totalAmount: number;
  goalAmount: number;
  entries: WaterIntake[];
}

// ================== GOAL TYPES ==================
export interface Goal {
  id: string;
  userId: string;
  title: string;
  description?: string;
  type: 'weight_loss' | 'weight_gain' | 'muscle_gain' | 'endurance' | 'strength' | 'custom';
  targetValue: number;
  currentValue: number;
  unit: string;
  deadline?: string; // YYYY-MM-DD
  status: 'active' | 'paused' | 'completed' | 'cancelled';
  priority: 'low' | 'medium' | 'high';
  progress: number; // percentage
  milestones?: Milestone[];
  createdAt: string;
  updatedAt: string;
}

export interface Milestone {
  id: string;
  goalId: string;
  title: string;
  targetValue: number;
  isCompleted: boolean;
  completedAt?: string;
  reward?: string;
}

// ================== AI COACH TYPES ==================
export interface AIMessage {
  id: string;
  conversationId: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  metadata?: {
    context?: string;
    recommendations?: string[];
    analysisData?: any;
  };
}

export interface AIConversation {
  id: string;
  userId: string;
  title: string;
  messages: AIMessage[];
  status: 'active' | 'archived';
  createdAt: string;
  updatedAt: string;
}

export interface AIRecommendation {
  id: string;
  userId: string;
  type: 'workout' | 'nutrition' | 'recovery' | 'goal';
  title: string;
  description: string;
  actionItems: string[];
  priority: 'low' | 'medium' | 'high';
  isRead: boolean;
  expiresAt?: string;
  createdAt: string;
}

// ================== AUTO-UPDATE TYPES ==================
export interface UpdateInfo {
  version: string;
  description: string;
  releaseNotes: string[];
  downloadUrl: string;
  checksum: string;
  size: number; // bytes
  isSecurityUpdate: boolean;
  isCritical: boolean;
  releaseDate: string;
}

export interface UpdateProgress {
  stage: 'checking' | 'downloading' | 'installing' | 'completed' | 'error';
  progress: number; // 0-100
  message: string;
  error?: string;
  timeRemaining?: number; // seconds
}

export interface UpdateSettings {
  autoCheck: boolean;
  autoDownload: boolean;
  autoInstall: boolean;
  checkInterval: number; // hours
  allowPreRelease: boolean;
  notifyBeforeInstall: boolean;
}

// ================== ANALYTICS TYPES ==================
export interface DashboardStats {
  user: {
    totalUsers: number;
    activeUsers: number;
    newUsersToday: number;
    retentionRate: number;
  };
  nutrition: {
    totalFoodEntries: number;
    avgCaloriesPerDay: number;
    topFoods: Array<{ name: string; count: number }>;
  };
  workouts: {
    totalWorkouts: number;
    avgWorkoutsPerWeek: number;
    totalCaloriesBurned: number;
    popularExercises: Array<{ name: string; count: number }>;
  };
  goals: {
    totalGoals: number;
    completedGoals: number;
    averageProgress: number;
  };
}

export interface UserActivity {
  id: string;
  userId: string;
  type: 'login' | 'food_entry' | 'workout_completed' | 'goal_created' | 'measurement_added';
  description: string;
  metadata?: any;
  timestamp: string;
}

// ================== API RESPONSE TYPES ==================
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  errors?: string[];
  meta?: {
    page?: number;
    limit?: number;
    total?: number;
    totalPages?: number;
  };
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// ================== FORM TYPES ==================
export interface SearchFilters {
  query?: string;
  category?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

export interface DateRange {
  startDate: string;
  endDate: string;
}

// ================== UI STATE TYPES ==================
export interface AppState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  theme: 'light' | 'dark';
  notifications: Notification[];
}

export interface Notification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message: string;
  duration?: number; // milliseconds
  autoClose?: boolean;
  actions?: Array<{
    label: string;
    onClick: () => void;
  }>;
}

// ================== EXPORT ALL ==================
export * from './api';