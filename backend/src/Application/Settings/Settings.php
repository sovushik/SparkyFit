<?php

declare(strict_types=1);

namespace App\Application\Settings;

class Settings implements SettingsInterface
{
    private array $settings;

    public function __construct(array $settings)
    {
        $this->settings = $settings;
    }

    /**
     * Get setting value by key
     */
    public function get(string $key = ''): mixed
    {
        if (empty($key)) {
            return $this->settings;
        }

        // Support dot notation for nested values
        $keys = explode('.', $key);
        $value = $this->settings;

        foreach ($keys as $nestedKey) {
            if (!isset($value[$nestedKey])) {
                return null;
            }
            $value = $value[$nestedKey];
        }

        return $value;
    }

    /**
     * Set setting value by key
     */
    public function set(string $key, mixed $value): void
    {
        $keys = explode('.', $key);
        $current = &$this->settings;

        foreach ($keys as $nestedKey) {
            if (!isset($current[$nestedKey]) || !is_array($current[$nestedKey])) {
                $current[$nestedKey] = [];
            }
            $current = &$current[$nestedKey];
        }

        $current = $value;
    }

    /**
     * Check if setting exists
     */
    public function has(string $key): bool
    {
        return $this->get($key) !== null;
    }

    /**
     * Get all settings
     */
    public function all(): array
    {
        return $this->settings;
    }
}