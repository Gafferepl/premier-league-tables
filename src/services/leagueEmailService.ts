// Gaffer's League Email Notification Service
// Handles sending selection emails and notifications

import { createClient } from '@supabase/supabase-js';
import { render } from '@react-email/render';
import LeagueSelectionEmail from '../emails/LeagueSelectionEmail';
import type { LeagueTier } from './leagueLotteryService';

const supabaseUrl = import.meta.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = import.meta.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = (supabaseUrl && supabaseKey) ? createClient(supabaseUrl, supabaseKey) : null;

// AWS SES configuration
const AWS_REGION = import.meta.env.AWS_REGION || 'us-east-1';
const AWS_ACCESS_KEY = import.meta.env.AWS_ACCESS_KEY_ID || '';
const AWS_SECRET_KEY = import.meta.env.AWS_SECRET_ACCESS_KEY || '';
const FROM_EMAIL = import.meta.env.FROM_EMAIL || 'noreply@premierleaguetables.com';

interface EmailParams {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

class LeagueEmailService {
  /**
   * Send email via AWS SES
   */
  private async sendEmail(params: EmailParams): Promise<boolean> {
    try {
      // In production, use AWS SDK
      // For now, log the email
      // console.log('📧 Sending email:', {
        to: params.to,
        subject: params.subject,
        preview: params.html.substring(0, 100) + '...'
      });

      // TODO: Implement actual AWS SES sending
      // const AWS = require('aws-sdk');
      // const ses = new AWS.SES({ region: AWS_REGION });
      // await ses.sendEmail({
      //   Source: FROM_EMAIL,
      //   Destination: { ToAddresses: [params.to] },
      //   Message: {
      //     Subject: { Data: params.subject },
      //     Body: {
      //       Html: { Data: params.html },
      //       Text: { Data: params.text || '' }
      //     }
      //   }
      // }).promise();

      return true;
    } catch (error) {
      // console.error('❌ Error sending email:', error);
      return false;
    }
  }

  /**
   * Log email sent to database
   */
  private async logEmail(
    applicantId: string,
    emailType: string,
    tier: LeagueTier,
    status: 'sent' | 'failed',
    errorMessage?: string
  ): Promise<void> {
    await supabase.from('league_email_log').insert({
      applicant_id: applicantId,
      email_type: emailType,
      tier: tier,
      status: status,
      error_message: errorMessage,
      metadata: { sent_at: new Date().toISOString() }
    });
  }

  /**
   * Send selection email to a winner
   */
  async sendSelectionEmail(
    applicantId: string,
    name: string,
    email: string,
    tier: LeagueTier,
    leagueCode: string,
    leagueName: string
  ): Promise<boolean> {
    try {
      // console.log(`📧 Sending selection email to ${email} (${tier})`);

      // Render email template
      const emailHtml = await render(
        LeagueSelectionEmail({
          name,
          tier,
          leagueCode,
          leagueName
        })
      );

      const tierNames = {
        free: 'Community League',
        firstTeam: 'Elite League',
        seasonPass: 'Inner Circle'
      };

      // Send email
      const success = await this.sendEmail({
        to: email,
        subject: `🎉 YOU'RE IN! Welcome to the Gaffer's ${tierNames[tier]}`,
        html: emailHtml
      });

      // Update selection record
      if (success) {
        await supabase
          .from('league_selections')
          .update({ code_sent_at: new Date().toISOString() })
          .eq('applicant_id', applicantId)
          .eq('tier', tier);
      }

      // Log email
      await this.logEmail(
        applicantId,
        'selection',
        tier,
        success ? 'sent' : 'failed',
        success ? undefined : 'Email sending failed'
      );

      return success;
    } catch (error) {
      // console.error('❌ Error sending selection email:', error);
      await this.logEmail(
        applicantId,
        'selection',
        tier,
        'failed',
        error instanceof Error ? error.message : 'Unknown error'
      );
      return false;
    }
  }

  /**
   * Send selection emails to all winners of a lottery
   */
  async sendAllSelectionEmails(tier: LeagueTier): Promise<{
    sent: number;
    failed: number;
  }> {
    // console.log(`📧 Sending selection emails for ${tier} tier...`);

    // Get all selections that haven't been sent yet
    const { data: selections, error } = await supabase
      .from('league_selections')
      .select('*, league_applicants(*)')
      .eq('tier', tier)
      .is('code_sent_at', null)
      .eq('is_active', true);

    if (error) {
      // console.error('Error fetching selections:', error);
      throw error;
    }

    if (!selections || selections.length === 0) {
      // console.log('✅ No pending selection emails to send');
      return { sent: 0, failed: 0 };
    }

    let sent = 0;
    let failed = 0;

    for (const selection of selections) {
      const applicant = selection.league_applicants;
      const success = await this.sendSelectionEmail(
        applicant.id,
        applicant.name,
        applicant.email,
        tier,
        selection.league_code,
        selection.league_name
      );

      if (success) {
        sent++;
      } else {
        failed++;
      }

      // Add small delay to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 100));
    }

    // console.log(`✅ Sent ${sent} emails, ${failed} failed`);
    return { sent, failed };
  }

  /**
   * Send waitlist confirmation email
   */
  async sendWaitlistEmail(
    applicantId: string,
    name: string,
    email: string,
    tier: LeagueTier,
    position: number
  ): Promise<boolean> {
    try {
      const tierNames = {
        free: 'Community League',
        firstTeam: 'Elite League',
        seasonPass: 'Inner Circle'
      };

      const html = `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #1e40af, #3b82f6); color: white; padding: 30px; text-align: center; border-radius: 10px; }
            .content { padding: 30px; background: #f8fafc; border-radius: 10px; margin-top: 20px; }
            .position { font-size: 48px; font-weight: bold; color: #1e40af; text-align: center; margin: 20px 0; }
            .footer { text-align: center; margin-top: 30px; color: #6b7280; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>⚽ premierleaguetables.com</h1>
              <h2>You're on the Waitlist!</h2>
            </div>
            <div class="content">
              <p>Hi ${name},</p>
              <p>Thanks for entering the Gaffer's ${tierNames[tier]} lottery! While you weren't selected in this round, you've been added to our priority waitlist.</p>
              
              <div class="position">
                Position #${position}
              </div>
              
              <h3>What This Means:</h3>
              <ul>
                <li><strong>Priority Access:</strong> If any selected managers don't join within 48 hours, you'll get their spot</li>
                <li><strong>Next Season Guarantee:</strong> Waitlist members get automatic entry to next season's league</li>
                <li><strong>Notifications:</strong> We'll email you immediately if a spot opens up</li>
              </ul>
              
              <p><strong>Want Better Odds?</strong> Upgrade to a premium tier for priority selection in future lotteries!</p>
              
              <p style="margin-top: 30px;">Keep the faith,<br><strong>The Gaffer</strong></p>
            </div>
            <div class="footer">
              <p>© 2026 premierleaguetables.com. All rights reserved.</p>
            </div>
          </div>
        </body>
        </html>
      `;

      const success = await this.sendEmail({
        to: email,
        subject: `⏳ You're on the Waitlist - Gaffer's ${tierNames[tier]}`,
        html
      });

      await this.logEmail(applicantId, 'waitlist', tier, success ? 'sent' : 'failed');

      return success;
    } catch (error) {
      // console.error('Error sending waitlist email:', error);
      return false;
    }
  }

  /**
   * Send reminder email to users who haven't joined yet
   */
  async sendReminderEmails(): Promise<{ sent: number; failed: number }> {
    // console.log('📧 Sending reminder emails...');

    // Get selections that expire in less than 24 hours and haven't joined
    const expiresIn24Hours = new Date();
    expiresIn24Hours.setHours(expiresIn24Hours.getHours() + 24);

    const { data: selections, error } = await supabase
      .from('league_selections')
      .select('*, league_applicants(*)')
      .lt('code_expires_at', expiresIn24Hours.toISOString())
      .gt('code_expires_at', new Date().toISOString())
      .is('joined_at', null)
      .eq('is_active', true);

    if (error || !selections || selections.length === 0) {
      // console.log('✅ No reminder emails to send');
      return { sent: 0, failed: 0 };
    }

    let sent = 0;
    let failed = 0;

    for (const selection of selections) {
      const applicant = selection.league_applicants;
      const hoursLeft = Math.floor(
        (new Date(selection.code_expires_at).getTime() - Date.now()) / (1000 * 60 * 60)
      );

      const html = `
        <!DOCTYPE html>
        <html>
        <body style="font-family: Arial, sans-serif; padding: 20px;">
          <div style="max-width: 600px; margin: 0 auto;">
            <h2 style="color: #dc2626;">⏰ Time is Running Out!</h2>
            <p>Hi ${applicant.name},</p>
            <p><strong>Your league code expires in ${hoursLeft} hours!</strong></p>
            <p>Don't miss your chance to join the Gaffer's ${selection.league_name}.</p>
            <div style="background: #fef3c7; border: 2px solid #f59e0b; padding: 20px; border-radius: 10px; margin: 20px 0;">
              <p style="margin: 0; font-size: 14px;"><strong>Your Code:</strong></p>
              <p style="font-size: 32px; font-weight: bold; letter-spacing: 3px; margin: 10px 0; font-family: monospace;">${selection.league_code}</p>
            </div>
            <p><a href="https://fantasy.premierleague.com/leagues/create-join" style="background: #1e40af; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; display: inline-block; font-weight: bold;">Join Now →</a></p>
            <p style="color: #6b7280; font-size: 12px; margin-top: 30px;">If you don't join within ${hoursLeft} hours, your spot will be offered to the next person on the waitlist.</p>
          </div>
        </body>
        </html>
      `;

      const success = await this.sendEmail({
        to: applicant.email,
        subject: `⏰ ${hoursLeft} Hours Left - Join the Gaffer's League!`,
        html
      });

      if (success) {
        sent++;
        await this.logEmail(applicant.id, 'reminder', selection.tier, 'sent');
      } else {
        failed++;
        await this.logEmail(applicant.id, 'reminder', selection.tier, 'failed');
      }

      await new Promise(resolve => setTimeout(resolve, 100));
    }

    // console.log(`✅ Sent ${sent} reminder emails, ${failed} failed`);
    return { sent, failed };
  }

  /**
   * Send batch emails for all lottery winners
   */
  async sendAllLotteryEmails(): Promise<void> {
    // console.log('📧 Starting batch email send for all tiers...');

    const tiers: LeagueTier[] = ['free', 'firstTeam', 'seasonPass'];

    for (const tier of tiers) {
      await this.sendAllSelectionEmails(tier);
      // Small delay between tiers
      await new Promise(resolve => setTimeout(resolve, 1000));
    }

    // console.log('✅ All lottery emails sent');
  }
}

export const leagueEmailService = new LeagueEmailService();


