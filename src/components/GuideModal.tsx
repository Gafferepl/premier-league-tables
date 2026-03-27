import React, { useState } from 'react';

interface GuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  section: 'squad-builder' | 'player-database' | 'beat-gaffer' | 'win-probability' | 'player-comparison';
}

const GuideModal: React.FC<GuideModalProps> = ({ isOpen, onClose, section }) => {
  const [activeTab, setActiveTab] = useState<'basics' | 'strategy' | 'tips'>('basics');

  if (!isOpen) return null;

  const getGuideContent = () => {
    switch (section) {
      case 'squad-builder':
        return {
          title: 'Squad Builder Guide',
          subtitle: "The Gaffer's complete guide to building a winning FPL team with AI-powered analysis",
          icon: 'fa-users',
          color: 'emerald',
          tabs: {
            basics: {
              title: 'Getting Started',
              content: [
                {
                  type: 'intro',
                  text: "Welcome to FPL, rookie. This isn't just picking your favorite players - it's about strategy, budget management, and not having a meltdown when your £9m forward gets injured in warm-up."
                },
                {
                  type: 'section',
                  title: 'Understanding Your Budget',
                  icon: 'fa-coins',
                  points: [
                    "You get £100m - sounds great until you see the prices",
                    "Premium players (£8m+): These are your Haalands, Salahs, De Bruynes",
                    "Mid-range (£5-8m): Solid starters, consistent point earners",
                    "Budget (£4-5m): The unsung heroes who make your team work",
                    "Golden rule: Always keep £0.1-0.2m free for transfers"
                  ]
                },
                {
                  type: 'section',
                  title: 'Position Rules You MUST Know',
                  icon: 'fa-chess-board',
                  points: [
                    "1 goalkeeper minimum (but you'll need 2 for rotation)",
                    "3 defenders minimum (most play 3-5)",
                    "2 midfielders minimum (most play 3-5)",
                    "1 forward minimum (most play 2-3)",
                    "Total squad: 15 players (11 starters + 4 bench)",
                    "You can only play 3 from each team max"
                  ]
                },
                {
                  type: 'section',
                  title: 'Formations Explained Simply',
                  icon: 'fa-shapes',
                  points: [
                    "3-4-3: Attack-heavy, great for teams with lots of attacking talent",
                    "4-4-2: Balanced, classic British formation",
                    "3-5-2: Midfield dominance, risky on defense",
                    "4-3-3: Most popular, good balance of attack and defense",
                    "5-3-2: Defensive approach, pray your forwards score",
                    "4-5-1: One striker setup, needs world-class midfield",
                    "Beginner tip: Start with 4-3-3 - it's the most forgiving"
                  ]
                }
              ]
            },
            strategy: {
              title: 'Building Your Team',
              content: [
                {
                  type: 'intro',
                  text: "Now for the fun part - actually picking players. This separates the top 10k from the millions who just pick their favorite team's players."
                },
                {
                  type: 'section',
                  title: 'The Star Player Method',
                  icon: 'fa-star',
                  points: [
                    "Pick 1-2 premium players you absolutely must have",
                    "Build your team around these stars",
                    "Example: Start with Haaland, then find budget defenders",
                    "Don't go premium-heavy - you'll have no money for depth",
                    "Remember: Even Haaland has bad weeks"
                  ]
                },
                {
                  type: 'section',
                  title: 'Fixture Analysis 101',
                  icon: 'fa-calendar-check',
                  points: [
                    "Look at the next 3-4 fixtures, not just this week",
                    "Teams playing at home vs bottom half = gold",
                    "Teams in Europe often rotate their players",
                    "Avoid players from teams in crisis (multiple losses)",
                    "Double gameweek players are transfer gold - plan ahead"
                  ]
                },
                {
                  type: 'section',
                  title: 'Finding Hidden Gems',
                  icon: 'fa-gem',
                  points: [
                    "Budget players from top 6 teams who start regularly",
                    "New signings who haven't been discovered yet",
                    "Players taking over set piece duties",
                    "Young players getting first-team chances",
                    "Check injury lists - returning players are often cheap"
                  ]
                },
                {
                  type: 'section',
                  title: 'Captaincy Strategy',
                  icon: 'fa-crown',
                  points: [
                    "Don't auto-captain your most expensive player",
                    "Look at fixtures: Home vs bottom half = captain material",
                    "Form over reputation: In-form players deliver",
                    "Consider differentials for triple captain weeks",
                    "Safe option: Premium players at home vs weak teams",
                    "🆕 Use AI Analysis: Get data-driven captain suggestions with probability ratings"
                  ]
                },
                {
                  type: 'section',
                  title: '🎯 Get The Gaffer\'s Analysis',
                  icon: 'fa-brain',
                  points: [
                    "Once you have 11+ players, click 'Get The Gaffer's Analysis' button",
                    "Free users get 1 analysis per month with basic insights + premium preview",
                    "Paid tiers get unlimited complete tactical reports",
                    "AI evaluates squad strength, suggests transfers, recommends captains",
                    "No personal data required - just your squad composition!",
                    "Use the analysis to identify weak spots and improvement opportunities"
                  ]
                }
              ]
            },
            tips: {
              title: 'Advanced Tactics',
              content: [
                {
                  type: 'intro',
                  text: "Ready to level up? These are the strategies that separate good managers from FPL legends. Pay attention, rookie."
                },
                {
                  type: 'section',
                  title: '🆕 The Gaffer\'s AI Analysis',
                  icon: 'fa-brain',
                  points: [
                    "Build your squad with 11+ players, then click 'Get The Gaffer's Analysis'",
                    "Free users: 1 analysis per month with preview of premium insights",
                    "First Team & Season Pass: Unlimited complete tactical reports",
                    "AI analyzes squad strength, player ratings, transfer needs, captain picks",
                    "Uses real Premier League data - no personal info required!"
                  ]
                },
                {
                  type: 'section',
                  title: 'Understanding Your Analysis Report',
                  icon: 'fa-chart-line',
                  points: [
                    "Team Overview: Formation, value, budget, overall strength rating",
                    "Player Analysis: Individual ratings and performance insights",
                    "Transfer Recommendations: Priority upgrades and budget optimization",
                    "Captain Selection: AI-powered picks with success probability",
                    "Fixture Analysis: Upcoming difficulty and planning advice",
                    "Tactical Recommendations: Formation tweaks and rotation strategies"
                  ]
                },
                {
                  type: 'section',
                  title: 'Using Analysis for Better Decisions',
                  icon: 'fa-lightbulb',
                  points: [
                    "Build multiple squads to compare different strategies",
                    "Use transfer recommendations to identify priority moves",
                    "Check captain suggestions against your own research",
                    "Plan transfers around fixture difficulty analysis",
                    "Use strength rating to identify weak areas in your squad"
                  ]
                },
                {
                  type: 'section',
                  title: 'Transfer Chip Strategy',
                  icon: 'fa-coins',
                  points: [
                    "Wildcard: Use early (GW 1-8) or late (GW 20+), never mid-season",
                    "Free Hit: Perfect for double gameweeks or blank fixtures",
                    "Bench Boost: Use when you have 7+ players playing",
                    "Triple Captain: Save for differential players with great fixtures",
                    "Pro tip: Plan your chip usage at the start of the season"
                  ]
                },
                {
                  type: 'section',
                  title: 'Bench Management',
                  icon: 'fa-chair',
                  points: [
                    "Your bench isn't decoration - it's your insurance policy",
                    "Always have a benchable goalkeeper",
                    "Budget defenders make great bench warmers",
                    "Check fixtures for bench players - don't bench someone playing",
                    "4.5m players who occasionally start = bench gold"
                  ]
                },
                {
                  type: 'section',
                  title: 'Common Beginner Mistakes',
                  icon: 'fa-exclamation-triangle',
                  points: [
                    "Chasing points: Transferring out players who just scored",
                    "Team loyalty: Picking too many players from one team",
                    "Ignoring fixtures: Not checking who teams play next",
                    "Premium overload: Spending too much on big names",
                    "Forgetting bench: Leaving 0.0m in the bank with no bench depth",
                    "Not using AI analysis: Missing valuable tactical insights"
                  ]
                },
                {
                  type: 'section',
                  title: "The Gaffer's Golden Rules",
                  icon: 'fa-trophy',
                  points: [
                    "Never panic transfer after one bad week",
                    "Always check team news 1 hour before deadline",
                    "Budget players from good teams > expensive players from bad teams",
                    "Set piece takers are worth their weight in gold",
                    "Sometimes the boring pick is the right pick",
                    "Use AI analysis to validate your tactical decisions"
                  ]
                }
              ]
            }
          }
        };
      
      case 'player-database':
        return {
          title: 'Player Database Guide',
          subtitle: "The Gaffer's complete guide to understanding player stats and finding hidden gems",
          icon: 'fa-database',
          color: 'blue',
          tabs: {
            basics: {
              title: 'Understanding Stats',
              content: [
                {
                  type: 'intro',
                  text: "Numbers don't lie, but they can be confusing. Let me translate these stats into plain English so you can actually use them to beat your mates."
                },
                {
                  type: 'section',
                  title: 'The Only Stats That Really Matter',
                  icon: 'fa-chart-bar',
                  points: [
                    "Total Points: The single most important stat - points scored so far",
                    "Price: What they cost now - £0.1m = roughly 1 point of value",
                    "Ownership: % of managers who own them - high = safe, low = differential",
                    "Form: Last 6 games average - red = hot, blue = cold (don't panic!)",
                    "Minutes: How much they're actually playing - below 60 = rotation risk"
                  ]
                },
                {
                  type: 'section',
                  title: 'Advanced Stats Made Simple',
                  icon: 'fa-chart-line',
                  points: [
                    "xG (Expected Goals): How many goals they should have scored",
                    "xA (Expected Assists): How many assists they should have",
                    "xGI (xG + xA): Overall attacking contribution",
                    "ICT Index: Influence + Creativity + Threat - higher = more involved",
                    "BPS (Bonus Points): Max 3 extra points per match for key actions"
                  ]
                },
                {
                  type: 'section',
                  title: 'Position-Specific Stats',
                  icon: 'fa-chess',
                  points: [
                    "Goalkeepers: Clean sheets, saves, bonus points for saves",
                    "Defenders: Clean sheets, goals, assists, bonus for tackles/blocks",
                    "Midfielders: Goals, assists, creativity, bonus for key passes",
                    "Forwards: Goals, assists, shots, bonus for chances created"
                  ]
                }
              ]
            },
            strategy: {
              title: 'Finding Value Players',
              content: [
                {
                  type: 'intro',
                  text: "Now you understand the stats. Let's use them to find players who will win you your mini-league and bragging rights."
                },
                {
                  type: 'section',
                  title: 'The Value Equation',
                  icon: 'fa-calculator',
                  points: [
                    "Good value: High points, low price, good fixtures ahead",
                    "Bad value: High price, low points, difficult fixtures",
                    "Form vs Price: In-form cheap players > out-of-form expensive",
                    "xG vs Goals: High xG, low goals = due a haul soon",
                    "Minutes played: Below 60% = rotation risk, avoid unless cheap"
                  ]
                },
                {
                  type: 'section',
                  title: 'Reading Transfer Trends',
                  icon: 'fa-exchange-alt',
                  points: [
                    "Transfers IN: People buying - price will rise, usually good news",
                    "Transfers OUT: People selling - price will fall, injury/rotation fears",
                    "Big spikes: Usually injury returns or new role announcement",
                    "Gradual rises: Good form, people catching on",
                    "Sudden drops: Bad injury news or dropped to bench"
                  ]
                },
                {
                  type: 'section',
                  title: 'Set Piece Goldmines',
                  icon: 'fa-flag',
                  points: [
                    "Penalty takers: Automatic premium - consistent points",
                    "Free kick specialists: Goal threat from dead balls",
                    "Corner takers: Assist potential, especially for defenders",
                    "Check team news: Roles change when players get injured",
                    "New managers often change set piece takers"
                  ]
                },
                {
                  type: 'section',
                  title: 'Fixture Analysis',
                  icon: 'fa-calendar-alt',
                  points: [
                    "Next 3-4 fixtures matter more than current form",
                    "Home vs bottom half teams = captain material",
                    "Away vs top 6 teams = avoid unless essential",
                    "Teams in Europe often rotate - check midweek fixtures",
                    "Blank gameweeks: Plan transfers around these"
                  ]
                }
              ]
            },
            tips: {
              title: 'Pro Scouting Techniques',
              content: [
                {
                  type: 'intro',
                  text: "Ready to become a proper scout? These are the techniques that separate the top 1,000 managers from the millions chasing points."
                },
                {
                  type: 'section',
                  title: 'Differential Hunting Ground',
                  icon: 'fa-search',
                  points: [
                    "Look for players <5% ownership with good underlying stats",
                    "New signings from promoted teams often overlooked",
                    "Players returning from long injuries - cheap with potential",
                    "Young players getting first-team chances after injuries",
                    "Tactical changes creating new opportunities (position changes)"
                  ]
                },
                {
                  type: 'section',
                  title: 'Budget Player Gold',
                  icon: 'fa-coins',
                  points: [
                    "£4.5m starters: The holy grail - must play every week",
                    "Budget players from top 6 teams: Rotation risk but high ceiling",
                    "Dual-eligible players: Flexibility is valuable for transfers",
                    "Set piece takers under £5.0m: Pure gold if they start",
                    "Newly-promoted team regulars: Often overlooked but consistent"
                  ]
                },
                {
                  type: 'section',
                  title: 'Advanced Scouting Methods',
                  icon: 'fa-microscope',
                  points: [
                    "xG vs actual goals: High xG, low goals = due regression",
                    "Minutes trends: Increasing minutes = getting in manager's plans",
                    "Shot locations: Shots from inside box = more likely to score",
                    "Chance creation: Creating chances but not scoring = due assists",
                    "Team stats: Dominant teams create more chances for players"
                  ]
                },
                {
                  type: 'section',
                  title: "The Gaffer's Watchlist Signals",
                  icon: 'fa-eye',
                  points: [
                    "High xGI but low ownership: Hidden gem about to explode",
                    "Sudden ownership increase: Smart money moving in",
                    "Minutes increasing after injury: Returning to form",
                    "Position changes: New role = new point opportunities",
                    "Tactical system changes: Some players benefit enormously"
                  ]
                }
              ]
            }
          }
        };

      case 'player-comparison':
        return {
          title: 'Player Comparison Guide',
          subtitle: "The Gaffer's complete guide to head-to-head player analysis",
          icon: 'fa-balance-scale',
          color: 'blue',
          tabs: {
            basics: {
              title: 'Basics',
              content: [
                {
                  type: 'intro',
                  text: "Player Comparison isn't just about looking at two players side by side. It's about finding tactical advantages, spotting value, and making transfers that actually win you your mini-league."
                },
                {
                  type: 'section',
                  title: 'How to Use This Tool',
                  icon: 'fa-play',
                  points: [
                    "Select Player 1 and Player 2 from the dropdown menus",
                    "Use filters to narrow down by position, team, or price range",
                    "Compare across Basic, Advanced, and Value views",
                    "Look for the badges: HOT (in form), DIFF (differential pick)",
                    "Save comparisons to track your research over time"
                  ]
                },
                {
                  type: 'section',
                  title: 'What to Look For First',
                  icon: 'fa-search',
                  points: [
                    "Total Points: The ultimate measure of FPL success",
                    "Price: Are you getting value for money?",
                    "Form: Last 6 games - is someone heating up?",
                    "Ownership: High ownership = safe, low = differential opportunity",
                    "Minutes: Are they actually playing regularly?"
                  ]
                },
                {
                  type: 'section',
                  title: 'Quick Comparison Tips',
                  icon: 'fa-lightbulb',
                  points: [
                    "Same price, more points = obvious upgrade",
                    "Cheaper player with similar stats = value pick",
                    "Higher ownership but underperforming = sell signal",
                    "Low ownership but great stats = potential differential"
                  ]
                }
              ]
            },
            strategy: {
              title: 'Strategy',
              content: [
                {
                  type: 'intro',
                  text: "Now you know the basics. Let's talk strategy - how to use comparisons to actually win your mini-league and dominate your mates."
                },
                {
                  type: 'section',
                  title: 'Transfer Window Strategy',
                  icon: 'fa-exchange-alt',
                  points: [
                    "Compare your underperforming players with similar-priced alternatives",
                    "Look for players with better fixtures coming up",
                    "Check if high-ownership players are worth the premium",
                    "Find differentials before they become popular transfers",
                    "Use comparisons to justify wildcard moves to your league"
                  ]
                },
                {
                  type: 'section',
                  title: 'Captaincy Analysis',
                  icon: 'fa-crown',
                  points: [
                    "Compare captain candidates side-by-side",
                    "Look at recent form vs upcoming fixtures",
                    "Check xG and shot data for better predictors",
                    "Consider home/away splits and team form",
                    "Don't just pick the obvious - use data to find edge"
                  ]
                },
                {
                  type: 'section',
                  title: 'Budget Management',
                  icon: 'fa-piggy-bank',
                  points: [
                    "Compare expensive players with cheaper alternatives",
                    "Find £4.5m players who actually play and score points",
                    "Use comparisons to identify overpriced assets to sell",
                    "Look for players who offer similar output for less money",
                    "Build a balanced team using comparison data"
                  ]
                }
              ]
            },
            tips: {
              title: 'Pro Tips',
              content: [
                {
                  type: 'intro',
                  text: "These are the advanced techniques that separate the top managers from the also-rans. Use these to get the edge on your mini-league rivals."
                },
                {
                  type: 'section',
                  title: 'Advanced Comparison Techniques',
                  icon: 'fa-brain',
                  points: [
                    "Compare players across different positions for flexibility",
                    "Look at xG per 90 minutes for efficiency metrics",
                    "Check bonus points potential (BPS data)",
                    "Analyze home vs away performance splits",
                    "Compare set piece involvement for hidden value"
                  ]
                },
                {
                  type: 'section',
                  title: 'Reading Between the Stats',
                  icon: 'fa-eye',
                  points: [
                    "High xG but low goals = due for positive regression",
                    "Great stats but low ownership = hidden gem alert",
                    "Poor form but good fixtures = buy low opportunity",
                    "High ownership but declining minutes = sell signal",
                    "New team or position = potential breakout candidate"
                  ]
                },
                {
                  type: 'section',
                  title: "The Gaffer's Golden Rules",
                  icon: 'fa-trophy',
                  points: [
                    "Never compare apples to oranges (different positions)",
                    "Always consider upcoming fixtures in your analysis",
                    "Form is temporary, class is permanent - but form matters",
                    "Price isn't everything, but value is everything",
                    "Trust the data, but use your football knowledge too"
                  ]
                }
              ]
            }
          }
        };

      default:
        return {
          title: 'Guide',
          subtitle: 'Coming soon...',
          icon: 'fa-book',
          color: 'purple',
          tabs: {
            basics: { title: 'Basics', content: [] },
            strategy: { title: 'Strategy', content: [] },
            tips: { title: 'Tips', content: [] }
          }
        };
    }
  };

  const guideContent = getGuideContent();
  
  const colorClasses = {
    emerald: 'from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20',
    blue: 'from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20',
    purple: 'from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20'
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-hidden border border-slate-200/50 dark:border-slate-700/50">
        
        {/* Header */}
        <div className={`bg-gradient-to-r ${colorClasses[guideContent.color as keyof typeof colorClasses]} p-6 border-b border-slate-200/50 dark:border-slate-700/50`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`w-12 h-12 bg-gradient-to-br from-${guideContent.color}-500 to-${guideContent.color}-600 rounded-xl flex items-center justify-center shadow-lg shadow-${guideContent.color}-500/20`}>
                <i className={`fas ${guideContent.icon} text-white text-xl`}></i>
              </div>
              <div>
                <h2 className="text-xl font-black text-slate-900 dark:text-white">
                  {guideContent.title}
                </h2>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  {guideContent.subtitle}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
            >
              <i className="fas fa-times text-slate-500 dark:text-slate-400"></i>
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-slate-200/50 dark:border-slate-700/50">
          {Object.entries(guideContent.tabs).map(([key, tab]) => (
            <button
              key={key}
              onClick={() => setActiveTab(key as 'basics' | 'strategy' | 'tips')}
              className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
                activeTab === key
                  ? `text-${guideContent.color}-600 dark:text-${guideContent.color}-400 border-b-2 border-${guideContent.color}-500`
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'
              }`}
            >
              {tab.title}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[60vh]">
          {guideContent.tabs[activeTab].content.map((item, idx) => (
            <div key={idx} className="mb-6 last:mb-0">
              {item.type === 'intro' && (
                <div className={`bg-${guideContent.color}-50 dark:bg-${guideContent.color}-900/20 rounded-xl p-4 border border-${guideContent.color}-200/50 dark:border-${guideContent.color}-800/50`}>
                  <p className="text-sm text-slate-700 dark:text-slate-300 italic">
                    "{item.text}"
                  </p>
                </div>
              )}
              
              {item.type === 'section' && (
                <div className="bg-slate-50 dark:bg-slate-700/30 rounded-xl p-4">
                  <h4 className="font-bold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
                    <i className={`fas ${item.icon} text-${guideContent.color}-500`}></i>
                    {item.title}
                  </h4>
                  <ul className="space-y-2">
                    {item.points.map((point, pointIdx) => (
                      <li key={pointIdx} className="text-sm text-slate-600 dark:text-slate-400 flex items-start gap-2">
                        <span className={`text-${guideContent.color}-500 mt-0.5`}>•</span>
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="bg-slate-50 dark:bg-slate-700/30 p-4 border-t border-slate-200/50 dark:border-slate-700/50">
          <div className="flex items-center justify-between">
            <div className="text-xs text-slate-500 dark:text-slate-400">
              <i className="fas fa-info-circle mr-1"></i>
              More guides coming soon!
            </div>
            <button
              onClick={onClose}
              className={`px-4 py-2 bg-${guideContent.color}-500 hover:bg-${guideContent.color}-600 text-white text-sm font-medium rounded-lg transition-colors`}
            >
              Got it, thanks!
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GuideModal;


