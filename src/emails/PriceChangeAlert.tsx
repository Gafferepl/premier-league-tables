import { Html, Head, Body, Container, Section, Text, Button } from '@react-email/components';

interface PriceChangeAlertProps {
  name: string;
  email: string;
  tier: 'paid' | 'season';
  priceData: {
    risers: Array<{ name: string; team: string; currentPrice: number; netTransfers: number; probability: number }>;
    fallers: Array<{ name: string; team: string; currentPrice: number; netTransfers: number; probability: number }>;
    predictedChanges: Array<{ name: string; team: string; direction: 'rise' | 'fall'; probability: number; reason: string }>;
    countdownHours: number;
  };
}

const PriceChangeAlert = ({ name, priceData, tier }: PriceChangeAlertProps) => (
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
          .countdown { background: linear-gradient(135deg, #dc2626, #ef4444); color: white; padding: 20px; border-radius: 12px; text-align: center; margin-bottom: 30px; }
          .countdown-number { font-size: 48px; font-weight: bold; margin-bottom: 5px; }
          .countdown-text { font-size: 16px; opacity: 0.9; }
          .price-section { background: white; border-radius: 12px; padding: 25px; margin-bottom: 20px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
          .price-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
          .price-title { font-size: 20px; font-weight: bold; color: #1f2937; }
          .price-subtitle { color: #6b7280; font-size: 14px; }
          .price-item { display: flex; justify-content: space-between; align-items: center; padding: 15px 0; border-bottom: 1px solid #f3f4f6; }
          .price-item:last-child { border-bottom: none; }
          .player-info { flex: 1; }
          .player-name { font-weight: 600; color: #1f2937; margin-bottom: 2px; }
          .player-team { color: #6b7280; font-size: 14px; }
          .price-stats { text-align: right; }
          .current-price { font-weight: bold; color: #1f2937; margin-bottom: 2px; }
          .net-transfers { font-size: 12px; color: #6b7280; }
          .probability-badge { padding: 4px 12px; border-radius: 12px; font-size: 12px; font-weight: 600; margin-left: 10px; }
          .rise-badge { background: #dcfce7; color: #166534; }
          .fall-badge { background: #fee2e2; color: #dc2626; }
          .predicted-section { background: #f0f9ff; padding: 25px; border-radius: 12px; margin-bottom: 20px; border-left: 4px solid #3b82f6; }
          .predicted-item { background: white; padding: 15px; border-radius: 8px; margin-bottom: 15px; border-left: 4px solid #3b82f6; }
          .predicted-item:last-child { margin-bottom: 0; }
          .predicted-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px; }
          .predicted-name { font-weight: 600; color: #1f2937; }
          .predicted-probability { background: #dbeafe; color: #1e40af; padding: 4px 8px; border-radius: 12px; font-size: 12px; font-weight: 600; }
          .predicted-reason { color: #4b5563; font-size: 14px; font-style: italic; }
          .gaffer-tip { background: #fef3c7; padding: 20px; border-radius: 12px; margin: 20px 0; border-left: 4px solid #f59e0b; }
          .gaffer-text { color: #92400e; font-style: italic; margin-bottom: 10px; }
          .action-section { background: linear-gradient(135deg, #10b981, #059669); color: white; padding: 25px; border-radius: 12px; text-align: center; margin-top: 30px; }
          .action-button { background: white; color: #10b981; padding: 16px 32px; border-radius: 8px; text-decoration: none; font-weight: 600; display: inline-block; }
          .footer { background: #1f2937; color: white; padding: 30px; text-align: center; font-size: 12px; }
        `}
      </style>
    </Head>
    <Body style={{ fontFamily: 'Inter, sans-serif', margin: 0, padding: 0, backgroundColor: '#f3f4f6' }}>
      <Container className="container">
        {/* Header */}
        <Section className="header">
          <div className="logo">⚽ premierleaguetables.com</div>
          {tier === 'season' && <div className="premium-badge">🎫 SEASON PASS MEMBER</div>}
          {tier === 'paid' && <div className="premium-badge">⭐ FIRST TEAM MEMBER</div>}
          <h1 className="title">📈 Price Change Intelligence</h1>
          <p className="subtitle">Live market analysis and predictions</p>
        </Section>

        {/* Content */}
        <Section className="content">
          {/* Countdown */}
          <div className="countdown">
            <div className="countdown-number">{priceData.countdownHours}h</div>
            <div className="countdown-text">Until next price change (1:30 AM GMT)</div>
          </div>

          {/* Current Risers */}
          <div className="price-section">
            <div className="price-header">
              <div>
                <div className="price-title">📈 Current Risers</div>
                <div className="price-subtitle">Players gaining popularity now</div>
              </div>
              <div className="probability-badge rise-badge">LIVE</div>
            </div>
            
            {priceData.risers.map((player, index) => (
              <div key={index} className="price-item">
                <div className="player-info">
                  <div className="player-name">{player.name}</div>
                  <div className="player-team">{player.team}</div>
                </div>
                <div className="price-stats">
                  <div className="current-price">£{player.currentPrice}m</div>
                  <div className="net-transfers" style={{ color: '#10b981' }}>+{player.netTransfers.toLocaleString()}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Current Fallers */}
          <div className="price-section">
            <div className="price-header">
              <div>
                <div className="price-title">📉 Current Fallers</div>
                <div className="price-subtitle">Players being sold now</div>
              </div>
              <div className="probability-badge fall-badge">LIVE</div>
            </div>
            
            {priceData.fallers.map((player, index) => (
              <div key={index} className="price-item">
                <div className="player-info">
                  <div className="player-name">{player.name}</div>
                  <div className="player-team">{player.team}</div>
                </div>
                <div className="price-stats">
                  <div className="current-price">£{player.currentPrice}m</div>
                  <div className="net-transfers" style={{ color: '#ef4444' }}>-{Math.abs(player.netTransfers).toLocaleString()}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Predicted Changes */}
          <div className="predicted-section">
            <h3 style={{ color: '#1e40af', marginBottom: '20px' }}>🔮 Predicted Changes Tonight</h3>
            
            {priceData.predictedChanges.map((prediction, index) => (
              <div key={index} className="predicted-item">
                <div className="predicted-header">
                  <div className="predicted-name">{prediction.name} ({prediction.team})</div>
                  <div className="predicted-probability">{prediction.probability}% {prediction.direction}</div>
                </div>
                <div className="predicted-reason">{prediction.reason}</div>
              </div>
            ))}
          </div>

          {/* Gaffer's Tip */}
          <div className="gaffer-tip">
            <h3 style={{ color: '#92400e', marginBottom: '10px' }}>🗣️ The Gaffer's Market Tip:</h3>
            <p className="gaffer-text">
              "Listen up, the market doesn't lie! {priceData.predictedChanges[0]?.name} is about to rise, and if you're not on board before 1:30 AM, you're leaving money on the table. 
              Smart managers build team value while others sleep. Don't be that manager who's always playing catch-up!"
            </p>
            <p style={{ color: '#92400e', fontWeight: 'bold', margin: 0 }}>— The Gaffer</p>
          </div>

          {/* Action Section */}
          <div className="action-section">
            <h3 style={{ marginBottom: '10px' }}>🎯 Take Action Now!</h3>
            <p style={{ marginBottom: '20px' }}>
              {priceData.countdownHours < 6 
                ? "Less than 6 hours until price changes! Make your moves now:"
                : "Plan your transfers ahead of the price changes:"
              }
            </p>
            <Button href="https://premierleaguehub.com/price-tracker" className="action-button">
              View Live Price Tracker
            </Button>
            <p style={{ fontSize: '12px', marginTop: '15px', opacity: 0.9 }}>
              Track real-time prices • Get instant alerts • Build team value
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

export default PriceChangeAlert;


