<?php

declare(strict_types=1);

namespace App\Services;

use App\Application\Settings\SettingsInterface;
use Firebase\JWT\JWT;
use Firebase\JWT\Key;
use Ramsey\Uuid\Uuid;

class JwtService
{
    private SettingsInterface $settings;
    private string $secret;
    private string $algorithm;
    private int $accessTtl;
    private int $refreshTtl;

    public function __construct(SettingsInterface $settings)
    {
        $this->settings = $settings;
        $this->secret = $settings->get('jwt.secret');
        $this->algorithm = $settings->get('jwt.algorithm');
        $this->accessTtl = $settings->get('jwt.access_ttl');
        $this->refreshTtl = $settings->get('jwt.refresh_ttl');
    }

    /**
     * Generate access token
     */
    public function generateAccessToken(int $userId, array $extraClaims = []): string
    {
        $now = time();
        $jti = Uuid::uuid4()->toString();

        $payload = [
            'iss' => 'sparkyfit-api',           // Issuer
            'aud' => 'sparkyfit-app',           // Audience
            'iat' => $now,                      // Issued at
            'exp' => $now + $this->accessTtl,  // Expiration
            'jti' => $jti,                      // JWT ID
            'type' => 'access',                 // Token type
            'user_id' => $userId,               // User ID
        ];

        // Add extra claims
        $payload = array_merge($payload, $extraClaims);

        return JWT::encode($payload, $this->secret, $this->algorithm);
    }

    /**
     * Generate refresh token
     */
    public function generateRefreshToken(int $userId, array $extraClaims = []): string
    {
        $now = time();
        $jti = Uuid::uuid4()->toString();

        $payload = [
            'iss' => 'sparkyfit-api',
            'aud' => 'sparkyfit-app',
            'iat' => $now,
            'exp' => $now + $this->refreshTtl,
            'jti' => $jti,
            'type' => 'refresh',
            'user_id' => $userId,
        ];

        $payload = array_merge($payload, $extraClaims);

        return JWT::encode($payload, $this->secret, $this->algorithm);
    }

    /**
     * Generate both access and refresh tokens
     */
    public function generateTokenPair(int $userId, array $extraClaims = []): array
    {
        return [
            'access_token' => $this->generateAccessToken($userId, $extraClaims),
            'refresh_token' => $this->generateRefreshToken($userId, $extraClaims),
            'token_type' => 'Bearer',
            'expires_in' => $this->accessTtl,
            'refresh_expires_in' => $this->refreshTtl,
        ];
    }

    /**
     * Decode and validate token
     */
    public function decode(string $token): array
    {
        try {
            $decoded = JWT::decode($token, new Key($this->secret, $this->algorithm));
            return (array) $decoded;
        } catch (\Exception $e) {
            throw new \InvalidArgumentException('Invalid token: ' . $e->getMessage());
        }
    }

    /**
     * Validate token and return payload
     */
    public function validate(string $token): array
    {
        $payload = $this->decode($token);

        // Check if token is expired
        if (isset($payload['exp']) && $payload['exp'] < time()) {
            throw new \InvalidArgumentException('Token has expired');
        }

        // Check issuer
        if (!isset($payload['iss']) || $payload['iss'] !== 'sparkyfit-api') {
            throw new \InvalidArgumentException('Invalid token issuer');
        }

        // Check audience
        if (!isset($payload['aud']) || $payload['aud'] !== 'sparkyfit-app') {
            throw new \InvalidArgumentException('Invalid token audience');
        }

        return $payload;
    }

    /**
     * Get token expiration time
     */
    public function getTokenExpiration(string $token): int
    {
        $payload = $this->decode($token);
        return $payload['exp'] ?? 0;
    }

    /**
     * Check if token is expired
     */
    public function isTokenExpired(string $token): bool
    {
        try {
            $payload = $this->decode($token);
            return isset($payload['exp']) && $payload['exp'] < time();
        } catch (\Exception $e) {
            return true;
        }
    }

    /**
     * Get user ID from token
     */
    public function getUserIdFromToken(string $token): ?int
    {
        try {
            $payload = $this->decode($token);
            return $payload['user_id'] ?? null;
        } catch (\Exception $e) {
            return null;
        }
    }

    /**
     * Get JWT ID from token
     */
    public function getJtiFromToken(string $token): ?string
    {
        try {
            $payload = $this->decode($token);
            return $payload['jti'] ?? null;
        } catch (\Exception $e) {
            return null;
        }
    }

    /**
     * Get token type from token
     */
    public function getTokenType(string $token): ?string
    {
        try {
            $payload = $this->decode($token);
            return $payload['type'] ?? null;
        } catch (\Exception $e) {
            return null;
        }
    }

    /**
     * Refresh access token using refresh token
     */
    public function refreshAccessToken(string $refreshToken): array
    {
        $payload = $this->validate($refreshToken);
        
        // Ensure it's a refresh token
        if (($payload['type'] ?? '') !== 'refresh') {
            throw new \InvalidArgumentException('Invalid token type for refresh');
        }

        $userId = $payload['user_id'];
        
        // Generate new access token
        return [
            'access_token' => $this->generateAccessToken($userId),
            'token_type' => 'Bearer',
            'expires_in' => $this->accessTtl,
        ];
    }
}