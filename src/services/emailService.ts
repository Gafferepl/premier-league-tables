import { render } from '@react-email/render';

interface EmailOptions {
  to: string;
  subject: string;
  component: React.ReactElement;
}

// Mock email service - replace with real email service like SendGrid, Mailgun, or Resend
export const sendEmail = async ({ to, subject, component }: EmailOptions): Promise<void> => {
  try {
    // Render the React component to HTML
    const html = await render(component);
    
    // Log the email details (in production, this would send via email service)
    // console.log(`📧 Email prepared for: ${to}`);
    // console.log(`📋 Subject: ${subject}`);
    // console.log(`📄 HTML length: ${html.length} characters`);
    
    // MOCK: In production, replace this with actual email service integration
    // Examples:
    // 
    // Using SendGrid:
    // await sendgrid.send({
    //   to,
    //   from: 'noreply@premierleaguetables.com',
    //   subject,
    //   html
    // });
    //
    // Using Resend:
    // await resend.emails.send({
    //   from: 'noreply@premierleaguetables.com',
    //   to,
    //   subject,
    //   html
    // });
    //
    // Using Mailgun:
    // await mailgun.messages.create('premierleaguetables.com', {
    //   to,
    //   subject,
    //   html
    // });
    
    // For now, we'll just simulate the send
    await new Promise(resolve => setTimeout(resolve, 100)); // Simulate network delay
    
    // console.log(`✅ Email successfully sent to ${to}`);
    
  } catch (error) {
    // console.error(`❌ Failed to send email to ${to}:`, error);
    throw error;
  }
};

// Bulk email sending for efficiency
export const sendBulkEmails = async (emails: EmailOptions[]): Promise<void> => {
  // console.log(`📧 Preparing to send ${emails.length} emails...`);
  
  const results = await Promise.allSettled(
    emails.map(email => sendEmail(email))
  );
  
  const successful = results.filter(r => r.status === 'fulfilled').length;
  const failed = results.filter(r => r.status === 'rejected').length;
  
  // console.log(`✅ Successfully sent: ${successful} emails`);
  if (failed > 0) {
    // console.log(`❌ Failed to send: ${failed} emails`);
  }
};

// Email validation helper
export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Rate limiting helper (to avoid spam filters)
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

// Template helper for consistent email structure
export const createEmailTemplate = (content: string) => `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Premier League Tables</title>
  </head>
  <body style="font-family: Inter, sans-serif; margin: 0; padding: 0; background: #f3f4f6;">
    ${content}
  </body>
  </html>
`;

// Email tracking helper (for open/click tracking)
export const addTrackingParams = (url: string, campaign: string): string => {
  const trackingUrl = new URL(url);
  trackingUrl.searchParams.set('utm_source', 'email');
  trackingUrl.searchParams.set('utm_medium', 'newsletter');
  trackingUrl.searchParams.set('utm_campaign', campaign);
  return trackingUrl.toString();
};

export default {
  sendEmail,
  sendBulkEmails,
  validateEmail,
  createRateLimiter,
  createEmailTemplate,
  addTrackingParams
};


