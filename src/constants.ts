
import { Fact, Player, NavLink, MatchStats, NewsItem, AppData, SackRaceEntry } from '../types';

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
  // Primary navigation - core FPL features
  { id: 'league-table', label: 'Table', icon: 'fa-table' },
  { id: 'fixtures', label: 'Fixtures', icon: 'fa-calendar-alt' },
  { id: 'captain-picks', label: 'Captain', icon: 'fa-crown' },
  { id: 'price-tracker', label: 'Prices', icon: 'fa-chart-line' },
  { id: 'player-database', label: 'Players', icon: 'fa-users' },
  
  // Secondary navigation - advanced features
  { id: 'squad-builder', label: 'Squad', icon: 'fa-tshirt' },
  { id: 'player-comparison', label: 'Compare', icon: 'fa-balance-scale' },
  { id: 'live-points', label: 'Live', icon: 'fa-bolt' },
  { id: 'advanced-stats', label: 'Advanced', icon: 'fa-chart-bar' },
  
  // Interactive features
  { id: 'beat-the-gaffer', label: 'Beat Gaffer', icon: 'fa-gamepad' },
  { id: 'newsletter', label: 'Newsletter', icon: 'fa-envelope' },
  
  // Analysis & Insights
  { id: 'gaffers-gut', label: "Gaffer's Gut", icon: 'fa-brain' },
  { id: 'sack-race', label: 'Sack Race', icon: 'fa-fire' },
  { id: 'golden-boot', label: 'Golden Boot', icon: 'fa-futbol' },
  { id: 'stats-embed', label: 'Stats', icon: 'fa-chart-pie' },
  
  // Support & Help
  { id: 'support', label: 'Support', icon: 'fa-life-ring' },
];

export const GAFFER_VERDICTS = {
  BORE_DRAW: [
    "About as exciting as watching paint dry. I want a refund.",
    "Nil-nil. A scoreline that makes you question your life choices.",
    "Neither keeper had to wash their kit after this one.",
    "Two teams terrified of losing. A cure for insomnia.",
    "Ideally, I'd ask for a refund, but I got in for free."
  ],
  GOAL_FEST: [
    "Defending? Never heard of it. Absolute chaos at the back.",
    "Entertaining for the neutrals, a heart attack for the dugout.",
    "Schoolboy defending meets world-class finishing.",
    "If you like goals, you're happy. If you like clean sheets, look away.",
    "Keepers might as well have brought deckchairs."
  ],
  SMASH_GRAB: [ 
    "Proper performance. Parked the bus and smashed 'em on the break.",
    "They can keep the ball, we'll take the three points. Simple as.",
    "Possession stats don't win games, goals do. Lesson learned.",
    "Soaked up the pressure like a sponge. Classic away day.",
    "Ugly win? No such thing. It's just a win."
  ],
  TIPPY_TAPPY: [ 
    "Passed it to death and got nothing. Tippy-tappy rubbish.",
    "All gear, no idea. 70% possession and zero threat.",
    "Pretty patterns, but no punch. Typical modern football.",
    "Passed it sideways more times than a crab on holiday.",
    "Possession is vanity. Points are sanity."
  ],
  WASTEFUL: [ 
    "Couldn't hit a cow's backside with a banjo today.",
    "Barn door safe from that lot.",
    "All the build-up, none of the finish. Frustrating.",
    "Left their shooting boots on the bus.",
    "Keeper had a blinder, or the strikers had a nightmare. Bit of both."
  ],
  GENERIC: [
    "A proper battle in the midfield. Honest work, hard tackles.",
    "Left it all on the pitch. That's all you can ask for.",
    "Blood, sweat, and yellow cards. Proper football.",
    "A game of two halves, and both of them were lively.",
    "End to end stuff. Good for the fans, bad for the blood pressure."
  ]
};

// Unofficial / Custom Logos (Using Empty Strings to trigger TeamIcon fallback)
export const TEAM_LOGOS: Record<string, string> = {
  "Arsenal": "", "Aston Villa": "", "Bournemouth": "", "Brentford": "", "Brighton": "",
  "Chelsea": "", "Crystal Palace": "", "Everton": "", "Fulham": "", "Ipswich": "",
  "Leicester": "", "Liverpool": "", "Man City": "", "Man Utd": "", "Newcastle": "",
  "Nottingham Forest": "", "Southampton": "", "Spurs": "", "West Ham": "", "Wolves": ""
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

// DATA SECTIONS

export const NEWS_ITEMS: NewsItem[] = [
  { id: 1, title: "Salah signs contract extension", summary: "Mohamed Salah puts speculation to bed by signing a new deal.", image: NEWS_IMAGES[0], source: "Liverpool FC", url: "#", time: "2h ago" },
  { id: 2, title: "Amorim's United revolution", summary: "New Manchester United boss Ruben Amorim implements his 3-4-3 system.", image: NEWS_IMAGES[1], source: "Man Utd", url: "#", time: "4h ago" },
  { id: 3, title: "Haaland injury scare", summary: "Man City monitoring Erling Haaland after training knock.", image: NEWS_IMAGES[2], source: "Man City", url: "#", time: "5h ago" },
  { id: 4, title: "Chelsea's Palmer on fire", summary: "Cole Palmer continues his incredible form.", image: NEWS_IMAGES[4], source: "Chelsea FC", url: "#", time: "7h ago" },
  { id: 5, title: "Forest European dream", summary: "Nuno has Nottingham Forest dreaming of Europe.", image: NEWS_IMAGES[5], source: "Sky Sports", url: "#", time: "8h ago" }
];

export const RECENT_MATCHES: MatchStats[] = [
  { id: 1, homeTeam: "Liverpool", awayTeam: "Man City", score: "2 - 0", date: "01-12-2024", homeScorers: ["Gakpo 12'", "Salah 78' (P)"], awayScorers: [], possession: { home: 45, away: 55 }, shots: { home: 14, away: 10 }, shotsOnTarget: { home: 7, away: 2 } },
  { id: 2, homeTeam: "Arsenal", awayTeam: "Man Utd", score: "2 - 0", date: "04-12-2024", homeScorers: ["Timber 54'", "Saliba 73'"], awayScorers: [], possession: { home: 55, away: 45 }, shots: { home: 18, away: 5 }, shotsOnTarget: { home: 8, away: 1 } },
  { id: 3, homeTeam: "Chelsea", awayTeam: "Aston Villa", score: "3 - 0", date: "01-12-2024", homeScorers: ["Jackson 7'", "Fernandez 36'", "Palmer 83'"], awayScorers: [], possession: { home: 58, away: 42 }, shots: { home: 16, away: 8 }, shotsOnTarget: { home: 9, away: 3 } }
];

// Top Scorers Data
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
    image: "",
    rank: 'gold',
    goalTiming: {
      '0-15': 2, '16-30': 3, '31-45': 3, '46-60': 4, '61-75': 2, '76-90+': 2
    }
  },
  {
    name: "Mohamed Salah",
    team: "Liverpool",
    goals: 14,
    penalties: 2,
    homeGoals: 8,
    awayGoals: 6,
    assists: 5,
    boots: "Adidas Predator 24",
    price: "£200 - £230",
    link: "https://www.amazon.co.uk/s?k=Adidas+Predator+24&tag=premierleaguetables-21",
    image: "",
    rank: 'silver',
    goalTiming: {
      '0-15': 3, '16-30': 2, '31-45': 4, '46-60': 3, '61-75': 1, '76-90+': 1
    }
  },
  {
    name: "Cole Palmer",
    team: "Chelsea",
    goals: 12,
    penalties: 4,
    homeGoals: 6,
    awayGoals: 6,
    assists: 6,
    boots: "Nike Mercurial Vapor 16",
    price: "£180 - £210",
    link: "https://www.amazon.co.uk/s?k=Nike+Mercurial+Vapor+16&tag=premierleaguetables-21",
    image: "",
    rank: 'bronze',
    goalTiming: {
      '0-15': 1, '16-30': 2, '31-45': 3, '46-60': 3, '61-75': 2, '76-90+': 1
    }
  }
];

export const MORE_TALENT: Player[] = [
  {
    name: "Bukayo Saka",
    team: "Arsenal",
    goals: 10,
    penalties: 1,
    homeGoals: 5,
    awayGoals: 5,
    assists: 8,
    boots: "Nike Mercurial Superfly 9",
    price: "£160 - £190",
    link: "https://www.amazon.co.uk/s?k=Nike+Mercurial+Superfly+9&tag=premierleaguetables-21",
    image: "",
    rank: 'silver',
    goalTiming: {
      '0-15': 2, '16-30': 2, '31-45': 2, '46-60': 2, '61-75': 1, '76-90+': 1
    }
  },
  {
    name: "Alexander Isak",
    team: "Newcastle",
    goals: 9,
    penalties: 0,
    homeGoals: 5,
    awayGoals: 4,
    assists: 2,
    boots: "Adidas Copa Pure",
    price: "£140 - £170",
    link: "https://www.amazon.co.uk/s?k=Adidas+Copa+Pure&tag=premierleaguetables-21",
    image: "",
    rank: 'silver',
    goalTiming: {
      '0-15': 1, '16-30': 2, '31-45': 2, '46-60': 2, '61-75': 1, '76-90+': 1
    }
  }
];

export const MODAL_CONTENT: Record<string, string> = {

  about: `
    <h3 class="text-xl font-bold mb-4 text-primary dark:text-white font-heading uppercase tracking-widest">
      <i class="fas fa-futbol mr-2 text-accent"></i> The Gaffer's Manifesto
    </h3>
    <p class="mb-3 text-slate-700 dark:text-slate-300 italic border-l-4 border-accent pl-4">
      "We don't care about Expected Goals unless they result in the ball hitting the back of the net."
    </p>
    <p class="mb-3 text-slate-700 dark:text-slate-300">
      <strong>PremierLeagueTables.com</strong> is a fan-built project by a one-person dev team who runs on pies, strong opinions, and an unhealthy obsession with the Premier League.
    </p>
    <p class="mb-3 text-slate-700 dark:text-slate-300">
      We built this because every other stats site looks like a tax return. The Gaffer believes football data should be <strong>fast, beautiful, and have a bit of personality</strong> — like a well-timed Cruyff turn.
    </p>
    <h4 class="font-bold text-sm uppercase tracking-wider text-slate-500 dark:text-slate-400 mt-5 mb-2">What We Do</h4>
    <ul class="space-y-1.5 text-slate-700 dark:text-slate-300 text-sm mb-4">
      <li>⚽ Live league tables, fixtures & injury tracking</li>
      <li>📊 Match stats with the Gaffer's Verdict</li>
      <li>🧠 Win probability predictions (the Gaffer's Gut)</li>
      <li>🏗️ Fantasy squad builder with budget management</li>
      <li>🎯 Beat the Gaffer prediction game</li>
      <li>📰 Weekly newsletter with insights & banter</li>
    </ul>
    <h4 class="font-bold text-sm uppercase tracking-wider text-slate-500 dark:text-slate-400 mt-5 mb-2">The Small Print</h4>
    <p class="text-xs text-slate-500 dark:text-slate-400">
      This site is an independent fan project. We are <strong>not</strong> affiliated with, endorsed by, or connected to the Premier League, the Football Association, or any football club. All club names, logos, and trademarks belong to their respective owners. Data is sourced from publicly available APIs and may not always be 100% accurate. The Gaffer's opinions, however, are always 100% correct.
    </p>
  `,

  privacy: `
    <h3 class="text-xl font-bold mb-4 text-primary dark:text-white font-heading uppercase tracking-widest">
      <i class="fas fa-user-secret mr-2 text-accent"></i> Privacy Policy
    </h3>
    <p class="mb-3 text-slate-700 dark:text-slate-300 italic border-l-4 border-accent pl-4">
      "I can barely track my own left-back, never mind tracking you lot."
    </p>
    <p class="mb-3 text-slate-700 dark:text-slate-300 text-sm">
      <strong>Effective Date:</strong> February 2026 &nbsp;|&nbsp; <strong>Last Updated:</strong> February 2026
    </p>

    <h4 class="font-bold text-sm uppercase tracking-wider text-slate-500 dark:text-slate-400 mt-5 mb-2">1. What We Collect</h4>
    <p class="mb-2 text-slate-700 dark:text-slate-300 text-sm">We keep it minimal — like a 1-0 away win:</p>
    <ul class="space-y-1 text-slate-700 dark:text-slate-300 text-sm mb-3">
      <li>• <strong>Analytics data</strong> — anonymous page views, button clicks, and feature usage to understand what's working</li>
      <li>• <strong>Email address</strong> — only if you sign up for the newsletter (we won't spam you, promise)</li>
      <li>• <strong>Cookies</strong> — essential cookies for site functionality and analytics (you'll see our cookie consent banner)</li>
      <li>• <strong>Local storage</strong> — your squad builder data, dark mode preference, and prediction history stay on YOUR device</li>
    </ul>

    <h4 class="font-bold text-sm uppercase tracking-wider text-slate-500 dark:text-slate-400 mt-5 mb-2">2. What We Don't Collect</h4>
    <ul class="space-y-1 text-slate-700 dark:text-slate-300 text-sm mb-3">
      <li>• We do NOT sell your data. Ever. Not even for a pie.</li>
      <li>• We do NOT share your email with third parties</li>
      <li>• We do NOT use invasive fingerprinting or tracking pixels</li>
    </ul>

    <h4 class="font-bold text-sm uppercase tracking-wider text-slate-500 dark:text-slate-400 mt-5 mb-2">3. Third-Party Services</h4>
    <p class="mb-2 text-slate-700 dark:text-slate-300 text-sm">We use the following services which have their own privacy policies:</p>
    <ul class="space-y-1 text-slate-700 dark:text-slate-300 text-sm mb-3">
      <li>• <strong>Analytics</strong> — for anonymous usage statistics</li>
      <li>• <strong>Stripe</strong> — for secure payment processing (we never see your card details)</li>
      <li>• <strong>Ko-fi</strong> — for voluntary donations</li>
    </ul>

    <h4 class="font-bold text-sm uppercase tracking-wider text-slate-500 dark:text-slate-400 mt-5 mb-2">4. Affiliate Links</h4>
    <p class="mb-2 text-slate-700 dark:text-slate-300 text-sm">
      Some links on this site are affiliate links. If you click through and make a purchase, we may earn a small commission at no extra cost to you. We only recommend products and services we genuinely believe in. All affiliate relationships are clearly disclosed in compliance with FTC and UK ASA guidelines.
    </p>

    <h4 class="font-bold text-sm uppercase tracking-wider text-slate-500 dark:text-slate-400 mt-5 mb-2">5. Your Rights (GDPR / UK Data Protection Act 2018)</h4>
    <p class="mb-2 text-slate-700 dark:text-slate-300 text-sm">You have the right to:</p>
    <ul class="space-y-1 text-slate-700 dark:text-slate-300 text-sm mb-3">
      <li>• Access the personal data we hold about you</li>
      <li>• Request deletion of your data</li>
      <li>• Withdraw consent at any time (e.g. unsubscribe from newsletter)</li>
      <li>• Lodge a complaint with the ICO (ico.org.uk) if you're unhappy</li>
    </ul>

    <h4 class="font-bold text-sm uppercase tracking-wider text-slate-500 dark:text-slate-400 mt-5 mb-2">6. Contact</h4>
    <p class="text-slate-700 dark:text-slate-300 text-sm">
      Questions? Email us: <a href="mailto:info@premierleaguetables.com" class="text-accent hover:underline font-bold">info@premierleaguetables.com</a>
    </p>
  `,

  terms: `
    <h3 class="text-xl font-bold mb-4 text-primary dark:text-white font-heading uppercase tracking-widest">
      <i class="fas fa-gavel mr-2 text-accent"></i> Terms of Service
    </h3>
    <p class="mb-3 text-slate-700 dark:text-slate-300 italic border-l-4 border-accent pl-4">
      "Rule #1: The Gaffer is always right. Rule #2: When in doubt, refer to Rule #1."
    </p>
    <p class="mb-3 text-slate-700 dark:text-slate-300 text-sm">
      <strong>Effective Date:</strong> February 2026 &nbsp;|&nbsp; By using PremierLeagueTables.com you agree to these terms.
    </p>

    <h4 class="font-bold text-sm uppercase tracking-wider text-slate-500 dark:text-slate-400 mt-5 mb-2">1. The Basics</h4>
    <ul class="space-y-1 text-slate-700 dark:text-slate-300 text-sm mb-3">
      <li>• This site is provided "as is" — we do our best, but we're a one-person operation fuelled by pies</li>
      <li>• Content is for entertainment and informational purposes only</li>
      <li>• We reserve the right to update, modify, or remove content at any time</li>
    </ul>

    <h4 class="font-bold text-sm uppercase tracking-wider text-slate-500 dark:text-slate-400 mt-5 mb-2">2. Not Financial or Betting Advice</h4>
    <p class="mb-2 text-slate-700 dark:text-slate-300 text-sm">
      <strong>This is crucial:</strong> Nothing on this site constitutes financial advice, betting advice, or a recommendation to gamble. Our predictions (the Gaffer's Gut, Beat the Gaffer, etc.) are for entertainment only. If you choose to bet based on anything you see here, that's entirely your decision and your responsibility. Please gamble responsibly. If you need help, visit <strong>BeGambleAware.org</strong> or call the National Gambling Helpline: <strong>0808 8020 133</strong>.
    </p>

    <h4 class="font-bold text-sm uppercase tracking-wider text-slate-500 dark:text-slate-400 mt-5 mb-2">3. Intellectual Property</h4>
    <ul class="space-y-1 text-slate-700 dark:text-slate-300 text-sm mb-3">
      <li>• Original content, design, and the "Gaffer" brand are © PremierLeagueTables.com</li>
      <li>• Premier League, club names, and logos are trademarks of their respective owners</li>
      <li>• You may share snapshots from our tools with attribution — that's what they're for</li>
    </ul>

    <h4 class="font-bold text-sm uppercase tracking-wider text-slate-500 dark:text-slate-400 mt-5 mb-2">4. User Conduct</h4>
    <ul class="space-y-1 text-slate-700 dark:text-slate-300 text-sm mb-3">
      <li>• Don't scrape, bot, or abuse the site</li>
      <li>• Don't use our tools to harass, spam, or mislead others</li>
      <li>• Play fair — just like the Gaffer expects on the pitch</li>
    </ul>

    <h4 class="font-bold text-sm uppercase tracking-wider text-slate-500 dark:text-slate-400 mt-5 mb-2">5. Limitation of Liability</h4>
    <p class="mb-2 text-slate-700 dark:text-slate-300 text-sm">
      We are not liable for any losses, damages, or disappointment arising from the use of this site — including but not limited to: incorrect data, server downtime, your team getting relegated, or the Gaffer's predictions being wrong (rare, but it happens).
    </p>

    <h4 class="font-bold text-sm uppercase tracking-wider text-slate-500 dark:text-slate-400 mt-5 mb-2">6. Paid Subscriptions</h4>
    <p class="mb-2 text-slate-700 dark:text-slate-300 text-sm">
      If you subscribe to a paid tier: payments are processed securely via Stripe. You can cancel at any time. Refunds are handled on a case-by-case basis — just email us and we'll sort it out like adults.
    </p>

    <h4 class="font-bold text-sm uppercase tracking-wider text-slate-500 dark:text-slate-400 mt-5 mb-2">7. Governing Law</h4>
    <p class="text-slate-700 dark:text-slate-300 text-sm">
      These terms are governed by the laws of England and Wales. Any disputes will be subject to the exclusive jurisdiction of the English courts. Or a penalty shootout. Whichever comes first.
    </p>
  `,

  contact: `
    <h3 class="text-xl font-bold mb-4 text-primary dark:text-white font-heading uppercase tracking-widest">
      <i class="fas fa-bullhorn mr-2 text-accent"></i> Get in Touch
    </h3>
    <p class="mb-4 text-slate-700 dark:text-slate-300 italic border-l-4 border-accent pl-4">
      "My door's always open — unless we've just lost, in which case give me 20 minutes and a pie."
    </p>

    <div class="space-y-4">
      <div class="bg-slate-50 dark:bg-slate-700/30 rounded-xl p-4">
        <h4 class="font-bold text-sm uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">📧 General Enquiries</h4>
        <a href="mailto:info@premierleaguetables.com" class="text-accent hover:underline font-bold text-sm">info@premierleaguetables.com</a>
        <p class="text-xs text-slate-500 dark:text-slate-400 mt-1">Questions, feedback, feature requests, or just want to tell us your team's better than ours</p>
      </div>

      <div class="bg-slate-50 dark:bg-slate-700/30 rounded-xl p-4">
        <h4 class="font-bold text-sm uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">🤝 Partnerships & Advertising</h4>
        <a href="mailto:info@premierleaguetables.com" class="text-accent hover:underline font-bold text-sm">info@premierleaguetables.com</a>
        <p class="text-xs text-slate-500 dark:text-slate-400 mt-1">Sponsorships, affiliate partnerships, or brand collaborations</p>
      </div>

      <div class="bg-slate-50 dark:bg-slate-700/30 rounded-xl p-4">
        <h4 class="font-bold text-sm uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">🐛 Bug Reports & Technical</h4>
        <a href="mailto:info@premierleaguetables.com" class="text-accent hover:underline font-bold text-sm">info@premierleaguetables.com</a>
        <p class="text-xs text-slate-500 dark:text-slate-400 mt-1">Found a bug? Something broken? Let us know and we'll get the backroom staff on it</p>
      </div>

      <div class="bg-slate-50 dark:bg-slate-700/30 rounded-xl p-4">
        <h4 class="font-bold text-sm uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">🐦 Social</h4>
        <a href="https://x.com/thegafferEPL" target="_blank" rel="noopener noreferrer" class="text-accent hover:underline font-bold text-sm">@thegafferEPL on X</a>
        <p class="text-xs text-slate-500 dark:text-slate-400 mt-1">Follow for match day banter, stats, and the Gaffer's hot takes</p>
      </div>
    </div>

    <p class="mt-5 text-xs text-slate-500 dark:text-slate-400">
      We aim to respond within 48 hours. If it's match day, give us a bit longer — priorities, lads.
    </p>
  `

};

export const getTeamLogo = (teamName: string): string | null => {
  // Use empty string to trigger CSS fallback for all teams
  return ""; 
};

// ROBUST FALLBACK DATA FOR OFFLINE / INITIAL LOAD
// Must include valid 'upcoming' fixtures for WeatherCentre to work
export const FALLBACK_DATA: AppData = {
  lastUpdated: Date.now(),
  currentGameweek: 15,
  weeklyTip: "The festive period is crucial. Rotation will be key. Watch out for teams with deep squads.",
  table: [
     { position: 1, team: "Liverpool", played: 14, won: 11, drawn: 2, lost: 1, gd: 21, points: 35, form: ["W", "W", "W", "W", "W"] },
     { position: 2, team: "Chelsea", played: 14, won: 8, drawn: 4, lost: 2, gd: 14, points: 28, form: ["D", "W", "D", "W", "W"] },
     { position: 3, team: "Arsenal", played: 14, won: 8, drawn: 4, lost: 2, gd: 12, points: 28, form: ["L", "D", "W", "W", "W"] },
     { position: 4, team: "Man City", played: 14, won: 8, drawn: 2, lost: 4, gd: 10, points: 26, form: ["L", "L", "L", "D", "L"] },
     { position: 5, team: "Brighton", played: 14, won: 6, drawn: 5, lost: 3, gd: 6, points: 23, form: ["W", "D", "W", "L", "D"] },
     { position: 6, team: "Nottingham Forest", played: 14, won: 6, drawn: 4, lost: 4, gd: 4, points: 22, form: ["W", "L", "L", "W", "L"] },
     { position: 7, team: "Spurs", played: 14, won: 6, drawn: 2, lost: 6, gd: 8, points: 20, form: ["L", "W", "L", "W", "D"] },
     { position: 8, team: "Brentford", played: 14, won: 6, drawn: 2, lost: 6, gd: 2, points: 20, form: ["W", "L", "W", "D", "W"] },
     { position: 9, team: "Aston Villa", played: 14, won: 5, drawn: 4, lost: 5, gd: -1, points: 19, form: ["L", "L", "D", "L", "W"] },
     { position: 10, team: "Newcastle", played: 14, won: 5, drawn: 4, lost: 5, gd: 0, points: 19, form: ["W", "L", "D", "L", "D"] },
     { position: 11, team: "Fulham", played: 14, won: 5, drawn: 4, lost: 5, gd: 1, points: 19, form: ["D", "W", "L", "D", "D"] },
     { position: 12, team: "Bournemouth", played: 14, won: 5, drawn: 3, lost: 6, gd: -2, points: 18, form: ["W", "L", "W", "L", "W"] },
     { position: 13, team: "Man Utd", played: 14, won: 4, drawn: 4, lost: 6, gd: -3, points: 16, form: ["D", "W", "D", "W", "L"] },
     { position: 14, team: "West Ham", played: 14, won: 4, drawn: 3, lost: 7, gd: -8, points: 15, form: ["W", "L", "D", "W", "L"] },
     { position: 15, team: "Everton", played: 14, won: 2, drawn: 5, lost: 7, gd: -10, points: 11, form: ["D", "D", "L", "D", "L"] },
     { position: 16, team: "Leicester", played: 14, won: 2, drawn: 4, lost: 8, gd: -12, points: 10, form: ["L", "L", "D", "L", "W"] },
     { position: 17, team: "Crystal Palace", played: 14, won: 1, drawn: 6, lost: 7, gd: -10, points: 9, form: ["D", "L", "D", "W", "D"] },
     { position: 18, team: "Ipswich", played: 14, won: 1, drawn: 6, lost: 7, gd: -14, points: 9, form: ["L", "W", "D", "L", "L"] },
     { position: 19, team: "Wolves", played: 14, won: 2, drawn: 3, lost: 9, gd: -15, points: 9, form: ["W", "W", "L", "L", "D"] },
     { position: 20, team: "Southampton", played: 14, won: 1, drawn: 2, lost: 11, gd: -18, points: 5, form: ["L", "L", "L", "D", "L"] }
  ],
  fixtures: [
     { id: "1", homeTeam: "Everton", awayTeam: "Liverpool", time: "12:30", date: "Saturday 14 Dec", score: "", status: "upcoming", gameweek: 16, venue: "Goodison Park", referee: "Michael Oliver", difficulty: { overall: 5, att: 5, def: 5 } },
     { id: "2", homeTeam: "Aston Villa", awayTeam: "Nott'm Forest", time: "15:00", date: "Saturday 14 Dec", score: "", status: "upcoming", gameweek: 16, venue: "Villa Park", referee: "Anthony Taylor", difficulty: { overall: 2, att: 2, def: 2 } },
     { id: "3", homeTeam: "Brentford", awayTeam: "Newcastle", time: "15:00", date: "Saturday 14 Dec", score: "", status: "upcoming", gameweek: 16, venue: "Gtech Community Stadium", referee: "Simon Hooper", difficulty: { overall: 3, att: 3, def: 3 } },
     { id: "4", homeTeam: "Crystal Palace", awayTeam: "Brighton", time: "15:00", date: "Saturday 14 Dec", score: "", status: "upcoming", gameweek: 16, venue: "Selhurst Park", referee: "Robert Jones", difficulty: { overall: 3, att: 3, def: 3 } },
     { id: "5", homeTeam: "Man City", awayTeam: "Man Utd", time: "16:30", date: "Sunday 15 Dec", score: "", status: "upcoming", gameweek: 16, venue: "Etihad Stadium", referee: "Michael Oliver", difficulty: { overall: 4, att: 4, def: 4 } }
  ],
  news: NEWS_ITEMS,
  scorers: [...ELITE_TRIO, ...MORE_TALENT],
  matchStats: RECENT_MATCHES,
  sackRace: [
    { manager: "Julen Lopetegui", team: "West Ham", temperature: 85, gafferVerdict: "Fans are turning.", nextManager: "Potter", odds: "2/1" },
    { manager: "Gary O'Neil", team: "Wolves", temperature: 75, gafferVerdict: "Relegation zone battle.", nextManager: "Moyes", odds: "4/1" },
    { manager: "Oliver Glasner", team: "Crystal Palace", temperature: 65, gafferVerdict: "Second season syndrome.", nextManager: "Southgate", odds: "6/1" },
    { manager: "Russell Martin", team: "Southampton", temperature: 90, gafferVerdict: "Nice football, no points.", nextManager: "Cooper", odds: "Evens" },
    { manager: "Ange Postecoglou", team: "Spurs", temperature: 40, gafferVerdict: "Inconsistent.", nextManager: "Frank", odds: "25/1" }
  ]
};


