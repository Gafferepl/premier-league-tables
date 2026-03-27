import { Html, Head, Body, Container, Section, Text, Button } from '@react-email/components';

const LeagueSelectionEmail = ({ 
  name, 
  tier, 
  leagueCode, 
  leagueName 
}: { 
  name: string; 
  tier: 'free' | 'firstTeam' | 'seasonPass';
  leagueCode: string;
  leagueName: string;
}) => {
  const tierConfig = {
    free: {
      badge: '🏆 COMMUNITY LEAGUE',
      color: '#3b82f6',
      gradient: 'linear-gradient(135deg, #1e40af, #3b82f6)',
      title: 'Community League'
    },
    firstTeam: {
      badge: '👑 ELITE LEAGUE',
      color: '#9333ea',
      gradient: 'linear-gradient(135deg, #7e22ce, #9333ea)',
      title: 'Elite League'
    },
    seasonPass: {
      badge: '🎫 INNER CIRCLE',
      color: '#f59e0b',
      gradient: 'linear-gradient(135deg, #f59e0b, #f97316)',
      title: 'Inner Circle League'
    }
  };

  const config = tierConfig[tier];

  return (
    <Html>
      <Head>
        <style>
          {`
            .container { max-width: 600px; margin: 0 auto; }
            .header { background: ${config.gradient}; padding: 50px 30px; text-align: center; position: relative; overflow: hidden; }
            .header::before { content: ''; position: absolute; top: -50%; left: -50%; width: 200%; height: 200%; background: radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%); animation: pulse 3s ease-in-out infinite; }
            @keyframes pulse { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.1); } }
            .logo { font-size: 24px; font-weight: bold; color: white; margin-bottom: 20px; position: relative; z-index: 1; }
            .badge { background: rgba(255,255,255,0.2); color: white; padding: 8px 20px; border-radius: 20px; font-weight: 700; font-size: 14px; display: inline-block; margin-bottom: 20px; position: relative; z-index: 1; }
            .title { color: white; font-size: 36px; margin-bottom: 10px; font-weight: 900; position: relative; z-index: 1; text-shadow: 2px 2px 4px rgba(0,0,0,0.2); }
            .subtitle { color: rgba(255,255,255,0.95); font-size: 18px; position: relative; z-index: 1; }
            .content { padding: 40px 30px; background: #f8fafc; }
            .congrats-box { background: linear-gradient(135deg, #10b981, #059669); color: white; padding: 30px; border-radius: 16px; text-align: center; margin-bottom: 30px; box-shadow: 0 10px 30px rgba(16, 185, 129, 0.3); }
            .congrats-icon { font-size: 60px; margin-bottom: 15px; animation: bounce 2s ease-in-out infinite; }
            @keyframes bounce { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-10px); } }
            .code-box { background: rgba(255,255,255,0.2); border: 2px dashed rgba(255,255,255,0.5); padding: 20px; border-radius: 12px; margin: 20px 0; }
            .league-code { font-size: 32px; font-weight: 900; letter-spacing: 3px; color: white; font-family: 'Courier New', monospace; }
            .instructions { background: white; border-radius: 12px; padding: 25px; margin: 30px 0; border-left: 4px solid ${config.color}; }
            .step { display: flex; align-items: start; margin-bottom: 15px; }
            .step-number { background: ${config.gradient}; color: white; width: 32px; height: 32px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: bold; margin-right: 15px; flex-shrink: 0; }
            .step-text { color: #1f2937; font-size: 15px; line-height: 1.6; }
            .cta-button { background: ${config.gradient}; color: white; padding: 18px 40px; border-radius: 12px; text-decoration: none; font-weight: 700; display: inline-block; font-size: 16px; box-shadow: 0 4px 15px rgba(0,0,0,0.2); transition: transform 0.2s; }
            .cta-button:hover { transform: translateY(-2px); }
            .warning-box { background: #fef3c7; border: 2px solid #f59e0b; border-radius: 12px; padding: 20px; margin: 20px 0; }
            .footer { background: #1f2937; color: white; padding: 30px; text-align: center; font-size: 12px; }
            .stats-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin: 25px 0; }
            .stat-card { background: white; padding: 20px; border-radius: 12px; text-align: center; border: 2px solid #e5e7eb; }
            .stat-number { font-size: 28px; font-weight: bold; color: ${config.color}; margin-bottom: 5px; }
            .stat-label { font-size: 13px; color: #6b7280; }
          `}
        </style>
      </Head>
      <Body style={{ fontFamily: 'Inter, -apple-system, sans-serif', margin: 0, padding: 0, backgroundColor: '#f3f4f6' }}>
        <Container className="container">
          {/* Header */}
          <Section className="header">
            <div className="logo">⚽ premierleaguetables.com</div>
            <div className="badge">{config.badge}</div>
            <h1 className="title">YOU'RE IN, {name.toUpperCase()}!</h1>
            <p className="subtitle">Welcome to the Gaffer's {config.title}</p>
          </Section>

          {/* Content */}
          <Section className="content">
            {/* Congratulations Box */}
            <div className="congrats-box">
              <div className="congrats-icon">🎉</div>
              <h2 style={{ fontSize: '24px', marginBottom: '10px', fontWeight: 'bold' }}>
                Congratulations! You've Been Selected!
              </h2>
              <p style={{ fontSize: '16px', marginBottom: '0', opacity: 0.95 }}>
                You beat the odds! Out of hundreds of applicants, you're one of the lucky <strong>50 managers</strong> chosen for this exclusive competition.
              </p>
              
              {/* League Code */}
              <div className="code-box">
                <p style={{ fontSize: '14px', marginBottom: '10px', opacity: 0.9 }}>Your Exclusive League Code:</p>
                <div className="league-code">{leagueCode}</div>
                <p style={{ fontSize: '12px', marginTop: '10px', opacity: 0.8 }}>⚠️ Valid for 48 hours only</p>
              </div>
            </div>

            {/* Stats */}
            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-number">50</div>
                <div className="stat-label">Total Spots</div>
              </div>
              <div className="stat-card">
                <div className="stat-number">1/{Math.floor(Math.random() * 20) + 10}</div>
                <div className="stat-label">Your Odds</div>
              </div>
            </div>

            {/* Instructions */}
            <div className="instructions">
              <h3 style={{ color: '#1f2937', marginBottom: '20px', fontSize: '20px', fontWeight: 'bold' }}>
                🎯 How to Join Your League
              </h3>
              
              <div className="step">
                <div className="step-number">1</div>
                <div className="step-text">
                  <strong>Go to Fantasy Premier League</strong><br/>
                  Visit <a href="https://fantasy.premierleague.com" style={{ color: config.color }}>fantasy.premierleague.com</a> and log into your account
                </div>
              </div>

              <div className="step">
                <div className="step-number">2</div>
                <div className="step-text">
                  <strong>Navigate to Leagues</strong><br/>
                  Click on "Leagues & Cups" then "Create and join leagues"
                </div>
              </div>

              <div className="step">
                <div className="step-number">3</div>
                <div className="step-text">
                  <strong>Join with Your Code</strong><br/>
                  Click "Join a league" and enter your exclusive code: <strong style={{ fontFamily: 'monospace', color: config.color }}>{leagueCode}</strong>
                </div>
              </div>

              <div className="step">
                <div className="step-number">4</div>
                <div className="step-text">
                  <strong>You're In!</strong><br/>
                  Start competing against 49 other elite FPL managers. May the best Gaffer win! 🏆
                </div>
              </div>
            </div>

            {/* CTA Button */}
            <div style={{ textAlign: 'center', margin: '30px 0' }}>
              <a href="https://fantasy.premierleague.com/leagues/create-join" className="cta-button">
                Join League Now →
              </a>
            </div>

            {/* Warning */}
            <div className="warning-box">
              <p style={{ margin: 0, color: '#92400e', fontSize: '14px', fontWeight: 'bold', marginBottom: '8px' }}>
                ⏰ Important: 48-Hour Deadline
              </p>
              <p style={{ margin: 0, color: '#78350f', fontSize: '13px', lineHeight: '1.6' }}>
                Your league code expires in <strong>48 hours</strong>. If you don't join within this time, 
                your spot will be offered to the next person on the waitlist. Don't miss out!
              </p>
            </div>

            {/* What's Next */}
            <div style={{ background: 'white', borderRadius: '12px', padding: '25px', marginTop: '30px' }}>
              <h3 style={{ color: '#1f2937', marginBottom: '15px', fontSize: '18px', fontWeight: 'bold' }}>
                🚀 What Happens Next?
              </h3>
              <ul style={{ color: '#4b5563', fontSize: '14px', lineHeight: '1.8', paddingLeft: '20px' }}>
                <li>Join the league using your code above</li>
                <li>Receive weekly league updates and standings via email</li>
                <li>Compete for bragging rights and exclusive prizes</li>
                <li>Get featured in our newsletter if you top the league</li>
                <li>Automatic entry to next season's league</li>
              </ul>
            </div>

            {/* Gaffer's Message */}
            <div style={{ background: config.gradient, color: 'white', borderRadius: '12px', padding: '25px', marginTop: '30px', textAlign: 'center' }}>
              <p style={{ fontSize: '16px', fontStyle: 'italic', marginBottom: '15px', lineHeight: '1.6' }}>
                "Welcome to the elite, {name}. You've earned your spot at the table. 
                Now show me what you're made of. The Gaffer's watching."
              </p>
              <p style={{ fontSize: '14px', fontWeight: 'bold', margin: 0 }}>
                — The Gaffer
              </p>
            </div>
          </Section>

          {/* Footer */}
          <Section className="footer">
            <p style={{ marginBottom: '15px', fontSize: '14px', fontWeight: 'bold' }}>
              🏆 You're one of 50 exclusive managers in the Gaffer's {config.title}
            </p>
            <p>© 2026 premierleaguetables.com. All rights reserved.</p>
            <p style={{ marginTop: '10px' }}>
              <a href="#" style={{ color: '#9ca3af', textDecoration: 'none', margin: '0 10px' }}>Privacy</a>
              <a href="#" style={{ color: '#9ca3af', textDecoration: 'none', margin: '0 10px' }}>Terms</a>
              <a href="#" style={{ color: '#9ca3af', textDecoration: 'none', margin: '0 10px' }}>Contact</a>
            </p>
          </Section>
        </Container>
      </Body>
    </Html>
  );
};

export default LeagueSelectionEmail;


