export { default as FreeWelcomeEmail } from './FreeWelcomeEmail';
export { default as PaidWelcomeEmail } from './PaidWelcomeEmail';
export { default as ThankYouEmail } from './ThankYouEmail';
export { default as PaymentFailedEmail } from './PaymentFailedEmail';
export { default as CancellationEmail } from './CancellationEmail';
export { default as UnsubscribeConfirmation } from './UnsubscribeConfirmation';
export { default as LeagueSelectionEmail } from './LeagueSelectionEmail';
export { default as AssessmentEmail } from './AssessmentEmail';

// Email template types for TypeScript
export interface EmailData {
  name: string;
  email: string;
  plan?: string;
  amount?: string;
  last4?: string;
  attemptDate?: string;
  cancellationDate?: string;
  refundInfo?: string;
  unsubscribeDate?: string;
  nextBilling?: string;
  tier?: 'free' | 'firstTeam' | 'seasonPass';
  leagueCode?: string;
  leagueName?: string;
  assessmentData?: {
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

export type EmailTemplate = 
  | 'free-welcome'
  | 'paid-welcome'
  | 'thank-you'
  | 'payment-failed'
  | 'cancellation'
  | 'unsubscribe'
  | 'league-selection'
  | 'assessment';

export const emailTemplates = {
  'free-welcome': {
    name: 'Free Welcome Email',
    description: 'Sent to new free users',
    subject: 'Welcome to premierleaguetables.com! 🏆',
  },
  'paid-welcome': {
    name: 'Paid Welcome Email',
    description: 'Sent to new premium subscribers',
    subject: 'Welcome to the Elite Side of FPL! 👑',
  },
  'thank-you': {
    name: 'Thank You Email',
    description: 'Payment confirmation for first payment',
    subject: 'Payment Successful - Welcome to PL Hub! ✅',
  },
  'payment-failed': {
    name: 'Payment Failed Email',
    description: 'Sent when payment processing fails',
    subject: 'Payment Failed - Action Required ⚠️',
  },
  'cancellation': {
    name: 'Cancellation Email',
    description: 'Sent when user cancels subscription',
    subject: 'Sorry to See You Go 😔',
  },
  'unsubscribe': {
    name: 'Unsubscribe Confirmation',
    description: 'Sent when user unsubscribes from marketing',
    subject: 'Successfully Unsubscribed ✅',
  },
  'league-selection': {
    name: 'League Selection Email',
    description: 'Sent to users selected for Gaffer\'s League',
    subject: '🎉 YOU\'RE IN! Welcome to the Gaffer\'s League',
  },
  'assessment': {
    name: 'Team Assessment Email',
    description: 'Weekly team analysis for premium users',
    subject: '🏆 The Gaffer\'s Weekly Team Assessment',
  },
} as const;


