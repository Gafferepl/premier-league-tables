import { Html, Head, Body, Container, Section, Text, Button, Row, Column } from '@react-email/components';
import { MOCK_PLAYERS, FPLPlayer } from '../data/playerData';

interface WeeklyDigestEmailProps {
  name: string;
  tier: 'paid' | 'season';
  gameweek: number;
  captainPicks: {
    topPick: { name: string; team: string; confidence: number; reasoning: string };
    secondPick: { name: string; team: string; confidence: number; reasoning: string };
    thirdPick: { name: string; team: string; confidence: number; reasoning: string };
  };
  transferStrategy: {
    gameweek: number;
    suggestions: Array<{
      playerOut: { name: string; team: string; price: number; reason: string };
      playerIn: { name: string; team: string; price: number; reason: string };
      priority: 'high' | 'medium' | 'low';
    }>;
  };
  injuryData: Array<{
    playerName: string;
    team: string;
    injury: string;
    severity: 'minor' | 'moderate' | 'major';
    expectedReturn: string;
    ownership: number;
  }>;
  marketInsights: {
    topTransfers: Array<{ name: string; team: string; transfers: number; direction: 'in' | 'out' }>;
    ownershipTrends: Array<{ name: string; team: string; change: number; ownership: number }>;
  };
  fixtureAnalysis: {
    easyFixtures: Array<{ team: string; difficulty: number }>;
    hardFixtures: Array<{ team: string; difficulty: number }>;
  };
  premiumFeatures?: {
    differentials?: Array<{ name: string; team: string; ownership: number; form: string; reasoning: string }>;
    injuryIntelligence?: Array<{ playerName: string; team: string; status: string; risk: string; recommendation: string }>;
    budgetGems?: Array<{ name: string; team: string; position: string; price: number; form: string; valueRating: number }>;
  };
  gafferTip: string;
}

const WeeklyDigestEmail = ({ 
  name, 
  tier, 
  gameweek, 
  captainPicks, 
  transferStrategy, 
  injuryData, 
  marketInsights, 
  fixtureAnalysis, 
  premiumFeatures, 
  gafferTip 
}: WeeklyDigestEmailProps) => {
  const isSeasonPass = tier === 'season';

  return (
    <Html>
      <Head>
        <style>
          {`
            .container { max-width: 700px; margin: 0 auto; }
            .header { background: linear-gradient(135deg, #7c3aed, #a855f7); padding: 40px 30px; text-align: center; }
            .logo { font-size: 24px; font-weight: bold; color: white; margin-bottom: 20px; }
            .title { color: white; font-size: 32px; margin-bottom: 10px; }
            .subtitle { color: #e9d5ff; font-size: 16px; margin-bottom: 20px; }
            .content { padding: 40px 30px; background: #f8fafc; }
            .digest-section { background: white; padding: 30px; border-radius: 15px; margin-bottom: 25px; border-left: 5px solid #7c3aed; }
            .section-title { color: #1f2937; font-size: 22px; font-weight: bold; margin-bottom: 20px; display: flex; align-items: center; }
            .section-icon { font-size: 20px; margin-right: 10px; }
            .captain-pick { background: #f0f9ff; padding: 20px; border-radius: 12px; margin-bottom: 15px; border-left: 4px solid #3b82f6; }
            .pick-name { font-size: 18px; font-weight: bold; color: #1f2937; margin-bottom: 8px; }
            .pick-team { color: #6b7280; font-size: 14px; margin-bottom: 8px; }
            .confidence-badge { background: #dbeafe; color: #1e40af; padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: 600; display: inline-block; margin-bottom: 10px; }
            .pick-reasoning { color: #4b5563; font-size: 14px; line-height: 1.5; }
            .transfer-card { background: #f0fdf4; padding: 20px; border-radius: 12px; margin-bottom: 15px; border-left: 4px solid #10b981; }
            .player-section { display: flex; justify-content: space-between; align-items: center; margin: 15px 0; }
            .player-info { flex: 1; }
            .player-name { font-size: 16px; font-weight: bold; color: #1f2937; }
            .player-team { color: #6b7280; font-size: 14px; }
            .player-price { background: #dbeafe; color: #1e40af; padding: 4px 8px; border-radius: 12px; font-size: 12px; font-weight: 600; }
            .arrow { font-size: 24px; color: #10b981; margin: 0 15px; }
            .reason-box { background: #f3f4f6; padding: 15px; border-radius: 8px; margin-top: 15px; }
            .priority-badge { display: inline-block; padding: 4px 12px; border-radius: 12px; font-size: 12px; font-weight: 600; margin-bottom: 15px; }
            .priority-high { background: #fee2e2; color: #991b1b; }
            .priority-medium { background: #fef3c7; color: #92400e; }
            .priority-low { background: #dbeafe; color: #1e40af; }
            .injury-item { background: #fef2f2; padding: 15px; border-radius: 10px; margin-bottom: 12px; border-left: 3px solid #ef4444; }
            .injury-severity { display: inline-block; padding: 3px 8px; border-radius: 10px; font-size: 11px; font-weight: 600; margin-left: 8px; }
            .severity-minor { background: #fef3c7; color: #92400e; }
            .severity-moderate { background: #fed7aa; color: #c2410c; }
            .severity-major { background: #fee2e2; color: #dc2626; }
            .market-item { background: #f9fafb; padding: 12px; border-radius: 8px; margin-bottom: 10px; display: flex; justify-content: space-between; align-items: center; }
            .transfer-direction { padding: 3px 8px; border-radius: 10px; font-size: 11px; font-weight: 600; }
            .direction-in { background: #d1fae5; color: #065f46; }
            .direction-out { background: #fee2e2; color: #dc2626; }
            .trend-positive { color: #10b981; font-weight: 600; }
            .trend-negative { color: #ef4444; font-weight: 600; }
            .fixture-item { display: flex; justify-content: space-between; align-items: center; padding: 10px; border-radius: 8px; margin-bottom: 8px; }
            .fixture-easy { background: #d1fae5; color: #065f46; }
            .fixture-hard { background: #fee2e2; color: #dc2626; }
            .premium-feature { background: #f0f9ff; padding: 15px; border-radius: 10px; margin-bottom: 12px; border-left: 3px solid #3b82f6; }
            .feature-title { font-weight: 600; color: #1f2937; margin-bottom: 5px; }
            .feature-detail { color: #6b7280; font-size: 14px; }
            .gaffer-tip { background: linear-gradient(135deg, #f59e0b, #f97316); color: white; padding: 25px; border-radius: 15px; margin-top: 30px; text-align: center; }
            .gaffer-tip-title { font-size: 18px; font-weight: bold; margin-bottom: 10px; }
            .gaffer-tip-text { font-size: 16px; line-height: 1.5; font-style: italic; }
            .season-badge { background: linear-gradient(135deg, #fbbf24, #f59e0b); color: white; padding: 8px 16px; border-radius: 20px; font-size: 12px; font-weight: bold; margin-bottom: 20px; display: inline-block; }
            .toc { background: #f8fafc; padding: 20px; border-radius: 12px; margin-bottom: 25px; border: 2px solid #e2e8f0; }
            .toc-title { font-size: 18px; font-weight: bold; color: #1f2937; margin-bottom: 15px; }
            .toc-item { color: #4b5563; text-decoration: none; display: block; margin-bottom: 8px; font-size: 14px; }
            .toc-item:hover { color: #7c3aed; }
            .footer { background: #1f2937; color: white; padding: 30px; text-align: center; font-size: 12px; }
          `}
        </style>
      </Head>
      <Body style={{ margin: 0, padding: 0, fontFamily: 'Arial, sans-serif', backgroundColor: '#f8fafc' }}>
        <Container className="container">
          {/* Header */}
          <div className="header">
            <div className="logo">⚽ Gaffer's FPL Hub</div>
            <h1 className="title">📊 Weekly Intelligence Digest</h1>
            <p className="subtitle">
              Gameweek {gameweek} - Premium Analysis for {name}
              {isSeasonPass && <div className="season-badge">👑 SEASON PASS - ELITE ACCESS</div>}
            </p>
          </div>

          {/* Table of Contents */}
          <div className="content">
            <div className="toc">
              <div className="toc-title">📋 Quick Navigation</div>
              <a href="#captain-picks" className="toc-item">👑 Captain Picks Analysis</a>
              <a href="#transfer-strategy" className="toc-item">🎯 Transfer Strategy</a>
              <a href="#injury-report" className="toc-item">🏥 Injury Intelligence</a>
              <a href="#market-insights" className="toc-item">📈 Market Trends</a>
              <a href="#fixture-analysis" className="toc-item">🎯 Fixture Difficulty</a>
              {isSeasonPass && <a href="#premium-features" className="toc-item">🔍 Premium Features</a>}
              <a href="#gaffer-tip" className="toc-item">💡 Gaffer's Weekly Tip</a>
            </div>

            {/* Captain Picks Section */}
            <div id="captain-picks" className="digest-section">
              <h2 className="section-title">
                <span className="section-icon">👑</span>
                Captain Picks Analysis
              </h2>
              
              <div className="captain-pick">
                <div className="confidence-badge">Confidence: {captainPicks.topPick.confidence}%</div>
                <div className="pick-name">{captainPicks.topPick.name}</div>
                <div className="pick-team">{captainPicks.topPick.team}</div>
                <div className="pick-reasoning">{captainPicks.topPick.reasoning}</div>
              </div>

              <div className="captain-pick">
                <div className="confidence-badge">Confidence: {captainPicks.secondPick.confidence}%</div>
                <div className="pick-name">{captainPicks.secondPick.name}</div>
                <div className="pick-team">{captainPicks.secondPick.team}</div>
                <div className="pick-reasoning">{captainPicks.secondPick.reasoning}</div>
              </div>

              <div className="captain-pick">
                <div className="confidence-badge">Confidence: {captainPicks.thirdPick.confidence}%</div>
                <div className="pick-name">{captainPicks.thirdPick.name}</div>
                <div className="pick-team">{captainPicks.thirdPick.team}</div>
                <div className="pick-reasoning">{captainPicks.thirdPick.reasoning}</div>
              </div>
            </div>

            {/* Transfer Strategy Section */}
            <div id="transfer-strategy" className="digest-section">
              <h2 className="section-title">
                <span className="section-icon">🎯</span>
                Transfer Strategy
              </h2>
              
              {transferStrategy.suggestions.map((suggestion, index) => (
                <div key={index} className="transfer-card">
                  <div className={`priority-badge priority-${suggestion.priority}`}>
                    {suggestion.priority.toUpperCase()} PRIORITY
                  </div>
                  
                  <div className="player-section">
                    <div className="player-info">
                      <div className="player-name">{suggestion.playerOut.name}</div>
                      <div className="player-team">{suggestion.playerOut.team}</div>
                    </div>
                    <div className="player-price">£{suggestion.playerOut.price}m</div>
                    <div className="arrow">→</div>
                    <div className="player-info">
                      <div className="player-name">{suggestion.playerIn.name}</div>
                      <div className="player-team">{suggestion.playerIn.team}</div>
                    </div>
                    <div className="player-price">£{suggestion.playerIn.price}m</div>
                  </div>
                  
                  <div className="reason-box">
                    <strong>Reasoning:</strong> {suggestion.playerIn.reason}
                  </div>
                </div>
              ))}
            </div>

            {/* Injury Intelligence Section */}
            <div id="injury-report" className="digest-section">
              <h2 className="section-title">
                <span className="section-icon">🏥</span>
                Injury Intelligence
              </h2>
              
              {injuryData.map((injury, index) => (
                <div key={index} className="injury-item">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <strong>{injury.playerName} ({injury.team})</strong>
                    <span className={`injury-severity severity-${injury.severity}`}>
                      {injury.severity.toUpperCase()}
                    </span>
                  </div>
                  <div style={{ color: '#6b7280', fontSize: '14px', marginBottom: '4px' }}>
                    {injury.injury} • Expected back: {injury.expectedReturn}
                  </div>
                  <div style={{ color: '#4b5563', fontSize: '12px' }}>
                    {injury.ownership}% of managers own this player
                  </div>
                </div>
              ))}
            </div>

            {/* Market Insights Section */}
            <div id="market-insights" className="digest-section">
              <h2 className="section-title">
                <span className="section-icon">📈</span>
                Market Trends
              </h2>
              
              <h3 style={{ fontSize: '16px', color: '#1f2937', marginBottom: '15px' }}>🔥 Top Transfers In</h3>
              {marketInsights.topTransfers
                .filter(t => t.direction === 'in')
                .map((transfer, index) => (
                  <div key={index} className="market-item">
                    <div>
                      <strong>{transfer.name}</strong> ({transfer.team})
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span className="transfer-direction direction-in">IN</span>
                      <span style={{ color: '#10b981', fontWeight: '600' }}>
                        +{(transfer.transfers / 1000).toFixed(1)}k
                      </span>
                    </div>
                  </div>
                ))}
              
              <h3 style={{ fontSize: '16px', color: '#1f2937', margin: '20px 0 15px' }}>📉 Ownership Changes</h3>
              {marketInsights.ownershipTrends.map((trend, index) => (
                <div key={index} className="market-item">
                  <div>
                    <strong>{trend.name}</strong> ({trend.team})
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span className={trend.change > 0 ? 'trend-positive' : 'trend-negative'}>
                      {trend.change > 0 ? '+' : ''}{trend.change}%
                    </span>
                    <span style={{ color: '#6b7280', fontSize: '12px' }}>
                      {trend.ownership}% owned
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Fixture Analysis Section */}
            <div id="fixture-analysis" className="digest-section">
              <h2 className="section-title">
                <span className="section-icon">🎯</span>
                Fixture Difficulty Analysis
              </h2>
              
              <h3 style={{ fontSize: '16px', color: '#10b981', marginBottom: '15px' }}>✅ Easy Fixtures</h3>
              {fixtureAnalysis.easyFixtures.map((fixture, index) => (
                <div key={index} className="fixture-item fixture-easy">
                  <span>{fixture.team}</span>
                  <span>Difficulty: {fixture.difficulty}/5</span>
                </div>
              ))}
              
              <h3 style={{ fontSize: '16px', color: '#ef4444', margin: '20px 0 15px' }}>⚠️ Hard Fixtures</h3>
              {fixtureAnalysis.hardFixtures.map((fixture, index) => (
                <div key={index} className="fixture-item fixture-hard">
                  <span>{fixture.team}</span>
                  <span>Difficulty: {fixture.difficulty}/5</span>
                </div>
              ))}
            </div>

            {/* Premium Features Section (Season Pass Only) */}
            {isSeasonPass && premiumFeatures && (
              <div id="premium-features" className="digest-section">
                <h2 className="section-title">
                  <span className="section-icon">🔍</span>
                  Premium Features
                </h2>
                
                {premiumFeatures.differentials && (
                  <div>
                    <h3 style={{ fontSize: '16px', color: '#1f2937', marginBottom: '15px' }}>🎯 Differential Detectives</h3>
                    {premiumFeatures.differentials.map((diff, index) => (
                      <div key={index} className="premium-feature">
                        <div className="feature-title">{diff.name} ({diff.team})</div>
                        <div className="feature-detail">
                          {diff.ownership}% owned • Form: {diff.form}
                        </div>
                        <div className="feature-detail">{diff.reasoning}</div>
                      </div>
                    ))}
                  </div>
                )}

                {premiumFeatures.injuryIntelligence && (
                  <div style={{ marginTop: '20px' }}>
                    <h3 style={{ fontSize: '16px', color: '#1f2937', marginBottom: '15px' }}>🏥 Enhanced Injury Intelligence</h3>
                    {premiumFeatures.injuryIntelligence.map((injury, index) => (
                      <div key={index} className="premium-feature">
                        <div className="feature-title">{injury.playerName} ({injury.team})</div>
                        <div className="feature-detail">
                          Status: {injury.status} • Risk: {injury.risk}
                        </div>
                        <div className="feature-detail">{injury.recommendation}</div>
                      </div>
                    ))}
                  </div>
                )}

                {premiumFeatures.budgetGems && (
                  <div style={{ marginTop: '20px' }}>
                    <h3 style={{ fontSize: '16px', color: '#1f2937', marginBottom: '15px' }}>💎 Budget Gems Analysis</h3>
                    {premiumFeatures.budgetGems.map((gem, index) => (
                      <div key={index} className="premium-feature">
                        <div className="feature-title">{gem.name} ({gem.team})</div>
                        <div className="feature-detail">
                          {gem.position} • £{gem.price}m • Form: {gem.form}
                        </div>
                        <div className="feature-detail">Value Rating: {gem.valueRating}/10</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Gaffer's Tip */}
            <div id="gaffer-tip" className="gaffer-tip">
              <div className="gaffer-tip-title">💡 Gaffer's Weekly Tip</div>
              <div className="gaffer-tip-text">"{gafferTip}"</div>
            </div>
          </div>

          {/* Footer */}
          <div className="footer">
            <p>© 2024 Gaffer's FPL Hub. All rights reserved.</p>
            <p style={{ marginTop: '10px' }}>
              You're receiving this because you subscribed to our {tier === 'season' ? 'Season Pass' : 'First Team'} tier.
            </p>
            <p style={{ marginTop: '10px' }}>
              Want to change your subscription? <a href="#" style={{ color: '#a855f7' }}>Manage Preferences</a>
            </p>
          </div>
        </Container>
      </Body>
    </Html>
  );
};

export default WeeklyDigestEmail;


