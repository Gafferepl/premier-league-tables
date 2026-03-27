// Backup Status Indicator Component
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

const BackupStatus: React.FC = () => {
  // Hide in production environment
  if (import.meta.env.PROD) {
    return null;
  }

  const [status, setStatus] = useState<BackupStatus | null>(null);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    const loadStatus = () => {
      try {
        const backupStatus = backupService.getBackupStatus();
        setStatus(backupStatus);
      } catch (error) {
        // console.error('Failed to load backup status:', error);
      }
    };

    loadStatus();
    const interval = setInterval(loadStatus, 10000); // Update every 10 seconds
    return () => clearInterval(interval);
  }, []);

  if (!status) {
    return null;
  }

  const lastBackup = status.schedules
    .filter(s => s.lastRun)
    .sort((a, b) => new Date(b.lastRun!).getTime() - new Date(a.lastRun!).getTime())[0];

  const formatDate = (dateString?: string): string => {
    if (!dateString) return 'Never';
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} min ago`;
    if (diffMins < 1440) return `${Math.floor(diffMins / 60)} hours ago`;
    return `${Math.floor(diffMins / 1440)} days ago`;
  };

  return (
    <div className="fixed bottom-4 left-4 z-50">
      <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-3">
        <div className="flex items-center space-x-2">
          <div className={`w-2 h-2 rounded-full ${
            status.isRunning ? 'bg-green-500 animate-pulse' : 'bg-red-500'
          }`}></div>
          <div className="text-sm font-medium">
            {status.isRunning ? '🔄 Backups Active' : '❌ Backups Stopped'}
          </div>
          <button
            onClick={() => setShowDetails(!showDetails)}
            className="text-xs text-gray-500 hover:text-gray-700"
          >
            {showDetails ? 'Hide' : 'Details'}
          </button>
        </div>
        
        {showDetails && (
          <div className="mt-3 pt-3 border-t border-gray-200 text-xs space-y-1">
            <div className="flex justify-between">
              <span className="text-gray-600">Last backup:</span>
              <span className="font-medium">{formatDate(lastBackup?.lastRun)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Active schedules:</span>
              <span className="font-medium">
                {status.schedules.filter(s => s.enabled).length}/{status.schedules.length}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Storage locations:</span>
              <span className="font-medium">
                {status.storage?.filter(s => s.enabled).length || 0} active
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BackupStatus;


