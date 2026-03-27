import cron from 'node-cron';
import WeeklyCaptainPicks from '../emails/WeeklyCaptainPicks';
import PriceChangeAlert from '../emails/PriceChangeAlert';
import DailyIntelligenceDigest from '../emails/DailyIntelligenceDigest';
import TransferStrategyEmail from '../emails/TransferStrategyEmail';
import PersonalizedAnalysisEmail from '../emails/PersonalizedAnalysisEmail';
import { sendEmail } from '../services/emailService';
import { personalizedAnalysisService } from '../services/personalizedAnalysisService';
import { userTeamCacheService } from '../services/userTeamCacheService';
import { strategicRefreshScheduler } from '../services/strategicRefreshScheduler';
import { apiSafetyMonitor } from '../services/apiSafetyMonitor';

// Import new consolidated email templates
import WeeklyDigestEmail from '../emails/WeeklyDigestEmail';
import PriceIntelligenceEmail from '../emails/PriceIntelligenceEmail';

// Helper functions for premium features
const getPremiumFeatures = async () => {
  return {
    differentials: [
      { name: "Bryan Mbeumo", team: "Brentford", ownership: 4.2, form: "4.8", reasoning: "Excellent form, low ownership" },
      { name: "João Pedro", team: "Brighton", ownership: 2.8, form: "5.2", reasoning: "Emerging talent" }
    ],
    injuryIntelligence: [
      { playerName: "Marcus Rashford", team: "Man Utd", status: "Doubtful", risk: "medium", recommendation: "Consider transfer" },
      { playerName: "João Félix", team: "Chelsea", status: "Out", risk: "high", recommendation: "Transfer immediately" }
    ],
    budgetGems: [
      { name: "Pervis Estupiñán", team: "Brighton", position: "DEF", price: 4.5, form: "4.2", valueRating: 8.5 },
      { name: "Andreas Pereira", team: "Fulham", position: "MID", price: 5.0, form: "4.1", valueRating: 7.8 }
    ]
  };
};

// Mock data generators (replace with real API calls)
const generateCaptainPicks = async () => {
  // This would connect to your FPL API and algorithm
  return {
    topPick: { name: "Erling Haaland", team: "Man City", confidence: 92, reasoning: "Facing Burnley at home, has scored 8 goals in last 5 games, perfect weather conditions" },
    secondPick: { name: "Bukayo Saka", team: "Arsenal", confidence: 85, reasoning: "In brilliant form, favorable fixture, takes penalties, high ownership" },
    thirdPick: { name: "Mohamed Salah", team: "Liverpool", confidence: 78, reasoning: "Consistent performer, good fixture, involved in everything Liverpool do" }
  };
};

const generatePricePredictions = async () => {
  // This would analyze transfer patterns and predict changes
  return {
    risers: [
      { name: "Ollie Watkins", team: "Aston Villa", probability: 85 },
      { name: "Jarrod Bowen", team: "West Ham", probability: 72 }
    ],
    fallers: [
      { name: "Marcus Rashford", team: "Man Utd", probability: 68 },
      { name: "João Félix", team: "Chelsea", probability: 45 }
    ]
  };
};

const getCurrentPriceData = async () => {
  // This would fetch real-time price data from FPL API
  return {
    risers: [
      { name: "Ollie Watkins", team: "Aston Villa", currentPrice: 7.5, netTransfers: 125000, probability: 85 },
      { name: "Jarrod Bowen", team: "West Ham", currentPrice: 6.8, netTransfers: 89000, probability: 72 }
    ],
    fallers: [
      { name: "Marcus Rashford", team: "Man Utd", currentPrice: 7.2, netTransfers: -45000, probability: 68 },
      { name: "João Félix", team: "Chelsea", currentPrice: 8.1, netTransfers: -32000, probability: 45 }
    ],
    predictedChanges: [
      { name: "Ollie Watkins", team: "Aston Villa", direction: "rise" as const, probability: 85, reason: "Net transfers: +125k (threshold: 200k), velocity: +45k in last 6 hours" },
      { name: "Marcus Rashford", team: "Man Utd", direction: "fall" as const, probability: 68, reason: "Net transfers: -45k, poor form, difficult upcoming fixtures" }
    ],
    countdownHours: 6
  };
};

// User management (replace with real database calls)
const getUsersByTier = async (tier: 'free' | 'paid' | 'season') => {
  // This would query your database for users in each tier
  const mockUsers = [
    { email: 'user1@example.com', name: 'Alex', tier: 'free', fplId: '12345678' },
    { email: 'user2@example.com', name: 'Sarah', tier: 'paid', fplId: '87654321' },
    { email: 'user3@example.com', name: 'Mike', tier: 'season', fplId: '11223344' }
  ];
  
  return mockUsers.filter(user => user.tier === tier);
};

// Email scheduling functions
const sendFreeCaptainPicks = async () => {
  // console.log('📧 Sending FREE captain picks (Saturday 9 AM)...');
  
  try {
    const freeUsers = await getUsersByTier('free');
    const captainPicks = await generateCaptainPicks();
    const gameweek = 16; // This would come from your API
    
    for (const user of freeUsers) {
      await sendEmail({
        to: user.email,
        subject: `👑 GW${gameweek} Captain Picks - premierleaguetables.com`,
        component: WeeklyCaptainPicks({
          name: user.name,
          email: user.email,
          tier: 'free',
          gameweek,
          captainPicks
        })
      });
    }
    
    // console.log(`✅ Sent captain picks to ${freeUsers.length} free users`);
  } catch (error) {
    // console.error('❌ Error sending free captain picks:', error);
  }
};

const sendPaidCaptainPicks = async () => {
  // console.log('🚨 Sending PAID captain picks (Friday 6 PM)...');
  
  try {
    const paidUsers = await getUsersByTier('paid');
    const seasonUsers = await getUsersByTier('season');
    const captainPicks = await generateCaptainPicks();
    const pricePredictions = await generatePricePredictions();
    const gameweek = 16;
    
    const allPaidUsers = [...paidUsers, ...seasonUsers];
    
    for (const user of allPaidUsers) {
      await sendEmail({
        to: user.email,
        subject: `🚨 EARLY GW${gameweek} Captain Picks - 24h Advantage!`,
        component: WeeklyCaptainPicks({
          name: user.name,
          email: user.email,
          tier: user.tier === 'season' ? 'season' : 'paid',
          gameweek,
          captainPicks,
          pricePredictions
        })
      });
    }
    
    // console.log(`✅ Sent early captain picks to ${allPaidUsers.length} paid users`);
  } catch (error) {
    // console.error('❌ Error sending paid captain picks:', error);
  }
};

const sendPriceChangeAlerts = async () => {
  // console.log('📈 Sending price change alerts...');
  
  try {
    const paidUsers = await getUsersByTier('paid');
    const seasonUsers = await getUsersByTier('season');
    const priceData = await getCurrentPriceData();
    
    const allPaidUsers = [...paidUsers, ...seasonUsers];
    
    for (const user of allPaidUsers) {
      await sendEmail({
        to: user.email,
        subject: `📈 Price Change Intelligence - ${priceData.countdownHours}h until changes`,
        component: PriceChangeAlert({
          name: user.name,
          email: user.email,
          tier: user.tier === 'season' ? 'season' : 'paid',
          priceData
        })
      });
    }
    
    // console.log(`✅ Sent price alerts to ${allPaidUsers.length} paid users`);
  } catch (error) {
    // console.error('❌ Error sending price alerts:', error);
  }
};

// Daily Intelligence Digest - Combined price + injury alerts (Paid only)
const sendDailyIntelligenceDigest = async () => {
  // console.log('📊 Sending Daily Intelligence Digest (Paid only)...');
  
  try {
    const paidUsers = await getUsersByTier('paid');
    const seasonUsers = await getUsersByTier('season');
    const priceData = await getCurrentPriceData();
    const injuryData = await getInjuryData();
    const marketInsights = await getMarketInsights();
    
    const allPaidUsers = [...paidUsers, ...seasonUsers];
    
    for (const user of allPaidUsers) {
      await sendEmail({
        to: user.email,
        subject: `📈 Daily Intelligence Digest - ${new Date().toLocaleDateString('en-GB')}`,
        component: DailyIntelligenceDigest({
          name: user.name,
          tier: user.tier === 'season' ? 'season' : 'paid',
          date: new Date().toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' }),
          priceData,
          injuryData,
          marketInsights: user.tier === 'season' ? marketInsights : undefined,
          gafferTip: await getDailyGafferTip()
        })
      });
    }
    
    // console.log(`✅ Sent Daily Intelligence Digest to ${allPaidUsers.length} paid users`);
  } catch (error) {
    // console.error('❌ Error sending Daily Intelligence Digest:', error);
  }
};

// Transfer Strategy - Monday morning (Paid only)
const sendTransferStrategy = async () => {
  // console.log('🎯 Sending Transfer Strategy (Paid only)...');
  
  try {
    const paidUsers = await getUsersByTier('paid');
    const seasonUsers = await getUsersByTier('season');
    const transferSuggestions = await getTransferSuggestions();
    const fixtureAnalysis = await getFixtureAnalysis();
    
    const allPaidUsers = [...paidUsers, ...seasonUsers];
    
    for (const user of allPaidUsers) {
      await sendEmail({
        to: user.email,
        subject: `🎯 GW${transferSuggestions.gameweek} Transfer Strategy - Beat Your Rivals!`,
        component: TransferStrategyEmail({
          name: user.name,
          tier: user.tier === 'season' ? 'season' : 'paid',
          gameweek: transferSuggestions.gameweek,
          transferSuggestions: transferSuggestions.suggestions,
          fixtureAnalysis: user.tier === 'season' ? fixtureAnalysis : undefined
        })
      });
    }
    
    // console.log(`✅ Sent Transfer Strategy to ${allPaidUsers.length} paid users`);
  } catch (error) {
    // console.error('❌ Error sending Transfer Strategy:', error);
  }
};

// Mock data generators for new functions
const getInjuryData = async () => {
  return [
    { playerName: "Kevin De Bruyne", team: "Man City", injury: "Hamstring strain", severity: "moderate" as const, expectedReturn: "2-3 weeks", ownership: 28 },
    { playerName: "Marcus Rashford", team: "Man Utd", injury: "Ankle knock", severity: "minor" as const, expectedReturn: "1 week", ownership: 15 },
    { playerName: "Tomas Soucek", team: "West Ham", injury: "Knee injury", severity: "major" as const, expectedReturn: "6-8 weeks", ownership: 8 }
  ];
};

const getMarketInsights = async () => {
  return {
    topTransfers: [
      { name: "Ollie Watkins", team: "Aston Villa", transfers: 125000, direction: "in" as const },
      { name: "Marcus Rashford", team: "Man Utd", transfers: -45000, direction: "out" as const }
    ],
    ownershipTrends: [
      { name: "Bukayo Saka", team: "Arsenal", change: 2.3, ownership: 42 },
      { name: "Erling Haaland", team: "Man City", change: -1.2, ownership: 68 }
    ]
  };
};

const getTransferSuggestions = async () => {
  return {
    gameweek: 16,
    suggestions: [
      {
        playerOut: { name: "Marcus Rashford", team: "Man Utd", price: 7.2, reason: "Poor form, difficult fixtures, injury concerns" },
        playerIn: { name: "Ollie Watkins", team: "Aston Villa", price: 7.5, reason: "Excellent form, favorable fixtures, price rising" },
        priority: "high" as const
      }
    ]
  };
};

const getFixtureAnalysis = async () => {
  return {
    easyFixtures: [
      { team: "Burnley", difficulty: 2 },
      { team: "Sheffield Utd", difficulty: 1 }
    ],
    hardFixtures: [
      { team: "Man City", difficulty: 5 },
      { team: "Liverpool", difficulty: 4 }
    ]
  };
};

const getDailyGafferTip = async () => {
  const tips = [
    "Today's market is all about timing. The smart managers are buying risers now, not after the price changes. Don't follow the herd - lead it!",
    "Don't panic about injuries! The best managers see opportunities where others see problems. That injured player might be a great transfer target for his return.",
    "Price changes happen at 1:30 AM GMT. Set your alarms if you're serious about gaining an edge on your rivals!",
    "Look at the fixtures, not just the player names. A mediocre player with easy fixtures is better than a star player with tough ones."
  ];
  return tips[Math.floor(Math.random() * tips.length)];
};

// Personalized Team Analysis - Wednesday 6 PM (Paid only)
// ULTRA-SAFE: Uses ONLY cached data - ZERO API calls during email sending
const sendPersonalizedAnalysis = async () => {
  // console.log('🎯 Sending Personalized Team Analysis (Wednesday 6 PM - Paid only)...');
  // console.log('🛡️ SAFE MODE: Using cached data only - NO API calls');
  
  try {
    const paidUsers = await getUsersByTier('paid');
    const seasonUsers = await getUsersByTier('season');
    const allPaidUsers = [...paidUsers, ...seasonUsers];
    
    const currentGameweek = 16; // This would come from FPL API
    
    let successCount = 0;
    let skippedCount = 0;
    let cacheHits = 0;
    let cacheMisses = 0;
    
    // console.log(`📊 Total paid users: ${allPaidUsers.length}`);
    
    for (const user of allPaidUsers) {
      // Only send to users who have provided their FPL ID
      if (!user.fplId) {
        // console.log(`⏭️ Skipping ${user.name} - No FPL ID provided`);
        skippedCount++;
        continue;
      }
      
      try {
        // Get cached team data - NO API CALL
        const cachedTeam = await userTeamCacheService.getUserTeam(user.fplId, currentGameweek);
        
        if (!cachedTeam) {
          // console.log(`⚠️ No cached data for ${user.name} - skipping (will refresh in background)`);
          cacheMisses++;
          skippedCount++;
          continue;
        }
        
        cacheHits++;
        
        // Generate analysis using cached data - NO API CALL
        const analysis = await personalizedAnalysisService.analyzeUserTeam(user.fplId);
        
        await sendEmail({
          to: user.email,
          subject: `🎯 Your FPL Team Analysis - GW${currentGameweek} | ${user.name}`,
          component: PersonalizedAnalysisEmail({
            name: user.name,
            tier: user.tier === 'season' ? 'seasonPass' : 'firstTeam',
            gameweek: currentGameweek,
            analysis
          })
        });
        
        successCount++;
        // console.log(`✅ Sent personalized analysis to ${user.name} (cached data)`);
      } catch (error) {
        // console.error(`❌ Error analyzing team for ${user.name}:`, error);
      }
    }
    
    // console.log(`✅ Personalized Analysis Complete:`);
    // console.log(`   📧 Sent: ${successCount}`);
    // console.log(`   ⏭️ Skipped: ${skippedCount} (${cacheMisses} no cache, ${skippedCount - cacheMisses} no FPL ID)`);
    // console.log(`   💾 Cache hits: ${cacheHits}`);
    // console.log(`   🛡️ API calls made: 0 (100% cached)`);
  } catch (error) {
    // console.error('❌ Error sending Personalized Analysis:', error);
  }
};

// Smart Consolidation - Weekly Digest Email
const sendWeeklyDigest = async () => {
  // console.log('📊 Sending Weekly Digest (Saturday 9 AM - Paid users)...');
  
  try {
    const paidUsers = await getUsersByTier('paid');
    const seasonUsers = await getUsersByTier('season');
    const captainPicks = await generateCaptainPicks();
    const transferStrategy = await getTransferSuggestions();
    const injuryData = await getInjuryData();
    const marketInsights = await getMarketInsights();
    const fixtureAnalysis = await getFixtureAnalysis();
    const premiumFeatures = await getPremiumFeatures();
    const gameweek = 16;
    
    const allPaidUsers = [...paidUsers, ...seasonUsers];
    
    for (const user of allPaidUsers) {
      // Send consolidated weekly digest
      await sendEmail({
        to: user.email,
        subject: `📊 Weekly Intelligence Digest - GW${gameweek} - premierleaguetables.com`,
        component: WeeklyDigestEmail({
          name: user.name,
          tier: user.tier === 'season' ? 'season' : 'paid',
          gameweek,
          captainPicks,
          transferStrategy,
          injuryData,
          marketInsights,
          fixtureAnalysis,
          premiumFeatures: user.tier === 'season' ? premiumFeatures : undefined,
          gafferTip: await getDailyGafferTip()
        })
      });
    }
    
    // console.log(`✅ Sent Weekly Digest to ${allPaidUsers.length} paid users`);
  } catch (error) {
    // console.error('❌ Error sending Weekly Digest:', error);
  }
};

// Price Intelligence Email (Friday 6 PM)
const sendPriceIntelligence = async () => {
  // console.log('📈 Sending Price Intelligence (Friday 6 PM - Paid users)...');
  
  try {
    const paidUsers = await getUsersByTier('paid');
    const seasonUsers = await getUsersByTier('season');
    const priceData = await getCurrentPriceData();
    const pricePredictions = await generatePricePredictions();
    
    const allPaidUsers = [...paidUsers, ...seasonUsers];
    
    for (const user of allPaidUsers) {
      await sendEmail({
        to: user.email,
        subject: `📈 Price Intelligence - ${priceData.countdownHours}h until changes`,
        component: PriceIntelligenceEmail({
          name: user.name,
          tier: user.tier === 'season' ? 'season' : 'paid',
          priceData,
          pricePredictions,
          marketInsights: user.tier === 'season' ? await getMarketInsights() : undefined
        })
      });
    }
    
    // console.log(`✅ Sent Price Intelligence to ${allPaidUsers.length} paid users`);
  } catch (error) {
    // console.error('❌ Error sending Price Intelligence:', error);
  }
};

// Schedule the optimized automated emails
export const initializeEmailScheduler = () => {
  // console.log('🤖 Initializing optimized email scheduler...');
  
  // PAID Elite Captain Picks - Thursday 6 PM (48 hours early)
  cron.schedule('0 18 * * 4', sendPaidCaptainPicks, {
    timezone: "Europe/London"
  });
  
  // Price Intelligence - Friday 6 PM (time-critical for price changes)
  cron.schedule('0 18 * * 5', sendPriceIntelligence, {
    timezone: "Europe/London"
  });
  
  // FREE Captain Picks - Saturday 9 AM (basic version)
  cron.schedule('0 9 * * 6', sendFreeCaptainPicks, {
    timezone: "Europe/London"
  });
  
  // Weekly Digest - Saturday 9 AM (consolidated content for paid users)
  cron.schedule('0 9 * * 6', sendWeeklyDigest, {
    timezone: "Europe/London"
  });
  
  // console.log('✅ Optimized email scheduler initialized successfully!');
  // console.log('📅 Smart Consolidation Schedule:');
  // console.log('  🕕 Thursday 6 PM: Elite Captain Picks (48h early) - Paid only');
  // console.log('  � Friday 6 PM: Price Intelligence (time-critical) - Paid only');
  // console.log('  � Saturday 9 AM: Free Captain Picks - Free users');
  // console.log('  🕘 Saturday 9 AM: Weekly Intelligence Digest - Paid users');
  // console.log('  📊 Total: 1 email/week for free, 2 emails/week for paid (60% reduction!)');
  // console.log('  🎯 Premium experience with less email fatigue!');
};

// Manual trigger functions for testing
export const manualTriggers = {
  sendFreeCaptainPicks,
  sendPaidCaptainPicks,
  sendPriceChangeAlerts,
  sendDailyIntelligenceDigest,
  sendTransferStrategy,
  sendPersonalizedAnalysis,
  sendWeeklyDigest,
  sendPriceIntelligence
};

export default initializeEmailScheduler;

// Export the new functions for manual triggers
export { sendWeeklyDigest, sendPriceIntelligence };


