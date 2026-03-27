import { Html, Head, Body, Container, Section, Button } from '@react-email/components';

interface DailyIntelligenceDigestProps {
  name: string;
  tier: 'paid' | 'season';
  date: string;
  priceData: {
    countdownHours: number;
    risers: Array<{ name: string; team: string; currentPrice: number; netTransfers: number; probability: number }>;
    fallers: Array<{ name: string; team: string; currentPrice: number; netTransfers: number; probability: number }>;
  };
  injuryData: Array<{
    playerName: string;
    team: string;
    injury: string;
    severity: 'minor' | 'moderate' | 'major';
    expectedReturn: string;
    ownership: number;
  }>;
  marketInsights?: {
    topTransfers: Array<{ name: string; team: string; transfers: number; direction: 'in' | 'out' }>;
    ownershipTrends: Array<{ name: string; team: string; change: number; ownership: number }>;
  };
  gafferTip?: string;
  premiumFeatures?: {
    injuryIntelligence?: Array<{ playerName: string; team: string; status: string; risk: string; recommendation: string }>;
    ownershipTrends?: Array<{ name: string; team: string; netTransfers: number; trend: string; momentum: string }>;
    budgetGems?: Array<{ name: string; team: string; position: string; price: number; form: string; valueRating: number }>;
  };
}

const DailyIntelligenceDigest = ({ 
  name, 
  tier, 
  date, 
  priceData, 
  injuryData, 
  marketInsights, 
  gafferTip,
  premiumFeatures 
}: DailyIntelligenceDigestProps) => (
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
          .premium-badge { background: linear-gradient(135deg, #f59e0b, #f97316); color: white; padding: 8px 16px; border-radius: 20px; font-weight: 600; font-size: 14px; display: inline-block; margin-bottom: 20px; }
          .section-box { background: white; border-radius: 12px; padding: 25px; margin-bottom: 20px; border-left: 4px solid #7c3aed; }
          .section-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px; }
          .section-title { font-size: 18px; font-weight: bold; color: #1f2937; }
          .countdown-badge { background: #fef3c7; color: #92400e; padding: 4px 12px; border-radius: 12px; font-size: 12px; font-weight: 600; }
          .price-item { display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; padding: 12px; background: #f9fafb; border-radius: 8px; }
          .price-info { flex: 1; }
          .price-name { font-weight: 600; color: #1f2937; font-size: 14px; }
          .price-team { color: #6b7280; font-size: 12px; }
          .price-stats { display: flex; gap: 8px; align-items: center; }
          .price-badge { padding: 4px 8px; border-radius: 12px; font-size: 11px; font-weight: 600; }
          .riser-badge { background: #d1fae5; color: #065f46; }
          .faller-badge { background: #fee2e2; color: #991b1b; }
          .injury-card { background: white; border-radius: 8px; padding: 15px; margin-bottom: 12px; border-left: 4px solid #ef4444; }
          .injury-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px; }
          .injury-name { font-weight: 600; color: #1f2937; font-size: 14px; }
          .severity-badge { display: inline-block; padding: 4px 8px; border-radius: 12px; font-size: 11px; font-weight: 600; }
          .severity-minor { background: #fef3c7; color: #92400e; }
          .severity-moderate { background: #fed7aa; color: #9a3412; }
          .severity-major { background: #fee2e2; color: #991b1b; }
          .ownership-badge { background: #dbeafe; color: #1e40af; padding: 4px 8px; border-radius: 12px; font-size: 11px; font-weight: 600; }
          .market-item { display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px; font-size: 13px; }
          .gaffer-quote { background: #fef3c7; padding: 20px; border-radius: 12px; margin: 20px 0; border-left: 4px solid #f59e0b; }
          .footer { background: #1f2937; color: white; padding: 30px; text-align: center; font-size: 12px; }
          .season-exclusive { background: linear-gradient(135deg, #f59e0b, #f97316); color: white; padding: 15px; border-radius: 8px; text-align: center; margin-bottom: 20px; font-weight: bold; }
          .feature-section { background: white; padding: 25px; border-radius: 12px; margin: 20px 0; border-left: 4px solid #7c3aed; }
          .feature-title { color: #1f2937; font-size: 18px; font-weight: bold; margin-bottom: 15px; }
          .feature-item { background: #f9fafb; padding: 12px; border-radius: 8px; margin-bottom: 10px; }
          .feature-name { font-weight: 600; color: #1f2937; font-size: 14px; }
          .feature-detail { color: #6b7280; font-size: 12px; margin-top: 4px; }
          .badge { display: inline-block; padding: 4px 8px; border-radius: 12px; font-size: 11px; font-weight: 600; margin-right: 4px; }
          .badge-risk-high { background: #fee2e2; color: #dc2626; }
          .badge-risk-medium { background: #fef3c7; color: #92400e; }
          .badge-risk-low { background: #d1fae5; color: #065f46; }
          .badge-rising { background: #d1fae5; color: #065f46; }
          .badge-falling { background: #fee2e2; color: #dc2626; }
        `}
      </style>
    </Head>
    <Body style={{ fontFamily: 'Inter, sans-serif', margin: 0, padding: 0, backgroundColor: '#f3f4f6' }}>
      <Container className="container">
        {/* Header */}
        <Section className="header">
          <div className="logo">⚽ premierleaguetables.com</div>
          {tier === 'season' && <div className="premium-badge">🎫 PAID TIER EXCLUSIVE</div>}
          <h1 className="title">📈 Daily Intelligence Digest</h1>
          <p className="subtitle">{date} - Your morning FPL briefing</p>
        </Section>

        {/* Content */}
        <Section className="content">
          {/* Welcome Message */}
          <div style={{ textAlign: 'center', marginBottom: '30px' }}>
            <h2 style={{ color: '#1f2937', marginBottom: '10px' }}>Good morning, {name}!</h2>
            <p style={{ color: '#6b7280' }}>Here's your daily dose of FPL intelligence to dominate your mini-league.</p>
          </div>

          {/* Price Change Intelligence */}
          <div className="section-box">
            <div className="section-header">
              <h3 className="section-title">📊 Price Change Intelligence</h3>
              <span className="countdown-badge">{priceData.countdownHours}h until changes</span>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <h4 style={{ color: '#065f46', marginBottom: '10px', fontSize: '14px' }}>📈 Predicted Risers:</h4>
              {priceData.risers.map((player, index) => (
                <div key={index} className="price-item">
                  <div className="price-info">
                    <div className="price-name">{player.name}</div>
                    <div className="price-team">{player.team}</div>
                  </div>
                  <div className="price-stats">
                    <span className="price-badge riser-badge">+{player.netTransfers}k</span>
                    <span className="price-badge riser-badge">{player.probability}%</span>
                    <span className="price-badge" style={{ background: '#dbeafe', color: '#1e40af' }}>
                      £{player.currentPrice}m
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <div>
              <h4 style={{ color: '#991b1b', marginBottom: '10px', fontSize: '14px' }}>📉 Predicted Fallers:</h4>
              {priceData.fallers.map((player, index) => (
                <div key={index} className="price-item">
                  <div className="price-info">
                    <div className="price-name">{player.name}</div>
                    <div className="price-team">{player.team}</div>
                  </div>
                  <div className="price-stats">
                    <span className="price-badge faller-badge">{player.netTransfers}k</span>
                    <span className="price-badge faller-badge">{player.probability}%</span>
                    <span className="price-badge" style={{ background: '#dbeafe', color: '#1e40af' }}>
                      £{player.currentPrice}m
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <p style={{ fontSize: '12px', color: '#6b7280', marginTop: '15px', fontStyle: 'italic' }}>
              💡 Buy risers before 1:30 AM GMT to avoid price increases!
            </p>
          </div>

          {/* Injury Intelligence */}
          <div className="section-box">
            <h3 className="section-title">🏥 Injury Intelligence</h3>
            
            {injuryData.map((injury, index) => (
              <div key={index} className="injury-card">
                <div className="injury-header">
                  <div className="injury-name">🚨 {injury.playerName}</div>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <span className={`severity-badge severity-${injury.severity}`}>
                      {injury.severity === 'major' ? '🔴 Major' : injury.severity === 'moderate' ? '🟡 Moderate' : '🟢 Minor'}
                    </span>
                    <span className="ownership-badge">{injury.ownership}% owned</span>
                  </div>
                </div>
                <p style={{ margin: '0 0 8px 0', color: '#1f2937', fontSize: '13px' }}>
                  <strong>Injury:</strong> {injury.injury}
                </p>
                <p style={{ margin: 0, color: '#6b7280', fontSize: '12px' }}>
                  <strong>Expected Return:</strong> {injury.expectedReturn}
                </p>
                
                {tier === 'season' && (
                  <div style={{ marginTop: '10px', padding: '8px', background: '#f0f9ff', borderRadius: '6px' }}>
                    <p style={{ margin: 0, fontSize: '12px', color: '#1e40af', fontWeight: '600' }}>
                      💡 Season Pass Recommendation:
                    </p>
                    <p style={{ margin: '3px 0 0 0', fontSize: '12px', color: '#1e40af' }}>
                      {injury.severity === 'major' 
                        ? `Transfer out immediately - season-ender!`
                        : injury.severity === 'moderate'
                        ? `Monitor closely. Consider transfer if you have other fires.`
                        : `Keep for now. Minor knock, don't waste transfer.`
                      }
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Market Insights (Paid Tier Exclusive) */}
          {tier === 'season' && marketInsights && (
            <div className="season-exclusive">
              🎫 PAID TIER EXCLUSIVE: Advanced Market Analysis
            </div>
          )}

          {tier === 'season' && marketInsights && (
            <div className="section-box">
              <h3 className="section-title">📊 Market Trends & Analysis</h3>
              
              <div style={{ marginBottom: '20px' }}>
                <h4 style={{ color: '#1e40af', marginBottom: '10px', fontSize: '14px' }}>🔥 Top Transfers Today:</h4>
                {marketInsights.topTransfers.map((transfer, index) => (
                  <div key={index} className="market-item">
                    <span>{transfer.name} ({transfer.team})</span>
                    <span style={{ 
                      color: transfer.direction === 'in' ? '#065f46' : '#991b1b',
                      fontWeight: '600'
                    }}>
                      {transfer.direction === 'in' ? '+' : '-'}{transfer.transfers}k
                    </span>
                  </div>
                ))}
              </div>

              <div>
                <h4 style={{ color: '#1e40af', marginBottom: '10px', fontSize: '14px' }}>📈 Ownership Trends:</h4>
                {marketInsights.ownershipTrends.map((trend, index) => (
                  <div key={index} className="market-item">
                    <span>{trend.name} ({trend.team})</span>
                    <span style={{ 
                      color: trend.change > 0 ? '#065f46' : '#991b1b',
                      fontWeight: '600'
                    }}>
                      {trend.change > 0 ? '+' : ''}{trend.change}% → {trend.ownership}%
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Premium Features */}
          {premiumFeatures && (
            <>
              {/* Enhanced Injury Intelligence */}
              {premiumFeatures.injuryIntelligence && premiumFeatures.injuryIntelligence.length > 0 && (
                <div className="feature-section" style={{ borderLeftColor: '#ef4444' }}>
                  <h3 className="feature-title">🏥 The Physio Room - Enhanced Injury Intelligence</h3>
                  {premiumFeatures.injuryIntelligence.map((injury, index) => (
                    <div key={index} className="feature-item">
                      <div className="feature-name">
                        {injury.playerName} ({injury.team})
                        <span className={`badge badge-risk-${injury.risk}`} style={{ marginLeft: '8px' }}>
                          {injury.risk === 'high' ? '🔴 High Risk' : injury.risk === 'medium' ? '🟡 Medium Risk' : '🟢 Low Risk'}
                        </span>
                      </div>
                      <div className="feature-detail">{injury.status}</div>
                      <div className="feature-detail" style={{ marginTop: '6px', fontWeight: '600', color: '#1f2937' }}>
                        💡 {injury.recommendation}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Ownership Trend Analysis */}
              {premiumFeatures.ownershipTrends && premiumFeatures.ownershipTrends.length > 0 && (
                <div className="feature-section" style={{ borderLeftColor: '#3b82f6' }}>
                  <h3 className="feature-title">📈 Ownership Trend Analysis - Market Movement</h3>
                  {premiumFeatures.ownershipTrends.slice(0, 8).map((trend, index) => (
                    <div key={index} className="feature-item">
                      <div className="feature-name">
                        {trend.name} ({trend.team})
                        <span className={`badge badge-${trend.trend}`} style={{ marginLeft: '8px' }}>
                          {trend.trend === 'rising' ? '📈 Rising' : '📉 Falling'}
                        </span>
                        <span className="badge" style={{ background: '#f3f4f6', color: '#1f2937' }}>
                          {trend.momentum === 'strong' ? '⚡ Strong' : trend.momentum === 'moderate' ? '➡️ Moderate' : '💨 Weak'}
                        </span>
                      </div>
                      <div className="feature-detail">
                        Net Transfers: {trend.netTransfers > 0 ? '+' : ''}{trend.netTransfers.toLocaleString()}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Budget Gems Analysis */}
              {premiumFeatures.budgetGems && premiumFeatures.budgetGems.length > 0 && (
                <div className="feature-section" style={{ borderLeftColor: '#10b981' }}>
                  <h3 className="feature-title">💎 Budget Gems Analysis - Best Value Players</h3>
                  {premiumFeatures.budgetGems.map((gem, index) => (
                    <div key={index} className="feature-item">
                      <div className="feature-name">
                        {gem.name} ({gem.team}) - £{gem.price}m
                        <span className="badge" style={{ background: '#d1fae5', color: '#065f46', marginLeft: '8px' }}>
                          {gem.position}
                        </span>
                        <span className="badge" style={{ background: '#fef3c7', color: '#92400e' }}>
                          Form: {gem.form}
                        </span>
                      </div>
                      <div className="feature-detail">
                        Value Rating: {gem.valueRating} pts/£m | Form: {gem.form}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}

          {/* Gaffer's Daily Tip */}
          <div className="gaffer-quote">
            <h3 style={{ color: '#92400e', marginBottom: '10px' }}>🗣️ The Gaffer's Daily Tip:</h3>
            <p style={{ color: '#92400e', fontStyle: 'italic', marginBottom: '10px', lineHeight: '1.6' }}>
              {gafferTip || "Today's market is all about timing. The smart managers are buying risers now, not after the price changes. Don't follow the herd - lead it! Your mini-league rivals are sleeping on these opportunities."}
            </p>
            <p style={{ color: '#92400e', fontWeight: 'bold', margin: 0 }}>— The Gaffer</p>
          </div>

          {/* Upgrade CTA for First Team */}
          {tier === 'paid' && (
            <div style={{ background: 'linear-gradient(135deg, #fef3c7, #fde68a)', padding: '25px', borderRadius: '12px', textAlign: 'center', marginTop: '30px' }}>
              <h3 style={{ color: '#92400e', marginBottom: '10px' }}>🎫 Want Advanced Market Analysis?</h3>
              <p style={{ color: '#92400e', marginBottom: '20px', fontSize: '14px' }}>
                Upgrade to Season Pass for xG/xA data, personalized recommendations, and priority algorithm access.
              </p>
              <Button href="https://premierleaguetables.com/upgrade" style={{ background: '#92400e', color: 'white', padding: '14px 28px', borderRadius: '8px', textDecoration: 'none', fontWeight: '600', display: 'inline-block', fontSize: '14px' }}>
                Upgrade to Season Pass - £49.99/year
              </Button>
              <p style={{ fontSize: '12px', color: '#92400e', marginTop: '15px' }}>
                Save £13.89 vs monthly • Advanced analytics • Priority access
              </p>
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
          <p style={{ marginTop: '15px', fontSize: '11px', color: '#6b7280' }}>
            Daily Intelligence Digest - Sent at 8 AM GMT
          </p>
        </Section>
      </Container>
    </Body>
  </Html>
);

export default DailyIntelligenceDigest;


