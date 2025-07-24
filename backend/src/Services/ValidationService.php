<?php

declare(strict_types=1);

namespace App\Services;

use Respect\Validation\Validator as v;
use Respect\Validation\Exceptions\ValidationException;

class ValidationService
{
    /**
     * Validate user registration data
     */
    public function validateRegistration(array $data): array
    {
        $errors = [];

        // First name validation
        if (!isset($data['first_name']) || empty(trim($data['first_name']))) {
            $errors['first_name'] = 'Имя обязательно для заполнения';
        } elseif (!v::stringType()->length(2, 50)->validate($data['first_name'])) {
            $errors['first_name'] = 'Имя должно содержать от 2 до 50 символов';
        }

        // Last name validation
        if (!isset($data['last_name']) || empty(trim($data['last_name']))) {
            $errors['last_name'] = 'Фамилия обязательна для заполнения';
        } elseif (!v::stringType()->length(2, 50)->validate($data['last_name'])) {
            $errors['last_name'] = 'Фамилия должна содержать от 2 до 50 символов';
        }

        // Email validation
        if (!isset($data['email']) || empty(trim($data['email']))) {
            $errors['email'] = 'Email обязателен для заполнения';
        } elseif (!v::email()->validate($data['email'])) {
            $errors['email'] = 'Неверный формат email';
        }

        // Password validation
        if (!isset($data['password']) || empty($data['password'])) {
            $errors['password'] = 'Пароль обязателен для заполнения';
        } elseif (!$this->validatePassword($data['password'])) {
            $errors['password'] = 'Пароль должен содержать минимум 8 символов, включая заглавные и строчные буквы, цифры и специальные символы';
        }

        // Password confirmation
        if (!isset($data['password_confirmation']) || $data['password'] !== $data['password_confirmation']) {
            $errors['password_confirmation'] = 'Пароли не совпадают';
        }

        return $errors;
    }

    /**
     * Validate user login data
     */
    public function validateLogin(array $data): array
    {
        $errors = [];

        // Email validation
        if (!isset($data['email']) || empty(trim($data['email']))) {
            $errors['email'] = 'Email обязателен для заполнения';
        } elseif (!v::email()->validate($data['email'])) {
            $errors['email'] = 'Неверный формат email';
        }

        // Password validation
        if (!isset($data['password']) || empty($data['password'])) {
            $errors['password'] = 'Пароль обязателен для заполнения';
        }

        return $errors;
    }

    /**
     * Validate profile update data
     */
    public function validateProfileUpdate(array $data): array
    {
        $errors = [];

        // First name validation (optional)
        if (isset($data['first_name']) && !v::stringType()->length(2, 50)->validate($data['first_name'])) {
            $errors['first_name'] = 'Имя должно содержать от 2 до 50 символов';
        }

        // Last name validation (optional)
        if (isset($data['last_name']) && !v::stringType()->length(2, 50)->validate($data['last_name'])) {
            $errors['last_name'] = 'Фамилия должна содержать от 2 до 50 символов';
        }

        // Email validation (optional)
        if (isset($data['email']) && !v::email()->validate($data['email'])) {
            $errors['email'] = 'Неверный формат email';
        }

        // Phone validation (optional)
        if (isset($data['phone']) && !empty($data['phone']) && !v::phone()->validate($data['phone'])) {
            $errors['phone'] = 'Неверный формат телефона';
        }

        // Birth date validation (optional)
        if (isset($data['birth_date']) && !empty($data['birth_date'])) {
            if (!v::date('Y-m-d')->validate($data['birth_date'])) {
                $errors['birth_date'] = 'Неверный формат даты рождения';
            } else {
                $birthDate = new \DateTime($data['birth_date']);
                $today = new \DateTime();
                $age = $today->diff($birthDate)->y;
                
                if ($age < 13 || $age > 120) {
                    $errors['birth_date'] = 'Возраст должен быть от 13 до 120 лет';
                }
            }
        }

        // Gender validation (optional)
        if (isset($data['gender']) && !in_array($data['gender'], ['male', 'female', 'other'])) {
            $errors['gender'] = 'Неверное значение пола';
        }

        return $errors;
    }

    /**
     * Validate password change data
     */
    public function validatePasswordChange(array $data): array
    {
        $errors = [];

        // Current password validation
        if (!isset($data['current_password']) || empty($data['current_password'])) {
            $errors['current_password'] = 'Текущий пароль обязателен';
        }

        // New password validation
        if (!isset($data['new_password']) || empty($data['new_password'])) {
            $errors['new_password'] = 'Новый пароль обязателен';
        } elseif (!$this->validatePassword($data['new_password'])) {
            $errors['new_password'] = 'Новый пароль должен содержать минимум 8 символов, включая заглавные и строчные буквы, цифры и специальные символы';
        }

        // New password confirmation
        if (!isset($data['new_password_confirmation']) || $data['new_password'] !== $data['new_password_confirmation']) {
            $errors['new_password_confirmation'] = 'Пароли не совпадают';
        }

        return $errors;
    }

    /**
     * Validate food entry data
     */
    public function validateFoodEntry(array $data): array
    {
        $errors = [];

        // Food ID validation
        if (!isset($data['food_id']) || !v::intVal()->positive()->validate($data['food_id'])) {
            $errors['food_id'] = 'Неверный ID продукта';
        }

        // Amount validation
        if (!isset($data['amount']) || !v::floatVal()->positive()->validate($data['amount'])) {
            $errors['amount'] = 'Количество должно быть положительным числом';
        }

        // Meal type validation
        if (!isset($data['meal_type']) || !in_array($data['meal_type'], ['breakfast', 'lunch', 'dinner', 'snack'])) {
            $errors['meal_type'] = 'Неверный тип приема пищи';
        }

        // Date validation
        if (!isset($data['date']) || !v::date('Y-m-d')->validate($data['date'])) {
            $errors['date'] = 'Неверный формат даты';
        }

        return $errors;
    }

    /**
     * Validate workout data
     */
    public function validateWorkout(array $data): array
    {
        $errors = [];

        // Name validation
        if (!isset($data['name']) || empty(trim($data['name']))) {
            $errors['name'] = 'Название тренировки обязательно';
        } elseif (!v::stringType()->length(2, 100)->validate($data['name'])) {
            $errors['name'] = 'Название должно содержать от 2 до 100 символов';
        }

        // Date validation
        if (!isset($data['date']) || !v::date('Y-m-d')->validate($data['date'])) {
            $errors['date'] = 'Неверный формат даты';
        }

        return $errors;
    }

    /**
     * Validate measurement data
     */
    public function validateMeasurement(array $data): array
    {
        $errors = [];

        // Date validation
        if (!isset($data['date']) || !v::date('Y-m-d')->validate($data['date'])) {
            $errors['date'] = 'Неверный формат даты';
        }

        // Weight validation (optional)
        if (isset($data['weight']) && !empty($data['weight'])) {
            if (!v::floatVal()->between(20, 500)->validate($data['weight'])) {
                $errors['weight'] = 'Вес должен быть от 20 до 500 кг';
            }
        }

        // Height validation (optional)
        if (isset($data['height']) && !empty($data['height'])) {
            if (!v::floatVal()->between(50, 250)->validate($data['height'])) {
                $errors['height'] = 'Рост должен быть от 50 до 250 см';
            }
        }

        return $errors;
    }

    /**
     * Validate password strength
     */
    private function validatePassword(string $password): bool
    {
        // Minimum 8 characters
        if (strlen($password) < 8) {
            return false;
        }

        // At least one uppercase letter
        if (!preg_match('/[A-Z]/', $password)) {
            return false;
        }

        // At least one lowercase letter
        if (!preg_match('/[a-z]/', $password)) {
            return false;
        }

        // At least one digit
        if (!preg_match('/\d/', $password)) {
            return false;
        }

        // At least one special character
        if (!preg_match('/[^A-Za-z0-9]/', $password)) {
            return false;
        }

        return true;
    }

    /**
     * Sanitize input data
     */
    public function sanitize(array $data): array
    {
        $sanitized = [];

        foreach ($data as $key => $value) {
            if (is_string($value)) {
                $sanitized[$key] = trim(strip_tags($value));
            } elseif (is_array($value)) {
                $sanitized[$key] = $this->sanitize($value);
            } else {
                $sanitized[$key] = $value;
            }
        }

        return $sanitized;
    }

    /**
     * Validate email format
     */
    public function isValidEmail(string $email): bool
    {
        return v::email()->validate($email);
    }

    /**
     * Validate UUID format
     */
    public function isValidUuid(string $uuid): bool
    {
        return v::uuid()->validate($uuid);
    }
}