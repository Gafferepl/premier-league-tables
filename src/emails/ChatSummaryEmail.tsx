import React from 'react';
import {
  Html,
  Head,
  Body,
  Container,
  Section,
  Text,
  Heading,
  Hr,
  Link,
  Img
} from '@react-email/components';

interface ChatSummaryEmailProps {
  userName: string;
  userTier: 'firstTeam' | 'seasonPass';
  weeklyQuestions: number;
  topQuestions: string[];
  keyAdvice: string[];
  upgradePrompt?: boolean;
}

export default function ChatSummaryEmail({
  userName = 'Manager',
  userTier = 'firstTeam',
  weeklyQuestions = 0,
  topQuestions = [],
  keyAdvice = [],
  upgradePrompt = false
}: ChatSummaryEmailProps) {
  return (
    <Html>
      <Head />
      <Body style={main}>
        <Container style={container}>
          {/* Header */}
          <Section style={header}>
            <Img
              src="https://thegafferEPL.com/gaffer-icon.png"
              width="60"
              height="60"
              alt="The Gaffer"
              style={logo}
            />
            <Heading style={h1}>Your Weekly Chat Summary</Heading>
            <Text style={subtitle}>
              The Gaffer's been keeping track of your questions
            </Text>
          </Section>

          {/* Stats Section */}
          <Section style={statsSection}>
            <table style={statsTable}>
              <tr>
                <td style={statBox}>
                  <Text style={statNumber}>{weeklyQuestions}</Text>
                  <Text style={statLabel}>Questions Asked</Text>
                </td>
                <td style={statBox}>
                  <Text style={statNumber}>{topQuestions.length}</Text>
                  <Text style={statLabel}>Topics Covered</Text>
                </td>
                <td style={statBox}>
                  <Text style={statNumber}>
                    {userTier === 'seasonPass' ? '∞' : '10'}
                  </Text>
                  <Text style={statLabel}>Daily Limit</Text>
                </td>
              </tr>
            </table>
          </Section>

          {/* Top Questions */}
          {topQuestions.length > 0 && (
            <Section style={section}>
              <Heading style={h2}>
                <span style={icon}>💬</span> Your Top Questions This Week
              </Heading>
              {topQuestions.map((question, index) => (
                <div key={index} style={questionBox}>
                  <Text style={questionNumber}>{index + 1}</Text>
                  <Text style={questionText}>{question}</Text>
                </div>
              ))}
            </Section>
          )}

          {/* Key Advice */}
          {keyAdvice.length > 0 && (
            <Section style={section}>
              <Heading style={h2}>
                <span style={icon}>🎯</span> The Gaffer's Key Advice
              </Heading>
              {keyAdvice.map((advice, index) => (
                <div key={index} style={adviceBox}>
                  <Text style={adviceIcon}>✓</Text>
                  <Text style={adviceText}>{advice}</Text>
                </div>
              ))}
            </Section>
          )}

          {/* Gaffer's Message */}
          <Section style={gafferMessage}>
            <Img
              src="https://thegafferEPL.com/gaffer-icon.png"
              width="40"
              height="40"
              alt="The Gaffer"
              style={gafferAvatar}
            />
            <div style={messageBubble}>
              <Text style={messageTitle}>THE GAFFER SAYS:</Text>
              <Text style={messageText}>
                {weeklyQuestions > 0 
                  ? `Right ${userName}, you asked ${weeklyQuestions} questions this week. That's the kind of tactical thinking I like to see. Keep using that brain and you'll climb your league in no time. Remember - form is temporary, class is permanent. Now get out there and make those smart decisions!`
                  : `Oi ${userName}! You haven't asked me anything this week. Don't be shy - I'm here to help you win your league. Hit me up with your FPL questions and let's get tactical!`
                }
              </Text>
            </div>
          </Section>

          {/* Upgrade Prompt for First Team */}
          {upgradePrompt && userTier === 'firstTeam' && (
            <Section style={upgradeSection}>
              <Heading style={h2}>
                <span style={icon}>👑</span> Want Unlimited Chat?
              </Heading>
              <Text style={upgradeText}>
                You're hitting your daily limit regularly. Upgrade to Season Pass for unlimited questions and priority responses!
              </Text>
              <Link href="https://thegafferEPL.com/newsletter" style={upgradeButton}>
                Upgrade to Season Pass
              </Link>
            </Section>
          )}

          {/* Footer */}
          <Hr style={hr} />
          <Section style={footer}>
            <Text style={footerText}>
              Keep chatting with The Gaffer at{' '}
              <Link href="https://thegafferEPL.com" style={link}>
                thegafferEPL.com
              </Link>
            </Text>
            <Text style={footerText}>
              Questions remaining today: {userTier === 'seasonPass' ? 'Unlimited' : 'Check your dashboard'}
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

// Styles
const main = {
  backgroundColor: '#0f172a',
  fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
};

const container = {
  margin: '0 auto',
  padding: '20px',
  maxWidth: '600px'
};

const header = {
  textAlign: 'center' as const,
  padding: '40px 20px',
  backgroundColor: '#1e293b',
  borderRadius: '12px',
  marginBottom: '20px'
};

const logo = {
  margin: '0 auto 20px',
  borderRadius: '50%',
  border: '3px solid #ef4444'
};

const h1 = {
  color: '#ffffff',
  fontSize: '28px',
  fontWeight: 'bold',
  margin: '0 0 10px'
};

const subtitle = {
  color: '#94a3b8',
  fontSize: '16px',
  margin: '0'
};

const statsSection = {
  backgroundColor: '#1e293b',
  borderRadius: '12px',
  padding: '20px',
  marginBottom: '20px'
};

const statsTable = {
  width: '100%',
  textAlign: 'center' as const
};

const statBox = {
  padding: '10px'
};

const statNumber = {
  color: '#ef4444',
  fontSize: '32px',
  fontWeight: 'bold',
  margin: '0 0 5px'
};

const statLabel = {
  color: '#94a3b8',
  fontSize: '14px',
  margin: '0'
};

const section = {
  backgroundColor: '#1e293b',
  borderRadius: '12px',
  padding: '20px',
  marginBottom: '20px'
};

const h2 = {
  color: '#ffffff',
  fontSize: '20px',
  fontWeight: 'bold',
  margin: '0 0 15px'
};

const icon = {
  marginRight: '8px'
};

const questionBox = {
  display: 'flex',
  alignItems: 'flex-start',
  marginBottom: '12px',
  padding: '12px',
  backgroundColor: '#334155',
  borderRadius: '8px',
  borderLeft: '3px solid #ef4444'
};

const questionNumber = {
  color: '#ef4444',
  fontSize: '18px',
  fontWeight: 'bold',
  marginRight: '12px',
  minWidth: '24px'
};

const questionText = {
  color: '#e2e8f0',
  fontSize: '14px',
  margin: '0',
  flex: '1'
};

const adviceBox = {
  display: 'flex',
  alignItems: 'flex-start',
  marginBottom: '10px'
};

const adviceIcon = {
  color: '#10b981',
  fontSize: '18px',
  marginRight: '10px'
};

const adviceText = {
  color: '#e2e8f0',
  fontSize: '14px',
  margin: '0',
  flex: '1'
};

const gafferMessage = {
  backgroundColor: '#1e293b',
  borderRadius: '12px',
  padding: '20px',
  marginBottom: '20px',
  borderLeft: '4px solid #ef4444'
};

const gafferAvatar = {
  borderRadius: '50%',
  marginBottom: '15px'
};

const messageBubble = {
  backgroundColor: '#334155',
  borderRadius: '8px',
  padding: '15px'
};

const messageTitle = {
  color: '#fbbf24',
  fontSize: '12px',
  fontWeight: 'bold',
  margin: '0 0 8px',
  letterSpacing: '1px'
};

const messageText = {
  color: '#e2e8f0',
  fontSize: '14px',
  lineHeight: '1.6',
  margin: '0'
};

const upgradeSection = {
  backgroundColor: '#7c2d12',
  borderRadius: '12px',
  padding: '20px',
  marginBottom: '20px',
  textAlign: 'center' as const,
  border: '2px solid #fbbf24'
};

const upgradeText = {
  color: '#fef3c7',
  fontSize: '14px',
  margin: '0 0 15px'
};

const upgradeButton = {
  display: 'inline-block',
  backgroundColor: '#fbbf24',
  color: '#1e293b',
  padding: '12px 24px',
  borderRadius: '8px',
  textDecoration: 'none',
  fontWeight: 'bold',
  fontSize: '14px'
};

const hr = {
  borderColor: '#334155',
  margin: '20px 0'
};

const footer = {
  textAlign: 'center' as const,
  padding: '20px'
};

const footerText = {
  color: '#64748b',
  fontSize: '12px',
  margin: '5px 0'
};

const link = {
  color: '#ef4444',
  textDecoration: 'underline'
};


