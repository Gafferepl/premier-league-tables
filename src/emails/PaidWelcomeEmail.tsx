import { Html, Head, Body, Container, Section, Text, Button, Row, Column } from '@react-email/components';

const PaidWelcomeEmail = ({ name, plan, email }: { name: string; plan: string; email: string }) => (
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
          .premium-badge { background: linear-gradient(135deg, #f59e0b, #f97316); color: white; padding: 8px 16px; border-radius: 20px; font-weight: 600; font-size: 14px; display: inline-block; margin-bottom: 20px; }
          .feature-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin: 30px 0; }
          .feature-card { background: white; padding: 20px; border-radius: 12px; border-left: 4px solid #3b82f6; }
          .feature-icon { font-size: 24px; margin-bottom: 10px; }
          .feature-title { font-weight: 600; color: #1f2937; margin-bottom: 8px; }
          .feature-desc { color: #6b7280; font-size: 14px; }
          .dashboard-cta { background: linear-gradient(135deg, #10b981, #059669); color: white; padding: 20px; border-radius: 12px; text-align: center; margin-top: 30px; }
          .dashboard-button { background: white; color: #10b981; padding: 16px 32px; border-radius: 8px; text-decoration: none; font-weight: 600; display: inline-block; }
          .footer { background: #1f2937; color: white; padding: 30px; text-align: center; font-size: 12px; }
        `}
      </style>
    </Head>
    <Body style={{ fontFamily: 'Inter, sans-serif', margin: 0, padding: 0, backgroundColor: '#f3f4f6' }}>
      <Container className="container">
        {/* Header */}
        <Section className="header">
          <div className="logo">⚽ premierleaguetables.com</div>
          <div className="premium-badge">👑 {plan.toUpperCase()} MEMBER</div>
          <h1 className="title">Welcome to the Elite, {name}!</h1>
          <p className="subtitle">You've unlocked the full power of FPL analytics</p>
        </Section>

        {/* Content */}
        <Section className="content">
          {/* Welcome Message */}
          <div style={{ textAlign: 'center', marginBottom: '30px' }}>
            <h2 style={{ color: '#1f2937', marginBottom: '10px' }}>Your Journey to FPL Domination Starts Now!</h2>
            <p style={{ color: '#6b7280' }}>You've joined the top 5% of FPL managers who use advanced analytics to win their mini-leagues.</p>
          </div>

          {/* Premium Features Grid */}
          <div className="feature-grid">
            <div className="feature-card">
              <div className="feature-icon">🤖</div>
              <div className="feature-title">AI Chat Assistant</div>
              <div className="feature-desc">Ask The Gaffer anything 24/7 - instant FPL advice</div>
            </div>

            <div className="feature-card">
              <div className="feature-icon">👑</div>
              <div className="feature-title">Early Captain Picks</div>
              <div className="feature-desc">Get captain picks 24 hours early (Friday 6 PM)</div>
            </div>

            <div className="feature-card">
              <div className="feature-icon">📈</div>
              <div className="feature-title">Price Predictions</div>
              <div className="feature-desc">Predict price changes before they happen</div>
            </div>

            <div className="feature-card">
              <div className="feature-icon">🏥</div>
              <div className="feature-title">Injury Intelligence</div>
              <div className="feature-desc">Accurate return dates and injury analysis</div>
            </div>

            <div className="feature-card">
              <div className="feature-icon">🎯</div>
              <div className="feature-title">Transfer Strategy</div>
              <div className="feature-desc">Data-driven transfer recommendations</div>
            </div>

            <div className="feature-card">
              <div className="feature-icon">🌤️</div>
              <div className="feature-title">Weather Impact</div>
              <div className="feature-desc">Match conditions affecting player performance</div>
            </div>

            <div className="feature-card">
              <div className="feature-icon">👥</div>
              <div className="feature-title">Mini-League Analysis</div>
              <div className="feature-desc">Beat your friends with competitive intelligence</div>
            </div>
          </div>

          {/* Gaffer's League Section */}
          <div style={{ background: 'linear-gradient(135deg, #f59e0b, #f97316)', color: 'white', borderRadius: '12px', padding: '25px', marginTop: '30px', textAlign: 'center' }}>
            <h3 style={{ fontSize: '20px', marginBottom: '10px', fontWeight: 'bold' }}>🏆 Gaffer's League - You're In The Lottery!</h3>
            <p style={{ fontSize: '14px', marginBottom: '15px', lineHeight: '1.6' }}>
              As a {plan} member, you've been entered into the lottery for the <strong>Gaffer's {plan === 'firstTeam' ? 'Elite' : 'Inner Circle'} League</strong>! 
              Only 50 managers will be randomly selected before the 2026-27 season starts to compete in this exclusive FPL league.
            </p>
            <div style={{ background: 'rgba(255,255,255,0.2)', borderRadius: '8px', padding: '15px', marginBottom: '15px' }}>
              <p style={{ fontSize: '13px', margin: 0, lineHeight: '1.5' }}>
                <strong>📅 Selection Date:</strong> Approximately 2 weeks before the season starts<br/>
                <strong>🎯 Better Odds:</strong> Premium members get priority selection<br/>
                <strong>📧 Notification:</strong> We'll email you if you're selected!
              </p>
            </div>
            <p style={{ fontSize: '12px', margin: 0, fontStyle: 'italic', opacity: '0.9' }}>
              <strong>ONLY THE FEW WILL COMPETE</strong> - Keep an eye on your inbox for the big announcement!
            </p>
          </div>

          {/* Season Pass Upgrade CTA */}
          <div style={{ background: 'linear-gradient(135deg, #f59e0b, #f97316)', color: 'white', padding: '25px', borderRadius: '12px', margin: '30px 0', textAlign: 'center' }}>
            <h3 style={{ marginBottom: '10px' }}>🎫 Upgrade to Season Pass?</h3>
            <p style={{ marginBottom: '15px' }}>Get everything in First Team PLUS:</p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', maxWidth: '400px', margin: '0 auto 20px', textAlign: 'left' }}>
              <div style={{ fontSize: '14px' }}>📊 Advanced Analytics (xG/xA/ICT)</div>
              <div style={{ fontSize: '14px' }}>🔮 Custom Algorithm Access</div>
              <div style={{ fontSize: '14px' }}>📅 Personalized Calendar</div>
              <div style={{ fontSize: '14px' }}>📊 Historical Performance Tool</div>
              <div style={{ fontSize: '14px' }}>🎯 Priority Algorithm Access</div>
              <div style={{ fontSize: '14px' }}>📧 Automated Weekly Reports</div>
            </div>
            <p style={{ marginBottom: '20px', fontWeight: 'bold' }}>Only £49.99 for the entire season!</p>
            <Button href="https://premierleaguehub.com/upgrade" style={{ background: 'white', color: '#f59e0b', padding: '16px 32px', borderRadius: '8px', textDecoration: 'none', fontWeight: '600', display: 'inline-block' }}>
              Upgrade to Season Pass
            </Button>
            <p style={{ fontSize: '12px', marginTop: '15px', color: '#fef3c7' }}>Save £13.89 vs monthly price!</p>
          </div>

          {/* Dashboard CTA */}
          <div className="dashboard-cta">
            <h2 style={{ marginBottom: '10px' }}>🚀 Ready to Start Winning?</h2>
            <p style={{ marginBottom: '20px' }}>Access your premium features and start dominating:</p>
            <Button href="https://premierleaguehub.com/dashboard" className="dashboard-button">
              Go to Dashboard
            </Button>
          </div>

          {/* Support Info */}
          <div style={{ textAlign: 'center', marginTop: '30px', padding: '20px', background: 'white', borderRadius: '12px' }}>
            <h3 style={{ color: '#1f2937', marginBottom: '10px' }}>Need Help?</h3>
            <p style={{ color: '#6b7280', marginBottom: '15px' }}>Our support team is here to help you maximize your FPL success.</p>
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

export default PaidWelcomeEmail;


