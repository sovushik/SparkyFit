<?php

declare(strict_types=1);

use App\Controllers\AuthController;
use App\Controllers\UserController;
use App\Middleware\JwtAuthMiddleware;
use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;
use Slim\App;
use Slim\Interfaces\RouteCollectorProxyInterface as Group;

return function (App $app) {
    $container = $app->getContainer();

    // Health check endpoint
    $app->get('/health', function (Request $request, Response $response) {
        $data = [
            'status' => 'ok',
            'timestamp' => date('c'),
            'version' => '1.0.0',
            'environment' => $_ENV['APP_ENV'] ?? 'development',
        ];

        $response->getBody()->write(json_encode($data));
        return $response->withHeader('Content-Type', 'application/json');
    });

    // API Routes
    $app->group('/api/v1', function (Group $group) use ($container) {
        
        // Public Authentication Routes
        $group->group('/auth', function (Group $group) use ($container) {
            $group->post('/register', [AuthController::class, 'register']);
            $group->post('/login', [AuthController::class, 'login']);
            $group->post('/refresh', [AuthController::class, 'refreshToken']);
            $group->post('/forgot-password', [AuthController::class, 'forgotPassword']);
            $group->post('/reset-password', [AuthController::class, 'resetPassword']);
            $group->post('/verify-email', [AuthController::class, 'verifyEmail']);
        });

        // Protected Routes (require authentication)
        $group->group('', function (Group $group) use ($container) {
            
            // Authentication Routes
            $group->group('/auth', function (Group $group) {
                $group->post('/logout', [AuthController::class, 'logout']);
                $group->get('/me', [AuthController::class, 'me']);
                $group->post('/change-password', [AuthController::class, 'changePassword']);
                $group->post('/logout-all', [AuthController::class, 'logoutAll']);
            });

            // User Routes
            $group->group('/user', function (Group $group) {
                $group->get('/profile', [UserController::class, 'getProfile']);
                $group->put('/profile', [UserController::class, 'updateProfile']);
                $group->post('/avatar', [UserController::class, 'uploadAvatar']);
                $group->delete('/avatar', [UserController::class, 'deleteAvatar']);
                $group->get('/activities', [UserController::class, 'getActivities']);
                $group->get('/statistics', [UserController::class, 'getStatistics']);
            });

            // Nutrition Routes
            $group->group('/nutrition', function (Group $group) {
                $group->get('/foods/search', [\App\Controllers\NutritionController::class, 'searchFoods']);
                $group->get('/foods/{id}', [\App\Controllers\NutritionController::class, 'getFood']);
                $group->post('/foods', [\App\Controllers\NutritionController::class, 'createFood']);
                
                $group->get('/entries', [\App\Controllers\NutritionController::class, 'getFoodEntries']);
                $group->post('/entries', [\App\Controllers\NutritionController::class, 'createFoodEntry']);
                $group->put('/entries/{id}', [\App\Controllers\NutritionController::class, 'updateFoodEntry']);
                $group->delete('/entries/{id}', [\App\Controllers\NutritionController::class, 'deleteFoodEntry']);
                
                $group->get('/summary', [\App\Controllers\NutritionController::class, 'getNutritionSummary']);
                $group->get('/goals', [\App\Controllers\NutritionController::class, 'getNutritionGoals']);
                $group->put('/goals', [\App\Controllers\NutritionController::class, 'updateNutritionGoals']);
            });

            // Workout Routes
            $group->group('/workouts', function (Group $group) {
                $group->get('', [\App\Controllers\WorkoutController::class, 'getWorkouts']);
                $group->post('', [\App\Controllers\WorkoutController::class, 'createWorkout']);
                $group->get('/{id}', [\App\Controllers\WorkoutController::class, 'getWorkout']);
                $group->put('/{id}', [\App\Controllers\WorkoutController::class, 'updateWorkout']);
                $group->delete('/{id}', [\App\Controllers\WorkoutController::class, 'deleteWorkout']);
                $group->post('/{id}/start', [\App\Controllers\WorkoutController::class, 'startWorkout']);
                $group->post('/{id}/complete', [\App\Controllers\WorkoutController::class, 'completeWorkout']);
                
                $group->get('/templates', [\App\Controllers\WorkoutController::class, 'getTemplates']);
                $group->post('/templates', [\App\Controllers\WorkoutController::class, 'createTemplate']);
            });

            // Exercise Routes
            $group->group('/exercises', function (Group $group) {
                $group->get('', [\App\Controllers\ExerciseController::class, 'getExercises']);
                $group->get('/search', [\App\Controllers\ExerciseController::class, 'searchExercises']);
                $group->get('/{id}', [\App\Controllers\ExerciseController::class, 'getExercise']);
                $group->post('', [\App\Controllers\ExerciseController::class, 'createExercise']);
                $group->put('/{id}', [\App\Controllers\ExerciseController::class, 'updateExercise']);
                $group->delete('/{id}', [\App\Controllers\ExerciseController::class, 'deleteExercise']);
            });

            // Measurements Routes
            $group->group('/measurements', function (Group $group) {
                $group->get('', [\App\Controllers\MeasurementController::class, 'getMeasurements']);
                $group->post('', [\App\Controllers\MeasurementController::class, 'createMeasurement']);
                $group->put('/{id}', [\App\Controllers\MeasurementController::class, 'updateMeasurement']);
                $group->delete('/{id}', [\App\Controllers\MeasurementController::class, 'deleteMeasurement']);
                $group->get('/stats', [\App\Controllers\MeasurementController::class, 'getStatistics']);
            });

            // Water Intake Routes
            $group->group('/water', function (Group $group) {
                $group->get('', [\App\Controllers\WaterController::class, 'getWaterIntake']);
                $group->post('', [\App\Controllers\WaterController::class, 'addWaterIntake']);
                $group->delete('/{id}', [\App\Controllers\WaterController::class, 'deleteWaterIntake']);
                $group->get('/summary', [\App\Controllers\WaterController::class, 'getWaterSummary']);
            });

            // Goals Routes
            $group->group('/goals', function (Group $group) {
                $group->get('', [\App\Controllers\GoalController::class, 'getGoals']);
                $group->post('', [\App\Controllers\GoalController::class, 'createGoal']);
                $group->get('/{id}', [\App\Controllers\GoalController::class, 'getGoal']);
                $group->put('/{id}', [\App\Controllers\GoalController::class, 'updateGoal']);
                $group->delete('/{id}', [\App\Controllers\GoalController::class, 'deleteGoal']);
                $group->post('/{id}/progress', [\App\Controllers\GoalController::class, 'updateProgress']);
            });

            // AI Routes
            $group->group('/ai', function (Group $group) {
                $group->get('/conversations', [\App\Controllers\AIController::class, 'getConversations']);
                $group->post('/conversations', [\App\Controllers\AIController::class, 'createConversation']);
                $group->get('/conversations/{id}', [\App\Controllers\AIController::class, 'getConversation']);
                $group->post('/conversations/{id}/messages', [\App\Controllers\AIController::class, 'sendMessage']);
                $group->get('/recommendations', [\App\Controllers\AIController::class, 'getRecommendations']);
            });

            // System Routes
            $group->group('/system', function (Group $group) {
                $group->get('/updates/check', [\App\Controllers\SystemController::class, 'checkUpdates']);
                $group->post('/updates/{id}/download', [\App\Controllers\SystemController::class, 'downloadUpdate']);
                $group->post('/updates/{id}/install', [\App\Controllers\SystemController::class, 'installUpdate']);
                $group->get('/settings', [\App\Controllers\SystemController::class, 'getSettings']);
                $group->get('/health', [\App\Controllers\SystemController::class, 'getHealth']);
            });

        })->add(new JwtAuthMiddleware($container));

    });

    // 404 Handler
    $app->map(['GET', 'POST', 'PUT', 'DELETE', 'PATCH'], '/{routes:.+}', function (Request $request, Response $response) {
        $response->getBody()->write(json_encode([
            'error' => true,
            'message' => 'Route not found',
            'path' => $request->getUri()->getPath(),
        ]));
        return $response->withStatus(404)->withHeader('Content-Type', 'application/json');
    });
};