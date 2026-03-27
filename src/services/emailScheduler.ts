// Email Scheduler Service - Automated Email Sending
// Schedules and sends tier-specific emails at optimal times

import { emailContentGenerator, UserTier } from './emailContentGenerator';
import { emailTemplateService } from './emailTemplateService';
import { supabase } from './supabase';

interface ScheduleConfig {
  tier: UserTier;
  schedule: string; // Cron format
  emailType: 'weekly' | 'preview';
}

class EmailSchedulerService {
  private schedules: ScheduleConfig[] = [];
  private isRunning = false;

  constructor() {
    this.initializeSchedules();
  }

  /**
   * Initialize email schedules from environment
   */
  private initializeSchedules(): void {
    // Free tier: Saturday 9AM (weekly digest)
    this.schedules.push({
      tier: 'free',
      schedule: import.meta.env.EMAIL_FREE_TIER_SCHEDULE || '0 9 * * 6',
      emailType: 'weekly'
    });

    // First Team: Thursday 6PM (preview) + Saturday 9AM (digest)
    this.schedules.push({
      tier: 'firstTeam',
      schedule: import.meta.env.EMAIL_FIRSTTEAM_SCHEDULE_1 || '0 18 * * 4',
      emailType: 'preview'
    });
    this.schedules.push({
      tier: 'firstTeam',
      schedule: import.meta.env.EMAIL_FIRSTTEAM_SCHEDULE_2 || '0 9 * * 6',
      emailType: 'weekly'
    });

    // Season Pass: Thursday 6PM (preview) + Saturday 9AM (digest)
    this.schedules.push({
      tier: 'seasonPass',
      schedule: import.meta.env.EMAIL_SEASONPASS_SCHEDULE_1 || '0 18 * * 4',
      emailType: 'preview'
    });
    this.schedules.push({
      tier: 'seasonPass',
      schedule: import.meta.env.EMAIL_SEASONPASS_SCHEDULE_2 || '0 9 * * 6',
      emailType: 'weekly'
    });
  }

  /**
   * Start email scheduler
   */
  start(): void {
    if (this.isRunning) {
      // console.log('⏸️ Email scheduler already running');
      return;
    }

    if (import.meta.env.EMAIL_GENERATION_ENABLED !== 'true') {
      // console.log('⏸️ Email generation disabled in configuration');
      return;
    }

    // console.log('🚀 Email scheduler started');
    this.isRunning = true;

    // Check every hour if emails should be sent
    setInterval(() => {
      this.checkAndSendEmails();
    }, 60 * 60 * 1000); // Every hour

    // Initial check
    this.checkAndSendEmails();
  }

  /**
   * Stop email scheduler
   */
  stop(): void {
    this.isRunning = false;
    // console.log('⏹️ Email scheduler stopped');
  }

  /**
   * Check if emails should be sent and send them
   */
  private async checkAndSendEmails(): Promise<void> {
    const now = new Date();
    const currentHour = now.getHours();
    const currentDay = now.getDay(); // 0 = Sunday, 6 = Saturday

    // console.log(`🔍 Checking email schedules... (${now.toLocaleString()})`);

    // Saturday 9AM - Send to all tiers
    if (currentDay === 6 && currentHour === 9) {
      await this.sendWeeklyDigest('free');
      await this.sendWeeklyDigest('firstTeam');
      await this.sendWeeklyDigest('seasonPass');
    }

    // Thursday 6PM - Send preview to paid tiers
    if (currentDay === 4 && currentHour === 18) {
      await this.sendGameweekPreview('firstTeam');
      await this.sendGameweekPreview('seasonPass');
    }
  }

  /**
   * Send weekly digest to tier
   */
  private async sendWeeklyDigest(tier: UserTier): Promise<void> {
    try {
      // console.log(`📧 Generating weekly digest for ${tier} tier...`);

      // Generate content
      const content = await emailContentGenerator.generateContent(tier);

      // Get users for this tier
      const users = await this.getUsersByTier(tier);

      if (users.length === 0) {
        // console.log(`⚠️ No users found for ${tier} tier`);
        return;
      }

      // console.log(`📨 Sending to ${users.length} ${tier} users...`);

      // Send emails
      let successCount = 0;
      let failCount = 0;

      for (const user of users) {
        try {
          const html = emailTemplateService.generateEmail(content, user.name);
          await this.sendEmail(user.email, 'Your Weekly FPL Intelligence Report', html);
          successCount++;
        } catch (error) {
          // console.error(`❌ Failed to send to ${user.email}:`, error);
          failCount++;
        }

        // Rate limiting - wait 100ms between emails
        await this.sleep(100);
      }

      // console.log(`✅ Weekly digest sent: ${successCount} success, ${failCount} failed`);
    } catch (error) {
      // console.error(`❌ Weekly digest error for ${tier}:`, error);
    }
  }

  /**
   * Send gameweek preview to tier
   */
  private async sendGameweekPreview(tier: UserTier): Promise<void> {
    try {
      // console.log(`📧 Generating gameweek preview for ${tier} tier...`);

      // Generate content (same as weekly but different subject)
      const content = await emailContentGenerator.generateContent(tier);

      // Get users for this tier
      const users = await this.getUsersByTier(tier);

      if (users.length === 0) {
        // console.log(`⚠️ No users found for ${tier} tier`);
        return;
      }

      // console.log(`📨 Sending to ${users.length} ${tier} users...`);

      // Send emails
      let successCount = 0;
      let failCount = 0;

      for (const user of users) {
        try {
          const html = emailTemplateService.generateEmail(content, user.name);
          await this.sendEmail(user.email, 'Gameweek Preview: Captain Picks & Intelligence', html);
          successCount++;
        } catch (error) {
          // console.error(`❌ Failed to send to ${user.email}:`, error);
          failCount++;
        }

        // Rate limiting
        await this.sleep(100);
      }

      // console.log(`✅ Gameweek preview sent: ${successCount} success, ${failCount} failed`);
    } catch (error) {
      // console.error(`❌ Gameweek preview error for ${tier}:`, error);
    }
  }

  /**
   * Get users by tier from database
   */
  private async getUsersByTier(tier: UserTier): Promise<Array<{ email: string; name: string }>> {
    try {
      if (!supabase) {
        // console.warn('⚠️ Supabase not configured');
        return [];
      }

      const { data, error } = await supabase
        .from('users')
        .select('email, name')
        .eq('tier', tier)
        .eq('email_opt_in', true); // Only send to opted-in users

      if (error) {
        // console.error('Database error:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      // console.error('Failed to fetch users:', error);
      return [];
    }
  }

  /**
   * Send email via configured service
   */
  private async sendEmail(to: string, subject: string, html: string): Promise<void> {
    // This would integrate with AWS SES or your email service
    // For now, just log
    // console.log(`📧 Sending email to ${to}: ${subject}`);

    // TODO: Implement actual email sending
    // Example with AWS SES:
    /*
    const AWS = require('aws-sdk');
    const ses = new AWS.SES({
      region: process.env.AWS_SES_REGION,
      accessKeyId: process.env.AWS_SES_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SES_SECRET_ACCESS_KEY
    });

    await ses.sendEmail({
      Source: process.env.AWS_SES_FROM_EMAIL,
      Destination: { ToAddresses: [to] },
      Message: {
        Subject: { Data: subject },
        Body: { Html: { Data: html } }
      }
    }).promise();
    */
  }

  /**
   * Manual send for testing
   */
  async sendTestEmail(tier: UserTier, email: string, name: string = 'Manager'): Promise<void> {
    // console.log(`🧪 Generating test email for ${tier} tier...`);

    const content = await emailContentGenerator.generateContent(tier);
    const html = emailTemplateService.generateEmail(content, name);

    await this.sendEmail(email, `[TEST] Your ${tier} FPL Intelligence Report`, html);

    // console.log(`✅ Test email sent to ${email}`);
  }

  /**
   * Preview email in browser
   */
  async previewEmail(tier: UserTier, name: string = 'Manager'): Promise<string> {
    // console.log(`👀 Generating email preview for ${tier} tier...`);

    const content = await emailContentGenerator.generateContent(tier);
    const html = emailTemplateService.generateEmail(content, name);

    return html;
  }

  /**
   * Get schedule status
   */
  getStatus(): any {
    return {
      isRunning: this.isRunning,
      schedules: this.schedules,
      nextRuns: this.getNextRunTimes()
    };
  }

  /**
   * Calculate next run times
   */
  private getNextRunTimes(): any {
    const now = new Date();
    const nextRuns: any = {};

    // Calculate next Saturday 9AM
    const nextSaturday = new Date(now);
    nextSaturday.setDate(now.getDate() + ((6 - now.getDay() + 7) % 7));
    nextSaturday.setHours(9, 0, 0, 0);
    if (nextSaturday < now) {
      nextSaturday.setDate(nextSaturday.getDate() + 7);
    }

    // Calculate next Thursday 6PM
    const nextThursday = new Date(now);
    nextThursday.setDate(now.getDate() + ((4 - now.getDay() + 7) % 7));
    nextThursday.setHours(18, 0, 0, 0);
    if (nextThursday < now) {
      nextThursday.setDate(nextThursday.getDate() + 7);
    }

    nextRuns.weeklyDigest = nextSaturday.toLocaleString();
    nextRuns.gameweekPreview = nextThursday.toLocaleString();

    return nextRuns;
  }

  /**
   * Sleep helper
   */
  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

export const emailScheduler = new EmailSchedulerService();


