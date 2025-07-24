<?php

declare(strict_types=1);

namespace App\Controllers;

use App\Models\User;
use App\Services\AuthService;
use App\Services\ValidationService;
use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;
use Psr\Log\LoggerInterface;

/**
 * Authentication Controller
 * Handles user authentication, registration, and token management
 */
class AuthController extends BaseController
{
    private AuthService $authService;
    private ValidationService $validator;

    public function __construct(
        LoggerInterface $logger,
        AuthService $authService,
        ValidationService $validator
    ) {
        parent::__construct($logger);
        $this->authService = $authService;
        $this->validator = $validator;
    }

    /**
     * User registration
     */
    public function register(Request $request, Response $response): Response
    {
        try {
            $data = $this->getJsonInput($request);

            // Validate input
            $validation = $this->validator->validate($data, [
                'email' => 'required|email|unique:users,email',
                'username' => 'required|string|min:3|max:30|unique:users,username',
                'password' => 'required|string|min:8',
                'firstName' => 'required|string|max:50',
                'lastName' => 'required|string|max:50',
            ]);

            if (!$validation['valid']) {
                return $this->respondWithError($response, 'Validation failed', 400, $validation['errors']);
            }

            // Check if user already exists
            if (User::where('email', $data['email'])->exists()) {
                return $this->respondWithError($response, 'Email already registered', 409);
            }

            if (User::where('username', $data['username'])->exists()) {
                return $this->respondWithError($response, 'Username already taken', 409);
            }

            // Create user
            $user = $this->authService->register([
                'email' => $data['email'],
                'username' => $data['username'],
                'password' => $data['password'],
                'first_name' => $data['firstName'],
                'last_name' => $data['lastName'],
            ]);

            // Generate tokens
            $tokens = $this->authService->generateTokens($user);

            $this->logger->info('User registered successfully', [
                'user_id' => $user->id,
                'email' => $user->email,
            ]);

            return $this->respondWithData($response, [
                'user' => $this->formatUser($user),
                'accessToken' => $tokens['access_token'],
                'refreshToken' => $tokens['refresh_token'],
                'expiresIn' => $tokens['expires_in'],
            ], 'Registration successful', 201);

        } catch (\Exception $e) {
            $this->logger->error('Registration failed: ' . $e->getMessage());
            return $this->respondWithError($response, 'Registration failed', 500);
        }
    }

    /**
     * User login
     */
    public function login(Request $request, Response $response): Response
    {
        try {
            $data = $this->getJsonInput($request);

            // Validate input
            $validation = $this->validator->validate($data, [
                'email' => 'required|email',
                'password' => 'required|string',
            ]);

            if (!$validation['valid']) {
                return $this->respondWithError($response, 'Validation failed', 400, $validation['errors']);
            }

            // Attempt authentication
            $result = $this->authService->authenticate($data['email'], $data['password']);

            if (!$result['success']) {
                $this->logger->warning('Login attempt failed', [
                    'email' => $data['email'],
                    'ip' => $this->getClientIp($request),
                ]);

                return $this->respondWithError($response, $result['message'], 401);
            }

            $user = $result['user'];
            $tokens = $this->authService->generateTokens($user);

            // Update last login
            $user->update([
                'last_login_at' => now(),
                'last_login_ip' => $this->getClientIp($request),
            ]);

            $this->logger->info('User logged in successfully', [
                'user_id' => $user->id,
                'email' => $user->email,
                'ip' => $this->getClientIp($request),
            ]);

            return $this->respondWithData($response, [
                'user' => $this->formatUser($user),
                'accessToken' => $tokens['access_token'],
                'refreshToken' => $tokens['refresh_token'],
                'expiresIn' => $tokens['expires_in'],
            ], 'Login successful');

        } catch (\Exception $e) {
            $this->logger->error('Login failed: ' . $e->getMessage());
            return $this->respondWithError($response, 'Login failed', 500);
        }
    }

    /**
     * Refresh access token
     */
    public function refreshToken(Request $request, Response $response): Response
    {
        try {
            $data = $this->getJsonInput($request);

            if (!isset($data['refreshToken'])) {
                return $this->respondWithError($response, 'Refresh token required', 400);
            }

            $result = $this->authService->refreshToken($data['refreshToken']);

            if (!$result['success']) {
                return $this->respondWithError($response, $result['message'], 401);
            }

            return $this->respondWithData($response, [
                'accessToken' => $result['access_token'],
                'refreshToken' => $result['refresh_token'],
                'expiresIn' => $result['expires_in'],
            ], 'Token refreshed successfully');

        } catch (\Exception $e) {
            $this->logger->error('Token refresh failed: ' . $e->getMessage());
            return $this->respondWithError($response, 'Token refresh failed', 500);
        }
    }

    /**
     * User logout
     */
    public function logout(Request $request, Response $response): Response
    {
        try {
            $data = $this->getJsonInput($request);
            $user = $request->getAttribute('user');

            // Revoke refresh token if provided
            if (isset($data['refreshToken'])) {
                $this->authService->revokeRefreshToken($data['refreshToken']);
            }

            // Blacklist current access token
            $accessToken = $this->extractTokenFromRequest($request);
            if ($accessToken) {
                $this->authService->blacklistToken($accessToken);
            }

            $this->logger->info('User logged out successfully', [
                'user_id' => $user->id ?? null,
            ]);

            return $this->respondWithData($response, null, 'Logout successful');

        } catch (\Exception $e) {
            $this->logger->error('Logout failed: ' . $e->getMessage());
            return $this->respondWithError($response, 'Logout failed', 500);
        }
    }

    /**
     * Forgot password
     */
    public function forgotPassword(Request $request, Response $response): Response
    {
        try {
            $data = $this->getJsonInput($request);

            $validation = $this->validator->validate($data, [
                'email' => 'required|email',
            ]);

            if (!$validation['valid']) {
                return $this->respondWithError($response, 'Validation failed', 400, $validation['errors']);
            }

            $result = $this->authService->sendPasswordResetEmail($data['email']);

            // Always return success for security reasons
            return $this->respondWithData($response, null, 'If the email exists, a password reset link has been sent');

        } catch (\Exception $e) {
            $this->logger->error('Forgot password failed: ' . $e->getMessage());
            return $this->respondWithError($response, 'Failed to process request', 500);
        }
    }

    /**
     * Reset password
     */
    public function resetPassword(Request $request, Response $response): Response
    {
        try {
            $data = $this->getJsonInput($request);

            $validation = $this->validator->validate($data, [
                'token' => 'required|string',
                'password' => 'required|string|min:8',
            ]);

            if (!$validation['valid']) {
                return $this->respondWithError($response, 'Validation failed', 400, $validation['errors']);
            }

            $result = $this->authService->resetPassword($data['token'], $data['password']);

            if (!$result['success']) {
                return $this->respondWithError($response, $result['message'], 400);
            }

            $this->logger->info('Password reset successfully', [
                'user_id' => $result['user']->id,
            ]);

            return $this->respondWithData($response, null, 'Password reset successfully');

        } catch (\Exception $e) {
            $this->logger->error('Password reset failed: ' . $e->getMessage());
            return $this->respondWithError($response, 'Password reset failed', 500);
        }
    }

    /**
     * Get current user profile
     */
    public function me(Request $request, Response $response): Response
    {
        try {
            $user = $request->getAttribute('user');

            if (!$user) {
                return $this->respondWithError($response, 'User not found', 404);
            }

            return $this->respondWithData($response, [
                'user' => $this->formatUser($user),
            ]);

        } catch (\Exception $e) {
            $this->logger->error('Get current user failed: ' . $e->getMessage());
            return $this->respondWithError($response, 'Failed to get user data', 500);
        }
    }

    /**
     * Format user data for response
     */
    private function formatUser(User $user): array
    {
        return [
            'id' => $user->id,
            'email' => $user->email,
            'username' => $user->username,
            'firstName' => $user->first_name,
            'lastName' => $user->last_name,
            'dateOfBirth' => $user->date_of_birth,
            'gender' => $user->gender,
            'height' => $user->height,
            'activityLevel' => $user->activity_level,
            'goalType' => $user->goal_type,
            'avatar' => $user->avatar,
            'isEmailVerified' => $user->email_verified_at !== null,
            'createdAt' => $user->created_at->toISOString(),
            'updatedAt' => $user->updated_at->toISOString(),
        ];
    }

    /**
     * Extract token from request
     */
    private function extractTokenFromRequest(Request $request): ?string
    {
        $header = $request->getHeaderLine('Authorization');
        
        if (preg_match('/Bearer\s+(.*)$/i', $header, $matches)) {
            return $matches[1];
        }

        return null;
    }

    /**
     * Get client IP address
     */
    private function getClientIp(Request $request): string
    {
        $serverParams = $request->getServerParams();
        
        if (!empty($serverParams['HTTP_X_FORWARDED_FOR'])) {
            return explode(',', $serverParams['HTTP_X_FORWARDED_FOR'])[0];
        }
        
        if (!empty($serverParams['HTTP_X_REAL_IP'])) {
            return $serverParams['HTTP_X_REAL_IP'];
        }
        
        return $serverParams['REMOTE_ADDR'] ?? 'unknown';
    }
}