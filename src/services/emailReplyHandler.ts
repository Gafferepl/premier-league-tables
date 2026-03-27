import AWS from 'aws-sdk';
import { render } from '@react-email/render';
import AutoReplyEmail from '../emails/AutoReplyEmail';

// Configure AWS SES for receiving emails
const ses = new AWS.SES({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION || 'eu-west-1',
});

// Configure AWS S3 for storing received emails
const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION || 'eu-west-1',
});

interface EmailReply {
  messageId: string;
  from: string;
  subject: string;
  content: string;
  timestamp: Date;
  type: 'feedback' | 'support' | 'unsubscribe' | 'other';
}

// Auto-reply subjects (content is now handled by themed templates)
const AUTO_REPLY_SUBJECTS = {
  feedback: "Re: Your Feedback - premierleaguetables.com",
  support: "Re: Support Request - premierleaguetables.com",
  unsubscribe: "Re: Unsubscribe Request - premierleaguetables.com",
  other: "Re: Your Message - premierleaguetables.com"
};

// Classify email type based on content
const classifyEmailType = (subject: string, content: string): EmailReply['type'] => {
  const lowerSubject = subject.toLowerCase();
  const lowerContent = content.toLowerCase();
  
  // Check for unsubscribe requests
  if (lowerSubject.includes('unsubscribe') || 
      lowerContent.includes('unsubscribe') ||
      lowerContent.includes('remove me') ||
      lowerContent.includes('stop sending')) {
    return 'unsubscribe';
  }
  
  // Check for support requests
  if (lowerSubject.includes('help') || 
      lowerSubject.includes('support') ||
      lowerSubject.includes('issue') ||
      lowerSubject.includes('problem') ||
      lowerContent.includes('help me') ||
      lowerContent.includes('not working')) {
    return 'support';
  }
  
  // Check for feedback
  if (lowerSubject.includes('feedback') || 
      lowerSubject.includes('suggestion') ||
      lowerSubject.includes('idea') ||
      lowerContent.includes('think you should') ||
      lowerContent.includes('would be better if')) {
    return 'feedback';
  }
  
  return 'other';
};

// Send auto-reply with themed template
const sendAutoReply = async (to: string, originalSubject: string, emailType: EmailReply['type']): Promise<void> => {
  try {
    // Extract user name from email (before @ symbol)
    const userName = to.split('@')[0];
    
    // Create the themed auto-reply email
    const emailComponent = AutoReplyEmail({
      name: userName.charAt(0).toUpperCase() + userName.slice(1), // Capitalize first letter
      originalSubject,
      replyType: emailType,
      userEmail: to
    });
    
    // Render the React component to HTML
    const html = await render(emailComponent);
    
    const params = {
      Source: process.env.SES_FROM_EMAIL || 'newsletter@premierleaguetables.com',
      Destination: {
        ToAddresses: [to],
      },
      Message: {
        Subject: { Data: AUTO_REPLY_SUBJECTS[emailType] },
        Body: {
          Html: { Data: html },
          Text: { Data: `Hi ${userName},\n\nThanks for your message to premierleaguetables.com!\n\nThis is an automated response. For human support, visit premierleaguetables.com/support\n\nYou replied to: "${originalSubject}"\n\nThe Gaffer Team\n⚽ premierleaguetables.com` },
        },
      },
      ReplyToAddresses: [], // Don't allow replies to auto-replies
    };

    await ses.sendEmail(params).promise();
    // console.log(`✅ Themed auto-reply sent to ${to} for ${emailType}`);
    
  } catch (error) {
    // console.error('❌ Error sending auto-reply:', error);
  }
};

// Process incoming email from S3
const processIncomingEmail = async (s3Bucket: string, s3Key: string): Promise<void> => {
  try {
    // Get email from S3
    const s3Object = await s3.getObject({ Bucket: s3Bucket, Key: s3Key }).promise();
    const emailContent = s3Object.Body?.toString();
    
    if (!emailContent) {
      // console.log('❌ Empty email content');
      return;
    }
    
    // Parse email (basic parsing - you might want a more sophisticated parser)
    const lines = emailContent.split('\n');
    let from = '';
    let subject = '';
    let contentStart = false;
    let content = '';
    
    for (const line of lines) {
      if (line.startsWith('From:')) {
        from = line.replace('From:', '').trim();
      } else if (line.startsWith('Subject:')) {
        subject = line.replace('Subject:', '').trim();
      } else if (line === '' && !contentStart) {
        contentStart = true;
      } else if (contentStart) {
        content += line + '\n';
      }
    }
    
    // Clean up the from address
    const cleanFrom = from.replace(/<.*>/, '').trim();
    
    // Classify email type
    const emailType = classifyEmailType(subject, content);
    
    // Log the reply
    const reply: EmailReply = {
      messageId: s3Key,
      from: cleanFrom,
      subject,
      content,
      timestamp: new Date(),
      type: emailType,
    };
    
    // console.log(`📧 Received ${emailType} email from ${cleanFrom}: ${subject}`);
    
    // Send auto-reply (but don't reply to auto-replies or bounces)
    if (!from.includes('noreply') && !from.includes('auto-reply') && !subject.includes('Auto-Reply')) {
      await sendAutoReply(cleanFrom, subject, emailType);
    }
    
    // Store reply for analysis (optional)
    await storeReplyForAnalysis(reply);
    
  } catch (error) {
    // console.error('❌ Error processing incoming email:', error);
  }
};

// Store reply for analysis (you could store in database)
const storeReplyForAnalysis = async (reply: EmailReply): Promise<void> => {
  try {
    // Here you would typically store in your database
    // For now, just log it
    // console.log(`📊 Reply Analytics:`);
    // console.log(`   Type: ${reply.type}`);
    // console.log(`   From: ${reply.from}`);
    // console.log(`   Subject: ${reply.subject}`);
    // console.log(`   Time: ${reply.timestamp}`);
    
    // You could also store in a simple file or database table
    // This helps you understand what users are asking about
    
  } catch (error) {
    // console.error('❌ Error storing reply:', error);
  }
};

// Set up SES receipt rule (one-time setup)
const setupEmailReceiving = async (): Promise<void> => {
  try {
    // Create S3 bucket for email storage (if it doesn't exist)
    const bucketName = 'premier-league-email-replies';
    
    // Create receipt rule set
    await ses.createReceiptRuleSet({
      RuleSetName: 'premier-league-replies'
    }).promise();
    
    // Create receipt rule
    await ses.createReceiptRule({
      RuleSetName: 'premier-league-replies',
      Rule: {
        Name: 'store-emails',
        Enabled: true,
        Actions: [
          {
            S3Action: {
              BucketName: bucketName,
              ObjectKeyPrefix: 'emails/',
            },
          },
        ],
        Recipients: ['newsletter@premierleaguetables.com'],
      },
    }).promise();
    
    // console.log('✅ Email receiving setup complete');
    
  } catch (error) {
    // console.error('❌ Error setting up email receiving:', error);
  }
};

// Get reply analytics
const getReplyAnalytics = async (): Promise<any> => {
  try {
    // This would typically query your database
    // For now, return mock analytics
    return {
      totalReplies: 0,
      replyTypes: {
        feedback: 0,
        support: 0,
        unsubscribe: 0,
        other: 0,
      },
      recentReplies: [],
    };
  } catch (error) {
    // console.error('❌ Error getting analytics:', error);
    return null;
  }
};

// Manual reply handler (for testing)
const handleManualReply = async (from: string, subject: string, content: string): Promise<void> => {
  const emailType = classifyEmailType(subject, content);
  await sendAutoReply(from, subject, emailType);
};

export {
  processIncomingEmail,
  setupEmailReceiving,
  sendAutoReply,
  getReplyAnalytics,
  handleManualReply,
  classifyEmailType,
};

export default {
  processIncomingEmail,
  setupEmailReceiving,
  sendAutoReply,
  getReplyAnalytics,
  handleManualReply,
};


