// FPL API Client - Primary data source (free)
export class FPLApiClient {
  private baseUrl = 'https://fantasy.premierleague.com/api';
  private requestCount = 0;
  private lastRequestTime = 0;
  private minRequestInterval = 1000; // 1 second between requests

  private async rateLimit(): Promise<void> {
    const now = Date.now();
    const timeSinceLastRequest = now - this.lastRequestTime;
    
    if (timeSinceLastRequest < this.minRequestInterval) {
      await new Promise(resolve => 
        setTimeout(resolve, this.minRequestInterval - timeSinceLastRequest)
      );
    }
    
    this.lastRequestTime = Date.now();
    this.requestCount++;
  }

  async getBootstrapStatic(): Promise<any> {
    await this.rateLimit();
    
    const response = await fetch(`${this.baseUrl}/bootstrap-static/`);
    if (!response.ok) {
      throw new Error(`FPL API error: ${response.status}`);
    }
    
    return response.json();
  }

  async getPlayer(playerId: number): Promise<any> {
    await this.rateLimit();
    
    const response = await fetch(`${this.baseUrl}/element-summary/${playerId}/`);
    if (!response.ok) {
      throw new Error(`FPL API error: ${response.status}`);
    }
    
    return response.json();
  }

  async getFixtures(): Promise<any> {
    await this.rateLimit();
    
    const response = await fetch(`${this.baseUrl}/fixtures/`);
    if (!response.ok) {
      throw new Error(`FPL API error: ${response.status}`);
    }
    
    return response.json();
  }

  async getGameweek(gameweek: number): Promise<any> {
    await this.rateLimit();
    
    const response = await fetch(`${this.baseUrl}/event/${gameweek}/live/`);
    if (!response.ok) {
      throw new Error(`FPL API error: ${response.status}`);
    }
    
    return response.json();
  }

  async getTeam(teamId: number): Promise<any> {
    await this.rateLimit();
    
    const response = await fetch(`${this.baseUrl}/entry/${teamId}/`);
    if (!response.ok) {
      throw new Error(`FPL API error: ${response.status}`);
    }
    
    return response.json();
  }

  async getLeague(leagueId: number): Promise<any> {
    await this.rateLimit();
    
    const response = await fetch(`${this.baseUrl}/leagues-classic/${leagueId}/standings/`);
    if (!response.ok) {
      throw new Error(`FPL API error: ${response.status}`);
    }
    
    return response.json();
  }

  getRequestStats() {
    return {
      totalRequests: this.requestCount,
      lastRequestTime: this.lastRequestTime
    };
  }
}


