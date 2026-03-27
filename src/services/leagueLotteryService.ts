// Gaffer's League Lottery Service
// Handles random selection of league participants

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = import.meta.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = (supabaseUrl && supabaseKey) ? createClient(supabaseUrl, supabaseKey) : null;

export type LeagueTier = 'free' | 'firstTeam' | 'seasonPass';

export interface LeagueApplicant {
  id: string;
  email: string;
  name: string;
  tier: LeagueTier;
  league_opt_in: boolean;
  waitlist_opt_in: boolean;
  fpl_team_name?: string;
  created_at: string;
}

export interface LeagueSelection {
  id: string;
  applicant_id: string;
  tier: LeagueTier;
  league_code: string;
  league_name: string;
  selected_at: string;
  code_expires_at: string;
}

export interface LotteryResult {
  tier: LeagueTier;
  total_applicants: number;
  selected: LeagueApplicant[];
  waitlist: LeagueApplicant[];
  selection_date: string;
}

class LeagueLotteryService {
  /**
   * Fisher-Yates shuffle algorithm for random selection
   */
  private shuffleArray<T>(array: T[]): T[] {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }

  /**
   * Generate a unique league code
   */
  private generateLeagueCode(): string {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // Exclude similar chars
    let code = '';
    for (let i = 0; i < 8; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
  }

  /**
   * Get all eligible applicants for a tier
   */
  async getEligibleApplicants(tier: LeagueTier): Promise<LeagueApplicant[]> {
    const { data, error } = await supabase
      .from('league_applicants')
      .select('*')
      .eq('tier', tier)
      .eq('league_opt_in', true)
      .is('deleted_at', null);

    if (error) {
      // console.error('Error fetching applicants:', error);
      throw new Error(`Failed to fetch applicants: ${error.message}`);
    }

    // Filter out already selected users
    const { data: existingSelections } = await supabase
      .from('league_selections')
      .select('applicant_id')
      .eq('tier', tier)
      .eq('is_active', true);

    const selectedIds = new Set(existingSelections?.map(s => s.applicant_id) || []);
    
    return (data || []).filter(applicant => !selectedIds.has(applicant.id));
  }

  /**
   * Conduct lottery for a specific tier
   */
  async conductLottery(tier: LeagueTier, maxSpots: number = 50): Promise<LotteryResult> {
    // console.log(`🎲 Starting lottery for ${tier} tier...`);

    // 1. Get all eligible applicants
    const applicants = await this.getEligibleApplicants(tier);
    // console.log(`📊 Found ${applicants.length} eligible applicants`);

    if (applicants.length === 0) {
      throw new Error(`No eligible applicants found for ${tier} tier`);
    }

    // 2. Randomly shuffle applicants
    const shuffled = this.shuffleArray(applicants);

    // 3. Select winners (first N from shuffled array)
    const winners = shuffled.slice(0, Math.min(maxSpots, shuffled.length));
    const waitlist = shuffled.slice(maxSpots);

    // console.log(`✅ Selected ${winners.length} winners`);
    // console.log(`⏳ ${waitlist.length} users added to waitlist`);

    // 4. Get league configuration
    const { data: config } = await supabase
      .from('league_configurations')
      .select('*')
      .eq('tier', tier)
      .single();

    if (!config) {
      throw new Error(`League configuration not found for ${tier}`);
    }

    // 5. Create selections in database
    const selections = await Promise.all(
      winners.map(async (applicant) => {
        const code = this.generateLeagueCode();
        const expiresAt = new Date();
        expiresAt.setHours(expiresAt.getHours() + 48); // 48-hour deadline

        const { data, error } = await supabase
          .from('league_selections')
          .insert({
            applicant_id: applicant.id,
            tier: tier,
            league_code: code,
            league_name: config.league_name,
            fpl_league_id: config.fpl_league_id,
            code_expires_at: expiresAt.toISOString(),
            selection_round: 1
          })
          .select()
          .single();

        if (error) {
          // console.error(`Error creating selection for ${applicant.email}:`, error);
          throw error;
        }

        return data;
      })
    );

    // 6. Add waitlist users
    await Promise.all(
      waitlist.map(async (applicant, index) => {
        const { error } = await supabase
          .from('league_waitlist')
          .insert({
            applicant_id: applicant.id,
            tier: tier,
            position: index + 1,
            priority_level: applicant.waitlist_opt_in ? 1 : 0
          });

        if (error) {
          // console.error(`Error adding ${applicant.email} to waitlist:`, error);
        }
      })
    );

    // 7. Update league configuration
    await supabase
      .from('league_configurations')
      .update({
        current_spots_filled: winners.length,
        selection_date: new Date().toISOString()
      })
      .eq('tier', tier);

    // 8. Log lottery history
    await supabase
      .from('league_lottery_history')
      .insert({
        tier: tier,
        total_applicants: applicants.length,
        selected_count: winners.length,
        selection_algorithm: 'fisher-yates-shuffle',
        notes: `Lottery conducted successfully. ${winners.length} selected, ${waitlist.length} waitlisted.`
      });

    return {
      tier,
      total_applicants: applicants.length,
      selected: winners,
      waitlist: waitlist,
      selection_date: new Date().toISOString()
    };
  }

  /**
   * Conduct lottery for all tiers
   */
  async conductAllLotteries(): Promise<LotteryResult[]> {
    const tiers: LeagueTier[] = ['free', 'firstTeam', 'seasonPass'];
    const results: LotteryResult[] = [];

    for (const tier of tiers) {
      try {
        const result = await this.conductLottery(tier, 50);
        results.push(result);
        // console.log(`✅ ${tier} lottery complete`);
      } catch (error) {
        // console.error(`❌ Error in ${tier} lottery:`, error);
        throw error;
      }
    }

    return results;
  }

  /**
   * Handle expired codes - offer spot to next waitlist user
   */
  async handleExpiredCodes(): Promise<void> {
    // console.log('🔍 Checking for expired codes...');

    const { data: expiredSelections, error } = await supabase
      .from('league_selections')
      .select('*, league_applicants(*)')
      .lt('code_expires_at', new Date().toISOString())
      .is('joined_at', null)
      .eq('is_active', true);

    if (error) {
      // console.error('Error fetching expired codes:', error);
      return;
    }

    if (!expiredSelections || expiredSelections.length === 0) {
      // console.log('✅ No expired codes found');
      return;
    }

    // console.log(`⏰ Found ${expiredSelections.length} expired codes`);

    for (const selection of expiredSelections) {
      // Mark selection as inactive
      await supabase
        .from('league_selections')
        .update({ is_active: false })
        .eq('id', selection.id);

      // Get next person from waitlist
      const { data: nextInLine } = await supabase
        .from('league_waitlist')
        .select('*, league_applicants(*)')
        .eq('tier', selection.tier)
        .order('priority_level', { ascending: false })
        .order('position', { ascending: true })
        .limit(1)
        .single();

      if (nextInLine) {
        // Create new selection for waitlist user
        const newExpiresAt = new Date();
        newExpiresAt.setHours(newExpiresAt.getHours() + 48);

        await supabase
          .from('league_selections')
          .insert({
            applicant_id: nextInLine.applicant_id,
            tier: selection.tier,
            league_code: selection.league_code, // Reuse the same code
            league_name: selection.league_name,
            fpl_league_id: selection.fpl_league_id,
            code_expires_at: newExpiresAt.toISOString(),
            selection_round: (selection.selection_round || 1) + 1
          });

        // Remove from waitlist
        await supabase
          .from('league_waitlist')
          .delete()
          .eq('id', nextInLine.id);

        // console.log(`✅ Offered spot to ${nextInLine.league_applicants.email}`);
      }
    }
  }

  /**
   * Mark user as joined when they use their code
   */
  async markAsJoined(leagueCode: string, applicantId: string): Promise<void> {
    const { error } = await supabase
      .from('league_selections')
      .update({ joined_at: new Date().toISOString() })
      .eq('league_code', leagueCode)
      .eq('applicant_id', applicantId);

    if (error) {
      // console.error('Error marking as joined:', error);
      throw error;
    }

    // console.log(`✅ User ${applicantId} marked as joined`);
  }

  /**
   * Get lottery statistics
   */
  async getStats(tier?: LeagueTier) {
    const { data, error } = await supabase
      .rpc('get_league_stats', { p_tier: tier || null });

    if (error) {
      // console.error('Error fetching stats:', error);
      throw error;
    }

    return data;
  }

  /**
   * Get all selections for a tier
   */
  async getSelections(tier: LeagueTier) {
    const { data, error } = await supabase
      .from('active_league_selections')
      .select('*')
      .eq('tier', tier)
      .order('selected_at', { ascending: false });

    if (error) {
      // console.error('Error fetching selections:', error);
      throw error;
    }

    return data;
  }

  /**
   * Get waitlist for a tier
   */
  async getWaitlist(tier: LeagueTier) {
    const { data, error } = await supabase
      .from('waitlist_with_details')
      .select('*')
      .eq('tier', tier);

    if (error) {
      // console.error('Error fetching waitlist:', error);
      throw error;
    }

    return data;
  }
}

export const leagueLotteryService = new LeagueLotteryService();


