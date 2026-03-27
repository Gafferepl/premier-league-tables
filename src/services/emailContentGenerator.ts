// Email Content Generation Service
// Generates tier-specific email content using free APIs and cached data

import { fplCacheService } from './fplCacheService';
import { weatherService } from './weatherService';
import { socialSentimentService } from './socialSentimentService';
import { fplDataTransformer } from '../utils/fplDataTransformer';

export type UserTier = 'free' | 'firstTeam' | 'seasonPass';

export interface CaptainPick {
  player: string;
  team: string;
  position: string;
  confidence: number;
  reason: string;
  fixture: string;
  fixtureRating: number;
  form: number;
  ownership: number;
  price: number;
  sentiment?: {
    score: number;
    mentions: number;
    trend: 'rising' | 'stable' | 'falling';
  };
}

export interface PriceAlert {
  player: string;
  team: string;
  currentPrice: number;
  predictedChange: 'rise' | 'fall' | 'stable';
  probability: number;
  netTransfers: number;
  ownership: number;
  recommendation: string;
}

export interface InjuryReport {
  player: string;
  team: string;
  injury: string;
  status: 'out' | 'doubtful' | 'available';
  expectedReturn: string;
  impact: 'high' | 'medium' | 'low';
  ownership: number;
  replacement?: string;
}

export interface EmailContent {
  tier: UserTier;
  captainPicks: CaptainPick[];
  priceAlerts: PriceAlert[];
  injuryReports: InjuryReport[];
  fixtureAnalysis?: any;
  formAnalysis?: any;
  marketTrends?: any;
  weatherImpact?: any;
  tacticalInsights?: any;
  socialBuzz?: any;
  generatedAt: Date;
}

class EmailContentGeneratorService {
  private cacheKey = 'email_content_cache';
  private cacheHours = parseInt(import.meta.env.VITE_EMAIL_CONTENT_CACHE_HOURS || '6');

  /**
   * Generate email content for specific tier
   */
  async generateContent(tier: UserTier): Promise<EmailContent> {
    // console.log(`📧 Generating ${tier} tier email content...`);

    // Check cache first
    const cached = this.getCachedContent(tier);
    if (cached) {
      // console.log('✅ Using cached email content');
      return cached;
    }

    // Generate fresh content based on tier
    let content: EmailContent;

    switch (tier) {
      case 'free':
        content = await this.generateFreeContent();
        break;
      case 'firstTeam':
        content = await this.generateFirstTeamContent();
        break;
      case 'seasonPass':
        content = await this.generateSeasonPassContent();
        break;
      default:
        throw new Error(`Unknown tier: ${tier}`);
    }

    // Cache the content
    this.cacheContent(tier, content);

    return content;
  }

  /**
   * FREE TIER - Basic but valuable content
   */
  private async generateFreeContent(): Promise<EmailContent> {
    const [bootstrap, fixtures] = await Promise.all([
      fplCacheService.get('bootstrap'),
      fplCacheService.get('fixtures')
    ]);

    const players = bootstrap?.elements || [];
    const teams = bootstrap?.teams || [];
    const fixtureData = fixtures || [];

    // Transform data
    const transformedPlayers = fplDataTransformer.transformAllPlayers(players, teams, fixtureData);

    return {
      tier: 'free',
      captainPicks: await this.generateBasicCaptainPicks(transformedPlayers, 1),
      priceAlerts: await this.generatePriceAlerts(transformedPlayers, 3),
      injuryReports: await this.generateInjuryReports(transformedPlayers, 'major'),
      generatedAt: new Date()
    };
  }

  /**
   * FIRST TEAM - Advanced content with social sentiment
   */
  private async generateFirstTeamContent(): Promise<EmailContent> {
    const [bootstrap, fixtures, sentiment] = await Promise.all([
      fplCacheService.get('bootstrap'),
      fplCacheService.get('fixtures'),
      socialSentimentService.getPlayerSentiment()
    ]);

    const players = bootstrap?.elements || [];
    const teams = bootstrap?.teams || [];
    const fixtureData = fixtures || [];

    const transformedPlayers = fplDataTransformer.transformAllPlayers(players, teams, fixtureData);

    return {
      tier: 'firstTeam',
      captainPicks: await this.generateAdvancedCaptainPicks(transformedPlayers, 3, sentiment),
      priceAlerts: await this.generatePriceAlerts(transformedPlayers, 10),
      injuryReports: await this.generateInjuryReports(transformedPlayers, 'all'),
      formAnalysis: await this.generateFormAnalysis(transformedPlayers, 5),
      marketTrends: await this.generateMarketTrends(transformedPlayers, sentiment),
      generatedAt: new Date()
    };
  }

  /**
   * SEASON PASS - Premium content with all features
   */
  private async generateSeasonPassContent(): Promise<EmailContent> {
    const [bootstrap, fixtures, sentiment, weather] = await Promise.all([
      fplCacheService.get('bootstrap'),
      fplCacheService.get('fixtures'),
      socialSentimentService.getComprehensiveSentiment(),
      weatherService.getUpcomingMatchWeather()
    ]);

    const players = bootstrap?.elements || [];
    const teams = bootstrap?.teams || [];
    const fixtureData = fixtures || [];

    const transformedPlayers = fplDataTransformer.transformAllPlayers(players, teams, fixtureData);

    return {
      tier: 'seasonPass',
      captainPicks: await this.generatePremiumCaptainPicks(transformedPlayers, 5, sentiment?.players),
      priceAlerts: await this.generatePriceAlerts(transformedPlayers, 15),
      injuryReports: await this.generateInjuryReports(transformedPlayers, 'all'),
      formAnalysis: await this.generateFormAnalysis(transformedPlayers, 10),
      marketTrends: await this.generateMarketTrends(transformedPlayers, sentiment?.players),
      weatherImpact: await this.generateWeatherImpact(weather, fixtureData),
      tacticalInsights: await this.generateTacticalInsights(transformedPlayers),
      socialBuzz: sentiment,
      generatedAt: new Date()
    };
  }

  /**
   * Generate basic captain picks (Free tier)
   */
  private async generateBasicCaptainPicks(players: any[], count: number): Promise<CaptainPick[]> {
    // Filter for high-performing players with good fixtures
    const candidates = players
      .filter(p => p.form > 5 && p.fixtureDifficulty <= 3)
      .sort((a, b) => {
        const scoreA = (a.form * 0.4) + (a.pointsPerGame * 0.4) + ((5 - a.fixtureDifficulty) * 0.2);
        const scoreB = (b.form * 0.4) + (b.pointsPerGame * 0.4) + ((5 - b.fixtureDifficulty) * 0.2);
        return scoreB - scoreA;
      })
      .slice(0, count);

    return candidates.map(player => ({
      player: player.name,
      team: player.team,
      position: player.position,
      confidence: Math.min(95, Math.round(60 + (player.form * 3) + (player.pointsPerGame * 2))),
      reason: this.generateCaptainReason(player, 'basic'),
      fixture: `${player.team} vs ${player.nextOpponent || 'TBD'}`,
      fixtureRating: player.fixtureDifficulty,
      form: player.form,
      ownership: player.selectedByPercent,
      price: player.price
    }));
  }

  /**
   * Generate advanced captain picks (First Team)
   */
  private async generateAdvancedCaptainPicks(
    players: any[], 
    count: number, 
    sentiment: any
  ): Promise<CaptainPick[]> {
    const picks = await this.generateBasicCaptainPicks(players, count);

    // Enhance with sentiment data
    return picks.map(pick => ({
      ...pick,
      sentiment: sentiment?.[pick.player] || {
        score: 50,
        mentions: 0,
        trend: 'stable' as const
      },
      confidence: Math.min(95, pick.confidence + (sentiment?.[pick.player]?.score || 0) / 10)
    }));
  }

  /**
   * Generate premium captain picks (Season Pass)
   */
  private async generatePremiumCaptainPicks(
    players: any[],
    count: number,
    sentiment: any
  ): Promise<CaptainPick[]> {
    return this.generateAdvancedCaptainPicks(players, count, sentiment);
  }

  /**
   * Generate price change alerts
   */
  private async generatePriceAlerts(players: any[], count: number): Promise<PriceAlert[]> {
    const alerts = players
      .filter(p => Math.abs(p.transfersIn - p.transfersOut) > 10000)
      .sort((a, b) => Math.abs(b.transfersIn - b.transfersOut) - Math.abs(a.transfersIn - a.transfersOut))
      .slice(0, count);

    return alerts.map(player => {
      const netTransfers = player.transfersIn - player.transfersOut;
      const predictedChange = netTransfers > 200000 ? 'rise' : netTransfers < -100000 ? 'fall' : 'stable';
      const probability = Math.min(95, Math.abs(netTransfers) / 2500);

      return {
        player: player.name,
        team: player.team,
        currentPrice: player.price,
        predictedChange,
        probability,
        netTransfers,
        ownership: player.selectedByPercent,
        recommendation: this.generatePriceRecommendation(predictedChange, probability, player)
      };
    });
  }

  /**
   * Generate injury reports
   */
  private async generateInjuryReports(players: any[], level: 'major' | 'all'): Promise<InjuryReport[]> {
    const injured = players.filter(p => p.chanceOfPlayingNextRound !== null && p.chanceOfPlayingNextRound < 100);

    const filtered = level === 'major' 
      ? injured.filter(p => p.selectedByPercent > 10)
      : injured;

    return filtered.slice(0, level === 'major' ? 5 : 10).map(player => ({
      player: player.name,
      team: player.team,
      injury: player.news || 'Injury',
      status: player.chanceOfPlayingNextRound === 0 ? 'out' : 
              player.chanceOfPlayingNextRound < 50 ? 'doubtful' : 'available',
      expectedReturn: this.estimateReturn(player.chanceOfPlayingNextRound),
      impact: player.selectedByPercent > 20 ? 'high' : player.selectedByPercent > 10 ? 'medium' : 'low',
      ownership: player.selectedByPercent,
      replacement: this.suggestReplacement(player, players)
    }));
  }

  /**
   * Generate form analysis
   */
  private async generateFormAnalysis(players: any[], gameweeks: number): Promise<any> {
    const inForm = players
      .filter(p => p.form > 7)
      .sort((a, b) => b.form - a.form)
      .slice(0, 10);

    const outOfForm = players
      .filter(p => p.form < 3 && p.selectedByPercent > 5)
      .sort((a, b) => a.form - b.form)
      .slice(0, 5);

    return {
      hotPlayers: inForm.map(p => ({
        name: p.name,
        team: p.team,
        form: p.form,
        points: p.totalPoints,
        trend: 'rising'
      })),
      coldPlayers: outOfForm.map(p => ({
        name: p.name,
        team: p.team,
        form: p.form,
        points: p.totalPoints,
        trend: 'falling'
      }))
    };
  }

  /**
   * Generate market trends
   */
  private async generateMarketTrends(players: any[], sentiment: any): Promise<any> {
    const trending = Object.entries(sentiment || {})
      .sort(([, a]: any, [, b]: any) => b.mentions - a.mentions)
      .slice(0, 10);

    return {
      trendingPlayers: trending.map(([name, data]: any) => ({
        name,
        mentions: data.mentions,
        sentiment: data.score,
        trend: data.trend
      })),
      templatePicks: this.identifyTemplatePicks(players),
      differentials: this.identifyDifferentials(players)
    };
  }

  /**
   * Generate weather impact analysis
   */
  private async generateWeatherImpact(weather: any, fixtures: any): Promise<any> {
    if (!weather) return null;

    return {
      affectedMatches: weather.matches || [],
      recommendations: weather.recommendations || []
    };
  }

  /**
   * Generate tactical insights
   */
  private async generateTacticalInsights(players: any[]): Promise<any> {
    return {
      setPieceTakers: this.identifySetPieceTakers(players),
      formationChanges: [],
      rotationRisks: this.identifyRotationRisks(players)
    };
  }

  // Helper methods
  private generateCaptainReason(player: any, type: 'basic' | 'advanced'): string {
    const reasons = [];
    
    if (player.form > 7) reasons.push('excellent form');
    if (player.fixtureDifficulty <= 2) reasons.push('favorable fixture');
    if (player.pointsPerGame > 6) reasons.push('consistent points');
    
    return reasons.join(', ') || 'solid option';
  }

  private generatePriceRecommendation(change: string, probability: number, player: any): string {
    if (change === 'rise' && probability > 70) {
      return `Buy before price rise (${probability}% likely)`;
    } else if (change === 'fall' && probability > 70) {
      return `Sell to avoid price drop (${probability}% likely)`;
    }
    return 'Monitor closely';
  }

  private estimateReturn(chance: number): string {
    if (chance === 0) return '2-3 weeks';
    if (chance < 25) return '1-2 weeks';
    if (chance < 75) return 'This week (doubtful)';
    return 'Available';
  }

  private suggestReplacement(player: any, allPlayers: any[]): string {
    const similar = allPlayers
      .filter(p => 
        p.position === player.position && 
        p.price <= player.price + 0.5 &&
        p.chanceOfPlayingNextRound === 100
      )
      .sort((a, b) => b.form - a.form)[0];

    return similar?.name || 'TBD';
  }

  private identifyTemplatePicks(players: any[]): any[] {
    return players
      .filter(p => p.selectedByPercent > 30)
      .sort((a, b) => b.selectedByPercent - a.selectedByPercent)
      .slice(0, 5)
      .map(p => ({ name: p.name, ownership: p.selectedByPercent }));
  }

  private identifyDifferentials(players: any[]): any[] {
    return players
      .filter(p => p.selectedByPercent < 5 && p.form > 6)
      .sort((a, b) => b.form - a.form)
      .slice(0, 5)
      .map(p => ({ name: p.name, ownership: p.selectedByPercent, form: p.form }));
  }

  private identifySetPieceTakers(players: any[]): any[] {
    // Simplified - would need actual set piece data
    return [];
  }

  private identifyRotationRisks(players: any[]): any[] {
    // Simplified - would need rotation data
    return [];
  }

  // Cache management
  private getCachedContent(tier: UserTier): EmailContent | null {
    try {
      const cached = localStorage.getItem(`${this.cacheKey}_${tier}`);
      if (!cached) return null;

      const parsed = JSON.parse(cached);
      const age = Date.now() - new Date(parsed.generatedAt).getTime();
      const maxAge = this.cacheHours * 60 * 60 * 1000;

      if (age < maxAge) {
        return parsed;
      }

      localStorage.removeItem(`${this.cacheKey}_${tier}`);
    } catch (error) {
      // console.error('Cache read error:', error);
    }
    return null;
  }

  private cacheContent(tier: UserTier, content: EmailContent): void {
    try {
      localStorage.setItem(`${this.cacheKey}_${tier}`, JSON.stringify(content));
    } catch (error) {
      // console.error('Cache write error:', error);
    }
  }

  /**
   * Clear all cached content
   */
  clearCache(): void {
    ['free', 'firstTeam', 'seasonPass'].forEach(tier => {
      localStorage.removeItem(`${this.cacheKey}_${tier}`);
    });
  }
}

export const emailContentGenerator = new EmailContentGeneratorService();


