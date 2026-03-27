// Database schema and tracking for founding members

export interface User {
  id: string;
  email: string;
  name?: string;
  tier: 'free' | 'firstTeam' | 'seasonPass';
  stripeCustomerId?: string;
  subscriptionId?: string;
  createdAt: Date;
  updatedAt: Date;
  // Founder member specific fields
  isFounderMember?: boolean;
  founderNumber?: number; // 1-150
  founderBadge?: {
    icon: 'crown' | 'king';
    title: 'Founder Member';
    grantedAt: Date;
  };
}

export interface StripeWebhookEvent {
  type: string;
  data: {
    object: {
      id: string;
      customer: string;
      customer_email?: string;
      metadata?: Record<string, string>;
      created: number;
    };
  };
}

export class FounderMemberManager {
  private static instance: FounderMemberManager;
  private readonly MAX_FOUNDERS = 150;
  private currentFounderCount = 0;

  static getInstance(): FounderMemberManager {
    if (!FounderMemberManager.instance) {
      FounderMemberManager.instance = new FounderMemberManager();
    }
    return FounderMemberManager.instance;
  }

  // Process Stripe webhook for new subscription
  async processStripeEvent(event: StripeWebhookEvent): Promise<User | null> {
    if (event.type !== 'customer.subscription.created') {
      return null;
    }

    const subscription = event.data.object;
    
    // Check if this is a season pass subscription
    const isSeasonPass = this.isSeasonPassSubscription(subscription);
    if (!isSeasonPass) {
      return null;
    }

    // Get or create user
    let user = await this.getUserByStripeCustomerId(subscription.customer);
    if (!user) {
      user = await this.createUserFromSubscription(subscription);
    }

    // Check if user can become founder member
    if (this.canBecomeFounder(user)) {
      user = await this.grantFounderStatus(user);
    }

    return user;
  }

  // Check if subscription is for season pass tier
  private isSeasonPassSubscription(subscription: any): boolean {
    // Check price ID or metadata to identify season pass
    const seasonPassPriceIds = [
      'price_1seasonpass_49.99',
      'price_season_pass_founder',
      // Add your actual Stripe price IDs here
    ];

    return seasonPassPriceIds.includes(subscription.items.data[0]?.price?.id) ||
           subscription.metadata?.tier === 'season_pass' ||
           subscription.metadata?.product === 'founding_member';
  }

  // Check if user can become founder member
  private canBecomeFounder(user: User): boolean {
    return !user.isFounderMember && 
           this.currentFounderCount < this.MAX_FOUNDERS &&
           user.tier === 'seasonPass';
  }

  // Grant founder member status
  private async grantFounderStatus(user: User): Promise<User> {
    this.currentFounderCount++;
    
    const founderNumber = this.currentFounderCount;
    
    user.isFounderMember = true;
    user.founderNumber = founderNumber;
    user.founderBadge = {
      icon: 'king', // King icon for founding members
      title: 'Founder Member',
      grantedAt: new Date()
    };
    user.updatedAt = new Date();

    // Save to database
    await this.updateUser(user);

    // Send confirmation email
    await this.sendFounderConfirmation(user);

    return user;
  }

  // Create user from Stripe subscription
  private async createUserFromSubscription(subscription: any): Promise<User> {
    const user: User = {
      id: this.generateUserId(),
      email: subscription.customer_email || '',
      stripeCustomerId: subscription.customer,
      subscriptionId: subscription.id,
      tier: 'seasonPass',
      createdAt: new Date(),
      updatedAt: new Date()
    };

    await this.saveUser(user);
    return user;
  }

  // Get user by Stripe customer ID
  private async getUserByStripeCustomerId(customerId: string): Promise<User | null> {
    // Implement your database query here
    // Example: return await db.users.findOne({ where: { stripeCustomerId: customerId } });
    return null;
  }

  // Save user to database
  private async saveUser(user: User): Promise<void> {
    // Implement your database save logic here
    // Example: await db.users.create({ data: user });
  }

  // Update user in database
  private async updateUser(user: User): Promise<void> {
    // Implement your database update logic here
    // Example: await db.users.update({ where: { id: user.id }, data: user });
  }

  // Send founder confirmation email
  private async sendFounderConfirmation(user: User): Promise<void> {
    // Implement email sending logic
    const emailContent = {
      subject: '👑 Welcome, Founding Member!',
      message: `
        Congratulations ${user.name || 'Founding Member'}!
        
        You are now member #${user.founderNumber} of only 150 founding members.
        
        Your benefits include:
        • Lifetime price lock at £49.99
        • Beta features access
        • Founder Member badge
        • Priority support
        
        Thank you for being part of our founding community!
      `
    };

    // Send email using your preferred service
    // await emailService.send(user.email, emailContent);
  }

  // Get current founder count
  async getCurrentFounderCount(): Promise<number> {
    // Query database for current count
    // return await db.users.count({ where: { isFounderMember: true } });
    return this.currentFounderCount;
  }

  // Check if founder slots are available
  async areFounderSlotsAvailable(): Promise<boolean> {
    const count = await this.getCurrentFounderCount();
    return count < this.MAX_FOUNDERS;
  }

  // Get remaining founder slots
  async getRemainingFounderSlots(): Promise<number> {
    const count = await this.getCurrentFounderCount();
    return Math.max(0, this.MAX_FOUNDERS - count);
  }

  // Generate user ID
  private generateUserId(): string {
    return `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}

// Export singleton instance
export const founderMemberManager = FounderMemberManager.getInstance();


