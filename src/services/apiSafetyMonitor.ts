// API Safety Monitor - Enterprise-Grade Protection Against Bans
// Real-time monitoring, alerts, and automatic safety mechanisms

import { strategicRefreshScheduler } from './strategicRefreshScheduler';
import { userTeamCacheService } from './userTeamCacheService';

interface SafetyThresholds {
  warningThreshold: number;      // % of limit to trigger warning
  dangerThreshold: number;       // % of limit to trigger danger alert
  criticalThreshold: number;     // % of limit to trigger emergency shutdown
}

interface SafetyStatus {
  level: 'safe' | 'warning' | 'danger' | 'critical';
  message: string;
  callsToday: number;
  dailyLimit: number;
  percentageUsed: number;
  recommendedAction: string;
  timestamp: Date;
}

interface ApiHealthMetrics {
  status: 'healthy' | 'degraded' | 'unhealthy' | 'shutdown';
  callsPerMinute: number;
  callsPerHour: number;
  callsPerDay: number;
  cacheHitRate: number;
  apiCallsSaved: number;
  errorRate: number;
  lastError?: string;
  uptime: number;
}

class ApiSafetyMonitor {
  // ULTRA-CONSERVATIVE THRESHOLDS
  private readonly thresholds: SafetyThresholds = {
    warningThreshold: 50,    // Warning at 50% of daily limit
    dangerThreshold: 70,     // Danger at 70% of daily limit
    criticalThreshold: 85    // Emergency shutdown at 85% of daily limit
  };

  private readonly DAILY_LIMIT = 200; // Ultra-conservative (40% of FPL's 500)
  private readonly ABSOLUTE_MAX = 500; // FPL's actual limit (never exceed)

  private errorCount = 0;
  private consecutiveErrors = 0;
  private lastErrorTime = 0;
  private startTime = Date.now();
  private alertsSent: string[] = [];

  // Monitor API usage and enforce safety
  async monitorUsage(): Promise<SafetyStatus> {
    const callCounts = strategicRefreshScheduler.getCallCounts();
    const percentageUsed = (callCounts.day / this.DAILY_LIMIT) * 100;

    let level: 'safe' | 'warning' | 'danger' | 'critical' = 'safe';
    let message = 'API usage is within safe limits';
    let recommendedAction = 'Continue normal operations';

    // Check thresholds
    if (percentageUsed >= this.thresholds.criticalThreshold) {
      level = 'critical';
      message = `🚨 CRITICAL: ${percentageUsed.toFixed(1)}% of daily limit used!`;
      recommendedAction = 'EMERGENCY SHUTDOWN ACTIVATED';
      await this.emergencyShutdown();
    } else if (percentageUsed >= this.thresholds.dangerThreshold) {
      level = 'danger';
      message = `⚠️ DANGER: ${percentageUsed.toFixed(1)}% of daily limit used`;
      recommendedAction = 'Pause all non-critical API calls';
      await this.sendAlert('danger', message);
      strategicRefreshScheduler.pause();
    } else if (percentageUsed >= this.thresholds.warningThreshold) {
      level = 'warning';
      message = `⚠️ WARNING: ${percentageUsed.toFixed(1)}% of daily limit used`;
      recommendedAction = 'Reduce API call frequency';
      await this.sendAlert('warning', message);
    }

    // Check for rapid usage
    if (callCounts.minute > 2) {
      level = 'danger';
      message = `🚨 Rapid API usage detected: ${callCounts.minute} calls/minute`;
      recommendedAction = 'Enforce stricter rate limiting';
      strategicRefreshScheduler.pause();
    }

    // Check absolute maximum
    if (callCounts.day >= this.ABSOLUTE_MAX) {
      level = 'critical';
      message = `🚨 ABSOLUTE LIMIT REACHED: ${callCounts.day} calls (FPL max: ${this.ABSOLUTE_MAX})`;
      recommendedAction = 'EMERGENCY SHUTDOWN - API BAN IMMINENT';
      await this.emergencyShutdown();
    }

    const status: SafetyStatus = {
      level,
      message,
      callsToday: callCounts.day,
      dailyLimit: this.DAILY_LIMIT,
      percentageUsed: Math.round(percentageUsed * 100) / 100,
      recommendedAction,
      timestamp: new Date()
    };

    // Log status
    this.logStatus(status);

    return status;
  }

  // Get comprehensive health metrics
  getHealthMetrics(): ApiHealthMetrics {
    const callCounts = strategicRefreshScheduler.getCallCounts();
    const cacheStats = userTeamCacheService.getStats();
    const refreshStats = strategicRefreshScheduler.getStats();

    const errorRate = refreshStats.totalUsers > 0 
      ? (refreshStats.failedToday / refreshStats.totalUsers) * 100 
      : 0;

    let status: 'healthy' | 'degraded' | 'unhealthy' | 'shutdown' = 'healthy';
    
    if (callCounts.day >= this.DAILY_LIMIT * 0.85) {
      status = 'shutdown';
    } else if (callCounts.day >= this.DAILY_LIMIT * 0.70) {
      status = 'unhealthy';
    } else if (callCounts.day >= this.DAILY_LIMIT * 0.50 || errorRate > 10) {
      status = 'degraded';
    }

    return {
      status,
      callsPerMinute: callCounts.minute,
      callsPerHour: callCounts.hour,
      callsPerDay: callCounts.day,
      cacheHitRate: cacheStats.hitRate,
      apiCallsSaved: cacheStats.apiCallsSaved,
      errorRate: Math.round(errorRate * 100) / 100,
      uptime: Date.now() - this.startTime
    };
  }

  // Emergency shutdown procedure
  private async emergencyShutdown(): Promise<void> {
    // console.log('🚨🚨🚨 EMERGENCY SHUTDOWN INITIATED 🚨🚨🚨');
    // console.log('🛑 All API calls have been blocked to prevent ban');
    
    // Stop all refresh operations
    strategicRefreshScheduler.emergencyStop();
    
    // Send critical alert
    await this.sendAlert('critical', 'EMERGENCY SHUTDOWN - API limit approaching');
    
    // Log shutdown
    // console.log('📝 Emergency shutdown logged');
    // console.log('⚠️ Manual intervention required to resume operations');
    // console.log('💡 Use apiSafetyMonitor.resetEmergencyShutdown() to resume');
  }

  // Reset emergency shutdown (manual intervention required)
  resetEmergencyShutdown(): void {
    // console.log('🔄 Resetting emergency shutdown...');
    strategicRefreshScheduler.resetEmergencyShutdown();
    strategicRefreshScheduler.resume();
    this.alertsSent = [];
    // console.log('✅ Emergency shutdown reset - operations can resume');
  }

  // Send alert (implement with your alert system)
  private async sendAlert(severity: 'warning' | 'danger' | 'critical', message: string): Promise<void> {
    const alertKey = `${severity}-${message}`;
    
    // Prevent duplicate alerts
    if (this.alertsSent.includes(alertKey)) {
      return;
    }
    
    this.alertsSent.push(alertKey);
    
    // console.log(`🚨 ALERT [${severity.toUpperCase()}]: ${message}`);
    
    // TODO: Implement actual alerting (email, SMS, Slack, etc.)
    // Example:
    // await emailService.sendAlert({
    //   to: 'admin@premierleaguehub.com',
    //   subject: `[${severity.toUpperCase()}] API Safety Alert`,
    //   body: message
    // });
  }

  // Log status to console
  private logStatus(status: SafetyStatus): void {
    const emoji = {
      safe: '✅',
      warning: '⚠️',
      danger: '🔴',
      critical: '🚨'
    }[status.level];

    // console.log(`${emoji} API Safety Status: ${status.level.toUpperCase()}`);
    // console.log(`📊 Usage: ${status.callsToday}/${status.dailyLimit} (${status.percentageUsed}%)`);
    // console.log(`💡 Action: ${status.recommendedAction}`);
  }

  // Record API error
  recordError(error: string): void {
    this.errorCount++;
    this.consecutiveErrors++;
    this.lastErrorTime = Date.now();

    // console.log(`❌ API Error recorded: ${error}`);
    // console.log(`📊 Total errors: ${this.errorCount}, Consecutive: ${this.consecutiveErrors}`);

    // Check for error patterns
    if (this.consecutiveErrors >= 5) {
      // console.log('🚨 Multiple consecutive errors detected');
      strategicRefreshScheduler.pause();
      this.sendAlert('danger', `${this.consecutiveErrors} consecutive API errors`);
    }
  }

  // Record successful API call
  recordSuccess(): void {
    this.consecutiveErrors = 0;
  }

  // Get safety recommendations
  getSafetyRecommendations(): string[] {
    const recommendations: string[] = [];
    const callCounts = strategicRefreshScheduler.getCallCounts();
    const cacheStats = userTeamCacheService.getStats();
    const percentageUsed = (callCounts.day / this.DAILY_LIMIT) * 100;

    if (percentageUsed > 50) {
      recommendations.push('⚠️ Over 50% of daily limit used - consider reducing refresh frequency');
    }

    if (cacheStats.hitRate < 80) {
      recommendations.push('📈 Cache hit rate below 80% - consider increasing cache duration');
    }

    if (callCounts.minute > 1) {
      recommendations.push('⏱️ Multiple calls per minute - increase delay between calls');
    }

    if (this.errorCount > 10) {
      recommendations.push('❌ High error count - investigate API issues');
    }

    if (recommendations.length === 0) {
      recommendations.push('✅ All systems operating within safe parameters');
    }

    return recommendations;
  }

  // Generate safety report
  generateSafetyReport(): string {
    const metrics = this.getHealthMetrics();
    const cacheStats = userTeamCacheService.getStats();
    const recommendations = this.getSafetyRecommendations();

    const report = `
╔════════════════════════════════════════════════════════════╗
║           API SAFETY MONITORING REPORT                     ║
╚════════════════════════════════════════════════════════════╝

📊 SYSTEM STATUS: ${metrics.status.toUpperCase()}

🔢 API USAGE:
   • Calls/Minute: ${metrics.callsPerMinute}/2 (safe limit)
   • Calls/Hour:   ${metrics.callsPerHour}/40 (safe limit)
   • Calls/Day:    ${metrics.callsPerDay}/200 (safe limit)
   • Percentage:   ${((metrics.callsPerDay/200)*100).toFixed(1)}%

💾 CACHE PERFORMANCE:
   • Hit Rate:     ${cacheStats.hitRate}%
   • Total Cached: ${cacheStats.totalCached} users
   • Fresh Cache:  ${cacheStats.freshCache} users
   • API Calls Saved: ${cacheStats.apiCallsSaved}

⚠️ ERROR TRACKING:
   • Error Rate:   ${metrics.errorRate}%
   • Total Errors: ${this.errorCount}
   • Consecutive:  ${this.consecutiveErrors}

⏱️ UPTIME:
   • Running for:  ${Math.round(metrics.uptime / 3600000)} hours

💡 RECOMMENDATIONS:
${recommendations.map(r => `   ${r}`).join('\n')}

╚════════════════════════════════════════════════════════════╝
    `;

    return report;
  }

  // Start continuous monitoring (runs every 5 minutes)
  startContinuousMonitoring(): void {
    // console.log('🔍 Starting continuous API safety monitoring...');
    
    setInterval(async () => {
      await this.monitorUsage();
      
      // Clear expired cache entries
      userTeamCacheService.clearExpired();
      
      // Log health metrics every hour
      const uptime = Date.now() - this.startTime;
      if (uptime % 3600000 < 300000) { // Every hour (±5 min)
        // console.log(this.generateSafetyReport());
      }
    }, 5 * 60 * 1000); // Every 5 minutes
  }

  // Get current thresholds
  getThresholds(): SafetyThresholds {
    return { ...this.thresholds };
  }

  // Update thresholds (use with extreme caution!)
  updateThresholds(newThresholds: Partial<SafetyThresholds>): void {
    // console.log('⚙️ Updating safety thresholds...');
    Object.assign(this.thresholds, newThresholds);
    // console.log('✅ Thresholds updated:', this.thresholds);
  }
}

export const apiSafetyMonitor = new ApiSafetyMonitor();
export type { SafetyThresholds, SafetyStatus, ApiHealthMetrics };


