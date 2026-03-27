import { Html, Head, Body, Container, Section, Button } from '@react-email/components';

interface TransferStrategyEmailProps {
  name: string;
  tier: 'free' | 'paid' | 'season';
  gameweek: number;
  transferSuggestions: Array<{
    playerOut: { name: string; team: string; price: number; reason: string };
    playerIn: { name: string; team: string; price: number; reason: string };
    priority: 'high' | 'medium' | 'low';
  }>;
  fixtureAnalysis?: {
    easyFixtures: Array<{ team: string; difficulty: number }>;
    hardFixtures: Array<{ team: string; difficulty: number }>;
  };
  premiumFeatures?: {
    hairdryerTreatment?: Array<{ name: string; team: string; form: string; ownership: number; reasoning: string }>;
    fixtureDifficulty?: Array<{ team: string; difficulty: string; rating: number }>;
    benchOptimizer?: {
      goalkeepers: Array<{ name: string; team: string; price: number; form: string }>;
      defenders: Array<{ name: string; team: string; price: number; form: string }>;
      midfielders: Array<{ name: string; team: string; price: number; form: string }>;
      forwards: Array<{ name: string; team: string; price: number; form: string }>;
    };
  };
}

const TransferStrategyEmail = ({ name, tier, gameweek, transferSuggestions, fixtureAnalysis, premiumFeatures }: TransferStrategyEmailProps) => (
  <Html>
    <Head>
      <style>
        {`
          .container { max-width: 600px; margin: 0 auto; }
          .header { background: linear-gradient(135deg, #7c3aed, #a855f7); padding: 40px 30px; text-align: center; }
          .logo { font-size: 24px; font-weight: bold; color: white; margin-bottom: 20px; }
          .title { color: white; font-size: 28px; margin-bottom: 10px; }
          .subtitle { color: #e9d5ff; font-size: 16px; }
          .content { padding: 40px 30px; background: #f8fafc; }
          .transfer-card { background: white; border-radius: 12px; padding: 25px; margin-bottom: 20px; border-left: 4px solid #7c3aed; }
          .player-section { display: flex; justify-content: space-between; align-items: center; margin: 15px 0; }
          .player-info { flex: 1; }
          .player-name { font-size: 16px; font-weight: bold; color: #1f2937; }
          .player-team { color: #6b7280; font-size: 14px; }
          .player-price { background: #dbeafe; color: #1e40af; padding: 4px 8px; border-radius: 12px; font-size: 12px; font-weight: 600; }
          .arrow { font-size: 24px; color: #7c3aed; margin: 0 15px; }
          .reason-box { background: #f3f4f6; padding: 15px; border-radius: 8px; margin-top: 15px; }
          .priority-badge { display: inline-block; padding: 4px 12px; border-radius: 12px; font-size: 12px; font-weight: 600; margin-bottom: 15px; }
          .priority-high { background: #fee2e2; color: #991b1b; }
          .priority-medium { background: #fef3c7; color: #92400e; }
          .priority-low { background: #dbeafe; color: #1e40af; }
          .fixture-section { background: #f0f9ff; padding: 25px; border-radius: 12px; margin: 20px 0; border-left: 4px solid #3b82f6; }
          .fixture-item { display: flex; justify-content: space-between; margin-bottom: 10px; }
          .difficulty-badge { padding: 4px 8px; border-radius: 12px; font-size: 12px; font-weight: 600; }
          .gaffer-quote { background: #fef3c7; padding: 20px; border-radius: 12px; margin: 20px 0; border-left: 4px solid #f59e0b; }
          .footer { background: #1f2937; color: white; padding: 30px; text-align: center; font-size: 12px; }
          .feature-section { background: white; padding: 25px; border-radius: 12px; margin: 20px 0; border-left: 4px solid #7c3aed; }
          .feature-title { color: #1f2937; font-size: 18px; font-weight: bold; margin-bottom: 15px; }
          .feature-item { background: #f9fafb; padding: 12px; border-radius: 8px; margin-bottom: 10px; }
          .feature-name { font-weight: 600; color: #1f2937; font-size: 14px; }
          .feature-detail { color: #6b7280; font-size: 12px; margin-top: 4px; }
          .badge { display: inline-block; padding: 4px 8px; border-radius: 12px; font-size: 11px; font-weight: 600; margin-right: 4px; }
          .badge-easy { background: #d1fae5; color: #065f46; }
          .badge-moderate { background: #fef3c7; color: #92400e; }
          .badge-hard { background: #fee2e2; color: #dc2626; }
        `}
      </style>
    </Head>
    <Body style={{ fontFamily: 'Inter, sans-serif', margin: 0, padding: 0, backgroundColor: '#f3f4f6' }}>
      <Container className="container">
        {/* Header */}
        <Section className="header">
          <div className="logo">⚽ premierleaguetables.com</div>
          <h1 className="title">🎯 Transfer Strategy</h1>
          <p className="subtitle">Gameweek {gameweek} - Monday Morning Intelligence</p>
        </Section>

        {/* Content */}
        <Section className="content">
          <div style={{ textAlign: 'center', marginBottom: '30px' }}>
            <h2 style={{ color: '#1f2937', marginBottom: '10px' }}>Hi {name}!</h2>
            <p style={{ color: '#6b7280' }}>Here are your data-driven transfer recommendations for GW{gameweek}.</p>
          </div>

          {/* Transfer Suggestions */}
          {transferSuggestions.map((transfer, index) => (
            <div key={index} className="transfer-card">
              <span className={`priority-badge priority-${transfer.priority}`}>
                {transfer.priority === 'high' ? '🔴 High Priority' : transfer.priority === 'medium' ? '🟡 Medium Priority' : '🟢 Low Priority'}
              </span>

              <div className="player-section">
                <div className="player-info">
                  <div className="player-name">❌ {transfer.playerOut.name}</div>
                  <div className="player-team">{transfer.playerOut.team}</div>
                  <div style={{ marginTop: '5px' }}>
                    <span className="player-price">£{transfer.playerOut.price}m</span>
                  </div>
                </div>
                <div className="arrow">→</div>
                <div className="player-info" style={{ textAlign: 'right' }}>
                  <div className="player-name">✅ {transfer.playerIn.name}</div>
                  <div className="player-team">{transfer.playerIn.team}</div>
                  <div style={{ marginTop: '5px' }}>
                    <span className="player-price">£{transfer.playerIn.price}m</span>
                  </div>
                </div>
              </div>

              <div className="reason-box">
                <p style={{ margin: '0 0 10px 0', fontWeight: '600', color: '#1f2937', fontSize: '14px' }}>
                  Why transfer out {transfer.playerOut.name}:
                </p>
                <p style={{ margin: '0 0 15px 0', color: '#6b7280', fontSize: '13px' }}>
                  {transfer.playerOut.reason}
                </p>
                <p style={{ margin: '0 0 10px 0', fontWeight: '600', color: '#1f2937', fontSize: '14px' }}>
                  Why bring in {transfer.playerIn.name}:
                </p>
                <p style={{ margin: 0, color: '#6b7280', fontSize: '13px' }}>
                  {transfer.playerIn.reason}
                </p>
              </div>
            </div>
          ))}

          {/* Fixture Analysis (Paid Only) */}
          {tier !== 'free' && fixtureAnalysis && (
            <div className="fixture-section">
              <h3 style={{ color: '#1e40af', marginBottom: '15px' }}>📅 Fixture Difficulty Analysis</h3>
              
              <div style={{ marginBottom: '20px' }}>
                <h4 style={{ color: '#10b981', marginBottom: '10px' }}>🟢 Easy Fixtures (Target These Teams):</h4>
                {fixtureAnalysis.easyFixtures.map((fixture, index) => (
                  <div key={index} className="fixture-item">
                    <span>{fixture.team}</span>
                    <span className="difficulty-badge" style={{ background: '#d1fae5', color: '#065f46' }}>
                      FDR: {fixture.difficulty}/5
                    </span>
                  </div>
                ))}
              </div>

              <div>
                <h4 style={{ color: '#ef4444', marginBottom: '10px' }}>🔴 Hard Fixtures (Avoid These Teams):</h4>
                {fixtureAnalysis.hardFixtures.map((fixture, index) => (
                  <div key={index} className="fixture-item">
                    <span>{fixture.team}</span>
                    <span className="difficulty-badge" style={{ background: '#fee2e2', color: '#991b1b' }}>
                      FDR: {fixture.difficulty}/5
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Premium Features */}
          {tier !== 'free' && premiumFeatures && (
            <>
              {/* The Hairdryer Treatment */}
              {premiumFeatures.hairdryerTreatment && premiumFeatures.hairdryerTreatment.length > 0 && (
                <div className="feature-section" style={{ borderLeftColor: '#dc2626' }}>
                  <h3 className="feature-title">💨 The Hairdryer Treatment - DROP IMMEDIATELY</h3>
                  {premiumFeatures.hairdryerTreatment.map((player, index) => (
                    <div key={index} className="feature-item">
                      <div className="feature-name">
                        ❌ {player.name} ({player.team})
                        <span className="badge" style={{ background: '#fee2e2', color: '#dc2626', marginLeft: '8px' }}>
                          Form: {player.form}
                        </span>
                        <span className="badge" style={{ background: '#fef3c7', color: '#92400e' }}>
                          {player.ownership}% owned
                        </span>
                      </div>
                      <div className="feature-detail" style={{ fontWeight: '600', color: '#dc2626' }}>
                        {player.reasoning}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Fixture Difficulty Heatmap */}
              {premiumFeatures.fixtureDifficulty && premiumFeatures.fixtureDifficulty.length > 0 && (
                <div className="feature-section" style={{ borderLeftColor: '#3b82f6' }}>
                  <h3 className="feature-title">📅 Fixture Difficulty Heatmap - Next 5 GWs</h3>
                  <div style={{ display: 'grid', gap: '8px' }}>
                    {premiumFeatures.fixtureDifficulty.slice(0, 12).map((fixture, index) => (
                      <div key={index} className="feature-item">
                        <div className="feature-name">
                          {fixture.team}
                          <span className={`badge badge-${fixture.difficulty}`} style={{ marginLeft: '8px' }}>
                            {fixture.difficulty === 'easy' ? '🟢 Easy' : fixture.difficulty === 'moderate' ? '🟡 Moderate' : '🔴 Hard'}
                          </span>
                          <span className="badge" style={{ background: '#f3f4f6', color: '#1f2937' }}>
                            FDR: {fixture.rating}/5
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Bench Boost Optimizer */}
              {premiumFeatures.benchOptimizer && (
                <div className="feature-section" style={{ borderLeftColor: '#10b981' }}>
                  <h3 className="feature-title">🎲 Bench Boost Optimizer - Best Budget Options</h3>
                  
                  <div style={{ marginBottom: '15px' }}>
                    <h4 style={{ color: '#1f2937', fontSize: '14px', marginBottom: '8px' }}>🧤 Goalkeepers:</h4>
                    {premiumFeatures.benchOptimizer.goalkeepers.slice(0, 3).map((gk, index) => (
                      <div key={index} className="feature-item">
                        <div className="feature-name">
                          {gk.name} ({gk.team}) - £{gk.price}m
                          <span className="badge" style={{ background: '#dbeafe', color: '#1e40af', marginLeft: '8px' }}>
                            Form: {gk.form}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div style={{ marginBottom: '15px' }}>
                    <h4 style={{ color: '#1f2937', fontSize: '14px', marginBottom: '8px' }}>🛡️ Defenders:</h4>
                    {premiumFeatures.benchOptimizer.defenders.slice(0, 3).map((def, index) => (
                      <div key={index} className="feature-item">
                        <div className="feature-name">
                          {def.name} ({def.team}) - £{def.price}m
                          <span className="badge" style={{ background: '#dbeafe', color: '#1e40af', marginLeft: '8px' }}>
                            Form: {def.form}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div style={{ marginBottom: '15px' }}>
                    <h4 style={{ color: '#1f2937', fontSize: '14px', marginBottom: '8px' }}>⚡ Midfielders:</h4>
                    {premiumFeatures.benchOptimizer.midfielders.slice(0, 3).map((mid, index) => (
                      <div key={index} className="feature-item">
                        <div className="feature-name">
                          {mid.name} ({mid.team}) - £{mid.price}m
                          <span className="badge" style={{ background: '#dbeafe', color: '#1e40af', marginLeft: '8px' }}>
                            Form: {mid.form}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div>
                    <h4 style={{ color: '#1f2937', fontSize: '14px', marginBottom: '8px' }}>⚽ Forwards:</h4>
                    {premiumFeatures.benchOptimizer.forwards.slice(0, 3).map((fwd, index) => (
                      <div key={index} className="feature-item">
                        <div className="feature-name">
                          {fwd.name} ({fwd.team}) - £{fwd.price}m
                          <span className="badge" style={{ background: '#dbeafe', color: '#1e40af', marginLeft: '8px' }}>
                            Form: {fwd.form}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}

          {/* Gaffer's Quote */}
          <div className="gaffer-quote">
            <h3 style={{ color: '#92400e', marginBottom: '10px' }}>🗣️ The Gaffer Says:</h3>
            <p style={{ color: '#92400e', fontStyle: 'italic', marginBottom: '10px', lineHeight: '1.6' }}>
              "Transfers are like chess moves - you need to think three steps ahead! Don't just react to last week's scores. 
              Look at the fixtures, the form, the underlying stats. That's how you win mini-leagues. The data's all here - now execute!"
            </p>
            <p style={{ color: '#92400e', fontWeight: 'bold', margin: 0 }}>— The Gaffer</p>
          </div>

          {/* CTA for Free Users */}
          {tier === 'free' && (
            <div style={{ background: 'white', padding: '30px', textAlign: 'center', borderRadius: '12px', marginTop: '30px' }}>
              <h2 style={{ color: '#1f2937', marginBottom: '10px' }}>Want Advanced Transfer Analytics?</h2>
              <p style={{ color: '#6b7280', marginBottom: '20px' }}>
                Get fixture difficulty ratings + xG/xA analysis + personalized recommendations:
              </p>
              <Button href="https://premierleaguetables.com/pricing" style={{ background: 'linear-gradient(135deg, #7c3aed, #a855f7)', color: 'white', padding: '16px 32px', borderRadius: '8px', textDecoration: 'none', fontWeight: '600', display: 'inline-block' }}>
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

export default TransferStrategyEmail;


