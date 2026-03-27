// Automated FPL Assessment Service
interface UserAssessmentData {
  userId: number;
  email: string;
  fplTeamId: string;
  subscriptionTier: string;
}

interface AssessmentResult {
  overallRating: number;
  attackStrength: number;
  defenseRating: number;
  budgetEfficiency: number;
  recommendations: string[];
  captainPick: string;
  weakLinks: string[];
  tacticalAdvice: string;
  gameweek: number;
}

class AutomatedAssessmentService {
  private static instance: AutomatedAssessmentService;

  static getInstance(): AutomatedAssessmentService {
    if (!AutomatedAssessmentService.instance) {
      AutomatedAssessmentService.instance = new AutomatedAssessmentService();
    }
    return AutomatedAssessmentService.instance;
  }

  // 1. Real-time FPL ID collection
  async collectFplId(userId: number, fplTeamId: string, subscriptionTier: string) {
    // console.log(`🏆 Collecting FPL ID ${fplTeamId} for user ${userId}`);
    
    try {
      // Validate FPL ID format
      const isValid = await this.validateFplId(fplTeamId);
      if (!isValid) {
        throw new Error("Invalid FPL Team ID");
      }

      // Store in database
      await this.updateUserFplId(userId, fplTeamId);
      
      // Queue for immediate assessment
      await this.queueAssessment(userId, fplTeamId, subscriptionTier);
      
      // Schedule weekly assessments
      await this.scheduleWeeklyAssessments(userId, fplTeamId, subscriptionTier);
      
      // console.log(`✅ FPL ID ${fplTeamId} collected and queued for assessment`);
      return { success: true, message: "FPL ID collected successfully" };
      
    } catch (error) {
      // console.error(`❌ Failed to collect FPL ID ${fplTeamId}:`, error);
      throw error;
    }
  }

  // 2. FPL ID validation
  private async validateFplId(teamId: string): Promise<boolean> {
    try {
      const response = await fetch(`https://fantasy.premierleague.com/api/entry/${teamId}/`);
      return response.ok;
    } catch (error) {
      // console.error(`Failed to validate FPL ID ${teamId}:`, error);
      return false;
    }
  }

  // 3. Update user FPL ID in database
  private async updateUserFplId(userId: number, fplTeamId: string) {
    const { supabaseService } = await import('./supabase');
    
    await supabaseService.client
      .from('users')
      .update({ 
        fpl_team_id: fplTeamId,
        updated_at: new Date().toISOString()
      })
      .eq('id', userId);
  }

  // 4. Queue assessment processing
  private async queueAssessment(userId: number, fplTeamId: string, subscriptionTier: string) {
    const { supabaseService } = await import('./supabase');
    
    await supabaseService.client
      .from('assessment_queue')
      .insert({
        user_id: userId,
        fpl_team_id: fplTeamId,
        subscription_tier: subscriptionTier,
        status: 'pending',
        scheduled_for: new Date().toISOString()
      });
  }

  // 5. Schedule weekly assessments
  private async scheduleWeeklyAssessments(userId: number, fplTeamId: string, subscriptionTier: string) {
    const { supabaseService } = await import('./supabase');
    
    // Schedule for every Thursday at 9 AM (before gameweek)
    const nextThursday = this.getNextThursday();
    
    await supabaseService.client
      .from('assessment_queue')
      .insert({
        user_id: userId,
        fpl_team_id: fplTeamId,
        subscription_tier: subscriptionTier,
        status: 'scheduled',
        scheduled_for: nextThursday.toISOString()
      });
  }

  // 6. Get next Thursday date
  private getNextThursday(): Date {
    const now = new Date();
    const daysUntilThursday = (4 - now.getDay() + 7) % 7 || 7;
    const nextThursday = new Date(now);
    nextThursday.setDate(now.getDate() + daysUntilThursday);
    nextThursday.setHours(9, 0, 0, 0); // 9 AM
    return nextThursday;
  }

  // 7. Process assessment queue
  async processAssessmentQueue(): Promise<void> {
    // console.log('🔄 Processing assessment queue...');
    
    const { supabaseService } = await import('./supabase');
    
    const { data: pendingAssessments, error } = await supabaseService.client
      .from('assessment_queue')
      .select('*')
      .eq('status', 'pending')
      .lte('scheduled_for', new Date().toISOString());

    if (error) {
      // console.error('❌ Failed to fetch assessment queue:', error);
      return;
    }

    // console.log(`📊 Found ${pendingAssessments?.length || 0} pending assessments`);

    for (const assessment of pendingAssessments || []) {
      try {
        await this.generateAssessment(assessment);
        await this.markAsProcessed(assessment.id);
        // console.log(`✅ Assessment processed for user ${assessment.user_id}`);
      } catch (error) {
        // console.error(`❌ Failed to process assessment for user ${assessment.user_id}:`, error);
        await this.markAsFailed(assessment.id, error);
      }
    }
  }

  // 8. Generate team assessment
  private async generateAssessment(assessment: any): Promise<void> {
    const { user_id, fpl_team_id, subscription_tier } = assessment;
    
    // console.log(`🏆 Generating assessment for FPL team ${fpl_team_id}`);
    
    // Fetch FPL team data
    const teamData = await this.fetchFplTeamData(fpl_team_id);
    
    // Generate assessment using AI
    const assessmentData = await this.analyzeTeam(teamData, subscription_tier);
    
    // Store assessment
    await this.storeAssessment(user_id, assessmentData);
    
    // Send email notification
    await this.sendAssessmentEmail(user_id, assessmentData);
  }

  // 9. Fetch FPL team data
  private async fetchFplTeamData(teamId: string): Promise<any> {
    // console.log(`📊 Fetching FPL data for team ${teamId}`);
    
    const [teamInfoResponse, picksResponse, fixturesResponse] = await Promise.all([
      fetch(`https://fantasy.premierleague.com/api/entry/${teamId}/`),
      fetch(`https://fantasy.premierleague.com/api/entry/${teamId}/event/1/picks/`),
      fetch(`https://fantasy.premierleague.com/api/entry/${teamId}/fixtures/`)
    ]);

    if (!teamInfoResponse.ok) {
      throw new Error(`Failed to fetch team info for ${teamId}`);
    }

    const [teamInfo, picks, fixtures] = await Promise.all([
      teamInfoResponse.json(),
      picksResponse.json(),
      fixturesResponse.json()
    ]);

    return {
      teamInfo,
      picks,
      fixtures,
      fetchedAt: new Date().toISOString()
    };
  }

  // 10. AI-powered analysis
  private async analyzeTeam(teamData: any, subscriptionTier: string): Promise<AssessmentResult> {
    const currentGameweek = await this.getCurrentGameweek();
    
    const prompt = `
      Analyze this FPL team and provide Gaffer-style assessment:
      
      Team Data: ${JSON.stringify(teamData)}
      Subscription Tier: ${subscriptionTier}
      Current Gameweek: ${currentGameweek}
      
      Provide JSON response with:
      {
        "overallRating": number (1-10),
        "attackStrength": number (1-10),
        "defenseRating": number (1-10),
        "budgetEfficiency": number (1-10),
        "recommendations": ["string"],
        "captainPick": "string",
        "weakLinks": ["string"],
        "tacticalAdvice": "string",
        "gameweek": number
      }
      
      Style: Direct, no-nonsense, like a proper football manager. Be honest but constructive.
    `;

    try {
      // For now, return mock data - replace with actual AI call
      const mockAssessment: AssessmentResult = {
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
        gameweek: currentGameweek
      };

      return mockAssessment;
      
      // TODO: Replace with actual AI call
      // const aiResponse = await this.callAI(prompt);
      // return JSON.parse(aiResponse);
      
    } catch (error) {
      // console.error('❌ Failed to analyze team:', error);
      throw error;
    }
  }

  // 11. Get current gameweek
  private async getCurrentGameweek(): Promise<number> {
    // TODO: Fetch current gameweek from FPL API
    return 1; // Mock data
  }

  // 12. Store assessment in database
  private async storeAssessment(userId: number, assessmentData: AssessmentResult): Promise<void> {
    const { supabaseService } = await import('./supabase');
    
    await supabaseService.client
      .from('weekly_assessments')
      .insert({
        user_id: userId,
        gameweek: assessmentData.gameweek,
        assessment_data: assessmentData,
        created_at: new Date().toISOString()
      });
  }

  // 13. Send assessment email
  private async sendAssessmentEmail(userId: number, assessmentData: AssessmentResult): Promise<void> {
    const { emailService } = await import('./emailService');
    
    const user = await this.getUserById(userId);
    if (!user) return;

    const emailContent = this.generateAssessmentEmail(assessmentData);
    
    await emailService.sendEmail({
      to: user.email,
      subject: `🏆 The Gaffer's Weekly Team Assessment - GW${assessmentData.gameweek}`,
      html: emailContent
    });
  }

  // 14. Get user by ID
  private async getUserById(userId: number): Promise<any> {
    const { supabaseService } = await import('./supabase');
    
    const { data, error } = await supabaseService.client
      .from('users')
      .select('email, name')
      .eq('id', userId)
      .single();

    return data;
  }

  // 15. Generate assessment email content
  private generateAssessmentEmail(assessmentData: AssessmentResult): string {
    return `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: #1a472a; color: #d4af37; padding: 20px; text-align: center;">
          <h1>🏆 The Gaffer's Team Assessment</h1>
          <p>Week ${assessmentData.gameweek} Analysis</p>
        </div>
        
        <div style="background: #f8f9fa; padding: 20px;">
          <h2 style="color: #1a472a;">Your Team Rating: ${assessmentData.overallRating}/10</h2>
          
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
            <div>
              <h3>⚽ Attack: ${assessmentData.attackStrength}/10</h3>
              <h3>🛡️ Defense: ${assessmentData.defenseRating}/10</h3>
            </div>
            <div>
              <h3>💰 Budget: ${assessmentData.budgetEfficiency}/10</h3>
              <h3>📊 Overall: ${assessmentData.overallRating}/10</h3>
            </div>
          </div>
          
          <div style="background: #fff3cd; padding: 15px; margin: 20px 0; border-left: 4px solid #d4af37;">
            <h3 style="color: #856404;">🎯 Gaffer's Recommendations:</h3>
            <ul style="color: #856404;">
              ${assessmentData.recommendations.map(rec => `<li>${rec}</li>`).join('')}
            </ul>
          </div>
          
          <div style="background: #d4edda; padding: 15px; border-left: 4px solid #28a745;">
            <h3 style="color: #155724;">💡 Captain Pick:</h3>
            <p style="color: #155724;">${assessmentData.captainPick}</p>
          </div>
          
          <div style="background: #f8d7da; padding: 15px; border-left: 4px solid #dc3545;">
            <h3 style="color: #721c24;">⚠️ Weak Links:</h3>
            <ul style="color: #721c24;">
              ${assessmentData.weakLinks.map(link => `<li>${link}</li>`).join('')}
            </ul>
          </div>
        </div>
        
        <div style="background: #1a472a; color: white; padding: 20px; text-align: center;">
          <p>"Oi! Follow the Gaffer's advice and you'll win your league. No excuses."</p>
        </div>
      </div>
    `;
  }

  // 16. Mark assessment as processed
  private async markAsProcessed(queueId: number): Promise<void> {
    const { supabaseService } = await import('./supabase');
    
    await supabaseService.client
      .from('assessment_queue')
      .update({ 
        status: 'processed',
        processed_at: new Date().toISOString()
      })
      .eq('id', queueId);
  }

  // 17. Mark assessment as failed
  private async markAsFailed(queueId: number, error: any): Promise<void> {
    const { supabaseService } = await import('./supabase');
    
    await supabaseService.client
      .from('assessment_queue')
      .update({ 
        status: 'failed',
        error_message: error.message,
        processed_at: new Date().toISOString()
      })
      .eq('id', queueId);
  }
}

export default AutomatedAssessmentService;


