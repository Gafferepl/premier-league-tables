// Email Template Service - Beautiful HTML Email Templates
// Generates stunning, responsive email templates with dynamic content

import { EmailContent, CaptainPick, PriceAlert, InjuryReport } from './emailContentGenerator';

class EmailTemplateService {
  /**
   * Generate complete HTML email for tier
   */
  generateEmail(content: EmailContent, userName: string = 'Manager'): string {
    const template = this.getBaseTemplate();
    const body = this.generateEmailBody(content, userName);
    
    return template.replace('{{EMAIL_BODY}}', body);
  }

  /**
   * Base email template with responsive design
   */
  private getBaseTemplate(): string {
    return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>The Gaffer's FPL Intelligence</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background: #0f172a; color: #e2e8f0; line-height: 1.6; }
    .container { max-width: 600px; margin: 0 auto; background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%); }
    .header { background: linear-gradient(135deg, #7c3aed 0%, #4f46e5 100%); padding: 40px 20px; text-align: center; border-bottom: 4px solid #d4af37; }
    .header h1 { color: #ffffff; font-size: 32px; font-weight: 900; margin-bottom: 10px; text-shadow: 2px 2px 4px rgba(0,0,0,0.3); }
    .header p { color: #e0e7ff; font-size: 16px; font-weight: 500; }
    .tier-badge { display: inline-block; background: #d4af37; color: #000; padding: 8px 20px; border-radius: 20px; font-weight: 700; font-size: 14px; margin-top: 15px; text-transform: uppercase; letter-spacing: 1px; }
    .content { padding: 30px 20px; }
    .section { background: rgba(30, 41, 59, 0.6); border: 1px solid rgba(100, 116, 139, 0.3); border-radius: 12px; padding: 25px; margin-bottom: 25px; backdrop-filter: blur(10px); }
    .section-title { color: #d4af37; font-size: 24px; font-weight: 800; margin-bottom: 20px; display: flex; align-items: center; gap: 10px; }
    .section-title::before { content: '⚡'; font-size: 28px; }
    .captain-pick { background: linear-gradient(135deg, rgba(124, 58, 237, 0.2) 0%, rgba(79, 70, 229, 0.2) 100%); border-left: 4px solid #7c3aed; padding: 20px; margin-bottom: 15px; border-radius: 8px; }
    .captain-pick.premium { border-left-color: #d4af37; background: linear-gradient(135deg, rgba(212, 175, 55, 0.2) 0%, rgba(212, 175, 55, 0.1) 100%); }
    .player-name { color: #ffffff; font-size: 22px; font-weight: 700; margin-bottom: 8px; }
    .player-team { color: #94a3b8; font-size: 14px; margin-bottom: 12px; }
    .confidence { display: inline-block; background: #10b981; color: #fff; padding: 6px 14px; border-radius: 20px; font-weight: 700; font-size: 13px; margin-bottom: 12px; }
    .confidence.high { background: #10b981; }
    .confidence.medium { background: #f59e0b; }
    .confidence.low { background: #ef4444; }
    .reason { color: #cbd5e1; font-size: 15px; line-height: 1.6; margin-bottom: 12px; }
    .stats { display: flex; gap: 15px; flex-wrap: wrap; margin-top: 12px; }
    .stat { background: rgba(15, 23, 42, 0.6); padding: 8px 14px; border-radius: 6px; font-size: 13px; }
    .stat-label { color: #94a3b8; font-weight: 600; }
    .stat-value { color: #ffffff; font-weight: 700; margin-left: 6px; }
    .sentiment { background: rgba(16, 185, 129, 0.2); border: 1px solid #10b981; padding: 12px; border-radius: 6px; margin-top: 12px; }
    .sentiment-score { color: #10b981; font-weight: 700; font-size: 16px; }
    .price-alert { background: rgba(30, 41, 59, 0.4); border-left: 3px solid #3b82f6; padding: 15px; margin-bottom: 12px; border-radius: 6px; }
    .price-alert.rise { border-left-color: #10b981; }
    .price-alert.fall { border-left-color: #ef4444; }
    .price-player { color: #ffffff; font-weight: 700; font-size: 16px; margin-bottom: 6px; }
    .price-change { display: inline-block; padding: 4px 10px; border-radius: 4px; font-weight: 700; font-size: 13px; margin-bottom: 8px; }
    .price-change.rise { background: #10b981; color: #fff; }
    .price-change.fall { background: #ef4444; color: #fff; }
    .price-change.stable { background: #64748b; color: #fff; }
    .recommendation { color: #cbd5e1; font-size: 14px; font-style: italic; }
    .injury-report { background: rgba(239, 68, 68, 0.1); border-left: 3px solid #ef4444; padding: 15px; margin-bottom: 12px; border-radius: 6px; }
    .injury-player { color: #ffffff; font-weight: 700; font-size: 16px; margin-bottom: 6px; }
    .injury-status { display: inline-block; padding: 4px 10px; border-radius: 4px; font-weight: 700; font-size: 12px; margin-bottom: 8px; text-transform: uppercase; }
    .injury-status.out { background: #ef4444; color: #fff; }
    .injury-status.doubtful { background: #f59e0b; color: #fff; }
    .injury-status.available { background: #10b981; color: #fff; }
    .injury-details { color: #cbd5e1; font-size: 14px; }
    .footer { background: #0f172a; padding: 30px 20px; text-align: center; border-top: 1px solid rgba(100, 116, 139, 0.3); }
    .footer-text { color: #94a3b8; font-size: 14px; margin-bottom: 15px; }
    .footer-links { margin-top: 20px; }
    .footer-link { color: #7c3aed; text-decoration: none; margin: 0 10px; font-weight: 600; }
    .footer-link:hover { color: #d4af37; }
    .cta-button { display: inline-block; background: linear-gradient(135deg, #7c3aed 0%, #4f46e5 100%); color: #ffffff; padding: 14px 32px; border-radius: 8px; text-decoration: none; font-weight: 700; font-size: 16px; margin: 20px 0; transition: transform 0.2s; }
    .cta-button:hover { transform: translateY(-2px); }
    @media only screen and (max-width: 600px) {
      .header h1 { font-size: 24px; }
      .section-title { font-size: 20px; }
      .stats { flex-direction: column; }
    }
  </style>
</head>
<body>
  <div class="container">
    {{EMAIL_BODY}}
  </div>
</body>
</html>
    `;
  }

  /**
   * Generate email body based on tier
   */
  private generateEmailBody(content: EmailContent, userName: string): string {
    const tierName = this.getTierName(content.tier);
    const tierBadge = this.getTierBadge(content.tier);

    let body = `
      <div class="header">
        <h1>⚽ The Gaffer's FPL Intelligence</h1>
        <p>Your ${tierName} Weekly Digest</p>
        <span class="tier-badge">${tierBadge}</span>
      </div>
      <div class="content">
        <div class="section">
          <p style="color: #e2e8f0; font-size: 16px; margin-bottom: 15px;">
            Alright ${userName}, listen up! Here's your weekly intelligence report. 
            I've analyzed the data, checked the fixtures, and monitored the community buzz. 
            Let's get you those points! 💪
          </p>
        </div>
    `;

    // Captain Picks Section
    body += this.generateCaptainPicksSection(content.captainPicks, content.tier);

    // Price Alerts Section
    if (content.priceAlerts.length > 0) {
      body += this.generatePriceAlertsSection(content.priceAlerts);
    }

    // Injury Reports Section
    if (content.injuryReports.length > 0) {
      body += this.generateInjuryReportsSection(content.injuryReports);
    }

    // Form Analysis (First Team & Season Pass)
    if (content.formAnalysis && content.tier !== 'free') {
      body += this.generateFormAnalysisSection(content.formAnalysis);
    }

    // Market Trends (First Team & Season Pass)
    if (content.marketTrends && content.tier !== 'free') {
      body += this.generateMarketTrendsSection(content.marketTrends);
    }

    // Weather Impact (Season Pass only)
    if (content.weatherImpact && content.tier === 'seasonPass') {
      body += this.generateWeatherSection(content.weatherImpact);
    }

    // Social Buzz (Season Pass only)
    if (content.socialBuzz && content.tier === 'seasonPass') {
      body += this.generateSocialBuzzSection(content.socialBuzz);
    }

    // CTA Section
    body += this.generateCTASection(content.tier);

    // Footer
    body += this.generateFooter();

    body += `</div>`;

    return body;
  }

  /**
   * Generate Captain Picks Section
   */
  private generateCaptainPicksSection(picks: CaptainPick[], tier: string): string {
    const isPremium = tier === 'seasonPass';
    
    let html = `
      <div class="section">
        <h2 class="section-title">Captain Picks</h2>
        <p style="color: #cbd5e1; margin-bottom: 20px;">
          ${tier === 'free' ? 'Your top captain pick this week:' : 
            tier === 'firstTeam' ? 'Your advanced captain selections:' : 
            'Your premium captain picks with full sentiment analysis:'}
        </p>
    `;

    picks.forEach((pick, index) => {
      const confidenceClass = pick.confidence >= 80 ? 'high' : pick.confidence >= 60 ? 'medium' : 'low';
      const pickClass = isPremium && index === 0 ? 'captain-pick premium' : 'captain-pick';

      html += `
        <div class="${pickClass}">
          <div class="player-name">${index + 1}. ${pick.player}</div>
          <div class="player-team">${pick.team} • ${pick.position}</div>
          <span class="confidence ${confidenceClass}">${pick.confidence}% Confidence</span>
          <div class="reason">
            <strong>Why?</strong> ${this.capitalizeFirst(pick.reason)}. 
            Playing ${pick.fixture} (Difficulty: ${pick.fixtureRating}/5).
          </div>
          <div class="stats">
            <div class="stat">
              <span class="stat-label">Form:</span>
              <span class="stat-value">${pick.form.toFixed(1)}</span>
            </div>
            <div class="stat">
              <span class="stat-label">Price:</span>
              <span class="stat-value">£${pick.price.toFixed(1)}m</span>
            </div>
            <div class="stat">
              <span class="stat-label">Ownership:</span>
              <span class="stat-value">${pick.ownership.toFixed(1)}%</span>
            </div>
          </div>
      `;

      if (pick.sentiment && tier !== 'free') {
        html += `
          <div class="sentiment">
            <strong>📊 Community Sentiment:</strong> 
            <span class="sentiment-score">${pick.sentiment.score}% Positive</span>
            <span style="color: #cbd5e1; margin-left: 10px;">
              (${pick.sentiment.mentions} mentions, ${pick.sentiment.trend})
            </span>
          </div>
        `;
      }

      html += `</div>`;
    });

    html += `</div>`;
    return html;
  }

  /**
   * Generate Price Alerts Section
   */
  private generatePriceAlertsSection(alerts: PriceAlert[]): string {
    let html = `
      <div class="section">
        <h2 class="section-title">Price Intelligence</h2>
        <p style="color: #cbd5e1; margin-bottom: 20px;">
          Keep an eye on these price movements:
        </p>
    `;

    alerts.forEach(alert => {
      const changeClass = alert.predictedChange === 'rise' ? 'rise' : 
                         alert.predictedChange === 'fall' ? 'fall' : 'stable';
      const changeText = alert.predictedChange === 'rise' ? '📈 Rising' :
                        alert.predictedChange === 'fall' ? '📉 Falling' : '➡️ Stable';

      html += `
        <div class="price-alert ${changeClass}">
          <div class="price-player">${alert.player} (${alert.team})</div>
          <span class="price-change ${changeClass}">${changeText}</span>
          <div style="color: #cbd5e1; font-size: 14px; margin-bottom: 8px;">
            Current: £${alert.currentPrice.toFixed(1)}m • 
            Probability: ${alert.probability.toFixed(0)}% • 
            Ownership: ${alert.ownership.toFixed(1)}%
          </div>
          <div class="recommendation">💡 ${alert.recommendation}</div>
        </div>
      `;
    });

    html += `</div>`;
    return html;
  }

  /**
   * Generate Injury Reports Section
   */
  private generateInjuryReportsSection(reports: InjuryReport[]): string {
    let html = `
      <div class="section">
        <h2 class="section-title">Injury Room</h2>
        <p style="color: #cbd5e1; margin-bottom: 20px;">
          Stay ahead of the injury news:
        </p>
    `;

    reports.forEach(report => {
      html += `
        <div class="injury-report">
          <div class="injury-player">${report.player} (${report.team})</div>
          <span class="injury-status ${report.status}">${report.status}</span>
          <div class="injury-details">
            <strong>Injury:</strong> ${report.injury}<br>
            <strong>Expected Return:</strong> ${report.expectedReturn}<br>
            <strong>Ownership:</strong> ${report.ownership.toFixed(1)}%
            ${report.replacement ? `<br><strong>💡 Replacement:</strong> ${report.replacement}` : ''}
          </div>
        </div>
      `;
    });

    html += `</div>`;
    return html;
  }

  /**
   * Generate Form Analysis Section
   */
  private generateFormAnalysisSection(formAnalysis: any): string {
    let html = `
      <div class="section">
        <h2 class="section-title">Form Watch</h2>
    `;

    if (formAnalysis.hotPlayers?.length > 0) {
      html += `
        <h3 style="color: #10b981; font-size: 18px; margin-bottom: 15px;">🔥 Hot Players</h3>
      `;
      formAnalysis.hotPlayers.slice(0, 5).forEach((player: any) => {
        html += `
          <div style="background: rgba(16, 185, 129, 0.1); padding: 12px; margin-bottom: 10px; border-radius: 6px; border-left: 3px solid #10b981;">
            <strong style="color: #ffffff;">${player.name}</strong> 
            <span style="color: #94a3b8;">(${player.team})</span>
            <span style="color: #10b981; margin-left: 10px;">Form: ${player.form.toFixed(1)}</span>
          </div>
        `;
      });
    }

    if (formAnalysis.coldPlayers?.length > 0) {
      html += `
        <h3 style="color: #ef4444; font-size: 18px; margin: 20px 0 15px;">❄️ Cold Players</h3>
      `;
      formAnalysis.coldPlayers.slice(0, 3).forEach((player: any) => {
        html += `
          <div style="background: rgba(239, 68, 68, 0.1); padding: 12px; margin-bottom: 10px; border-radius: 6px; border-left: 3px solid #ef4444;">
            <strong style="color: #ffffff;">${player.name}</strong>
            <span style="color: #94a3b8;">(${player.team})</span>
            <span style="color: #ef4444; margin-left: 10px;">Form: ${player.form.toFixed(1)}</span>
          </div>
        `;
      });
    }

    html += `</div>`;
    return html;
  }

  /**
   * Generate Market Trends Section
   */
  private generateMarketTrendsSection(trends: any): string {
    let html = `
      <div class="section">
        <h2 class="section-title">Market Intelligence</h2>
    `;

    if (trends.trendingPlayers?.length > 0) {
      html += `
        <h3 style="color: #7c3aed; font-size: 18px; margin-bottom: 15px;">📈 Trending Players</h3>
        <div style="display: flex; flex-wrap: wrap; gap: 10px; margin-bottom: 20px;">
      `;
      trends.trendingPlayers.slice(0, 5).forEach((player: any) => {
        html += `
          <span style="background: rgba(124, 58, 237, 0.2); color: #e0e7ff; padding: 8px 14px; border-radius: 20px; font-size: 14px; font-weight: 600;">
            ${player.name} (${player.mentions} mentions)
          </span>
        `;
      });
      html += `</div>`;
    }

    if (trends.differentials?.length > 0) {
      html += `
        <h3 style="color: #d4af37; font-size: 18px; margin-bottom: 15px;">💎 Differentials</h3>
      `;
      trends.differentials.slice(0, 3).forEach((player: any) => {
        html += `
          <div style="background: rgba(212, 175, 55, 0.1); padding: 12px; margin-bottom: 10px; border-radius: 6px; border-left: 3px solid #d4af37;">
            <strong style="color: #ffffff;">${player.name}</strong>
            <span style="color: #94a3b8; margin-left: 10px;">Ownership: ${player.ownership.toFixed(1)}%</span>
            <span style="color: #d4af37; margin-left: 10px;">Form: ${player.form.toFixed(1)}</span>
          </div>
        `;
      });
    }

    html += `</div>`;
    return html;
  }

  /**
   * Generate Weather Section
   */
  private generateWeatherSection(weather: any): string {
    if (!weather || !weather.matches || weather.matches.length === 0) return '';

    let html = `
      <div class="section">
        <h2 class="section-title">Weather Impact</h2>
        <p style="color: #cbd5e1; margin-bottom: 20px;">
          Weather conditions for upcoming matches:
        </p>
    `;

    weather.matches.slice(0, 5).forEach((match: any) => {
      const impactColor = match.impact === 'high' ? '#ef4444' : 
                         match.impact === 'medium' ? '#f59e0b' : '#10b981';
      
      html += `
        <div style="background: rgba(30, 41, 59, 0.4); padding: 15px; margin-bottom: 12px; border-radius: 6px; border-left: 3px solid ${impactColor};">
          <strong style="color: #ffffff;">${match.venue}</strong><br>
          <span style="color: #cbd5e1; font-size: 14px;">
            ${match.weather.condition} • ${match.weather.temperature}°C • 
            Wind: ${match.weather.windSpeed}km/h
          </span><br>
          <span style="color: #94a3b8; font-size: 13px; font-style: italic;">
            💡 ${match.recommendation}
          </span>
        </div>
      `;
    });

    html += `</div>`;
    return html;
  }

  /**
   * Generate Social Buzz Section
   */
  private generateSocialBuzzSection(buzz: any): string {
    if (!buzz || !buzz.trending || buzz.trending.length === 0) return '';

    let html = `
      <div class="section">
        <h2 class="section-title">Community Pulse</h2>
        <div style="background: rgba(124, 58, 237, 0.2); padding: 15px; border-radius: 8px; margin-bottom: 15px;">
          <strong style="color: #e0e7ff;">Community Mood:</strong>
          <span style="color: #d4af37; font-size: 18px; font-weight: 700; margin-left: 10px;">
            ${buzz.communityMood.toUpperCase()}
          </span>
        </div>
        <h3 style="color: #7c3aed; font-size: 16px; margin-bottom: 12px;">🔥 Trending Discussions</h3>
        <div style="display: flex; flex-wrap: wrap; gap: 8px;">
    `;

    buzz.trending.slice(0, 8).forEach((topic: string) => {
      html += `
        <span style="background: rgba(79, 70, 229, 0.3); color: #e0e7ff; padding: 6px 12px; border-radius: 16px; font-size: 13px;">
          ${topic}
        </span>
      `;
    });

    html += `</div></div>`;
    return html;
  }

  /**
   * Generate CTA Section
   */
  private generateCTASection(tier: string): string {
    if (tier === 'free') {
      return `
        <div class="section" style="text-align: center;">
          <h3 style="color: #d4af37; font-size: 20px; margin-bottom: 15px;">
            Want More Intelligence?
          </h3>
          <p style="color: #cbd5e1; margin-bottom: 20px;">
            Upgrade to First Team or Season Pass for advanced analytics, 
            social sentiment, weather impact, and more!
          </p>
          <a href="https://premierleaguetables.com/pricing" class="cta-button">
            Upgrade Now
          </a>
        </div>
      `;
    } else if (tier === 'firstTeam') {
      return `
        <div class="section" style="text-align: center;">
          <h3 style="color: #d4af37; font-size: 20px; margin-bottom: 15px;">
            Unlock Premium Features
          </h3>
          <p style="color: #cbd5e1; margin-bottom: 20px;">
            Get weather impact analysis, tactical insights, and full social buzz tracking 
            with Season Pass!
          </p>
          <a href="https://premierleaguetables.com/pricing" class="cta-button">
            Upgrade to Season Pass
          </a>
        </div>
      `;
    }
    return '';
  }

  /**
   * Generate Footer
   */
  private generateFooter(): string {
    return `
      <div class="footer">
        <p class="footer-text">
          <strong>The Gaffer's Hub</strong><br>
          Your trusted FPL intelligence source
        </p>
        <div class="footer-links">
          <a href="https://premierleaguetables.com" class="footer-link">Visit Site</a>
          <a href="https://premierleaguetables.com/tools" class="footer-link">FPL Tools</a>
          <a href="https://premierleaguetables.com/unsubscribe" class="footer-link">Unsubscribe</a>
        </div>
        <p style="color: #64748b; font-size: 12px; margin-top: 20px;">
          © ${new Date().getFullYear()} The Gaffer's Hub. All rights reserved.
        </p>
      </div>
    `;
  }

  // Helper methods
  private getTierName(tier: string): string {
    const names: Record<string, string> = {
      free: 'Free',
      firstTeam: 'First Team',
      seasonPass: 'Season Pass'
    };
    return names[tier] || tier;
  }

  private getTierBadge(tier: string): string {
    const badges: Record<string, string> = {
      free: '🆓 Free Tier',
      firstTeam: '👑 First Team',
      seasonPass: '💎 Season Pass'
    };
    return badges[tier] || tier;
  }

  private capitalizeFirst(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }
}

export const emailTemplateService = new EmailTemplateService();


