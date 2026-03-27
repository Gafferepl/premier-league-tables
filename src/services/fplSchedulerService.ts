// Ultra-Conservative FPL API Scheduler
// Handles automated data updates with maximum safety

interface ScheduleConfig {
  time: string;
  varianceMinutes: number;
  purpose: string;
  endpoints: string[];
  frequency: 'daily' | 'hourly' | 'live';
}

interface ScheduledTask {
  id: string;
  config: ScheduleConfig;
  nextRun: number;
  lastRun?: number;
  isActive: boolean;
}

class FPLSchedulerService {
  private tasks = new Map<string, ScheduledTask>();
  private intervals = new Map<string, NodeJS.Timeout>();
  private isRunning = false;

  constructor() {
    this.initializeDefaultSchedule();
  }

  // Initialize conservative schedule
  private initializeDefaultSchedule(): void {
    // Daily updates with randomization
    const dailyTasks: ScheduleConfig[] = [
      {
        time: '04:30',
        varianceMinutes: 15,
        purpose: 'Morning bootstrap refresh',
        endpoints: ['bootstrap-static'],
        frequency: 'daily'
      },
      {
        time: '13:15',
        varianceMinutes: 20,
        purpose: 'Afternoon pre-match refresh',
        endpoints: ['bootstrap-static', 'fixtures'],
        frequency: 'daily'
      },
      {
        time: '23:45',
        varianceMinutes: 15,
        purpose: 'Evening end-of-day sync',
        endpoints: ['bootstrap-static'],
        frequency: 'daily'
      }
    ];

    dailyTasks.forEach((config, index) => {
      this.addTask(`daily_${index}`, config);
    });

    // Live match monitoring
    this.addTask('live_monitoring', {
      time: '00:00', // Will run based on match time logic
      varianceMinutes: 0,
      purpose: 'Live match data monitoring',
      endpoints: ['live'],
      frequency: 'live'
    });
  }

  // Add scheduled task
  addTask(id: string, config: ScheduleConfig): void {
    const nextRun = this.calculateNextRun(config);
    const task: ScheduledTask = {
      id,
      config,
      nextRun,
      isActive: true
    };

    this.tasks.set(id, task);
    // console.log(`Scheduled task added: ${id} - Next run: ${new Date(nextRun).toISOString()}`);
  }

  // Calculate next run time with randomization
  private calculateNextRun(config: ScheduleConfig): number {
    const now = new Date();
    const [hours, minutes] = config.time.split(':').map(Number);
    
    let nextRun = new Date(now);
    nextRun.setUTCHours(hours, minutes, 0, 0);

    // Add random variance
    if (config.varianceMinutes > 0) {
      const variance = Math.floor(Math.random() * config.varianceMinutes * 2) - config.varianceMinutes;
      nextRun.setUTCMinutes(nextRun.getUTCMinutes() + variance);
    }

    // If time has passed today, schedule for tomorrow
    if (nextRun.getTime() <= now.getTime()) {
      nextRun.setUTCDate(nextRun.getUTCDate() + 1);
    }

    return nextRun.getTime();
  }

  // Start the scheduler
  start(): void {
    if (this.isRunning) {
      // console.log('Scheduler already running');
      return;
    }

    this.isRunning = true;
    // console.log('FPL Scheduler started');

    // Main scheduler loop
    const schedulerInterval = setInterval(() => {
      this.checkAndRunTasks();
    }, 60000); // Check every minute

    this.intervals.set('main', schedulerInterval);

    // Live match monitoring (separate interval)
    const liveInterval = setInterval(() => {
      this.checkLiveMonitoring();
    }, 300000); // Check every 5 minutes

    this.intervals.set('live', liveInterval);
  }

  // Stop the scheduler
  stop(): void {
    this.isRunning = false;
    
    this.intervals.forEach((interval) => {
      clearInterval(interval);
    });
    this.intervals.clear();

    // console.log('FPL Scheduler stopped');
  }

  // Check and run scheduled tasks
  private async checkAndRunTasks(): Promise<void> {
    const now = Date.now();

    for (const [taskId, task] of this.tasks) {
      if (!task.isActive || task.config.frequency === 'live') continue;

      if (now >= task.nextRun) {
        await this.runTask(taskId, task);
      }
    }
  }

  // Check live match monitoring
  private async checkLiveMonitoring(): Promise<void> {
    const liveTask = this.tasks.get('live_monitoring');
    if (!liveTask || !liveTask.isActive) return;

    const isMatchTime = this.isMatchTime();
    if (isMatchTime) {
      await this.runTask('live_monitoring', liveTask);
    }
  }

  // Run a specific task
  private async runTask(taskId: string, task: ScheduledTask): Promise<void> {
    // console.log(`Running task: ${taskId} - ${task.config.purpose}`);

    try {
      // Import dynamically to avoid circular dependencies
      const { fplApiService } = await import('./fplApiService');
      const { fplCacheService } = await import('./fplCacheService');

      // Check if API is blocked
      if (fplApiService.isBlocked()) {
        // console.warn(`Task ${taskId} skipped - API blocked until ${new Date(fplApiService.getTimeUntilUnblocked()).toISOString()}`);
        return;
      }

      // Execute endpoints
      for (const endpoint of task.config.endpoints) {
        await this.executeEndpoint(endpoint, fplApiService, fplCacheService);
      }

      // Update task status
      task.lastRun = Date.now();
      
      // Calculate next run time
      if (task.config.frequency === 'daily') {
        task.nextRun = this.calculateNextRun(task.config);
      } else if (task.config.frequency === 'hourly') {
        task.nextRun = Date.now() + (60 * 60 * 1000); // 1 hour from now
      }

      // console.log(`Task ${taskId} completed successfully`);

    } catch (error) {
      // console.error(`Task ${taskId} failed:`, error);
      
      // Implement exponential backoff for failed tasks
      const backoffTime = Math.min(3600000, Math.pow(2, 3) * 60000); // Max 1 hour
      task.nextRun = Date.now() + backoffTime;
    }
  }

  // Execute specific endpoint
  private async executeEndpoint(endpoint: string, apiService: any, cacheService: any): Promise<void> {
    switch (endpoint) {
      case 'bootstrap-static':
        const bootstrapData = await apiService.getBootstrapData();
        await cacheService.set('bootstrap', bootstrapData);
        // console.log('Bootstrap data cached successfully');
        break;

      case 'fixtures':
        const fixturesData = await apiService.getFixtures();
        await cacheService.set('fixtures', fixturesData);
        // console.log('Fixtures data cached successfully');
        break;

      case 'live':
        // Handle live data updates
        await this.updateLiveData(apiService, cacheService);
        break;

      default:
        // console.warn(`Unknown endpoint: ${endpoint}`);
    }
  }

  // Update live data during matches
  private async updateLiveData(apiService: any, cacheService: any): Promise<void> {
    try {
      // Get current game week
      const bootstrapData = await cacheService.get('bootstrap');
      if (!bootstrapData) return;

      const currentEvent = bootstrapData.events.find((event: any) => event.is_current);
      if (!currentEvent) return;

      // Get live game week data
      const liveData = await apiService.getGameWeekData(currentEvent.id);
      await cacheService.set('live_data', liveData);
      
      // console.log(`Live data updated for GW${currentEvent.id}`);
    } catch (error) {
      // console.error('Failed to update live data:', error);
    }
  }

  // Check if it's currently match time
  private isMatchTime(): boolean {
    const now = new Date();
    const dayOfWeek = now.getDay();
    const hour = now.getUTCHours();
    
    // Weekend match times
    const isWeekendMatchDay = [0, 6].includes(dayOfWeek);
    const isWeekendMatchHour = (hour >= 14 && hour <= 17) || (hour >= 19 && hour <= 22);
    
    // Midweek match times
    const isMidweekMatchDay = dayOfWeek === 3; // Wednesday
    const isMidweekMatchHour = hour >= 19 && hour <= 22;
    
    return (isWeekendMatchDay && isWeekendMatchHour) || (isMidweekMatchDay && isMidweekMatchHour);
  }

  // Get scheduler status
  getStatus() {
    const now = Date.now();
    const tasks = Array.from(this.tasks.values()).map(task => ({
      id: task.id,
      purpose: task.config.purpose,
      nextRun: task.nextRun,
      nextRunFormatted: new Date(task.nextRun).toISOString(),
      lastRun: task.lastRun ? new Date(task.lastRun).toISOString() : null,
      isActive: task.isActive,
      timeUntilNextRun: task.nextRun - now
    }));

    return {
      isRunning: this.isRunning,
      tasks,
      totalTasks: tasks.length,
      activeTasks: tasks.filter(task => task.isActive).length
    };
  }

  // Manually trigger a task
  async triggerTask(taskId: string): Promise<void> {
    const task = this.tasks.get(taskId);
    if (!task) {
      throw new Error(`Task not found: ${taskId}`);
    }

    await this.runTask(taskId, task);
  }

  // Enable/disable task
  toggleTask(taskId: string, isActive: boolean): void {
    const task = this.tasks.get(taskId);
    if (task) {
      task.isActive = isActive;
      // console.log(`Task ${taskId} ${isActive ? 'enabled' : 'disabled'}`);
    }
  }

  // Get next scheduled runs
  getNextRuns(hours: number = 24): Array<{taskId: string; purpose: string; nextRun: string}> {
    const now = Date.now();
    const cutoff = now + (hours * 60 * 60 * 1000);
    
    return Array.from(this.tasks.values())
      .filter(task => task.isActive && task.nextRun <= cutoff)
      .map(task => ({
        taskId: task.id,
        purpose: task.config.purpose,
        nextRun: new Date(task.nextRun).toISOString()
      }))
      .sort((a, b) => new Date(a.nextRun).getTime() - new Date(b.nextRun).getTime());
  }
}

export const fplSchedulerService = new FPLSchedulerService();


