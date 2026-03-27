export interface RealMatchResult {
  fixtureId: string;
  homeTeam: string;
  awayTeam: string;
  homeScore: number;
  awayScore: number;
  status: 'finished' | 'live' | 'upcoming';
  date: string;
  matchday: number;
}

class RealResultsService {
  private cache: Map<string, RealMatchResult> = new Map();
  private lastFetch: number = 0;
  private readonly CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

  async fetchRealResults(): Promise<RealMatchResult[]> {
    const now = Date.now();
    
    // Return cached results if still valid
    if (now - this.lastFetch < this.CACHE_DURATION && this.cache.size > 0) {
      return Array.from(this.cache.values());
    }

    try {
      // Mock real results for demonstration
      // In production, this would call a real API like football-data.org
      const mockResults: RealMatchResult[] = [
        {
          fixtureId: '1',
          homeTeam: 'Man City',
          awayTeam: 'Liverpool',
          homeScore: 2,
          awayScore: 1,
          status: 'finished',
          date: '2024-01-27',
          matchday: 21
        },
        {
          fixtureId: '2',
          homeTeam: 'Arsenal',
          awayTeam: 'Chelsea',
          homeScore: 1,
          awayScore: 1,
          status: 'finished',
          date: '2024-01-27',
          matchday: 21
        },
        {
          fixtureId: '3',
          homeTeam: 'Man Utd',
          awayTeam: 'Tottenham',
          homeScore: 0,
          awayScore: 2,
          status: 'finished',
          date: '2024-01-27',
          matchday: 21
        },
        {
          fixtureId: '4',
          homeTeam: 'Newcastle',
          awayTeam: 'Brighton',
          homeScore: 3,
          awayScore: 1,
          status: 'live',
          date: '2024-01-27',
          matchday: 21
        },
        {
          fixtureId: '5',
          homeTeam: 'Everton',
          awayTeam: 'Fulham',
          homeScore: 0,
          awayScore: 0,
          status: 'upcoming',
          date: '2024-01-28',
          matchday: 22
        }
      ];

      // Update cache
      this.cache.clear();
      mockResults.forEach(result => {
        this.cache.set(result.fixtureId, result);
      });
      this.lastFetch = now;

      return mockResults;
    } catch (error) {
      // console.error('Failed to fetch real results:', error);
      return [];
    }
  }

  async getResultForFixture(fixtureId: string): Promise<RealMatchResult | null> {
    const results = await this.fetchRealResults();
    return results.find(r => r.fixtureId === fixtureId) || null;
  }

  async getFinishedResults(): Promise<RealMatchResult[]> {
    const results = await this.fetchRealResults();
    return results.filter(r => r.status === 'finished');
  }

  async updatePredictionsWithRealResults(): Promise<void> {
    const finishedResults = await this.getFinishedResults();
    
    for (const result of finishedResults) {
      // This would integrate with the auth service to update predictions
      // For now, we'll emit an event that the main app can listen to
      window.dispatchEvent(new CustomEvent('matchResult', {
        detail: {
          fixtureId: result.fixtureId,
          homeScore: result.homeScore,
          awayScore: result.awayScore
        }
      }));
    }
  }

  // Simulate real-time updates
  startRealTimeUpdates(): void {
    setInterval(async () => {
      await this.updatePredictionsWithRealResults();
    }, 30000); // Check every 30 seconds
  }

  // Get historical accuracy stats
  getHistoricalAccuracy(userId: string): {
    totalPredictions: number;
    correctPredictions: number;
    exactScores: number;
    correctResults: number;
    accuracy: number;
    exactScoreRate: number;
    resultAccuracy: number;
  } {
    // This would integrate with the auth service
    // For now, return mock data
    return {
      totalPredictions: 45,
      correctPredictions: 28,
      exactScores: 8,
      correctResults: 20,
      accuracy: 62.2,
      exactScoreRate: 17.8,
      resultAccuracy: 44.4
    };
  }

  // Get team-specific prediction accuracy
  getTeamAccuracy(userId: string, team: string): {
    predictions: number;
    accuracy: number;
    avgPoints: number;
  } {
    // Mock data - would integrate with auth service
    return {
      predictions: 12,
      accuracy: 58.3,
      avgPoints: 1.2
    };
  }

  // Get form analysis
  getFormAnalysis(userId: string, lastNGames: number = 10): {
    points: number[];
    accuracy: number;
    trend: 'improving' | 'declining' | 'stable';
  } {
    // Mock data - would integrate with auth service
    const points = [3, 1, 0, 1, 3, 3, 1, 0, 1, 3];
    const recentAvg = points.slice(-5).reduce((a, b) => a + b, 0) / 5;
    const olderAvg = points.slice(0, -5).reduce((a, b) => a + b, 0) / 5;
    
    let trend: 'improving' | 'declining' | 'stable';
    if (recentAvg > olderAvg + 0.5) trend = 'improving';
    else if (recentAvg < olderAvg - 0.5) trend = 'declining';
    else trend = 'stable';

    return {
      points,
      accuracy: (points.filter(p => p > 0).length / points.length) * 100,
      trend
    };
  }
}

export const realResultsService = new RealResultsService();


