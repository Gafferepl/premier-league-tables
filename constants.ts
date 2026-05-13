
import { Fact, Player, NavLink, MatchStats, NewsItem } from './types';

export const AFFILIATE_LINK = "https://www.amazon.co.uk/b?node=324135031&tag=premierleaguetables-21"; 

export const FACTS: Fact[] = [
  { fact: "Jamie Vardy broke Ruud van Nistelrooy's record by scoring in 11 consecutive Premier League games.", context: "From non-league to Premier League champion. The party actually started." },
  { fact: "Sadio Mané scored the fastest hat-trick in Premier League history: 2 minutes and 56 seconds.", context: "I've taken longer to tie my laces. Southampton vs Aston Villa, 2015." },
  { fact: "Ryan Giggs is the only player to have scored in 21 consecutive Premier League seasons.", context: "Tearing you apart since 1993. A true machine." },
  { fact: "Arsenal's 'Invincibles' won the league in 2003/04 without losing a single game.", context: "Played 38, Won 26, Drawn 12, Lost 0. The standard." },
  { fact: "Darius Vassell scored in 46 different Premier League games and never lost a single one.", context: "The ultimate good luck charm. If your team was losing, you'd sub him on just to guarantee a draw." },
  { fact: "Only three players born before 1960 have scored a Premier League hat-trick: Gordon Strachan, Gary McAllister, and Teddy Sheringham.", context: "Proves that an old head is better than two quick feet. They knew where the goal was, no messing about." },
  { fact: "Peter Crouch has scored more headed goals (53) than 16 of the teams who have ever played in the Premier League.", context: "Plan A: Cross it to Crouchy. Plan B: Cross it to Crouchy, but a bit higher. Football is a simple game." },
  { fact: "Nuri Sahin, once of Liverpool, played 7 Premier League games, had 1 goal, 3 assists, and won Player of the Month.", context: "A flash in the pan. Came in, bossed it for four weeks, then packed his bags. The definition of a good loan signing." },
  { fact: "Iago Aspas took 14 corners for Liverpool. All of them were either unsuccessful or went straight to an opponent.", context: "I'd have had him on corner-taking duty for the opposition. Some lads just can't handle a dead ball." },
];

export const NAV_LINKS: NavLink[] = [
  { id: 'league-table', label: 'Table', icon: 'fa-table' },
  { id: 'fixtures', label: 'Fixtures', icon: 'fa-calendar-alt' },
  { id: 'top-scorers', label: 'Scorers', icon: 'fa-futbol' },
  { id: 'news-carousel', label: 'News', icon: 'fa-newspaper' },
];

export const GAFFER_VERDICTS = {
  BORE_DRAW: [
    "About as exciting as watching paint dry. I want a refund.",
    "Nil-nil. A scoreline that makes you question your life choices.",
    "Neither keeper had to wash their kit after this one.",
    "Two teams terrified of losing. A cure for insomnia.",
    "Ideally, I'd ask for a refund, but I got in for free.",
    "90 minutes I'll never get back. Pure anti-football.",
    "Tactical masterclass? Or just 22 blokes afraid of the ball?",
    "I've seen more action in a library on a Sunday.",
    "A clean sheet is good, but two clean sheets is boring.",
    "The only winner today was the grass. Pristine."
  ],
  GOAL_FEST: [
    "Defending? Never heard of it. Absolute chaos at the back.",
    "Entertaining for the neutrals, a heart attack for the dugout.",
    "Schoolboy defending meets world-class finishing.",
    "If you like goals, you're happy. If you like clean sheets, look away.",
    "Keepers might as well have brought deckchairs.",
    "Goals galore. My back four would be running laps until Christmas.",
    "Scoreboard operator earned his wages today.",
    "More holes in those defences than a tea bag.",
    "Great for the highlights reel, terrible for the coaches' blood pressure.",
    "The net took more of a battering than the ball."
  ],
  SMASH_GRAB: [ 
    "Proper performance. Parked the bus and smashed 'em on the break.",
    "They can keep the ball, we'll take the three points. Simple as.",
    "Possession stats don't win games, goals do. Lesson learned.",
    "Soaked up the pressure like a sponge. Classic away day.",
    "Ugly win? No such thing. It's just a win.",
    "Clinical. Two chances, two goals. Go home.",
    "Let them pass it sideways. We put it in the net.",
    "Robbery in broad daylight. Loved it.",
    "Efficiency over flair. That's how you win titles."
  ],
  TIPPY_TAPPY: [ 
    "Passed it to death and got nothing. Tippy-tappy rubbish.",
    "All gear, no idea. 70% possession and zero threat.",
    "Pretty patterns, but no punch. Typical modern football.",
    "Passed it sideways more times than a crab on holiday.",
    "Possession is vanity. Points are sanity.",
    "Looked good until they got to the box. Toothless.",
    "I'd rather lose playing direct than draw playing this nonsense.",
    "They wanted to walk it in. Just hit the thing!",
    "Stats don't lie, but they don't tell the score either."
  ],
  WASTEFUL: [ 
    "Couldn't hit a cow's backside with a banjo today.",
    "Barn door safe from that lot.",
    "All the build-up, none of the finish. Frustrating.",
    "Left their shooting boots on the bus.",
    "Keeper had a blinder, or the strikers had a nightmare. Bit of both.",
    "Should have been five. Finishing practice tomorrow.",
    "Dominance means nothing if you can't hit the target.",
    "Wasteful. Absolute criminal waste of chances."
  ],
  GENERIC: [
    "A proper battle in the midfield. Honest work, hard tackles.",
    "Left it all on the pitch. That's all you can ask for.",
    "Blood, sweat, and yellow cards. Proper football.",
    "A game of two halves, and both of them were lively.",
    "End to end stuff. Good for the fans, bad for the blood pressure.",
    "Proper shift from the lads. Can't complain.",
    "It wasn't pretty, but it was effective.",
    "Old school battle. Loved every minute of the crunching tackles.",
    "Three points is three points, doesn't matter how they come.",
    "The referee tried his best to ruin it, but a good game broke out.",
    "High tempo, high drama. Proper Barclays that.",
    "No quarter asked, none given. Good scrap."
  ]
};

// Unofficial / Custom Logos (Using Empty Strings to trigger TeamIcon fallback)
export const TEAM_LOGOS: Record<string, string> = {
  "Arsenal": "",
  "Aston Villa": "",
  "Bournemouth": "",
  "Brentford": "",
  "Brighton": "",
  "Burnley": "",
  "Chelsea": "",
  "Crystal Palace": "",
  "Everton": "",
  "Fulham": "",
  "Ipswich": "",
  "Ipswich Town": "",
  "Leeds": "",
  "Leeds United": "",
  "Leicester": "",
  "Leicester City": "",
  "Liverpool": "",
  "Luton": "",
  "Luton Town":
 "",
  "Man City": "",
  "Manchester City": "",
  "Man Utd": "",
  "Manchester United": "",
  "Newcastle": "",
  "Newcastle United": "",
  "Nottingham Forest": "",
  "Nott'm Forest": "",
  "Sheffield United": "",
  "Sheffield Utd": "",
  "Southampton": "",
  "Spurs": "",
  "Tottenham": "",
  "Tottenham Hotspur": "",
  "West Ham": "",
  "West Ham United": "",
  "Wolves": "",
  "Wolverhampton": "",
  "Wolverhampton Wanderers": ""
};

// Generic Football Images for News (Unsplash)
const NEWS_IMAGES = [
  "https://images.unsplash.com/photo-1522778119026-d647f0565c00?auto=format&fit=crop&q=80&w=1000",
  "https://images.unsplash.com/photo-1579952363873-27f3bade9f55?auto=format&fit=crop&q=80&w=1000",
  "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&q=80&w=1000",
  "https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?auto=format&fit=crop&q=80&w=1000",
  "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=1000",
  "https://images.unsplash.com/photo-1517466787929-bc90951d0974?auto=format&fit=crop&q=80&w=1000"
];

export const ELITE_TRIO: Player[] = [
  {
    name: "Erling Haaland",
    team: "Man City",
    goals: 16, 
    penalties: 3, 
    homeGoals: 9,
    awayGoals: 7,
    assists: 2,
    boots: "Nike Phantom GX 2 Elite",
    price: "£230 - £260",
    link: "https://www.amazon.co.uk/s?k=Nike+Phantom+GX+2+Elite&tag=premierleaguetables-21",
    image: "", // Use generic fallback
    rank: 'gold',
    goalTiming: {
      '0-15': 2, '16-30': 3, '31-45': 3, '46-60': 4, '61-75': 2, '76-90+': 2
    }
  },
  {
    name: "Mohamed Salah",
    team: "Liverpool",
    goals: 14, 
    penalties: 4, 
    homeGoals: 8,
    awayGoals: 6,
    assists: 7,
    boots: "Adidas F50 Elite",
    price: "£220 - £250",
    link: "https://www.amazon.co.uk/s?k=Adidas+F50+Elite&tag=premierleaguetables-21",
    image: "", 
    rank: 'silver',
    goalTiming: {
      '0-15': 2, '16-30': 3, '31-45': 4, '46-60': 2, '61-75': 2, '76-90+': 1
    }
  },
  {
    name: "Chris Wood",
    team: "Nottingham Forest",
    goals: 11, 
    penalties: 1, 
    homeGoals: 7,
    awayGoals: 4,
    assists: 0,
    boots: "Nike Phantom GX 2",
    price: "£200",
    link: "https://www.amazon.co.uk/s?k=Nike+Phantom+GX+2&tag=premierleaguetables-21",
    image: "", 
    rank: 'bronze',
    goalTiming: {
      '0-15': 1, '16-30': 2, '31-45': 3, '46-60': 3, '61-75': 1, '76-90+': 1
    }
  }
];

export const MORE_TALENT: Player[] = [
  {
    name: "Cole Palmer",
    team: "Chelsea",
    goals: 10, 
    penalties: 4, 
    homeGoals: 6,
    awayGoals: 4,
    assists: 6,
    boots: "Nike Mercurial Vapor 16",
    price: "£245",
    link: "https://www.amazon.co.uk/s?k=Nike+Mercurial+Vapor+16&tag=premierleaguetables-21",
    image: "",
    goalTiming: {
      '0-15': 1, '16-30': 2, '31-45': 3, '46-60': 2, '61-75': 1, '76-90+': 1
    }
  },
  {
    name: "Bryan Mbeumo",
    team: "Brentford",
    goals: 9, 
    penalties: 2, 
    homeGoals: 6,
    awayGoals: 3,
    assists: 4,
    boots: "Adidas X Crazyfast",
    price: "£180",
    link: "https://www.amazon.co.uk/s?k=Adidas+X+Crazyfast&tag=premierleaguetables-21",
    image: "",
    goalTiming: {
      '0-15': 2, '16-30': 1, '31-45': 2, '46-60': 2, '61-75': 1, '76-90+': 1
    }
  },
  {
    name: "Alexander Isak",
    team: "Newcastle",
    goals: 8, 
    penalties: 1,
    homeGoals: 5,
    awayGoals: 3,
    assists: 2,
    boots: "Adidas F50 Elite",
    price: "£220",
    link: "https://www.amazon.co.uk/s?k=Adidas+F50+Elite&tag=premierleaguetables-21",
    image: "",
    goalTiming: {
      '0-15': 1, '16-30': 1, '31-45': 2, '46-60': 2, '61-75': 1, '76-90+': 1
    }
  }
];

export const NEWS_ITEMS: NewsItem[] = [
  {
    id: 1,
    title: "Salah signs contract extension",
    summary: "Mohamed Salah puts speculation to bed by signing a new deal with Liverpool until 2027.",
    image: NEWS_IMAGES[0],
    source: "Liverpool FC",
    url: "https://www.google.com/search?q=Salah+signs+contract+extension+Liverpool+official",
    time: "2h ago"
  },
  {
    id: 2,
    title: "Amorim's United revolution begins",
    summary: "New Manchester United boss Ruben Amorim is implementing his 3-4-3 system ahead of the weekend clash.",
    image: NEWS_IMAGES[1],
    source: "Man Utd",
    url: "https://www.google.com/search?q=Ruben+Amorim+Manchester+United+tactics+news",
    time: "4h ago"
  },
  {
    id: 3,
    title: "Haaland injury update",
    summary: "Manchester City are monitoring Erling Haaland after he picked up a knock in training.",
    image: NEWS_IMAGES[2],
    source: "Man City",
    url: "https://www.google.com/search?q=Erling+Haaland+injury+update+latest+news",
    time: "5h ago"
  },
  {
    id: 4,
    title: "Arsenal title race analysis",
    summary: "Mikel Arteta admits Arsenal need to be perfect to catch Liverpool and City.",
    image: NEWS_IMAGES[3], 
    source: "BBC Sport",
    url: "https://www.google.com/search?q=Arsenal+title+race+Arteta+quotes+latest",
    time: "6h ago"
  },
  {
    id: 5,
    title: "Chelsea's Palmer on fire",
    summary: "Cole Palmer continues his incredible form with another goal involvement.",
    image: NEWS_IMAGES[4],
    source: "Chelsea FC",
    url: "https://www.google.com/search?q=Cole+Palmer+Chelsea+stats+news+latest",
    time: "7h ago"
  },
  {
    id: 6,
    title: "Forest European dream",
    summary: "Nuno Espirito Santo has Nottingham Forest dreaming of Europe.",
    image: NEWS_IMAGES[5], 
    source: "Sky Sports",
    url: "https://www.google.com/search?q=Nottingham+Forest+European+football+news+Nuno",
    time: "8h ago"
  },
  {
    id: 7,
    title: "Isak transfer latest",
    summary: "Newcastle striker Alexander Isak is attracting interest from top European clubs.",
    image: NEWS_IMAGES[0],
    source: "Newcastle United",
    url: "https://www.google.com/search?q=Alexander+Isak+Newcastle+transfer+rumours",
    time: "9h ago"
  },
  {
    id: 8,
    title: "Wolves VAR reaction",
    summary: "Gary O'Neil left fuming after another contentious decision goes against Wolves.",
    image: NEWS_IMAGES[1], 
    source: "Wolves",
    url: "https://www.google.com/search?q=Gary+ONeil+Wolves+VAR+reaction+news",
    time: "10h ago"
  },
  {
    id: 9,
    title: "Spurs top four push",
    summary: "Ange Postecoglou insists Tottenham will fight until the end for Champions League football.",
    image: NEWS_IMAGES[2], 
    source: "Tottenham Hotspur",
    url: "https://www.google.com/search?q=Tottenham+top+four+race+Ange+Postecoglou+quotes",
    time: "11h ago"
  },
  {
    id: 10,
    title: "FPL Gameweek Tips",
    summary: "Who to captain this week? The Scout gives their verdict.",
    image: NEWS_IMAGES[3],
    source: "Premier League",
    url: "https://www.google.com/search?q=FPL+Gameweek+tips+Scout+selection+latest",
    time: "12h ago"
  }
];

export const RECENT_MATCHES: MatchStats[] = [
  {
    id: 1,
    homeTeam: "Liverpool",
    awayTeam: "Man City",
    score: "2 - 0",
    date: "01-12-2024",
    homeScorers: ["Gakpo 12'", "Salah 78' (P)"],
    awayScorers: [],
    possession: { home: 45, away: 55 },
    shots: { home: 14, away: 10 },
    shotsOnTarget: { home: 7, away: 2 }
  },
  {
    id: 2,
    homeTeam: "Arsenal",
    awayTeam: "Man Utd",
    score: "2 - 0",
    date: "04-12-2024",
    homeScorers: ["Timber 54'", "Saliba 73'"],
    awayScorers: [],
    possession: { home: 55, away: 45 },
    shots: { home: 18, away: 5 },
    shotsOnTarget: { home: 8, away: 1 }
  },
  {
    id: 3,
    homeTeam: "Chelsea",
    awayTeam: "Aston Villa",
    score: "3 - 0",
    date: "01-12-2024",
    homeScorers: ["Jackson 7'", "Fernandez 36'", "Palmer 83'"],
    awayScorers: [],
    possession: { home: 58, away: 42 },
    shots: { home: 16, away: 8 },
    shotsOnTarget: { home: 9, away: 3 }
  },
  {
    id: 4,
    homeTeam: "Tottenham",
    awayTeam: "Fulham",
    score: "1 - 1",
    date: "01-12-2024",
    homeScorers: ["Johnson 29'"],
    awayScorers: ["Cairney 67'"],
    possession: { home: 62, away: 38 },
    shots: { home: 12, away: 11 },
    shotsOnTarget: { home: 5, away: 4 }
  }
];

export const MODAL_CONTENT: Record<string, string> = {
  about: `
    <h3 class="text-xl font-bold mb-4 text-primary dark:text-white font-heading uppercase tracking-widest"><i class="fas fa-beer mr-2 text-accent"></i> The Gaffer's Manifesto</h3>
    <p class="mb-4 text-slate-700 dark:text-slate-300">Listen here. We aren't some fancy Silicon Valley analytics startup. We don't care about "Expected Goals" or "Progressive Carries" unless they result in the ball hitting the back of the onion bag.</p>
    <p class="mb-4 text-slate-700 dark:text-slate-300"><strong>PremierLeagueTables.com</strong> was built by fans who remember when tackles were legal and boots were black. We provide the fastest, cleanest stats on the web, stripped of all the corporate nonsense.</p>
    <p class="mt-6 italic text-sm text-slate-500 border-l-4 border-warning pl-4">"Built with passion, fueled by pies, and running on a server that costs less than a League Two winger."</p>
  `,
  privacy: `
    <h3 class="text-xl font-bold mb-4 text-primary dark:text-white font-heading uppercase tracking-widest"><i class="fas fa-user-secret mr-2 text-accent"></i> Privacy? What Privacy?</h3>
    <p class="mb-4 text-slate-700 dark:text-slate-300">Cookies? The only biscuits I care about are the ones in the boardroom tea lady's tin. We don't track you. I can barely track my own left-back during a counter-attack, let alone your browsing history.</p>
    <p class="mb-4 text-slate-700 dark:text-slate-300"><strong>The Deal:</strong></p>
    <ul class="list-disc pl-5 space-y-2 text-slate-700 dark:text-slate-300">
       <li>We don't sell your data. Who'd buy it anyway?</li>
       <li>We store your dark mode preference on your device. That's it.</li>
       <li>If you use the affiliate links to buy boots, Amazon knows. But they know everything already.</li>
    </ul>
  `,
  terms: `
    <h3 class="text-xl font-bold mb-4 text-primary dark:text-white font-heading uppercase tracking-widest"><i class="fas fa-gavel mr-2 text-accent"></i> Club Rules</h3>
    <div class="space-y-4 font-mono text-sm text-slate-700 dark:text-slate-300">
      <div class="p-3 bg-slate-100 dark:bg-slate-700 rounded border-l-4 border-red-500">
        <strong>Rule #1:</strong> The Gaffer is always right.
      </div>
      <div class="p-3 bg-slate-100 dark:bg-slate-700 rounded border-l-4 border-red-500">
        <strong>Rule #2:</strong> If The Gaffer is wrong, refer to Rule #1.
      </div>
      <p>By using this site, you agree that football is the greatest game on earth. Data is fetched from third-party sources (Gemini AI grounding). While we aim for 100% accuracy, don't bet your house on it. If your team loses, don't blame us. Blame the referee (or VAR).</p>
      <p><strong>No Diving:</strong> Attempting to hack or break this site will result in a lifetime ban. And a two-footed tackle.</p>
    </div>
  `,
  contact: `
    <h3 class="text-xl font-bold mb-4 text-primary dark:text-white font-heading uppercase tracking-widest"><i class="fas fa-bullhorn mr-2 text-accent"></i> Bend the Gaffer's Ear</h3>
    <p class="mb-4 text-slate-700 dark:text-slate-300">Got a suggestion? Spotted a bug? Want to complain about that offside decision from 2004?</p>
    <div class="bg-slate-100 dark:bg-slate-700 p-6 rounded-xl border border-slate-200 dark:border-slate-600 text-center">
       <p class="mb-2 font-bold text-slate-500 uppercase text-xs tracking-widest">Direct Line to the Dugout</p>
       <a href="mailto:info@premierleaguetables.com" class="text-2xl md:text-3xl font-heading font-black text-accent hover:text-primary transition-colors block mb-4 break-all">
         info@premierleaguetables.com
       </a>
       <p class="text-xs text-slate-400 italic">
         (Replies may be delayed if there's a match on, or if the Gaffer is down the pub.)
       </p>
    </div>
  `
};

export const getTeamLogo = (teamName: string): string | null => {
  if (!teamName) return null;
  const lowerName = teamName.toLowerCase().trim();

  for (const key in TEAM_LOGOS) {
      if (key.toLowerCase() === lowerName) return TEAM_LOGOS[key];
  }

  if (lowerName.includes('man') && lowerName.includes('city')) return TEAM_LOGOS["Man City"];
  if (lowerName.includes('utd') || lowerName.includes('united') || lowerName === 'man u') return TEAM_LOGOS["Man Utd"];
  if (lowerName.includes('tottenham') || lowerName.includes('hotspur') || lowerName === 'spurs') return TEAM_LOGOS["Spurs"];
  if (lowerName.includes('forest')) return TEAM_LOGOS["Nottingham Forest"];
  if (lowerName.includes('villa')) return TEAM_LOGOS["Aston Villa"];
  if (lowerName.includes('palace')) return TEAM_LOGOS["Crystal Palace"];
  if (lowerName.includes('west ham')) return TEAM_LOGOS["West Ham"];
  if (lowerName.includes('wolves') || lowerName.includes('wolverhampton')) return TEAM_LOGOS["Wolves"];
  if (lowerName.includes('brighton')) return TEAM_LOGOS["Brighton"];
  if (lowerName.includes('leicester')) return TEAM_LOGOS["Leicester"];
  if (lowerName.includes('leeds')) return TEAM_LOGOS["Leeds"];
  if (lowerName.includes('ipswich')) return TEAM_LOGOS["Ipswich"];
  if (lowerName.includes('southampton')) return TEAM_LOGOS["Southampton"];
  if (lowerName.includes('everton')) return TEAM_LOGOS["Everton"];
  if (lowerName.includes('chelsea')) return TEAM_LOGOS["Chelsea"];
  if (lowerName.includes('liverpool')) return TEAM_LOGOS["Liverpool"];
  if (lowerName.includes('arsenal')) return TEAM_LOGOS["Arsenal"];
  if (lowerName.includes('brentford')) return TEAM_LOGOS["Brentford"];
  if (lowerName.includes('bournemouth')) return TEAM_LOGOS["Bournemouth"];
  if (lowerName.includes('fulham')) return TEAM_LOGOS["Fulham"];
  if (lowerName.includes('sheffield')) return TEAM_LOGOS["Sheffield United"];
  if (lowerName.includes('luton')) return TEAM_LOGOS["Luton"];
  if (lowerName.includes('burnley')) return TEAM_LOGOS["Burnley"];
  return null;
};
// FALLBACK DATA - Updated to current 2024/25 season (Feb 2025) - CORRECT DATA
export const FALLBACK_DATA = {
  lastUpdated: Date.now(),
  currentGameweek: 26, // Current gameweek from user's image
  table: [
    { position: 1, team: "Arsenal", played: 24, won: 16, drawn: 5, lost: 3, gd: 29, points: 53, goalsFor: 46, goalsAgainst: 17, cleanSheets: 8 },
    { position: 2, team: "Man City", played: 24, won: 14, drawn: 5, lost: 5, gd: 26, points: 47, goalsFor: 49, goalsAgainst: 23, cleanSheets: 7 },
    { position: 3, team: "Aston Villa", played: 24, won: 14, drawn: 4, lost: 6, gd: 9, points: 46, goalsFor: 35, goalsAgainst: 26, cleanSheets: 6 },
    { position: 4, team: "Man United", played: 24, won: 11, drawn: 8, lost: 5, gd: 8, points: 41, goalsFor: 44, goalsAgainst: 36, cleanSheets: 5 },
    { position: 5, team: "Chelsea", played: 24, won: 11, drawn: 7, lost: 6, gd: 15, points: 40, goalsFor: 42, goalsAgainst: 27, cleanSheets: 4 },
    { position: 6, team: "Liverpool", played: 24, won: 11, drawn: 6, lost: 7, gd: 6, points: 39, goalsFor: 39, goalsAgainst: 33, cleanSheets: 4 },
    { position: 7, team: "Brentford", played: 24, won: 11, drawn: 3, lost: 10, gd: 4, points: 36, goalsFor: 36, goalsAgainst: 32, cleanSheets: 3 },
    { position: 8, team: "Sunderland", played: 24, won: 9, drawn: 9, lost: 6, gd: 1, points: 36, goalsFor: 27, goalsAgainst: 26, cleanSheets: 3 },
    { position: 9, team: "Fulham", played: 24, won: 10, drawn: 4, lost: 10, gd: -1, points: 34, goalsFor: 34, goalsAgainst: 35, cleanSheets: 4 },
    { position: 10, team: "Everton", played: 24, won: 9, drawn: 7, lost: 8, gd: -1, points: 34, goalsFor: 26, goalsAgainst: 27, cleanSheets: 3 },
    { position: 11, team: "Newcastle", played: 24, won: 9, drawn: 6, lost: 9, gd: 0, points: 33, goalsFor: 33, goalsAgainst: 33, cleanSheets: 2 },
    { position: 12, team: "Bournemouth", played: 24, won: 8, drawn: 9, lost: 7, gd: -3, points: 33, goalsFor: 40, goalsAgainst: 43, cleanSheets: 2 },
    { position: 13, team: "Brighton", played: 24, won: 7, drawn: 10, lost: 7, gd: 2, points: 31, goalsFor: 34, goalsAgainst: 32, cleanSheets: 3 },
    { position: 14, team: "Tottenham", played: 24, won: 7, drawn: 8, lost: 9, gd: 2, points: 29, goalsFor: 35, goalsAgainst: 33, cleanSheets: 2 },
    { position: 15, team: "Crystal Palace", played: 24, won: 7, drawn: 8, lost: 9, gd: -4, points: 29, goalsFor: 25, goalsAgainst: 29, cleanSheets: 1 },
    { position: 16, team: "Leeds United", played: 24, won: 6, drawn: 8, lost: 10, gd: -11, points: 26, goalsFor: 31, goalsAgainst: 42, cleanSheets: 2 },
    { position: 17, team: "Nottm Forest", played: 24, won: 7, drawn: 5, lost: 12, gd: -11, points: 26, goalsFor: 24, goalsAgainst: 35, cleanSheets: 1 },
    { position: 18, team: "West Ham", played: 24, won: 5, drawn: 5, lost: 14, gd: -19, points: 20, goalsFor: 29, goalsAgainst: 48, cleanSheets: 0 },
    { position: 19, team: "Burnley", played: 24, won: 3, drawn: 6, lost: 15, gd: -22, points: 15, goalsFor: 25, goalsAgainst: 47, cleanSheets: 0 },
    { position: 20, team: "Wolves", played: 24, won: 1, drawn: 5, lost: 18, gd: -30, points: 8, goalsFor: 15, goalsAgainst: 45, cleanSheets: 0 }
  ],
  fixtures: [
    { id: "1", homeTeam: "Arsenal", awayTeam: "Man City", date: "2025-02-02", status: "finished", score: "2-2", gameweek: 26 },
    { id: "2", homeTeam: "Liverpool", awayTeam: "Chelsea", date: "2025-02-02", status: "finished", score: "1-1", gameweek: 26 },
    { id: "3", homeTeam: "Man United", awayTeam: "Tottenham", date: "2025-02-02", status: "finished", score: "2-1", gameweek: 26 },
    { id: "4", homeTeam: "Aston Villa", awayTeam: "Brentford", date: "2025-02-03", status: "upcoming", gameweek: 27 },
    { id: "5", homeTeam: "Newcastle", awayTeam: "West Ham", date: "2025-02-03", status: "upcoming", gameweek: 27 }
  ],
  news: NEWS_ITEMS,
  scorers: [...ELITE_TRIO, ...MORE_TALENT],
  matchStats: RECENT_MATCHES,
  weeklyTip: "GW27 Tip: Watch out for relegation battle - 6 teams separated by 6 points!",
  sackRace: [
    { manager: "Gary O'Neil", team: "Wolves", temperature: 98, gafferVerdict: "On borrowed time", nextManager: "Graham Potter", odds: "1/4" },
    { manager: "Scott Parker", team: "Burnley", temperature: 85, gafferVerdict: "Pressure mounting", nextManager: "Steve Cooper", odds: "2/1" },
    { manager: "Julen Lopetegui", team: "West Ham", temperature: 75, gafferVerdict: "Needs results soon", nextManager: "David Moyes", odds: "3/1" }
  ]
};