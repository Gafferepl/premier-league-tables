import { Html, Head, Body, Container, Section, Text, Button } from '@react-email/components';
import { MOCK_PLAYERS, FPLPlayer } from '../data/playerData';

interface PriceIntelligenceEmailProps {
  name: string;
  tier: 'paid' | 'season';
  priceData: {
    countdownHours: number;
    risers: Array<{ name: string; team: string; currentPrice: number; netTransfers: number; probability: number }>;
    fallers: Array<{ name: string; team: string; currentPrice: number; netTransfers: number; probability: number }>;
    predictedChanges: Array<{ name: string; team: string; direction: 'rise' | 'fall'; probability: number; reason: string }>;
  };
  pricePredictions: {
    risers: Array<{ name: string; team: string; probability: number }>;
    fallers: Array<{ name: string; team: string; probability: number }>;
  };
  marketInsights?: {
    topTransfers: Array<{ name: string; team: string; transfers: number; direction: 'in' | 'out' }>;
    ownershipTrends: Array<{ name: string; team: string; change: number; ownership: number }>;
  };
}

const PriceIntelligenceEmail = ({ 
  name, 
  tier, 
  priceData, 
  pricePredictions,
  marketInsights 
}: PriceIntelligenceEmailProps) => {
  const isSeasonPass = tier === 'season';

  return (
    <Html>
      <Head>
        <style>
          {`
            .container { max-width: 650px; margin: 0 auto; }
            .header { background: linear-gradient(135deg, #3b82f6, #1e40af); padding: 40px 30px; text-align: center; }
            .logo { font-size: 24px; font-weight: bold; color: white; margin-bottom: 20px; }
            .title { color: white; font-size: 28px; margin-bottom: 10px; }
            .subtitle { color: #dbeafe; font-size: 16px; margin-bottom: 20px; }
            .content { padding: 40px 30px; background: #f8fafc; }
            .countdown-box { background: linear-gradient(135deg, #ef4444, #dc2626); color: white; padding: 25px; border-radius: 15px; text-align: center; margin-bottom: 30px; }
            .countdown-number { font-size: 48px; font-weight: bold; margin-bottom: 10px; }
            .countdown-text { font-size: 18px; margin-bottom: 15px; }
            .price-section { background: white; padding: 30px; border-radius: 15px; margin-bottom: 25px; border-left: 5px solid #10b981; }
            .section-title { color: #1f2937; font-size: 22px; font-weight: bold; margin-bottom: 20px; display: flex; align-items: center; }
            .section-icon { font-size: 20px; margin-right: 10px; }
            .price-item { display: flex; justify-content: space-between; align-items: center; padding: 15px; background: #f0fdf4; border-radius: 10px; margin-bottom: 12px; border-left: 3px solid #10b981; }
            .price-item-faller { background: #fef2f2; border-left-color: #ef4444; }
            .player-info { flex: 1; }
            .player-name { font-size: 16px; font-weight: bold; color: #1f2937; margin-bottom: 4px; }
            .player-team { color: #6b7280; font-size: 14px; }
            .price-info { text-align: right; }
            .current-price { font-size: 18px; font-weight: bold; color: #1f2937; margin-bottom: 4px; }
            .net-transfers { font-size: 14px; margin-bottom: 4px; }
            .probability-badge { background: #dbeafe; color: #1e40af; padding: 4px 8px; border-radius: 12px; font-size: 12px; font-weight: 600; display: inline-block; }
            .probability-high { background: #d1fae5; color: #065f46; }
            .probability-medium { background: #fef3c7; color: #92400e; }
            .probability-low { background: #fee2e2; color: #dc2626; }
            .prediction-section { background: white; padding: 30px; border-radius: 15px; margin-bottom: 25px; border-left: 5px solid #f59e0b; }
            .prediction-item { padding: 15px; background: #fffbeb; border-radius: 10px; margin-bottom: 12px; border-left: 3px solid #f59e0b; }
            .prediction-reason { color: #6b7280; font-size: 14px; margin-top: 8px; font-style: italic; }
            .market-section { background: white; padding: 30px; border-radius: 15px; margin-bottom: 25px; border-left: 5px solid #8b5cf6; }
            .market-item { display: flex; justify-content: space-between; align-items: center; padding: 12px; background: #faf5ff; border-radius: 8px; margin-bottom: 10px; }
            .transfer-direction { padding: 3px 8px; border-radius: 10px; font-size: 11px; font-weight: 600; }
            .direction-in { background: #d1fae5; color: #065f46; }
            .direction-out { background: #fee2e2; color: #dc2626; }
            .trend-positive { color: #10b981; font-weight: 600; }
            .trend-negative { color: #ef4444; font-weight: 600; }
            .action-box { background: linear-gradient(135deg, #3b82f6, #1e40af); color: white; padding: 25px; border-radius: 15px; text-align: center; margin-top: 30px; }
            .action-title { font-size: 20px; font-weight: bold; margin-bottom: 15px; }
            .action-text { font-size: 16px; line-height: 1.5; margin-bottom: 20px; }
            .season-badge { background: linear-gradient(135deg, #fbbf24, #f59e0b); color: white; padding: 8px 16px; border-radius: 20px; font-size: 12px; font-weight: bold; margin-bottom: 20px; display: inline-block; }
            .footer { background: #1f2937; color: white; padding: 30px; text-align: center; font-size: 12px; }
          `}
        </style>
      </Head>
      <Body style={{ margin: 0, padding: 0, fontFamily: 'Arial, sans-serif', backgroundColor: '#f8fafc' }}>
        <Container className="container">
          {/* Header */}
          <div className="header">
            <div className="logo">⚽ Gaffer's FPL Hub</div>
            <h1 className="title">📈 Price Intelligence Report</h1>
            <p className="subtitle">
              Critical Price Changes Ahead • {new Date().toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' })}
              {isSeasonPass && <div className="season-badge">👑 SEASON PASS - ELITE ACCESS</div>}
            </p>
          </div>

          {/* Content */}
          <div className="content">
            {/* Countdown Timer */}
            <div className="countdown-box">
              <div className="countdown-number">{priceData.countdownHours}</div>
              <div className="countdown-text">Hours Until Price Changes</div>
              <div style={{ fontSize: '14px', opacity: 0.9 }}>
                Price changes happen at 1:30 AM GMT • Act now before the market moves!
              </div>
            </div>

            {/* Price Risers Section */}
            <div className="price-section">
              <h2 className="section-title">
                <span className="section-icon">📈</span>
                Price Risers - Buy Now!
              </h2>
              
              {priceData.risers.map((player, index) => (
                <div key={index} className="price-item">
                  <div className="player-info">
                    <div className="player-name">{player.name}</div>
                    <div className="player-team">{player.team}</div>
                  </div>
                  <div className="price-info">
                    <div className="current-price">£{player.currentPrice}m</div>
                    <div className="net-transfers" style={{ color: '#10b981', fontWeight: '600' }}>
                      +{(player.netTransfers / 1000).toFixed(1)}k transfers
                    </div>
                    <div className={`probability-badge ${player.probability > 80 ? 'probability-high' : player.probability > 60 ? 'probability-medium' : 'probability-low'}`}>
                      {player.probability}% chance to rise
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Price Fallers Section */}
            <div className="price-section">
              <h2 className="section-title">
                <span className="section-icon">📉</span>
                Price Fallers - Sell Before Drop!
              </h2>
              
              {priceData.fallers.map((player, index) => (
                <div key={index} className="price-item price-item-faller">
                  <div className="player-info">
                    <div className="player-name">{player.name}</div>
                    <div className="player-team">{player.team}</div>
                  </div>
                  <div className="price-info">
                    <div className="current-price">£{player.currentPrice}m</div>
                    <div className="net-transfers" style={{ color: '#ef4444', fontWeight: '600' }}>
                      {Math.abs(player.netTransfers / 1000).toFixed(1)}k transfers out
                    </div>
                    <div className={`probability-badge ${player.probability > 80 ? 'probability-high' : player.probability > 60 ? 'probability-medium' : 'probability-low'}`}>
                      {player.probability}% chance to fall
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Predicted Changes Section */}
            <div className="prediction-section">
              <h2 className="section-title">
                <span className="section-icon">🎯</span>
                Predicted Changes
              </h2>
              
              {priceData.predictedChanges.map((prediction, index) => (
                <div key={index} className="prediction-item">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <div>
                      <strong>{prediction.name}</strong> ({prediction.team})
                      <span style={{ 
                        marginLeft: '10px', 
                        padding: '4px 8px', 
                        borderRadius: '12px', 
                        fontSize: '12px', 
                        fontWeight: '600',
                        background: prediction.direction === 'rise' ? '#d1fae5' : '#fee2e2',
                        color: prediction.direction === 'rise' ? '#065f46' : '#dc2626'
                      }}>
                        {prediction.direction === 'rise' ? '⬆️ RISING' : '⬇️ FALLING'}
                      </span>
                    </div>
                    <div className={`probability-badge ${prediction.probability > 80 ? 'probability-high' : prediction.probability > 60 ? 'probability-medium' : 'probability-low'}`}>
                      {prediction.probability}% confidence
                    </div>
                  </div>
                  <div className="prediction-reason">{prediction.reason}</div>
                </div>
              ))}
            </div>

            {/* Market Insights (Season Pass Only) */}
            {isSeasonPass && marketInsights && (
              <div className="market-section">
                <h2 className="section-title">
                  <span className="section-icon">📊</span>
                  Advanced Market Intelligence
                </h2>
                
                <h3 style={{ fontSize: '16px', color: '#1f2937', marginBottom: '15px' }}>🔥 Top Transfer Activity</h3>
                {marketInsights.topTransfers.map((transfer, index) => (
                  <div key={index} className="market-item">
                    <div>
                      <strong>{transfer.name}</strong> ({transfer.team})
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span className={`transfer-direction direction-${transfer.direction}`}>
                        {transfer.direction.toUpperCase()}
                      </span>
                      <span style={{ 
                        color: transfer.direction === 'in' ? '#10b981' : '#ef4444', 
                        fontWeight: '600' 
                      }}>
                        {transfer.direction === 'in' ? '+' : '-'}{(transfer.transfers / 1000).toFixed(1)}k
                      </span>
                    </div>
                  </div>
                ))}

                <h3 style={{ fontSize: '16px', color: '#1f2937', margin: '20px 0 15px' }}>📈 Ownership Momentum</h3>
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
            )}

            {/* Action Box */}
            <div className="action-box">
              <div className="action-title">⚡ Time to Act!</div>
              <div className="action-text">
                {priceData.countdownHours <= 6 ? 
                  "URGENT: Less than 6 hours until price changes! Make your transfers now to beat the rush." :
                  "You have time to plan strategically. Monitor these players and make your moves before the deadline."
                }
              </div>
              <div style={{ fontSize: '14px', opacity: 0.9 }}>
                💡 Pro tip: Buy risers early, sell fallers before they drop further
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="footer">
            <p>© 2024 Gaffer's FPL Hub. All rights reserved.</p>
            <p style={{ marginTop: '10px' }}>
              You're receiving this because you subscribed to our {tier === 'season' ? 'Season Pass' : 'First Team'} tier.
            </p>
            <p style={{ marginTop: '10px' }}>
              Want to change your subscription? <a href="#" style={{ color: '#3b82f6' }}>Manage Preferences</a>
            </p>
          </div>
        </Container>
      </Body>
    </Html>
  );
};

export default PriceIntelligenceEmail;


