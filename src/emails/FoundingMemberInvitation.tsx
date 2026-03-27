import React from 'react';
import {
  Html,
  Head,
  Body,
  Container,
  Section,
  Text,
  Link,
  Img,
  Hr,
  Button,
} from '@react-email/components';

interface FoundingMemberInvitationProps {
  userName?: string;
  userEmail: string;
}

export const FoundingMemberInvitation: React.FC<FoundingMemberInvitationProps> = ({
  userName = 'Manager',
  userEmail,
}) => {
  return (
    <Html>
      <Head />
      <Body style={main}>
        <Container style={container}>
          {/* Header */}
          <Section style={header}>
            <Text style={headerTitle}>🏆 EXCLUSIVE INVITATION</Text>
            <Text style={headerSubtitle}>Founding Member Status</Text>
          </Section>

          {/* Main Content */}
          <Section style={content}>
            <Text style={greeting}>Hi {userName},</Text>
            
            <Text style={paragraph}>
              You're invited to become a <strong>Founding Member</strong> of Premier League Tables.
            </Text>

            {/* Key Benefits Box */}
            <Section style={benefitsBox}>
              <Text style={benefitsTitle}>🔒 Founding Member Benefits</Text>
              
              <Section style={benefit}>
                <Text style={benefitIcon}>💰</Text>
                <Text style={benefitText}>
                  <strong>Lock in £49.99/season pricing FOREVER</strong><br />
                  <span style={benefitSubtext}>Regular price increases to £59.99 next season</span>
                </Text>
              </Section>

              <Section style={benefit}>
                <Text style={benefitIcon}>👑</Text>
                <Text style={benefitText}>
                  <strong>Exclusive founding member badge</strong><br />
                  <span style={benefitSubtext}>Special status on all content and comments</span>
                </Text>
              </Section>

              <Section style={benefit}>
                <Text style={benefitIcon}>🚀</Text>
                <Text style={benefitText}>
                  <strong>Beta features access</strong><br />
                  <span style={benefitSubtext}>Test new features before anyone else</span>
                </Text>
              </Section>

              <Section style={benefit}>
                <Text style={benefitIcon}>⚡</Text>
                <Text style={benefitText}>
                  <strong>Priority support</strong><br />
                  <span style={benefitSubtext}>Get help faster with dedicated channels</span>
                </Text>
              </Section>
            </Section>

            {/* Value Comparison */}
            <Section style={comparisonBox}>
              <Text style={comparisonTitle}>💎 Your Savings</Text>
              <Section style={comparisonRow}>
                <Text style={comparisonLabel}>Current Season Pass:</Text>
                <Text style={comparisonValue}>£49.99/season</Text>
              </Section>
              <Section style={comparisonRow}>
                <Text style={comparisonLabel}>Next Season (2026/27):</Text>
                <Text style={comparisonValueStrike}>£59.99/season</Text>
              </Section>
              <Section style={comparisonRow}>
                <Text style={comparisonLabel}>Founding Member:</Text>
                <Text style={comparisonValueHighlight}>£49.99/season FOREVER</Text>
              </Section>
              <Hr style={divider} />
              <Text style={savingsText}>Save £10 every season for life!</Text>
            </Section>

            {/* Urgency Message */}
            <Section style={urgencyBox}>
              <Text style={urgencyIcon}>⚠️</Text>
              <Text style={urgencyText}>
                <strong>Limited founding member slots available</strong><br />
                When slots are filled, this opportunity never returns.
              </Text>
            </Section>

            {/* CTA Button */}
            <Section style={buttonContainer}>
              <Button style={button} href={`https://premierleaguehub.com/founding-member?email=${encodeURIComponent(userEmail)}`}>
                Claim Your Founding Member Status
              </Button>
            </Section>

            <Text style={paragraph}>
              This is a one-time only offer. Founding member status will never be offered again once slots are filled.
            </Text>

            <Text style={paragraph}>
              Join the exclusive group of founding members who will enjoy lifetime price protection and premium benefits.
            </Text>

            <Text style={signature}>
              The Gaffer<br />
              Premier League Tables
            </Text>
          </Section>

          {/* Footer */}
          <Section style={footer}>
            <Text style={footerText}>
              Not interested? <Link href={`https://premierleaguehub.com/bundle-offer?email=${encodeURIComponent(userEmail)}`} style={footerLink}>
                Check out our 2-Season Bundle offer instead
              </Link>
            </Text>
            <Hr style={divider} />
            <Text style={footerSmall}>
              Premier League Tables | Fantasy Football Intelligence<br />
              You're receiving this because you're subscribed to our newsletter.
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
};

export default FoundingMemberInvitation;

// Styles
const main = {
  backgroundColor: '#0f172a',
  fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
};

const container = {
  margin: '0 auto',
  padding: '20px 0',
  maxWidth: '600px',
};

const header = {
  backgroundColor: '#fbbf24',
  padding: '30px 20px',
  textAlign: 'center' as const,
  borderRadius: '12px 12px 0 0',
};

const headerTitle = {
  fontSize: '32px',
  fontWeight: 'bold',
  color: '#1e293b',
  margin: '0 0 10px 0',
};

const headerSubtitle = {
  fontSize: '20px',
  fontWeight: '600',
  color: '#334155',
  margin: '0',
};

const content = {
  backgroundColor: '#1e293b',
  padding: '40px 30px',
  borderRadius: '0 0 12px 12px',
};

const greeting = {
  fontSize: '18px',
  color: '#f1f5f9',
  margin: '0 0 20px 0',
};

const paragraph = {
  fontSize: '16px',
  lineHeight: '24px',
  color: '#cbd5e1',
  margin: '0 0 20px 0',
};

const benefitsBox = {
  backgroundColor: '#334155',
  padding: '20px',
  borderRadius: '8px',
  margin: '20px 0',
};

const benefitsTitle = {
  fontSize: '18px',
  fontWeight: 'bold',
  color: '#fbbf24',
  margin: '0 0 15px 0',
};

const benefit = {
  display: 'flex',
  alignItems: 'flex-start',
  margin: '0 0 15px 0',
};

const benefitIcon = {
  fontSize: '24px',
  marginRight: '12px',
  minWidth: '30px',
};

const benefitText = {
  fontSize: '15px',
  color: '#f1f5f9',
  margin: '0',
  lineHeight: '22px',
};

const benefitSubtext = {
  fontSize: '13px',
  color: '#94a3b8',
};

const comparisonBox = {
  backgroundColor: '#475569',
  padding: '20px',
  borderRadius: '8px',
  margin: '20px 0',
};

const comparisonTitle = {
  fontSize: '18px',
  fontWeight: 'bold',
  color: '#fbbf24',
  margin: '0 0 15px 0',
  textAlign: 'center' as const,
};

const comparisonRow = {
  display: 'flex',
  justifyContent: 'space-between',
  margin: '0 0 10px 0',
};

const comparisonLabel = {
  fontSize: '14px',
  color: '#cbd5e1',
};

const comparisonValue = {
  fontSize: '14px',
  color: '#f1f5f9',
  fontWeight: '600',
};

const comparisonValueStrike = {
  fontSize: '14px',
  color: '#94a3b8',
  textDecoration: 'line-through',
};

const comparisonValueHighlight = {
  fontSize: '14px',
  color: '#10b981',
  fontWeight: 'bold',
};

const savingsText = {
  fontSize: '16px',
  color: '#10b981',
  fontWeight: 'bold',
  textAlign: 'center' as const,
  margin: '10px 0 0 0',
};

const urgencyBox = {
  backgroundColor: '#7f1d1d',
  border: '2px solid #dc2626',
  padding: '15px',
  borderRadius: '8px',
  margin: '20px 0',
  textAlign: 'center' as const,
};

const urgencyIcon = {
  fontSize: '24px',
  margin: '0 0 10px 0',
};

const urgencyText = {
  fontSize: '15px',
  color: '#fca5a5',
  margin: '0',
  lineHeight: '22px',
};

const buttonContainer = {
  textAlign: 'center' as const,
  margin: '30px 0',
};

const button = {
  backgroundColor: '#fbbf24',
  color: '#1e293b',
  fontSize: '16px',
  fontWeight: 'bold',
  textDecoration: 'none',
  textAlign: 'center' as const,
  display: 'inline-block',
  padding: '14px 30px',
  borderRadius: '8px',
};

const signature = {
  fontSize: '16px',
  color: '#cbd5e1',
  margin: '30px 0 0 0',
  fontStyle: 'italic',
};

const footer = {
  padding: '20px 30px',
  textAlign: 'center' as const,
};

const footerText = {
  fontSize: '14px',
  color: '#94a3b8',
  margin: '0 0 10px 0',
};

const footerLink = {
  color: '#60a5fa',
  textDecoration: 'underline',
};

const footerSmall = {
  fontSize: '12px',
  color: '#64748b',
  margin: '10px 0 0 0',
};

const divider = {
  borderColor: '#475569',
  margin: '15px 0',
};


