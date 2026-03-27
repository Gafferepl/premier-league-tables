// Automated Assessment Scheduler Service
import AutomatedAssessmentService from './automatedAssessmentService';

class SchedulerService {
  private static instance: SchedulerService;
  private assessmentService: AutomatedAssessmentService;
  private queueProcessorInterval: NodeJS.Timeout | null = null;

  static getInstance(): SchedulerService {
    if (!SchedulerService.instance) {
      SchedulerService.instance = new SchedulerService();
    }
    return SchedulerService.instance;
  }

  constructor() {
    this.assessmentService = AutomatedAssessmentService.getInstance();
  }

  // 1. Initialize all scheduled tasks
  async initialize(): Promise<void> {
    // console.log('🕐 Initializing assessment scheduler...');
    
    // Start queue processor
    this.startQueueProcessor();
    
    // Schedule weekly assessments
    this.scheduleWeeklyAssessments();
    
    // console.log('✅ Assessment scheduler initialized');
  }

  // 2. Start queue processor (runs every 5 minutes)
  private startQueueProcessor(): void {
    // console.log('🔄 Starting queue processor (5-minute intervals)');
    
    this.queueProcessorInterval = setInterval(async () => {
      try {
        await this.assessmentService.processAssessmentQueue();
      } catch (error) {
        // console.error('❌ Queue processor error:', error);
      }
    }, 5 * 60 * 1000); // 5 minutes
  }

  // 3. Schedule weekly assessments (every Thursday at 9 AM)
  private scheduleWeeklyAssessments(): void {
    // console.log('📅 Scheduling weekly assessments (Thursdays at 9 AM)');
    
    // Calculate time until next Thursday 9 AM
    const now = new Date();
    const nextThursday = this.getNextThursday();
    const timeUntilThursday = nextThursday.getTime() - now.getTime();
    
    // Schedule the first run
    setTimeout(() => {
      this.queueAllWeeklyAssessments();
      
      // Then schedule recurring weekly runs
      setInterval(() => {
        this.queueAllWeeklyAssessments();
      }, 7 * 24 * 60 * 60 * 1000); // Every 7 days
    }, timeUntilThursday);
    
    // console.log(`📅 First weekly assessment scheduled for: ${nextThursday.toISOString()}`);
  }

  // 4. Queue all weekly assessments for premium users
  private async queueAllWeeklyAssessments(): Promise<void> {
    // console.log('📊 Queuing weekly assessments for all premium users...');
    
    try {
      const premiumUsers = await this.getPremiumUsers();
      // console.log(`👥 Found ${premiumUsers.length} premium users`);
      
      for (const user of premiumUsers) {
        if (user.fpl_team_id) {
          await this.assessmentService.collectFplId(
            user.id,
            user.fpl_team_id,
            user.subscription_tier
          );
        }
      }
      
      // console.log('✅ Weekly assessments queued successfully');
    } catch (error) {
      // console.error('❌ Failed to queue weekly assessments:', error);
    }
  }

  // 5. Get all premium users with FPL team IDs
  private async getPremiumUsers(): Promise<any[]> {
    const { supabase } = await import('@supabase/supabase-js');
    
    const { data, error } = await supabase
      .from('users')
      .select('id, email, fpl_team_id, subscription_tier')
      .in('subscription_tier', ['firstTeam', 'seasonPass'])
      .not('fpl_team_id', 'is', null);

    if (error) {
      // console.error('❌ Failed to fetch premium users:', error);
      return [];
    }

    return data || [];
  }

  // 6. Get next Thursday at 9 AM
  private getNextThursday(): Date {
    const now = new Date();
    const dayOfWeek = now.getDay(); // 0 = Sunday, 4 = Thursday
    
    let daysUntilThursday = 4 - dayOfWeek;
    if (daysUntilThursday <= 0) {
      daysUntilThursday += 7; // Next week's Thursday
    }
    
    const nextThursday = new Date(now);
    nextThursday.setDate(now.getDate() + daysUntilThursday);
    nextThursday.setHours(9, 0, 0, 0); // 9 AM
    
    return nextThursday;
  }

  // 7. Stop all scheduled tasks
  stop(): void {
    // console.log('🛑 Stopping assessment scheduler...');
    
    if (this.queueProcessorInterval) {
      clearInterval(this.queueProcessorInterval);
      this.queueProcessorInterval = null;
    }
    
    // console.log('✅ Assessment scheduler stopped');
  }

  // 8. Manual trigger for testing
  async triggerWeeklyAssessments(): Promise<void> {
    // console.log('🔄 Manually triggering weekly assessments...');
    await this.queueAllWeeklyAssessments();
  }

  // 9. Manual trigger for queue processing
  async triggerQueueProcessing(): Promise<void> {
    // console.log('🔄 Manually triggering queue processing...');
    await this.assessmentService.processAssessmentQueue();
  }
}

export default SchedulerService;


