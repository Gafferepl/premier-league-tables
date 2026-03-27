import { Html, Head, Body, Container, Section, Text, Button } from '@react-email/components';

const CancellationEmail = ({ name, plan, cancellationDate, refundInfo }: { name: string; plan: string; cancellationDate: string; refundInfo: string }) => (
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
          .sad-icon { font-size: 48px; color: #6b7280; text-align: center; margin-bottom: 20px; }
          .cancellation-details { background: white; padding: 25px; border-radius: 12px; margin: 20px 0; border-left: 4px solid #6b7280; }
          .detail-row { display: flex; justify-content: space-between; margin-bottom: 10px; }
          .detail-label { color: #6b7280; font-size: 14px; }
          .detail-value { color: #1f2937; font-weight: 600; }
          .whats-next { background: #f0f9ff; padding: 25px; border-radius: 12px; margin: 20px 0; border-left: 4px solid #3b82f6; }
          .next-item { display: flex; align-items: flex-start; margin-bottom: 15px; }
          .next-icon { color: #3b82f6; margin-right: 15px; font-size: 18px; flex-shrink: 0; }
          .next-text { color: #1f2937; }
          .come-back { background: linear-gradient(135deg, #f59e0b, #f97316); color: white; padding: 25px; border-radius: 12px; margin: 20px 0; text-align: center; }
          .come-back-button { background: white; color: #f59e0b; padding: 16px 32px; border-radius: 8px; text-decoration: none; font-weight: 600; display: inline-block; }
          .feedback-section { background: #fef2f2; padding: 25px; border-radius: 12px; margin: 20px 0; border-left: 4px solid #ef4444; }
          .footer { background: #1f2937; color: white; padding: 30px; text-align: center; font-size: 12px; }
        `}
      </style>
    </Head>
    <Body style={{ fontFamily: 'Inter, sans-serif', margin: 0, padding: 0, backgroundColor: '#f3f4f6' }}>
      <Container className="container">
        {/* Header */}
        <Section className="header">
          <div className="logo">⚽ premierleaguetables.com</div>
          <div className="sad-icon">😔</div>
          <h1 className="title">We're Sorry to See You Go</h1>
          <p className="subtitle">Your {plan} subscription has been cancelled</p>
        </Section>

        {/* Content */}
        <Section className="content">
          {/* Cancellation Message */}
          <div style={{ textAlign: 'center', marginBottom: '30px' }}>
            <h2 style={{ color: '#1f2937', marginBottom: '10px' }}>Goodbye for now, {name}</h2>
            <p style={{ color: '#6b7280' }}>We're sad to see you leave, but we understand. Thanks for being part of the Hub!</p>
          </div>

          {/* Cancellation Details */}
          <div className="cancellation-details">
            <h3 style={{ color: '#1f2937', marginBottom: '15px' }}>Cancellation Details</h3>
            <div className="detail-row">
              <span className="detail-label">Cancelled Plan</span>
              <span className="detail-value">{plan}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Cancellation Date</span>
              <span className="detail-value">{cancellationDate}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Access Until</span>
              <span className="detail-value">{refundInfo}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Status</span>
              <span className="detail-value" style={{ color: '#6b7280' }}>🔄 Cancelled</span>
            </div>
          </div>

          {/* What's Next */}
          <div className="whats-next">
            <h3 style={{ color: '#1f2937', marginBottom: '15px' }}>What Happens Next?</h3>
            <div className="next-item">
              <div className="next-icon">📅</div>
              <div className="next-text">
                <strong>Access Period</strong><br />
                You'll keep premium access until the end of your current billing period
              </div>
            </div>
            <div className="next-item">
              <div className="next-icon">💾</div>
              <div className="next-text">
                <strong>Data Preservation</strong><br />
                Your account data and preferences will be saved for 90 days
              </div>
            </div>
            <div className="next-item">
              <div className="next-icon">📧</div>
              <div className="next-text">
                <strong>Email Preferences</strong>
                <br />
                You'll only receive essential account emails (no marketing)
              </div>
            </div>
          </div>

          {/* Come Back Section */}
          <div className="come-back">
            <h3 style={{ marginBottom: '10px' }}>🏆 Changed Your Mind?</h3>
            <p style={{ marginBottom: '20px' }}>
              We'd love to have you back! Reactivate anytime and pick up where you left off.
            </p>
            <Button href="https://premierleaguehub.com/reactivate" className="come-back-button">
              Reactivate Subscription
            </Button>
            <p style={{ fontSize: '12px', marginTop: '15px', color: '#fef3c7' }}>
              Special welcome back offer: 20% off your first month
            </p>
          </div>

          {/* Feedback Section */}
          <div className="feedback-section">
            <h3 style={{ color: '#991b1b', marginBottom: '15px' }}>💬 Help Us Improve</h3>
            <p style={{ color: '#7f1d1d', fontSize: '14px', marginBottom: '15px' }}>
              Your feedback helps us make premierleaguetables.com better for everyone. 
              What made you decide to cancel?
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <Button href="https://premierleaguehub.com/feedback/price" style={{ color: '#ef4444', textDecoration: 'none', fontSize: '14px' }}>
                Price too high
              </Button>
              <Button href="https://premierleaguehub.com/feedback/features" style={{ color: '#ef4444', textDecoration: 'none', fontSize: '14px' }}>
                Missing features
              </Button>
              <Button href="https://premierleaguehub.com/feedback/alternative" style={{ color: '#ef4444', textDecoration: 'none', fontSize: '14px' }}>
                Found alternative service
              </Button>
              <Button href="https://premierleaguehub.com/feedback/other" style={{ color: '#ef4444', textDecoration: 'none', fontSize: '14px' }}>
                Other reason
              </Button>
            </div>
          </div>

          {/* Free Account Info */}
          <div style={{ textAlign: 'center', marginTop: '30px', padding: '20px', background: 'white', borderRadius: '12px' }}>
            <h4 style={{ color: '#1f2937', marginBottom: '10px' }}>Your Free Account</h4>
            <p style={{ color: '#6b7280', fontSize: '14px', marginBottom: '15px' }}>
              You can continue using our free features with basic analytics and community access.
            </p>
            <Button href="https://premierleaguehub.com/dashboard" style={{ color: '#3b82f6', textDecoration: 'none' }}>
              Continue with Free Account
            </Button>
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
        </Section>
      </Container>
    </Body>
  </Html>
);

export default CancellationEmail;


