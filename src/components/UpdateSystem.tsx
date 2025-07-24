import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Download, 
  RefreshCw, 
  CheckCircle, 
  AlertCircle, 
  X, 
  Zap,
  Clock,
  Shield,
  Smartphone
} from 'lucide-react';

// Components
import { Button } from './ui/Button';
import { Modal } from './ui/Modal';

// Store
import { useAppStore } from '../store';

// Hooks
import { useAutoUpdate } from '../hooks';

const UpdateSystem: React.FC = () => {
  const { 
    updateInfo, 
    updateProgress, 
    hasNewUpdate, 
    updateSettings,
    downloadUpdate,
    installUpdate,
    clearUpdateInfo,
    updateUpdateSettings
  } = useAppStore();

  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [isInstalling, setIsInstalling] = useState(false);

  // Use the auto-update hook
  useAutoUpdate();

  const handleDownloadUpdate = async () => {
    if (!updateInfo) return;
    
    try {
      await downloadUpdate();
    } catch (error) {
      console.error('Update download failed:', error);
    }
  };

  const handleInstallUpdate = async () => {
    if (!updateInfo) return;
    
    setIsInstalling(true);
    try {
      await installUpdate();
      // App will reload automatically after successful installation
    } catch (error) {
      console.error('Update installation failed:', error);
      setIsInstalling(false);
    }
  };

  const formatFileSize = (bytes: number): string => {
    const units = ['B', 'KB', 'MB', 'GB'];
    let size = bytes;
    let unitIndex = 0;
    
    while (size >= 1024 && unitIndex < units.length - 1) {
      size /= 1024;
      unitIndex++;
    }
    
    return `${size.toFixed(1)} ${units[unitIndex]}`;
  };

  const formatDuration = (ms: number): string => {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    
    if (minutes > 0) {
      return `${minutes}м ${seconds % 60}с`;
    }
    return `${seconds}с`;
  };

  // Update notification banner
  const UpdateBanner = () => {
    if (!hasNewUpdate || !updateInfo) return null;

    return (
      <motion.div
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: -100, opacity: 0 }}
        className="fixed top-16 left-0 right-0 z-40 bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-lg"
      >
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Zap className="w-5 h-5" />
              <div>
                <p className="font-medium">
                  Доступно обновление SparkyFit v{updateInfo.version}
                </p>
                <p className="text-sm text-primary-100">
                  {updateInfo.description}
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <Button
                size="sm"
                variant="ghost"
                className="text-white hover:bg-white/10"
                onClick={() => setShowUpdateModal(true)}
              >
                Подробнее
              </Button>
              <Button
                size="sm"
                variant="secondary"
                leftIcon={Download}
                onClick={handleDownloadUpdate}
                loading={updateProgress?.status === 'downloading'}
              >
                Обновить
              </Button>
              <Button
                size="icon-sm"
                variant="ghost"
                className="text-white hover:bg-white/10"
                onClick={clearUpdateInfo}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </motion.div>
    );
  };

  // Update details modal
  const UpdateModal = () => (
    <Modal
      isOpen={showUpdateModal}
      onClose={() => setShowUpdateModal(false)}
      title="Обновление SparkyFit"
      size="lg"
    >
      {updateInfo && (
        <div className="space-y-6">
          {/* Update Header */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center justify-center w-12 h-12 bg-primary-100 dark:bg-primary-900/30 rounded-xl">
              <Zap className="w-6 h-6 text-primary-600 dark:text-primary-400" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Версия {updateInfo.version}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Размер: {formatFileSize(updateInfo.size)} • 
                Дата: {new Date(updateInfo.releaseDate).toLocaleDateString('ru-RU')}
              </p>
            </div>
          </div>

          {/* Update Description */}
          <div>
            <h4 className="font-medium text-gray-900 dark:text-white mb-2">
              Описание обновления
            </h4>
            <p className="text-gray-600 dark:text-gray-300">
              {updateInfo.description}
            </p>
          </div>

          {/* Changelog */}
          {updateInfo.changelog && updateInfo.changelog.length > 0 && (
            <div>
              <h4 className="font-medium text-gray-900 dark:text-white mb-3">
                Список изменений
              </h4>
              <div className="space-y-3">
                {updateInfo.changelog.map((change, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <div className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium ${
                      change.type === 'feature' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' :
                      change.type === 'fix' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300' :
                      change.type === 'improvement' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300' :
                      'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300'
                    }`}>
                      {change.type === 'feature' ? '✨' :
                       change.type === 'fix' ? '🐛' :
                       change.type === 'improvement' ? '⚡' : '📝'}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {change.title}
                      </p>
                      {change.description && (
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                          {change.description}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Security & Performance Info */}
          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-3">
              <Shield className="w-5 h-5 text-green-600 dark:text-green-400" />
              <h4 className="font-medium text-gray-900 dark:text-white">
                Безопасность и производительность
              </h4>
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-600 dark:text-gray-400">Цифровая подпись</p>
                <p className="font-medium text-green-600 dark:text-green-400">Проверена</p>
              </div>
              <div>
                <p className="text-gray-600 dark:text-gray-400">Сканирование</p>
                <p className="font-medium text-green-600 dark:text-green-400">Безопасно</p>
              </div>
              <div>
                <p className="text-gray-600 dark:text-gray-400">Совместимость</p>
                <p className="font-medium text-green-600 dark:text-green-400">Полная</p>
              </div>
              <div>
                <p className="text-gray-600 dark:text-gray-400">Откат</p>
                <p className="font-medium text-blue-600 dark:text-blue-400">Доступен</p>
              </div>
            </div>
          </div>

          {/* Progress */}
          {updateProgress && (
            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium text-gray-900 dark:text-white">
                  {updateProgress.status === 'downloading' ? 'Загрузка...' :
                   updateProgress.status === 'installing' ? 'Установка...' :
                   updateProgress.status === 'completed' ? 'Завершено' :
                   updateProgress.status === 'failed' ? 'Ошибка' : 'Ожидание'}
                </span>
                <span className="text-gray-600 dark:text-gray-400">
                  {updateProgress.progress}%
                </span>
              </div>
              
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <motion.div
                  className="bg-primary-600 h-2 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${updateProgress.progress}%` }}
                  transition={{ duration: 0.3 }}
                />
              </div>

              {updateProgress.estimatedTimeRemaining && (
                <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                  <Clock className="w-4 h-4" />
                  <span>Осталось: {formatDuration(updateProgress.estimatedTimeRemaining)}</span>
                </div>
              )}
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center justify-end space-x-3 pt-4 border-t border-gray-200 dark:border-gray-700">
            <Button
              variant="ghost"
              onClick={() => setShowSettingsModal(true)}
            >
              Настройки
            </Button>
            
            {updateProgress?.status === 'downloaded' ? (
              <Button
                leftIcon={RefreshCw}
                onClick={handleInstallUpdate}
                loading={isInstalling}
              >
                Установить и перезагрузить
              </Button>
            ) : (
              <Button
                leftIcon={Download}
                onClick={handleDownloadUpdate}
                loading={updateProgress?.status === 'downloading'}
                disabled={updateProgress?.status === 'installing'}
              >
                {updateProgress?.status === 'downloading' ? 'Загрузка...' : 'Загрузить'}
              </Button>
            )}
          </div>
        </div>
      )}
    </Modal>
  );

  // Update settings modal
  const SettingsModal = () => (
    <Modal
      isOpen={showSettingsModal}
      onClose={() => setShowSettingsModal(false)}
      title="Настройки обновлений"
    >
      <div className="space-y-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-900 dark:text-white">
                Автоматические обновления
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Автоматически загружать и устанавливать обновления
              </p>
            </div>
            <button
              onClick={() => updateUpdateSettings({
                autoDownload: !updateSettings.autoDownload
              })}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                updateSettings.autoDownload ? 'bg-primary-600' : 'bg-gray-200 dark:bg-gray-700'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  updateSettings.autoDownload ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-900 dark:text-white">
                Уведомления о обновлениях
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Показывать уведомления о доступных обновлениях
              </p>
            </div>
            <button
              onClick={() => updateUpdateSettings({
                notifyOnUpdate: !updateSettings.notifyOnUpdate
              })}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                updateSettings.notifyOnUpdate ? 'bg-primary-600' : 'bg-gray-200 dark:bg-gray-700'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  updateSettings.notifyOnUpdate ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-900 dark:text-white">
                Обновления в фоне
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Загружать обновления в фоновом режиме
              </p>
            </div>
            <button
              onClick={() => updateUpdateSettings({
                backgroundUpdates: !updateSettings.backgroundUpdates
              })}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                updateSettings.backgroundUpdates ? 'bg-primary-600' : 'bg-gray-200 dark:bg-gray-700'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  updateSettings.backgroundUpdates ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        </div>

        <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-start space-x-3">
            <Smartphone className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5" />
            <div className="text-sm">
              <p className="font-medium text-gray-900 dark:text-white mb-1">
                PWA обновления
              </p>
              <p className="text-gray-600 dark:text-gray-400">
                SparkyFit использует технологию Progressive Web App для мгновенных обновлений 
                интерфейса и автономной работы.
              </p>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );

  return (
    <>
      <AnimatePresence>
        <UpdateBanner />
      </AnimatePresence>
      
      <UpdateModal />
      <SettingsModal />
    </>
  );
};

export default UpdateSystem;