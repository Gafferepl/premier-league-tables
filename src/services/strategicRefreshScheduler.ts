// Strategic Refresh Scheduler - Enterprise-Grade API Safety
// Spreads 100,000+ user refreshes across the week to prevent API bans

import { userTeamCacheService } from './userTeamCacheService';
import { fplApiService } from './fplApiService';

interface RefreshConfig {
  maxCallsPerMinute: number;
  maxCallsPerHour: number;
  maxCallsPerDay: number;
  delayBetweenCalls: number; // milliseconds
  batchSize: number;
  retryAttempts: number;
  retryDelay: number;
}

interface RefreshStats {
  totalUsers: number;
  refreshedToday: number;
  failedToday: number;
  remainingToday: number;
  estimatedCompletionTime: Date;
  currentBatchProgress: number;
}

class StrategicRefreshScheduler {
  // ULTRA-CONSERVATIVE SETTINGS - Prevent API bans at all costs
  private readonly config: RefreshConfig = {
    maxCallsPerMinute: 2,        // 40% of FPL limit (5/min)
    maxCallsPerHour: 40,          // 40% of FPL limit (100/hour)
    maxCallsPerDay: 200,          // 40% of FPL limit (500/day)
    delayBetweenCalls: 30000,     // 30 seconds between calls
    batchSize: 10,                // Process 10 users per batch
    retryAttempts: 3,             // Retry failed fetches
    retryDelay: 300000            // 5 minutes before retry
  };

  private callsThisMinute = 0;
  private callsThisHour = 0;
  private callsToday = 0;
  private lastCallTime = 0;
  private isRunning = false;
  private isPaused = false;
  private emergencyShutdown = false;

  private stats: RefreshStats = {
    totalUsers: 0,
    refreshedToday: 0,
    failedToday: 0,
    remainingToday: 0,
    estimatedCompletionTime: new Date(),
    currentBatchProgress: 0
  };

  // Main refresh function - processes users strategically
  async refreshUserTeams(userFplIds: string[], currentGameweek: number): Promise<void> {
    if (this.isRunning) {
      // console.log('⚠️ Refresh already running, skipping...');
      return;
    }

    if (this.emergencyShutdown) {
      // console.log('🚨 EMERGENCY SHUTDOWN ACTIVE - Refresh blocked');
      return;
    }

    this.isRunning = true;
    this.stats.totalUsers = userFplIds.length;
    
    // console.log('🔄 Starting strategic refresh...');
    // console.log(`📊 Total users: ${userFplIds.length}`);
    // console.log(`⚙️ Config: ${this.config.maxCallsPerDay} calls/day, ${this.config.delayBetweenCalls/1000}s delay`);

    try {
      // Get prioritized list of users needing refresh
      const usersToRefresh = userTeamCacheService.getUsersNeedingRefresh(
        userFplIds,
        currentGameweek
      );

      // console.log(`🎯 Users needing refresh: ${usersToRefresh.length}/${userFplIds.length}`);

      // Calculate daily budget
      const dailyBudget = this.config.maxCallsPerDay - this.callsToday;
      const usersToday = Math.min(usersToRefresh.length, dailyBudget);

      // console.log(`💰 Daily budget: ${dailyBudget} calls remaining`);
      // console.log(`📅 Will refresh ${usersToday} users today`);

      this.stats.remainingToday = usersToday;

      // Process users in batches
      let processed = 0;
      for (let i = 0; i < usersToday; i += this.config.batchSize) {
        // Check for pause or shutdown
        if (this.isPaused) {
          // console.log('⏸️ Refresh paused, waiting...');
          await this.waitForResume();
        }

        if (this.emergencyShutdown) {
          // console.log('🚨 EMERGENCY SHUTDOWN - Stopping refresh');
          break;
        }

        const batch = usersToRefresh.slice(i, i + this.config.batchSize);
        await this.processBatch(batch, currentGameweek);
        
        processed += batch.length;
        this.stats.currentBatchProgress = (processed / usersToday) * 100;

        // console.log(`📊 Progress: ${processed}/${usersToday} (${Math.round(this.stats.currentBatchProgress)}%)`);
      }

      // console.log('✅ Strategic refresh complete');
      // console.log(`📈 Stats: ${this.stats.refreshedToday} success, ${this.stats.failedToday} failed`);

    } catch (error) {
      // console.error('❌ Refresh error:', error);
    } finally {
      this.isRunning = false;
    }
  }

  // Process a batch of users with rate limiting
  private async processBatch(fplIds: string[], currentGameweek: number): Promise<void> {
    // console.log(`📦 Processing batch of ${fplIds.length} users...`);

    for (const fplId of fplIds) {
      try {
        // Check rate limits before each call
        await this.enforceRateLimits();

        // Fetch user team from API
        // console.log(`🔍 Fetching team for user ${fplId}...`);
        const teamData = await fplApiService.getUserPicks(fplId, currentGameweek);

        // Cache the result
        userTeamCacheService.setCachedTeam(fplId, teamData, currentGameweek);

        // Update counters
        this.callsThisMinute++;
        this.callsThisHour++;
        this.callsToday++;
        this.stats.refreshedToday++;
        this.stats.remainingToday--;
        this.lastCallTime = Date.now();

        // console.log(`✅ Cached team for ${fplId} (calls today: ${this.callsToday}/${this.config.maxCallsPerDay})`);

        // Delay between calls
        await this.delay(this.config.delayBetweenCalls);

      } catch (error) {
        // console.error(`❌ Failed to fetch team for ${fplId}:`, error);
        userTeamCacheService.markFetchFailed(fplId, String(error));
        this.stats.failedToday++;

        // Longer delay after error
        await this.delay(this.config.retryDelay);
      }
    }
  }

  // Enforce ultra-conservative rate limits
  private async enforceRateLimits(): Promise<void> {
    const now = Date.now();

    // Reset minute counter
    if (now - this.lastCallTime > 60000) {
      this.callsThisMinute = 0;
    }

    // Reset hour counter
    if (now - this.lastCallTime > 3600000) {
      this.callsThisHour = 0;
    }

    // Check minute limit
    if (this.callsThisMinute >= this.config.maxCallsPerMinute) {
      const waitTime = 60000 - (now - this.lastCallTime);
      // console.log(`⏳ Minute limit reached, waiting ${Math.round(waitTime/1000)}s...`);
      await this.delay(waitTime);
      this.callsThisMinute = 0;
    }

    // Check hour limit
    if (this.callsThisHour >= this.config.maxCallsPerHour) {
      const waitTime = 3600000 - (now - this.lastCallTime);
      // console.log(`⏳ Hour limit reached, waiting ${Math.round(waitTime/60000)}m...`);
      await this.delay(waitTime);
      this.callsThisHour = 0;
    }

    // Check daily limit
    if (this.callsToday >= this.config.maxCallsPerDay) {
      // console.log('🚨 Daily limit reached, stopping refresh');
      throw new Error('Daily API limit reached');
    }
  }

  // Continuous background refresh (runs 24/7)
  async startContinuousRefresh(getAllUsers: () => Promise<string[]>, getCurrentGameweek: () => Promise<number>): Promise<void> {
    // console.log('🔄 Starting continuous background refresh...');
    // console.log('⚠️ This will run indefinitely - use stopContinuousRefresh() to stop');

    while (!this.emergencyShutdown) {
      try {
        // Reset daily counter at midnight
        this.resetDailyCounters();

        // Get all users and current gameweek
        const allUsers = await getAllUsers();
        const currentGW = await getCurrentGameweek();

        // console.log(`📅 Daily refresh cycle starting (${allUsers.length} users, GW${currentGW})`);

        // Refresh users within daily budget
        await this.refreshUserTeams(allUsers, currentGW);

        // Wait until next cycle (1 hour)
        // console.log('⏳ Waiting 1 hour before next refresh cycle...');
        await this.delay(60 * 60 * 1000);

      } catch (error) {
        // console.error('❌ Continuous refresh error:', error);
        // Wait 5 minutes before retry
        await this.delay(5 * 60 * 1000);
      }
    }

    // console.log('🛑 Continuous refresh stopped');
  }

  // Reset daily counters at midnight
  private resetDailyCounters(): void {
    const now = new Date();
    const midnight = new Date(now);
    midnight.setHours(24, 0, 0, 0);

    if (now >= midnight) {
      // console.log('🌅 New day - resetting daily counters');
      this.callsToday = 0;
      this.stats.refreshedToday = 0;
      this.stats.failedToday = 0;
    }
  }

  // Pause refresh
  pause(): void {
    this.isPaused = true;
    // console.log('⏸️ Refresh paused');
  }

  // Resume refresh
  resume(): void {
    this.isPaused = false;
    // console.log('▶️ Refresh resumed');
  }

  // Emergency shutdown
  emergencyStop(): void {
    this.emergencyShutdown = true;
    this.isPaused = false;
    // console.log('🚨 EMERGENCY SHUTDOWN ACTIVATED');
  }

  // Reset emergency shutdown
  resetEmergencyShutdown(): void {
    this.emergencyShutdown = false;
    // console.log('✅ Emergency shutdown reset');
  }

  // Wait for resume
  private async waitForResume(): Promise<void> {
    while (this.isPaused && !this.emergencyShutdown) {
      await this.delay(1000);
    }
  }

  // Get current stats
  getStats(): RefreshStats {
    return { ...this.stats };
  }

  // Get current call counts
  getCallCounts(): { minute: number; hour: number; day: number } {
    return {
      minute: this.callsThisMinute,
      hour: this.callsThisHour,
      day: this.callsToday
    };
  }

  // Check if running
  isRefreshRunning(): boolean {
    return this.isRunning;
  }

  // Delay helper
  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // Update configuration (use with caution!)
  updateConfig(newConfig: Partial<RefreshConfig>): void {
    // console.log('⚙️ Updating refresh configuration...');
    Object.assign(this.config, newConfig);
    // console.log('✅ Configuration updated:', this.config);
  }

  // Get configuration
  getConfig(): RefreshConfig {
    return { ...this.config };
  }
}

export const strategicRefreshScheduler = new StrategicRefreshScheduler();
export type { RefreshConfig, RefreshStats };


