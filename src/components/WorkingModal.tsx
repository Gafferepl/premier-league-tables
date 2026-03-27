import React, { useState } from 'react';
import { authService, User } from '../services/auth';

interface WorkingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUserRegistered: (user: User) => void;
}

const WorkingModal: React.FC<WorkingModalProps> = ({
  isOpen,
  onClose,
  onUserRegistered
}) => {
  const [username, setUsername] = useState('');
  const [clubTeam, setClubTeam] = useState('');
  const [nation, setNation] = useState('');
  const [email, setEmail] = useState('');
  const [newsletter, setNewsletter] = useState(true);

  const premierLeagueTeams = [
    'Arsenal', 'Aston Villa', 'Bournemouth', 'Brentford', 'Brighton',
    'Burnley', 'Chelsea', 'Crystal Palace', 'Everton', 'Fulham',
    'Ipswich', 'Leicester', 'Liverpool', 'Luton Town', 'Man City',
    'Man Utd', 'Newcastle', "Nott'm Forest", 'Sheffield Utd', 'Southampton',
    'Spurs', 'West Ham', 'Wolves'
  ];

  const worldCupNations = [
    'Qatar', 'Ecuador', 'Senegal', 'Netherlands', 'England', 'Iran', 'USA', 'Wales',
    'Argentina', 'Saudi Arabia', 'Mexico', 'Poland', 'France', 'Australia', 'Denmark', 'Tunisia',
    'Spain', 'Costa Rica', 'Germany', 'Japan', 'Belgium', 'Canada', 'Morocco', 'Croatia',
    'Brazil', 'Serbia', 'Switzerland', 'Cameroon', 'Portugal', 'Ghana', 'Uruguay', 'South Korea'
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!username || !clubTeam || !nation || !email) {
      alert('Please fill in all fields');
      return;
    }

    // Register user
    const user = authService.register(email, username, clubTeam);
    onUserRegistered(user);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.9)',
      zIndex: 999999999,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px'
    }}>
      <div style={{
        backgroundColor: '#1a472a',
        borderRadius: '16px',
        maxWidth: '500px',
        width: '100%',
        maxHeight: '90vh',
        overflowY: 'auto',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
        border: '3px solid #d4af37',
        position: 'relative'
      }}>
        {/* Header */}
        <div style={{
          padding: '24px',
          borderBottom: '2px solid #d4af37',
          textAlign: 'center',
          position: 'relative'
        }}>
          <button
            onClick={onClose}
            style={{
              position: 'absolute',
              top: '16px',
              right: '16px',
              background: 'none',
              border: 'none',
              fontSize: '24px',
              cursor: 'pointer',
              color: '#d4af37',
              fontWeight: 'bold'
            }}
          >
            ×
          </button>
          
          <div style={{
            width: '80px',
            height: '80px',
            backgroundColor: '#d4af37',
            borderRadius: '50%',
            margin: '0 auto 16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: '4px solid white'
          }}>
            <img src="/says.svg" alt="Gaffer" style={{ width: '50px', height: '50px' }} />
          </div>
          <h2 style={{
            fontSize: '28px',
            fontWeight: 'bold',
            color: '#d4af37',
            marginBottom: '8px',
            textTransform: 'uppercase',
            fontFamily: 'Arial Black, sans-serif'
          }}>
            Join The Gaffer
          </h2>
          <p style={{ color: '#90EE90', fontSize: '16px' }}>
            Create your account to start beating the computer!
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ padding: '24px' }}>
          {/* Username */}
          <div style={{ marginBottom: '20px' }}>
            <label style={{
              display: 'block',
              fontSize: '16px',
              fontWeight: 'bold',
              color: '#d4af37',
              marginBottom: '8px',
              fontFamily: 'Arial, sans-serif'
            }}>
              Username *
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              style={{
                width: '100%',
                padding: '12px',
                border: '2px solid #d4af37',
                borderRadius: '8px',
                fontSize: '16px',
                backgroundColor: 'white',
                fontFamily: 'Arial, sans-serif'
              }}
              placeholder="Choose your username"
              required
            />
          </div>

          {/* Club Team */}
          <div style={{ marginBottom: '20px' }}>
            <label style={{
              display: 'block',
              fontSize: '16px',
              fontWeight: 'bold',
              color: '#d4af37',
              marginBottom: '8px',
              fontFamily: 'Arial, sans-serif'
            }}>
              Club Team *
            </label>
            <select
              value={clubTeam}
              onChange={(e) => setClubTeam(e.target.value)}
              style={{
                width: '100%',
                padding: '12px',
                border: '2px solid #d4af37',
                borderRadius: '8px',
                fontSize: '16px',
                backgroundColor: 'white',
                fontFamily: 'Arial, sans-serif'
              }}
              required
            >
              <option value="">Select your team</option>
              {premierLeagueTeams.map(team => (
                <option key={team} value={team}>{team}</option>
              ))}
            </select>
          </div>

          {/* Nation */}
          <div style={{ marginBottom: '20px' }}>
            <label style={{
              display: 'block',
              fontSize: '16px',
              fontWeight: 'bold',
              color: '#d4af37',
              marginBottom: '8px',
              fontFamily: 'Arial, sans-serif'
            }}>
              Nation *
            </label>
            <select
              value={nation}
              onChange={(e) => setNation(e.target.value)}
              style={{
                width: '100%',
                padding: '12px',
                border: '2px solid #d4af37',
                borderRadius: '8px',
                fontSize: '16px',
                backgroundColor: 'white',
                fontFamily: 'Arial, sans-serif'
              }}
              required
            >
              <option value="">Select your nation</option>
              {worldCupNations.map(nation => (
                <option key={nation} value={nation}>{nation}</option>
              ))}
            </select>
          </div>

          {/* Email */}
          <div style={{ marginBottom: '20px' }}>
            <label style={{
              display: 'block',
              fontSize: '16px',
              fontWeight: 'bold',
              color: '#d4af37',
              marginBottom: '8px',
              fontFamily: 'Arial, sans-serif'
            }}>
              Email Address *
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{
                width: '100%',
                padding: '12px',
                border: '2px solid #d4af37',
                borderRadius: '8px',
                fontSize: '16px',
                backgroundColor: 'white',
                fontFamily: 'Arial, sans-serif'
              }}
              placeholder="your@email.com"
              required
            />
          </div>

          {/* Newsletter */}
          <div style={{ marginBottom: '24px' }}>
            <label style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
              <input
                type="checkbox"
                checked={newsletter}
                onChange={(e) => setNewsletter(e.target.checked)}
                style={{ marginTop: '4px', transform: 'scale(1.5)' }}
              />
              <span style={{ color: '#90EE90', fontSize: '14px', fontFamily: 'Arial, sans-serif' }}>
                <strong>Get the Gaffer's newsletter?</strong>
                <br />
                Weekly predictions, exclusive tips, and proper football banter.
              </span>
            </label>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            style={{
              width: '100%',
              backgroundColor: '#d4af37',
              color: '#000000',
              fontWeight: 'bold',
              padding: '16px',
              borderRadius: '8px',
              fontSize: '18px',
              textTransform: 'uppercase',
              letterSpacing: '1px',
              cursor: 'pointer',
              border: '3px solid #d4af37',
              fontFamily: 'Arial Black, sans-serif',
              transition: 'all 0.3s ease'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.backgroundColor = '#ffffff';
              e.currentTarget.style.color = '#1a472a';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.backgroundColor = '#d4af37';
              e.currentTarget.style.color = '#000000';
            }}
          >
            Create Account
          </button>
        </form>
      </div>
    </div>
  );
};

export default WorkingModal;


