import React, { useState, useEffect } from 'react';
import '../styles/guides.css';

interface GuideSection {
  id: string;
  icon: string;
  title: string;
  description: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
  category: 'getting-started' | 'core-features' | 'strategy-tactics' | 'ai-tools' | 'advanced-play';
  estimatedTime: string;
  sections: {
    heading: string;
    points: string[];
    interactiveTip?: string;
    example?: string;
  }[];
  cta?: { label: string; sectionId: string };
  quiz?: {
    question: string;
    options: string[];
    correct: number;
    explanation: string;
  };
}

const COMPREHENSIVE_GUIDES: GuideSection[] = [
  // GETTING STARTED CATEGORY
  {
    id: 'absolute-beginner',
    icon: '🎓',
    title: 'FPL Absolute Beginner Guide',
    description: 'Everything you need to know to start your FPL journey',
    difficulty: 'Beginner',
    category: 'getting-started',
    estimatedTime: '10 min',
    sections: [
      {
        heading: 'What Is Fantasy Premier League?',
        points: [
          'FPL is a free game where you create a virtual squad of 15 real Premier League players',
          'You get £100 million budget to pick: 2 Goalkeepers, 5 Defenders, 5 Midfielders, 3 Forwards',
          'Each Gameweek, your selected 11 players score points based on their real-life performances',
          'Your captain scores double points - this is your most important weekly decision',
          'Points come from goals, assists, clean sheets, saves, and bonus points'
        ],
        interactiveTip: '💡 Try picking your first squad on the official FPL site to understand the interface',
        example: 'Haaland scores 2 goals = 8 points (4 per goal). As captain = 16 points!'
      },
      {
        heading: 'Understanding Deadlines & Transfers',
        points: [
          'Each Gameweek has a deadline - usually 90 minutes before first kick-off',
          'You get 1 free transfer per week. Unused transfers roll over (maximum 2)',
          'Extra transfers cost -4 points each - use these sparingly!',
          'Price changes happen daily at 1:30 AM GMT based on transfer activity',
          'Team news comes out 1-2 hours before kickoff - check this before deadline!'
        ],
        interactiveTip: '⏰ Set phone reminders for Friday 6:30 PM (typical deadline)',
        example: 'Taking 2 extra transfers (-8 points) only makes sense if your new players outscore old ones by 9+ points'
      },
      {
        heading: 'Your First Team Setup',
        points: [
          'Start with 2-3 premium players (£10m+) who\'ll be your captain options',
          'Fill remaining spots with reliable mid-price players (£6-8m) who play every week',
          'Use £4.0-4.5m players as bench warmers - they rarely play but save budget',
          'Don\'t pick multiple players from same team in same position - spread risk',
          'Check opening fixtures - easy starts are more valuable than pre-season hype'
        ],
        interactiveTip: '🏗️ Use the 3-4-3 formation initially - it\'s the most balanced for beginners',
        example: '£12m Salah + £11m Haaland + £12m De Bruyne = £35m on 3 premiums, £65m for 12 others'
      }
    ],
    cta: { label: 'Try Squad Builder', sectionId: 'squad-builder' },
    quiz: {
      question: 'Your captain scores double points. If Haaland scores 1 goal (4 pts) + 1 assist (3 pts), how many points does he score as captain?',
      options: ['7 points', '14 points', '11 points', '8 points'],
      correct: 1,
      explanation: 'Haaland scores 4 (goal) + 3 (assist) = 7 points. As captain, this doubles to 14 points!'
    }
  },
  {
    id: 'mobile-app-tutorial',
    icon: '📱',
    title: 'Mobile App Mastery',
    description: 'Manage your team like a pro on your phone',
    difficulty: 'Beginner',
    category: 'getting-started',
    estimatedTime: '5 min',
    sections: [
      {
        heading: 'Essential Mobile Features',
        points: [
          'Enable push notifications for team news and deadline reminders',
          'Use the "Make Captains" button for quick captain changes',
          'Swipe right on players to view detailed stats and upcoming fixtures',
          'The "Fixtures" tab shows your team\'s upcoming schedule difficulty',
          'Watch list helps track players you\'re considering for transfers'
        ],
        interactiveTip: '📱 Set deadline reminder for 1 hour before kickoff - gives you time for late team news',
        example: 'Get notification "Saliva doubtful vs Chelsea 2h before KO" - quick transfer time!'
      },
      {
        heading: 'On-the-Go Management',
        points: [
          'Use "Auto-subs" when you can\'t watch live - substitutes injured/benched players',
          'Check "Points" tab during matches for live scoring updates',
          'The "Transfers" tab shows price changes and predicted movements',
          'Use "Rank" tab to track your progress in mini-leagues',
          'Analytics section shows xG, xA, and advanced stats for deeper analysis'
        ],
        interactiveTip: '🔋 Always keep your phone charged during weekend football - emergency transfers needed!',
        example: 'Your starter gets injured 20min in - auto-subs bring on your bench player automatically'
      }
    ],
    cta: { label: 'Download FPL App', sectionId: 'app-download' }
  },

  // CORE FEATURES CATEGORY  
  {
    id: 'player-database-deep-dive',
    icon: '🗃️',
    title: 'Player Database Mastery',
    description: 'Unlock the full power of player data and statistics',
    difficulty: 'Intermediate',
    category: 'core-features',
    estimatedTime: '12 min',
    sections: [
      {
        heading: 'Understanding the Interface',
        points: [
          'Filter by position, price, team, or ownership to find perfect targets',
          'Sort by different metrics: form, total points, value, or xG/xA',
          'Green numbers indicate better stats - red means worse performance',
          'Click player names for detailed breakdowns and fixture history',
          'Ownership percentage shows how popular each player is - key for differentials'
        ],
        interactiveTip: '🔍 Use the "Differential" filter (under 10% owned) to find rank-climbing gems',
        example: 'Sort midfielders by xG90 - find players creating chances but not scoring yet'
      },
      {
        heading: 'Advanced Metrics Explained',
        points: [
          'xG (Expected Goals) - quality of scoring chances, not just goals scored',
          'xA (Expected Assists) - quality of chance creation for teammates',
          'ICT Index - Influence + Creativity + Threat = overall impact score',
          'Points Per Million - value for money calculation (higher is better)',
          'Form Score - last 6 gameweeks performance (8.0+ is excellent)',
          'BPS (Bonus Points System) - determines who gets 1-3 bonus points each match'
        ],
        interactiveTip: '📊 Players with high xG but low goals are due for positive regression',
        example: 'Toney: 2.4 xG, 0 goals = buy before price rise and goals start coming!'
      },
      {
        heading: 'Smart Search Strategies',
        points: [
          'Look for players with green fixtures (easy upcoming schedule)',
          'Check "Transfers In" column - rising ownership = price increase coming',
          'Combine filters: "Under 8m + Form 8.0+ + Green fixtures" = hidden gems',
          'Use "Team" filter to avoid picking too many players from same team',
          'Sort by "Value" to find the most efficient points per million spent'
        ],
        interactiveTip: '💾 Save your favorite filters for quick access each week',
        example: 'Filter: MID, £6-8m, Form 7.5+, 2+ green fixtures = perfect mid-price targets'
      }
    ],
    cta: { label: 'Explore Player Database', sectionId: 'player-database' },
    quiz: {
      question: 'A player has high xG but low actual goals. What does this usually indicate?',
      options: ['He\'s overpriced and should be sold', 'He\'s due for positive regression', 'His team is struggling', 'He\'s injured'],
      correct: 1,
      explanation: 'High xG means creating good chances but not converting. Goals usually follow xG over time - buy before price rise!'
    }
  },
  {
    id: 'comparison-tool-mastery',
    icon: '⚖️',
    title: 'Player Comparison Tool Guide',
    description: 'Make data-driven transfer decisions with head-to-head analysis',
    difficulty: 'Intermediate',
    category: 'core-features',
    estimatedTime: '8 min',
    sections: [
      {
        heading: 'How to Use the Comparison Tool',
        points: [
          'Select 2-3 players to compare side-by-side across all key metrics',
          'Green highlight shows which player has the better statistic',
          'Look beyond total points - check points per game and recent form',
          'Compare upcoming fixtures - schedule difficulty affects short-term value',
          'Check ownership percentages - template vs differential considerations'
        ],
        interactiveTip: '🎯 Always compare players across the same price range - £8m vs £4m isn\'t useful',
        example: 'Salah vs De Bruyne: Both £10m+, compare xG, fixtures, and recent form'
      },
      {
        heading: 'Reading the Results',
        points: [
          'Don\'t just count green numbers - weigh them by importance (goals > assists > clean sheets)',
          'Consider position-specific stats: xG for forwards, xA for midfielders, clean sheets for defenders',
          'Look at underlying stats vs actual returns - regression candidates',
          'Factor in team form and upcoming fixtures heavily',
          'Consider ownership - high ownership + green stats = template pick worth considering'
        ],
        interactiveTip: '📈 Create a personal scoring system based on what matters most for your team',
        example: 'Comparing two £6m mids: Player A has more goals, Player B has better fixtures - choose based on your needs'
      },
      {
        heading: 'Advanced Comparison Strategies',
        points: [
          'Compare players you own vs potential replacements - is the upgrade worth -4 points?',
          'Use comparisons to identify the best value in each price bracket',
          'Compare bench options to ensure you have optimal coverage',
          'Look at seasonal vs recent form - hot streaks vs consistent performers',
          'Use comparisons to plan wildcard squads - identify the best options for each position'
        ],
        interactiveTip: '🔄 Compare players before AND after price changes to spot value opportunities',
        example: 'Wildcard planning: Compare all £8m forwards to find the 3 best options for your team'
      }
    ],
    cta: { label: 'Try Comparison Tool', sectionId: 'player-comparison' }
  },
  {
    id: 'price-change-tracker',
    icon: '📈',
    title: 'Price Change Tracker Mastery',
    description: 'Build team value and time transfers perfectly',
    difficulty: 'Intermediate',
    category: 'core-features',
    estimatedTime: '10 min',
    sections: [
      {
        heading: 'Understanding Price Changes',
        points: [
          'Price changes happen at 1:30 AM GMT daily based on net transfer activity',
          'Players need ~200k net transfers IN to rise £0.1m in price',
          'Players need ~100k net transfers OUT to fall £0.1m in price',
          'Rising prices increase your team value - falling prices decrease it',
          'Buy before rises, sell before falls to maximize team value',
          'Price changes affect other managers - create opportunities/dangers'
        ],
        interactiveTip: '⏰ Complete transfers by 1:00 AM to beat price rises or avoid falls',
        example: 'Saka has 180k net transfers in - likely to rise tonight. Get him before 1:30 AM!'
      },
      {
        heading: 'Predicting Price Movements',
        points: [
          'Check "Net Transfers" column - positive numbers = potential rise',
          'Look at "Transfers In" trend - consistent daily growth = price rise coming',
          'High ownership players (30%+) need more transfers to change price',
          'Injuries/suspensions cause mass sell-offs - price drops follow',
          'Good performances + easy fixtures = transfer inflows = price rises'
        ],
        interactiveTip: '📊 Track players at 150k-180k net transfers - they\'re closest to rising',
        example: 'Player scores hat-trick + has easy fixtures = expect 50k+ transfers in per day'
      },
      {
        heading: 'Strategic Price Trading',
        points: [
          'Buy rising players early - maximize team value growth',
          'Sell falling players before they drop further - cut losses',
          'Use price changes to identify popular players (template picks)',
          'Consider price when making transfers - sometimes wait for fall to buy cheaper',
          'Bank transfers when market is volatile - wait for clearer opportunities',
          'Price changes create differentials - buy before mass adoption'
        ],
        interactiveTip: '💰 Team value is crucial - extra £0.5m = better player options later',
        example: 'Buy player at £5.5m, price rises to £6.0m = you gained £0.5m team value for free!'
      }
    ],
    cta: { label: 'Check Price Changes', sectionId: 'price-tracker' },
    quiz: {
      question: 'A player needs approximately how many NET transfers IN to rise by £0.1m?',
      options: ['50,000', '100,000', '200,000', '500,000'],
      correct: 2,
      explanation: 'Players need approximately 200,000 net transfers IN to rise £0.1m. Net transfers = transfers IN minus transfers OUT.'
    }
  },

  // STRATEGY & TACTICS CATEGORY
  {
    id: 'captaincy-science',
    icon: '👑',
    title: 'Captaincy Science & Strategy',
    description: 'Master the most important decision in FPL',
    difficulty: 'Advanced',
    category: 'strategy-tactics',
    estimatedTime: '15 min',
    sections: [
      {
        heading: 'Captaincy Fundamentals',
        points: [
          'Your captain scores DOUBLE points - this decision accounts for 20-25% of weekly score',
          'Vice-captain only activates if your captain doesn\'t play at all',
          '70% of the time, the obvious premium choice with good fixtures is correct',
          'Don\'t overthink it - consistency beats brilliant but risky picks',
          'Consider bookmakers\' goalscorer odds - they\'re surprisingly accurate'
        ],
        interactiveTip: '🎯 Set weekly captain reminder for Friday evening - gives time for team news',
        example: 'Haaland at home to Burnley with 85% confidence = no-brainer captain pick'
      },
      {
        heading: 'When to Go Differential',
        points: [
          'Template captain has tough away fixture, your pick has home game vs relegation side',
          'Your differential has been in excellent form (8.0+ last 3-4 games)',
          'Consider fixture difficulty - green vs red fixtures can override player quality',
          'Check recent xG and xA - underlying stats show who\'s likely to score',
          'Look at team news - confirmed starters vs injury doubts'
        ],
        interactiveTip: '📊 Use captaincy tools that show ownership percentages and fixture difficulty',
        example: 'Salah (50% owned) away to Man City vs Isak (5% owned) home to Luton - consider Isak'
      },
      {
        heading: 'Captain Rotation Strategy',
        points: [
          'Own 2-3 premium captain options whose fixtures alternate for consistency',
          'Classic rotation pairs: Haaland + Salah, Kane + De Bruyne, etc.',
          'Don\'t captain defenders or keepers unless absolutely necessary',
          'Consider Triple Captain chip for premium players in Double Gameweeks',
          'Plan captaincy around your transfers - don\'t transfer in just to captain',
          'Track your captaincy success rate - learn from mistakes and successes'
        ],
        interactiveTip: '📅 Create a fixture calendar showing your captain options\' schedules for next 6 GWs',
        example: 'Own Haaland (tough fixture) + Salah (easy fixture) - captain Salah this week, Haaland next'
      }
    ],
    cta: { label: 'View Captain Picks', sectionId: 'captain-picks' },
    quiz: {
      question: 'What percentage of your total FPL score typically comes from captaincy decisions over a season?',
      options: ['10-15%', '20-25%', '30-35%', '40-45%'],
      correct: 1,
      explanation: 'Captaincy decisions account for roughly 20-25% of your total FPL score over a season - making it the single most important weekly decision!'
    }
  },

  // AI TOOLS CATEGORY
  {
    id: 'gaffer-chat-guide',
    icon: '🤖',
    title: 'Gaffer AI Chat Bot Guide',
    description: 'Get personalized FPL advice from The Gaffer AI',
    difficulty: 'Beginner',
    category: 'ai-tools',
    estimatedTime: '8 min',
    sections: [
      {
        heading: 'Getting Started with Gaffer Chat',
        points: [
          'Access Gaffer Chat via the floating chat button in bottom-right corner',
          'Free users get 2 questions per day, First Team get 10, Season Pass get unlimited',
          'Chat history is saved - you can reference previous conversations',
          'The AI knows current FPL data, fixtures, injuries, and player stats',
          'Ask specific questions for better answers - "Should I transfer out Salah?" vs "Help me"'
        ],
        interactiveTip: '💡 Ask "Compare [Player A] vs [Player B] for my team" for personalized advice',
        example: 'User: "Should I captain Haaland or Salah this week?" Gaffer: "Based on fixtures, Haaland at home to Luton is the safer pick"'
      },
      {
        heading: 'Best Questions to Ask',
        points: [
          'Transfer advice: "Should I sell [Player] for [Player] this week?"',
          'Captaincy help: "Who should I captain from my team: [options]?"',
          'Wildcard planning: "I have wildcard, what\'s the best team for next 6 GWs?"',
          'Value analysis: "Is [Player] worth his price at [amount]m?"',
          'Differential finds: "Which under-10% owned players should I consider?"',
          'Team news: "Any injury concerns for [Team] this week?"'
        ],
        interactiveTip: '🎯 Include your team context: "I have [players], need advice for [specific situation]"',
        example: 'Good: "I have Haaland, Salah, De Bruyne. Who should captain this week?" Bad: "Help me win"'
      },
      {
        heading: 'Advanced Chat Features',
        points: [
          'Ask for fixture analysis: "Which teams have easiest run of fixtures?"',
          'Request player comparisons: "Compare xG and form for [Player A] vs [Player B]"',
          'Get chip advice: "When should I use my Bench Boost chip?"',
          'Strategy questions: "What\'s your strategy for Blank Gameweeks?"',
          'Long-term planning: "Which players should I target for next month?"',
          'Troubleshooting: "I\'m stuck in my mini-league, how can I climb ranks?"'
        ],
        interactiveTip: '📊 Ask follow-up questions to dive deeper into initial recommendations',
        example: 'Follow-up: "You recommended Player A, but what are the risks vs Player B?"'
      }
    ],
    cta: { label: 'Try Gaffer Chat', sectionId: 'gaffer-chat' }
  },

  // ADVANCED PLAY CATEGORY
  {
    id: 'blank-double-gw-exploits',
    icon: '📅',
    title: 'Blank & Double Gameweek Exploits',
    description: 'Master the most complex FPL scenarios for rank gains',
    difficulty: 'Expert',
    category: 'advanced-play',
    estimatedTime: '18 min',
    sections: [
      {
        heading: 'Understanding Blank & Double GWs',
        points: [
          'Blank Gameweeks occur when teams don\'t play due to FA Cup/rearrangements',
          'Double Gameweeks happen when teams play twice in one GW to make up for blanks',
          'BGWs hurt players who don\'t play, DGWs create huge opportunities',
          'Check FPL official fixture list months in advance for planning',
          'Some teams can have both BGW and DGW in same season - complex planning needed'
        ],
        interactiveTip: '📅 Create a fixture calendar highlighting all BGWs/DGWs for the entire season',
        example: 'Man City have BGW in GW25, DGW in GW28 - plan transfers around this'
      },
      {
        heading: 'Blank Gameweek Strategy',
        points: [
          'Identify how many of your players are blanking - 3+ = consider Free Hit chip',
          'If only 1-2 blanking, bench them and play substitutes naturally',
          'Start planning 2-3 GWs before - use free transfers to move out blanking players',
          'Don\'t panic - blank GWs affect everyone, focus on relative advantage',
          'Consider selling blanking players early if their upcoming fixtures are tough',
          'Use blank GWs to take hits on players you want to keep long-term'
        ],
        interactiveTip: '🎯 Use blank GWs to wildcard into players with good upcoming fixtures',
        example: '3 of your players blank in GW25 - use Free Hit to field full team that week'
      },
      {
        heading: 'Double Gameweek Exploitation',
        points: [
          'DGW players get two chances to score - massive point potential',
          'Bench Boost is optimal in DGWs - all 15 players could play twice',
          'Triple Captain on premium DGW player = highest ceiling play in FPL',
          'Wildcard the week BEFORE DGW to set up perfect squad',
          'Don\'t load up on DGW players with terrible fixtures - quality over quantity',
          'Plan chip usage around DGWs - they\'re the most valuable weeks'
        ],
        interactiveTip: '💰 Save your best chips for DGWs - they offer the biggest rank climb opportunities',
        example: 'Haaland DGW vs two relegation sides + Triple Captain = potential 30+ point haul'
      },
      {
        heading: 'Advanced Planning Techniques',
        points: [
          'Create "bridge" players - those who play in both blank and double weeks',
          'Consider fixture difficulty - DGW vs Man City + Arsenal worse than SGW vs Burnley',
          'Bank transfers before big DGWs to have maximum flexibility',
          'Use blank GWs to take points hits without major consequences',
          'Plan chip combinations: Wildcard + Bench Boost, or Free Hit + Triple Captain',
          'Track other managers\' strategies - differentials in DGWs can be huge rank movers'
        ],
        interactiveTip: '📊 Use spreadsheets to plan chip usage around BGWs/DGWs months in advance',
        example: 'Wildcard in GW27 for DGW28 setup, Bench Boost in GW28, Triple Captain on Haaland'
      }
    ],
    cta: { label: 'View Fixture Schedule', sectionId: 'fixtures' },
    quiz: {
      question: 'Which chip combination is most powerful in a Double Gameweek?',
      options: ['Free Hit + Triple Captain', 'Wildcard + Bench Boost', 'Bench Boost + Triple Captain', 'Wildcard alone'],
      correct: 2,
      explanation: 'Bench Boost + Triple Captain in a DGW gives you 15 players potentially playing twice, with one scoring triple points - the highest ceiling combination in FPL!'
    }
  }
];

const CATEGORY_CONFIG = {
  'getting-started': {
    icon: '🚀',
    title: 'Getting Started',
    description: 'Master the basics and get up to speed quickly',
    color: 'green',
    order: 1
  },
  'core-features': {
    icon: '⚙️',
    title: 'Core Features',
    description: 'Deep dive into the essential tools and data',
    color: 'blue',
    order: 2
  },
  'strategy-tactics': {
    icon: '🧠',
    title: 'Strategy & Tactics',
    description: 'Advanced strategies to climb the rankings',
    color: 'purple',
    order: 3
  },
  'ai-tools': {
    icon: '🤖',
    title: 'AI & Tools',
    description: 'Leverage technology and automation',
    color: 'indigo',
    order: 4
  },
  'advanced-play': {
    icon: '🏆',
    title: 'Advanced Play',
    description: 'Elite tactics for experienced managers',
    color: 'red',
    order: 5
  }
};

const DIFFICULTY_CONFIG = {
  'Beginner': { color: 'green', icon: '🎓', description: 'Perfect for newcomers' },
  'Intermediate': { color: 'yellow', icon: '⚡', description: 'Building your knowledge' },
  'Advanced': { color: 'orange', icon: '🔥', description: 'Serious strategy' },
  'Expert': { color: 'red', icon: '👑', description: 'Elite level tactics' }
};

interface ComprehensiveGuidesProps {
  isOpen: boolean;
  onClose: () => void;
}

const ComprehensiveGuides: React.FC<ComprehensiveGuidesProps> = ({ isOpen, onClose }) => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [expandedGuide, setExpandedGuide] = useState<string | null>(null);
  const [completedGuides, setCompletedGuides] = useState<Set<string>>(new Set());
  const [quizResults, setQuizResults] = useState<Record<string, number>>({});
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string | null>(null);

  // Load completed guides from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('completedGuides');
    if (saved) {
      setCompletedGuides(new Set(JSON.parse(saved)));
    }
  }, []);

  // Save completed guides to localStorage
  useEffect(() => {
    if (completedGuides.size > 0) {
      localStorage.setItem('completedGuides', JSON.stringify(Array.from(completedGuides)));
    }
  }, [completedGuides]);

  const markComplete = (guideId: string) => {
    setCompletedGuides(prev => new Set([...prev, guideId]));
  };

  const handleQuizAnswer = (guideId: string, answerIndex: number) => {
    const guide = COMPREHENSIVE_GUIDES.find(g => g.id === guideId);
    if (guide?.quiz) {
      const isCorrect = answerIndex === guide.quiz.correct;
      setQuizResults(prev => ({ ...prev, [guideId]: answerIndex }));
      if (isCorrect) {
        markComplete(guideId);
      }
    }
  };

  const filteredGuides = COMPREHENSIVE_GUIDES.filter(guide => {
    const matchesSearch = searchTerm === '' || 
      guide.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      guide.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !selectedCategory || guide.category === selectedCategory;
    const matchesDifficulty = !selectedDifficulty || guide.difficulty === selectedDifficulty;
    return matchesSearch && matchesCategory && matchesDifficulty;
  });

  const getCategoryGuides = (category: string) => {
    return filteredGuides.filter(guide => guide.category === category);
  };

  const getCompletionRate = () => {
    return Math.round((completedGuides.size / COMPREHENSIVE_GUIDES.length) * 100);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Main Container */}
      <div className="relative flex w-full h-full bg-white dark:bg-slate-900">
        {/* Sidebar Navigation */}
        <div className="w-80 bg-slate-50 dark:bg-slate-800 border-r border-slate-200 dark:border-slate-700 flex flex-col">
          {/* Header */}
          <div className="p-6 border-b border-slate-200 dark:border-slate-700">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-black text-slate-900 dark:text-white">
                📚 FPL Mastery Hub
              </h2>
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors"
              >
                <i className="fas fa-times text-sm text-slate-600 dark:text-slate-400"></i>
              </button>
            </div>
            
            {/* Progress Overview */}
            <div className="bg-gradient-to-r from-purple-500 to-indigo-500 rounded-xl p-4 text-white">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-bold">Your Progress</span>
                <span className="text-lg font-black">{getCompletionRate()}%</span>
              </div>
              <div className="w-full bg-white/20 rounded-full h-2">
                <div 
                  className="bg-white rounded-full h-2 transition-all duration-500"
                  style={{ width: `${getCompletionRate()}%` }}
                />
              </div>
              <p className="text-xs mt-2 opacity-90">
                {completedGuides.size} of {COMPREHENSIVE_GUIDES.length} guides completed
              </p>
            </div>
          </div>

          {/* Search and Filters */}
          <div className="p-4 space-y-3">
            <div className="relative">
              <i className="fas fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400"></i>
              <input
                type="text"
                placeholder="Search guides..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-sm"
              />
            </div>
            
            {/* Difficulty Filter */}
            <div className="flex flex-wrap gap-2">
              {Object.entries(DIFFICULTY_CONFIG).map(([key, config]) => (
                <button
                  key={key}
                  onClick={() => setSelectedDifficulty(selectedDifficulty === key ? null : key)}
                  className={`px-3 py-1 rounded-full text-xs font-bold transition-colors ${
                    selectedDifficulty === key
                      ? `bg-${config.color}-500 text-white`
                      : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-400'
                  }`}
                >
                  {config.icon} {key}
                </button>
              ))}
            </div>
          </div>

          {/* Category Navigation */}
          <div className="flex-1 overflow-y-auto p-4">
            <div className="space-y-2">
              {Object.entries(CATEGORY_CONFIG).map(([key, config]) => {
                const guides = getCategoryGuides(key);
                const completedInCategory = guides.filter(g => completedGuides.has(g.id)).length;
                
                return (
                  <button
                    key={key}
                    onClick={() => setSelectedCategory(selectedCategory === key ? null : key)}
                    className={`w-full p-3 rounded-xl border transition-all ${
                      selectedCategory === key
                        ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20'
                        : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{config.icon}</span>
                        <div className="text-left">
                          <h3 className="font-bold text-slate-900 dark:text-white text-sm">
                            {config.title}
                          </h3>
                          <p className="text-xs text-slate-500 dark:text-slate-400">
                            {guides.length} guides
                          </p>
                        </div>
                      </div>
                      {completedInCategory > 0 && (
                        <div className="text-xs font-bold text-purple-600 dark:text-purple-400">
                          {completedInCategory}/{guides.length}
                        </div>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col">
          {/* Content Header */}
          <div className="p-6 border-b border-slate-200 dark:border-slate-700">
            <h1 className="text-2xl font-black text-slate-900 dark:text-white mb-2">
              {selectedCategory ? CATEGORY_CONFIG[selectedCategory].title : 'All Guides'}
            </h1>
            <p className="text-slate-600 dark:text-slate-400">
              {selectedCategory ? CATEGORY_CONFIG[selectedCategory].description : 'Complete guides to master FPL'}
            </p>
          </div>

          {/* Guides List */}
          <div className="flex-1 overflow-y-auto p-6">
            <div className="space-y-4">
              {filteredGuides.map(guide => {
                const isExpanded = expandedGuide === guide.id;
                const isCompleted = completedGuides.has(guide.id);
                const categoryConfig = CATEGORY_CONFIG[guide.category];
                const difficultyConfig = DIFFICULTY_CONFIG[guide.difficulty];

                return (
                  <div
                    key={guide.id}
                    className={`border rounded-xl overflow-hidden transition-all ${
                      isCompleted 
                        ? 'border-green-200 bg-green-50 dark:bg-green-900/10 dark:border-green-800'
                        : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800'
                    }`}
                  >
                    {/* Guide Header */}
                    <button
                      onClick={() => setExpandedGuide(isExpanded ? null : guide.id)}
                      className="w-full p-4 flex items-start gap-4 text-left hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors"
                    >
                      <div className="flex-shrink-0">
                        <span className="text-3xl">{guide.icon}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <div>
                            <h3 className="font-black text-slate-900 dark:text-white text-base mb-1">
                              {guide.title}
                              {isCompleted && <i className="fas fa-check-circle text-green-500 ml-2"></i>}
                            </h3>
                            <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-2">
                              {guide.description}
                            </p>
                          </div>
                          <div className="flex flex-col items-end gap-2 flex-shrink-0">
                            <span className={`px-2 py-1 rounded-full text-xs font-bold bg-${difficultyConfig.color}-100 text-${difficultyConfig.color}-700 dark:bg-${difficultyConfig.color}-900/30 dark:text-${difficultyConfig.color}-400`}>
                              {difficultyConfig.icon} {guide.difficulty}
                            </span>
                            <span className="text-xs text-slate-500 dark:text-slate-400">
                              ⏱️ {guide.estimatedTime}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
                          <span className="flex items-center gap-1">
                            {categoryConfig.icon} {categoryConfig.title}
                          </span>
                          <span>•</span>
                          <span>{guide.sections.length} sections</span>
                          {guide.quiz && (
                            <>
                              <span>•</span>
                              <span>📝 Quiz</span>
                            </>
                          )}
                        </div>
                      </div>
                      <i className={`fas fa-chevron-down text-slate-400 transition-transform ${
                        isExpanded ? 'rotate-180' : ''
                      }`}></i>
                    </button>

                    {/* Expanded Content */}
                    {isExpanded && (
                      <div className="px-4 pb-4 border-t border-slate-200 dark:border-slate-700">
                        {guide.sections.map((section, idx) => (
                          <div key={idx} className="py-4 first:pt-4 last:pb-0">
                            <h4 className="font-bold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
                              <span className="w-6 h-6 bg-purple-500 text-white rounded-full flex items-center justify-center text-xs font-bold">
                                {idx + 1}
                              </span>
                              {section.heading}
                            </h4>
                            <ul className="space-y-2 mb-3">
                              {section.points.map((point, pointIdx) => (
                                <li key={pointIdx} className="flex items-start gap-2 text-sm text-slate-700 dark:text-slate-300">
                                  <i className="fas fa-futbol text-purple-500 text-xs mt-1.5 flex-shrink-0"></i>
                                  <span>{point}</span>
                                </li>
                              ))}
                            </ul>
                            {section.interactiveTip && (
                              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3 mb-3">
                                <div className="flex items-start gap-2">
                                  <span className="text-blue-500">💡</span>
                                  <p className="text-sm text-blue-800 dark:text-blue-200 font-medium">
                                    {section.interactiveTip}
                                  </p>
                                </div>
                              </div>
                            )}
                            {section.example && (
                              <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-3">
                                <div className="flex items-start gap-2">
                                  <i className="fas fa-lightbulb text-amber-500 mt-0.5"></i>
                                  <div>
                                    <div className="text-xs font-bold text-amber-800 dark:text-amber-200 mb-1">
                                      Example
                                    </div>
                                    <p className="text-sm text-amber-700 dark:text-amber-300">
                                      {section.example}
                                    </p>
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                        ))}

                        {/* Quiz Section */}
                        {guide.quiz && (
                          <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-700">
                            <h4 className="font-bold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
                              <span>📝</span>
                              Quick Quiz
                            </h4>
                            <div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-4">
                              <p className="text-sm font-medium text-slate-900 dark:text-white mb-3">
                                {guide.quiz.question}
                              </p>
                              <div className="space-y-2 mb-3">
                                {guide.quiz.options.map((option, idx) => (
                                  <button
                                    key={idx}
                                    onClick={() => handleQuizAnswer(guide.id, idx)}
                                    disabled={quizResults[guide.id] !== undefined}
                                    className={`w-full text-left p-3 rounded-lg text-sm transition-colors ${
                                      quizResults[guide.id] === idx
                                        ? idx === guide.quiz.correct
                                          ? 'bg-green-100 border-green-500 text-green-800'
                                          : 'bg-red-100 border-red-500 text-red-800'
                                        : quizResults[guide.id] !== undefined
                                          ? idx === guide.quiz.correct
                                            ? 'bg-green-50 border-green-300 text-green-700'
                                            : 'bg-slate-100 text-slate-500'
                                          : 'bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-600'
                                    } border`}
                                  >
                                    {option}
                                  </button>
                                ))}
                              </div>
                              {quizResults[guide.id] !== undefined && (
                                <div className={`p-3 rounded-lg text-sm ${
                                  quizResults[guide.id] === guide.quiz.correct
                                    ? 'bg-green-100 text-green-800'
                                    : 'bg-red-100 text-red-800'
                                }`}>
                                  {guide.quiz.explanation}
                                </div>
                              )}
                            </div>
                          </div>
                        )}

                        {/* Action Buttons */}
                        <div className="flex items-center gap-3 mt-4 pt-4 border-t border-slate-200 dark:border-slate-700">
                          {guide.cta && (
                            <button
                              onClick={() => {
                                // Handle CTA navigation
                                onClose();
                                setTimeout(() => {
                                  const el = document.getElementById(guide.cta!.sectionId);
                                  if (el) {
                                    el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                                  }
                                }, 300);
                              }}
                              className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-sm font-bold transition-colors flex items-center gap-2"
                            >
                              <i className="fas fa-arrow-right text-xs"></i>
                              {guide.cta.label}
                            </button>
                          )}
                          {!isCompleted && (
                            <button
                              onClick={() => markComplete(guide.id)}
                              className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-bold transition-colors"
                            >
                              Mark Complete
                            </button>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ComprehensiveGuides;


