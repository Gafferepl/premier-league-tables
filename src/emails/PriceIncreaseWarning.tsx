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
  Button,
} from '@react-email/components';

interface PriceIncreaseWarningProps {
  userName?: string;
  userEmail: string;
}

export const PriceIncreaseWarning: React.FC<PriceIncreaseWarningProps> = ({
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
            <Text style={headerIcon}>⚠️</Text>
            <Text style={headerTitle}>PRICE INCREASE ALERT</Text>
            <Text style={headerSubtitle}>Lock in £49.99 Now</Text>
          </Section>

          {/* Main Content */}
          <Section style={content}>
            <Text style={greeting}>Hi {userName},</Text>
            
            <Text style={paragraph}>
              <strong>Important notice:</strong> Season Pass price increases to <strong>£59.99</strong> next season.
            </Text>

            {/* Price Increase Box */}
            <Section style={warningBox}>
              <Text style={warningTitle}>📈 Price Changes</Text>
              
              <Section style={priceRow}>
                <Text style={priceLabel}>Current Season (2025/26):</Text>
                <Text style={priceValue}>£49.99/season</Text>
              </Section>
              
              <Section style={priceRow}>
                <Text style={priceLabel}>Next Season (2026/27):</Text>
                <Text style={priceValueNew}>£59.99/season</Text>
              </Section>
              
              <Hr style={divider} />
              
              <Text style={increaseText}>+£10 increase per season</Text>
            </Section>

            <Text style={paragraph}>
              You have <strong>2 options</strong> to lock in current pricing:
            </Text>

            {/* Option 1: Founding Member */}
            <Section style={optionBox}>
              <Text style={optionNumber}>1️⃣</Text>
              <Section style={optionContent}>
                <Text style={optionTitle}>🏆 Founding Member</Text>
                <Text style={optionPrice}>£49.99/season FOREVER</Text>
                <Text style={optionDescription}>
                  Lock in current pricing for all future seasons. Never pay more than £49.99/season again.
                </Text>
                <Section style={optionBenefits}>
                  <Text style={benefitItem}>✅ Price locked forever at £49.99</Text>
                  <Text style={benefitItem}>✅ Exclusive founding member badge</Text>
                  <Text style={benefitItem}>✅ Beta features access</Text>
                  <Text style={benefitItem}>✅ Priority support</Text>
                </Section>
                <Text style={optionUrgency}>⚡ Limited slots available</Text>
                <Button style={buttonPrimary} href={`https://premierleaguehub.com/founding-member?email=${encodeURIComponent(userEmail)}`}>
                  Become a Founding Member
                </Button>
              </Section>
            </Section>

            {/* Option 2: Bundle */}
            <Section style={optionBox}>
              <Text style={optionNumber}>2️⃣</Text>
              <Section style={optionContent}>
                <Text style={optionTitle}>🔥 2-Season Bundle</Text>
                <Text style={optionPrice}>£49.99 total (£24.99/season)</Text>
                <Text style={optionDescription}>
                  Get 2025/26 + 2026/27 seasons for the price of one. Save £59.99 vs buying separately.
                </Text>
                <Section style={optionBenefits}>
                  <Text style={benefitItem}>✅ 2 full seasons for £49.99</Text>
                  <Text style={benefitItem}>✅ Save £10 vs future pricing</Text>
                  <Text style={benefitItem}>✅ All premium features included</Text>
                  <Text style={benefitItem}>✅ One-time payment</Text>
                </Section>
                <Text style={optionUrgency}>⚡ Limited time offer</Text>
                <Button style={buttonSecondary} href={`https://premierleaguehub.com/bundle-offer?email=${encodeURIComponent(userEmail)}`}>
                  Get 2-Season Bundle
                </Button>
              </Section>
            </Section>

            {/* Comparison Table */}
            <Section style={comparisonBox}>
              <Text style={comparisonTitle}>💰 Compare Your Options</Text>
              
              <Section style={comparisonRow}>
                <Text style={comparisonLabel}>Founding Member:</Text>
                <Text style={comparisonValueGreen}>£49.99/season forever</Text>
              </Section>
              
              <Section style={comparisonRow}>
                <Text style={comparisonLabel}>2-Season Bundle:</Text>
                <Text style={comparisonValueBlue}>£24.99/season (2 seasons)</Text>
              </Section>
              
              <Section style={comparisonRow}>
                <Text style={comparisonLabel}>Regular (Next Season):</Text>
                <Text style={comparisonValueRed}>£59.99/season</Text>
              </Section>
            </Section>

            {/* Urgency Message */}
            <Section style={urgencyBox}>
              <Text style={urgencyText}>
                ⏰ <strong>Don't miss this opportunity!</strong><br />
                Lock in current pricing before the increase takes effect next season.
              </Text>
            </Section>

            <Text style={paragraph}>
              Choose the option that works best for you and secure your savings today.
            </Text>

            <Text style={signature}>
              The Gaffer<br />
              Premier League Tables
            </Text>
          </Section>

          {/* Footer */}
          <Section style={footer}>
            <Text style={footerText}>
              Questions? <Link href="mailto:support@premierleaguehub.com" style={footerLink}>Contact our support team</Link>
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

export default PriceIncreaseWarning;

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
  backgroundColor: '#dc2626',
  padding: '30px 20px',
  textAlign: 'center' as const,
  borderRadius: '12px 12px 0 0',
};

const headerIcon = {
  fontSize: '48px',
  margin: '0 0 10px 0',
};

const headerTitle = {
  fontSize: '28px',
  fontWeight: 'bold',
  color: '#ffffff',
  margin: '0 0 10px 0',
};

const headerSubtitle = {
  fontSize: '18px',
  fontWeight: '600',
  color: '#fecaca',
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

const warningBox = {
  backgroundColor: '#7f1d1d',
  border: '2px solid #dc2626',
  padding: '20px',
  borderRadius: '8px',
  margin: '20px 0',
};

const warningTitle = {
  fontSize: '18px',
  fontWeight: 'bold',
  color: '#fca5a5',
  margin: '0 0 15px 0',
  textAlign: 'center' as const,
};

const priceRow = {
  display: 'flex',
  justifyContent: 'space-between',
  margin: '0 0 10px 0',
};

const priceLabel = {
  fontSize: '14px',
  color: '#fecaca',
};

const priceValue = {
  fontSize: '14px',
  color: '#f1f5f9',
  fontWeight: '600',
};

const priceValueNew = {
  fontSize: '14px',
  color: '#fca5a5',
  fontWeight: 'bold',
};

const increaseText = {
  fontSize: '16px',
  color: '#dc2626',
  fontWeight: 'bold',
  textAlign: 'center' as const,
  margin: '10px 0 0 0',
  backgroundColor: '#fecaca',
  padding: '8px',
  borderRadius: '4px',
};

const optionBox = {
  backgroundColor: '#334155',
  padding: '20px',
  borderRadius: '8px',
  margin: '20px 0',
  display: 'flex',
  gap: '15px',
};

const optionNumber = {
  fontSize: '32px',
  minWidth: '40px',
};

const optionContent = {
  flex: '1',
};

const optionTitle = {
  fontSize: '20px',
  fontWeight: 'bold',
  color: '#fbbf24',
  margin: '0 0 8px 0',
};

const optionPrice = {
  fontSize: '24px',
  fontWeight: 'bold',
  color: '#10b981',
  margin: '0 0 12px 0',
};

const optionDescription = {
  fontSize: '15px',
  color: '#cbd5e1',
  margin: '0 0 15px 0',
  lineHeight: '22px',
};

const optionBenefits = {
  margin: '0 0 15px 0',
};

const benefitItem = {
  fontSize: '14px',
  color: '#94a3b8',
  margin: '0 0 6px 0',
};

const optionUrgency = {
  fontSize: '13px',
  color: '#fbbf24',
  fontWeight: 'bold',
  margin: '0 0 15px 0',
};

const buttonPrimary = {
  backgroundColor: '#fbbf24',
  color: '#1e293b',
  fontSize: '15px',
  fontWeight: 'bold',
  textDecoration: 'none',
  textAlign: 'center' as const,
  display: 'inline-block',
  padding: '12px 24px',
  borderRadius: '6px',
  width: '100%',
};

const buttonSecondary = {
  background: 'linear-gradient(135deg, #10b981 0%, #3b82f6 100%)',
  color: '#ffffff',
  fontSize: '15px',
  fontWeight: 'bold',
  textDecoration: 'none',
  textAlign: 'center' as const,
  display: 'inline-block',
  padding: '12px 24px',
  borderRadius: '6px',
  width: '100%',
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
  color: '#60a5fa',
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

const comparisonValueGreen = {
  fontSize: '14px',
  color: '#10b981',
  fontWeight: 'bold',
};

const comparisonValueBlue = {
  fontSize: '14px',
  color: '#60a5fa',
  fontWeight: 'bold',
};

const comparisonValueRed = {
  fontSize: '14px',
  color: '#f87171',
  fontWeight: 'bold',
};

const urgencyBox = {
  backgroundColor: '#422006',
  border: '2px solid #fbbf24',
  padding: '15px',
  borderRadius: '8px',
  margin: '20px 0',
  textAlign: 'center' as const,
};

const urgencyText = {
  fontSize: '15px',
  color: '#fde68a',
  margin: '0',
  lineHeight: '22px',
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


