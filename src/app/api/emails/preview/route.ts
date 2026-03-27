import { NextRequest, NextResponse } from 'next/server';
import { render } from '@react-email/render';
import { 
  FreeWelcomeEmail, 
  PaidWelcomeEmail, 
  ThankYouEmail, 
  PaymentFailedEmail, 
  CancellationEmail, 
  UnsubscribeConfirmation,
  AssessmentEmail 
} from '@/emails';

const emails = {
  'free-welcome': FreeWelcomeEmail,
  'paid-welcome': PaidWelcomeEmail,
  'thank-you': ThankYouEmail,
  'payment-failed': PaymentFailedEmail,
  'cancellation': CancellationEmail,
  'unsubscribe': UnsubscribeConfirmation,
  'assessment': AssessmentEmail,
};

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const template = searchParams.get('template') || 'free-welcome';
  const password = searchParams.get('password');
  
  // Password protection - check against environment variable
  const correctPassword = import.meta.env.EMAIL_PREVIEW_PASSWORD || 'ellerkerdavid@gmail.com';
  
  if (password !== correctPassword) {
    return NextResponse.json({ 
      error: 'Unauthorized. Password required to access email previews.',
      hint: 'Add ?password=YOUR_PASSWORD to the URL'
    }, { status: 401 });
  }
  
  const EmailComponent = emails[template as keyof typeof emails];
  if (!EmailComponent) {
    return NextResponse.json({ error: 'Template not found' }, { status: 404 });
  }

  // Sample data for preview
  const sampleData = {
    name: 'Alex Ferguson',
    email: 'alex@premierleaguehub.com',
    plan: 'Pro',
    amount: '£9.99',
    last4: '4242',
    attemptDate: 'March 4, 2026',
    cancellationDate: 'March 4, 2026',
    refundInfo: 'March 31, 2026',
    unsubscribeDate: 'March 4, 2026',
    nextBilling: 'April 2, 2026',
    assessmentData: {
      overallRating: 7.8,
      attackStrength: 8.2,
      defenseRating: 7.1,
      budgetEfficiency: 8.5,
      recommendations: [
        "Upgrade your defense - weak link costing points",
        "Consider transferring underperforming midfielder",
        "Your bench is weak - need better coverage"
      ],
      captainPick: "Your top striker has favorable fixtures",
      weakLinks: ["Defense position 3", "Midfielder on bench"],
      tacticalAdvice: "Focus on clean sheet bonuses this week",
      gameweek: 15
    }
  };

  try {
    // Create the email component with sample data
    const emailElement = EmailComponent(sampleData);
    const html = await render(emailElement);

    return new Response(html, {
      headers: { 
        'Content-Type': 'text/html',
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      }
    });
  } catch (error) {
    // console.error('Error rendering email template:', error);
    return NextResponse.json({ error: 'Failed to render email template' }, { status: 500 });
  }
}


