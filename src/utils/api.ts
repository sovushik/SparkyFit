import type {
  ApiResponse,
  AuthResponse,
  TokenResponse,
  HttpError,
  RequestConfig,
} from '../types';

// ================== API CLIENT CLASS ==================
export class ApiClient {
  private baseURL: string;
  private accessToken: string | null = null;
  private refreshToken: string | null = null;
  private refreshPromise: Promise<TokenResponse> | null = null;

  constructor(baseURL: string = 'https://api.sparkyfit.ru') {
    this.baseURL = baseURL;
    this.loadTokensFromStorage();
  }

  // ================== TOKEN MANAGEMENT ==================
  private loadTokensFromStorage(): void {
    this.accessToken = localStorage.getItem('accessToken');
    this.refreshToken = localStorage.getItem('refreshToken');
  }

  private saveTokensToStorage(accessToken: string, refreshToken: string): void {
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
    this.accessToken = accessToken;
    this.refreshToken = refreshToken;
  }

  private clearTokens(): void {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    this.accessToken = null;
    this.refreshToken = null;
  }

  public setTokens(accessToken: string, refreshToken: string): void {
    this.saveTokensToStorage(accessToken, refreshToken);
  }

  public getAccessToken(): string | null {
    return this.accessToken;
  }

  public isAuthenticated(): boolean {
    return !!this.accessToken;
  }

  // ================== TOKEN REFRESH ==================
  private async refreshAccessToken(): Promise<TokenResponse> {
    if (!this.refreshToken) {
      throw new Error('No refresh token available');
    }

    // Prevent multiple simultaneous refresh requests
    if (this.refreshPromise) {
      return this.refreshPromise;
    }

    this.refreshPromise = this.request<TokenResponse>({
      method: 'POST',
      url: '/auth/refresh',
      data: { refreshToken: this.refreshToken },
    });

    try {
      const response = await this.refreshPromise;
      this.saveTokensToStorage(response.accessToken, response.refreshToken);
      this.refreshPromise = null;
      return response;
    } catch (error) {
      this.refreshPromise = null;
      this.clearTokens();
      throw error;
    }
  }

  // ================== HTTP CLIENT ==================
  private async request<T>(config: RequestConfig): Promise<T> {
    const url = `${this.baseURL}${config.url}`;
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...config.headers,
    };

    // Add authorization header if token exists and not refreshing
    if (this.accessToken && !config.url.includes('/auth/refresh')) {
      headers.Authorization = `Bearer ${this.accessToken}`;
    }

    let body: string | FormData | undefined;
    if (config.data) {
      if (config.data instanceof FormData) {
        body = config.data;
        delete headers['Content-Type']; // Let browser set it for FormData
      } else {
        body = JSON.stringify(config.data);
      }
    }

    // Add query parameters
    const searchParams = new URLSearchParams();
    if (config.params) {
      Object.entries(config.params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          searchParams.append(key, String(value));
        }
      });
    }
    const queryString = searchParams.toString();
    const finalUrl = queryString ? `${url}?${queryString}` : url;

    try {
      const response = await fetch(finalUrl, {
        method: config.method,
        headers,
        body,
      });

      if (!response.ok) {
        // Handle 401 Unauthorized - try to refresh token
        if (response.status === 401 && this.refreshToken && !config.url.includes('/auth/refresh')) {
          try {
            await this.refreshAccessToken();
            // Retry the original request with new token
            return this.request(config);
          } catch (refreshError) {
            // Refresh failed, redirect to login
            this.clearTokens();
            window.location.href = '/login';
            throw refreshError;
          }
        }

        const errorData = await response.json().catch(() => ({}));
        const error: HttpError = new Error(errorData.message || response.statusText) as HttpError;
        error.status = response.status;
        error.statusText = response.statusText;
        error.data = errorData;
        throw error;
      }

      const data = await response.json();
      return data.data || data;
    } catch (error) {
      if (error instanceof TypeError && error.message === 'Failed to fetch') {
        throw new Error('Сеть недоступна. Проверьте подключение к интернету.');
      }
      throw error;
    }
  }

  // ================== PUBLIC API METHODS ==================
  public async get<T>(url: string, params?: Record<string, any>): Promise<T> {
    return this.request<T>({ method: 'GET', url, params });
  }

  public async post<T>(url: string, data?: any): Promise<T> {
    return this.request<T>({ method: 'POST', url, data });
  }

  public async put<T>(url: string, data?: any): Promise<T> {
    return this.request<T>({ method: 'PUT', url, data });
  }

  public async patch<T>(url: string, data?: any): Promise<T> {
    return this.request<T>({ method: 'PATCH', url, data });
  }

  public async delete<T>(url: string): Promise<T> {
    return this.request<T>({ method: 'DELETE', url });
  }

  // ================== AUTH METHODS ==================
  public async login(email: string, password: string): Promise<AuthResponse> {
    const response = await this.post<AuthResponse>('/auth/login', { email, password });
    this.setTokens(response.accessToken, response.refreshToken);
    return response;
  }

  public async register(userData: {
    email: string;
    username: string;
    password: string;
    firstName: string;
    lastName: string;
  }): Promise<AuthResponse> {
    const response = await this.post<AuthResponse>('/auth/register', userData);
    this.setTokens(response.accessToken, response.refreshToken);
    return response;
  }

  public async logout(): Promise<void> {
    try {
      await this.post('/auth/logout', { refreshToken: this.refreshToken });
    } finally {
      this.clearTokens();
    }
  }

  public async forgotPassword(email: string): Promise<void> {
    await this.post('/auth/forgot-password', { email });
  }

  public async resetPassword(token: string, password: string): Promise<void> {
    await this.post('/auth/reset-password', { token, password });
  }
}

// ================== SINGLETON INSTANCE ==================
export const apiClient = new ApiClient();

// ================== API SERVICE FUNCTIONS ==================

// Auth Services
export const authService = {
  login: (email: string, password: string) => apiClient.login(email, password),
  register: (userData: any) => apiClient.register(userData),
  logout: () => apiClient.logout(),
  forgotPassword: (email: string) => apiClient.forgotPassword(email),
  resetPassword: (token: string, password: string) => apiClient.resetPassword(token, password),
  isAuthenticated: () => apiClient.isAuthenticated(),
  getAccessToken: () => apiClient.getAccessToken(),
};

// User Services
export const userService = {
  getProfile: () => apiClient.get('/user/profile'),
  updateProfile: (data: any) => apiClient.patch('/user/profile', data),
  changePassword: (data: any) => apiClient.post('/user/change-password', data),
  deleteAccount: () => apiClient.delete('/user/delete-account'),
  exportData: () => apiClient.get('/user/export-data'),
};

// Nutrition Services
export const nutritionService = {
  searchFoods: (query: string, params?: any) => 
    apiClient.get('/nutrition/foods/search', { query, ...params }),
  getFoodByBarcode: (barcode: string) => 
    apiClient.get(`/nutrition/foods/barcode/${barcode}`),
  getFoodEntries: (params?: any) => 
    apiClient.get('/nutrition/entries', params),
  createFoodEntry: (data: any) => 
    apiClient.post('/nutrition/entries', data),
  updateFoodEntry: (id: string, data: any) => 
    apiClient.patch(`/nutrition/entries/${id}`, data),
  deleteFoodEntry: (id: string) => 
    apiClient.delete(`/nutrition/entries/${id}`),
  getNutritionSummary: (date: string) => 
    apiClient.get(`/nutrition/summary/${date}`),
  createFood: (data: any) => 
    apiClient.post('/nutrition/foods', data),
};

// Workout Services
export const workoutService = {
  getExercises: (params?: any) => 
    apiClient.get('/workouts/exercises', params),
  searchExercises: (query: string, params?: any) => 
    apiClient.get('/workouts/exercises/search', { query, ...params }),
  getWorkouts: (params?: any) => 
    apiClient.get('/workouts', params),
  getWorkout: (id: string) => 
    apiClient.get(`/workouts/${id}`),
  createWorkout: (data: any) => 
    apiClient.post('/workouts', data),
  updateWorkout: (id: string, data: any) => 
    apiClient.patch(`/workouts/${id}`, data),
  deleteWorkout: (id: string) => 
    apiClient.delete(`/workouts/${id}`),
  getWorkoutTemplates: (params?: any) => 
    apiClient.get('/workouts/templates', params),
  createWorkoutTemplate: (data: any) => 
    apiClient.post('/workouts/templates', data),
};

// Measurement Services
export const measurementService = {
  getMeasurements: (params?: any) => 
    apiClient.get('/measurements', params),
  createMeasurement: (data: any) => 
    apiClient.post('/measurements', data),
  updateMeasurement: (id: string, data: any) => 
    apiClient.patch(`/measurements/${id}`, data),
  deleteMeasurement: (id: string) => 
    apiClient.delete(`/measurements/${id}`),
  getWaterIntake: (date: string) => 
    apiClient.get(`/measurements/water/${date}`),
  addWaterIntake: (data: any) => 
    apiClient.post('/measurements/water', data),
  getWaterSummary: (date: string) => 
    apiClient.get(`/measurements/water/summary/${date}`),
};

// Goal Services
export const goalService = {
  getGoals: (params?: any) => 
    apiClient.get('/goals', params),
  getGoal: (id: string) => 
    apiClient.get(`/goals/${id}`),
  createGoal: (data: any) => 
    apiClient.post('/goals', data),
  updateGoal: (id: string, data: any) => 
    apiClient.patch(`/goals/${id}`, data),
  deleteGoal: (id: string) => 
    apiClient.delete(`/goals/${id}`),
  getGoalTemplates: () => 
    apiClient.get('/goals/templates'),
};

// AI Coach Services
export const aiService = {
  getConversations: () => 
    apiClient.get('/ai/conversations'),
  getConversation: (id: string) => 
    apiClient.get(`/ai/conversations/${id}`),
  createConversation: (title: string) => 
    apiClient.post('/ai/conversations', { title }),
  sendMessage: (data: any) => 
    apiClient.post('/ai/messages', data),
  getRecommendations: () => 
    apiClient.get('/ai/recommendations'),
  markRecommendationRead: (id: string) => 
    apiClient.patch(`/ai/recommendations/${id}`, { isRead: true }),
};

// Analytics Services
export const analyticsService = {
  getDashboardStats: () => 
    apiClient.get('/analytics/dashboard'),
  getUserActivity: (params?: any) => 
    apiClient.get('/analytics/activity', params),
};

// System Services
export const systemService = {
  getHealth: () => 
    apiClient.get('/system/health'),
  getVersion: () => 
    apiClient.get('/system/version'),
  checkForUpdates: () => 
    apiClient.get('/system/updates/check'),
  downloadUpdate: () => 
    apiClient.post('/system/updates/download'),
  installUpdate: () => 
    apiClient.post('/system/updates/install'),
  getUpdateProgress: () => 
    apiClient.get('/system/updates/progress'),
  getUpdateSettings: () => 
    apiClient.get('/system/updates/settings'),
  updateSettings: (data: any) => 
    apiClient.patch('/system/updates/settings', data),
};

// ================== ERROR HANDLER ==================
export const handleApiError = (error: any): string => {
  if (error?.data?.message) {
    return error.data.message;
  }
  
  if (error?.message) {
    return error.message;
  }

  if (error?.status) {
    switch (error.status) {
      case 400:
        return 'Неверные данные запроса';
      case 401:
        return 'Необходима авторизация';
      case 403:
        return 'Доступ запрещен';
      case 404:
        return 'Ресурс не найден';
      case 429:
        return 'Слишком много запросов. Попробуйте позже';
      case 500:
        return 'Ошибка сервера. Попробуйте позже';
      default:
        return 'Произошла ошибка. Попробуйте позже';
    }
  }

  return 'Произошла неизвестная ошибка';
};

// ================== EXPORT DEFAULT ==================
export default apiClient;