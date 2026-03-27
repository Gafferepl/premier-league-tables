// Automated Backup Service - Complete Implementation
import { supabase } from '../config/supabase';

interface BackupConfig {
  sources: BackupSource[];
  schedules: BackupSchedule[];
  storage: BackupStorage[];
  rotation: BackupRotation;
}

interface BackupSource {
  name: string;
  type: 'database' | 'localStorage' | 'indexedDB' | 'files';
  method: () => Promise<any>;
  priority: 'critical' | 'important' | 'optional';
}

interface BackupSchedule {
  name: string;
  interval: number; // milliseconds
  method: () => Promise<void>;
  enabled: boolean;
  lastRun?: Date;
}

interface BackupStorage {
  name: string;
  type: 'googleDrive' | 'dropbox' | 'github' | 'localStorage' | 'email';
  method: (data: any, folder: string) => Promise<void>;
  enabled: boolean;
  freeSpace: number; // MB
}

interface BackupRotation {
  realtime: { keep: number; unit: 'hours' | 'days' | 'weeks' | 'months' };
  hourly: { keep: number; unit: 'hours' | 'days' | 'weeks' | 'months' };
  daily: { keep: number; unit: 'hours' | 'days' | 'weeks' | 'months' };
  weekly: { keep: number; unit: 'hours' | 'days' | 'weeks' | 'months' };
  monthly: { keep: number; unit: 'hours' | 'days' | 'weeks' | 'months' };
}

class AutomatedBackupService {
  private config: BackupConfig;
  private isRunning: boolean = false;
  private backupIntervals: Map<string, NodeJS.Timeout> = new Map();

  constructor() {
    this.config = {
      sources: [
        { name: 'users', type: 'database', method: this.backupUsersTable, priority: 'critical' },
        { name: 'teams', type: 'database', method: this.backupTeamsTable, priority: 'critical' },
        { name: 'predictions', type: 'database', method: this.backupPredictionsTable, priority: 'critical' },
        { name: 'analytics', type: 'database', method: this.backupAnalyticsTable, priority: 'important' },
        { name: 'userPreferences', type: 'localStorage', method: this.backupLocalStorage, priority: 'important' },
        { name: 'appSettings', type: 'localStorage', method: this.backupAppSettings, priority: 'important' },
        { name: 'chatHistory', type: 'indexedDB', method: this.backupChatHistory, priority: 'optional' },
        { name: 'cache', type: 'indexedDB', method: this.backupCache, priority: 'optional' }
      ],
      schedules: [
        { name: 'realtime', interval: 30000, method: this.realtimeBackup, enabled: true }, // 30 seconds
        { name: 'hourly', interval: 60 * 60 * 1000, method: this.hourlyBackup, enabled: true }, // 1 hour
        { name: 'daily', interval: 24 * 60 * 60 * 1000, method: this.dailyBackup, enabled: true }, // 24 hours
        { name: 'weekly', interval: 7 * 24 * 60 * 60 * 1000, method: this.weeklyBackup, enabled: true }, // 7 days
        { name: 'monthly', interval: 30 * 24 * 60 * 60 * 1000, method: this.monthlyBackup, enabled: true } // 30 days
      ],
      storage: [
        { name: 'localStorage', type: 'localStorage', method: this.saveToLocalStorage, enabled: true, freeSpace: 5000 },
        { name: 'googleDrive', type: 'googleDrive', method: this.saveToGoogleDrive, enabled: true, freeSpace: 15000 },
        { name: 'dropbox', type: 'dropbox', method: this.saveToDropbox, enabled: true, freeSpace: 2000 },
        { name: 'github', type: 'github', method: this.saveToGitHub, enabled: true, freeSpace: 1000 },
        { name: 'email', type: 'email', method: this.saveToEmail, enabled: true, freeSpace: 100 }
      ],
      rotation: {
        realtime: { keep: 24, unit: 'hours' },
        hourly: { keep: 48, unit: 'hours' },
        daily: { keep: 30, unit: 'days' },
        weekly: { keep: 12, unit: 'weeks' },
        monthly: { keep: 12, unit: 'months' }
      }
    };
  }

  // Start the backup service
  async start(): Promise<void> {
    if (this.isRunning) {
      // console.log('Backup service is already running');
      return;
    }

    // Check if backup is enabled
    if (import.meta.env.VITE_BACKUP_ENABLED !== 'true') {
      // console.log('⏸️ Backup service is disabled in configuration');
      return;
    }

    // console.log('🚀 Starting Automated Backup Service...');
    
    // Initialize storage services
    await this.initializeStorage();
    
    // Start scheduled backups
    this.config.schedules.forEach(schedule => {
      if (schedule.enabled) {
        const interval = setInterval(async () => {
          try {
            // console.log(`🔄 Running ${schedule.name} backup...`);
            await schedule.method();
            schedule.lastRun = new Date();
            // console.log(`✅ ${schedule.name} backup completed`);
          } catch (error) {
            // console.error(`❌ ${schedule.name} backup failed:`, error);
          }
        }, schedule.interval);
        
        this.backupIntervals.set(schedule.name, interval);
      }
    });

    // Run initial backup
    await this.dailyBackup();
    
    this.isRunning = true;
    // console.log('✅ Automated Backup Service started successfully');
  }

  // Stop the backup service
  stop(): void {
    if (!this.isRunning) return;

    // console.log('🛑 Stopping Automated Backup Service...');
    
    this.backupIntervals.forEach((interval, name) => {
      clearInterval(interval);
      // console.log(`⏹️ Stopped ${name} backup schedule`);
    });
    
    this.backupIntervals.clear();
    this.isRunning = false;
    // console.log('✅ Automated Backup Service stopped');
  }

  // Pause the backup service
  pause(): void {
    // console.log('⏸️ Pausing Automated Backup Service...');
    this.stop();
  }

  // Resume the backup service
  async resume(): Promise<void> {
    // console.log('▶️ Resuming Automated Backup Service...');
    await this.start();
  }

  // Initialize storage services
  private async initializeStorage(): Promise<void> {
    // console.log('🔧 Initializing backup storage services...');
    
    // Initialize Google Drive if API key is available
    if (import.meta.env.VITE_GOOGLE_DRIVE_API_KEY) {
      await this.initializeGoogleDrive();
    }
    
    // Initialize Dropbox if token is available
    if (import.meta.env.VITE_DROPBOX_TOKEN) {
      await this.initializeDropbox();
    }
    
    // console.log('✅ Storage services initialized');
  }

  // Create dated folder structure
  private createDatedFolder(): string {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hour = String(now.getHours()).padStart(2, '0');
    const minute = String(now.getMinutes()).padStart(2, '0');
    
    return `backups/${year}/${month}/${day}/${hour}-${minute}`;
  }

  // Real-time backup (user data)
  private async realtimeBackup(): Promise<void> {
    const folder = this.createDatedFolder();
    const backupData: any = {};
    
    // Backup critical user data only
    const criticalSources = this.config.sources.filter(s => s.priority === 'critical');
    
    for (const source of criticalSources) {
      try {
        const data = await source.method();
        backupData[source.name] = data;
      } catch (error) {
        // console.error(`Failed to backup ${source.name}:`, error);
      }
    }
    
    // Save to localStorage for instant recovery
    await this.saveToLocalStorage(backupData, `${folder}/realtime`);
    
    // Update indexedDB for larger data
    await this.saveToIndexedDB(backupData, `realtime_${Date.now()}`);
  }

  // Hourly backup (incremental)
  private async hourlyBackup(): Promise<void> {
    const folder = this.createDatedFolder();
    const backupData: any = {};
    
    // Backup all data sources
    for (const source of this.config.sources) {
      try {
        const data = await source.method();
        backupData[source.name] = data;
      } catch (error) {
        // console.error(`Failed to backup ${source.name}:`, error);
      }
    }
    
    // Save to multiple storage locations
    const promises = this.config.storage
      .filter(s => s.enabled && s.type !== 'email') // Skip email for hourly
      .map(storage => storage.method(backupData, `${folder}/hourly`));
    
    await Promise.allSettled(promises);
  }

  // Daily backup (full)
  private async dailyBackup(): Promise<void> {
    const folder = this.createDatedFolder();
    const backupData: any = {
      timestamp: new Date().toISOString(),
      version: '1.0.0',
      sources: {}
    };
    
    // Backup all data sources
    for (const source of this.config.sources) {
      try {
        const data = await source.method();
        backupData.sources[source.name] = {
          data,
          timestamp: new Date().toISOString(),
          size: JSON.stringify(data).length,
          type: source.type
        };
      } catch (error) {
        // console.error(`Failed to backup ${source.name}:`, error);
        backupData.sources[source.name] = {
          error: error.message,
          timestamp: new Date().toISOString()
        };
      }
    }
    
    // Save to all enabled storage locations
    const promises = this.config.storage
      .filter(s => s.enabled)
      .map(storage => storage.method(backupData, `${folder}/daily`));
    
    const results = await Promise.allSettled(promises);
    
    // Log results
    results.forEach((result, index) => {
      const storage = this.config.storage[index];
      if (result.status === 'fulfilled') {
        // console.log(`✅ Daily backup saved to ${storage.name}`);
      } else {
        // console.error(`❌ Failed to save daily backup to ${storage.name}:`, result.reason);
      }
    });
    
    // Clean old daily backups
    await this.cleanOldBackups('daily', this.config.rotation.daily);
  }

  // Weekly backup (compressed)
  private async weeklyBackup(): Promise<void> {
    // Skip weekly backup if no cloud storage is configured
    const configuredStorage = this.config.storage.filter(s => s.enabled);
    if (configuredStorage.length === 0 || !configuredStorage.some(s => ['googleDrive', 'dropbox', 'github'].includes(s.type))) {
      // console.log('⏭️ Skipping weekly backup - no cloud storage configured');
      return;
    }

    try {
      const folder = this.createDatedFolder();
      const backupData = await this.createFullBackup();
      
      // Compress backup
      const compressed = await this.compressBackup(backupData);
      
      // Save to cloud storage only
      const cloudStorage = this.config.storage.filter(s => 
        s.enabled && ['googleDrive', 'dropbox', 'github'].includes(s.type)
      );
      
      const promises = cloudStorage.map(storage => 
        storage.method(compressed, `${folder}/weekly`)
      );
      
      await Promise.allSettled(promises);
      
      // Clean old weekly backups
      await this.cleanOldBackups('weekly', this.config.rotation.weekly);
    } catch (error) {
      // console.error('❌ Weekly backup failed:', error);
    }
  }

  // Monthly backup (archive)
  private async monthlyBackup(): Promise<void> {
    // Skip monthly backup if no storage is configured
    const configuredStorage = this.config.storage.filter(s => s.enabled);
    if (configuredStorage.length === 0 || !configuredStorage.some(s => ['googleDrive', 'github'].includes(s.type))) {
      // console.log('⏭️ Skipping monthly backup - no cloud storage configured');
      return;
    }

    try {
      const folder = this.createDatedFolder();
      const backupData = await this.createFullBackup();
      
      // Create archive
      const archive = await this.createArchive(backupData);
      
      // Save to long-term storage
      const longTermStorage = this.config.storage.filter(s => 
        s.enabled && ['googleDrive', 'github'].includes(s.type)
      );
      
      const promises = longTermStorage.map(storage => 
        storage.method(archive, `${folder}/monthly`)
      );
      
      await Promise.allSettled(promises);
      
      // Clean old monthly backups
      await this.cleanOldBackups('monthly', this.config.rotation.monthly);
    } catch (error) {
      // console.error('❌ Monthly backup failed:', error);
    }
  }

  // Backup methods for different data sources
  private async backupUsersTable(): Promise<any> {
    const { data, error } = await supabase.from('users').select('*');
    if (error) throw error;
    return data;
  }

  private async backupTeamsTable(): Promise<any> {
    const { data, error } = await supabase.from('teams').select('*');
    if (error) throw error;
    return data;
  }

  private async backupPredictionsTable(): Promise<any> {
    const { data, error } = await supabase.from('predictions').select('*');
    if (error) throw error;
    return data;
  }

  private async backupAnalyticsTable(): Promise<any> {
    const { data, error } = await supabase.from('analytics').select('*');
    if (error) throw error;
    return data;
  }

  private async backupLocalStorage(): Promise<any> {
    const backup: any = {};
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key) {
        backup[key] = localStorage.getItem(key);
      }
    }
    return backup;
  }

  private async backupAppSettings(): Promise<any> {
    const settings = {
      theme: localStorage.getItem('theme'),
      language: localStorage.getItem('language'),
      notifications: localStorage.getItem('notifications'),
      preferences: localStorage.getItem('userPreferences')
    };
    return settings;
  }

  private async backupChatHistory(): Promise<any> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open('ChatHistoryDB', 1);
      
      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        const db = request.result;
        const transaction = db.transaction(['chats'], 'readonly');
        const store = transaction.objectStore('chats');
        const getAllRequest = store.getAll();
        
        getAllRequest.onsuccess = () => resolve(getAllRequest.result);
        getAllRequest.onerror = () => reject(getAllRequest.error);
      };
    });
  }

  private async backupCache(): Promise<any> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open('CacheDB', 1);
      
      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        const db = request.result;
        const transaction = db.transaction(['cache'], 'readonly');
        const store = transaction.objectStore('cache');
        const getAllRequest = store.getAll();
        
        getAllRequest.onsuccess = () => resolve(getAllRequest.result);
        getAllRequest.onerror = () => reject(getAllRequest.error);
      };
    });
  }

  // Storage methods
  private async saveToLocalStorage(data: any, folder: string): Promise<void> {
    try {
      const key = `backup_${folder.replace(/\//g, '_')}`;
      localStorage.setItem(key, JSON.stringify(data));
      // console.log(`✅ Backup saved to localStorage: ${key}`);
    } catch (error) {
      // console.error('Failed to save to localStorage:', error);
    }
  }

  private async saveToGoogleDrive(data: any, folder: string): Promise<void> {
    try {
      if (!import.meta.env.VITE_GOOGLE_DRIVE_API_KEY) {
        // console.log('Google Drive API key not configured');
        return;
      }
      
      const filename = `${folder.replace(/\//g, '_')}.json`;
      const content = JSON.stringify(data, null, 2);
      
      // Create file metadata
      const metadata = {
        name: filename,
        parents: [import.meta.env.VITE_GOOGLE_DRIVE_FOLDER_ID || 'root']
      };
      
      // Upload to Google Drive
      const response = await fetch('https://www.googleapis.com/upload/drive/v3/files?uploadType=media', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${import.meta.env.VITE_GOOGLE_DRIVE_API_KEY}`,
          'Content-Type': 'application/json'
        },
        body: content
      });
      
      if (response.ok) {
        // console.log(`✅ Backup saved to Google Drive: ${filename}`);
      } else {
        throw new Error(`Google Drive upload failed: ${response.statusText}`);
      }
    } catch (error) {
      // console.error('Failed to save to Google Drive:', error);
    }
  }

  private async saveToDropbox(data: any, folder: string): Promise<void> {
    try {
      if (!import.meta.env.VITE_DROPBOX_TOKEN) {
        // console.log('Dropbox token not configured');
        return;
      }
      
      const filename = `${folder.replace(/\//g, '_')}.json`;
      const content = JSON.stringify(data, null, 2);
      
      const response = await fetch('https://content.dropboxapi.com/2/files/upload', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${import.meta.env.VITE_DROPBOX_TOKEN}`,
          'Content-Type': 'application/octet-stream',
          'Dropbox-API-Arg': JSON.stringify({
            path: `/PremierLeagueHub/${filename}`,
            mode: 'overwrite'
          })
        },
        body: content
      });
      
      if (response.ok) {
        // console.log(`✅ Backup saved to Dropbox: ${filename}`);
      } else {
        throw new Error(`Dropbox upload failed: ${response.statusText}`);
      }
    } catch (error) {
      // console.error('Failed to save to Dropbox:', error);
    }
  }

  private async saveToGitHub(data: any, folder: string): Promise<void> {
    try {
      if (!import.meta.env.VITE_GITHUB_TOKEN) {
        // console.log('GitHub token not configured');
        return;
      }
      
      const filename = `${folder.replace(/\//g, '_')}.json`;
      const content = btoa(JSON.stringify(data, null, 2));
      
      const response = await fetch(`https://api.github.com/repos/${import.meta.env.VITE_GITHUB_USERNAME}/${import.meta.env.VITHUB_REPO}/contents/backups/${filename}`, {
        method: 'PUT',
        headers: {
          'Authorization': `token ${import.meta.env.VITE_GITHUB_TOKEN}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          message: `Automated backup: ${new Date().toISOString()}`,
          content: content
        })
      });
      
      if (response.ok) {
        // console.log(`✅ Backup saved to GitHub: ${filename}`);
      } else {
        throw new Error(`GitHub upload failed: ${response.statusText}`);
      }
    } catch (error) {
      // console.error('Failed to save to GitHub:', error);
    }
  }

  private async saveToEmail(data: any, folder: string): Promise<void> {
    try {
      if (!import.meta.env.VITE_BACKUP_EMAIL) {
        // console.log('Backup email not configured');
        return;
      }
      
      const content = JSON.stringify(data, null, 2);
      const size = new Blob([content]).size;
      
      // Only email if size is reasonable (< 25MB)
      if (size > 25 * 1024 * 1024) {
        // console.log('Backup too large for email, skipping...');
        return;
      }
      
      const response = await fetch('/api/send-backup-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          to: import.meta.env.VITE_BACKUP_EMAIL,
          subject: `Premier League Tables Backup: ${folder}`,
          body: `Automated backup created at ${new Date().toISOString()}\n\nSize: ${Math.round(size / 1024)} KB\n\nBackup data attached.`,
          attachment: {
            filename: `${folder.replace(/\//g, '_')}.json`,
            content: content
          }
        })
      });
      
      if (response.ok) {
        // console.log(`✅ Backup sent via email: ${folder}`);
      } else {
        throw new Error(`Email backup failed: ${response.statusText}`);
      }
    } catch (error) {
      // console.error('Failed to send backup email:', error);
    }
  }

  // Utility methods
  private async createFullBackup(): Promise<any> {
    const backup: any = {
      timestamp: new Date().toISOString(),
      version: '1.0.0',
      metadata: {
        totalSize: 0,
        sourceCount: this.config.sources.length,
        environment: import.meta.env.MODE
      },
      sources: {}
    };
    
    for (const source of this.config.sources) {
      try {
        const data = await source.method();
        const dataSize = JSON.stringify(data).length;
        
        backup.sources[source.name] = {
          data,
          metadata: {
            size: dataSize,
            type: source.type,
            priority: source.priority,
            timestamp: new Date().toISOString()
          }
        };
        
        backup.metadata.totalSize += dataSize;
      } catch (error) {
        backup.sources[source.name] = {
          error: error.message,
          timestamp: new Date().toISOString()
        };
      }
    }
    
    return backup;
  }

  private async compressBackup(data: any): Promise<any> {
    // Simple compression - remove unnecessary spaces and newlines
    const jsonString = JSON.stringify(data);
    const compressed = jsonString.replace(/\s+/g, ' ').trim();
    
    return {
      compressed: true,
      originalSize: jsonString.length,
      compressedSize: compressed.length,
      compressionRatio: ((jsonString.length - compressed.length) / jsonString.length * 100).toFixed(2) + '%',
      data: compressed
    };
  }

  private async createArchive(data: any): Promise<any> {
    return {
      archived: true,
      archiveDate: new Date().toISOString(),
      archiveType: 'monthly',
      data: data
    };
  }

  private async saveToIndexedDB(data: any, key: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open('BackupDB', 1);
      
      request.onerror = () => reject(request.error);
      
      request.onupgradeneeded = () => {
        const db = request.result;
        if (!db.objectStoreNames.contains('backups')) {
          db.createObjectStore('backups');
        }
      };
      
      request.onsuccess = () => {
        const db = request.result;
        const transaction = db.transaction(['backups'], 'readwrite');
        const store = transaction.objectStore('backups');
        const putRequest = store.put(JSON.stringify(data), key);
        
        putRequest.onsuccess = () => resolve();
        putRequest.onerror = () => reject(putRequest.error);
      };
    });
  }

  private async cleanOldBackups(type: string, rotation: any): Promise<void> {
    // console.log(`🧹 Cleaning old ${type} backups...`);
    
    // Calculate cutoff date
    const now = new Date();
    const cutoffDate = new Date();
    
    switch (rotation.unit) {
      case 'hours':
        cutoffDate.setHours(cutoffDate.getHours() - rotation.keep);
        break;
      case 'days':
        cutoffDate.setDate(cutoffDate.getDate() - rotation.keep);
        break;
      case 'weeks':
        cutoffDate.setDate(cutoffDate.getDate() - (rotation.keep * 7));
        break;
      case 'months':
        cutoffDate.setMonth(cutoffDate.getMonth() - rotation.keep);
        break;
    }
    
    // Clean localStorage
    await this.cleanLocalStorageBackups(cutoffDate, type);
    
    // Clean cloud storage (if implemented)
    await this.cleanCloudStorageBackups(cutoffDate, type);
    
    // console.log(`✅ Cleaned ${type} backups older than ${cutoffDate.toISOString()}`);
  }

  private async cleanLocalStorageBackups(cutoffDate: Date, type: string): Promise<void> {
    const keysToRemove: string[] = [];
    
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith(`backup_${type}_`)) {
        // Extract timestamp from key
        const timestampMatch = key.match(/(\d{4}-\d{2}-\d{2}-\d{2}-\d{2})/);
        if (timestampMatch) {
          const backupDate = new Date(timestampMatch[1].replace(/-/g, ':'));
          if (backupDate < cutoffDate) {
            keysToRemove.push(key);
          }
        }
      }
    }
    
    keysToRemove.forEach(key => localStorage.removeItem(key));
    // console.log(`🗑️ Removed ${keysToRemove.length} old ${type} backups from localStorage`);
  }

  private async cleanCloudStorageBackups(cutoffDate: Date, type: string): Promise<void> {
    // This would require API calls to clean cloud storage
    // Implementation depends on the specific cloud storage APIs
    // console.log(`📋 Cloud storage cleanup for ${type} backups (manual implementation needed)`);
  }

  // Initialize Google Drive
  private async initializeGoogleDrive(): Promise<void> {
    // Load Google Drive API
    const script = document.createElement('script');
    script.src = 'https://apis.google.com/js/api.js';
    script.onload = () => {
      (window as any).gapi.load('client', async () => {
        await (window as any).gapi.client.init({
          apiKey: import.meta.env.VITE_GOOGLE_DRIVE_API_KEY,
          discoveryDocs: ['https://www.googleapis.com/discovery/v1/apis/drive/v3/rest'],
        });
      });
    };
    document.head.appendChild(script);
  }

  // Initialize Dropbox
  private async initializeDropbox(): Promise<void> {
    // Dropbox doesn't require initialization for simple uploads
    // console.log('Dropbox initialized with token');
  }

  // Get backup status
  getBackupStatus(): any {
    return {
      isRunning: this.isRunning,
      schedules: this.config.schedules.map(s => ({
        name: s.name,
        enabled: s.enabled,
        lastRun: s.lastRun,
        interval: s.interval
      })),
      storage: this.config.storage.map(s => ({
        name: s.name,
        enabled: s.enabled,
        type: s.type,
        freeSpace: s.freeSpace
      }))
    };
  }

  // Manual backup trigger
  async triggerManualBackup(type: 'realtime' | 'hourly' | 'daily' | 'weekly' | 'monthly' = 'daily'): Promise<void> {
    // console.log(`🔄 Triggering manual ${type} backup...`);
    
    const schedule = this.config.schedules.find(s => s.name === type);
    if (schedule) {
      await schedule.method();
      // console.log(`✅ Manual ${type} backup completed`);
    } else {
      throw new Error(`Unknown backup type: ${type}`);
    }
  }
}

// Export singleton instance
export const backupService = new AutomatedBackupService();

// Auto-start backup service
if (typeof window !== 'undefined') {
  // Start backup service after page loads
  window.addEventListener('load', () => {
    setTimeout(() => {
      backupService.start().catch(console.error);
    }, 5000); // Wait 5 seconds for app to initialize
  });
  
  // Stop backup service before page unloads
  window.addEventListener('beforeunload', () => {
    backupService.stop();
  });
}

export default backupService;


