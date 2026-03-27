// Backup Manager Component - Control and Monitor Backup System
import React, { useState, useEffect } from 'react';
import { backupService } from '../services/backupService';

interface BackupStatus {
  isRunning: boolean;
  schedules: Array<{
    name: string;
    enabled: boolean;
    lastRun?: string;
    interval: number;
  }>;
  storage: Array<{
    name: string;
    enabled: boolean;
    type: string;
    freeSpace: number;
  }>;
}

const BackupManager: React.FC = () => {
  const [status, setStatus] = useState<BackupStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [manualBackupLoading, setManualBackupLoading] = useState<string | null>(null);

  useEffect(() => {
    loadStatus();
    const interval = setInterval(loadStatus, 5000); // Update every 5 seconds
    return () => clearInterval(interval);
  }, []);

  const loadStatus = () => {
    try {
      const backupStatus = backupService.getBackupStatus();
      setStatus(backupStatus);
    } catch (error) {
      // console.error('Failed to load backup status:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleManualBackup = async (type: 'realtime' | 'hourly' | 'daily' | 'weekly' | 'monthly') => {
    setManualBackupLoading(type);
    try {
      await backupService.triggerManualBackup(type);
      loadStatus(); // Refresh status
    } catch (error) {
      // console.error(`Manual ${type} backup failed:`, error);
    } finally {
      setManualBackupLoading(null);
    }
  };

  const formatInterval = (interval: number): string => {
    const hours = interval / (1000 * 60 * 60);
    const days = hours / 24;
    const weeks = days / 7;
    const months = days / 30;

    if (months >= 1) return `Every ${Math.round(months)} month(s)`;
    if (weeks >= 1) return `Every ${Math.round(weeks)} week(s)`;
    if (days >= 1) return `Every ${Math.round(days)} day(s)`;
    if (hours >= 1) return `Every ${Math.round(hours)} hour(s)`;
    return `Every ${interval / 1000} seconds`;
  };

  const formatDate = (dateString?: string): string => {
    if (!dateString) return 'Never';
    return new Date(dateString).toLocaleString();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
        <span className="ml-2">Loading backup status...</span>
      </div>
    );
  }

  if (!status) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
        <p className="text-red-600">Failed to load backup status</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Automated Backup System</h2>
          <p className="text-gray-600">Monitor and control your automated backups</p>
        </div>
        <div className={`px-3 py-1 rounded-full text-sm font-medium ${
          status.isRunning 
            ? 'bg-green-100 text-green-800' 
            : 'bg-red-100 text-red-800'
        }`}>
          {status.isRunning ? '🟢 Running' : '🔴 Stopped'}
        </div>
      </div>

      {/* Manual Backup Controls */}
      <div className="bg-white p-6 rounded-lg border border-gray-200">
        <h3 className="text-lg font-semibold mb-4">Manual Backup</h3>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          {(['realtime', 'hourly', 'daily', 'weekly', 'monthly'] as const).map((type) => (
            <button
              key={type}
              onClick={() => handleManualBackup(type)}
              disabled={manualBackupLoading === type}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {manualBackupLoading === type ? (
                <span className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  {type}...
                </span>
              ) : (
                `Backup ${type}`
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Backup Schedules */}
      <div className="bg-white p-6 rounded-lg border border-gray-200">
        <h3 className="text-lg font-semibold mb-4">Backup Schedules</h3>
        <div className="space-y-3">
          {status.schedules.map((schedule) => (
            <div key={schedule.name} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className={`w-3 h-3 rounded-full ${
                  schedule.enabled ? 'bg-green-500' : 'bg-gray-300'
                }`}></div>
                <div>
                  <div className="font-medium capitalize">{schedule.name}</div>
                  <div className="text-sm text-gray-600">{formatInterval(schedule.interval)}</div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm text-gray-600">Last run:</div>
                <div className="text-sm font-medium">{formatDate(schedule.lastRun)}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Storage Locations */}
      <div className="bg-white p-6 rounded-lg border border-gray-200">
        <h3 className="text-lg font-semibold mb-4">Storage Locations</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {status.storage.map((storage) => (
            <div key={storage.name} className="p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <div className="font-medium capitalize">{storage.name}</div>
                <div className={`w-3 h-3 rounded-full ${
                  storage.enabled ? 'bg-green-500' : 'bg-gray-300'
                }`}></div>
              </div>
              <div className="text-sm text-gray-600">
                <div>Type: {storage.type}</div>
                <div>Free Space: {storage.freeSpace.toLocaleString()} MB</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Backup Statistics */}
      <div className="bg-white p-6 rounded-lg border border-gray-200">
        <h3 className="text-lg font-semibold mb-4">Backup Statistics</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">
              {status.schedules.filter(s => s.enabled).length}
            </div>
            <div className="text-sm text-gray-600">Active Schedules</div>
          </div>
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <div className="text-2xl font-bold text-green-600">
              {status.storage.filter(s => s.enabled).length}
            </div>
            <div className="text-sm text-gray-600">Storage Locations</div>
          </div>
          <div className="text-center p-4 bg-purple-50 rounded-lg">
            <div className="text-2xl font-bold text-purple-600">
              {status.storage.reduce((sum, s) => sum + s.freeSpace, 0).toLocaleString()}
            </div>
            <div className="text-sm text-gray-600">Total Free Space (MB)</div>
          </div>
          <div className="text-center p-4 bg-orange-50 rounded-lg">
            <div className="text-2xl font-bold text-orange-600">
              {status.schedules.filter(s => s.lastRun).length}
            </div>
            <div className="text-sm text-gray-600">Completed Backups</div>
          </div>
        </div>
      </div>

      {/* Backup Folder Structure */}
      <div className="bg-white p-6 rounded-lg border border-gray-200">
        <h3 className="text-lg font-semibold mb-4">Backup Folder Structure</h3>
        <div className="bg-gray-100 p-4 rounded-lg font-mono text-sm">
          <div className="space-y-1">
            <div>📁 backups/</div>
            <div>  📁 2026/</div>
            <div>    📁 03/</div>
            <div>      📁 16/</div>
            <div>        📁 09-30/</div>
            <div>          📄 realtime_backup_2026-03-16-09-30.json</div>
            <div>          📄 hourly_backup_2026-03-16-09-30.json</div>
            <div>          📄 daily_backup_2026-03-16-09-30.json</div>
            <div>        📁 10-30/</div>
            <div>          📄 realtime_backup_2026-03-16-10-30.json</div>
            <div>          📄 hourly_backup_2026-03-16-10-30.json</div>
          </div>
        </div>
        <p className="text-sm text-gray-600 mt-2">
          Backups are organized in dated folders for easy searching and management.
        </p>
      </div>

      {/* Environment Status */}
      <div className="bg-white p-6 rounded-lg border border-gray-200">
        <h3 className="text-lg font-semibold mb-4">Environment Configuration</h3>
        <div className="space-y-2">
          <div className="flex justify-between py-2 border-b">
            <span className="text-gray-600">Google Drive API:</span>
            <span className={`font-medium ${import.meta.env.VITE_GOOGLE_DRIVE_API_KEY ? 'text-green-600' : 'text-red-600'}`}>
              {import.meta.env.VITE_GOOGLE_DRIVE_API_KEY ? '✅ Configured' : '❌ Not configured'}
            </span>
          </div>
          <div className="flex justify-between py-2 border-b">
            <span className="text-gray-600">Dropbox Token:</span>
            <span className={`font-medium ${import.meta.env.VITE_DROPBOX_TOKEN ? 'text-green-600' : 'text-red-600'}`}>
              {import.meta.env.VITE_DROPBOX_TOKEN ? '✅ Configured' : '❌ Not configured'}
            </span>
          </div>
          <div className="flex justify-between py-2 border-b">
            <span className="text-gray-600">GitHub Token:</span>
            <span className={`font-medium ${import.meta.env.VITE_GITHUB_TOKEN ? 'text-green-600' : 'text-red-600'}`}>
              {import.meta.env.VITE_GITHUB_TOKEN ? '✅ Configured' : '❌ Not configured'}
            </span>
          </div>
          <div className="flex justify-between py-2 border-b">
            <span className="text-gray-600">Backup Email:</span>
            <span className={`font-medium ${import.meta.env.VITE_BACKUP_EMAIL ? 'text-green-600' : 'text-red-600'}`}>
              {import.meta.env.VITE_BACKUP_EMAIL ? '✅ Configured' : '❌ Not configured'}
            </span>
          </div>
          <div className="flex justify-between py-2">
            <span className="text-gray-600">Backup Service:</span>
            <span className={`font-medium ${import.meta.env.VITE_BACKUP_ENABLED === 'true' ? 'text-green-600' : 'text-red-600'}`}>
              {import.meta.env.VITE_BACKUP_ENABLED === 'true' ? '✅ Enabled' : '❌ Disabled'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BackupManager;


