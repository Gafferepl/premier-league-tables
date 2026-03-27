import { Html, Head, Body, Container, Section, Text, Button } from '@react-email/components';

const UnsubscribeConfirmation = ({ email, unsubscribeDate }: { email: string; unsubscribeDate: string }) => (
  <Html>
    <Head>
      <style>
        {`
          .container { max-width: 600px; margin: 0 auto; }
          .header { background: linear-gradient(135deg, #6b7280, #4b5563); padding: 40px 30px; text-align: center; }
          .logo { font-size: 24px; font-weight: bold; color: white; margin-bottom: 20px; }
          .title { color: white; font-size: 28px; margin-bottom: 10px; }
          .subtitle { color: #e5e7eb; font-size: 16px; }
          .content { padding: 40px 30px; background: #f8fafc; }
          .success-icon { font-size: 48px; color: #10b981; text-align: center; margin-bottom: 20px; }
          .confirmation-details { background: white; padding: 25px; border-radius: 12px; margin: 20px 0; border-left: 4px solid #10b981; }
          .detail-row { display: flex; justify-content: space-between; margin-bottom: 10px; }
          .detail-label { color: #6b7280; font-size: 14px; }
          .detail-value { color: #1f2937; font-weight: 600; }
          .important-section { background: #fef3c7; padding: 25px; border-radius: 12px; margin: 20px 0; border-left: 4px solid #f59e0b; }
          .important-item { display: flex; align-items: flex-start; margin-bottom: 15px; }
          .important-icon { color: #f59e0b; margin-right: 15px; font-size: 18px; flex-shrink: 0; }
          .important-text { color: '#92400e'; }
          .come-back { background: linear-gradient(135deg, #3b82f6, #1e40af); color: white; padding: 25px; border-radius: 12px; margin: 20px 0; text-align: center; }
          .resubscribe-button { background: white; color: #3b82f6; padding: 16px 32px; border-radius: 8px; text-decoration: none; font-weight: 600; display: inline-block; }
          .footer { background: #1f2937; color: white; padding: 30px; text-align: center; font-size: 12px; }
        `}
      </style>
    </Head>
    <Body style={{ fontFamily: 'Inter, sans-serif', margin: 0, padding: 0, backgroundColor: '#f3f4f6' }}>
      <Container className="container">
        {/* Header */}
        <Section className="header">
          <div className="logo">⚽ premierleaguetables.com</div>
          <div className="success-icon">✅</div>
          <h1 className="title">Successfully Unsubscribed</h1>
          <p className="subtitle">You've been removed from our marketing emails</p>
        </Section>

        {/* Content */}
        <Section className="content">
          {/* Confirmation Message */}
          <div style={{ textAlign: 'center', marginBottom: '30px' }}>
            <h2 style={{ color: '#1f2937', marginBottom: '10px' }}>You're All Set!</h2>
            <p style={{ color: '#6b7280' }}>
              We've successfully removed {email} from all marketing communications.
            </p>
          </div>

          {/* Confirmation Details */}
          <div className="confirmation-details">
            <h3 style={{ color: '#1f2937', marginBottom: '15px' }}>Unsubscription Details</h3>
            <div className="detail-row">
              <span className="detail-label">Email Address</span>
              <span className="detail-value">{email}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Unsubscribe Date</span>
              <span className="detail-value">{unsubscribeDate}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Marketing Emails</span>
              <span className="detail-value" style={{ color: '#10b981' }}>❌ Stopped</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Account Status</span>
              <span className="detail-value">Unchanged</span>
            </div>
          </div>

          {/* Important Information */}
          <div className="important-section">
            <h3 style={{ color: '#92400e', marginBottom: '15px' }}>📧 Important: What You'll Still Receive</h3>
            <div className="important-item">
              <div className="important-icon">🔐</div>
              <div className="important-text">
                <strong>Account-related emails</strong><br />
                Password resets, login alerts, security notifications
              </div>
            </div>
            <div className="important-item">
              <div className="important-icon">💳</div>
              <div className="important-text">
                <strong>Billing emails</strong><br />
                Payment confirmations, invoices, subscription updates
              </div>
            </div>
            <div className="important-item">
              <div className="important-icon">⚠️</div>
              <div className="important-text">
                <strong>Service announcements</strong><br />
                Critical updates, maintenance notices, policy changes
              </div>
            </div>
          </div>

          {/* Come Back Section */}
          <div className="come-back">
            <h3 style={{ marginBottom: '10px' }}>🔄 Changed Your Mind?</h3>
            <p style={{ marginBottom: '20px' }}>
              Miss our FPL insights and tips? You can resubscribe anytime with one click!
            </p>
            <Button href="https://premierleaguehub.com/resubscribe?email={email}" className="resubscribe-button">
              Resubscribe Now
            </Button>
            <p style={{ fontSize: '12px', marginTop: '15px', color: '#dbeafe' }}>
              No spam, ever. Just quality FPL content to help you win your mini-league.
            </p>
          </div>

          {/* Alternative Options */}
          <div style={{ background: '#f0f9ff', padding: '25px', borderRadius: '12px', margin: '20px 0', borderLeft: '4px solid #3b82f6' }}>
            <h3 style={{ color: '#1e3a8a', marginBottom: '15px' }}>🎯 Prefer Different Content?</h3>
            <p style={{ color: '#1e3a8a', fontSize: '14px', marginBottom: '15px' }}>
              You can customize what you receive instead of unsubscribing completely:
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <Button href="https://premierleaguehub.com/preferences/weekly-only" style={{ color: '#3b82f6', textDecoration: 'none', fontSize: '14px' }}>
                Weekly digest only
              </Button>
              <Button href="https://premierleaguehub.com/preferences/premium-tips" style={{ color: '#3b82f6', textDecoration: 'none', fontSize: '14px' }}>
                Premium tips only
              </Button>
              <Button href="https://premierleaguehub.com/preferences/major-updates" style={{ color: '#3b82f6', textDecoration: 'none', fontSize: '14px' }}>
                Major updates only
              </Button>
            </div>
          </div>

          {/* Final Message */}
          <div style={{ textAlign: 'center', marginTop: '30px', padding: '20px', background: 'white', borderRadius: '12px' }}>
            <h4 style={{ color: '#1f2937', marginBottom: '10px' }}>Thank You for Being Part of the Hub!</h4>
            <p style={{ color: '#6b7280', fontSize: '14px' }}>
              We hope our FPL insights helped you in your fantasy journey. 
              Your account remains active if you ever want to return.
            </p>
            <div style={{ marginTop: '15px' }}>
              <Button href="https://premierleaguetables.com" style={{ color: '#3b82f6', textDecoration: 'none' }}>
                Visit premierleaguetables.com
              </Button>
            </div>
          </div>
        </Section>

        {/* Footer */}
        <Section className="footer">
          <p>© 2026 premierleaguetables.com. All rights reserved.</p>
          <p style={{ marginTop: '10px' }}>
            <a href="#" style={{ color: '#9ca3af', textDecoration: 'none', margin: '0 10px' }}>Privacy</a>
            <a href="#" style={{ color: '#9ca3af', textDecoration: 'none', margin: '0 10px' }}>Terms</a>
            <a href="#" style={{ color: '#9ca3af', textDecoration: 'none', margin: '0 10px' }}>Contact Us</a>
          </p>
          <p style={{ marginTop: '10px', fontSize: '10px', color: '#6b7280' }}>
            premierleaguetables.com, 123 Football Lane, London, UK
          </p>
        </Section>
      </Container>
    </Body>
  </Html>
);

export default UnsubscribeConfirmation;


