<?php

declare(strict_types=1);

use DI\ContainerBuilder;
use Psr\Container\ContainerInterface;

// Import Services
use App\Services\AuthService;
use App\Services\UserService;
use App\Services\ValidationService;
use App\Services\JwtService;
use App\Services\AutoUpdateService;
use App\Services\UpdateSecurityService;
use App\Services\BackupService;

// Import Repositories
use App\Repositories\UserRepository;
use App\Repositories\UserTokenRepository;
use App\Repositories\FoodRepository;
use App\Repositories\NutritionRepository;
use App\Repositories\WorkoutRepository;
use App\Repositories\ExerciseRepository;
use App\Repositories\MeasurementRepository;
use App\Repositories\GoalRepository;
use App\Repositories\AIConversationRepository;
use App\Repositories\SystemUpdateRepository;

return function (ContainerBuilder $containerBuilder) {
    $containerBuilder->addDefinitions([
        // Repositories
        UserRepository::class => function (ContainerInterface $c) {
            return new UserRepository();
        },

        UserTokenRepository::class => function (ContainerInterface $c) {
            return new UserTokenRepository();
        },

        FoodRepository::class => function (ContainerInterface $c) {
            return new FoodRepository();
        },

        NutritionRepository::class => function (ContainerInterface $c) {
            return new NutritionRepository();
        },

        WorkoutRepository::class => function (ContainerInterface $c) {
            return new WorkoutRepository();
        },

        ExerciseRepository::class => function (ContainerInterface $c) {
            return new ExerciseRepository();
        },

        MeasurementRepository::class => function (ContainerInterface $c) {
            return new MeasurementRepository();
        },

        GoalRepository::class => function (ContainerInterface $c) {
            return new GoalRepository();
        },

        AIConversationRepository::class => function (ContainerInterface $c) {
            return new AIConversationRepository();
        },

        SystemUpdateRepository::class => function (ContainerInterface $c) {
            return new SystemUpdateRepository();
        },

        // Services
        ValidationService::class => function (ContainerInterface $c) {
            return new ValidationService();
        },

        JwtService::class => function (ContainerInterface $c) {
            $settings = $c->get(\App\Application\Settings\SettingsInterface::class);
            return new JwtService($settings);
        },

        AuthService::class => function (ContainerInterface $c) {
            return new AuthService(
                $c->get(UserRepository::class),
                $c->get(UserTokenRepository::class),
                $c->get(JwtService::class),
                $c->get(\Predis\Client::class),
                $c->get(\Psr\Log\LoggerInterface::class)
            );
        },

        UserService::class => function (ContainerInterface $c) {
            return new UserService(
                $c->get(UserRepository::class),
                $c->get(\Psr\Log\LoggerInterface::class)
            );
        },

        UpdateSecurityService::class => function (ContainerInterface $c) {
            $settings = $c->get(\App\Application\Settings\SettingsInterface::class);
            return new UpdateSecurityService($settings);
        },

        BackupService::class => function (ContainerInterface $c) {
            $settings = $c->get(\App\Application\Settings\SettingsInterface::class);
            return new BackupService(
                $settings,
                $c->get(\Psr\Log\LoggerInterface::class)
            );
        },

        AutoUpdateService::class => function (ContainerInterface $c) {
            return new AutoUpdateService(
                $c->get(\GuzzleHttp\Client::class),
                $c->get(\Psr\Log\LoggerInterface::class),
                $c->get(\App\Application\Settings\SettingsInterface::class),
                $c->get(UpdateSecurityService::class),
                $c->get(BackupService::class)
            );
        },

        // HTTP Client
        \GuzzleHttp\Client::class => function (ContainerInterface $c) {
            return new \GuzzleHttp\Client([
                'timeout' => 30,
                'connect_timeout' => 10,
            ]);
        },
    ]);
};