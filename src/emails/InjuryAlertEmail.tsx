import { Html, Head, Body, Container, Section, Button } from '@react-email/components';

interface InjuryAlertEmailProps {
  name: string;
  tier: 'free' | 'paid' | 'season';
  injuries: Array<{
    playerName: string;
    team: string;
    injury: string;
    severity: 'minor' | 'moderate' | 'major';
    expectedReturn: string;
    ownership: number;
  }>;
}

const InjuryAlertEmail = ({ name, tier, injuries }: InjuryAlertEmailProps) => (
  <Html>
    <Head>
      <style>
        {`
          .container { max-width: 600px; margin: 0 auto; }
          .header { background: linear-gradient(135deg, #dc2626, #ef4444); padding: 40px 30px; text-align: center; }
          .logo { font-size: 24px; font-weight: bold; color: white; margin-bottom: 20px; }
          .title { color: white; font-size: 28px; margin-bottom: 10px; }
          .subtitle { color: #fecaca; font-size: 16px; }
          .content { padding: 40px 30px; background: #f8fafc; }
          .injury-card { background: white; border-radius: 12px; padding: 20px; margin-bottom: 15px; border-left: 4px solid #ef4444; }
          .player-name { font-size: 18px; font-weight: bold; color: #1f2937; margin-bottom: 5px; }
          .player-team { color: #6b7280; font-size: 14px; margin-bottom: 10px; }
          .injury-details { background: #fef2f2; padding: 15px; border-radius: 8px; margin: 10px 0; }
          .severity-badge { display: inline-block; padding: 4px 12px; border-radius: 12px; font-size: 12px; font-weight: 600; }
          .severity-minor { background: #fef3c7; color: #92400e; }
          .severity-moderate { background: #fed7aa; color: #9a3412; }
          .severity-major { background: #fee2e2; color: #991b1b; }
          .ownership-badge { background: #dbeafe; color: #1e40af; padding: 4px 8px; border-radius: 12px; font-size: 12px; font-weight: 600; }
          .gaffer-quote { background: #fef3c7; padding: 20px; border-radius: 12px; margin: 20px 0; border-left: 4px solid #f59e0b; }
          .footer { background: #1f2937; color: white; padding: 30px; text-align: center; font-size: 12px; }
        `}
      </style>
    </Head>
    <Body style={{ fontFamily: 'Inter, sans-serif', margin: 0, padding: 0, backgroundColor: '#f3f4f6' }}>
      <Container className="container">
        {/* Header */}
        <Section className="header">
          <div className="logo">⚽ premierleaguetables.com</div>
          <h1 className="title">🏥 Injury Intelligence Alert</h1>
          <p className="subtitle">Critical updates for your FPL team</p>
        </Section>

        {/* Content */}
        <Section className="content">
          <div style={{ textAlign: 'center', marginBottom: '30px' }}>
            <h2 style={{ color: '#1f2937', marginBottom: '10px' }}>Hi {name}!</h2>
            <p style={{ color: '#6b7280' }}>We've detected {injuries.length} injury update{injuries.length > 1 ? 's' : ''} that could affect your FPL team.</p>
          </div>

          {/* Injury Cards */}
          {injuries.map((injury, index) => (
            <div key={index} className="injury-card" style={{ 
              borderLeftColor: injury.severity === 'major' ? '#dc2626' : injury.severity === 'moderate' ? '#f59e0b' : '#10b981' 
            }}>
              <div className="player-name">🚨 {injury.playerName}</div>
              <div className="player-team">{injury.team}</div>
              
              <div style={{ display: 'flex', gap: '10px', marginBottom: '10px', flexWrap: 'wrap' }}>
                <span className={`severity-badge severity-${injury.severity}`}>
                  {injury.severity === 'major' ? '🔴 Major' : injury.severity === 'moderate' ? '🟡 Moderate' : '🟢 Minor'}
                </span>
                <span className="ownership-badge">{injury.ownership}% owned</span>
              </div>

              <div className="injury-details">
                <p style={{ margin: '0 0 8px 0', color: '#1f2937', fontWeight: '600' }}>
                  Injury: {injury.injury}
                </p>
                <p style={{ margin: 0, color: '#6b7280', fontSize: '14px' }}>
                  Expected Return: {injury.expectedReturn}
                </p>
              </div>

              {tier !== 'free' && (
                <div style={{ marginTop: '15px', padding: '12px', background: '#f0f9ff', borderRadius: '8px' }}>
                  <p style={{ margin: 0, fontSize: '13px', color: '#1e40af', fontWeight: '600' }}>
                    💡 Gaffer's Recommendation:
                  </p>
                  <p style={{ margin: '5px 0 0 0', fontSize: '13px', color: '#1e40af' }}>
                    {injury.severity === 'major' 
                      ? `Transfer out immediately - this is a season-ender. Don't wait for price drops!`
                      : injury.severity === 'moderate'
                      ? `Monitor closely. Consider transfer if you have other fires to put out.`
                      : `Keep for now. Minor knock, should be back soon. Don't waste a transfer.`
                    }
                  </p>
                </div>
              )}
            </div>
          ))}

          {/* Gaffer's Quote */}
          <div className="gaffer-quote">
            <h3 style={{ color: '#92400e', marginBottom: '10px' }}>🗣️ The Gaffer Says:</h3>
            <p style={{ color: '#92400e', fontStyle: 'italic', marginBottom: '10px', lineHeight: '1.6' }}>
              "Injuries are part of the game, but being caught off guard isn't! This is where champions separate from the rest. 
              React fast, make smart moves, and you'll turn this crisis into an opportunity. Your rivals are sleeping - you're not!"
            </p>
            <p style={{ color: '#92400e', fontWeight: 'bold', margin: 0 }}>— The Gaffer</p>
          </div>

          {/* CTA for Free Users */}
          {tier === 'free' && (
            <div style={{ background: 'white', padding: '30px', textAlign: 'center', borderRadius: '12px', marginTop: '30px' }}>
              <h2 style={{ color: '#1f2937', marginBottom: '10px' }}>Want Detailed Transfer Recommendations?</h2>
              <p style={{ color: '#6b7280', marginBottom: '20px' }}>
                Get AI-powered transfer suggestions + price predictions + early captain picks:
              </p>
              <Button href="https://premierleaguetables.com/pricing" style={{ background: 'linear-gradient(135deg, #1e40af, #3b82f6)', color: 'white', padding: '16px 32px', borderRadius: '8px', textDecoration: 'none', fontWeight: '600', display: 'inline-block' }}>
                Upgrade to Premium
              </Button>
            </div>
          )}
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

export default InjuryAlertEmail;


