import { NextRequest, NextResponse } from 'next/server';

// Static HTML templates for preview
const emailTemplates = {
  'free-welcome': `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <style>
        body { font-family: Inter, sans-serif; margin: 0; padding: 0; background: #f3f4f6; }
        .container { max-width: 600px; margin: 0 auto; }
        .header { background: linear-gradient(135deg, #1e40af, #3b82f6); padding: 40px 30px; text-align: center; }
        .logo { font-size: 24px; font-weight: bold; color: white; margin-bottom: 20px; }
        .title { color: white; font-size: 28px; margin-bottom: 10px; }
        .subtitle { color: #e0e7ff; font-size: 16px; }
        .content { padding: 40px 30px; background: #f8fafc; }
        .feature-box { background: white; border-radius: 12px; padding: 20px; margin-bottom: 20px; border-left: 4px solid #3b82f6; }
        .feature-title { font-weight: 600; color: #1f2937; margin-bottom: 8px; }
        .feature-desc { color: #6b7280; font-size: 14px; }
        .cta-section { background: white; padding: 30px; text-align: center; border-radius: 12px; margin-top: 30px; }
        .cta-button { background: linear-gradient(135deg, #1e40af, #3b82f6); color: white; padding: 16px 32px; border-radius: 8px; text-decoration: none; font-weight: 600; display: inline-block; }
        .footer { background: #1f2937; color: white; padding: 30px; text-align: center; font-size: 12px; }
        .stats { display: flex; justify-content: space-around; margin: 30px 0; }
        .stat { text-align: center; }
        .stat-number { font-size: 24px; font-weight: bold; color: #1e40af; }
        .stat-label { font-size: 12px; color: #6b7280; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <div class="logo">⚽ premierleaguetables.com</div>
            <h1 class="title">Welcome to the Hub, Alex!</h1>
            <p class="subtitle">You've joined 50,000+ FPL managers getting smarter insights</p>
        </div>
        <div class="content">
            <div class="stats">
                <div class="stat">
                    <div class="stat-number">50K+</div>
                    <div class="stat-label">Active Managers</div>
                </div>
                <div class="stat">
                    <div class="stat-number">89%</div>
                    <div class="stat-label">Mini-League Wins</div>
                </div>
                <div class="stat">
                    <div class="stat-number">4.8★</div>
                    <div class="stat-label">User Rating</div>
                </div>
            </div>
            <div class="feature-box">
                <div class="feature-title">📊 Basic Player Statistics</div>
                <div class="feature-desc">Access essential player data, form guides, and basic analytics to make informed decisions.</div>
            </div>
            <div class="feature-box">
                <div class="feature-title">🎯 Weekly Predictions</div>
                <div class="feature-desc">Get AI-powered predictions for upcoming fixtures and player performance expectations.</div>
            </div>
            <div class="feature-box">
                <div class="feature-title">👥 Community Access</div>
                <div class="feature-desc">Join discussions, share strategies, and learn from other FPL managers in our community.</div>
            </div>
            <div class="cta-section">
                <h2 style="color: #1f2937; margin-bottom: 10px;">Ready to Dominate Your Mini-League?</h2>
                <p style="color: #6b7280; margin-bottom: 20px;">Join 25,000+ Pro managers with advanced analytics:</p>
                <a href="#" class="cta-button">Upgrade to Pro - £9.99/month</a>
                <p style="font-size: 12px; color: #6b7280; margin-top: 15px;">30-day money-back guarantee • Cancel anytime</p>
            </div>
        </div>
        <div class="footer">
            <p>© 2026 Premier League Tables. All rights reserved.</p>
            <p style="margin-top: 10px;">
                <a href="#" style="color: #9ca3af; text-decoration: none; margin: 0 10px;">Privacy</a>
                <a href="#" style="color: #9ca3af; text-decoration: none; margin: 0 10px;">Terms</a>
                <a href="#" style="color: #9ca3af; text-decoration: none; margin: 0 10px;">Unsubscribe</a>
            </p>
        </div>
    </div>
</body>
</html>
  `,
  'paid-welcome': `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <style>
        body { font-family: Inter, sans-serif; margin: 0; padding: 0; background: #f3f4f6; }
        .container { max-width: 600px; margin: 0 auto; }
        .header { background: linear-gradient(135deg, #1e40af, #3b82f6); padding: 40px 30px; text-align: center; }
        .logo { font-size: 24px; font-weight: bold; color: white; margin-bottom: 20px; }
        .title { color: white; font-size: 28px; margin-bottom: 10px; }
        .subtitle { color: #e0e7ff; font-size: 16px; }
        .content { padding: 40px 30px; background: #f8fafc; }
        .premium-badge { background: linear-gradient(135deg, #f59e0b, #f97316); color: white; padding: 8px 16px; border-radius: 20px; font-weight: 600; font-size: 14px; display: inline-block; margin-bottom: 20px; }
        .feature-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin: 30px 0; }
        .feature-card { background: white; padding: 20px; border-radius: 12px; border-left: 4px solid #3b82f6; }
        .feature-icon { font-size: 24px; margin-bottom: 10px; }
        .feature-title { font-weight: 600; color: #1f2937; margin-bottom: 8px; }
        .feature-desc { color: #6b7280; font-size: 14px; }
        .dashboard-cta { background: linear-gradient(135deg, #10b981, #059669); color: white; padding: 20px; border-radius: 12px; text-align: center; margin-top: 30px; }
        .dashboard-button { background: white; color: #10b981; padding: 16px 32px; border-radius: 8px; text-decoration: none; font-weight: 600; display: inline-block; }
        .footer { background: #1f2937; color: white; padding: 30px; text-align: center; font-size: 12px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <div class="logo">⚽ Premier League Tables</div>
            <div class="premium-badge">👑 PRO MEMBER</div>
            <h1 class="title">Welcome to the Elite, Alex!</h1>
            <p class="subtitle">You've unlocked the full power of FPL analytics</p>
        </div>
        <div class="content">
            <div style="text-align: center; margin-bottom: 30px;">
                <h2 style="color: #1f2937; margin-bottom: 10px;">Your Journey to FPL Domination Starts Now!</h2>
                <p style="color: #6b7280;">You've joined the top 5% of FPL managers who use advanced analytics to win their mini-leagues.</p>
            </div>
            <div class="feature-grid">
                <div class="feature-card">
                    <div class="feature-icon">📊</div>
                    <div class="feature-title">Advanced Analytics</div>
                    <div class="feature-desc">xG, xA, ICT Index, and predictive modeling</div>
                </div>
                <div class="feature-card">
                    <div class="feature-icon">🤖</div>
                    <div class="feature-title">AI-Powered Insights</div>
                    <div class="feature-desc">Gemini AI recommendations and predictions</div>
                </div>
                <div class="feature-card">
                    <div class="feature-icon">👥</div>
                    <div class="feature-title">Elite Manager Tracking</div>
                    <div class="feature-desc">Follow top 10k managers' strategies</div>
                </div>
                <div class="feature-card">
                    <div class="feature-icon">📧</div>
                    <div class="feature-title">Premium Newsletter</div>
                    <div class="feature-desc">Weekly expert analysis and tips</div>
                </div>
                <div class="feature-card">
                    <div class="feature-icon">🎯</div>
                    <div class="feature-title">Custom Predictions</div>
                    <div class="feature-desc">Personalized player recommendations</div>
                </div>
                <div class="feature-card">
                    <div class="feature-icon">📱</div>
                    <div class="feature-title">Mobile App Access</div>
                    <div class="feature-desc">Full-featured mobile experience</div>
                </div>
            </div>
            <div class="dashboard-cta">
                <h2 style="margin-bottom: 10px;">🚀 Ready to Start Winning?</h2>
                <p style="margin-bottom: 20px;">Access your premium dashboard and unlock your FPL potential:</p>
                <a href="#" class="dashboard-button">Go to Dashboard</a>
            </div>
        </div>
        <div class="footer">
            <p>© 2026 Premier League Tables. All rights reserved.</p>
            <p style="margin-top: 10px;">
                <a href="#" style="color: #9ca3af; text-decoration: none; margin: 0 10px;">Privacy</a>
                <a href="#" style="color: #9ca3af; text-decoration: none; margin: 0 10px;">Terms</a>
                <a href="#" style="color: #9ca3af; text-decoration: none; margin: 0 10px;">Manage Subscription</a>
            </p>
        </div>
    </div>
</body>
</html>
  `,
  'thank-you': `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <style>
        body { font-family: Inter, sans-serif; margin: 0; padding: 0; background: #f3f4f6; }
        .container { max-width: 600px; margin: 0 auto; }
        .header { background: linear-gradient(135deg, #10b981, #059669); padding: 40px 30px; text-align: center; }
        .logo { font-size: 24px; font-weight: bold; color: white; margin-bottom: 20px; }
        .title { color: white; font-size: 28px; margin-bottom: 10px; }
        .subtitle { color: #d1fae5; font-size: 16px; }
        .content { padding: 40px 30px; background: #f8fafc; }
        .success-icon { font-size: 48px; color: #10b981; text-align: center; margin-bottom: 20px; }
        .payment-details { background: white; padding: 25px; border-radius: 12px; margin: 20px 0; border-left: 4px solid #10b981; }
        .detail-row { display: flex; justify-content: space-between; margin-bottom: 10px; }
        .detail-label { color: #6b7280; font-size: 14px; }
        .detail-value { color: #1f2937; font-weight: 600; }
        .next-steps { background: #f0f9ff; padding: 25px; border-radius: 12px; margin: 20px 0; border-left: 4px solid #3b82f6; }
        .step-item { display: flex; align-items: center; margin-bottom: 15px; }
        .step-number { background: #3b82f6; color: white; width: 24px; height: 24px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: bold; margin-right: 15px; font-size: 12px; }
        .step-text { color: #1f2937; }
        .dashboard-button { background: linear-gradient(135deg, #1e40af, #3b82f6); color: white; padding: 16px 32px; border-radius: 8px; text-decoration: none; font-weight: 600; display: inline-block; text-align: center; }
        .footer { background: #1f2937; color: white; padding: 30px; text-align: center; font-size: 12px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <div class="logo">⚽ Premier League Tables</div>
            <div class="success-icon">✅</div>
            <h1 class="title">Payment Successful!</h1>
            <p class="subtitle">Welcome to the elite side of FPL management</p>
        </div>
        <div class="content">
            <div style="text-align: center; margin-bottom: 30px;">
                <h2 style="color: #1f2937; margin-bottom: 10px;">Thank you, Alex!</h2>
                <p style="color: #6b7280;">Your Pro subscription is now active. You're ready to start dominating your mini-league!</p>
            </div>
            <div class="payment-details">
                <h3 style="color: #1f2937; margin-bottom: 15px;">Payment Details</h3>
                <div class="detail-row">
                    <span class="detail-label">Plan</span>
                    <span class="detail-value">Pro</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Amount</span>
                    <span class="detail-value">£9.99</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Next Billing</span>
                    <span class="detail-value">April 2, 2026</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Status</span>
                    <span class="detail-value" style="color: #10b981;">✅ Active</span>
                </div>
            </div>
            <div class="next-steps">
                <h3 style="color: #1f2937; margin-bottom: 15px;">What's Next?</h3>
                <div class="step-item">
                    <div class="step-number">1</div>
                    <div class="step-text">Access your premium dashboard with advanced analytics</div>
                </div>
                <div class="step-item">
                    <div class="step-number">2</div>
                    <div class="step-text">Set up your custom FPL team preferences</div>
                </div>
                <div class="step-item">
                    <div class="step-number">3</div>
                    <div class="step-text">Explore AI-powered recommendations</div>
                </div>
                <div class="step-item">
                    <div class="step-number">4</div>
                    <div class="step-text">Join our premium community Discord</div>
                </div>
            </div>
            <div style="text-align: center; margin-top: 30px;">
                <a href="#" class="dashboard-button">Go to Premium Dashboard</a>
            </div>
        </div>
        <div class="footer">
            <p>© 2026 Premier League Tables. All rights reserved.</p>
            <p style="margin-top: 10px;">
                <a href="#" style="color: #9ca3af; text-decoration: none; margin: 0 10px;">Privacy</a>
                <a href="#" style="color: #9ca3af; text-decoration: none; margin: 0 10px;">Terms</a>
                <a href="#" style="color: #9ca3af; text-decoration: none; margin: 0 10px;">Billing Support</a>
            </p>
        </div>
    </div>
</body>
</html>
  `,
  'payment-failed': `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <style>
        body { font-family: Inter, sans-serif; margin: 0; padding: 0; background: #f3f4f6; }
        .container { max-width: 600px; margin: 0 auto; }
        .header { background: linear-gradient(135deg, #ef4444, #dc2626); padding: 40px 30px; text-align: center; }
        .logo { font-size: 24px; font-weight: bold; color: white; margin-bottom: 20px; }
        .title { color: white; font-size: 28px; margin-bottom: 10px; }
        .subtitle { color: #fecaca; font-size: 16px; }
        .content { padding: 40px 30px; background: #f8fafc; }
        .warning-icon { font-size: 48px; color: #ef4444; text-align: center; margin-bottom: 20px; }
        .payment-details { background: white; padding: 25px; border-radius: 12px; margin: 20px 0; border-left: 4px solid #ef4444; }
        .detail-row { display: flex; justify-content: space-between; margin-bottom: 10px; }
        .detail-label { color: #6b7280; font-size: 14px; }
        .detail-value { color: #1f2937; font-weight: 600; }
        .action-steps { background: #fef2f2; padding: 25px; border-radius: 12px; margin: 20px 0; border-left: 4px solid #ef4444; }
        .step-item { display: flex; align-items: flex-start; margin-bottom: 15px; }
        .step-number { background: #ef4444; color: white; width: 24px; height: 24px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: bold; margin-right: 15px; font-size: 12px; flex-shrink: 0; }
        .step-text { color: #1f2937; }
        .update-button { background: linear-gradient(135deg, #ef4444, #dc2626); color: white; padding: 16px 32px; border-radius: 8px; text-decoration: none; font-weight: 600; display: inline-block; text-align: center; }
        .retry-button { background: linear-gradient(135deg, #10b981, #059669); color: white; padding: 16px 32px; border-radius: 8px; text-decoration: none; font-weight: 600; display: inline-block; text-align: center; }
        .footer { background: #1f2937; color: white; padding: 30px; text-align: center; font-size: 12px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <div class="logo">⚽ Premier League Tables</div>
            <div class="warning-icon">⚠️</div>
            <h1 class="title">Payment Failed</h1>
            <p class="subtitle">We couldn't process your subscription payment</p>
        </div>
        <div class="content">
            <div style="text-align: center; margin-bottom: 30px;">
                <h2 style="color: #1f2937; margin-bottom: 10px;">Hi Alex, we need your attention</h2>
                <p style="color: #6b7280;">Your recent payment couldn't be processed. Don't worry - we'll help you fix this quickly!</p>
            </div>
            <div class="payment-details">
                <h3 style="color: #1f2937; margin-bottom: 15px;">Payment Details</h3>
                <div class="detail-row">
                    <span class="detail-label">Amount</span>
                    <span class="detail-value">£9.99</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Card</span>
                    <span class="detail-value">•••• 4242</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Attempt Date</span>
                    <span class="detail-value">March 4, 2026</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Status</span>
                    <span class="detail-value" style="color: #ef4444;">❌ Failed</span>
                </div>
            </div>
            <div class="action-steps">
                <h3 style="color: #1f2937; margin-bottom: 15px;">What You Can Do</h3>
                <div class="step-item">
                    <div class="step-number">1</div>
                    <div class="step-text">
                        <strong>Update your payment method</strong><br>
                        Add a new card or update your existing card details
                    </div>
                </div>
                <div class="step-item">
                    <div class="step-number">2</div>
                    <div class="step-text">
                        <strong>Check with your bank</strong><br>
                        Ensure your card hasn't been blocked or has sufficient funds
                    </div>
                </div>
                <div class="step-item">
                    <div class="step-number">3</div>
                    <div class="step-text">
                        <strong>Retry the payment</strong><br>
                        We'll automatically retry in 3 days, or you can retry now
                    </div>
                </div>
            </div>
            <div style="display: flex; justify-content: center; gap: 15px; margin-top: 30px;">
                <a href="#" class="update-button">Update Payment Method</a>
                <a href="#" class="retry-button">Retry Payment Now</a>
            </div>
        </div>
        <div class="footer">
            <p>© 2026 Premier League Tables. All rights reserved.</p>
            <p style="margin-top: 10px;">
                <a href="#" style="color: #9ca3af; text-decoration: none; margin: 0 10px;">Privacy</a>
                <a href="#" style="color: #9ca3af; text-decoration: none; margin: 0 10px;">Terms</a>
                <a href="#" style="color: #9ca3af; text-decoration: none; margin: 0 10px;">Billing Support</a>
            </p>
        </div>
    </div>
</body>
</html>
  `,
  'cancellation': `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <style>
        body { font-family: Inter, sans-serif; margin: 0; padding: 0; background: #f3f4f6; }
        .container { max-width: 600px; margin: 0 auto; }
        .header { background: linear-gradient(135deg, #6b7280, #4b5563); padding: 40px 30px; text-align: center; }
        .logo { font-size: 24px; font-weight: bold; color: white; margin-bottom: 20px; }
        .title { color: white; font-size: 28px; margin-bottom: 10px; }
        .subtitle { color: #e5e7eb; font-size: 16px; }
        .content { padding: 40px 30px; background: #f8fafc; }
        .sad-icon { font-size: 48px; color: #6b7280; text-align: center; margin-bottom: 20px; }
        .cancellation-details { background: white; padding: 25px; border-radius: 12px; margin: 20px 0; border-left: 4px solid #6b7280; }
        .detail-row { display: flex; justify-content: space-between; margin-bottom: 10px; }
        .detail-label { color: #6b7280; font-size: 14px; }
        .detail-value { color: #1f2937; font-weight: 600; }
        .whats-next { background: #f0f9ff; padding: 25px; border-radius: 12px; margin: 20px 0; border-left: 4px solid #3b82f6; }
        .next-item { display: flex; align-items: flex-start; margin-bottom: 15px; }
        .next-icon { color: #3b82f6; margin-right: 15px; font-size: 18px; flex-shrink: 0; }
        .next-text { color: #1f2937; }
        .come-back { background: linear-gradient(135deg, #f59e0b, #f97316); color: white; padding: 25px; border-radius: 12px; margin: 20px 0; text-align: center; }
        .come-back-button { background: white; color: #f59e0b; padding: 16px 32px; border-radius: 8px; text-decoration: none; font-weight: 600; display: inline-block; }
        .footer { background: #1f2937; color: white; padding: 30px; text-align: center; font-size: 12px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <div class="logo">⚽ Premier League Tables</div>
            <div class="sad-icon">😔</div>
            <h1 class="title">We're Sorry to See You Go</h1>
            <p class="subtitle">Your Pro subscription has been cancelled</p>
        </div>
        <div class="content">
            <div style="text-align: center; margin-bottom: 30px;">
                <h2 style="color: #1f2937; margin-bottom: 10px;">Goodbye for now, Alex</h2>
                <p style="color: #6b7280;">We're sad to see you leave, but we understand. Thanks for being part of the Hub!</p>
            </div>
            <div class="cancellation-details">
                <h3 style="color: #1f2937; margin-bottom: 15px;">Cancellation Details</h3>
                <div class="detail-row">
                    <span class="detail-label">Cancelled Plan</span>
                    <span class="detail-value">Pro</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Cancellation Date</span>
                    <span class="detail-value">March 4, 2026</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Access Until</span>
                    <span class="detail-value">March 31, 2026</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Status</span>
                    <span class="detail-value" style="color: #6b7280;">🔄 Cancelled</span>
                </div>
            </div>
            <div class="whats-next">
                <h3 style="color: #1f2937; margin-bottom: 15px;">What Happens Next?</h3>
                <div class="next-item">
                    <div class="next-icon">📅</div>
                    <div class="next-text">
                        <strong>Access Period</strong><br>
                        You'll keep premium access until the end of your current billing period
                    </div>
                </div>
                <div class="next-item">
                    <div class="next-icon">💾</div>
                    <div class="next-text">
                        <strong>Data Preservation</strong><br>
                        Your account data and preferences will be saved for 90 days
                    </div>
                </div>
                <div class="next-item">
                    <div class="next-icon">📧</div>
                    <div class="next-text">
                        <strong>Email Preferences</strong>
                        <br>
                        You'll only receive essential account emails (no marketing)
                    </div>
                </div>
            </div>
            <div class="come-back">
                <h3 style="margin-bottom: 10px;">🏆 Changed Your Mind?</h3>
                <p style="margin-bottom: 20px;">We'd love to have you back! Reactivate anytime and pick up where you left off.</p>
                <a href="#" class="come-back-button">Reactivate Subscription</a>
                <p style="font-size: 12px; margin-top: 15px; color: #fef3c7;">Special welcome back offer: 20% off your first month</p>
            </div>
        </div>
        <div class="footer">
            <p>© 2026 Premier League Tables. All rights reserved.</p>
            <p style="margin-top: 10px;">
                <a href="#" style="color: #9ca3af; text-decoration: none; margin: 0 10px;">Privacy</a>
                <a href="#" style="color: #9ca3af; text-decoration: none; margin: 0 10px;">Terms</a>
                <a href="#" style="color: #9ca3af; text-decoration: none; margin: 0 10px;">Contact Us</a>
            </p>
        </div>
    </div>
</body>
</html>
  `,
  'unsubscribe': `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <style>
        body { font-family: Inter, sans-serif; margin: 0; padding: 0; background: #f3f4f6; }
        .container { max-width: 600px; margin: 0 auto; }
        .header { background: linear-gradient(135deg, #6b7280, #4b5563); padding: 40px 30px; text-align: center; }
        .logo { font-size: 24px; font-weight: bold; color: white; margin-bottom: 20px; }
        .title { color: white; font-size: 28px; margin-bottom: 10px; }
        .subtitle { color: #e5e7eb; font-size: 16px; }
        .content { padding: 40px 30px; background: #f8fafc; }
        .success-icon { font-size: 48px; color: #10b981; text-align: center; margin-bottom: 20px; }
        .confirmation-details { background: white; padding: 25px; border-radius: 12px; margin: 20px 0; border-left: 4px solid #10b981; }
        .detail-row { display: flex; justify-content: space-between; margin-bottom: 10px; }
        .detail-label { color: #6b7280; font-size: 14px; }
        .detail-value { color: #1f2937; font-weight: 600; }
        .important-section { background: #fef3c7; padding: 25px; border-radius: 12px; margin: 20px 0; border-left: 4px solid #f59e0b; }
        .important-item { display: flex; align-items: flex-start; margin-bottom: 15px; }
        .important-icon { color: #f59e0b; margin-right: 15px; font-size: 18px; flex-shrink: 0; }
        .important-text { color: #92400e; }
        .come-back { background: linear-gradient(135deg, #3b82f6, #1e40af); color: white; padding: 25px; border-radius: 12px; margin: 20px 0; text-align: center; }
        .resubscribe-button { background: white; color: #3b82f6; padding: 16px 32px; border-radius: 8px; text-decoration: none; font-weight: 600; display: inline-block; }
        .footer { background: #1f2937; color: white; padding: 30px; text-align: center; font-size: 12px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <div class="logo">⚽ Premier League Tables</div>
            <div class="success-icon">✅</div>
            <h1 class="title">Successfully Unsubscribed</h1>
            <p class="subtitle">You've been removed from our marketing emails</p>
        </div>
        <div class="content">
            <div style="text-align: center; margin-bottom: 30px;">
                <h2 style="color: #1f2937; margin-bottom: 10px;">You're All Set!</h2>
                <p style="color: #6b7280;">We've successfully removed alex@premierleaguehub.com from all marketing communications.</p>
            </div>
            <div class="confirmation-details">
                <h3 style="color: #1f2937; margin-bottom: 15px;">Unsubscription Details</h3>
                <div class="detail-row">
                    <span class="detail-label">Email Address</span>
                    <span class="detail-value">alex@premierleaguehub.com</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Unsubscribe Date</span>
                    <span class="detail-value">March 4, 2026</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Marketing Emails</span>
                    <span class="detail-value" style="color: #10b981;">❌ Stopped</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Account Status</span>
                    <span class="detail-value">Unchanged</span>
                </div>
            </div>
            <div class="important-section">
                <h3 style="color: #92400e; margin-bottom: 15px;">📧 Important: What You'll Still Receive</h3>
                <div class="important-item">
                    <div class="important-icon">🔐</div>
                    <div class="important-text">
                        <strong>Account-related emails</strong><br>
                        Password resets, login alerts, security notifications
                    </div>
                </div>
                <div class="important-item">
                    <div class="important-icon">💳</div>
                    <div class="important-text">
                        <strong>Billing emails</strong><br>
                        Payment confirmations, invoices, subscription updates
                    </div>
                </div>
                <div class="important-item">
                    <div class="important-icon">⚠️</div>
                    <div class="important-text">
                        <strong>Service announcements</strong><br>
                        Critical updates, maintenance notices, policy changes
                    </div>
                </div>
            </div>
            <div class="come-back">
                <h3 style="margin-bottom: 10px;">🔄 Changed Your Mind?</h3>
                <p style="margin-bottom: 20px;">Miss our FPL insights and tips? You can resubscribe anytime with one click!</p>
                <a href="#" class="resubscribe-button">Resubscribe Now</a>
                <p style="font-size: 12px; margin-top: 15px; color: #dbeafe;">No spam, ever. Just quality FPL content to help you win your mini-league.</p>
            </div>
        </div>
        <div class="footer">
            <p>© 2026 Premier League Tables. All rights reserved.</p>
            <p style="margin-top: 10px;">
                <a href="#" style="color: #9ca3af; text-decoration: none; margin: 0 10px;">Privacy</a>
                <a href="#" style="color: #9ca3af; text-decoration: none; margin: 0 10px;">Terms</a>
                <a href="#" style="color: #9ca3af; text-decoration: none; margin: 0 10px;">Contact Us</a>
            </p>
            <p style="margin-top: 10px; font-size: 10px; color: #6b7280;">Premier League Tables, 123 Football Lane, London, UK</p>
        </div>
    </div>
</body>
</html>
  `
};

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const template = searchParams.get('template') || 'free-welcome';
  
  const emailHtml = emailTemplates[template as keyof typeof emailTemplates];
  
  if (!emailHtml) {
    return NextResponse.json({ error: 'Template not found' }, { status: 404 });
  }

  return new Response(emailHtml, {
    headers: { 
      'Content-Type': 'text/html',
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      'Pragma': 'no-cache',
      'Expires': '0'
    }
  });
}


