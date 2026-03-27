export interface GuideSection {
  heading: string;
  points: string[];
  interactiveTip?: string;
  example?: string;
  codeSnippet?: string;
}

export interface GuideQuiz {
  question: string;
  options: string[];
  correct: number;
  explanation: string;
  hint?: string;
}

export interface Guide {
  id: string;
  icon: string;
  title: string;
  description: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
  category: 'getting-started' | 'core-features' | 'strategy-tactics' | 'ai-tools' | 'advanced-play';
  estimatedTime: string;
  tags: string[];
  relatedGuides?: string[];
  sections: GuideSection[];
  cta?: { label: string; sectionId: string };
  quiz?: GuideQuiz;
  videoUrl?: string;
  lastUpdated?: string;
}

export interface GuideCategory {
  id: string;
  icon: string;
  title: string;
  description: string;
  color: string;
  order: number;
  gradient: string;
}

export const GUIDE_CATEGORIES: Record<string, GuideCategory> = {
  'getting-started': {
    id: 'getting-started',
    icon: '🚀',
    title: 'Getting Started',
    description: 'Master the basics and get up to speed quickly',
    color: 'green',
    order: 1,
    gradient: 'from-green-500 to-emerald-600'
  },
  'core-features': {
    id: 'core-features',
    icon: '⚙️',
    title: 'Core Features',
    description: 'Deep dive into the essential tools and data',
    color: 'blue',
    order: 2,
    gradient: 'from-blue-500 to-cyan-600'
  },
  'strategy-tactics': {
    id: 'strategy-tactics',
    icon: '🧠',
    title: 'Strategy & Tactics',
    description: 'Advanced strategies to climb the rankings',
    color: 'purple',
    order: 3,
    gradient: 'from-purple-500 to-violet-600'
  },
  'ai-tools': {
    id: 'ai-tools',
    icon: '🤖',
    title: 'AI & Tools',
    description: 'Leverage technology and automation',
    color: 'indigo',
    order: 4,
    gradient: 'from-indigo-500 to-blue-600'
  },
  'advanced-play': {
    id: 'advanced-play',
    icon: '🏆',
    title: 'Advanced Play',
    description: 'Elite tactics for experienced managers',
    color: 'red',
    order: 5,
    gradient: 'from-red-500 to-orange-600'
  }
};

export const DIFFICULTY_CONFIG = {
  'Beginner': { 
    color: 'green', 
    icon: '🎓', 
    description: 'Perfect for newcomers',
    bgClass: 'bg-green-100 dark:bg-green-900/30',
    textClass: 'text-green-700 dark:text-green-400',
    borderClass: 'border-green-300 dark:border-green-700'
  },
  'Intermediate': { 
    color: 'yellow', 
    icon: '⚡', 
    description: 'Building your knowledge',
    bgClass: 'bg-yellow-100 dark:bg-yellow-900/30',
    textClass: 'text-yellow-700 dark:text-yellow-400',
    borderClass: 'border-yellow-300 dark:border-yellow-700'
  },
  'Advanced': { 
    color: 'orange', 
    icon: '🔥', 
    description: 'Serious strategy',
    bgClass: 'bg-orange-100 dark:bg-orange-900/30',
    textClass: 'text-orange-700 dark:text-orange-400',
    borderClass: 'border-orange-300 dark:border-orange-700'
  },
  'Expert': { 
    color: 'red', 
    icon: '👑', 
    description: 'Elite level tactics',
    bgClass: 'bg-red-100 dark:bg-red-900/30',
    textClass: 'text-red-700 dark:text-red-400',
    borderClass: 'border-red-300 dark:border-red-700'
  }
};

export const GUIDES: Guide[] = [
  {
    id: 'absolute-beginner',
    icon: '🎓',
    title: 'FPL Absolute Beginner Guide',
    description: 'Master the core concepts to dominate your mini-league',
    difficulty: 'Beginner',
    category: 'getting-started',
    estimatedTime: '8 min',
    tags: ['basics', 'scoring', 'transfers', 'strategy'],
    relatedGuides: ['captaincy-masterclass', 'transfer-strategy'],
    lastUpdated: '2025-03-15',
    sections: [
      {
        heading: 'FPL Fundamentals',
        points: [
          'FPL is a free game where you pick 15 Premier League players with a £100m budget',
          'Select 2 GKs, 5 DEFs, 5 MIDs, 3 FWDs - your starting 11 score points each week',
          'Your captain scores DOUBLE points - this accounts for 20-25% of your weekly score',
          'You get 1 free transfer per week (max 2 banked). Extra transfers cost -4 points each',
          'Points come from goals, assists, clean sheets, saves, bonus. Lost for cards, own goals'
        ],
        interactiveTip: '🎯 Focus on 2-3 premium players (£10m+) for captaincy, fill the rest with reliable mid-price options',
        example: 'Haaland scores 2 goals = 8 points. As captain = 16 points. That\'s why captaincy matters!'
      },
      {
        heading: 'Strategic Budget Allocation',
        points: [
          'Don\'t spread budget evenly - concentrate on top performers',
          'Use £4.0-4.5m bench players who rarely play to free up budget for starters',
          'Pick players from different teams to diversify risk',
          'Consider opening fixtures - easy starts are more valuable than pre-season hype',
          'Check who\'s "nailed on" to start every week - consistency over reputation'
        ],
        interactiveTip: '💰 The 3-4-3 formation maximizes attacking returns - use it unless you have specific defensive reasons',
        example: '£12m Salah + £11m Haaland = £23m on 2 premiums. Use remaining £77m for 13 other players'
      },
      {
        heading: 'Weekly Decision Making',
        points: [
          'Check team news 1-2 hours before deadline - late drops can ruin your week',
          'Don\'t panic transfer after one bad result - sleep on big decisions',
          'Consider fixture difficulty over player reputation - good fixtures beat big names',
          'Bank transfers when going well - having 2 FTs gives you flexibility',
          'Set deadline reminders - Friday evening is perfect for planning'
        ],
        interactiveTip: '⏰ The best time to make transfers is Thursday evening - gives you time for Friday team news',
        example: 'Your star player gets injured Thursday? You have Friday morning to find a replacement before deadline'
      }
    ],
    cta: { label: 'View Player Data', sectionId: 'player-database' },
    quiz: {
      question: 'If you take 2 extra transfers (costing -8 points), how many additional points do your new players need to score to make it worthwhile?',
      options: ['4 points', '8 points', '9 points', '12 points'],
      correct: 2,
      explanation: 'You need to outscore by 9+ points to justify the -4 point hit. Your old players still score, so you need 9 points MORE than they would have scored.',
      hint: 'Think: -4 points cost + old players still score = need significant advantage'
    }
  },
  {
    id: 'captaincy-masterclass',
    icon: '👑',
    title: 'Captaincy Science & Strategy',
    description: 'Master the most important decision in FPL',
    difficulty: 'Advanced',
    category: 'strategy-tactics',
    estimatedTime: '12 min',
    tags: ['captain', 'double-points', 'strategy', 'rotation'],
    relatedGuides: ['absolute-beginner', 'transfer-strategy'],
    sections: [
      {
        heading: 'Captaincy Fundamentals',
        points: [
          'Your captain scores DOUBLE points - this single decision accounts for 20-25% of weekly score',
          '70% of the time, the obvious premium choice with good fixtures is the right call',
          'Don\'t overthink it - consistency beats brilliant but risky picks most weeks',
          'Check bookmakers\' goalscorer odds - they\'re surprisingly accurate for captaincy',
          'Vice-captain only activates if your captain doesn\'t play at all - choose wisely'
        ],
        interactiveTip: '🎯 Set a weekly captain reminder for Friday evening - gives you time for team news analysis',
        example: 'Haaland at home to Burnley with 85% confidence = template captain pick. Don\'t overthink it.'
      },
      {
        heading: 'When to Go Differential',
        points: [
          'Template captain has tough away fixture, your pick has home game vs relegation side',
          'Your differential has been in excellent form (8.0+ points per game last 3-4 games)',
          'Consider xG and xA - underlying stats show who\'s likely to score, not just recent goals',
          'Check team news - confirmed starters vs injury doubts can make or break your choice',
          'Ownership percentage matters - if you pick a 5% owned player and they score, you gain on 95% of managers'
        ],
        interactiveTip: '📊 Create a "differential watchlist" of under-10% owned players with good fixtures',
        example: 'Salah (50% owned) away to Man City vs Isak (5% owned) home to Luton. Isak has higher ceiling despite lower floor.'
      },
      {
        heading: 'Captain Rotation Strategy',
        points: [
          'Own 2-3 premium captain options whose fixtures alternate for weekly consistency',
          'Classic rotation pairs: Haaland + Salah, Kane + De Bruyne, etc.',
          'Don\'t captain defenders or keepers unless absolutely necessary (low ceiling)',
          'Triple Captain chip should be saved for premium players in Double Gameweeks',
          'Track your captaincy success rate - learn from patterns in your decision making',
          'Plan 4-6 weeks ahead - know when your captain options have tough runs'
        ],
        interactiveTip: '📅 Create a fixture calendar showing your captain options\' schedules for the next 6 GWs',
        example: 'Own Haaland (tough fixture) + Salah (easy fixture). Captain Salah this week, save Haaland for next week\'s easier game.'
      }
    ],
    cta: { label: 'View Captain Picks', sectionId: 'captain-picks' },
    quiz: {
      question: 'What percentage of your total FPL score typically comes from captaincy decisions over a full season?',
      options: ['10-15%', '20-25%', '30-35%', '40-45%'],
      correct: 1,
      explanation: 'Captaincy decisions account for roughly 20-25% of your total FPL score over a season - making it the single most important weekly decision!',
      hint: 'It\'s significant but not the majority of your score'
    }
  },
  {
    id: 'transfer-strategy',
    icon: '🔄',
    title: 'Transfer Strategy & Economics',
    description: 'Master the art of strategic transfers and team value',
    difficulty: 'Advanced',
    category: 'strategy-tactics',
    estimatedTime: '15 min',
    tags: ['transfers', 'value', 'timing', 'strategy'],
    relatedGuides: ['captaincy-masterclass', 'blank-double-gw-exploits'],
    sections: [
      {
        heading: 'The Economics of Transfers',
        points: [
          'Every -4 point hit requires your new players to outscore old ones by 5+ points to break even',
          'Team value is crucial - extra £0.5m = better player options later in the season',
          'Price changes happen at 1:30 AM GMT - buy before rises, sell before falls',
          'Don\'t make emotional transfers - sleep on Friday night panic decisions',
          'Consider opportunity cost - every transfer window you use is one you can\'t save for later'
        ],
        interactiveTip: '💰 Track your team value weekly - gaining £1-2m in value over a season is huge',
        example: 'Take -4 point hit for a player who scores 12 points vs old player scoring 6 points = +2 net gain'
      },
      {
        heading: 'When to Take Hits',
        points: [
          'Injured/suspended players - 0 points is worse than -4 + potential returns',
          'Double transfers (-8 points) can fix two problems at once, especially before good fixture runs',
          'Never take hits for one-week punts - the maths almost never works out long-term',
          'Consider fixture swings - moving from tough to easy fixtures justifies hits',
          'Bank transfers when your team is performing well - save for emergencies or chip weeks'
        ],
        interactiveTip: '📊 Create a "hit calculator" - estimate points difference before taking -4',
        example: 'Your striker is injured (-4 hit) + replacement scores 8 points vs 0 points = +4 net gain'
      },
      {
        heading: 'Advanced Transfer Planning',
        points: [
          'Look 3-4 GWs ahead - plan your path to target players using free transfers',
          'Use price changes to your advantage - buy rising players before they get too expensive',
          'Consider ownership when selling - mass sell-offs can cause price drops',
          'Plan chip usage around transfers - Wildcard the week BEFORE a DGW, not during',
          'Track "template" teams - if everyone owns a player, selling them before a price drop can be smart'
        ],
        interactiveTip: '📅 Maintain a transfer wishlist with target prices and ideal acquisition weeks',
        example: 'Player A rises from £6.0m to £6.5m in 2 weeks. Buying at £6.0m saves you £0.5m team value'
      }
    ],
    cta: { label: 'View Price Changes', sectionId: 'price-tracker' },
    quiz: {
      question: 'You take 2 transfers for a -8 point hit. Your new players score 15 points combined, while your old players would have scored 8 points. What\'s your net gain/loss?',
      options: ['-1 point', '+7 points', '+15 points', '-8 points'],
      correct: 0,
      explanation: 'New players (15) - old players (8) - hit cost (8) = -1 point net loss. Even with good returns, the hit cost can erase gains.',
      hint: 'Formula: (New points) - (Old points) - (Hit cost) = Net result'
    }
  },
  {
    id: 'gaffer-chat-guide',
    icon: '🤖',
    title: 'Gaffer AI Chat Bot Guide',
    description: 'Get personalized FPL advice from The Gaffer AI',
    difficulty: 'Beginner',
    category: 'ai-tools',
    estimatedTime: '6 min',
    tags: ['ai', 'chat', 'advice', 'personalized'],
    relatedGuides: ['captaincy-masterclass', 'transfer-strategy'],
    sections: [
      {
        heading: 'Getting Started with Gaffer Chat',
        points: [
          'Access Gaffer Chat via the floating chat button - your personal FPL assistant',
          'Free users: 2 questions/day, First Team: 10/day, Season Pass: unlimited',
          'Chat history is saved - reference previous advice and track your decision patterns',
          'The AI knows current FPL data, fixtures, injuries, and advanced statistics',
          'Ask specific questions for better advice - context is everything'
        ],
        interactiveTip: '💡 Include your team context: "I have Haaland, Salah, De Bruyne. Who should captain this week?"',
        example: 'User: "Should I transfer out Rashford for Saka?" Gaffer: "Based on fixtures and form, Saka has better upcoming schedule and higher xG. Worth the -4 if you can afford it."'
      },
      {
        heading: 'Strategic Questions to Ask',
        points: [
          'Transfer dilemmas: "Should I sell [Player] for [Player] this week?"',
          'Captaincy decisions: "Who should captain from my team: [options]?"',
          'Wildcard planning: "I have wildcard, what\'s the optimal team for next 6 GWs?"',
          'Value analysis: "Is [Player] worth his price at [amount]m based on underlying stats?"',
          'Differential opportunities: "Which under-10% owned players should I consider?"',
          'Chip strategy: "When should I use my Bench Boost chip this season?"'
        ],
        interactiveTip: '🎯 Ask follow-up questions to dive deeper into initial recommendations',
        example: 'Good: "You recommended Player A, but what are the risks vs Player B?" Bad: "Help me win"'
      },
      {
        heading: 'Advanced Chat Features',
        points: [
          'Fixture analysis: "Which teams have easiest run of fixtures for next month?"',
          'Player comparisons: "Compare xG and recent form for [Player A] vs [Player B]"',
          'Injury intelligence: "Any injury concerns for [Team] affecting my players?"',
          'Rank climbing: "I\'m 50k in my mini-league, what moves could help me climb?"',
          'Long-term planning: "Which players should I target for the next 2 months?"',
          'Budget optimization: "How can I improve my team value without sacrificing points?"'
        ],
        interactiveTip: '📊 Use the AI to validate your own research - it can spot patterns you might miss',
        example: 'User: "I\'m considering selling my expensive defender for a cheaper midfielder." Gaffer: "Good move - defenders score less consistently and you\'re freeing budget for attacking returns."'
      }
    ],
    cta: { label: 'Try Gaffer Chat', sectionId: 'gaffer-chat' }
  },
  {
    id: 'blank-double-gw-exploits',
    icon: '📅',
    title: 'Blank & Double Gameweek Mastery',
    description: 'Master the most complex FPL scenarios for massive rank gains',
    difficulty: 'Expert',
    category: 'advanced-play',
    estimatedTime: '16 min',
    tags: ['bgw', 'dgw', 'chips', 'planning', 'advanced'],
    relatedGuides: ['transfer-strategy', 'captaincy-masterclass'],
    sections: [
      {
        heading: 'Understanding Blank & Double GWs',
        points: [
          'Blank Gameweeks: Some teams don\'t play due to FA Cup/cup scheduling - affects everyone',
          'Double Gameweeks: Teams play twice in one GW - creates massive opportunities',
          'BGWs hurt your non-playing players, DGWs give players double scoring chances',
          'Check official FPL fixture list 2-3 months in advance for strategic planning',
          'The most successful managers plan their entire season around BGWs/DGWs',
          'Some teams can have both BGW and DGW in same season - requires complex planning'
        ],
        interactiveTip: '📅 Create a season calendar highlighting all BGWs/DGWs - this is your strategic roadmap',
        example: 'Man City BGW in GW25, DGW in GW28. Plan transfers to minimize BGW impact and maximize DGW returns.'
      },
      {
        heading: 'Blank Gameweek Strategy',
        points: [
          'If 3+ players blanking, strongly consider using Free Hit chip to field full team',
          '1-2 players blanking? Bench them naturally, save your chip for better opportunities',
          'Start planning 2-3 GWs before - use free transfers to move out blanking players gradually',
          'Don\'t panic - BGWs affect everyone, focus on relative advantage over your rivals',
          'Consider selling blanking players early if their post-blank fixtures are tough',
          'Use BGWs to take strategic hits on players you want to keep long-term'
        ],
        interactiveTip: '🎯 BGWs are opportunities - use them to reset your team or take calculated risks',
        example: '3 of your players blank in GW25. Use Free Hit to field full team, then wildcard in GW26 for post-blank fixtures.'
      },
      {
        heading: 'Double Gameweek Exploitation',
        points: [
          'DGW players get two chances to score - the highest ceiling plays in FPL',
          'Bench Boost + DGW = potentially 30 player-games in one week - massive point potential',
          'Triple Captain on premium DGW player = highest single-week ceiling possible',
          'Wildcard the week BEFORE DGW to set up perfect squad - not during the DGW itself',
          'Quality over quantity - DGW vs Man City + Arsenal worse than SGW vs relegation side',
          'Plan chip combinations: Wildcard + Bench Boost, or Free Hit + Triple Captain around DGWs'
        ],
        interactiveTip: '💰 The best managers save their best chips for DGWs - they offer the biggest rank climb opportunities',
        example: 'Haaland DGW vs two relegation sides + Triple Captain = potential 30+ point haul. This can jump you thousands of ranks.'
      },
      {
        heading: 'Advanced DGW Tactics',
        points: [
          'Identify "bridge" players - those who play in both blank and double weeks',
          'Consider fixture difficulty heavily - DGW vs top teams vs DGW vs bottom teams',
          'Bank transfers before big DGWs to have maximum flexibility for chip setup',
          'Use blank GWs to take points hits without major competitive consequences',
          'Track other managers\' strategies - differentials in DGWs can be massive rank movers',
          'Plan multiple DGWs ahead - some seasons have clusters of DGWs that require long-term planning'
        ],
        interactiveTip: '📊 Create a DGW scoring projection spreadsheet - estimate points potential for each target',
        example: 'Player A: DGW vs tough teams (4-6 pts expected). Player B: SGW vs easy team (6-8 pts expected). Sometimes SGW beats DGW.'
      }
    ],
    cta: { label: 'View Fixture Schedule', sectionId: 'fixtures' },
    quiz: {
      question: 'Which chip combination provides the highest potential point ceiling in a Double Gameweek?',
      options: ['Free Hit + Triple Captain', 'Wildcard + Bench Boost', 'Bench Boost + Triple Captain', 'Wildcard alone'],
      correct: 2,
      explanation: 'Bench Boost + Triple Captain in a DGW gives you 15 players potentially playing twice (30 player-games), with one scoring triple points - the absolute highest ceiling combination in FPL!',
      hint: 'Think about maximizing both the number of players AND the points multiplier'
    }
  }
];

export default GUIDES;


