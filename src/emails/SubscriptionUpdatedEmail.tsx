import { Html, Head, Body, Container, Section, Button } from '@react-email/components';

interface SubscriptionUpdatedEmailProps {
  name: string;
  oldPlan: string;
  newPlan: string;
  changeType: 'upgrade' | 'downgrade';
  effectiveDate: string;
  newPrice: string;
  nextBilling: string;
}

const SubscriptionUpdatedEmail = ({ name, oldPlan, newPlan, changeType, effectiveDate, newPrice, nextBilling }: SubscriptionUpdatedEmailProps) => (
  <Html>
    <Head>
      <style>
        {`
          .container { max-width: 600px; margin: 0 auto; }
          .header { background: linear-gradient(135deg, ${changeType === 'upgrade' ? '#10b981, #059669' : '#f59e0b, #f97316'}); padding: 40px 30px; text-align: center; }
          .logo { font-size: 24px; font-weight: bold; color: white; margin-bottom: 20px; }
          .title { color: white; font-size: 28px; margin-bottom: 10px; }
          .subtitle { color: ${changeType === 'upgrade' ? '#d1fae5' : '#fef3c7'}; font-size: 16px; }
          .content { padding: 40px 30px; background: #f8fafc; }
          .change-box { background: white; border-radius: 12px; padding: 30px; margin: 20px 0; border-left: 4px solid ${changeType === 'upgrade' ? '#10b981' : '#f59e0b'}; }
          .plan-change { display: flex; align-items: center; justify-content: center; gap: 20px; margin: 25px 0; }
          .plan-badge { padding: 12px 24px; border-radius: 8px; font-weight: 600; font-size: 16px; }
          .old-plan { background: #f3f4f6; color: #6b7280; }
          .new-plan { background: ${changeType === 'upgrade' ? '#d1fae5' : '#fef3c7'}; color: ${changeType === 'upgrade' ? '#065f46' : '#92400e'}; }
          .arrow { font-size: 24px; color: ${changeType === 'upgrade' ? '#10b981' : '#f59e0b'}; }
          .detail-row { display: flex; justify-content: space-between; margin-bottom: 15px; padding: 15px; background: #f9fafb; border-radius: 8px; }
          .detail-label { color: #6b7280; font-size: 14px; }
          .detail-value { color: #1f2937; font-weight: 600; }
          .features-box { background: ${changeType === 'upgrade' ? '#f0fdf4' : '#fef3c7'}; padding: 25px; border-radius: 12px; margin: 20px 0; border-left: 4px solid ${changeType === 'upgrade' ? '#10b981' : '#f59e0b'}; }
          .feature-item { display: flex; align-items: start; margin-bottom: 12px; }
          .feature-icon { margin-right: 10px; font-size: 18px; }
          .footer { background: #1f2937; color: white; padding: 30px; text-align: center; font-size: 12px; }
        `}
      </style>
    </Head>
    <Body style={{ fontFamily: 'Inter, sans-serif', margin: 0, padding: 0, backgroundColor: '#f3f4f6' }}>
      <Container className="container">
        {/* Header */}
        <Section className="header">
          <div className="logo">⚽ premierleaguetables.com</div>
          <h1 className="title">
            {changeType === 'upgrade' ? '🎉 Subscription Upgraded!' : '📋 Subscription Updated'}
          </h1>
          <p className="subtitle">Your plan has been successfully changed</p>
        </Section>

        {/* Content */}
        <Section className="content">
          <div style={{ textAlign: 'center', marginBottom: '30px' }}>
            <h2 style={{ color: '#1f2937', marginBottom: '10px' }}>Hi {name}!</h2>
            <p style={{ color: '#6b7280' }}>
              {changeType === 'upgrade' 
                ? "Great choice! You've unlocked more premium features."
                : "Your subscription has been updated as requested."
              }
            </p>
          </div>

          {/* Plan Change Visualization */}
          <div className="change-box">
            <h3 style={{ color: '#1f2937', marginBottom: '20px', textAlign: 'center' }}>Plan Change</h3>
            <div className="plan-change">
              <div className="plan-badge old-plan">{oldPlan}</div>
              <div className="arrow">→</div>
              <div className="plan-badge new-plan">{newPlan}</div>
            </div>

            <div className="detail-row">
              <span className="detail-label">Effective Date</span>
              <span className="detail-value">{effectiveDate}</span>
            </div>

            <div className="detail-row">
              <span className="detail-label">New Price</span>
              <span className="detail-value">{newPrice}</span>
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

          {/* New Features (Upgrade Only) */}
          {changeType === 'upgrade' && (
            <div className="features-box">
              <h3 style={{ color: '#065f46', marginBottom: '15px' }}>🎁 New Features Unlocked:</h3>
              <div className="feature-item">
                <span className="feature-icon">✅</span>
                <span style={{ color: '#065f46', fontSize: '14px' }}>Early captain picks (24 hours before free users)</span>
              </div>
              <div className="feature-item">
                <span className="feature-icon">✅</span>
                <span style={{ color: '#065f46', fontSize: '14px' }}>Price change predictions and alerts</span>
              </div>
              <div className="feature-item">
                <span className="feature-icon">✅</span>
                <span style={{ color: '#065f46', fontSize: '14px' }}>Injury intelligence with return dates</span>
              </div>
              <div className="feature-item">
                <span className="feature-icon">✅</span>
                <span style={{ color: '#065f46', fontSize: '14px' }}>Transfer strategy recommendations</span>
              </div>
              {newPlan.includes('Season Pass') && (
                <>
                  <div className="feature-item">
                    <span className="feature-icon">✅</span>
                    <span style={{ color: '#065f46', fontSize: '14px' }}>Advanced analytics (xG/xA/ICT)</span>
                  </div>
                  <div className="feature-item">
                    <span className="feature-icon">✅</span>
                    <span style={{ color: '#065f46', fontSize: '14px' }}>Personalized FPL calendar</span>
                  </div>
                  <div className="feature-item">
                    <span className="feature-icon">✅</span>
                    <span style={{ color: '#065f46', fontSize: '14px' }}>Priority algorithm access</span>
                  </div>
                </>
              )}
            </div>
          )}

          {/* What Changed (Downgrade) */}
          {changeType === 'downgrade' && (
            <div className="features-box">
              <h3 style={{ color: '#92400e', marginBottom: '15px' }}>📋 What's Changed:</h3>
              <p style={{ color: '#92400e', fontSize: '14px', marginBottom: '15px' }}>
                You'll continue to have access to your current features until {effectiveDate}. After that, your plan will include:
              </p>
              <div className="feature-item">
                <span className="feature-icon">✅</span>
                <span style={{ color: '#92400e', fontSize: '14px' }}>Basic captain picks (Saturday morning)</span>
              </div>
              <div className="feature-item">
                <span className="feature-icon">✅</span>
                <span style={{ color: '#92400e', fontSize: '14px' }}>Weekly FPL insights</span>
              </div>
              <div className="feature-item">
                <span className="feature-icon">✅</span>
                <span style={{ color: '#92400e', fontSize: '14px' }}>Community access</span>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div style={{ textAlign: 'center', marginTop: '30px' }}>
            <div style={{ display: 'flex', gap: '15px', justifyContent: 'center', flexWrap: 'wrap' }}>
              <Button href="https://premierleaguetables.com/dashboard" style={{ background: 'linear-gradient(135deg, #1e40af, #3b82f6)', color: 'white', padding: '14px 28px', borderRadius: '8px', textDecoration: 'none', fontWeight: '600', display: 'inline-block', fontSize: '14px' }}>
                Go to Dashboard
              </Button>
              <Button href="https://premierleaguetables.com/account" style={{ background: '#6b7280', color: 'white', padding: '14px 28px', borderRadius: '8px', textDecoration: 'none', fontWeight: '600', display: 'inline-block', fontSize: '14px' }}>
                Manage Account
              </Button>
            </div>
          </div>

          {/* Support Info */}
          <div style={{ textAlign: 'center', marginTop: '30px', padding: '20px', background: 'white', borderRadius: '12px' }}>
            <h4 style={{ color: '#1f2937', marginBottom: '10px' }}>Questions About Your Subscription?</h4>
            <p style={{ color: '#6b7280', fontSize: '14px', marginBottom: '15px' }}>
              Our support team is here to help with any questions about your plan change.
            </p>
            <Button href="mailto:info@premierleaguetables.com" style={{ color: '#3b82f6', textDecoration: 'none' }}>
              Contact Support
            </Button>
          </div>
        </Section>

        {/* Footer */}
        <Section className="footer">
          <p>© 2026 premierleaguetables.com. All rights reserved.</p>
          <p style={{ marginTop: '10px' }}>
            <a href="#" style={{ color: '#9ca3af', textDecoration: 'none', margin: '0 10px' }}>Privacy</a>
            <a href="#" style={{ color: '#9ca3af', textDecoration: 'none', margin: '0 10px' }}>Terms</a>
            <a href="#" style={{ color: '#9ca3af', textDecoration: 'none', margin: '0 10px' }}>Manage Subscription</a>
          </p>
        </Section>
      </Container>
    </Body>
  </Html>
);

export default SubscriptionUpdatedEmail;


