import { Html, Head, Body, Container, Section, Text, Button, Row, Column } from '@react-email/components';

interface AutoReplyEmailProps {
  name: string;
  originalSubject: string;
  replyType: 'feedback' | 'support' | 'unsubscribe' | 'other';
  userEmail: string;
}

const AutoReplyEmail = ({ name, originalSubject, replyType, userEmail }: AutoReplyEmailProps) => {
  // Content for each reply type
  const replyContent = {
    feedback: {
      subject: "Re: Your Feedback - premierleaguetables.com",
      title: "Thanks for Your Feedback! 🏆",
      message: "We really appreciate hearing from our community and your input helps us improve the Gaffer's insights and automated features.",
      actionText: "Have more suggestions?",
      actionUrl: "https://premierleaguetables.com/support",
      actionButton: "Share More Ideas"
    },
    support: {
      subject: "Re: Support Request - premierleaguetables.com", 
      title: "We're Here to Help! 🎯",
      message: "This is an automated email address, but we want to help you succeed in your FPL mini-league.",
      actionText: "Need immediate help?",
      actionUrl: "https://premierleaguetables.com/support",
      actionButton: "Get Support"
    },
    unsubscribe: {
      subject: "Re: Unsubscribe Request - premierleaguetables.com",
      title: "Sorry to See You Go! 😔", 
      message: "We're sorry to see you go! If you're having trouble unsubscribing, we're here to help manually.",
      actionText: "Ready to unsubscribe?",
      actionUrl: "https://premierleaguetables.com/unsubscribe",
      actionButton: "Unsubscribe Now"
    },
    other: {
      subject: "Re: Your Message - premierleaguetables.com",
      title: "Thanks for Reaching Out! 📧",
      message: "This is an automated email address for our FPL newsletter system. We love hearing from our community!",
      actionText: "Looking for something specific?",
      actionUrl: "https://premierleaguetables.com",
      actionButton: "Visit Site"
    }
  };

  const content = replyContent[replyType];

  return (
    <Html>
      <Head>
        <style>
          {`
            .container { max-width: 600px; margin: 0 auto; }
            .header { background: linear-gradient(135deg, #1e40af, #3b82f6); padding: 40px 30px; text-align: center; }
            .logo { font-size: 24px; font-weight: bold; color: white; margin-bottom: 20px; }
            .title { color: white; font-size: 28px; margin-bottom: 10px; }
            .subtitle { color: #e0e7ff; font-size: 16px; }
            .content { padding: 40px 30px; background: #f8fafc; }
            .feature-box { background: white; border-radius: 12px; padding: 20px; margin-bottom: 20px; border-left: 4px solid #3b82f6; }
            .feature-title { font-weight: 600; color: #1f2937; margin-bottom: 8px; }
            .feature-desc { color: #6b7280; font-size: 14px; }
            .cta-section { background: white; padding: 30px; text-align: center; border-radius: 12px; margin-top: 30px; }
            .cta-button { background: linear-gradient(135deg, #1e40af, #3b82f6); color: white; padding: 16px 32px; border-radius: 8px; text-decoration: none; font-weight: 600; display: inline-block; }
            .footer { background: #1f2937; color: white; padding: 30px; text-align: center; font-size: 12px; }
            .stats { display: flex; justify-content: space-around; margin: 30px 0; }
            .stat { text-align: center; }
            .stat-number { font-size: 24px; font-weight: bold; color: #1e40af; }
            .stat-label { font-size: 12px; color: #6b7280; }
            .reply-info { background: #fef3c7; padding: 20px; border-radius: 12px; margin: 20px 0; border-left: 4px solid #f59e0b; }
            .reply-text { color: #92400e; font-style: italic; margin-bottom: 10px; }
            .gaffer-quote { background: #f0f9ff; padding: 25px; border-radius: 12px; margin: 20px 0; border-left: 4px solid #3b82f6; }
            .gaffer-text { color: #1e40af; font-style: italic; margin-bottom: 10px; line-height: 1.6; }
            .gaffer-signature { color: #1e40af; font-weight: bold; margin: 0; }
          `}
        </style>
      </Head>
      <Body style={{ fontFamily: 'Inter, sans-serif', margin: 0, padding: 0, backgroundColor: '#f3f4f6' }}>
        <Container className="container">
          {/* Header */}
          <Section className="header">
            <div className="logo">⚽ premierleaguetables.com</div>
            <h1 className="title">{content.title}</h1>
            <p className="subtitle">The Gaffer's FPL Intelligence</p>
          </Section>

          {/* Content */}
          <Section className="content">
            {/* Reply Info */}
            <div className="reply-info">
              <h3 style={{ color: '#92400e', marginBottom: '10px' }}>📧 Your Original Message:</h3>
              <p className="reply-text">"{originalSubject}"</p>
              <p style={{ color: '#92400e', fontSize: '12px', margin: '5px 0 0 0' }}>
                Reply from: {userEmail}
              </p>
            </div>

            {/* Main Message */}
            <div className="feature-box">
              <h3 className="feature-title">Hi {name},</h3>
              <p className="feature-desc" style={{ fontSize: '16px', lineHeight: '1.6', marginBottom: '20px' }}>
                {content.message}
              </p>
              
              {/* Stats Section */}
              <div className="stats">
                <div className="stat">
                  <div className="stat-number">50K+</div>
                  <div className="stat-label">Active Managers</div>
                </div>
                <div className="stat">
                  <div className="stat-number">89%</div>
                  <div className="stat-label">Mini-League Wins</div>
                </div>
                <div className="stat">
                  <div className="stat-number">4.8★</div>
                  <div className="stat-label">User Rating</div>
                </div>
              </div>
            </div>

            {/* Gaffer's Quote */}
            <div className="gaffer-quote">
              <h3 style={{ color: '#1e40af', marginBottom: '10px' }}>🗣️ The Gaffer Says:</h3>
              <p className="gaffer-text">
                {replyType === 'feedback' && 
                  "Brilliant feedback! That's exactly what helps us improve. Keep those insights coming - that's how we stay ahead of the competition!"
                }
                {replyType === 'support' && 
                  "Don't worry about technical issues! We've got your back. Every manager deserves a fair shot at mini-league glory!"
                }
                {replyType === 'unsubscribe' && 
                  "Sad to see you go, but I understand! Sometimes you need a break. The door's always open when you're ready to dominate again!"
                }
                {replyType === 'other' && 
                  "Great to hear from you! The community is what makes this special. Keep pushing those mini-league boundaries!"
                }
              </p>
              <p className="gaffer-signature">— The Gaffer</p>
            </div>

            {/* Action Section */}
            <div className="cta-section">
              <h3 style={{ color: '#1f2937', marginBottom: '10px' }}>{content.actionText}</h3>
              <p style={{ color: '#6b7280', marginBottom: '20px' }}>
                Keep dominating those mini-leagues with our expert insights!
              </p>
              <Button href={content.actionUrl} className="cta-button">
                {content.actionButton}
              </Button>
            </div>

            {/* Additional Resources */}
            <div className="feature-box">
              <h3 className="feature-title">🎯 Quick Links:</h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginTop: '15px' }}>
                <div>
                  <p style={{ margin: '0 0 5px 0' }}>
                    <a href="https://premierleaguetables.com" style={{ color: '#3b82f6', textDecoration: 'none', fontWeight: '600' }}>
                      🏠 Home Page
                    </a>
                  </p>
                  <p style={{ margin: '0', fontSize: '12px', color: '#6b7280' }}>
                    All FPL insights
                  </p>
                </div>
                <div>
                  <p style={{ margin: '0 0 5px 0' }}>
                    <a href="https://premierleaguetables.com/support" style={{ color: '#3b82f6', textDecoration: 'none', fontWeight: '600' }}>
                      💬 Support Center
                    </a>
                  </p>
                  <p style={{ margin: '0', fontSize: '12px', color: '#6b7280' }}>
                    Get help fast
                  </p>
                </div>
                <div>
                  <p style={{ margin: '0 0 5px 0' }}>
                    <a href="https://premierleaguetables.com/pricing" style={{ color: '#3b82f6', textDecoration: 'none', fontWeight: '600' }}>
                      ⭐ Upgrade Options
                    </a>
                  </p>
                  <p style={{ margin: '0', fontSize: '12px', color: '#6b7280' }}>
                    Get competitive edge
                  </p>
                </div>
                <div>
                  <p style={{ margin: '0 0 5px 0' }}>
                    <a href="https://premierleaguetables.com/guide" style={{ color: '#3b82f6', textDecoration: 'none', fontWeight: '600' }}>
                    📚 FPL Guide
                    </a>
                  </p>
                  <p style={{ margin: '0', fontSize: '12px', color: '#6b7280' }}>
                    Learn strategies
                  </p>
                </div>
              </div>
            </div>
          </Section>

          {/* Footer */}
          <Section className="footer">
            <p>© 2026 premierleaguetables.com. All rights reserved.</p>
            <p style={{ marginTop: '10px' }}>
              <a href="#" style={{ color: '#9ca3af', textDecoration: 'none', margin: '0 10px' }}>Privacy</a>
              <a href="#" style={{ color: '#9ca3af', textDecoration: 'none', margin: '0 10px' }}>Terms</a>
              <a href="#" style={{ color: '#9ca3af', textDecoration: 'none', margin: '0 10px' }}>Unsubscribe</a>
            </p>
            <p style={{ marginTop: '15px', fontSize: '11px', color: '#6b7280' }}>
              This is an automated response. For human support, visit premierleaguetables.com/support
            </p>
            <p style={{ marginTop: '10px', fontSize: '11px', color: '#6b7280' }}>
              You replied to: "{originalSubject}" from {userEmail}
            </p>
          </Section>
        </Container>
      </Body>
    </Html>
  );
};

export default AutoReplyEmail;


