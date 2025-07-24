<?php

declare(strict_types=1);

namespace App\Application\Settings;

interface SettingsInterface
{
    /**
     * Get setting value by key
     */
    public function get(string $key = ''): mixed;

    /**
     * Set setting value by key
     */
    public function set(string $key, mixed $value): void;

    /**
     * Check if setting exists
     */
    public function has(string $key): bool;

    /**
     * Get all settings
     */
    public function all(): array;
}