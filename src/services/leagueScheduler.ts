// Gaffer's League Scheduler Service
// Handles automated tasks for league management

import { leagueLotteryService } from './leagueLotteryService';
import { leagueEmailService } from './leagueEmailService';

class LeagueScheduler {
  /**
   * Run lottery 2 weeks before season starts
   * Schedule this to run on a specific date
   */
  async runLotterySelection(): Promise<void> {
    // console.log('🎲 === GAFFER\'S LEAGUE LOTTERY SELECTION ===');
    // console.log(`📅 Date: ${new Date().toISOString()}`);
    
    try {
      // 1. Conduct lottery for all tiers
      // console.log('🎲 Step 1: Conducting lottery...');
      const results = await leagueLotteryService.conductAllLotteries();
      
      // 2. Send selection emails
      // console.log('📧 Step 2: Sending selection emails...');
      await leagueEmailService.sendAllLotteryEmails();
      
      // 3. Log results
      // console.log('✅ === LOTTERY COMPLETE ===');
      results.forEach(result => {
        // console.log(`\n${result.tier.toUpperCase()}:`);
        // console.log(`  Total Applicants: ${result.total_applicants}`);
        // console.log(`  Selected: ${result.selected.length}`);
        // console.log(`  Waitlist: ${result.waitlist.length}`);
      });
      
    } catch (error) {
      // console.error('❌ Lottery selection failed:', error);
      // TODO: Send alert to admin
      throw error;
    }
  }

  /**
   * Check for expired codes and offer to waitlist
   * Run this every hour
   */
  async handleExpiredCodes(): Promise<void> {
    // console.log('⏰ Checking for expired codes...');
    
    try {
      await leagueLotteryService.handleExpiredCodes();
      // console.log('✅ Expired codes handled');
    } catch (error) {
      // console.error('❌ Error handling expired codes:', error);
    }
  }

  /**
   * Send reminder emails to users who haven't joined
   * Run this daily
   */
  async sendReminderEmails(): Promise<void> {
    // console.log('📧 Sending reminder emails...');
    
    try {
      const result = await leagueEmailService.sendReminderEmails();
      // console.log(`✅ Sent ${result.sent} reminders, ${result.failed} failed`);
    } catch (error) {
      // console.error('❌ Error sending reminders:', error);
    }
  }

  /**
   * Daily maintenance tasks
   */
  async runDailyTasks(): Promise<void> {
    // console.log('🔧 === DAILY MAINTENANCE ===');
    
    await this.handleExpiredCodes();
    await this.sendReminderEmails();
    
    // console.log('✅ Daily tasks complete');
  }

  /**
   * Hourly maintenance tasks
   */
  async runHourlyTasks(): Promise<void> {
    // console.log('🔧 Running hourly tasks...');
    
    await this.handleExpiredCodes();
    
    // console.log('✅ Hourly tasks complete');
  }
}

export const leagueScheduler = new LeagueScheduler();

// Example cron job setup (for Vercel Cron, AWS Lambda, etc.)
export const scheduledTasks = {
  // Run lottery 2 weeks before season (manual trigger or specific date)
  lottery: async () => {
    await leagueScheduler.runLotterySelection();
  },
  
  // Run every hour
  hourly: async () => {
    await leagueScheduler.runHourlyTasks();
  },
  
  // Run daily at 9 AM
  daily: async () => {
    await leagueScheduler.runDailyTasks();
  }
};


