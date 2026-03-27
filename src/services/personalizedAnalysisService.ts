// Personalized FPL Team Analysis Service
// Analyzes user's actual FPL team using cached data

interface UserTeam {
  picks: Array<{
    element: number;
    position: number;
    is_captain: boolean;
    is_vice_captain: boolean;
  }>;
  chips: any[];
  transfers: {
    cost: number;
    status: string;
    limit: number;
    made: number;
    bank: number;
    value: number;
  };
}

interface Player {
  id: number;
  web_name: string;
  team: number;
  element_type: number;
  now_cost: number;
  selected_by_percent: string;
  form: string;
  points_per_game: string;
  total_points: number;
  minutes: number;
  goals_scored: number;
  assists: number;
  clean_sheets: number;
  goals_conceded: number;
  bonus: number;
  bps: number;
  influence: string;
  creativity: string;
  threat: string;
  ict_index: string;
  news: string;
  news_added: string;
  chance_of_playing_this_round: number | null;
  chance_of_playing_next_round: number | null;
}

interface Fixture {
  id: number;
  team_h: number;
  team_a: number;
  team_h_difficulty: number;
  team_a_difficulty: number;
  event: number;
}

interface CachedData {
  players: Player[];
  fixtures: Fixture[];
  teams: any[];
  currentGameweek: number;
}

interface PersonalizedAnalysis {
  userTeam: {
    totalValue: number;
    bank: number;
    totalPoints: number;
    transfersMade: number;
    transfersRemaining: number;
  };
  captainAnalysis: {
    currentCaptain: {
      name: string;
      team: string;
      form: string;
      fixture: string;
      difficulty: number;
    };
    recommended: {
      name: string;
      team: string;
      form: string;
      fixture: string;
      difficulty: number;
      reasoning: string;
    };
    alternatives: Array<{
      name: string;
      team: string;
      form: string;
      fixture: string;
      reasoning: string;
    }>;
  };
  transferAnalysis: {
    priority: 'high' | 'medium' | 'low';
    suggestions: Array<{
      playerOut: {
        name: string;
        team: string;
        reason: string;
        price: number;
      };
      playerIn: {
        name: string;
        team: string;
        reason: string;
        price: number;
      };
      budgetImpact: number;
    }>;
  };
  injuryAnalysis: {
    atRisk: Array<{
      name: string;
      team: string;
      injury: string;
      chanceOfPlaying: number;
      recommendation: string;
    }>;
  };
  fixtureAnalysis: {
    easyFixtures: Array<{ playerName: string; opponent: string; difficulty: number }>;
    hardFixtures: Array<{ playerName: string; opponent: string; difficulty: number }>;
  };
}

class PersonalizedAnalysisService {
  private cachedData: CachedData | null = null;

  async analyzeUserTeam(fplId: string): Promise<PersonalizedAnalysis> {
    const cachedData = await this.getCachedData();
    const userTeam = await this.fetchUserTeam(fplId);
    
    const userPlayers = this.getUserPlayers(userTeam, cachedData.players);
    
    return {
      userTeam: this.summarizeTeam(userTeam, userPlayers),
      captainAnalysis: this.analyzeCaptainOptions(userTeam, userPlayers, cachedData),
      transferAnalysis: this.analyzeTransferNeeds(userTeam, userPlayers, cachedData),
      injuryAnalysis: this.analyzeInjuryImpact(userPlayers),
      fixtureAnalysis: this.analyzeFixtures(userPlayers, cachedData)
    };
  }

  private async getCachedData(): Promise<CachedData> {
    if (this.cachedData) {
      return this.cachedData;
    }

    try {
      // Use multi-source service to reduce FPL API calls
      const { multiSourceDataService } = await import('./multiSourceDataService');
      const bootstrapData = await multiSourceDataService.getBootstrapData();
      const fixtures = await multiSourceDataService.getFixtures();
      
      this.cachedData = {
        players: bootstrapData.elements || [],
        fixtures: fixtures || [],
        teams: bootstrapData.teams || [],
        currentGameweek: bootstrapData.events?.find((e: any) => e.is_current)?.id || 1
      };
      
      return this.cachedData;
    } catch (error) {
      // console.error('Error fetching cached data:', error);
      return this.getMockCachedData();
    }
  }

  private async fetchUserTeam(fplId: string): Promise<UserTeam> {
    try {
      const { multiSourceDataService } = await import('./multiSourceDataService');
      const currentGW = (await this.getCachedData()).currentGameweek;
      return await multiSourceDataService.getUserTeam(fplId, currentGW);
    } catch (error) {
      // console.error('Error fetching user team:', error);
      return this.getMockUserTeam();
    }
  }

  private getUserPlayers(userTeam: UserTeam, allPlayers: Player[]): Player[] {
    return userTeam.picks.map(pick => {
      const player = allPlayers.find(p => p.id === pick.element);
      return player || this.getMockPlayer();
    });
  }

  private summarizeTeam(userTeam: UserTeam, players: Player[]) {
    const totalPoints = players.reduce((sum, p) => sum + p.total_points, 0);
    
    return {
      totalValue: userTeam.transfers.value / 10,
      bank: userTeam.transfers.bank / 10,
      totalPoints,
      transfersMade: userTeam.transfers.made,
      transfersRemaining: userTeam.transfers.limit - userTeam.transfers.made
    };
  }

  private analyzeCaptainOptions(userTeam: UserTeam, players: Player[], cachedData: CachedData) {
    const currentCaptainPick = userTeam.picks.find(p => p.is_captain);
    const currentCaptain = players.find(p => p.id === currentCaptainPick?.element);
    
    const sortedByForm = [...players]
      .filter(p => p.minutes > 60)
      .sort((a, b) => parseFloat(b.form) - parseFloat(a.form));
    
    const recommended = sortedByForm[0];
    const alternatives = sortedByForm.slice(1, 3);
    
    const getFixtureInfo = (player: Player) => {
      const fixture = cachedData.fixtures.find(f => 
        f.team_h === player.team || f.team_a === player.team
      );
      const isHome = fixture?.team_h === player.team;
      const opponentId = isHome ? fixture?.team_a : fixture?.team_h;
      const opponent = cachedData.teams.find(t => t.id === opponentId);
      const difficulty = isHome ? fixture?.team_h_difficulty : fixture?.team_a_difficulty;
      
      return {
        opponent: opponent?.short_name || 'TBD',
        difficulty: difficulty || 3,
        isHome
      };
    };
    
    const currentFixture = currentCaptain ? getFixtureInfo(currentCaptain) : null;
    const recommendedFixture = getFixtureInfo(recommended);
    
    return {
      currentCaptain: currentCaptain ? {
        name: currentCaptain.web_name,
        team: cachedData.teams.find(t => t.id === currentCaptain.team)?.short_name || '',
        form: currentCaptain.form,
        fixture: currentFixture ? `${currentFixture.isHome ? 'vs' : '@'} ${currentFixture.opponent}` : 'No fixture',
        difficulty: currentFixture?.difficulty || 3
      } : null,
      recommended: {
        name: recommended.web_name,
        team: cachedData.teams.find(t => t.id === recommended.team)?.short_name || '',
        form: recommended.form,
        fixture: `${recommendedFixture.isHome ? 'vs' : '@'} ${recommendedFixture.opponent}`,
        difficulty: recommendedFixture.difficulty,
        reasoning: `In excellent form (${recommended.form}), ${recommendedFixture.difficulty <= 2 ? 'easy fixture' : 'decent fixture'}, averaging ${recommended.points_per_game} points per game`
      },
      alternatives: alternatives.map(alt => {
        const altFixture = getFixtureInfo(alt);
        return {
          name: alt.web_name,
          team: cachedData.teams.find(t => t.id === alt.team)?.short_name || '',
          form: alt.form,
          fixture: `${altFixture.isHome ? 'vs' : '@'} ${altFixture.opponent}`,
          reasoning: `Good form (${alt.form}), ${altFixture.difficulty <= 2 ? 'favorable fixture' : 'reasonable fixture'}`
        };
      })
    };
  }

  private analyzeTransferNeeds(userTeam: UserTeam, players: Player[], cachedData: CachedData) {
    const budget = userTeam.transfers.bank / 10;
    
    const underperformers = players
      .filter(p => parseFloat(p.form) < 3.0 && p.minutes > 60)
      .sort((a, b) => parseFloat(a.form) - parseFloat(b.form));
    
    const injured = players.filter(p => 
      p.chance_of_playing_this_round !== null && 
      p.chance_of_playing_this_round < 75
    );
    
    const problemPlayers = [...injured, ...underperformers].slice(0, 2);
    
    const suggestions = problemPlayers.map(playerOut => {
      const playerOutPrice = playerOut.now_cost / 10;
      const maxBudget = playerOutPrice + budget;
      
      const alternatives = cachedData.players
        .filter(p => 
          p.element_type === playerOut.element_type &&
          p.now_cost / 10 <= maxBudget &&
          parseFloat(p.form) > 4.0 &&
          !players.find(up => up.id === p.id)
        )
        .sort((a, b) => parseFloat(b.form) - parseFloat(a.form))
        .slice(0, 1);
      
      const playerIn = alternatives[0];
      
      if (!playerIn) return null;
      
      return {
        playerOut: {
          name: playerOut.web_name,
          team: cachedData.teams.find(t => t.id === playerOut.team)?.short_name || '',
          reason: playerOut.news ? `Injury: ${playerOut.news}` : `Poor form (${playerOut.form})`,
          price: playerOutPrice
        },
        playerIn: {
          name: playerIn.web_name,
          team: cachedData.teams.find(t => t.id === playerIn.team)?.short_name || '',
          reason: `Excellent form (${playerIn.form}), ${playerIn.selected_by_percent}% ownership`,
          price: playerIn.now_cost / 10
        },
        budgetImpact: (playerIn.now_cost - playerOut.now_cost) / 10
      };
    }).filter(Boolean);
    
    return {
      priority: injured.length > 0 ? 'high' as const : suggestions.length > 0 ? 'medium' as const : 'low' as const,
      suggestions: suggestions as any[]
    };
  }

  private analyzeInjuryImpact(players: Player[]) {
    const atRisk = players
      .filter(p => 
        p.chance_of_playing_this_round !== null && 
        p.chance_of_playing_this_round < 100
      )
      .map(p => ({
        name: p.web_name,
        team: '',
        injury: p.news || 'Fitness concern',
        chanceOfPlaying: p.chance_of_playing_this_round || 0,
        recommendation: p.chance_of_playing_this_round! < 50 
          ? 'Consider transferring out immediately' 
          : 'Monitor closely before deadline'
      }));
    
    return { atRisk };
  }

  private analyzeFixtures(players: Player[], cachedData: CachedData) {
    const fixtureAnalysis = players.map(p => {
      const fixture = cachedData.fixtures.find(f => 
        f.team_h === p.team || f.team_a === p.team
      );
      
      if (!fixture) return null;
      
      const isHome = fixture.team_h === p.team;
      const opponentId = isHome ? fixture.team_a : fixture.team_h;
      const opponent = cachedData.teams.find(t => t.id === opponentId);
      const difficulty = isHome ? fixture.team_h_difficulty : fixture.team_a_difficulty;
      
      return {
        playerName: p.web_name,
        opponent: opponent?.short_name || 'TBD',
        difficulty
      };
    }).filter(Boolean) as any[];
    
    return {
      easyFixtures: fixtureAnalysis.filter(f => f.difficulty <= 2).slice(0, 3),
      hardFixtures: fixtureAnalysis.filter(f => f.difficulty >= 4).slice(0, 3)
    };
  }

  private getMockCachedData(): CachedData {
    return {
      players: [this.getMockPlayer()],
      fixtures: [],
      teams: [{ id: 1, short_name: 'ARS', name: 'Arsenal' }],
      currentGameweek: 16
    };
  }

  private getMockUserTeam(): UserTeam {
    return {
      picks: [
        { element: 1, position: 1, is_captain: true, is_vice_captain: false }
      ],
      chips: [],
      transfers: {
        cost: 0,
        status: 'active',
        limit: 1,
        made: 0,
        bank: 50,
        value: 1000
      }
    };
  }

  private getMockPlayer(): Player {
    return {
      id: 1,
      web_name: 'Haaland',
      team: 1,
      element_type: 4,
      now_cost: 140,
      selected_by_percent: '50.0',
      form: '7.5',
      points_per_game: '8.2',
      total_points: 150,
      minutes: 900,
      goals_scored: 15,
      assists: 3,
      clean_sheets: 5,
      goals_conceded: 10,
      bonus: 12,
      bps: 450,
      influence: '800.0',
      creativity: '500.0',
      threat: '1200.0',
      ict_index: '25.0',
      news: '',
      news_added: '',
      chance_of_playing_this_round: 100,
      chance_of_playing_next_round: 100
    };
  }
}

export const personalizedAnalysisService = new PersonalizedAnalysisService();
export type { PersonalizedAnalysis };


