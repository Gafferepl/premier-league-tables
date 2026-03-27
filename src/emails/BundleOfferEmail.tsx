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

interface BundleOfferEmailProps {
  userName?: string;
  userEmail: string;
}

export const BundleOfferEmail: React.FC<BundleOfferEmailProps> = ({
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
            <Text style={headerTitle}>🔥 2-FOR-1 SEASON BUNDLE</Text>
            <Text style={headerSubtitle}>Lock in Current Pricing</Text>
          </Section>

          {/* Main Content */}
          <Section style={content}>
            <Text style={greeting}>Hi {userName},</Text>
            
            <Text style={paragraph}>
              Secure <strong>2 full seasons</strong> of Season Pass for the price of 1!
            </Text>

            {/* Bundle Offer Box */}
            <Section style={offerBox}>
              <Text style={offerTitle}>💎 Bundle Offer</Text>
              
              <Section style={offerDetail}>
                <Text style={offerIcon}>📅</Text>
                <Text style={offerText}>
                  <strong>Get 2025/26 + 2026/27 seasons</strong><br />
                  <span style={offerSubtext}>Full access to all premium features for 2 complete seasons</span>
                </Text>
              </Section>

              <Section style={offerDetail}>
                <Text style={offerIcon}>💰</Text>
                <Text style={offerText}>
                  <strong>Only £49.99 total</strong><br />
                  <span style={offerSubtext}>Just £24.99 per season - incredible value</span>
                </Text>
              </Section>

              <Section style={offerDetail}>
                <Text style={offerIcon}>📈</Text>
                <Text style={offerText}>
                  <strong>Save £10 vs future pricing</strong><br />
                  <span style={offerSubtext}>Season Pass increases to £59.99 next season</span>
                </Text>
              </Section>

              <Section style={offerDetail}>
                <Text style={offerIcon}>⚡</Text>
                <Text style={offerText}>
                  <strong>Limited time offer</strong><br />
                  <span style={offerSubtext}>Lock in current pricing before price increase</span>
                </Text>
              </Section>
            </Section>

            {/* Price Comparison */}
            <Section style={comparisonBox}>
              <Text style={comparisonTitle}>💵 Price Breakdown</Text>
              
              <Section style={comparisonRow}>
                <Text style={comparisonLabel}>2025/26 Season:</Text>
                <Text style={comparisonValue}>£49.99</Text>
              </Section>
              
              <Section style={comparisonRow}>
                <Text style={comparisonLabel}>2026/27 Season (Regular):</Text>
                <Text style={comparisonValueStrike}>£59.99</Text>
              </Section>
              
              <Hr style={divider} />
              
              <Section style={comparisonRow}>
                <Text style={comparisonLabelBold}>Bundle Total:</Text>
                <Text style={comparisonValueHighlight}>£49.99</Text>
              </Section>
              
              <Section style={comparisonRow}>
                <Text style={comparisonLabel}>Per Season:</Text>
                <Text style={comparisonValueGreen}>£24.99</Text>
              </Section>
              
              <Text style={savingsText}>You save £59.99 with this bundle!</Text>
            </Section>

            {/* What's Included */}
            <Section style={featuresBox}>
              <Text style={featuresTitle}>✨ What's Included</Text>
              <Text style={featureItem}>✅ Elite Captain Picks (48h early access)</Text>
              <Text style={featureItem}>✅ Advanced Price Intelligence</Text>
              <Text style={featureItem}>✅ Personalized Team Analysis</Text>
              <Text style={featureItem}>✅ Unlimited Player Comparisons</Text>
              <Text style={featureItem}>✅ Advanced Analytics (xG, xA, ICT)</Text>
              <Text style={featureItem}>✅ Historical Performance Database</Text>
              <Text style={featureItem}>✅ Priority Algorithm Access</Text>
              <Text style={featureItem}>✅ 2 Elite Emails Per Week</Text>
            </Section>

            {/* CTA Button */}
            <Section style={buttonContainer}>
              <Button style={button} href={`https://premierleaguehub.com/bundle-offer?email=${encodeURIComponent(userEmail)}`}>
                Secure Your 2-Season Bundle
              </Button>
            </Section>

            {/* Alternative Offer */}
            <Section style={alternativeBox}>
              <Text style={alternativeText}>
                🏆 <strong>Alternative:</strong> Limited founding member opportunities also available<br />
                <Link href={`https://premierleaguehub.com/founding-member?email=${encodeURIComponent(userEmail)}`} style={alternativeLink}>
                  Lock in £49.99/season FOREVER
                </Link>
              </Text>
            </Section>

            <Text style={paragraph}>
              This bundle offer gives you complete peace of mind for the next 2 seasons at today's pricing.
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

export default BundleOfferEmail;

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
  background: 'linear-gradient(135deg, #10b981 0%, #3b82f6 100%)',
  padding: '30px 20px',
  textAlign: 'center' as const,
  borderRadius: '12px 12px 0 0',
};

const headerTitle = {
  fontSize: '32px',
  fontWeight: 'bold',
  color: '#ffffff',
  margin: '0 0 10px 0',
};

const headerSubtitle = {
  fontSize: '20px',
  fontWeight: '600',
  color: '#e0f2fe',
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

const offerBox = {
  backgroundColor: '#334155',
  padding: '20px',
  borderRadius: '8px',
  margin: '20px 0',
};

const offerTitle = {
  fontSize: '18px',
  fontWeight: 'bold',
  color: '#10b981',
  margin: '0 0 15px 0',
};

const offerDetail = {
  display: 'flex',
  alignItems: 'flex-start',
  margin: '0 0 15px 0',
};

const offerIcon = {
  fontSize: '24px',
  marginRight: '12px',
  minWidth: '30px',
};

const offerText = {
  fontSize: '15px',
  color: '#f1f5f9',
  margin: '0',
  lineHeight: '22px',
};

const offerSubtext = {
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
  color: '#3b82f6',
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

const comparisonLabelBold = {
  fontSize: '14px',
  color: '#f1f5f9',
  fontWeight: 'bold',
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
  fontSize: '16px',
  color: '#fbbf24',
  fontWeight: 'bold',
};

const comparisonValueGreen = {
  fontSize: '14px',
  color: '#10b981',
  fontWeight: 'bold',
};

const savingsText = {
  fontSize: '16px',
  color: '#10b981',
  fontWeight: 'bold',
  textAlign: 'center' as const,
  margin: '15px 0 0 0',
};

const featuresBox = {
  backgroundColor: '#334155',
  padding: '20px',
  borderRadius: '8px',
  margin: '20px 0',
};

const featuresTitle = {
  fontSize: '18px',
  fontWeight: 'bold',
  color: '#60a5fa',
  margin: '0 0 15px 0',
};

const featureItem = {
  fontSize: '14px',
  color: '#cbd5e1',
  margin: '0 0 8px 0',
  lineHeight: '20px',
};

const buttonContainer = {
  textAlign: 'center' as const,
  margin: '30px 0',
};

const button = {
  background: 'linear-gradient(135deg, #10b981 0%, #3b82f6 100%)',
  color: '#ffffff',
  fontSize: '16px',
  fontWeight: 'bold',
  textDecoration: 'none',
  textAlign: 'center' as const,
  display: 'inline-block',
  padding: '14px 30px',
  borderRadius: '8px',
};

const alternativeBox = {
  backgroundColor: '#422006',
  border: '2px solid #fbbf24',
  padding: '15px',
  borderRadius: '8px',
  margin: '20px 0',
  textAlign: 'center' as const,
};

const alternativeText = {
  fontSize: '14px',
  color: '#fde68a',
  margin: '0',
  lineHeight: '22px',
};

const alternativeLink = {
  color: '#fbbf24',
  textDecoration: 'underline',
  fontWeight: 'bold',
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


