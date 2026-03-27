import { Html, Head, Body, Container, Section, Text, Button, Row, Column } from '@react-email/components';
import { MOCK_PLAYERS, FPLPlayer } from '../data/playerData';

interface WeeklyCaptainPicksProps {
  name: string;
  email: string;
  tier: 'free' | 'paid' | 'season';
  gameweek: number;
  captainPicks: {
    topPick: { name: string; team: string; confidence: number; reasoning: string };
    secondPick: { name: string; team: string; confidence: number; reasoning: string };
    thirdPick: { name: string; team: string; confidence: number; reasoning: string };
  };
  pricePredictions?: {
    risers: Array<{ name: string; team: string; probability: number }>;
    fallers: Array<{ name: string; team: string; probability: number }>;
  };
  premiumFeatures?: {
    differentials?: Array<{ name: string; team: string; ownership: number; form: string; reasoning: string }>;
    setPiece?: Array<{ name: string; team: string; penalties: boolean; corners: boolean; freeKicks: boolean }>;
    captaincyMatrix?: Array<{ name: string; team: string; captaincyScore: number; reasoning: string }>;
    formTracker?: { hot: Array<{ name: string; team: string; form: string }>; cold: Array<{ name: string; team: string; form: string }> };
  };
}

// Free Features Helper Functions
const getPriceMovements = () => {
  const risers = MOCK_PLAYERS
    .filter(p => p.transfers_in > p.transfers_out * 2)
    .sort((a, b) => (b.transfers_in - b.transfers_out) - (a.transfers_in - a.transfers_out))
    .slice(0, 5);
    
  const fallers = MOCK_PLAYERS
    .filter(p => p.transfers_out > p.transfers_in * 2)
    .sort((a, b) => (a.transfers_out - a.transfers_in) - (b.transfers_out - b.transfers_in))
    .slice(0, 5);
    
  return { risers, fallers };
};

const getInjuryNews = () => {
  return MOCK_PLAYERS
    .filter(p => p.news && (p.minutes < 100 || p.starts < 5))
    .map(p => ({
      name: p.web_name,
      team: p.team,
      news: p.news,
      ownership: p.selected_by_percent,
      severity: p.minutes < 50 ? 'Major' : 'Minor'
    }))
    .slice(0, 8);
};

const getTopPerformers = () => {
  return MOCK_PLAYERS
    .sort((a, b) => parseFloat(b.form) - parseFloat(a.form))
    .slice(0, 10)
    .map(p => ({
      name: p.web_name,
      team: p.team,
      position: p.position,
      form: p.form,
      points: p.total_points,
      price: p.now_cost,
      ownership: p.selected_by_percent
    }));
};

const getMarketTrends = () => {
  const rising = MOCK_PLAYERS
    .filter(p => p.transfers_in - p.transfers_out > 1000)
    .sort((a, b) => (b.transfers_in - b.transfers_out) - (a.transfers_in - a.transfers_out))
    .slice(0, 5);
    
  const falling = MOCK_PLAYERS
    .filter(p => p.transfers_out - p.transfers_in > 1000)
    .sort((a, b) => (a.transfers_out - a.transfers_in) - (b.transfers_out - b.transfers_in))
    .slice(0, 5);
    
  return { rising, falling };
};

const getFixtureDifficulty = () => {
  // Mock fixture difficulty data
  const teams = ['Man City', 'Arsenal', 'Liverpool', 'Chelsea', 'Man Utd', 'Spurs', 'Newcastle', 'Aston Villa'];
  return teams.map(team => ({
    team,
    difficulty: Math.random() > 0.6 ? 'Hard' : Math.random() > 0.3 ? 'Moderate' : 'Easy',
    rating: Math.floor(Math.random() * 3) + 3
  })).sort((a, b) => a.rating - b.rating);
};

const getWeatherImpact = () => {
  // Mock weather data
  const conditions = ['Clear', 'Rainy', 'Windy', 'Snow', 'Overcast'];
  const teams = ['Man City', 'Arsenal', 'Liverpool', 'Chelsea', 'Man Utd'];
  return teams.map(team => ({
    team,
    condition: conditions[Math.floor(Math.random() * conditions.length)],
    impact: Math.random() > 0.7 ? 'High' : Math.random() > 0.4 ? 'Medium' : 'Low',
    recommendation: Math.random() > 0.5 ? 'Favor defenders' : 'Favor attackers'
  }));
};

const getLiveScores = () => {
  // Mock live score data
  return [
    { homeTeam: 'Man City', awayTeam: 'Arsenal', homeScore: 2, awayScore: 1, minute: 67 },
    { homeTeam: 'Liverpool', awayTeam: 'Chelsea', homeScore: 1, awayScore: 1, minute: 45 },
    { homeTeam: 'Man Utd', awayTeam: 'Spurs', homeScore: 0, awayScore: 2, minute: 78 }
  ];
};

const getPlayerComparisons = () => {
  // Compare similar players
  const comparisons = [
    { player1: MOCK_PLAYERS.find(p => p.web_name === 'Haaland'), player2: MOCK_PLAYERS.find(p => p.web_name === 'Salah') },
    { player1: MOCK_PLAYERS.find(p => p.web_name === 'Saka'), player2: MOCK_PLAYERS.find(p => p.web_name === 'Palmer') }
  ];
  
  return comparisons.map(comp => ({
    player1: {
      name: comp.player1.web_name,
      team: comp.player1.team,
      points: comp.player1.total_points,
      form: comp.player1.form,
      price: comp.player1.now_cost,
      value: (comp.player1.total_points / comp.player1.now_cost).toFixed(2)
    },
    player2: {
      name: comp.player2.web_name,
      team: comp.player2.team,
      points: comp.player2.total_points,
      form: comp.player2.form,
      price: comp.player2.now_cost,
      value: (comp.player2.total_points / comp.player2.now_cost).toFixed(2)
    }
  }));
};

const WeeklyCaptainPicks = ({ name, tier, gameweek, captainPicks, pricePredictions, premiumFeatures }: WeeklyCaptainPicksProps) => (
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
          .captain-card { background: white; border-radius: 12px; padding: 25px; margin-bottom: 20px; border-left: 4px solid #3b82f6; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
          .captain-name { font-size: 20px; font-weight: bold; color: #1f2937; margin-bottom: 5px; }
          .captain-team { color: #6b7280; font-size: 14px; margin-bottom: 10px; }
          .confidence-bar { background: #e5e7eb; height: 8px; border-radius: 4px; margin: 10px 0; overflow: hidden; }
          .confidence-fill { background: linear-gradient(135deg, #10b981, #059669); height: 100%; border-radius: 4px; }
          .reasoning { color: #4b5563; font-size: 14px; line-height: 1.5; margin-top: 10px; font-style: italic; }
          .gaffer-quote { background: #fef3c7; padding: 20px; border-radius: 12px; margin: 20px 0; border-left: 4px solid #f59e0b; }
          .gaffer-text { color: #92400e; font-style: italic; margin-bottom: 10px; }
          .price-section { background: #f0f9ff; padding: 25px; border-radius: 12px; margin: 20px 0; border-left: 4px solid #3b82f6; }
          .price-item { display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px; }
          .price-probability { background: #dbeafe; color: #1e40af; padding: 4px 8px; border-radius: 12px; font-size: 12px; font-weight: 600; }
          .feature-section { background: white; padding: 25px; border-radius: 12px; margin: 20px 0; border-left: 4px solid #7c3aed; }
          .feature-title { color: #1f2937; font-size: 18px; font-weight: bold; margin-bottom: 15px; }
          .feature-item { background: #f9fafb; padding: 12px; border-radius: 8px; margin-bottom: 10px; }
          .feature-name { font-weight: 600; color: #1f2937; font-size: 14px; }
          .feature-detail { color: #6b7280; font-size: 12px; margin-top: 4px; }
          .badge { display: inline-block; padding: 4px 8px; border-radius: 12px; font-size: 11px; font-weight: 600; margin-right: 4px; }
          .badge-rising { background: #d1fae5; color: #065f46; }
          .badge-falling { background: #fee2e2; color: #dc2626; }
          .badge-major { background: #fee2e2; color: #dc2626; }
          .badge-minor { background: #fef3c7; color: #92400e; }
          .badge-easy { background: #d1fae5; color: #065f46; }
          .badge-moderate { background: #fef3c7; color: #92400e; }
          .badge-hard { background: #fee2e2; color: #dc2626; }
          .badge-high { background: #fee2e2; color: #dc2626; }
          .badge-medium { background: #fef3c7; color: #92400e; }
          .badge-low { background: #d1fae5; color: #065f46; }
          .comparison-table { width: 100%; border-collapse: collapse; margin-top: 10px; }
          .comparison-table th { background: #f3f4f6; padding: 8px; text-align: left; font-size: 12px; font-weight: 600; }
          .comparison-table td { padding: 8px; border-bottom: 1px solid #e5e7eb; font-size: 12px; }
          .live-score { background: #f0f9ff; padding: 15px; border-radius: 8px; margin-bottom: 10px; border-left: 4px solid #3b82f6; }
          .score-team { font-weight: 600; color: #1f2937; }
          .score-result { font-size: 18px; font-weight: bold; color: #3b82f6; margin: 0 10px; }
          .score-minute { color: #6b7280; font-size: 12px; }
          .badge { display: inline-block; padding: 4px 8px; border-radius: 12px; font-size: 11px; font-weight: 600; margin-right: 4px; }
          .badge-hot { background: #fee2e2; color: #dc2626; }
          .badge-cold { background: #dbeafe; color: #1e40af; }
          .badge-differential { background: #d1fae5; color: #065f46; }
          .cta-section { background: white; padding: 30px; text-align: center; border-radius: 12px; margin-top: 30px; }
          .cta-button { background: linear-gradient(135deg, #1e40af, #3b82f6); color: white; padding: 16px 32px; border-radius: 8px; text-decoration: none; font-weight: 600; display: inline-block; }
          .footer { background: #1f2937; color: white; padding: 30px; text-align: center; font-size: 12px; }
          .early-access { background: linear-gradient(135deg, #dc2626, #ef4444); color: white; padding: 15px; border-radius: 8px; text-align: center; margin-bottom: 20px; font-weight: bold; }
        `}
      </style>
    </Head>
    <Body style={{ fontFamily: 'Inter, sans-serif', margin: 0, padding: 0, backgroundColor: '#f3f4f6' }}>
      <Container className="container">
        {/* Header */}
        <Section className="header">
          <div className="logo">⚽ premierleaguetables.com</div>
          {tier === 'paid' && <div className="premium-badge">⭐ FIRST TEAM MEMBER</div>}
          {tier === 'season' && <div className="premium-badge">🎫 SEASON PASS MEMBER</div>}
          <h1 className="title">
            {tier === 'free' ? "👑 This Week's Captain Picks" : "🚨 EARLY Captain Picks"}
          </h1>
          <p className="subtitle">Gameweek {gameweek} {tier === 'free' ? '- Saturday Morning' : '- Friday 6 PM (24h Early)'}</p>
        </Section>

        {/* Content */}
        <Section className="content">
          {tier !== 'free' && (
            <div className="early-access">
              🚨 EARLY ACCESS: You're getting these 24 hours before free users!
            </div>
          )}

          {/* Top Pick */}
          <div className="captain-card" style={{ borderLeftColor: '#10b981' }}>
            <div className="captain-name">🥇 {captainPicks.topPick.name}</div>
            <div className="captain-team">{captainPicks.topPick.team}</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
              <span style={{ fontWeight: '600', color: '#1f2937' }}>Confidence:</span>
              <span style={{ color: '#10b981', fontWeight: 'bold' }}>{captainPicks.topPick.confidence}%</span>
            </div>
            <div className="confidence-bar">
              <div className="confidence-fill" style={{ width: `${captainPicks.topPick.confidence}%` }}></div>
            </div>
            <div className="reasoning">{captainPicks.topPick.reasoning}</div>
          </div>

          {/* Second Pick */}
          <div className="captain-card" style={{ borderLeftColor: '#3b82f6' }}>
            <div className="captain-name">🥈 {captainPicks.secondPick.name}</div>
            <div className="captain-team">{captainPicks.secondPick.team}</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
              <span style={{ fontWeight: '600', color: '#1f2937' }}>Confidence:</span>
              <span style={{ color: '#3b82f6', fontWeight: 'bold' }}>{captainPicks.secondPick.confidence}%</span>
            </div>
            <div className="confidence-bar">
              <div className="confidence-fill" style={{ width: `${captainPicks.secondPick.confidence}%`, background: 'linear-gradient(135deg, #3b82f6, #1e40af)' }}></div>
            </div>
            <div className="reasoning">{captainPicks.secondPick.reasoning}</div>
          </div>

          {/* Third Pick */}
          <div className="captain-card" style={{ borderLeftColor: '#f59e0b' }}>
            <div className="captain-name">🥉 {captainPicks.thirdPick.name}</div>
            <div className="captain-team">{captainPicks.thirdPick.team}</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
              <span style={{ fontWeight: '600', color: '#1f2937' }}>Confidence:</span>
              <span style={{ color: '#f59e0b', fontWeight: 'bold' }}>{captainPicks.thirdPick.confidence}%</span>
            </div>
            <div className="confidence-bar">
              <div className="confidence-fill" style={{ width: `${captainPicks.thirdPick.confidence}%`, background: 'linear-gradient(135deg, #f59e0b, #f97316)' }}></div>
            </div>
            <div className="reasoning">{captainPicks.thirdPick.reasoning}</div>
          </div>

          {/* Gaffer's Quote */}
          <div className="gaffer-quote">
            <h3 style={{ color: '#92400e', marginBottom: '10px' }}>🗣️ The Gaffer Says:</h3>
            <p className="gaffer-text">
              "Look at this week's captaincy - it's as clear as day! {captainPicks.topPick.name} is practically printing points this week. 
              If you don't captain him, you might as well set fire to your mini-league chances. The data doesn't lie, but I've been saying this for weeks!"
            </p>
            <p style={{ color: '#92400e', fontWeight: 'bold', margin: 0 }}>— The Gaffer</p>
          </div>

          {/* Premium Features (Paid & Season Pass Only) */}
          {tier !== 'free' && premiumFeatures && (
            <>
              {/* Captaincy Matrix */}
              {premiumFeatures.captaincyMatrix && premiumFeatures.captaincyMatrix.length > 0 && (
                <div className="feature-section">
                  <h3 className="feature-title">🎪 Captaincy Matrix - Data-Driven Rankings</h3>
                  {premiumFeatures.captaincyMatrix.slice(0, 5).map((captain, index) => (
                    <div key={index} className="feature-item">
                      <div className="feature-name">
                        {index + 1}. {captain.name} ({captain.team}) - Score: {captain.captaincyScore}
                      </div>
                      <div className="feature-detail">{captain.reasoning}</div>
                    </div>
                  ))}
                </div>
              )}

              {/* Differential Detectives */}
              {premiumFeatures.differentials && premiumFeatures.differentials.length > 0 && (
                <div className="feature-section" style={{ borderLeftColor: '#10b981' }}>
                  <h3 className="feature-title">🔍 Differential Detectives - Low Ownership Gems</h3>
                  {premiumFeatures.differentials.map((diff, index) => (
                    <div key={index} className="feature-item">
                      <div className="feature-name">
                        {diff.name} ({diff.team}) - {diff.ownership}% owned
                        <span className="badge badge-differential" style={{ marginLeft: '8px' }}>Form: {diff.form}</span>
                      </div>
                      <div className="feature-detail">{diff.reasoning}</div>
                    </div>
                  ))}
                </div>
              )}

              {/* Set-Piece Specialists */}
              {premiumFeatures.setPiece && premiumFeatures.setPiece.length > 0 && (
                <div className="feature-section" style={{ borderLeftColor: '#f59e0b' }}>
                  <h3 className="feature-title">🎯 Set-Piece Specialists - Who Takes What</h3>
                  {premiumFeatures.setPiece.map((sp, index) => (
                    <div key={index} className="feature-item">
                      <div className="feature-name">{sp.name} ({sp.team})</div>
                      <div className="feature-detail">
                        {sp.penalties && <span className="badge" style={{ background: '#fef3c7', color: '#92400e' }}>⚽ Penalties</span>}
                        {sp.corners && <span className="badge" style={{ background: '#dbeafe', color: '#1e40af' }}>🏴 Corners</span>}
                        {sp.freeKicks && <span className="badge" style={{ background: '#d1fae5', color: '#065f46' }}>🎯 Free Kicks</span>}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Form Tracker */}
              {premiumFeatures.formTracker && (
                <div className="feature-section" style={{ borderLeftColor: '#ef4444' }}>
                  <h3 className="feature-title">🔥 Hot/Cold Form Tracker</h3>
                  <div style={{ marginBottom: '15px' }}>
                    <h4 style={{ color: '#dc2626', fontSize: '14px', marginBottom: '8px' }}>🔥 Red Hot:</h4>
                    {premiumFeatures.formTracker.hot.map((player, index) => (
                      <div key={index} className="feature-item">
                        <div className="feature-name">
                          {player.name} ({player.team})
                          <span className="badge badge-hot" style={{ marginLeft: '8px' }}>Form: {player.form}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div>
                    <h4 style={{ color: '#1e40af', fontSize: '14px', marginBottom: '8px' }}>❄️ Ice Cold:</h4>
                    {premiumFeatures.formTracker.cold.map((player, index) => (
                      <div key={index} className="feature-item">
                        <div className="feature-name">
                          {player.name} ({player.team})
                          <span className="badge badge-cold" style={{ marginLeft: '8px' }}>Form: {player.form}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}

          {/* Price Predictions (Paid Only) */}
          {tier !== 'free' && pricePredictions && (
            <div className="price-section">
              <h3 style={{ color: '#1e40af', marginBottom: '15px' }}>📈 Price Change Predictions</h3>
              
              <div style={{ marginBottom: '20px' }}>
                <h4 style={{ color: '#10b981', marginBottom: '10px' }}>📈 Predicted Risers:</h4>
                {pricePredictions.risers.map((player, index) => (
                  <div key={index} className="price-item">
                    <span>{player.name} ({player.team})</span>
                    <span className="price-probability">+{player.probability}%</span>
                  </div>
                ))}
              </div>

              <div>
                <h4 style={{ color: '#ef4444', marginBottom: '10px' }}>📉 Predicted Fallers:</h4>
                {pricePredictions.fallers.map((player, index) => (
                  <div key={index} className="price-item">
                    <span>{player.name} ({player.team})</span>
                    <span className="price-probability" style={{ background: '#fee2e2', color: '#dc2626' }}>-{player.probability}%</span>
                  </div>
                ))}
              </div>

              <p style={{ fontSize: '12px', color: '#6b7280', marginTop: '15px', fontStyle: 'italic' }}>
                Price changes happen at 1:30 AM GMT. Buy risers before they increase!
              </p>
            </div>
          )}

          {/* Free Features - Basic Content */}
          {tier === 'free' && (() => {
            const priceMovements = getPriceMovements();
            const injuryNews = getInjuryNews();
            const topPerformers = getTopPerformers();
            const marketTrends = getMarketTrends();
            const fixtureDifficulty = getFixtureDifficulty();
            const weatherImpact = getWeatherImpact();
            const liveScores = getLiveScores();
            const playerComparisons = getPlayerComparisons();
            
            return (
              <>
                {/* Live Price Updates & Market Trends */}
                <div className="feature-section" style={{ borderLeftColor: '#3b82f6' }}>
                  <h3 className="feature-title">📈 Live Price Updates & Market Trends</h3>
                  
                  <div style={{ marginBottom: '15px' }}>
                    <h4 style={{ color: '#10b981', fontSize: '14px', marginBottom: '8px' }}>📈 Top Risers:</h4>
                    {priceMovements.risers.map((player, index) => (
                      <div key={index} className="feature-item">
                        <div className="feature-name">
                          {player.web_name} ({player.team}) - £{player.now_cost}m
                          <span className="badge badge-rising" style={{ marginLeft: '8px' }}>
                            +{((player.transfers_in - player.transfers_out) / 1000).toFixed(1)}k
                          </span>
                          <span className="badge" style={{ background: '#dbeafe', color: '#1e40af' }}>
                            {player.selected_by_percent}% owned
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div>
                    <h4 style={{ color: '#ef4444', fontSize: '14px', marginBottom: '8px' }}>📉 Top Fallers:</h4>
                    {priceMovements.fallers.map((player, index) => (
                      <div key={index} className="feature-item">
                        <div className="feature-name">
                          {player.web_name} ({player.team}) - £{player.now_cost}m
                          <span className="badge badge-falling" style={{ marginLeft: '8px' }}>
                            -{((player.transfers_out - player.transfers_in) / 1000).toFixed(1)}k
                          </span>
                          <span className="badge" style={{ background: '#dbeafe', color: '#1e40af' }}>
                            {player.selected_by_percent}% owned
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Injury News & Team Updates */}
                <div className="feature-section" style={{ borderLeftColor: '#ef4444' }}>
                  <h3 className="feature-title">🏥 Injury News & Team Updates</h3>
                  {injuryNews.map((injury, index) => (
                    <div key={index} className="feature-item">
                      <div className="feature-name">
                        🚨 {injury.name} ({injury.team})
                        <span className={`badge badge-${injury.severity.toLowerCase()}`} style={{ marginLeft: '8px' }}>
                          {injury.severity}
                        </span>
                        <span className="badge" style={{ background: '#dbeafe', color: '#1e40af' }}>
                          {injury.ownership}% owned
                        </span>
                      </div>
                      <div className="feature-detail">{injury.news}</div>
                    </div>
                  ))}
                </div>

                {/* Live Match Scores & Goal Events */}
                <div className="feature-section" style={{ borderLeftColor: '#10b981' }}>
                  <h3 className="feature-title">⚽ Live Match Scores & Goal Events</h3>
                  {liveScores.map((match, index) => (
                    <div key={index} className="live-score">
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <div className="score-team">{match.homeTeam}</div>
                        <div className="score-result">{match.homeScore} - {match.awayScore}</div>
                        <div className="score-team">{match.awayTeam}</div>
                      </div>
                      <div className="score-minute">Minute {match.minute}</div>
                    </div>
                  ))}
                  <p style={{ fontSize: '12px', color: '#6b7280', fontStyle: 'italic', marginTop: '10px' }}>
                    Live scores update every 5 minutes during matches
                  </p>
                </div>

                {/* Player Comparison Tools */}
                <div className="feature-section" style={{ borderLeftColor: '#f59e0b' }}>
                  <h3 className="feature-title">⚖️ Player Comparison Tools</h3>
                  {playerComparisons.map((comparison, index) => (
                    <div key={index} className="feature-item">
                      <h4 style={{ color: '#1f2937', fontSize: '14px', marginBottom: '8px' }}>
                        {comparison.player1.name} vs {comparison.player2.name}
                      </h4>
                      <table className="comparison-table">
                        <thead>
                          <tr>
                            <th>Player</th>
                            <th>Team</th>
                            <th>Points</th>
                            <th>Form</th>
                            <th>Price</th>
                            <th>Value</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td style={{ fontWeight: '600' }}>{comparison.player1.name}</td>
                            <td>{comparison.player1.team}</td>
                            <td>{comparison.player1.points}</td>
                            <td>{comparison.player1.form}</td>
                            <td>£{comparison.player1.price}m</td>
                            <td style={{ color: parseFloat(comparison.player1.value) > parseFloat(comparison.player2.value) ? '#065f46' : '#dc2626' }}>
                              {comparison.player1.value}
                            </td>
                          </tr>
                          <tr>
                            <td style={{ fontWeight: '600' }}>{comparison.player2.name}</td>
                            <td>{comparison.player2.team}</td>
                            <td>{comparison.player2.points}</td>
                            <td>{comparison.player2.form}</td>
                            <td>£{comparison.player2.price}m</td>
                            <td style={{ color: parseFloat(comparison.player2.value) > parseFloat(comparison.player1.value) ? '#065f46' : '#dc2626' }}>
                              {comparison.player2.value}
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  ))}
                </div>

                {/* Basic Player Statistics & Form */}
                <div className="feature-section" style={{ borderLeftColor: '#10b981' }}>
                  <h3 className="feature-title">📊 Basic Player Statistics & Form</h3>
                  {topPerformers.map((player, index) => (
                    <div key={index} className="feature-item">
                      <div className="feature-name">
                        {index + 1}. {player.name} ({player.team})
                        <span className="badge" style={{ background: '#dbeafe', color: '#1e40af', marginLeft: '8px' }}>
                          {player.position}
                        </span>
                        <span className="badge" style={{ background: '#fef3c7', color: '#92400e' }}>
                          Form: {player.form}
                        </span>
                      </div>
                      <div className="feature-detail">
                        Points: {player.points} | Price: £{player.price}m | {player.ownership}% owned
                      </div>
                    </div>
                  ))}
                </div>

                {/* Fixture Difficulty Ratings */}
                <div className="feature-section" style={{ borderLeftColor: '#3b82f6' }}>
                  <h3 className="feature-title">🎯 Fixture Difficulty Ratings</h3>
                  {fixtureDifficulty.map((fixture, index) => (
                    <div key={index} className="feature-item">
                      <div className="feature-name">
                        {fixture.team}
                        <span className={`badge badge-${fixture.difficulty.toLowerCase()}`} style={{ marginLeft: '8px' }}>
                          {fixture.difficulty}
                        </span>
                        <span className="badge" style={{ background: '#f3f4f6', color: '#1f2937' }}>
                          FDR: {fixture.rating}/5
                        </span>
                      </div>
                    </div>
                  ))}
                  <p style={{ fontSize: '12px', color: '#6b7280', fontStyle: 'italic', marginTop: '10px' }}>
                    FDR = Fixture Difficulty Rating (1=Easy, 5=Hard)
                  </p>
                </div>

                {/* Weather Impact Analysis */}
                <div className="feature-section" style={{ borderLeftColor: '#6b7280' }}>
                  <h3 className="feature-title">🌤️ Weather Impact Analysis</h3>
                  {weatherImpact.map((weather, index) => (
                    <div key={index} className="feature-item">
                      <div className="feature-name">
                        {weather.team}
                        <span className="badge" style={{ background: '#f3f4f6', color: '#1f2937', marginLeft: '8px' }}>
                          {weather.condition}
                        </span>
                        <span className={`badge badge-${weather.impact.toLowerCase()}`}>
                          Impact: {weather.impact}
                        </span>
                      </div>
                      <div className="feature-detail">
                        💡 {weather.recommendation}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Market Trends Summary */}
                <div className="feature-section" style={{ borderLeftColor: '#8b5cf6' }}>
                  <h3 className="feature-title">📈 Market Trends Summary</h3>
                  
                  <div style={{ marginBottom: '15px' }}>
                    <h4 style={{ color: '#10b981', fontSize: '14px', marginBottom: '8px' }}>📈 Rising Stars:</h4>
                    {marketTrends.rising.map((player, index) => (
                      <div key={index} className="feature-item">
                        <div className="feature-name">
                          {player.web_name} ({player.team})
                          <span className="badge badge-rising" style={{ marginLeft: '8px' }}>
                            +{((player.transfers_in - player.transfers_out) / 1000).toFixed(1)}k
                          </span>
                        </div>
                        <div className="feature-detail">
                          Ownership: {player.selected_by_percent}% | Price: £{player.now_cost}m
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div>
                    <h4 style={{ color: '#ef4444', fontSize: '14px', marginBottom: '8px' }}>📉 Falling Stars:</h4>
                    {marketTrends.falling.map((player, index) => (
                      <div key={index} className="feature-item">
                        <div className="feature-name">
                          {player.web_name} ({player.team})
                          <span className="badge badge-falling" style={{ marginLeft: '8px' }}>
                            -{((player.transfers_out - player.transfers_in) / 1000).toFixed(1)}k
                          </span>
                        </div>
                        <div className="feature-detail">
                          Ownership: {player.selected_by_percent}% | Price: £{player.now_cost}m
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            );
          })()}

          {/* CTA for Free Users */}
          {tier === 'free' && (
            <div className="cta-section">
              <h2 style={{ color: '#1f2937', marginBottom: '10px' }}>Want 24-Hour Early Access?</h2>
              <p style={{ color: '#6b7280', marginBottom: '20px' }}>
                Get these captain picks on Friday evening + price predictions + injury intelligence:
              </p>
              <div style={{ display: 'flex', gap: '15px', justifyContent: 'center', flexWrap: 'wrap' }}>
                <Button href="https://premierleaguehub.com/pricing" style={{ background: 'linear-gradient(135deg, #1e40af, #3b82f6)', color: 'white', padding: '16px 32px', borderRadius: '8px', textDecoration: 'none', fontWeight: '600', display: 'inline-block' }}>
                  ⭐ First Team - £2.99/month
                </Button>
                <Button href="https://premierleaguehub.com/pricing" style={{ background: 'linear-gradient(135deg, #f59e0b, #f97316)', color: 'white', padding: '16px 32px', borderRadius: '8px', textDecoration: 'none', fontWeight: '600', display: 'inline-block' }}>
                  🎫 Season Pass - £49.99/year
                </Button>
              </div>
              <p style={{ fontSize: '12px', color: '#6b7280', marginTop: '15px' }}>
                Early captain picks • Price predictions • Injury intelligence • Cancel anytime
              </p>
            </div>
          )}

          {/* Season Pass Upgrade for First Team */}
          {tier === 'paid' && (
            <div className="cta-section" style={{ background: 'linear-gradient(135deg, #fef3c7, #fde68a)' }}>
              <h2 style={{ color: '#92400e', marginBottom: '10px' }}>🎫 Upgrade to Season Pass?</h2>
              <p style={{ color: '#92400e', marginBottom: '20px' }}>
                Get advanced analytics (xG/xA/ICT), personalized calendar, and priority algorithm access:
              </p>
              <Button href="https://premierleaguehub.com/upgrade" style={{ background: '#92400e', color: 'white', padding: '16px 32px', borderRadius: '8px', textDecoration: 'none', fontWeight: '600', display: 'inline-block' }}>
                Upgrade to Season Pass - £49.99/year
              </Button>
              <p style={{ fontSize: '12px', color: '#92400e', marginTop: '15px' }}>
                Save £13.89 vs monthly price • Advanced analytics • Priority access
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
        </Section>
      </Container>
    </Body>
  </Html>
);

export default WeeklyCaptainPicks;


