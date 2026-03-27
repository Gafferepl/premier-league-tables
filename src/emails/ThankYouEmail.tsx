import { Html, Head, Body, Container, Section, Text, Button } from '@react-email/components';

const ThankYouEmail = ({ name, amount, plan, nextBilling }: { name: string; amount: string; plan: string; nextBilling: string }) => (
  <Html>
    <Head>
      <style>
        {`
          .container { max-width: 600px; margin: 0 auto; }
          .header { background: linear-gradient(135deg, #10b981, #059669); padding: 40px 30px; text-align: center; }
          .logo { font-size: 24px; font-weight: bold; color: white; margin-bottom: 20px; }
          .title { color: white; font-size: 28px; margin-bottom: 10px; }
          .subtitle { color: #d1fae5; font-size: 16px; }
          .content { padding: 40px 30px; background: #f8fafc; }
          .success-icon { font-size: 48px; color: #10b981; text-align: center; margin-bottom: 20px; }
          .payment-details { background: white; padding: 25px; border-radius: 12px; margin: 20px 0; border-left: 4px solid #10b981; }
          .detail-row { display: flex; justify-content: space-between; margin-bottom: 10px; }
          .detail-label { color: #6b7280; font-size: 14px; }
          .detail-value { color: #1f2937; font-weight: 600; }
          .next-steps { background: #f0f9ff; padding: 25px; border-radius: 12px; margin: 20px 0; border-left: 4px solid #3b82f6; }
          .step-item { display: flex; align-items: center; margin-bottom: 15px; }
          .step-number { background: #3b82f6; color: white; width: 24px; height: 24px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: bold; margin-right: 15px; font-size: 12px; }
          .step-text { color: #1f2937; }
          .dashboard-button { background: linear-gradient(135deg, #1e40af, #3b82f6); color: white; padding: 16px 32px; border-radius: 8px; text-decoration: none; font-weight: 600; display: inline-block; text-align: center; }
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
          <h1 className="title">Payment Successful!</h1>
          <p className="subtitle">Welcome to the elite side of FPL management</p>
        </Section>

        {/* Content */}
        <Section className="content">
          {/* Thank You Message */}
          <div style={{ textAlign: 'center', marginBottom: '30px' }}>
            <h2 style={{ color: '#1f2937', marginBottom: '10px' }}>Thank you, {name}!</h2>
            <p style={{ color: '#6b7280' }}>Your {plan} subscription is now active. You're ready to start dominating your mini-league!</p>
          </div>

          {/* Payment Details */}
          <div className="payment-details">
            <h3 style={{ color: '#1f2937', marginBottom: '15px' }}>Payment Details</h3>
            <div className="detail-row">
              <span className="detail-label">Plan</span>
              <span className="detail-value">{plan}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Amount</span>
              <span className="detail-value">{amount}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Next Billing</span>
              <span className="detail-value">{nextBilling}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Status</span>
              <span className="detail-value" style={{ color: '#10b981' }}>✅ Active</span>
            </div>
          </div>

          {/* Next Steps */}
          <div className="next-steps">
            <h3 style={{ color: '#1f2937', marginBottom: '15px' }}>What's Next?</h3>
            <div className="step-item">
              <div className="step-number">1</div>
              <div className="step-text">Access your premium dashboard with advanced analytics</div>
            </div>
            <div className="step-item">
              <div className="step-number">2</div>
              <div className="step-text">Set up your custom FPL team preferences</div>
            </div>
            <div className="step-item">
              <div className="step-number">3</div>
              <div className="step-text">Explore AI-powered recommendations</div>
            </div>
            <div className="step-item">
              <div className="step-number">4</div>
              <div className="step-text">Join our premium community Discord</div>
            </div>
          </div>

          {/* Dashboard CTA */}
          <div style={{ textAlign: 'center', marginTop: '30px' }}>
            <Button href="https://premierleaguehub.com/dashboard" className="dashboard-button">
              Go to Premium Dashboard
            </Button>
          </div>

          {/* Support Info */}
          <div style={{ textAlign: 'center', marginTop: '30px', padding: '20px', background: 'white', borderRadius: '12px' }}>
            <h4 style={{ color: '#1f2937', marginBottom: '10px' }}>Questions About Your Subscription?</h4>
            <p style={{ color: '#6b7280', fontSize: '14px', marginBottom: '15px' }}>
              Manage your subscription, view billing history, or contact support anytime.
            </p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '15px' }}>
              <Button href="https://premierleaguehub.com/account" style={{ color: '#3b82f6', textDecoration: 'none', fontSize: '14px' }}>
                Manage Account
              </Button>
              <Button href="mailto:info@premierleaguetables.com" style={{ color: '#3b82f6', textDecoration: 'none', fontSize: '14px' }}>
                Contact Support
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
            <a href="#" style={{ color: '#9ca3af', textDecoration: 'none', margin: '0 10px' }}>Billing Support</a>
          </p>
        </Section>
      </Container>
    </Body>
  </Html>
);

export default ThankYouEmail;


