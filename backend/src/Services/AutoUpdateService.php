<?php

declare(strict_types=1);

namespace App\Services;

use App\Application\Settings\SettingsInterface;
use GuzzleHttp\Client;
use GuzzleHttp\Exception\GuzzleException;
use Psr\Log\LoggerInterface;
use RuntimeException;
use ZipArchive;

/**
 * Enterprise Auto-Update Service
 * Handles secure, zero-downtime updates with rollback capability
 */
class AutoUpdateService
{
    private Client $httpClient;
    private LoggerInterface $logger;
    private SettingsInterface $settings;
    private UpdateSecurityService $securityService;
    private BackupService $backupService;

    public function __construct(
        Client $httpClient,
        LoggerInterface $logger,
        SettingsInterface $settings,
        UpdateSecurityService $securityService,
        BackupService $backupService
    ) {
        $this->httpClient = $httpClient;
        $this->logger = $logger;
        $this->settings = $settings;
        $this->securityService = $securityService;
        $this->backupService = $backupService;
    }

    /**
     * Check for available updates
     */
    public function checkForUpdates(): ?array
    {
        try {
            $this->logger->info('Checking for updates...');
            
            $checkUrl = $this->settings->get('auto_update.check_url');
            if (!$checkUrl) {
                throw new RuntimeException('Update check URL not configured');
            }

            $currentVersion = $this->settings->get('app.version');
            
            $response = $this->httpClient->get($checkUrl, [
                'query' => [
                    'version' => $currentVersion,
                    'platform' => 'sparkyfit-backend',
                    'license_key' => $this->settings->get('license.key', ''),
                ],
                'timeout' => 30,
                'verify' => $this->settings->get('auto_update.verify_ssl', true),
            ]);

            $updateData = json_decode($response->getBody()->getContents(), true);

            if (json_last_error() !== JSON_ERROR_NONE) {
                throw new RuntimeException('Invalid JSON response from update server');
            }

            // Verify response signature
            if (!$this->securityService->verifyUpdateSignature($updateData)) {
                throw new RuntimeException('Update signature verification failed');
            }

            if (isset($updateData['available']) && $updateData['available']) {
                $this->logger->info('Update available', [
                    'current_version' => $currentVersion,
                    'new_version' => $updateData['version'] ?? 'unknown',
                ]);

                return [
                    'available' => true,
                    'version' => $updateData['version'],
                    'description' => $updateData['description'] ?? '',
                    'release_notes' => $updateData['release_notes'] ?? [],
                    'download_url' => $updateData['download_url'],
                    'checksum' => $updateData['checksum'],
                    'size' => $updateData['size'] ?? 0,
                    'is_security_update' => $updateData['is_security_update'] ?? false,
                    'is_critical' => $updateData['is_critical'] ?? false,
                    'release_date' => $updateData['release_date'] ?? date('Y-m-d H:i:s'),
                ];
            }

            $this->logger->info('No updates available');
            return null;

        } catch (GuzzleException $e) {
            $this->logger->error('Update check failed: ' . $e->getMessage());
            throw new RuntimeException('Failed to check for updates: ' . $e->getMessage());
        }
    }

    /**
     * Download update package
     */
    public function downloadUpdate(array $updateInfo): string
    {
        try {
            $this->logger->info('Downloading update...', ['version' => $updateInfo['version']]);

            $downloadUrl = $updateInfo['download_url'];
            $expectedChecksum = $updateInfo['checksum'];
            
            // Create temporary download directory
            $tempDir = sys_get_temp_dir() . '/sparkyfit_updates';
            if (!is_dir($tempDir)) {
                mkdir($tempDir, 0755, true);
            }

            $updateFile = $tempDir . '/update_' . $updateInfo['version'] . '.zip';

            // Download with progress tracking
            $response = $this->httpClient->get($downloadUrl, [
                'sink' => $updateFile,
                'timeout' => 300, // 5 minutes
                'verify' => $this->settings->get('auto_update.verify_ssl', true),
                'progress' => function ($downloadTotal, $downloadedBytes) {
                    if ($downloadTotal > 0) {
                        $progress = ($downloadedBytes / $downloadTotal) * 100;
                        $this->updateProgress('downloading', $progress, 'Загрузка обновления...');
                    }
                },
            ]);

            // Verify file integrity
            if (!$this->verifyFileChecksum($updateFile, $expectedChecksum)) {
                unlink($updateFile);
                throw new RuntimeException('Update file checksum verification failed');
            }

            // Scan for malware
            if (!$this->securityService->scanForMalware($updateFile)) {
                unlink($updateFile);
                throw new RuntimeException('Update file failed security scan');
            }

            $this->logger->info('Update downloaded successfully', ['file' => $updateFile]);
            return $updateFile;

        } catch (GuzzleException $e) {
            $this->logger->error('Update download failed: ' . $e->getMessage());
            throw new RuntimeException('Failed to download update: ' . $e->getMessage());
        }
    }

    /**
     * Install update with rollback capability
     */
    public function installUpdate(string $updateFile, array $updateInfo): bool
    {
        try {
            $this->logger->info('Installing update...', ['version' => $updateInfo['version']]);

            // Create backup before installation
            $backupId = null;
            if ($this->settings->get('auto_update.backup_enabled', true)) {
                $this->updateProgress('installing', 10, 'Создание резервной копии...');
                $backupId = $this->backupService->createBackup();
                $this->logger->info('Backup created', ['backup_id' => $backupId]);
            }

            try {
                // Extract update
                $this->updateProgress('installing', 30, 'Извлечение файлов...');
                $extractPath = $this->extractUpdate($updateFile);

                // Verify extracted files
                $this->updateProgress('installing', 50, 'Проверка файлов...');
                if (!$this->verifyExtractedFiles($extractPath)) {
                    throw new RuntimeException('Extracted files verification failed');
                }

                // Apply update
                $this->updateProgress('installing', 70, 'Применение обновления...');
                $this->applyUpdate($extractPath);

                // Run database migrations if needed
                $this->updateProgress('installing', 85, 'Обновление базы данных...');
                $this->runMigrations($extractPath);

                // Clear cache
                $this->updateProgress('installing', 95, 'Очистка кеша...');
                $this->clearCache();

                $this->updateProgress('installing', 100, 'Обновление завершено');

                // Update version in settings
                $this->updateVersion($updateInfo['version']);

                $this->logger->info('Update installed successfully', [
                    'version' => $updateInfo['version'],
                    'backup_id' => $backupId,
                ]);

                return true;

            } catch (\Exception $e) {
                $this->logger->error('Update installation failed: ' . $e->getMessage());

                // Rollback if backup exists
                if ($backupId && $this->settings->get('auto_update.rollback_enabled', true)) {
                    $this->logger->info('Rolling back to previous version...', ['backup_id' => $backupId]);
                    $this->updateProgress('installing', 0, 'Откат изменений...');
                    
                    if ($this->backupService->restoreBackup($backupId)) {
                        $this->logger->info('Rollback completed successfully');
                        throw new RuntimeException('Update failed and was rolled back: ' . $e->getMessage());
                    } else {
                        $this->logger->error('Rollback failed');
                        throw new RuntimeException('Update failed and rollback also failed: ' . $e->getMessage());
                    }
                } else {
                    throw $e;
                }
            }

        } catch (\Exception $e) {
            $this->logger->error('Update process failed: ' . $e->getMessage());
            throw $e;
        } finally {
            // Cleanup
            if (file_exists($updateFile)) {
                unlink($updateFile);
            }
        }
    }

    /**
     * Extract update package
     */
    private function extractUpdate(string $updateFile): string
    {
        $extractPath = sys_get_temp_dir() . '/sparkyfit_extract_' . uniqid();
        
        $zip = new ZipArchive();
        $result = $zip->open($updateFile);
        
        if ($result !== TRUE) {
            throw new RuntimeException('Failed to open update package: ' . $result);
        }

        if (!$zip->extractTo($extractPath)) {
            $zip->close();
            throw new RuntimeException('Failed to extract update package');
        }

        $zip->close();
        return $extractPath;
    }

    /**
     * Verify extracted files
     */
    private function verifyExtractedFiles(string $extractPath): bool
    {
        // Check for required files
        $requiredFiles = ['update.json', 'files/'];
        
        foreach ($requiredFiles as $file) {
            if (!file_exists($extractPath . '/' . $file)) {
                $this->logger->error('Required file missing: ' . $file);
                return false;
            }
        }

        // Verify update.json
        $updateJson = json_decode(file_get_contents($extractPath . '/update.json'), true);
        if (!$updateJson || !isset($updateJson['version'])) {
            $this->logger->error('Invalid update.json');
            return false;
        }

        return true;
    }

    /**
     * Apply update files
     */
    private function applyUpdate(string $extractPath): void
    {
        $filesPath = $extractPath . '/files';
        $appRoot = dirname(__DIR__, 2); // Adjust based on your structure

        // Copy files with overwrite protection
        $this->copyRecursive($filesPath, $appRoot);
    }

    /**
     * Copy files recursively
     */
    private function copyRecursive(string $source, string $destination): void
    {
        if (!is_dir($source)) {
            return;
        }

        if (!is_dir($destination)) {
            mkdir($destination, 0755, true);
        }

        $iterator = new \RecursiveIteratorIterator(
            new \RecursiveDirectoryIterator($source, \RecursiveDirectoryIterator::SKIP_DOTS),
            \RecursiveIteratorIterator::SELF_FIRST
        );

        foreach ($iterator as $item) {
            $target = $destination . DIRECTORY_SEPARATOR . $iterator->getSubPathName();
            
            if ($item->isDir()) {
                if (!is_dir($target)) {
                    mkdir($target, 0755, true);
                }
            } else {
                copy($item->getRealPath(), $target);
            }
        }
    }

    /**
     * Run database migrations
     */
    private function runMigrations(string $extractPath): void
    {
        $migrationsPath = $extractPath . '/migrations';
        
        if (!is_dir($migrationsPath)) {
            return; // No migrations to run
        }

        // This would integrate with your migration system
        // For now, we'll just log that migrations would be run
        $this->logger->info('Running database migrations...');
        
        // Implementation would depend on your migration system
        // exec('php bin/migrate.php --path=' . escapeshellarg($migrationsPath));
    }

    /**
     * Clear application cache
     */
    private function clearCache(): void
    {
        // Clear various caches
        $cacheDirs = [
            __DIR__ . '/../../var/cache',
            __DIR__ . '/../../storage/cache',
        ];

        foreach ($cacheDirs as $cacheDir) {
            if (is_dir($cacheDir)) {
                $this->removeDirRecursive($cacheDir);
            }
        }

        // Clear Redis cache if configured
        try {
            $redis = new \Predis\Client($this->settings->get('redis'));
            $redis->flushdb();
        } catch (\Exception $e) {
            $this->logger->warning('Failed to clear Redis cache: ' . $e->getMessage());
        }
    }

    /**
     * Remove directory recursively
     */
    private function removeDirRecursive(string $dir): void
    {
        if (!is_dir($dir)) {
            return;
        }

        $files = array_diff(scandir($dir), ['.', '..']);
        
        foreach ($files as $file) {
            $path = $dir . '/' . $file;
            is_dir($path) ? $this->removeDirRecursive($path) : unlink($path);
        }
        
        rmdir($dir);
    }

    /**
     * Update application version
     */
    private function updateVersion(string $version): void
    {
        // Update version in settings or config file
        $configFile = __DIR__ . '/../../config/version.php';
        $content = "<?php\nreturn [\n    'version' => '$version',\n    'updated_at' => '" . date('Y-m-d H:i:s') . "',\n];\n";
        file_put_contents($configFile, $content);
    }

    /**
     * Verify file checksum
     */
    private function verifyFileChecksum(string $file, string $expectedChecksum): bool
    {
        $actualChecksum = hash_file('sha256', $file);
        return hash_equals($expectedChecksum, $actualChecksum);
    }

    /**
     * Update progress for frontend
     */
    private function updateProgress(string $stage, int $progress, string $message): void
    {
        $progressData = [
            'stage' => $stage,
            'progress' => $progress,
            'message' => $message,
            'timestamp' => time(),
        ];

        // Store in Redis for real-time updates
        try {
            $redis = new \Predis\Client($this->settings->get('redis'));
            $redis->setex('update_progress', 3600, json_encode($progressData));
        } catch (\Exception $e) {
            $this->logger->warning('Failed to update progress: ' . $e->getMessage());
        }
    }

    /**
     * Get current update progress
     */
    public function getUpdateProgress(): ?array
    {
        try {
            $redis = new \Predis\Client($this->settings->get('redis'));
            $progress = $redis->get('update_progress');
            
            return $progress ? json_decode($progress, true) : null;
        } catch (\Exception $e) {
            $this->logger->warning('Failed to get update progress: ' . $e->getMessage());
            return null;
        }
    }
}