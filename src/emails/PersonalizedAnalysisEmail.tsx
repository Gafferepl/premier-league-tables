import React from 'react';
import {
  Html,
  Head,
  Body,
  Container,
  Section,
  Text,
  Link,
  Hr,
  Heading,
  Row,
  Column,
} from '@react-email/components';
import type { PersonalizedAnalysis } from '../services/personalizedAnalysisService';

interface PersonalizedAnalysisEmailProps {
  name: string;
  tier: 'firstTeam' | 'seasonPass';
  gameweek: number;
  analysis: PersonalizedAnalysis;
}

const PersonalizedAnalysisEmail = ({
  name = 'Manager',
  tier = 'firstTeam',
  gameweek = 16,
  analysis
}: PersonalizedAnalysisEmailProps) => {
  const isSeasonPass = tier === 'seasonPass';

  return (
    <Html>
      <Head />
      <Body style={main}>
        <Container style={container}>
          {/* Header */}
          <Section style={header}>
            <Heading style={h1}>
              🎯 Your FPL Team Analysis
            </Heading>
            <Text style={subtitle}>
              Gameweek {gameweek} - Personalized for {name}
            </Text>
            {isSeasonPass && (
              <div style={seasonBadge}>
                👑 SEASON PASS - ELITE ANALYSIS
              </div>
            )}
          </Section>

          {/* Team Overview */}
          <Section style={section}>
            <Heading style={h2}>📊 Your Team Overview</Heading>
            <div style={statsGrid}>
              <div style={statBox}>
                <Text style={statLabel}>Total Points</Text>
                <Text style={statValue}>{analysis.userTeam.totalPoints}</Text>
              </div>
              <div style={statBox}>
                <Text style={statLabel}>Team Value</Text>
                <Text style={statValue}>£{analysis.userTeam.totalValue.toFixed(1)}m</Text>
              </div>
              <div style={statBox}>
                <Text style={statLabel}>Bank</Text>
                <Text style={statValue}>£{analysis.userTeam.bank.toFixed(1)}m</Text>
              </div>
              <div style={statBox}>
                <Text style={statLabel}>Transfers Left</Text>
                <Text style={statValue}>{analysis.userTeam.transfersRemaining}</Text>
              </div>
            </div>
          </Section>

          <Hr style={divider} />

          {/* Captain Analysis */}
          <Section style={section}>
            <Heading style={h2}>👑 Captain Recommendation</Heading>
            
            {analysis.captainAnalysis.currentCaptain && (
              <div style={currentCaptainBox}>
                <Text style={label}>Your Current Captain:</Text>
                <Text style={playerName}>
                  {analysis.captainAnalysis.currentCaptain.name} ({analysis.captainAnalysis.currentCaptain.team})
                </Text>
                <Text style={fixtureText}>
                  {analysis.captainAnalysis.currentCaptain.fixture} - 
                  Difficulty: {getDifficultyBadge(analysis.captainAnalysis.currentCaptain.difficulty)}
                </Text>
                <Text style={formText}>Form: {analysis.captainAnalysis.currentCaptain.form}</Text>
              </div>
            )}

            <div style={recommendedBox}>
              <Text style={recommendedLabel}>🎯 Gaffer's Recommendation:</Text>
              <Text style={recommendedPlayer}>
                {analysis.captainAnalysis.recommended.name} ({analysis.captainAnalysis.recommended.team})
              </Text>
              <Text style={fixtureText}>
                {analysis.captainAnalysis.recommended.fixture} - 
                Difficulty: {getDifficultyBadge(analysis.captainAnalysis.recommended.difficulty)}
              </Text>
              <Text style={formText}>Form: {analysis.captainAnalysis.recommended.form}</Text>
              <div style={reasoningBox}>
                <Text style={reasoningText}>
                  💡 <strong>Why?</strong> {analysis.captainAnalysis.recommended.reasoning}
                </Text>
              </div>
            </div>

            {analysis.captainAnalysis.alternatives.length > 0 && (
              <div style={alternativesBox}>
                <Text style={label}>Alternative Options:</Text>
                {analysis.captainAnalysis.alternatives.map((alt, idx) => (
                  <div key={idx} style={alternativeItem}>
                    <Text style={altPlayerName}>
                      {alt.name} ({alt.team})
                    </Text>
                    <Text style={altFixture}>{alt.fixture}</Text>
                    <Text style={altReasoning}>{alt.reasoning}</Text>
                  </div>
                ))}
              </div>
            )}
          </Section>

          <Hr style={divider} />

          {/* Transfer Analysis */}
          <Section style={section}>
            <Heading style={h2}>🔄 Transfer Recommendations</Heading>
            
            <div style={priorityBadge(analysis.transferAnalysis.priority)}>
              Priority: {analysis.transferAnalysis.priority.toUpperCase()}
            </div>

            {analysis.transferAnalysis.suggestions.length > 0 ? (
              analysis.transferAnalysis.suggestions.map((suggestion, idx) => (
                <div key={idx} style={transferBox}>
                  <Row>
                    <Column style={transferOut}>
                      <Text style={transferLabel}>❌ OUT</Text>
                      <Text style={transferPlayer}>
                        {suggestion.playerOut.name}
                      </Text>
                      <Text style={transferTeam}>
                        {suggestion.playerOut.team} - £{suggestion.playerOut.price}m
                      </Text>
                      <Text style={transferReason}>
                        {suggestion.playerOut.reason}
                      </Text>
                    </Column>
                    <Column style={transferArrow}>
                      <Text style={arrowText}>→</Text>
                    </Column>
                    <Column style={transferIn}>
                      <Text style={transferLabel}>✅ IN</Text>
                      <Text style={transferPlayer}>
                        {suggestion.playerIn.name}
                      </Text>
                      <Text style={transferTeam}>
                        {suggestion.playerIn.team} - £{suggestion.playerIn.price}m
                      </Text>
                      <Text style={transferReason}>
                        {suggestion.playerIn.reason}
                      </Text>
                    </Column>
                  </Row>
                  <Text style={budgetImpact}>
                    Budget Impact: {suggestion.budgetImpact >= 0 ? '+' : ''}{suggestion.budgetImpact.toFixed(1)}m
                  </Text>
                </div>
              ))
            ) : (
              <div style={noTransfersBox}>
                <Text style={noTransfersText}>
                  ✅ Your team looks solid! No urgent transfers needed this week.
                </Text>
              </div>
            )}
          </Section>

          <Hr style={divider} />

          {/* Injury Analysis */}
          {analysis.injuryAnalysis.atRisk.length > 0 && (
            <>
              <Section style={section}>
                <Heading style={h2}>🏥 Injury Alerts</Heading>
                {analysis.injuryAnalysis.atRisk.map((player, idx) => (
                  <div key={idx} style={injuryBox}>
                    <Text style={injuryPlayer}>
                      ⚠️ {player.name} ({player.team})
                    </Text>
                    <Text style={injuryDetail}>
                      {player.injury} - {player.chanceOfPlaying}% chance of playing
                    </Text>
                    <Text style={injuryRecommendation}>
                      💡 {player.recommendation}
                    </Text>
                  </div>
                ))}
              </Section>
              <Hr style={divider} />
            </>
          )}

          {/* Fixture Analysis */}
          {isSeasonPass && (
            <Section style={section}>
              <Heading style={h2}>📅 Fixture Analysis</Heading>
              
              {analysis.fixtureAnalysis.easyFixtures.length > 0 && (
                <div style={fixtureSection}>
                  <Text style={fixtureLabel}>✅ Easy Fixtures (Target for Captain/Bench):</Text>
                  {analysis.fixtureAnalysis.easyFixtures.map((fixture, idx) => (
                    <Text key={idx} style={fixtureItem}>
                      • {fixture.playerName} vs {fixture.opponent} (Difficulty: {fixture.difficulty}/5)
                    </Text>
                  ))}
                </div>
              )}

              {analysis.fixtureAnalysis.hardFixtures.length > 0 && (
                <div style={fixtureSection}>
                  <Text style={fixtureLabel}>⚠️ Tough Fixtures (Consider Benching):</Text>
                  {analysis.fixtureAnalysis.hardFixtures.map((fixture, idx) => (
                    <Text key={idx} style={fixtureItem}>
                      • {fixture.playerName} vs {fixture.opponent} (Difficulty: {fixture.difficulty}/5)
                    </Text>
                  ))}
                </div>
              )}
            </Section>
          )}

          {/* Gaffer's Final Word */}
          <Section style={gafferSection}>
            <Text style={gafferQuote}>
              🗣️ <strong>The Gaffer Says:</strong>
            </Text>
            <Text style={gafferText}>
              "{name}, I've analyzed YOUR actual team and these recommendations are tailored specifically for YOUR squad. 
              {analysis.transferAnalysis.priority === 'high' && ' Act fast on those injury concerns! '}
              {analysis.transferAnalysis.priority === 'low' && ' Your team is in good shape - stick with your plan. '}
              Remember, it's not about following the crowd - it's about making smart decisions for YOUR team. 
              Now go smash your mini-league!"
            </Text>
          </Section>

          {/* CTA */}
          <Section style={ctaSection}>
            <Link href="https://premierleaguehub.com/dashboard" style={button}>
              View Full Dashboard
            </Link>
            <Text style={ctaText}>
              Need more help? Check your personalized dashboard for live updates and detailed analytics.
            </Text>
          </Section>

          {/* Footer */}
          <Section style={footer}>
            <Text style={footerText}>
              This analysis was generated specifically for your FPL team (ID: {analysis.userTeam.totalPoints > 0 ? 'Active' : 'N/A'})
            </Text>
            <Text style={footerText}>
              <Link href="https://premierleaguehub.com" style={footerLink}>premierleaguehub.com</Link>
              {' | '}
              <Link href="https://premierleaguetables.com" style={footerLink}>premierleaguetables.com</Link>
            </Text>
            <Text style={footerText}>
              Sent every Wednesday at 6 PM - Perfect timing for your GW planning
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
};

const getDifficultyBadge = (difficulty: number) => {
  if (difficulty <= 2) return '🟢 Easy';
  if (difficulty === 3) return '🟡 Medium';
  return '🔴 Hard';
};

// Styles
const main = {
  backgroundColor: '#f6f9fc',
  fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
};

const container = {
  backgroundColor: '#ffffff',
  margin: '0 auto',
  padding: '20px 0 48px',
  marginBottom: '64px',
  maxWidth: '600px',
};

const header = {
  padding: '32px 24px',
  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  borderRadius: '8px 8px 0 0',
  textAlign: 'center' as const,
};

const h1 = {
  color: '#ffffff',
  fontSize: '32px',
  fontWeight: 'bold',
  margin: '0 0 8px',
  lineHeight: '1.2',
};

const subtitle = {
  color: '#e0e7ff',
  fontSize: '16px',
  margin: '0',
};

const seasonBadge = {
  backgroundColor: '#fbbf24',
  color: '#78350f',
  padding: '8px 16px',
  borderRadius: '20px',
  fontSize: '12px',
  fontWeight: 'bold',
  display: 'inline-block',
  marginTop: '12px',
};

const section = {
  padding: '24px',
};

const h2 = {
  color: '#1f2937',
  fontSize: '20px',
  fontWeight: 'bold',
  margin: '0 0 16px',
};

const statsGrid = {
  display: 'grid',
  gridTemplateColumns: '1fr 1fr',
  gap: '12px',
  marginBottom: '8px',
};

const statBox = {
  backgroundColor: '#f3f4f6',
  padding: '12px',
  borderRadius: '8px',
  textAlign: 'center' as const,
};

const statLabel = {
  color: '#6b7280',
  fontSize: '12px',
  margin: '0 0 4px',
};

const statValue = {
  color: '#1f2937',
  fontSize: '20px',
  fontWeight: 'bold',
  margin: '0',
};

const divider = {
  borderColor: '#e5e7eb',
  margin: '0',
};

const currentCaptainBox = {
  backgroundColor: '#f9fafb',
  padding: '16px',
  borderRadius: '8px',
  marginBottom: '16px',
  border: '1px solid #e5e7eb',
};

const recommendedBox = {
  backgroundColor: '#ecfdf5',
  padding: '16px',
  borderRadius: '8px',
  border: '2px solid #10b981',
  marginBottom: '16px',
};

const label = {
  color: '#6b7280',
  fontSize: '12px',
  fontWeight: 'bold',
  margin: '0 0 4px',
  textTransform: 'uppercase' as const,
};

const recommendedLabel = {
  color: '#059669',
  fontSize: '14px',
  fontWeight: 'bold',
  margin: '0 0 8px',
};

const playerName = {
  color: '#1f2937',
  fontSize: '18px',
  fontWeight: 'bold',
  margin: '0 0 4px',
};

const recommendedPlayer = {
  color: '#065f46',
  fontSize: '20px',
  fontWeight: 'bold',
  margin: '0 0 8px',
};

const fixtureText = {
  color: '#4b5563',
  fontSize: '14px',
  margin: '0 0 4px',
};

const formText = {
  color: '#6b7280',
  fontSize: '13px',
  margin: '0',
};

const reasoningBox = {
  backgroundColor: '#ffffff',
  padding: '12px',
  borderRadius: '6px',
  marginTop: '12px',
};

const reasoningText = {
  color: '#374151',
  fontSize: '13px',
  margin: '0',
  lineHeight: '1.5',
};

const alternativesBox = {
  backgroundColor: '#f9fafb',
  padding: '16px',
  borderRadius: '8px',
  border: '1px solid #e5e7eb',
};

const alternativeItem = {
  padding: '8px 0',
  borderBottom: '1px solid #e5e7eb',
};

const altPlayerName = {
  color: '#1f2937',
  fontSize: '14px',
  fontWeight: 'bold',
  margin: '0 0 2px',
};

const altFixture = {
  color: '#6b7280',
  fontSize: '12px',
  margin: '0 0 2px',
};

const altReasoning = {
  color: '#9ca3af',
  fontSize: '12px',
  margin: '0',
};

const priorityBadge = (priority: string) => ({
  display: 'inline-block',
  padding: '6px 12px',
  borderRadius: '16px',
  fontSize: '12px',
  fontWeight: 'bold',
  marginBottom: '16px',
  backgroundColor: priority === 'high' ? '#fee2e2' : priority === 'medium' ? '#fef3c7' : '#d1fae5',
  color: priority === 'high' ? '#991b1b' : priority === 'medium' ? '#92400e' : '#065f46',
});

const transferBox = {
  backgroundColor: '#f9fafb',
  padding: '16px',
  borderRadius: '8px',
  marginBottom: '12px',
  border: '1px solid #e5e7eb',
};

const transferOut = {
  width: '45%',
  verticalAlign: 'top' as const,
};

const transferIn = {
  width: '45%',
  verticalAlign: 'top' as const,
};

const transferArrow = {
  width: '10%',
  textAlign: 'center' as const,
  verticalAlign: 'middle' as const,
};

const arrowText = {
  fontSize: '24px',
  color: '#6b7280',
  margin: '0',
};

const transferLabel = {
  fontSize: '11px',
  fontWeight: 'bold',
  margin: '0 0 4px',
  textTransform: 'uppercase' as const,
  color: '#6b7280',
};

const transferPlayer = {
  fontSize: '16px',
  fontWeight: 'bold',
  margin: '0 0 4px',
  color: '#1f2937',
};

const transferTeam = {
  fontSize: '12px',
  margin: '0 0 8px',
  color: '#6b7280',
};

const transferReason = {
  fontSize: '12px',
  margin: '0',
  color: '#4b5563',
  lineHeight: '1.4',
};

const budgetImpact = {
  fontSize: '13px',
  fontWeight: 'bold',
  margin: '12px 0 0',
  color: '#059669',
  textAlign: 'center' as const,
};

const noTransfersBox = {
  backgroundColor: '#ecfdf5',
  padding: '20px',
  borderRadius: '8px',
  textAlign: 'center' as const,
  border: '1px solid #10b981',
};

const noTransfersText = {
  color: '#065f46',
  fontSize: '14px',
  margin: '0',
};

const injuryBox = {
  backgroundColor: '#fef2f2',
  padding: '12px',
  borderRadius: '8px',
  marginBottom: '8px',
  border: '1px solid #fecaca',
};

const injuryPlayer = {
  fontSize: '14px',
  fontWeight: 'bold',
  margin: '0 0 4px',
  color: '#991b1b',
};

const injuryDetail = {
  fontSize: '13px',
  margin: '0 0 4px',
  color: '#7f1d1d',
};

const injuryRecommendation = {
  fontSize: '12px',
  margin: '0',
  color: '#991b1b',
  fontStyle: 'italic' as const,
};

const fixtureSection = {
  marginBottom: '16px',
};

const fixtureLabel = {
  fontSize: '13px',
  fontWeight: 'bold',
  margin: '0 0 8px',
  color: '#374151',
};

const fixtureItem = {
  fontSize: '13px',
  margin: '0 0 4px',
  color: '#6b7280',
  paddingLeft: '8px',
};

const gafferSection = {
  backgroundColor: '#fffbeb',
  padding: '20px 24px',
  borderRadius: '8px',
  border: '2px solid #fbbf24',
  margin: '24px',
};

const gafferQuote = {
  fontSize: '14px',
  fontWeight: 'bold',
  margin: '0 0 8px',
  color: '#92400e',
};

const gafferText = {
  fontSize: '14px',
  margin: '0',
  color: '#78350f',
  lineHeight: '1.6',
  fontStyle: 'italic' as const,
};

const ctaSection = {
  padding: '24px',
  textAlign: 'center' as const,
};

const button = {
  backgroundColor: '#667eea',
  borderRadius: '8px',
  color: '#ffffff',
  fontSize: '16px',
  fontWeight: 'bold',
  textDecoration: 'none',
  textAlign: 'center' as const,
  display: 'inline-block',
  padding: '14px 32px',
  margin: '0 0 16px',
};

const ctaText = {
  color: '#6b7280',
  fontSize: '13px',
  margin: '0',
};

const footer = {
  padding: '24px',
  textAlign: 'center' as const,
  borderTop: '1px solid #e5e7eb',
};

const footerText = {
  color: '#9ca3af',
  fontSize: '12px',
  margin: '4px 0',
};

const footerLink = {
  color: '#667eea',
  textDecoration: 'none',
};

export default PersonalizedAnalysisEmail;


