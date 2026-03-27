import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faTrash, faEdit, faSave, faTimes, faCopy, faDownload, faUpload, faEye, faChartBar, faBolt, faShieldAlt, faCrown, faUsers, faEnvelope, faCalendarAlt, faNewspaper, faPalette, faMagic, faCog, faCheck, faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';
import DOMPurify from 'dompurify';
import { authService, User } from '../services/auth';

// Enhanced interfaces for new newsletter types
interface NewsletterSection {
  id: string;
  type: 'welcome' | 'weekly_intro' | 'buy_sell_hold' | 'bargains' | 'team_analysis' | 'model_xi' | 'risk_ratings' | 'price_watch' | 'watchlist' | 'fixture_difficulty' | 'gut_pick' | 'league_positions' | 'upcoming_fixtures' | 'site_highlights' | 'premium_teaser';
  title: string;
  content: any;
  enabled: boolean;
  tier: 'welcome' | 'firstTeam' | 'seasonPass';
}

interface NewsletterTemplate {
  id: string;
  name: string;
  tier: 'welcome' | 'firstTeam' | 'seasonPass';
  subject: string;
  sections: NewsletterSection[];
  gameWeek: number;
}

// New content types
interface BuySellHold {
  player: string;
  action: 'BUY' | 'SELL' | 'HOLD';
  reason: string;
  price: number;
  nextFixture: string;
  formRating: number;
}

interface ModelXI {
  formation: string;
  goalkeeper: PlayerPick;
  defenders: PlayerPick[];
  midfielders: PlayerPick[];
  forwards: PlayerPick[];
  captain: PlayerPick;
  viceCaptain: PlayerPick;
  bench: PlayerPick[];
  totalCost: number;
  reasoning: string;
  riskRating: 'LOW' | 'MEDIUM' | 'HIGH';
  expectedPoints: number;
}

interface PlayerPick {
  player: string;
  team: string;
  position: string;
  price: number;
  form: number;
  fixtures: string[];
  reasoning: string;
  confidence: number;
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH';
}

interface RiskRating {
  category: 'TRANSFER' | 'CAPTAINCY' | 'DIFFERENTIAL' | 'BUDGET';
  player: string;
  riskLevel: 1 | 2 | 3 | 4 | 5;
  riskFactors: string[];
  potentialReward: string;
  gafferConfidence: number;
  recommendation: 'STRONG_BUY' | 'BUY' | 'CONSIDER' | 'AVOID' | 'STRONG_AVOID';
}

// Safe text rendering function
const renderInsightText = (insight: string) => {
  // Replace markdown **bold** with HTML strong tags safely
  const processedText = insight.replace(/\*\*(.*?)\*\*/g, '<strong class="text-red-600">$1</strong>');
  return DOMPurify.sanitize(processedText);
};

const SimpleNewsletterEditor: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [newsletterType, setNewsletterType] = useState<'welcome' | 'firstTeam' | 'seasonPass'>('firstTeam');
  const [currentTemplate, setCurrentTemplate] = useState<NewsletterTemplate | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [activeView, setActiveView] = useState<'editor' | 'preview'>('editor');
  const [isGenerating, setIsGenerating] = useState(false);
  const [currentGameWeek, setCurrentGameWeek] = useState(20);

  useEffect(() => {
    const user = authService.getCurrentUser();
    if (user && user.email === 'admin@premierleaguehub.com') {
      setCurrentUser(user);
    }
  }, []);

  const generateGafferisms = () => {
  const firstTeamGafferisms = [
    "Look, at the end of the day, it's about results. Pretty football means nothing if you're not picking up three points.",
    "Form is temporary, but class is permanent. Remember that when you're making your transfers.",
    "The data doesn't lie, but sometimes it doesn't tell the whole story. That's why you need The Gaffer's insight.",
    "Nobody wins the league in August, but you can certainly lose it. Keep your head up.",
    "Football is simple, but playing simple football is the hardest thing in the world.",
    "The table doesn't lie. After 10 games, you are where you deserve to be.",
    "Attack wins you games, defense wins you titles. Simple as that.",
    "Every game is a cup final now. No easy fixtures in this league.",
    "The fans deserve better. Simple as that.",
    "We take it one game at a time. The rest takes care of itself."
  ];

  const seasonPassGafferisms = [
    "The numbers never lie, but they don't tell the whole story. That's why you pay attention to The Gaffer.",
    "In the war room, we don't guess. We calculate. Every percentage point matters.",
    "The difference between good and great is attention to detail. That's what separates the premium lot.",
    "When you have the data, you have the power. Use it wisely.",
    "The algorithm is only as good as the manager interpreting it. That's where I come in.",
    "In this business, if you're standing still, you're going backwards. Always be analyzing.",
    "The smart money knows that the margins are razor thin. Every decision counts.",
    "Behind every number is a story. My job is to tell you which ones matter.",
    "The data gives you the what, The Gaffer gives you the why.",
    "Premium insights for premium results. That's the Season Pass promise."
  ];

  return {
    firstTeam: firstTeamGafferisms[Math.floor(Math.random() * firstTeamGafferisms.length)],
    seasonPass: seasonPassGafferisms[Math.floor(Math.random() * seasonPassGafferisms.length)]
  };
};

const createFirstTeamTemplate = (): NewsletterTemplate => {
  const gafferisms = generateGafferisms();
  
  return {
    id: 'first-team-template',
    name: "The Gaffer's Weekly Briefing",
    tier: 'firstTeam',
    subject: "🏆 The Gaffer's Weekly Briefing - No-BS PL Analysis",
    sections: [
      {
        id: 'header',
        type: 'header',
        title: "The Gaffer's Weekly Briefing",
        content: { 
          title: "The Gaffer's Weekly Briefing", 
          subtitle: "No-nonsense Premier League analysis"
        },
        enabled: true
      },
      {
        id: 'gafferTake',
        type: 'premium',
        title: "The Gaffer's Take",
        content: {
          insights: [
            "🎯 **City's machine keeps rolling** - Guardiola has them playing like a well-oiled machine. The question isn't if they'll win, but by how many.",
            "⚽ **Liverpool's attack is relentless** - Salah and Nunez are causing chaos for defenses. But can their defense hold up under pressure?",
            "🔥 **Arsenal are the real deal** - Arteta has built something special. They're not just pretty football anymore, they're winners.",
            "📊 **Man Utd's inconsistency is worrying** - One week they look like world beaters, the next they can't beat a Championship side.",
            "🎲 **Tottenham in transition** - Postecoglou is building something, but it's going to take time. Don't expect miracles this season."
          ],
          gafferQuote: gafferisms.firstTeam
        },
        enabled: true
      },
      {
        id: 'playerForm',
        type: 'premium',
        title: "Player Form Highlights",
        content: {
          onForm: [
            { player: "Erling Haaland", team: "Man City", stat: "xG: 0.85 per 90", comment: "Back to his ruthless best" },
            { player: "Mohamed Salah", team: "Liverpool", stat: "xA: 0.42 per 90", comment: "Creating chances for fun" },
            { player: "Bukayo Saka", team: "Arsenal", stat: "xGI: 1.2 per 90", comment: "Arsenal's main man" }
          ],
          underperforming: [
            { player: "Marcus Rashford", team: "Man Utd", stat: "xG: 0.32 vs 0.58 actual", comment: "Not finding his finishing boots" },
            { player: "James Maddison", team: "Tottenham", stat: "xA: 0.18 vs 0.35 expected", comment: "Creative output down" },
            { player: "Kai Havertz", team: "Arsenal", stat: "xGI: 0.45 vs 0.68 expected", comment: "Still adapting to new role" }
          ],
          differential: [
            { player: "Jarrod Bowen", team: "West Ham", stat: "Ownership: 3.8%", comment: "Fixture run looks tasty" }
          ]
        },
        enabled: true
      },
      {
        id: 'fixtureWatch',
        type: 'fixtures',
        title: "Fixture Watch",
        content: {
          favourable: [
            { team: "Man City", fixtures: "BHA (H), BRE (A), BUR (H)", difficulty: "2.1 avg", comment: "City's next three are gifts" },
            { team: "Arsenal", fixtures: "SHU (H), BUR (A), CRY (H)", difficulty: "2.3 avg", comment: "Should be picking up maximum points" },
            { team: "Liverpool", fixtures: "FUL (A), BRE (H), MCI (A)", difficulty: "2.8 avg", comment: "Tough run but manageable" }
          ]
        },
        enabled: true
      },
      {
        id: 'captaincy',
        type: 'premium',
        title: "Captaincy Confidence Meter",
        content: {
          options: [
            { player: "Erling Haaland", team: "Man City", confidence: "92%", reasoning: "Home to Brighton, in lethal form" },
            { player: "Mohamed Salah", team: "Liverpool", confidence: "85%", reasoning: "Fulham away, always involved" },
            { player: "Bukayo Saka", team: "Arsenal", confidence: "78%", reasoning: "Sheffield at home, penalty threat" }
          ]
        },
        enabled: true
      },
      {
        id: 'predictions',
        type: 'fixtures',
        title: "The Gaffer's Predictions",
        content: {
          matches: [
            { 
              homeTeam: "Man City", 
              awayTeam: "Brighton", 
              prediction: "City 3-0 Brighton",
              confidence: 88,
              reasoning: "City at home against a struggling Brighton side. No contest."
            },
            { 
              homeTeam: "Arsenal", 
              awayTeam: "Burnley", 
              prediction: "Arsenal 2-0 Burnley",
              confidence: 82,
              reasoning: "Arsenal flying, Burnley struggling. Home advantage tells."
            },
            { 
              homeTeam: "Liverpool", 
              awayTeam: "Fulham", 
              prediction: "Liverpool 2-1 Fulham",
              confidence: 75,
              reasoning: "Liverpool's attack vs Fulham's defense. Goals in this one."
            }
          ]
        },
        enabled: true
      },
      {
        id: 'powerRankings',
        type: 'leaderboard',
        title: "Community Power Rankings",
        content: { 
          players: [
            { rank: 1, username: "CityMaverick23", points: 487, accuracy: 89, comment: "Consistently backing City - smart money" },
            { rank: 2, username: "RedArmy44", points: 472, accuracy: 85, comment: "Liverpool fan with realistic expectations" },
            { rank: 3, username: "GoonerForLife", points: 451, accuracy: 82, comment: "Arsenal believer - and they're being rewarded" },
            { rank: 4, username: "GloryGlory19", points: 438, accuracy: 78, comment: "United optimist - brave soul" },
            { rank: 5, username: "SpursFaithful", points: 421, accuracy: 75, comment: "Tottenham supporter - eternal hope" }
          ]
        },
        enabled: true
      },
      {
        id: 'finalWord',
        type: 'footer',
        title: "The Gaffer's Final Word",
        content: { 
          message: "That's your lot for this week. Do your homework, trust your gut, and don't overthink it. The data gives you the what, The Gaffer gives you the why.",
          signOff: "The Gaffer"
        },
        enabled: true
      }
    ]
  };
};

const createSeasonPassTemplate = (): NewsletterTemplate => {
  const gafferisms = generateGafferisms();
  
  return {
    id: 'season-pass-template',
    name: "The Gaffer's Premium Analysis",
    tier: 'seasonPass',
    subject: "🌟 The Gaffer's Premium Analysis - Exclusive Insights",
    sections: [
      {
        id: 'header',
        type: 'header',
        title: "The Gaffer's Premium Analysis",
        content: { 
          title: "The Gaffer's Premium Analysis", 
          subtitle: "Exclusive insights for the dedicated"
        },
        enabled: true
      },
      {
        id: 'eliteBriefing',
        type: 'premium',
        title: "The Gaffer's Elite Briefing",
        content: {
          insights: [
            "🎯 **Tactical Analysis: City's Pressing Evolution** - Guardiola has tweaked the press. They're now pressing higher up the pitch, forcing turnovers in dangerous areas. xGA from turnovers up 23%.",
            "⚽ **Data Deep Dive: Liverpool's Defensive Metrics** - Liverpool's PPDA (passes per defensive action) has increased from 11.2 to 13.8, indicating less aggressive pressing. This could cost them against top teams.",
            "🔥 **Arsenal's Set-Piece Revolution** - Arsenal have scored 8 goals from set-pieces this season. xG from dead balls: 6.2 vs actual: 8. Overperforming significantly.",
            "📊 **Man Utd's Transition Issues** - United's xG from counter-attacks: 2.1 vs actual: 0.8. They're creating chances but not finishing them. Rashford's conversion rate down from 18% to 11%.",
            "🎲 **Tottenham's Postecoglou Effect** - Spurs' average possession: 62% vs 54% last season. But their xGA from high turnovers: 1.8 vs 3.2. More possession, less threat."
          ],
          gafferQuote: gafferisms.seasonPass
        },
        enabled: true
      },
      {
        id: 'transferTargets',
        type: 'premium',
        title: "Top 5 Transfer Targets",
        content: {
          targets: [
            { 
              player: "Jarrod Bowen", 
              team: "West Ham", 
              xgiTrend: "↑ 0.8 → 1.2 per 90", 
              fixtureDifficulty: "2.2 avg next 4", 
              ownership: "3.8%", 
              value: "8.2m", 
              verdict: "Fixture run is golden. xGI trending up sharply. Premium differential." 
            },
            { 
              player: "Ollie Watkins", 
              team: "Aston Villa", 
              xgiTrend: "↑ 0.9 → 1.4 per 90", 
              fixtureDifficulty: "2.5 avg next 4", 
              ownership: "12.4%", 
              value: "9.1m", 
              verdict: "Villa flying, Watkins central to everything. Still under-owned." 
            },
            { 
              player: "Julian Alvarez", 
              team: "Man City", 
              xgiTrend: "↑ 0.7 → 1.1 per 90", 
              fixtureDifficulty: "2.1 avg next 4", 
              ownership: "8.9%", 
              value: "7.2m", 
              verdict: "Getting more minutes, City's fixture run is exceptional. Value pick." 
            },
            { 
              player: "Bryan Mbeumo", 
              team: "Brentford", 
              xgiTrend: "↑ 0.8 → 1.3 per 90", 
              fixtureDifficulty: "2.8 avg next 4", 
              ownership: "4.2%", 
              value: "6.8m", 
              verdict: "Returning from injury, Brentford's fixtures improve. High upside." 
            },
            { 
              player: "Anthony Gordon", 
              team: "Newcastle", 
              xgiTrend: "↑ 0.6 → 1.0 per 90", 
              fixtureDifficulty: "2.6 avg next 4", 
              ownership: "5.1%", 
              value: "5.9m", 
              verdict: "Newcastle's attack improving, Gordon involved in everything. Budget gem." 
            }
          ]
        },
        enabled: true
      },
      {
        id: 'sellTargets',
        type: 'premium',
        title: "Top 3 Players to Sell",
        content: {
          targets: [
            { 
              player: "Marcus Rashford", 
              team: "Man Utd", 
              reason: "xGI down 35% month-on-month, fixtures tough, United struggling", 
              data: "xGI: 0.45 vs 0.68 expected, xG per 90: 0.32 vs career avg 0.58" 
            },
            { 
              player: "James Maddison", 
              team: "Tottenham", 
              reason: "Creative output declining, tough fixtures, role uncertainty", 
              data: "xA: 0.18 vs 0.35 expected, key passes per 90: 1.2 vs 2.1 season start" 
            },
            { 
              player: "Gabriel Martinelli", 
              team: "Arsenal", 
              reason: "Minutes being managed, Saka taking set-pieces, competition for places", 
              data: "xGI: 0.52 vs 0.71 expected, shots per 90: 2.1 vs 3.4" 
            }
          ]
        },
        enabled: true
      },
      {
        id: 'differentialRadar',
        type: 'premium',
        title: "Differential Radar (<5% owned)",
        content: {
          players: [
            { 
              player: "João Palhinha", 
              team: "Fulham", 
              ownership: "2.1%", 
              upside: "Bonus points magnet, Fulham's fixtures improving", 
              xgi: "0.8 per 90 last 3 games" 
            },
            { 
              player: "Eddie Nketiah", 
              team: "Arsenal", 
              ownership: "1.8%", 
              upside: "Jesus rotation risk, goal threat", 
              xgi: "1.2 per 90 when starting" 
            },
            { 
              player: "Pablo Sarabia", 
              team: "Wolves", 
              ownership: "3.2%", 
              upside: "Set-piece taker, Wolves improving", 
              xgi: "0.9 per 90 last 4 games" 
            }
          ]
        },
        enabled: true
      },
      {
        id: 'fixtureMatrix',
        type: 'fixtures',
        title: "Fixture Difficulty Matrix (Next 5 GWs)",
        content: {
          rankings: [
            { rank: 1, team: "Man City", difficulty: "1.8", fixtures: "BHA, BRE, BUR, LUT, CRY" },
            { rank: 2, team: "Arsenal", difficulty: "2.0", fixtures: "SHU, BUR, CRY, MUN, EVE" },
            { rank: 3, team: "Liverpool", difficulty: "2.4", fixtures: "FUL, BRE, MCI, CHE, BHA" },
            { rank: 4, team: "Aston Villa", difficulty: "2.6", fixtures: "BOU, MUN, WHU, NEW, BUR" },
            { rank: 5, team: "Newcastle", difficulty: "2.8", fixtures: "WOL, BHA, MCI, EVE, TOT" }
          ]
        },
        enabled: true
      },
      {
        id: 'predictedLineups',
        type: 'premium',
        title: "Predicted Lineups (Key Teams)",
        content: {
          teams: [
            {
              team: "Man City",
              formation: "4-3-3",
              keyChanges: "De Bruyne back in midfield, Alvarez starting up front",
              lineup: "Ederson; Walker, Stones, Dias, Ake; De Bruyne, Rodri, Silva; Foden, Haaland, Alvarez"
            },
            {
              team: "Arsenal",
              formation: "4-3-3",
              keyChanges: "Partey back, Jesus rotation with Nketiah",
              lineup: "Raya; White, Saliba, Gabriel, Zinchenko; Partey, Rice, Odegaard; Saka, Jesus, Martinelli"
            },
            {
              team: "Liverpool",
              formation: "4-3-3",
              keyChanges: "Alisson back, Trent in midfield role",
              lineup: "Alisson; Alexander-Arnold, Konate, Van Dijk, Robertson; Endo, Szoboszlai, Trent; Salah, Nunez, Diaz"
            }
          ]
        },
        enabled: true
      },
      {
        id: 'captaincyAlgorithm',
        type: 'premium',
        title: "Captaincy Algorithm Picks",
        content: {
          algorithm: "xP × xGI × Fixture Difficulty × Form × Home/Away",
          picks: [
            { 
              player: "Erling Haaland", 
              team: "Man City", 
              algorithmScore: "94.2", 
              xP: "8.7", 
              xgi: "1.4", 
              difficulty: "1.8", 
              form: "↑ 23%", 
              venue: "Home" 
            },
            { 
              player: "Mohamed Salah", 
              team: "Liverpool", 
              algorithmScore: "87.6", 
              xP: "7.9", 
              xgi: "1.2", 
              difficulty: "2.4", 
              form: "↑ 18%", 
              venue: "Away" 
            },
            { 
              player: "Bukayo Saka", 
              team: "Arsenal", 
              algorithmScore: "82.3", 
              xP: "7.2", 
              xgi: "1.1", 
              difficulty: "2.0", 
              form: "↑ 31%", 
              venue: "Home" 
            }
          ]
        },
        enabled: true
      },
      {
        id: 'chipStrategy',
        type: 'premium',
        title: "Chip Strategy Guidance",
        content: {
          strategies: [
            { 
              chip: "Wildcard", 
              timing: "GW 14-15", 
              reasoning: "Post-international break, teams settled, good fixture runs starting" 
            },
            { 
              chip: "Free Hit", 
              timing: "GW 19 (Boxing Day)", 
              reasoning: "Double gameweek, lots of uncertainty, perfect for one-off punt" 
            },
            { 
              chip: "Triple Captain", 
              timing: "GW 16", 
              reasoning: "City vs Newcastle, Haaland at home, highest xG matchup" 
            },
            { 
              chip: "Bench Boost", 
              timing: "GW 21", 
              reasoning: "Blank gameweek for big teams, premium bench players get starts" 
            }
          ]
        },
        enabled: true
      },
      {
        id: 'gafferNotebook',
        type: 'premium',
        title: "The Gaffer's Notebook",
        content: {
          insights: [
            "🔒 **Manager Watch**: Postecoglou is stubborn with his system. Won't change even when it's not working. Spurs will continue to concede goals.",
            "🔒 **Injury Intelligence**: De Bruyne's return changes everything for City. His xA per 90: 0.42 vs Silva's 0.28. Big upgrade.",
            "🔒 **Tactical Trends**: More teams playing 3-4-3. Wing-backs becoming premium assets. Check Trippier, Walker, Robertson.",
            "🔒 **Weather Watch**: Winter coming. Expect more physical games, fewer technical players thriving. Check the big men.",
            "🔒 **Transfer Window**: January moves will shake things up. Keep an eye on striker movements. Could change captaincy landscape."
          ]
        },
        enabled: true
      },
      {
        id: 'finalWord',
        type: 'footer',
        title: "The Gaffer's Final Word",
        content: { 
          message: "That's the premium briefing for this week. Use the data, trust the process, and remember - the smart money always wins. See you at the top of the table.",
          signOff: "The Gaffer"
        },
        enabled: true
      }
    ]
  };
};

const createTemplate = (tier: 'firstTeam' | 'seasonPass'): NewsletterTemplate => {
  return tier === 'firstTeam' ? createFirstTeamTemplate() : createSeasonPassTemplate();
};

  const generateNewsletter = (tier: 'firstTeam' | 'seasonPass') => {
    const template = createTemplate(tier);
    setCurrentTemplate(template);
    setIsEditing(true);
  };

  const toggleSection = (sectionId: string) => {
    if (!currentTemplate) return;

    const updatedTemplate = {
      ...currentTemplate,
      sections: currentTemplate.sections.map(section =>
        section.id === sectionId ? { ...section, enabled: !section.enabled } : section
      )
    };

    setCurrentTemplate(updatedTemplate);
  };

  const exportTemplate = () => {
    if (!currentTemplate) return;

    const dataStr = JSON.stringify(currentTemplate, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `newsletter-${currentTemplate.tier}-${Date.now()}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  const updateSectionContent = (sectionId: string, field: string, value: any) => {
    if (!currentTemplate) return;

    const updatedTemplate = {
      ...currentTemplate,
      sections: currentTemplate.sections.map(section =>
        section.id === sectionId 
          ? { 
              ...section, 
              content: { 
                ...section.content, 
                [field]: value 
              } 
            } 
          : section
      )
    };

    setCurrentTemplate(updatedTemplate);
  };

  const renderEditablePreview = () => {
    if (!currentTemplate) return null;

    return (
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-800 to-slate-900 text-white p-8 text-center border-b-4 border-red-600">
          <div 
            contentEditable
            suppressContentEditableWarning
            onBlur={(e) => updateSectionContent('header', 'title', e.currentTarget.textContent)}
            className="text-3xl font-bold mb-3 cursor-text hover:bg-slate-700 rounded px-3 py-2 transition-colors"
          >
            {currentTemplate.sections.find(s => s.type === 'header')?.content?.title || "The Gaffer's Briefing"}
          </div>
          <div 
            contentEditable
            suppressContentEditableWarning
            onBlur={(e) => updateSectionContent('header', 'subtitle', e.currentTarget.textContent)}
            className="text-slate-300 text-lg cursor-text hover:bg-slate-700 rounded px-3 py-2 transition-colors"
          >
            {currentTemplate.sections.find(s => s.type === 'header')?.content?.subtitle || "No-nonsense Premier League analysis"}
          </div>
        </div>

        {/* Sections */}
        <div className="p-8 space-y-8 bg-slate-50">
          {currentTemplate.sections
            .filter(section => section.enabled)
            .map(section => (
              <div key={section.id} className="bg-white rounded-lg shadow-md p-6 border-l-4 border-red-600">
                <h3 className="text-2xl font-bold mb-6 text-slate-800 border-b-2 border-slate-200 pb-3">
                  {section.title}
                </h3>
                
                {/* Gaffer's Take / Elite Briefing */}
                {(section.type === 'premium' && (section.id === 'gafferTake' || section.id === 'eliteBriefing')) && (
                  <div className="space-y-4">
                    <div className="space-y-3">
                      {section.content.insights?.map((insight: string, idx: number) => (
                        <div key={idx} className="text-slate-700 leading-relaxed">
                          <div 
                            dangerouslySetInnerHTML={{ 
                              __html: DOMPurify.sanitize(insight.replace(/\*\*(.*?)\*\*/g, '<strong class="text-red-600">$1</strong>')) 
                            }} 
                          />
                        </div>
                      ))}
                    </div>
                    {section.content.gafferQuote && (
                      <div className="bg-red-50 border-l-4 border-red-600 p-4 italic text-slate-700">
                        "{section.content.gafferQuote}"
                      </div>
                    )}
                  </div>
                )}

                {/* Player Form Highlights */}
                {section.type === 'premium' && section.id === 'playerForm' && (
                  <div className="space-y-6">
                    <div>
                      <h4 className="font-bold text-green-700 mb-3">🔥 On Form</h4>
                      <div className="space-y-2">
                        {section.content.onForm?.map((player: any, idx: number) => (
                          <div key={idx} className="flex justify-between items-center p-3 bg-green-50 rounded border border-green-200">
                            <div>
                              <div className="font-bold text-slate-800">{player.player}</div>
                              <div className="text-sm text-slate-600">{player.team}</div>
                            </div>
                            <div className="text-right">
                              <div className="text-sm font-bold text-green-700">{player.stat}</div>
                              <div className="text-xs text-slate-600 italic">{player.comment}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="font-bold text-orange-700 mb-3">⚠️ Underperforming</h4>
                      <div className="space-y-2">
                        {section.content.underperforming?.map((player: any, idx: number) => (
                          <div key={idx} className="flex justify-between items-center p-3 bg-orange-50 rounded border border-orange-200">
                            <div>
                              <div className="font-bold text-slate-800">{player.player}</div>
                              <div className="text-sm text-slate-600">{player.team}</div>
                            </div>
                            <div className="text-right">
                              <div className="text-sm font-bold text-orange-700">{player.stat}</div>
                              <div className="text-xs text-slate-600 italic">{player.comment}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="font-bold text-purple-700 mb-3">🎯 Differential Pick</h4>
                      {section.content.differential?.map((player: any, idx: number) => (
                        <div key={idx} className="flex justify-between items-center p-3 bg-purple-50 rounded border border-purple-200">
                          <div>
                            <div className="font-bold text-slate-800">{player.player}</div>
                            <div className="text-sm text-slate-600">{player.team}</div>
                          </div>
                          <div className="text-right">
                            <div className="text-sm font-bold text-purple-700">{player.stat}</div>
                            <div className="text-xs text-slate-600 italic">{player.comment}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Fixture Watch */}
                {section.type === 'fixtures' && section.id === 'fixtureWatch' && (
                  <div className="space-y-3">
                    {section.content.favourable?.map((team: any, idx: number) => (
                      <div key={idx} className="border-2 border-green-300 rounded-lg p-4 bg-green-50">
                        <div className="flex justify-between items-center mb-2">
                          <div className="font-bold text-lg text-slate-800">{team.team}</div>
                          <div className="bg-green-600 text-white px-3 py-1 rounded text-sm">
                            {team.difficulty}
                          </div>
                        </div>
                        <div className="text-sm text-slate-600 mb-2">{team.fixtures}</div>
                        <div className="text-slate-700 italic">{team.comment}</div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Captaincy Confidence Meter */}
                {section.type === 'premium' && section.id === 'captaincy' && (
                  <div className="space-y-3">
                    {section.content.options?.map((option: any, idx: number) => (
                      <div key={idx} className="border-2 border-blue-300 rounded-lg p-4 bg-blue-50">
                        <div className="flex justify-between items-center mb-2">
                          <div className="font-bold text-lg text-slate-800">{option.player}</div>
                          <div className="bg-blue-600 text-white px-3 py-1 rounded text-sm">
                            {option.confidence}
                          </div>
                        </div>
                        <div className="text-sm text-slate-600 mb-2">{option.team}</div>
                        <div className="text-slate-700 italic">{option.reasoning}</div>
                      </div>
                    ))}
                  </div>
                )}

                {/* The Gaffer's Predictions */}
                {section.type === 'fixtures' && section.id === 'predictions' && (
                  <div className="space-y-4">
                    {section.content.matches?.map((match: any, idx: number) => (
                      <div key={idx} className="border-2 border-slate-300 rounded-lg p-4 bg-white">
                        <div className="flex justify-between items-center mb-3">
                          <div className="font-bold text-lg text-slate-800">
                            {match.homeTeam} vs {match.awayTeam}
                          </div>
                          <div className="bg-red-600 text-white px-3 py-1 rounded text-sm">
                            {match.confidence}% confidence
                          </div>
                        </div>
                        <div className="bg-red-50 border-l-4 border-red-600 p-3 mb-3">
                          <div className="font-bold text-red-700 mb-1">The Gaffer's Prediction:</div>
                          <div className="text-xl font-bold text-slate-800">{match.prediction}</div>
                        </div>
                        <div className="text-slate-700 italic">
                          "{match.reasoning}"
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Power Rankings */}
                {section.type === 'leaderboard' && (
                  <div className="space-y-3">
                    {section.content.players?.map((player: any, idx: number) => (
                      <div key={idx} className="flex justify-between items-center p-4 bg-slate-100 rounded-lg border border-slate-300">
                        <div className="flex items-center space-x-4">
                          <div className="bg-red-600 text-white font-bold w-8 h-8 rounded-full flex items-center justify-center">
                            {player.rank}
                          </div>
                          <div>
                            <div className="font-bold text-slate-800">{player.username}</div>
                            <div className="text-sm text-slate-600 italic">{player.comment}</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-bold text-slate-800">{player.points} pts</div>
                          <div className="text-sm text-slate-600">{player.accuracy}% accuracy</div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Transfer Targets */}
                {section.type === 'premium' && section.id === 'transferTargets' && (
                  <div className="space-y-4">
                    {section.content.targets?.map((target: any, idx: number) => (
                      <div key={idx} className="border-2 border-green-300 rounded-lg p-4 bg-green-50">
                        <div className="flex justify-between items-center mb-3">
                          <div className="font-bold text-lg text-slate-800">{target.player}</div>
                          <div className="text-sm text-slate-600">{target.team}</div>
                        </div>
                        <div className="grid grid-cols-2 gap-2 mb-3 text-sm">
                          <div><strong>xGI Trend:</strong> {target.xgiTrend}</div>
                          <div><strong>Ownership:</strong> {target.ownership}</div>
                          <div><strong>Fixture Difficulty:</strong> {target.fixtureDifficulty}</div>
                          <div><strong>Value:</strong> {target.value}</div>
                        </div>
                        <div className="bg-green-100 p-3 rounded">
                          <div className="font-bold text-green-800 mb-1">The Gaffer's Verdict:</div>
                          <div className="text-slate-700">{target.verdict}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Sell Targets */}
                {section.type === 'premium' && section.id === 'sellTargets' && (
                  <div className="space-y-4">
                    {section.content.targets?.map((target: any, idx: number) => (
                      <div key={idx} className="border-2 border-red-300 rounded-lg p-4 bg-red-50">
                        <div className="flex justify-between items-center mb-3">
                          <div className="font-bold text-lg text-slate-800">{target.player}</div>
                          <div className="text-sm text-slate-600">{target.team}</div>
                        </div>
                        <div className="bg-red-100 p-3 rounded mb-3">
                          <div className="font-bold text-red-800 mb-1">Reason to Sell:</div>
                          <div className="text-slate-700">{target.reason}</div>
                        </div>
                        <div className="text-sm text-slate-600">
                          <strong>Data:</strong> {target.data}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Differential Radar */}
                {section.type === 'premium' && section.id === 'differentialRadar' && (
                  <div className="space-y-4">
                    {section.content.players?.map((player: any, idx: number) => (
                      <div key={idx} className="border-2 border-purple-300 rounded-lg p-4 bg-purple-50">
                        <div className="flex justify-between items-center mb-3">
                          <div className="font-bold text-lg text-slate-800">{player.player}</div>
                          <div className="bg-purple-600 text-white px-3 py-1 rounded text-sm">
                            {player.ownership}
                          </div>
                        </div>
                        <div className="text-sm text-slate-600 mb-2">{player.team}</div>
                        <div className="bg-purple-100 p-3 rounded">
                          <div className="font-bold text-purple-800 mb-1">Upside:</div>
                          <div className="text-slate-700 mb-2">{player.upside}</div>
                          <div className="text-sm"><strong>xGI:</strong> {player.xgi}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Fixture Matrix */}
                {section.type === 'fixtures' && section.id === 'fixtureMatrix' && (
                  <div className="space-y-3">
                    {section.content.rankings?.map((team: any, idx: number) => (
                      <div key={idx} className="flex justify-between items-center p-4 bg-slate-100 rounded-lg border border-slate-300">
                        <div className="flex items-center space-x-4">
                          <div className="bg-red-600 text-white font-bold w-8 h-8 rounded-full flex items-center justify-center">
                            {team.rank}
                          </div>
                          <div>
                            <div className="font-bold text-slate-800">{team.team}</div>
                            <div className="text-sm text-slate-600">{team.fixtures}</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="bg-green-600 text-white px-3 py-1 rounded text-sm">
                            {team.difficulty}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Predicted Lineups */}
                {section.type === 'premium' && section.id === 'predictedLineups' && (
                  <div className="space-y-4">
                    {section.content.teams?.map((teamData: any, idx: number) => (
                      <div key={idx} className="border-2 border-blue-300 rounded-lg p-4 bg-blue-50">
                        <div className="flex justify-between items-center mb-3">
                          <div className="font-bold text-lg text-slate-800">{teamData.team}</div>
                          <div className="bg-blue-600 text-white px-3 py-1 rounded text-sm">
                            {teamData.formation}
                          </div>
                        </div>
                        <div className="bg-blue-100 p-3 rounded mb-3">
                          <div className="font-bold text-blue-800 mb-1">Key Changes:</div>
                          <div className="text-slate-700">{teamData.keyChanges}</div>
                        </div>
                        <div className="text-sm text-slate-600">
                          <strong>Lineup:</strong> {teamData.lineup}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Captaincy Algorithm */}
                {section.type === 'premium' && section.id === 'captaincyAlgorithm' && (
                  <div className="space-y-4">
                    <div className="bg-slate-100 p-3 rounded mb-4">
                      <div className="font-bold text-slate-800 mb-1">Algorithm:</div>
                      <div className="text-slate-700">{section.content.algorithm}</div>
                    </div>
                    {section.content.picks?.map((pick: any, idx: number) => (
                      <div key={idx} className="border-2 border-green-300 rounded-lg p-4 bg-green-50">
                        <div className="flex justify-between items-center mb-3">
                          <div className="font-bold text-lg text-slate-800">{pick.player}</div>
                          <div className="bg-green-600 text-white px-3 py-1 rounded text-sm">
                            Score: {pick.algorithmScore}
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-2 text-sm">
                          <div><strong>xP:</strong> {pick.xP}</div>
                          <div><strong>xGI:</strong> {pick.xgi}</div>
                          <div><strong>Difficulty:</strong> {pick.difficulty}</div>
                          <div><strong>Form:</strong> {pick.form}</div>
                          <div><strong>Venue:</strong> {pick.venue}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Chip Strategy */}
                {section.type === 'premium' && section.id === 'chipStrategy' && (
                  <div className="space-y-4">
                    {section.content.strategies?.map((strategy: any, idx: number) => (
                      <div key={idx} className="border-2 border-orange-300 rounded-lg p-4 bg-orange-50">
                        <div className="flex justify-between items-center mb-3">
                          <div className="font-bold text-lg text-slate-800">{strategy.chip}</div>
                          <div className="bg-orange-600 text-white px-3 py-1 rounded text-sm">
                            {strategy.timing}
                          </div>
                        </div>
                        <div className="bg-orange-100 p-3 rounded">
                          <div className="font-bold text-orange-800 mb-1">Reasoning:</div>
                          <div className="text-slate-700">{strategy.reasoning}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Gaffer's Notebook */}
                {section.type === 'premium' && section.id === 'gafferNotebook' && (
                  <div className="space-y-4">
                    {section.content.insights?.map((insight: string, idx: number) => (
                      <div key={idx} className="bg-slate-800 text-white p-4 rounded-lg">
                        <div dangerouslySetInnerHTML={{ 
                            __html: DOMPurify.sanitize(insight.replace(/\*\*(.*?)\*\*/g, '<strong class="text-yellow-400">$1</strong>')) 
                          }} />
                      </div>
                    ))}
                  </div>
                )}

                {/* Final Word */}
                {section.type === 'footer' && (
                  <div className="text-center space-y-4">
                    <div className="text-slate-700 italic text-lg">
                      "{section.content.message}"
                    </div>
                    <div className="font-bold text-2xl text-red-600">
                      {section.content.signOff}
                    </div>
                  </div>
                )}
              </div>
            ))}
        </div>

        {/* Footer */}
        <div className="bg-slate-800 text-white p-6 text-center">
          <p className="mb-2">© 2024 The Gaffer's Briefing</p>
          <p className="text-slate-400 text-sm">
            <a href="#" className="text-red-400 hover:text-red-300 underline">Unsubscribe</a> | 
            <a href="#" className="text-red-400 hover:text-red-300 underline ml-2">Privacy</a>
          </p>
        </div>
      </div>
    );
  };

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Access Denied</h1>
          <p className="text-gray-600 mb-4">You need admin privileges to access this page.</p>
          <button 
            onClick={() => {
              const mockUser: User = {
                id: 'admin-test',
                email: 'admin@premierleaguehub.com',
                username: 'admin',
                team: 'Test Team',
                joinedDate: new Date(),
                totalPredictions: 0,
                accuracy: 0,
                currentStreak: 0,
                bestStreak: 0,
                weeklyPoints: 0,
                monthlyPoints: 0,
                allTimePoints: 0
              };
              setCurrentUser(mockUser);
            }}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            Bypass for Testing
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900">
      {/* Header */}
      <div className="bg-slate-800 border-b border-slate-700">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-red-600 rounded-lg flex items-center justify-center">
                <i className="fas fa-futbol text-white"></i>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">The Gaffer's Newsletter Studio</h1>
                <p className="text-slate-400 text-sm">Professional newsletter generation system</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => window.location.href = '/'}
                className="px-4 py-2 text-slate-400 hover:text-white transition-colors flex items-center space-x-2"
              >
                <i className="fas fa-arrow-left"></i>
                <span>Back to Site</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {!isEditing ? (
          /* Tier Selection - Sleek Design */
          <div className="space-y-8">
            {/* View Toggle */}
            <div className="flex justify-center">
              <div className="bg-slate-800 rounded-lg p-1 inline-flex">
                <button
                  onClick={() => setActiveView('editor')}
                  className={`px-6 py-3 rounded-md font-medium transition-all ${
                    activeView === 'editor'
                      ? 'bg-red-600 text-white'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <i className="fas fa-edit mr-2"></i>
                  Editor
                </button>
                <button
                  onClick={() => setActiveView('preview')}
                  className={`px-6 py-3 rounded-md font-medium transition-all ${
                    activeView === 'preview'
                      ? 'bg-red-600 text-white'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <i className="fas fa-eye mr-2"></i>
                  Preview
                </button>
              </div>
            </div>

            {/* Tier Selection Cards */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* First Team Card */}
              <div
                onClick={() => setSelectedTier('firstTeam')}
                className={`relative bg-slate-800 rounded-2xl border-2 transition-all cursor-pointer transform hover:scale-105 ${
                  selectedTier === 'firstTeam'
                    ? 'border-red-500 shadow-lg shadow-red-500/20'
                    : 'border-slate-700 hover:border-slate-600'
                }`}
              >
                <div className="p-8">
                  <div className="flex items-center justify-between mb-6">
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                      <i className="fas fa-users text-white text-2xl"></i>
                    </div>
                    {selectedTier === 'firstTeam' && (
                      <div className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                        SELECTED
                      </div>
                    )}
                  </div>
                  
                  <h3 className="text-2xl font-bold text-white mb-3">First Team</h3>
                  <p className="text-slate-400 mb-6">Standard newsletter for all subscribers with essential insights and predictions</p>
                  
                  <div className="space-y-3">
                    <div className="flex items-center text-slate-300">
                      <i className="fas fa-check text-green-500 mr-3"></i>
                      <span className="text-sm">Gaffer's Take & Analysis</span>
                    </div>
                    <div className="flex items-center text-slate-300">
                      <i className="fas fa-check text-green-500 mr-3"></i>
                      <span className="text-sm">Player Form Highlights</span>
                    </div>
                    <div className="flex items-center text-slate-300">
                      <i className="fas fa-check text-green-500 mr-3"></i>
                      <span className="text-sm">Fixture Watch & Predictions</span>
                    </div>
                    <div className="flex items-center text-slate-300">
                      <i className="fas fa-check text-green-500 mr-3"></i>
                      <span className="text-sm">Power Rankings</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Season Pass Card */}
              <div
                onClick={() => setSelectedTier('seasonPass')}
                className={`relative bg-slate-800 rounded-2xl border-2 transition-all cursor-pointer transform hover:scale-105 ${
                  selectedTier === 'seasonPass'
                    ? 'border-yellow-500 shadow-lg shadow-yellow-500/20'
                    : 'border-slate-700 hover:border-slate-600'
                }`}
              >
                <div className="absolute top-4 right-4 bg-gradient-to-r from-yellow-500 to-yellow-600 text-white px-3 py-1 rounded-full text-sm font-bold">
                  PREMIUM
                </div>
                
                <div className="p-8">
                  <div className="flex items-center justify-between mb-6">
                    <div className="w-16 h-16 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-xl flex items-center justify-center">
                      <i className="fas fa-crown text-white text-2xl"></i>
                    </div>
                    {selectedTier === 'seasonPass' && (
                      <div className="bg-yellow-500 text-slate-900 px-3 py-1 rounded-full text-sm font-bold">
                        SELECTED
                      </div>
                    )}
                  </div>
                  
                  <h3 className="text-2xl font-bold text-white mb-3">Season Pass</h3>
                  <p className="text-slate-400 mb-6">Premium newsletter with exclusive data, analytics, and insider insights</p>
                  
                  <div className="space-y-3">
                    <div className="flex items-center text-slate-300">
                      <i className="fas fa-star text-yellow-500 mr-3"></i>
                      <span className="text-sm">Everything in First Team</span>
                    </div>
                    <div className="flex items-center text-slate-300">
                      <i className="fas fa-star text-yellow-500 mr-3"></i>
                      <span className="text-sm">Transfer Targets & Analysis</span>
                    </div>
                    <div className="flex items-center text-slate-300">
                      <i className="fas fa-star text-yellow-500 mr-3"></i>
                      <span className="text-sm">Captaincy Algorithm</span>
                    </div>
                    <div className="flex items-center text-slate-300">
                      <i className="fas fa-star text-yellow-500 mr-3"></i>
                      <span className="text-sm">Exclusive War Room Insights</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Generate Button */}
            <div className="text-center">
              <button
                onClick={() => generateNewsletter(selectedTier)}
                disabled={isGenerating}
                className="bg-gradient-to-r from-red-500 to-red-600 text-white px-12 py-4 rounded-xl font-bold text-lg hover:from-red-600 hover:to-red-700 transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-3 mx-auto"
              >
                {isGenerating ? (
                  <>
                    <i className="fas fa-spinner fa-spin"></i>
                    <span>Generating Newsletter...</span>
                  </>
                ) : (
                  <>
                    <i className="fas fa-magic"></i>
                    <span>Generate {selectedTier === 'firstTeam' ? 'First Team' : 'Season Pass'} Newsletter</span>
                  </>
                )}
              </button>
            </div>
          </div>
        ) : (
          /* Editor Mode - Split View */
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Sections Editor */}
            <div className="lg:col-span-1">
              <div className="bg-slate-800 rounded-2xl border border-slate-700 p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold text-white flex items-center">
                    <i className="fas fa-layer-group mr-2 text-red-500"></i>
                    Newsletter Sections
                  </h2>
                  <div className="flex space-x-2">
                    <button
                      onClick={exportTemplate}
                      className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-green-700 transition-colors"
                    >
                      <i className="fas fa-download mr-1"></i>
                      Export
                    </button>
                    <button
                      onClick={() => setIsEditing(false)}
                      className="bg-slate-700 text-white px-4 py-2 rounded-lg text-sm hover:bg-slate-600 transition-colors"
                    >
                      <i className="fas fa-arrow-left mr-1"></i>
                      Back
                    </button>
                  </div>
                </div>
                
                <div className="space-y-3">
                  {currentTemplate?.sections.map(section => (
                    <div
                      key={section.id}
                      className={`p-4 bg-slate-700 rounded-xl border transition-all ${
                        !section.enabled 
                          ? 'opacity-50 border-slate-600' 
                          : 'border-slate-600 hover:border-red-500'
                      }`}
                    >
                      <div className="flex justify-between items-center">
                        <div className="flex items-center space-x-3">
                          <div className={`w-2 h-2 rounded-full ${
                            section.enabled ? 'bg-green-500' : 'bg-slate-500'
                          }`}></div>
                          <span className="font-medium text-white">{section.title}</span>
                        </div>
                        <button
                          onClick={() => toggleSection(section.id)}
                          className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                            section.enabled
                              ? 'bg-green-600 text-white hover:bg-green-700'
                              : 'bg-slate-600 text-slate-300 hover:bg-slate-500'
                          }`}
                        >
                          {section.enabled ? 'ON' : 'OFF'}
                        </button>
                      </div>
                      {section.type === 'premium' && (
                        <div className="mt-2">
                          <span className="text-xs bg-yellow-600 text-white px-2 py-1 rounded-full font-medium">
                            <i className="fas fa-crown mr-1"></i>
                            Season Pass Only
                          </span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Preview Panel */}
            <div className="lg:col-span-2">
              <div className="bg-slate-800 rounded-2xl border border-slate-700 p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold text-white flex items-center">
                    <i className="fas fa-eye mr-2 text-red-500"></i>
                    Live Preview
                  </h2>
                  <div className="text-sm text-slate-400">
                    {currentTemplate?.name} • {currentTemplate?.tier === 'firstTeam' ? 'Standard' : 'Premium'}
                  </div>
                </div>
                
                <div className="bg-white rounded-xl overflow-hidden">
                  <p className="text-sm text-gray-600 mb-4 p-4">Click on the title and subtitle to edit them directly!</p>
                  <div className="border rounded-lg overflow-hidden" style={{ maxHeight: '800px', overflowY: 'auto' }}>
                    {renderEditablePreview()}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SimpleNewsletterEditor;


