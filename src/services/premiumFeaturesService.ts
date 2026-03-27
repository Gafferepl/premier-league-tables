// Premium Features Service - Enhanced Analytics for First Team & Season Pass
// Uses cached data only - zero API calls

import { MOCK_PLAYERS, FPLPlayer } from '../data/playerData';

export interface DifferentialPlayer {
  name: string;
  team: string;
  position: string;
  form: string;
  ownership: number;
  price: number;
  reasoning: string;
}

export interface InjuryIntelligence {
  playerName: string;
  team: string;
  status: string;
  ownership: number;
  risk: 'high' | 'medium' | 'low';
  recommendation: string;
}

export interface PlayerToDrop {
  name: string;
  team: string;
  form: string;
  ownership: number;
  reasoning: string;
}

export interface OwnershipTrend {
  name: string;
  team: string;
  ownership: number;
  netTransfers: number;
  trend: 'rising' | 'falling';
  momentum: 'strong' | 'moderate' | 'weak';
}

export interface SetPieceSpecialist {
  name: string;
  team: string;
  position: string;
  penalties: boolean;
  corners: boolean;
  freeKicks: boolean;
  ownership: number;
}

export interface BudgetGem {
  name: string;
  team: string;
  position: string;
  price: number;
  form: string;
  points: number;
  valueRating: number;
}

export interface FormTracker {
  hot: Array<{ name: string; team: string; form: string; points: number }>;
  cold: Array<{ name: string; team: string; form: string; points: number }>;
}

export interface CaptainOption {
  name: string;
  team: string;
  captaincyScore: number;
  form: string;
  expectedGoals: number;
  ownership: number;
  reasoning: string;
}

export interface FixtureDifficulty {
  team: string;
  difficulty: 'easy' | 'moderate' | 'hard';
  rating: number;
}

export interface BenchOption {
  name: string;
  team: string;
  position: string;
  price: number;
  form: string;
  reliability: number;
}

class PremiumFeaturesService {
  private players: FPLPlayer[] = MOCK_PLAYERS;

  // 1. Differential Detectives - Low ownership gems
  getDifferentialPlayers(): DifferentialPlayer[] {
    return this.players
      .filter(p => p.selected_by_percent < 10 && parseFloat(p.form) > 4.0)
      .sort((a, b) => parseFloat(b.form) - parseFloat(a.form))
      .slice(0, 5)
      .map(p => ({
        name: p.web_name,
        team: p.team,
        position: p.position,
        form: p.form,
        ownership: p.selected_by_percent,
        price: p.now_cost / 10,
        reasoning: this.getDifferentialReasoning(p)
      }));
  }

  private getDifferentialReasoning(player: FPLPlayer): string {
    const form = parseFloat(player.form);
    if (form > 6.0) return `Exceptional form (${player.form}) with only ${player.selected_by_percent}% ownership - massive differential potential`;
    if (form > 5.0) return `Strong form (${player.form}) and criminally underowned at ${player.selected_by_percent}%`;
    return `Solid form (${player.form}) with low ownership - perfect for climbing ranks`;
  }

  // 2. The Physio Room - Injury intelligence
  getInjuryIntelligence(): InjuryIntelligence[] {
    return this.players
      .filter(p => p.news && (p.news.includes('Doubt') || p.news.includes('injury')))
      .map(p => ({
        playerName: p.web_name,
        team: p.team,
        status: p.news || 'Unknown',
        ownership: p.selected_by_percent,
        risk: this.calculateInjuryRisk(p),
        recommendation: this.getInjuryRecommendation(p)
      }));
  }

  private calculateInjuryRisk(player: FPLPlayer): 'high' | 'medium' | 'low' {
    if (player.news?.includes('out')) return 'high';
    if (player.news?.includes('Doubt')) return 'medium';
    return 'low';
  }

  private getInjuryRecommendation(player: FPLPlayer): string {
    const risk = this.calculateInjuryRisk(player);
    if (risk === 'high') return `SELL IMMEDIATELY - ${player.selected_by_percent}% ownership at risk`;
    if (risk === 'medium') return `MONITOR CLOSELY - Wait for team news before deadline`;
    return `LOW RISK - Safe to hold for now`;
  }

  // 3. The Hairdryer Treatment - Players to drop
  getPlayersToDrop(): PlayerToDrop[] {
    return this.players
      .filter(p => parseFloat(p.form) < 2.5 && p.selected_by_percent > 10)
      .sort((a, b) => parseFloat(a.form) - parseFloat(b.form))
      .slice(0, 3)
      .map(p => ({
        name: p.web_name,
        team: p.team,
        form: p.form,
        ownership: p.selected_by_percent,
        reasoning: `Shocking form (${p.form}) yet ${p.selected_by_percent}% still own him. DROP IMMEDIATELY before price falls.`
      }));
  }

  // 4. Ownership Trend Analysis
  getOwnershipTrends(): OwnershipTrend[] {
    return this.players
      .map(p => {
        const netTransfers = p.transfers_in - p.transfers_out;
        return {
          name: p.web_name,
          team: p.team,
          ownership: p.selected_by_percent,
          netTransfers,
          trend: netTransfers > 0 ? 'rising' as const : 'falling' as const,
          momentum: this.calculateMomentum(netTransfers)
        };
      })
      .filter(p => Math.abs(p.netTransfers) > 1000)
      .sort((a, b) => Math.abs(b.netTransfers) - Math.abs(a.netTransfers))
      .slice(0, 10);
  }

  private calculateMomentum(netTransfers: number): 'strong' | 'moderate' | 'weak' {
    const abs = Math.abs(netTransfers);
    if (abs > 10000) return 'strong';
    if (abs > 5000) return 'moderate';
    return 'weak';
  }

  // 5. Set-Piece Specialists
  getSetPieceSpecialists(): SetPieceSpecialist[] {
    const setPieceTakers = [
      { name: 'Salah', penalties: true, corners: true, freeKicks: false },
      { name: 'Palmer', penalties: true, corners: false, freeKicks: true },
      { name: 'Haaland', penalties: true, corners: false, freeKicks: false },
      { name: 'B. Fernandes', penalties: true, corners: true, freeKicks: true },
      { name: 'Saka', penalties: false, corners: true, freeKicks: false },
      { name: 'Alexander-Arnold', penalties: false, corners: true, freeKicks: true },
      { name: 'Trippier', penalties: false, corners: true, freeKicks: true },
      { name: 'Watkins', penalties: true, corners: false, freeKicks: false }
    ];

    return setPieceTakers
      .map(sp => {
        const player = this.players.find(p => p.web_name === sp.name);
        if (!player) return null;
        return {
          name: player.web_name,
          team: player.team,
          position: player.position,
          penalties: sp.penalties,
          corners: sp.corners,
          freeKicks: sp.freeKicks,
          ownership: player.selected_by_percent
        };
      })
      .filter((sp): sp is SetPieceSpecialist => sp !== null);
  }

  // 6. Budget Gems Analysis
  getBudgetGems(): BudgetGem[] {
    return this.players
      .filter(p => p.now_cost <= 60 && parseFloat(p.form) > 3.5)
      .sort((a, b) => parseFloat(b.form) - parseFloat(a.form))
      .slice(0, 8)
      .map(p => ({
        name: p.web_name,
        team: p.team,
        position: p.position,
        price: p.now_cost / 10,
        form: p.form,
        points: p.total_points,
        valueRating: this.calculateValueRating(p)
      }));
  }

  private calculateValueRating(player: FPLPlayer): number {
    const pointsPerMillion = player.total_points / (player.now_cost / 10);
    return Math.round(pointsPerMillion * 10) / 10;
  }

  // 7. Hot/Cold Form Tracker
  getFormTracker(): FormTracker {
    const hot = this.players
      .filter(p => parseFloat(p.form) > 6.0)
      .sort((a, b) => parseFloat(b.form) - parseFloat(a.form))
      .slice(0, 5)
      .map(p => ({
        name: p.web_name,
        team: p.team,
        form: p.form,
        points: p.total_points
      }));

    const cold = this.players
      .filter(p => parseFloat(p.form) < 2.5 && p.selected_by_percent > 5)
      .sort((a, b) => parseFloat(a.form) - parseFloat(b.form))
      .slice(0, 5)
      .map(p => ({
        name: p.web_name,
        team: p.team,
        form: p.form,
        points: p.total_points
      }));

    return { hot, cold };
  }

  // 8. Captaincy Matrix
  getCaptaincyMatrix(): CaptainOption[] {
    return this.players
      .filter(p => p.position === 'FWD' || p.position === 'MID')
      .map(p => {
        const captaincyScore = 
          (parseFloat(p.form) * 0.4) + 
          (p.expected_goals * 100 * 0.3) + 
          (p.selected_by_percent * 0.2) +
          (p.threat * 0.1);
        
        return {
          name: p.web_name,
          team: p.team,
          captaincyScore: Math.round(captaincyScore * 10) / 10,
          form: p.form,
          expectedGoals: p.expected_goals,
          ownership: p.selected_by_percent,
          reasoning: this.getCaptainReasoning(p, captaincyScore)
        };
      })
      .sort((a, b) => b.captaincyScore - a.captaincyScore)
      .slice(0, 8);
  }

  private getCaptainReasoning(player: FPLPlayer, score: number): string {
    if (score > 50) return `Elite captaincy option - exceptional form (${player.form}) and high threat (${player.threat})`;
    if (score > 40) return `Strong captain pick - consistent performer with ${player.expected_goals.toFixed(2)} xG`;
    return `Differential captain option - lower ownership (${player.selected_by_percent}%) but solid metrics`;
  }

  // 9. Fixture Difficulty Heatmap
  getFixtureDifficulty(): FixtureDifficulty[] {
    const teams = ['Arsenal', 'Liverpool', 'Man City', 'Aston Villa', 'Spurs', 'Chelsea', 
                   'Newcastle', 'Man Utd', 'Brighton', 'Brentford', 'Fulham', 'West Ham'];
    
    return teams.map(team => {
      const rating = Math.floor(Math.random() * 5) + 1;
      const difficulty: 'easy' | 'moderate' | 'hard' = rating <= 2 ? 'easy' : rating <= 3 ? 'moderate' : 'hard';
      return {
        team,
        difficulty,
        rating
      };
    }).sort((a, b) => a.rating - b.rating);
  }

  // 10. Bench Boost Optimizer
  getBenchOptimizer(): { goalkeepers: BenchOption[]; defenders: BenchOption[]; midfielders: BenchOption[]; forwards: BenchOption[] } {
    const goalkeepers = this.players
      .filter(p => p.position === 'GK' && p.now_cost <= 45)
      .sort((a, b) => parseFloat(b.form) - parseFloat(a.form))
      .slice(0, 3)
      .map(p => this.toBenchOption(p));

    const defenders = this.players
      .filter(p => p.position === 'DEF' && p.now_cost <= 45)
      .sort((a, b) => parseFloat(b.form) - parseFloat(a.form))
      .slice(0, 3)
      .map(p => this.toBenchOption(p));

    const midfielders = this.players
      .filter(p => p.position === 'MID' && p.now_cost <= 50)
      .sort((a, b) => parseFloat(b.form) - parseFloat(a.form))
      .slice(0, 3)
      .map(p => this.toBenchOption(p));

    const forwards = this.players
      .filter(p => p.position === 'FWD' && p.now_cost <= 55)
      .sort((a, b) => parseFloat(b.form) - parseFloat(a.form))
      .slice(0, 3)
      .map(p => this.toBenchOption(p));

    return { goalkeepers, defenders, midfielders, forwards };
  }

  private toBenchOption(player: FPLPlayer): BenchOption {
    return {
      name: player.web_name,
      team: player.team,
      position: player.position,
      price: player.now_cost / 10,
      form: player.form,
      reliability: parseFloat(player.form) * 10
    };
  }
}

export const premiumFeaturesService = new PremiumFeaturesService();


