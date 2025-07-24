import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from 'react-query';
import { ReactQueryDevtools } from 'react-query/devtools';
import { Toaster } from 'react-hot-toast';

// Store
import { useAppStore } from './store';

// Hooks
import { useAuth, useAutoUpdate } from './hooks';

// Components
import Layout from './components/Layout';
import AuthLayout from './components/AuthLayout';
import LoadingScreen from './components/ui/LoadingScreen';
import NotificationSystem from './components/NotificationSystem';
import UpdateSystem from './components/UpdateSystem';

// Pages
import Dashboard from './pages/Dashboard';
import Nutrition from './pages/Nutrition';
import Workouts from './pages/Workouts';
import WorkoutDetails from './pages/WorkoutDetails';
import Measurements from './pages/Measurements';
import Water from './pages/Water';
import Goals from './pages/Goals';
import AICoach from './pages/AICoach';
import Profile from './pages/Profile';
import Settings from './pages/Settings';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import ForgotPassword from './pages/auth/ForgotPassword';
import ResetPassword from './pages/auth/ResetPassword';

// Utils
import { apiClient } from './utils/api';

// Create QueryClient
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      cacheTime: 10 * 60 * 1000, // 10 minutes
      retry: (failureCount, error: any) => {
        if (error?.status === 401 || error?.status === 403) {
          return false;
        }
        return failureCount < 3;
      },
    },
    mutations: {
      retry: false,
    },
  },
});

// Protected Route Component
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  
  if (!isAuthenticated) {
    return <Navigate to="/auth/login" replace />;
  }
  
  return <>{children}</>;
};

// Public Route Component (redirect if authenticated)
const PublicRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  
  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }
  
  return <>{children}</>;
};

const App: React.FC = () => {
  const { isLoading, error, clearError, checkForUpdates } = useAppStore();
  const { user } = useAuth();
  useAutoUpdate();

  // Initialize the app
  useEffect(() => {
    const initializeApp = async () => {
      try {
        // Try to refresh user data if tokens exist
        const accessToken = apiClient.getAccessToken();
        if (accessToken && !user) {
          // This will trigger the auth state update
          await apiClient.request('GET', '/auth/me');
        }
        
        // Check for updates
        checkForUpdates();
      } catch (error) {
        console.error('App initialization failed:', error);
      }
    };

    initializeApp();
  }, [user, checkForUpdates]);

  // Show loading screen during app initialization
  if (isLoading && !user) {
    return <LoadingScreen message="Загрузка SparkyFit..." showLogo />;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
          <Routes>
            {/* Auth Routes */}
            <Route path="/auth" element={<AuthLayout />}>
              <Route path="login" element={<PublicRoute><Login /></PublicRoute>} />
              <Route path="register" element={<PublicRoute><Register /></PublicRoute>} />
              <Route path="forgot-password" element={<PublicRoute><ForgotPassword /></PublicRoute>} />
              <Route path="reset-password" element={<PublicRoute><ResetPassword /></PublicRoute>} />
            </Route>

            {/* Protected Routes */}
            <Route path="/" element={<ProtectedRoute><Layout /></ProtectedRoute>}>
              <Route index element={<Navigate to="/dashboard" replace />} />
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="nutrition" element={<Nutrition />} />
              <Route path="workouts" element={<Workouts />} />
              <Route path="workouts/:id" element={<WorkoutDetails />} />
              <Route path="measurements" element={<Measurements />} />
              <Route path="water" element={<Water />} />
              <Route path="goals" element={<Goals />} />
              <Route path="ai-coach" element={<AICoach />} />
              <Route path="profile" element={<Profile />} />
              <Route path="settings" element={<Settings />} />
            </Route>

            {/* Catch all */}
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>

          {/* Global Components */}
          <NotificationSystem />
          <UpdateSystem />
          
          {/* Toast Notifications */}
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#363636',
                color: '#fff',
              },
              success: {
                duration: 3000,
                iconTheme: {
                  primary: '#10b981',
                  secondary: '#fff',
                },
              },
              error: {
                duration: 5000,
                iconTheme: {
                  primary: '#ef4444',
                  secondary: '#fff',
                },
              },
            }}
          />
        </div>
      </Router>

      {/* React Query DevTools */}
      {process.env.NODE_ENV === 'development' && (
        <ReactQueryDevtools initialIsOpen={false} />
      )}
    </QueryClientProvider>
  );
};

export default App;