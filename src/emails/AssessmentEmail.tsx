import React from 'react';

interface AssessmentEmailProps {
  name: string;
  email: string;
  assessmentData: {
    overallRating: number;
    attackStrength: number;
    defenseRating: number;
    budgetEfficiency: number;
    recommendations: string[];
    captainPick: string;
    weakLinks: string[];
    tacticalAdvice: string;
    gameweek: number;
  };
}

const AssessmentEmail: React.FC<AssessmentEmailProps> = ({ 
  name, 
  email, 
  assessmentData 
}) => {
  const {
    overallRating,
    attackStrength,
    defenseRating,
    budgetEfficiency,
    recommendations,
    captainPick,
    weakLinks,
    tacticalAdvice,
    gameweek
  } = assessmentData;

  return (
    <div style={{ 
      fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      maxWidth: '600px', 
      margin: '0 auto',
      backgroundColor: '#0f172a',
      color: '#ffffff'
    }}>
      {/* Header */}
      <div style={{ 
        background: 'linear-gradient(135deg, #dc2626 0%, #ea580c 100%)', 
        padding: '30px 20px', 
        textAlign: 'center',
        borderRadius: '12px 12px 0 0',
        position: 'relative'
      }}>
        <div style={{
          position: 'absolute',
          top: '10px',
          right: '10px',
          fontSize: '12px',
          opacity: '0.7'
        }}>
          Week {gameweek} Assessment
        </div>
        
        <h1 style={{ 
          margin: '0', 
          fontSize: '32px', 
          fontWeight: '800',
          textTransform: 'uppercase',
          letterSpacing: '1px',
          marginBottom: '8px'
        }}>
          🏆 The Gaffer's Analysis
        </h1>
        
        <p style={{ 
          margin: '0', 
          fontSize: '16px',
          opacity: '0.9',
          fontWeight: '500'
        }}>
          Your Personal Team Breakdown
        </p>
      </div>

      {/* Main Content */}
      <div style={{ 
        backgroundColor: '#1e293b',
        padding: '30px 20px',
        borderRadius: '0 0 12px 12px'
      }}>
        {/* Personal Greeting */}
        <div style={{ marginBottom: '30px' }}>
          <h2 style={{ 
            color: '#fbbf24', 
            margin: '0 0 10px 0',
            fontSize: '20px',
            fontWeight: '700'
          }}>
            Oi {name}! The Gaffer's been watching your squad...
          </h2>
          <p style={{ 
            color: '#94a3b8', 
            margin: '0', 
            fontSize: '14px',
            lineHeight: '1.6'
          }}>
            Here's your weekly tactical breakdown. No fluff, just proper analysis that'll help you smash your mini-league.
          </p>
        </div>

        {/* Team Rating Card */}
        <div style={{ 
          background: 'linear-gradient(135deg, #1e293b 0%, #334155 100%)', 
          padding: '25px', 
          borderRadius: '12px', 
          marginBottom: '25px',
          border: '2px solid #dc2626',
          boxShadow: '0 4px 20px rgba(220, 38, 38, 0.2)'
        }}>
          <div style={{ textAlign: 'center', marginBottom: '20px' }}>
            <h3 style={{ 
              color: '#ffffff', 
              margin: '0 0 10px 0', 
              fontSize: '24px',
              fontWeight: '800'
            }}>
              Team Rating: {overallRating}/10
            </h3>
            <div style={{
              width: '100px',
              height: '100px',
              margin: '0 auto',
              position: 'relative'
            }}>
              <svg viewBox="0 0 100 100" style={{ transform: 'rotate(-90deg)' }}>
                <circle
                  cx="50"
                  cy="50"
                  r="45"
                  fill="none"
                  stroke="#334155"
                  strokeWidth="8"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="45"
                  fill="none"
                  stroke="#dc2626"
                  strokeWidth="8"
                  strokeDasharray={`${overallRating * 28.3} 283`}
                  style={{ transition: 'stroke-dasharray 0.5s ease' }}
                />
              </svg>
              <div style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                fontSize: '24px',
                fontWeight: '800',
                color: '#dc2626'
              }}>
                {overallRating}
              </div>
            </div>
          </div>
          
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: '1fr 1fr', 
            gap: '20px' 
          }}>
            <div>
              <div style={{ marginBottom: '15px' }}>
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center',
                  marginBottom: '8px'
                }}>
                  <h4 style={{ 
                    color: '#ef4444', 
                    margin: '0', 
                    fontSize: '14px',
                    fontWeight: '600'
                  }}>
                    ⚽ Attack
                  </h4>
                  <span style={{ color: '#ef4444', fontSize: '14px', fontWeight: '700' }}>
                    {attackStrength}/10
                  </span>
                </div>
                <div style={{ 
                  background: '#334155', 
                  height: '6px', 
                  borderRadius: '3px',
                  overflow: 'hidden'
                }}>
                  <div style={{ 
                    background: 'linear-gradient(90deg, #ef4444 0%, #dc2626 100%)', 
                    width: `${attackStrength * 10}%`, 
                    height: '100%',
                    borderRadius: '3px'
                  }}></div>
                </div>
              </div>
              
              <div>
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center',
                  marginBottom: '8px'
                }}>
                  <h4 style={{ 
                    color: '#10b981', 
                    margin: '0', 
                    fontSize: '14px',
                    fontWeight: '600'
                  }}>
                    🛡️ Defense
                  </h4>
                  <span style={{ color: '#10b981', fontSize: '14px', fontWeight: '700' }}>
                    {defenseRating}/10
                  </span>
                </div>
                <div style={{ 
                  background: '#334155', 
                  height: '6px', 
                  borderRadius: '3px',
                  overflow: 'hidden'
                }}>
                  <div style={{ 
                    background: 'linear-gradient(90deg, #10b981 0%, #059669 100%)', 
                    width: `${defenseRating * 10}%`, 
                    height: '100%',
                    borderRadius: '3px'
                  }}></div>
                </div>
              </div>
            </div>
            
            <div>
              <div style={{ marginBottom: '15px' }}>
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center',
                  marginBottom: '8px'
                }}>
                  <h4 style={{ 
                    color: '#f59e0b', 
                    margin: '0', 
                    fontSize: '14px',
                    fontWeight: '600'
                  }}>
                    💰 Budget
                  </h4>
                  <span style={{ color: '#f59e0b', fontSize: '14px', fontWeight: '700' }}>
                    {budgetEfficiency}/10
                  </span>
                </div>
                <div style={{ 
                  background: '#334155', 
                  height: '6px', 
                  borderRadius: '3px',
                  overflow: 'hidden'
                }}>
                  <div style={{ 
                    background: 'linear-gradient(90deg, #f59e0b 0%, #d97706 100%)', 
                    width: `${budgetEfficiency * 10}%`, 
                    height: '100%',
                    borderRadius: '3px'
                  }}></div>
                </div>
              </div>
              
              <div>
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center',
                  marginBottom: '8px'
                }}>
                  <h4 style={{ 
                    color: '#06b6d4', 
                    margin: '0', 
                    fontSize: '14px',
                    fontWeight: '600'
                  }}>
                    📊 Overall
                  </h4>
                  <span style={{ color: '#06b6d4', fontSize: '14px', fontWeight: '700' }}>
                    {overallRating}/10
                  </span>
                </div>
                <div style={{ 
                  background: '#334155', 
                  height: '6px', 
                  borderRadius: '3px',
                  overflow: 'hidden'
                }}>
                  <div style={{ 
                    background: 'linear-gradient(90deg, #06b6d4 0%, #0891b2 100%)', 
                    width: `${overallRating * 10}%`, 
                    height: '100%',
                    borderRadius: '3px'
                  }}></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Recommendations */}
        <div style={{ 
          background: 'linear-gradient(135deg, #451a03 0%, #78350f 100%)', 
          padding: '20px', 
          borderRadius: '12px', 
          marginBottom: '25px',
          borderLeft: '4px solid #f59e0b'
        }}>
          <h3 style={{ 
            color: '#fbbf24', 
            margin: '0 0 15px 0', 
            fontSize: '18px',
            fontWeight: '700'
          }}>
            🎯 Gaffer's Recommendations:
          </h3>
          <ul style={{ 
            color: '#fef3c7', 
            margin: '0', 
            paddingLeft: '20px',
            fontSize: '14px',
            lineHeight: '1.6'
          }}>
            {recommendations.map((rec, index) => (
              <li key={index} style={{ marginBottom: '8px' }}>{rec}</li>
            ))}
          </ul>
        </div>

        {/* Captain Pick */}
        <div style={{ 
          background: 'linear-gradient(135deg, #064e3b 0%, #065f46 100%)', 
          padding: '20px', 
          borderRadius: '12px', 
          marginBottom: '25px',
          borderLeft: '4px solid #10b981'
        }}>
          <h3 style={{ 
            color: '#34d399', 
            margin: '0 0 10px 0', 
            fontSize: '18px',
            fontWeight: '700'
          }}>
            💡 Captain Pick This Week:
          </h3>
          <p style={{ 
            color: '#d1fae5', 
            margin: '0', 
            fontSize: '16px',
            fontWeight: '600',
            lineHeight: '1.5'
          }}>
            {captainPick}
          </p>
        </div>

        {/* Weak Links */}
        {weakLinks.length > 0 && (
          <div style={{ 
            background: 'linear-gradient(135deg, #7f1d1d 0%, #991b1b 100%)', 
            padding: '20px', 
            borderRadius: '12px', 
            marginBottom: '25px',
            borderLeft: '4px solid #ef4444'
          }}>
            <h3 style={{ 
              color: '#fca5a5', 
              margin: '0 0 15px 0', 
              fontSize: '18px',
              fontWeight: '700'
            }}>
              ⚠️ Weak Links to Fix:
            </h3>
            <ul style={{ 
              color: '#fecaca', 
              margin: '0', 
              paddingLeft: '20px',
              fontSize: '14px',
              lineHeight: '1.6'
            }}>
              {weakLinks.map((link, index) => (
                <li key={index} style={{ marginBottom: '8px' }}>{link}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Tactical Advice */}
        <div style={{ 
          background: 'linear-gradient(135deg, #1e3a8a 0%, #1e40af 100%)', 
          padding: '20px', 
          borderRadius: '12px', 
          marginBottom: '25px'
        }}>
          <h3 style={{ 
            color: '#93c5fd', 
            margin: '0 0 15px 0', 
            fontSize: '18px',
            fontWeight: '700'
          }}>
            📋 Gaffer's Tactical Advice:
          </h3>
          <p style={{ 
            color: '#dbeafe', 
            margin: '0', 
            fontSize: '14px',
            lineHeight: '1.6'
          }}>
            {tacticalAdvice}
          </p>
        </div>

        {/* Call to Action */}
        <div style={{ textAlign: 'center', marginTop: '30px' }}>
          <a 
            href="https://premierleaguetables.com" 
            style={{
              display: 'inline-block',
              background: 'linear-gradient(135deg, #dc2626 0%, #ea580c 100%)',
              color: '#ffffff',
              padding: '15px 30px',
              textDecoration: 'none',
              borderRadius: '8px',
              fontWeight: '700',
              fontSize: '16px',
              textTransform: 'uppercase',
              letterSpacing: '1px',
              boxShadow: '0 4px 20px rgba(220, 38, 38, 0.3)',
              transition: 'all 0.3s ease'
            }}
          >
            View Full Analysis →
          </a>
        </div>
      </div>

      {/* Footer */}
      <div style={{ 
        background: '#0f172a', 
        color: '#64748b', 
        padding: '20px', 
        textAlign: 'center',
        borderTop: '1px solid #334155'
      }}>
        <p style={{ 
          margin: '0 0 10px 0', 
          fontSize: '14px',
          fontWeight: '600',
          color: '#fbbf24',
          fontStyle: 'italic'
        }}>
          "Oi! Follow the Gaffer's advice and you'll win your league. No excuses."
        </p>
        <p style={{ margin: '0', fontSize: '12px' }}>
          The Gaffer's Hub | Premium Fantasy Football Analysis
        </p>
        <p style={{ margin: '5px 0 0 0', fontSize: '11px', opacity: '0.7' }}>
          © 2026 Premier League Tables. All rights reserved.
        </p>
      </div>
    </div>
  );
};

export default AssessmentEmail;


