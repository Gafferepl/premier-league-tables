import AWS from 'aws-sdk';
import { render } from '@react-email/render';

// AWS SES Configuration
const ses = new AWS.SES({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION || 'eu-west-1', // London region for UK
});

interface EmailOptions {
  to: string | string[];
  subject: string;
  component: React.ReactElement;
  replyTo?: string;
}

// Verify email address (required for SES)
export const verifyEmailAddress = async (email: string): Promise<void> => {
  try {
    await ses.verifyEmailIdentity({ EmailAddress: email }).promise();
    // console.log(`✅ Verification email sent to: ${email}`);
    // console.log('📧 Check your inbox and click the verification link');
  } catch (error) {
    // console.error('❌ Error verifying email:', error);
    throw error;
  }
};

// Check verification status
export const checkVerificationStatus = async (email: string): Promise<boolean> => {
  try {
    const result = await ses.getIdentityVerificationAttributes({
      Identities: [email]
    }).promise();
    
    const status = result.VerificationAttributes[email]?.VerificationStatus;
    return status === 'Success';
  } catch (error) {
    // console.error('❌ Error checking verification status:', error);
    return false;
  }
};

// Send single email
export const sendEmail = async ({ to, subject, component, replyTo }: EmailOptions): Promise<void> => {
  try {
    // Render React component to HTML
    const html = await render(component);
    
    // Prepare email parameters
    const params: AWS.SES.SendEmailRequest = {
      Source: process.env.SES_FROM_EMAIL || 'noreply@premierleaguetables.com',
      Destination: {
        ToAddresses: Array.isArray(to) ? to : [to],
      },
      Message: {
        Subject: { Data: subject },
        Body: {
          Html: { Data: html },
          Text: { Data: stripHtml(html) }, // Plain text fallback
        },
      },
      ReplyToAddresses: replyTo ? [replyTo] : [],
    };

    // Send email
    const result = await ses.sendEmail(params).promise();
    
    // console.log(`✅ Email sent successfully to: ${Array.isArray(to) ? to.join(', ') : to}`);
    // console.log(`📧 Message ID: ${result.MessageId}`);
    
  } catch (error) {
    // console.error(`❌ Failed to send email to ${to}:`, error);
    throw error;
  }
};

// Send bulk emails (SES has a limit of 50 recipients per send)
export const sendBulkEmails = async (emails: EmailOptions[]): Promise<void> => {
  // console.log(`📧 Preparing to send ${emails.length} emails via AWS SES...`);
  
  // Process emails in batches to avoid rate limits
  const batchSize = 10; // Conservative batch size
  const results = [];
  
  for (let i = 0; i < emails.length; i += batchSize) {
    const batch = emails.slice(i, i + batchSize);
    
    const batchResults = await Promise.allSettled(
      batch.map(email => sendEmail(email))
    );
    
    results.push(...batchResults);
    
    // Small delay between batches to avoid rate limiting
    if (i + batchSize < emails.length) {
      await new Promise(resolve => setTimeout(resolve, 100));
    }
  }
  
  const successful = results.filter(r => r.status === 'fulfilled').length;
  const failed = results.filter(r => r.status === 'rejected').length;
  
  // console.log(`✅ Successfully sent: ${successful} emails`);
  if (failed > 0) {
    // console.log(`❌ Failed to send: ${failed} emails`);
  }
};

// Send templated email (for even better performance)
export const sendTemplatedEmail = async ({
  to,
  templateName,
  templateData,
  subject
}: {
  to: string | string[];
  templateName: string;
  templateData: any;
  subject: string;
}): Promise<void> => {
  try {
    const params: AWS.SES.SendTemplatedEmailRequest = {
      Source: process.env.SES_FROM_EMAIL || 'noreply@premierleaguetables.com',
      Destination: {
        ToAddresses: Array.isArray(to) ? to : [to],
      },
      Template: templateName,
      TemplateData: JSON.stringify(templateData),
    };

    const result = await ses.sendTemplatedEmail(params).promise();
    // console.log(`✅ Template email sent to: ${Array.isArray(to) ? to.join(', ') : to}`);
    // console.log(`📧 Message ID: ${result.MessageId}`);
    
  } catch (error) {
    // console.error(`❌ Failed to send template email:`, error);
    throw error;
  }
};

// Get sending statistics
export const getSendingStats = async (): Promise<any> => {
  try {
    const stats = await ses.getSendStatistics().promise();
    return stats.SendDataPoints;
  } catch (error) {
    // console.error('❌ Error getting sending stats:', error);
    return null;
  }
};

// Get sending quota
export const getSendingQuota = async (): Promise<any> => {
  try {
    const quota = await ses.getSendQuota().promise();
    // console.log(`📊 SES Quota: ${quota.Max24HourSend} emails per 24 hours`);
    // console.log(`📊 Sent today: ${quota.SentLast24Hours} emails`);
    // console.log(`📊 Max send rate: ${quota.MaxSendRate} emails/second`);
    return quota;
  } catch (error) {
    // console.error('❌ Error getting quota:', error);
    return null;
  }
};

// Helper function to strip HTML for plain text fallback
const stripHtml = (html: string): string => {
  return html
    .replace(/<[^>]*>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, ' ')
    .trim();
};

// Rate limiting helper (SES has rate limits)
export const createRateLimiter = (maxEmailsPerSecond: number = 10) => {
  let lastSendTime = 0;
  let emailCount = 0;
  
  return async (emailFn: () => Promise<void>): Promise<void> => {
    const now = Date.now();
    const timeSinceLastSend = now - lastSendTime;
    
    if (timeSinceLastSend < 1000) {
      emailCount++;
      if (emailCount >= maxEmailsPerSecond) {
        const waitTime = 1000 - timeSinceLastSend;
        // console.log(`⏳ Rate limiting: waiting ${waitTime}ms...`);
        await new Promise(resolve => setTimeout(resolve, waitTime));
        emailCount = 0;
      }
    } else {
      emailCount = 1;
    }
    
    lastSendTime = Date.now();
    await emailFn();
  };
};

// Initialize SES with production settings
export const initializeSES = async (): Promise<void> => {
  try {
    // Check if from email is verified
    const fromEmail = process.env.SES_FROM_EMAIL || 'noreply@premierleaguetables.com';
    const isVerified = await checkVerificationStatus(fromEmail);
    
    if (!isVerified) {
      // console.log(`⚠️  Email ${fromEmail} is not verified yet.`);
      // console.log('📧 Please verify your email address in AWS SES console.');
      await verifyEmailAddress(fromEmail);
    } else {
      // console.log(`✅ Email ${fromEmail} is verified and ready to send.`);
    }
    
    // Get and display quota
    await getSendingQuota();
    
  } catch (error) {
    // console.error('❌ Error initializing SES:', error);
  }
};

export default {
  sendEmail,
  sendBulkEmails,
  sendTemplatedEmail,
  verifyEmailAddress,
  checkVerificationStatus,
  getSendingStats,
  getSendingQuota,
  initializeSES,
  createRateLimiter
};


