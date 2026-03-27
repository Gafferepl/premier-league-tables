import { Html, Head, Body, Container, Section, Text, Button, Row, Column } from '@react-email/components';

const FreeWelcomeEmail = ({ name, email }: { name: string; email: string }) => (
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
        `}
      </style>
    </Head>
    <Body style={{ fontFamily: 'Inter, sans-serif', margin: 0, padding: 0, backgroundColor: '#f3f4f6' }}>
      <Container className="container">
        {/* Header */}
        <Section className="header">
          <div className="logo">⚽ premierleaguetables.com</div>
          <h1 className="title">Welcome to the Hub, {name}!</h1>
          <p className="subtitle">You've joined 50,000+ FPL managers getting smarter insights</p>
        </Section>

        {/* Content */}
        <Section className="content">
          {/* Stats */}
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

          {/* Features */}
          <div className="feature-box">
            <div className="feature-title">👑 Weekly Captain Picks</div>
            <div className="feature-desc">Get Gaffer's Saturday morning captain recommendations delivered straight to your inbox</div>
          </div>

          <div className="feature-box">
            <div className="feature-title">📈 Live Price Updates</div>
            <div className="feature-desc">Track player price movements and market trends as they happen</div>
          </div>

          <div className="feature-box">
            <div className="feature-title">🏥 Injury & Team News</div>
            <div className="feature-desc">Stay updated with injury reports, return dates, and team news</div>
          </div>

          <div className="feature-box">
            <div className="feature-title">⚽ Live Match Scores</div>
            <div className="feature-desc">Follow live scores, goal events, and match updates in real-time</div>
          </div>

          <div className="feature-box">
            <div className="feature-title">⚖️ Player Comparison</div>
            <div className="feature-desc">Compare players head-to-head with basic stats and form analysis</div>
          </div>

          {/* Gaffer's League Section */}
          <div style={{ background: 'linear-gradient(135deg, #f59e0b, #f97316)', color: 'white', borderRadius: '12px', padding: '25px', marginTop: '30px', textAlign: 'center' }}>
            <h3 style={{ fontSize: '20px', marginBottom: '10px', fontWeight: 'bold' }}>🏆 Gaffer's League - Exclusive Competition!</h3>
            <p style={{ fontSize: '14px', marginBottom: '15px', lineHeight: '1.6' }}>
              You've been entered into the lottery for the <strong>Gaffer's Community League</strong>! 
              Only 50 managers will be randomly selected before the 2026-27 season starts to compete in this exclusive FPL league.
            </p>
            <div style={{ background: 'rgba(255,255,255,0.2)', borderRadius: '8px', padding: '15px', marginBottom: '15px' }}>
              <p style={{ fontSize: '13px', margin: 0, lineHeight: '1.5' }}>
                <strong>📅 Selection Date:</strong> Approximately 2 weeks before the season starts<br/>
                <strong>🎲 Your Odds:</strong> Fair and equal chance for all applicants<br/>
                <strong>📧 Notification:</strong> We'll email you if you're selected!
              </p>
            </div>
            <p style={{ fontSize: '12px', margin: 0, fontStyle: 'italic', opacity: '0.9' }}>
              <strong>ONLY THE FEW WILL COMPETE</strong> - Keep an eye on your inbox for the big announcement!
            </p>
          </div>

          {/* CTA */}
          <div className="cta-section">
            <h2 style={{ color: '#1f2937', marginBottom: '10px' }}>Want Better Odds + Premium Features?</h2>
            <p style={{ color: '#6b7280', marginBottom: '20px' }}>Join 5,000+ managers winning their mini-leagues with early insights:</p>
            <div style={{ display: 'flex', gap: '15px', justifyContent: 'center', flexWrap: 'wrap' }}>
              <Button href="https://premierleaguetables.com/pricing" style={{ background: 'linear-gradient(135deg, #1e40af, #3b82f6)', color: 'white', padding: '16px 32px', borderRadius: '8px', textDecoration: 'none', fontWeight: '600', display: 'inline-block' }}>
                ⭐ First Team - £2.99/week
              </Button>
              <Button href="https://premierleaguetables.com/pricing" style={{ background: 'linear-gradient(135deg, #f59e0b, #f97316)', color: 'white', padding: '16px 32px', borderRadius: '8px', textDecoration: 'none', fontWeight: '600', display: 'inline-block' }}>
                🎫 Season Pass - £49.99/year
              </Button>
            </div>
            <p style={{ fontSize: '12px', color: '#6b7280', marginTop: '15px' }}>
              24-hour captain advantage • Price predictions • Cancel anytime
            </p>
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
        </Section>
      </Container>
    </Body>
  </Html>
);

export default FreeWelcomeEmail;


