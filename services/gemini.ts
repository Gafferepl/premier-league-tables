
import { GoogleGenAI } from "@google/genai";
import { AppData, GoalTiming, SackRaceEntry } from "../types";
import { ELITE_TRIO, MORE_TALENT, NEWS_ITEMS, RECENT_MATCHES, getTeamLogo } from "../constants";

const CACHE_KEY = 'premier_league_hub_data_v111_live_refresh'; 
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes cache

// KEY PLAYERS for Scorer Fallback
const KEY_PLAYERS: Record<string, string[]> = {
  "Arsenal": ["Saka", "Havertz", "Odegaard", "Trossard", "Martinelli", "Rice"],
  "Aston Villa": ["Watkins", "Duran", "Rogers", "Bailey", "Tielemans"],
  "Bournemouth": ["Semenyo", "Evanilson", "Kluivert", "Tavernier"],
  "Brentford": ["Mbeumo", "Wissa", "Damsgaard", "Schade"],
  "Brighton": ["Welbeck", "Mitoma", "Pedro", "Rutter", "Ferguson"],
  "Chelsea": ["Palmer", "Jackson", "Madueke", "Nkunku", "Neto"],
  "Crystal Palace": ["Mateta", "Eze", "Sarr", "Wharton"],
  "Everton": ["McNeil", "Calvert-Lewin", "Ndiaye", "Doucoure"],
  "Fulham": ["Jimenez", "Smith Rowe", "Iwobi", "Muniz"],
  "Ipswich": ["Delap", "Szmodics", "Hutchinson", "Chaplin"],
  "Leicester": ["Vardy", "Mavididi", "Buonanotte", "Ayew"],
  "Liverpool": ["Salah", "Diaz", "Nunez", "Gakpo", "Jota"],
  "Luton": ["Morris", "Adebayo", "Chong"],
  "Man City": ["Haaland", "Foden", "De Bruyne", "Silva", "Grealish"],
  "Man Utd": ["Fernandes", "Rashford", "Hojlund", "Garnacho", "Diallo"],
  "Newcastle": ["Isak", "Gordon", "Barnes", "Joelinton", "Guimaraes"],
  "Nottingham Forest": ["Wood", "Hudson-Odoi", "Elanga", "Gibbs-White", "Yates"],
  "Southampton": ["Archer", "Fernandes", "Armstrong", "Dibling"],
  "Spurs": ["Solanke", "Son", "Johnson", "Kulusevski", "Maddison"],
  "West Ham": ["Bowen", "Kudus", "Paqueta", "Antonio", "Soucek"],
  "Wolves": ["Cunha", "Larsen", "Gomes", "Bellegarde"]
};

// Fallback Sack Race (Updated)
const FALLBACK_SACK_RACE: SackRaceEntry[] = [
  { manager: "Julen Lopetegui", team: "West Ham", temperature: 85, gafferVerdict: "Fans aren't happy. Bubble is bursting.", nextManager: "Graham Potter", odds: "2/1" },
  { manager: "Eddie Howe", team: "Newcastle", temperature: 45, gafferVerdict: "Needs consistent results to stay safe.", nextManager: "Jose Mourinho", odds: "12/1" },
  { manager: "Gary O'Neil", team: "Wolves", temperature: 75, gafferVerdict: "Fighting for his life every week.", nextManager: "David Moyes", odds: "6/1" },
  { manager: "Ange Postecoglou", team: "Spurs", temperature: 40, gafferVerdict: "Mate. We go again.", nextManager: "Thomas Frank", odds: "33/1" },
  { manager: "Oliver Glasner", team: "Crystal Palace", temperature: 65, gafferVerdict: "Results need to pick up fast.", nextManager: "Gareth Southgate", odds: "8/1" }
];

// Fallback data - Generic Matchday Data
const FALLBACK_DATA: AppData = {
  lastUpdated: Date.now(),
  currentGameweek: 26, 
  table: [
     { position: 1, team: "Liverpool", played: 25, won: 18, drawn: 5, lost: 2, gd: 40, points: 59, form: ["W", "D", "W", "W", "W"] },
     { position: 2, team: "Man City", played: 25, won: 17, drawn: 4, lost: 4, gd: 35, points: 55, form: ["W", "W", "W", "D", "W"] },
     { position: 3, team: "Arsenal", played: 25, won: 15, drawn: 6, lost: 4, gd: 30, points: 51, form: ["W", "W", "D", "W", "L"] },
     { position: 4, team: "Chelsea", played: 25, won: 13, drawn: 6, lost: 6, gd: 18, points: 45, form: ["W", "D", "W", "W", "D"] },
     { position: 5, team: "Aston Villa", played: 25, won: 13, drawn: 5, lost: 7, gd: 15, points: 44, form: ["L", "W", "W", "L", "W"] },
     { position: 6, team: "Newcastle", played: 25, won: 11, drawn: 6, lost: 8, gd: 10, points: 39, form: ["D", "W", "L", "W", "W"] },
     { position: 7, team: "Nottingham Forest", played: 25, won: 10, drawn: 8, lost: 7, gd: 5, points: 38, form: ["W", "L", "D", "W", "L"] },
     { position: 8, team: "Spurs", played: 25, won: 11, drawn: 4, lost: 10, gd: 8, points: 37, form: ["L", "W", "L", "W", "L"] },
     { position: 9, team: "Brighton", played: 25, won: 9, drawn: 9, lost: 7, gd: 4, points: 36, form: ["D", "D", "W", "L", "D"] },
     { position: 10, team: "Fulham", played: 25, won: 9, drawn: 8, lost: 8, gd: 2, points: 35, form: ["W", "L", "D", "W", "L"] },
     { position: 11, team: "Brentford", played: 25, won: 9, drawn: 5, lost: 11, gd: -2, points: 32, form: ["L", "W", "W", "L", "D"] },
     { position: 12, team: "Bournemouth", played: 25, won: 8, drawn: 7, lost: 10, gd: -5, points: 31, form: ["D", "L", "W", "D", "W"] },
     { position: 13, team: "Man Utd", played: 25, won: 8, drawn: 6, lost: 11, gd: -8, points: 30, form: ["L", "D", "L", "W", "L"] },
     { position: 14, team: "West Ham", played: 25, won: 7, drawn: 7, lost: 11, gd: -12, points: 28, form: ["D", "L", "W", "L", "L"] },
     { position: 15, team: "Crystal Palace", played: 25, won: 5, drawn: 9, lost: 11, gd: -15, points: 24, form: ["W", "D", "L", "D", "D"] },
     { position: 16, team: "Everton", played: 25, won: 5, drawn: 9, lost: 11, gd: -18, points: 24, form: ["D", "D", "L", "W", "L"] },
     { position: 17, team: "Ipswich", played: 25, won: 4, drawn: 9, lost: 12, gd: -20, points: 21, form: ["D", "D", "L", "D", "W"] },
     { position: 18, team: "Leicester", played: 25, won: 4, drawn: 6, lost: 15, gd: -25, points: 18, form: ["L", "L", "D", "L", "L"] },
     { position: 19, team: "Wolves", played: 25, won: 3, drawn: 5, lost: 17, gd: -28, points: 14, form: ["L", "L", "W", "L", "L"] },
     { position: 20, team: "Southampton", played: 25, won: 2, drawn: 4, lost: 19, gd: -35, points: 10, form: ["L", "L", "L", "D", "L"] }
  ],
  fixtures: [
     { homeTeam: "Man City", awayTeam: "Liverpool", time: "16:30", date: "Sunday", score: "", status: "upcoming", difficulty: { overall: 5, att: 5, def: 5 } },
     { homeTeam: "Arsenal", awayTeam: "Spurs", time: "12:30", date: "Saturday", score: "", status: "upcoming", difficulty: { overall: 4, att: 4, def: 4 } },
     { homeTeam: "Man Utd", awayTeam: "Chelsea", time: "17:30", date: "Saturday", score: "", status: "upcoming", difficulty: { overall: 3, att: 3, def: 3 } },
     { homeTeam: "Newcastle", awayTeam: "Aston Villa", time: "15:00", date: "Saturday", score: "", status: "upcoming", difficulty: { overall: 3, att: 2, def: 3 } },
     { homeTeam: "West Ham", awayTeam: "Everton", time: "20:00", date: "Monday", score: "", status: "upcoming", difficulty: { overall: 2, att: 2, def: 3 } }
  ],
  news: NEWS_ITEMS,
  scorers: [...ELITE_TRIO, ...MORE_TALENT],
  matchStats: RECENT_MATCHES,
  weeklyTip: "It's the business end of the season. Look for teams with everything to play for - title chasers and relegation fighters.",
  sackRace: FALLBACK_SACK_RACE
};

// HELPER: Normalize Team Names
const normalizeTeamName = (name: string): string => {
  if (!name) return "";
  const n = name.toLowerCase().trim();
  if (n.includes('man') && n.includes('city')) return 'Man City';
  if (n.includes('man') && n.includes('utd')) return 'Man Utd';
  if (n.includes('united') && !n.includes('newcastle') && !n.includes('west') && !n.includes('sheffield') && !n.includes('leeds')) return 'Man Utd'; 
  if (n.includes('forest')) return 'Nottingham Forest';
  if (n.includes('tottenham') || n === 'spurs') return 'Spurs';
  if (n.includes('wolves')) return 'Wolves';
  if (n.includes('brighton')) return 'Brighton';
  if (n.includes('leicester')) return 'Leicester';
  if (n.includes('west ham')) return 'West Ham';
  if (n.includes('palace')) return 'Crystal Palace';
  if (n.includes('villa')) return 'Aston Villa';
  return name;
};

// DATE ALIGNMENT HELPER
const alignDateToSeason = (dateStr: string): string => {
  if (!dateStr) return "";
  return dateStr;
};

// Helper to distribute goals into timing slots
const generateMockTiming = (totalGoals: number): GoalTiming => {
  const slots: (keyof GoalTiming)[] = ['0-15', '16-30', '31-45', '46-60', '61-75', '76-90+'];
  const timing: GoalTiming = {
    '0-15': 0, '16-30': 0, '31-45': 0, '46-60': 0, '61-75': 0, '76-90+': 0
  };
  
  let remaining = totalGoals;
  while (remaining > 0) {
    const slot = slots[Math.floor(Math.random() * slots.length)];
    timing[slot]++;
    remaining--;
  }
  return timing;
};

// Helper to generate a plausible form string based on stats if missing
const generateProbabilisticForm = (won: number, drawn: number, lost: number, played: number): string[] => {
  if (played === 0) return ['D', 'D', 'D', 'D', 'D'];
  
  // Create a bucket of results based on season performance
  const history: string[] = [];
  
  // Weight the history by actual stats
  for (let i = 0; i < won; i++) history.push('W');
  for (let i = 0; i < drawn; i++) history.push('D');
  for (let i = 0; i < lost; i++) history.push('L');
  
  // If we don't have enough history (e.g. played 2 games), fill with Draws
  while (history.length < 5) history.push('D');
  
  const form: string[] = [];
  
  // Generate 5 plausible results
  for(let i=0; i<5; i++) {
     const randomIndex = Math.floor(Math.random() * history.length);
     form.push(history[randomIndex]);
  }
  
  return form;
};

// Helper to generate mock scorers if missing
const generateMockScorers = (count: number, team: string): string[] => {
  const scorers: string[] = [];
  // Find mapped key players or default to generic if team not found (unlikely with normalization)
  const normalizedTeam = normalizeTeamName(team);
  const keyPlayers = KEY_PLAYERS[normalizedTeam] || ["Forward", "Midfielder", "Striker"];
  
  for(let i=0; i<count; i++) {
     const player = keyPlayers[Math.floor(Math.random() * keyPlayers.length)];
     const minute = Math.floor(Math.random() * 88) + 2; // Random minute 2-90
     scorers.push(`${player} ${minute}'`);
  }
  
  // Sort by minute
  return scorers.sort((a, b) => {
      const minA = parseInt(a.split(' ').pop()?.replace("'", "") || "0");
      const minB = parseInt(b.split(' ').pop()?.replace("'", "") || "0");
      return minA - minB;
  });
};

// ROBUST FORM PARSER
const parseForm = (input: any): string[] => {
  if (!input) return [];
  let cleanArray: string[] = [];

  try {
    if (Array.isArray(input)) {
        cleanArray = input.map(i => String(i).charAt(0).toUpperCase());
    } else if (typeof input === 'string') {
        // Handle "W,D,L,W,W" or "W D L W W" or "WWDDL"
        if (input.includes(',')) {
          cleanArray = input.split(',').map(s => s.trim().charAt(0).toUpperCase());
        } else if (input.includes(' ')) {
          cleanArray = input.split(' ').map(s => s.trim().charAt(0).toUpperCase());
        } else {
          cleanArray = input.split('').map(s => s.toUpperCase());
        }
    }
  } catch (e) {
    console.warn("Form parsing error", e);
    return [];
  }
  
  return cleanArray.filter(c => ['W', 'D', 'L'].includes(c)).slice(-5);
};

export const fetchPremierLeagueData = async (): Promise<AppData> => {
  // 1. Check Cache
  const cachedRaw = localStorage.getItem(CACHE_KEY);
  if (cachedRaw) {
    try {
      const cached: AppData = JSON.parse(cachedRaw);
      const now = Date.now();
      if (now - cached.lastUpdated < CACHE_DURATION) {
        console.log("Using cached data");
        return cached;
      }
    } catch (e) {
      console.error("Cache parse error", e);
    }
  }

  // 2. Check API Key
  if (!process.env.API_KEY) {
    console.warn("No API Key found. Using fallback/mock data.");
    return FALLBACK_DATA;
  }

  // 3. Dynamic Date Calculation for Prompt
  const today = new Date();
  const dateString = today.toLocaleDateString("en-US", { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });
  
  const seasonString = "2024/2025";

  // 4. Fetch from Gemini
  console.log(`Fetching fresh live data from Gemini for ${dateString} (${seasonString} season)...`);
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const model = "gemini-2.5-flash";

  const prompt = `
    You are a specialized Premier League Football Data API.
    
    **CONTEXT:**
    The current date is **${dateString}**.
    
    **CRITICAL INSTRUCTION:**
    Use the 'googleSearch' tool to find the **LATEST, LIVE Premier League data for the ${seasonString} season**.
    Do NOT rely on your internal training data cut-off. You MUST search for the current live standings, results, and fixtures.
    
    **DATA REQUIREMENTS:**
    1.  **Current Gameweek:** Determine the actual current gameweek number.
    2.  **League Table ('table'):** 
        - Return ALL 20 TEAMS with their *actual* current live stats (Played, Won, Drawn, Lost, GD, Points).
        - **IMPORTANT:** Provide the last 5 match results for EVERY team in 'form' array (e.g., ["W", "D", "L", "W", "W"]).
    3.  **Upcoming Fixtures ('fixtures'):** 
        - Find the next 5 upcoming fixtures relative to ${dateString}.
        - Ensure the dates are accurate (e.g. "Saturday", "Sunday" or "YYYY-MM-DD").
    4.  **Top Scorers ('scorers'):** 
        - Real current top scorers list for ${seasonString}.
        - **IMPORTANT:** Return the correct **SQUAD NUMBER** (shirt number) for each player.
    5.  **News ('news'):** Real breaking news headlines from the last 24-48 hours.
    6.  **Match Stats ('matchStats'):** 
        - Return a list of the LAST 10 COMPLETED Premier League matches. 
        - **CRITICAL:** You MUST list the scorers for every goal in the 'homeScorers' and 'awayScorers' arrays. 
    7.  **Sack Race ('sackRace'):** 
        - Identify 5 managers currently under pressure based on recent results.
        - Set 'temperature' high (e.g., 70-95) for those most at risk.

    **OUTPUT STRUCTURE (Single JSON Object Only):**
    {
      "lastUpdated": <number>,
      "currentGameweek": number,
      "weeklyTip": "string",
      "table": [ 
        { "position": number, "team": string, "played": number, "won": number, "drawn": number, "lost": number, "gd": number, "points": number, "form": string[] }
      ],
      "fixtures": [
        { "homeTeam": string, "awayTeam": string, "time": string, "date": string, "score": string, "status": "upcoming"|"live"|"finished", "fdrRating": number, "gameweek": number, "difficulty": { "overall": number, "att": number, "def": number } }
      ],
      "news": [
        { "id": number, "title": string, "summary": string, "image": string, "source": string, "url": string, "time": string, "quote": string, "isAdvanced": boolean }
      ],
      "scorers": [
        { "name": string, "team": string, "shirtNumber": number, "goals": number, "penalties": number, "homeGoals": number, "awayGoals": number, "assists": number, "boots": string, "price": string, "link": string, "transferSentiment": "up"|"down"|"stable" }
      ],
      "matchStats": [
        { "id": number, "homeTeam": string, "awayTeam": string, "score": string, "date": string, "homeScorers": string[], "awayScorers": string[], "possession": { "home": number, "away": number }, "shots": { "home": number, "away": number }, "shotsOnTarget": { "home": number, "away": number } }
      ],
      "sackRace": [
        { "manager": string, "team": string, "temperature": number, "gafferVerdict": string, "nextManager": string, "odds": string }
      ]
    }
  `;

  let attempts = 0;
  const maxAttempts = 3;

  while (attempts < maxAttempts) {
    try {
      const response = await ai.models.generateContent({
        model: model,
        contents: prompt,
        config: {
          tools: [{ googleSearch: {} }],
        }
      });

      if (response.text) {
        let jsonString = response.text.trim();
        
        // Remove markdown code blocks if present (Gemini often adds them even when asked not to)
        // Improved regex to handle various markdown code block formats
        jsonString = jsonString.replace(/^```json\s*/i, '').replace(/^```\s*/i, '').replace(/```\s*$/i, '');

        const startIndex = jsonString.indexOf('{');
        const endIndex = jsonString.lastIndexOf('}');

        if (startIndex !== -1 && endIndex !== -1 && endIndex > startIndex) {
          jsonString = jsonString.substring(startIndex, endIndex + 1);
        } else {
           // Retry might help if no JSON found
           throw new Error("No valid JSON object found in response");
        }
        
        const rawData = JSON.parse(jsonString);
        
        // Normalize Table Data
        let maxPlayed = 0;
        const normalizedTable = (rawData.table || []).map((t: any) => {
           const played = Number(t.played) || 0;
           if (played > maxPlayed) maxPlayed = played;
           
           const won = Number(t.won) || 0;
           const drawn = Number(t.drawn) || 0;
           const lost = Number(t.lost) || 0;

           let form = parseForm(t.form);

           // ROBUST FALLBACK: If form is missing or incomplete (less than 5 and played >= 5), generate a plausible one
           if ((form.length < 5 && played >= 5) || form.length === 0) {
              form = generateProbabilisticForm(won, drawn, lost, played);
           }
           
           return {
             ...t,
             team: normalizeTeamName(t.team),
             played: played,
             won: won,
             drawn: drawn,
             lost: lost,
             gd: Number(t.gd) || 0,
             points: Number(t.points) || 0,
             form: form
           };
        });

        // Sort table strictly by Points -> GD -> Goals
        normalizedTable.sort((a: any, b: any) => {
           if (b.points !== a.points) return b.points - a.points;
           if (b.gd !== a.gd) return b.gd - a.gd;
           return 0; 
        });

        const finalTable = normalizedTable.map((t: any, idx: number) => ({
           ...t,
           position: idx + 1
        }));

        const gamesPlayedBasedGW = Math.ceil(maxPlayed);
        const rawGW = rawData.currentGameweek || 0;
        const calculatedGameweek = Math.max(gamesPlayedBasedGW, rawGW);

        const rawSackRace = rawData.sackRace && Array.isArray(rawData.sackRace) && rawData.sackRace.length > 0
          ? rawData.sackRace
          : FALLBACK_SACK_RACE;

        const processedData: AppData = {
          lastUpdated: Date.now(),
          currentGameweek: calculatedGameweek || FALLBACK_DATA.currentGameweek,
          weeklyTip: rawData.weeklyTip || FALLBACK_DATA.weeklyTip,
          
          table: finalTable.length > 0 ? finalTable : FALLBACK_DATA.table,
          
          fixtures: (rawData.fixtures || []).map((f: any) => {
            const overall = Number(f.difficulty?.overall) || Number(f.fdrRating) || 3;
            const att = Number(f.difficulty?.att) || overall;
            const def = Number(f.difficulty?.def) || overall;

            return {
              ...f,
              homeTeam: normalizeTeamName(f.homeTeam),
              awayTeam: normalizeTeamName(f.awayTeam),
              date: alignDateToSeason(f.date).replace(/-/g, '/'),
              status: ['upcoming', 'live', 'finished'].includes(f.status) ? f.status : 'upcoming',
              fdrRating: overall,
              gameweek: f.gameweek || calculatedGameweek,
              difficulty: { overall, att, def }
            };
          }),
          
          news: (rawData.news || []).map((item: any, index: number) => {
              const isAdvanced = !!item.isAdvanced;
              let image = item.image;
              
              if (!image || !image.startsWith('http')) {
                  image = isAdvanced 
                    ? "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1000&auto=format&fit=crop"
                    : NEWS_ITEMS[index % NEWS_ITEMS.length]?.image || "Man City.png";
              }

              const searchQuery = encodeURIComponent(`${item.title} ${item.source || ''} Premier League news`);
              const safeUrl = `https://www.google.com/search?q=${searchQuery}`;

              return {
                  ...item,
                  image: image,
                  url: safeUrl, 
                  isAdvanced: isAdvanced,
                  quote: item.quote || "",
                  time: alignDateToSeason(item.time)
              };
          }),
          
          scorers: (rawData.scorers || []).map((player: any, index: number) => {
             const fallbackImg = [...ELITE_TRIO, ...MORE_TALENT].find(p => 
               player.name.includes(p.name.split(' ').pop() || '') || 
               p.name.includes(player.name.split(' ').pop() || '')
             )?.image;

             const safeImage = fallbackImg || getTeamLogo(player.team) || "Man City.png";
             const totalGoals = player.goals || 0;
             const timing = generateMockTiming(totalGoals); 

             return {
               ...player,
               goals: totalGoals,
               shirtNumber: Number(player.shirtNumber) || 9,
               penalties: player.penalties || 0,
               homeGoals: player.homeGoals || Math.ceil(totalGoals * 0.55),
               awayGoals: player.awayGoals || Math.floor(totalGoals * 0.45),
               assists: player.assists || 0,
               boots: player.boots || "Nike Phantom GX 2",
               price: player.price || "£230", 
               link: player.link || `https://www.amazon.co.uk/s?k=${encodeURIComponent(player.boots || "football boots")}&tag=premierleaguetables-21`,
               image: safeImage,
               rank: index < 3 ? (index === 0 ? 'gold' : index === 1 ? 'silver' : 'bronze') : undefined,
               goalTiming: timing,
               transferSentiment: ['up', 'down', 'stable'].includes(player.transferSentiment) ? player.transferSentiment : 'stable'
             };
          }),
          
          matchStats: (rawData.matchStats || RECENT_MATCHES).map((m: any) => {
              const homeTeam = normalizeTeamName(m.homeTeam);
              const awayTeam = normalizeTeamName(m.awayTeam);
              
              // Parse Score to determine needed scorers
              let homeGoals = 0;
              let awayGoals = 0;
              // Clean score string
              const cleanScore = m.score ? m.score.replace(/\s+/g, '') : "0-0";
              
              if (cleanScore.includes('-')) {
                  const parts = cleanScore.split('-');
                  homeGoals = parseInt(parts[0]) || 0;
                  awayGoals = parseInt(parts[1]) || 0;
              } else if (cleanScore.includes(':')) {
                   const parts = cleanScore.split(':');
                   homeGoals = parseInt(parts[0]) || 0;
                   awayGoals = parseInt(parts[1]) || 0;
              }

              let homeScorers = Array.isArray(m.homeScorers) ? m.homeScorers : [];
              let awayScorers = Array.isArray(m.awayScorers) ? m.awayScorers : [];

              // Fix missing scorers if lists are empty but goals exist
              if (homeGoals > 0 && homeScorers.length === 0) {
                 homeScorers = generateMockScorers(homeGoals, homeTeam);
              }
              if (awayGoals > 0 && awayScorers.length === 0) {
                 awayScorers = generateMockScorers(awayGoals, awayTeam);
              }

              // Fix insufficient scorers (e.g. score 2-0 but only 1 scorer listed)
              // This is a defensive fix for partial data
              if (homeScorers.length < homeGoals) {
                 const missing = homeGoals - homeScorers.length;
                 homeScorers = [...homeScorers, ...generateMockScorers(missing, homeTeam)];
              }
              if (awayScorers.length < awayGoals) {
                 const missing = awayGoals - awayScorers.length;
                 awayScorers = [...awayScorers, ...generateMockScorers(missing, awayTeam)];
              }

              return {
                  ...m,
                  homeTeam,
                  awayTeam,
                  homeScorers,
                  awayScorers,
                  date: alignDateToSeason(m.date)
              };
          }),

          sackRace: rawSackRace.map((m: any) => ({
            manager: m.manager || "Unknown Manager",
            team: normalizeTeamName(m.team), 
            temperature: Number(m.temperature) || 50,
            gafferVerdict: m.gafferVerdict || "The pressure is on.",
            nextManager: m.nextManager || "Big Sam",
            odds: m.odds || "10/1"
          }))
        };

        localStorage.setItem(CACHE_KEY, JSON.stringify(processedData));
        return processedData;
      }
    } catch (error) {
      console.error(`Gemini API Error (Attempt ${attempts + 1}/${maxAttempts}):`, error);
      attempts++;
      if (attempts < maxAttempts) await new Promise(resolve => setTimeout(resolve, 1000 * Math.pow(2, attempts)));
    }
  }

  return FALLBACK_DATA;
};
