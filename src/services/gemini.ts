
import { GoogleGenAI } from "@google/genai";
import { AppData, GoalTiming, SackRaceEntry, Fixture } from "../../types";
import { ELITE_TRIO, MORE_TALENT, NEWS_ITEMS, RECENT_MATCHES, getTeamLogo, FALLBACK_DATA } from "../constants";

const CACHE_KEY = 'premier_league_hub_data_v113_live_refresh'; 
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

// Fallback Sack Race (Derived from FALLBACK_DATA to keep consistency)
const FALLBACK_SACK_RACE: SackRaceEntry[] = FALLBACK_DATA.sackRace || [];

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
  
  const history: string[] = [];
  for (let i = 0; i < won; i++) history.push('W');
  for (let i = 0; i < drawn; i++) history.push('D');
  for (let i = 0; i < lost; i++) history.push('L');
  
  while (history.length < 5) history.push('D');
  
  const form: string[] = [];
  for(let i=0; i<5; i++) {
     const randomIndex = Math.floor(Math.random() * history.length);
     form.push(history[randomIndex]);
  }
  
  return form;
};

// Helper to generate mock scorers if missing
const generateMockScorers = (count: number, team: string): string[] => {
  const scorers: string[] = [];
  const normalizedTeam = normalizeTeamName(team);
  const keyPlayers = KEY_PLAYERS[normalizedTeam] || ["Forward", "Midfielder", "Striker"];
  
  for(let i=0; i<count; i++) {
     const player = keyPlayers[Math.floor(Math.random() * keyPlayers.length)];
     const minute = Math.floor(Math.random() * 88) + 2; 
     scorers.push(`${player} ${minute}'`);
  }
  
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
        if (input.includes(',')) {
          cleanArray = input.split(',').map(s => s.trim().charAt(0).toUpperCase());
        } else if (input.includes(' ')) {
          cleanArray = input.split(' ').map(s => s.trim().charAt(0).toUpperCase());
        } else {
          cleanArray = input.split('').map(s => s.toUpperCase());
        }
    }
  } catch (e) {
    // console.warn("Form parsing error", e);
    return [];
  }
  
  return cleanArray.filter(c => ['W', 'D', 'L'].includes(c)).slice(-5);
};

export const fetchPremierLeagueData = async (): Promise<AppData> => {
  const cachedRaw = localStorage.getItem(CACHE_KEY);
  if (cachedRaw) {
    try {
      const cached: AppData = JSON.parse(cachedRaw);
      const now = Date.now();
      if (now - cached.lastUpdated < CACHE_DURATION) {
        // console.log("Using cached data");
        return cached;
      }
    } catch (e) {
      // console.error("Cache parse error", e);
    }
  }

  if (typeof import.meta.env === 'undefined' || !import.meta.env?.API_KEY) {
    // console.warn("No API Key found. Using fallback/mock data.");
    return FALLBACK_DATA;
  }

  const today = new Date();
  const dateString = today.toLocaleDateString("en-US", { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });
  
  // Calculate dynamic season string
  const currentMonth = today.getMonth(); // 0-11
  const currentYear = today.getFullYear();
  // Season usually runs Aug to May. 
  // If Month is Jan(0) to June(5), season started prev year.
  // If Month is July(6) to Dec(11), season started current year.
  const startYear = currentMonth < 6 ? currentYear - 1 : currentYear;
  const endYear = startYear + 1;
  const seasonString = `${startYear}/${endYear}`;

  // console.log(`Fetching fresh live data from Gemini for ${dateString} (${seasonString} season)...`);
  const ai = new GoogleGenAI({ apiKey: import.meta.env.API_KEY });
  const model = "gemini-2.5-flash";

  const prompt = `
    You are a specialized Premier League Football Data API.
    
    **CONTEXT:**
    The current real-world date is **${dateString}**.
    
    **CRITICAL INSTRUCTION:**
    Use the 'googleSearch' tool to find the **LATEST, LIVE Premier League Standings and Fixtures for the ${seasonString} season**.
    The user is complaining that the data is not up to date. You MUST search for the table AS IT STANDS TODAY.
    
    **DATA REQUIREMENTS:**
    1.  **Current Gameweek:** Determine the actual current gameweek number active today.
    2.  **League Table ('table'):** 
        - Return ALL 20 TEAMS with their *actual* live stats (Played, Won, Drawn, Lost, GD, Points).
        - Verify specific teams: Check Liverpool, Man City, Arsenal points specifically to ensure accuracy.
        - **IMPORTANT:** Provide the last 5 match results for EVERY team in 'form' array.
    3.  **Upcoming Fixtures ('fixtures'):** 
        - Find the next 5 upcoming fixtures from ${dateString}.
        - Ensure dates are specific (e.g. "Saturday 14 Dec").
    4.  **Top Scorers ('scorers'):** 
        - Real current top 10 scorers.
    5.  **News ('news'):** Real breaking news headlines from the last 24h.
    6.  **Match Stats ('matchStats'):** 
        - Return a list of the LAST 5 COMPLETED Premier League matches. (Limit to 5 to prevent JSON errors).
        - **CRITICAL:** Ensure valid JSON formatting.
    7.  **Sack Race ('sackRace'):** 
        - Managers currently under pressure.

    **OUTPUT STRUCTURE (Single JSON Object Only - NO Markdown):**
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
        
        jsonString = jsonString.replace(/^```json\s*/i, '').replace(/^```\s*/i, '').replace(/```\s*$/i, '');

        const startIndex = jsonString.indexOf('{');
        const endIndex = jsonString.lastIndexOf('}');

        if (startIndex !== -1 && endIndex !== -1 && endIndex > startIndex) {
          jsonString = jsonString.substring(startIndex, endIndex + 1);
          
          // Attempt to repair common JSON array errors (missing comma between objects)
          // Replaces "} {" or "}\n{" with "}, {"
          jsonString = jsonString.replace(/}\s*(?={)/g, '}, ');
          // Replaces "] \"" or "]\n\"" with "], \"" (missing comma between array end and next key)
          jsonString = jsonString.replace(/]\s*(?=")/g, '], ');
        } else {
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
              
              // Parse Score
              let homeGoals = 0;
              let awayGoals = 0;
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

              if (homeGoals > 0 && homeScorers.length === 0) {
                 homeScorers = generateMockScorers(homeGoals, homeTeam);
              }
              if (awayGoals > 0 && awayScorers.length === 0) {
                 awayScorers = generateMockScorers(awayGoals, awayTeam);
              }

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
      // console.error(`Gemini API Error (Attempt ${attempts + 1}/${maxAttempts}):`, error);
      attempts++;
      if (attempts < maxAttempts) await new Promise(resolve => setTimeout(resolve, 1000 * Math.pow(2, attempts)));
    }
  }

  return FALLBACK_DATA;
};

export const generateNewsletterContent = async (fixtures: Fixture[]) => {
  if (!import.meta.env.API_KEY || fixtures.length === 0) return null;

  const bigSix = ['Arsenal', 'Man City', 'Liverpool', 'Chelsea', 'Man Utd', 'Spurs'];
  const bigMatch = fixtures.find(f => 
    bigSix.some(t => f.homeTeam.includes(t)) && bigSix.some(t => f.awayTeam.includes(t))
  ) || fixtures[0];

  if (!bigMatch) return null;

  const ai = new GoogleGenAI({ apiKey: import.meta.env.API_KEY });
  const model = "gemini-2.5-flash";

  const prompt = `
    You are 'The Gaffer', a cynical, old-school British football manager writing a weekly email newsletter.
    
    **CONTEXT:**
    The big match this weekend is **${bigMatch.homeTeam} vs ${bigMatch.awayTeam}**.
    
    **TASK:**
    Write the content for this week's newsletter in JSON format.
    Tone: Cynical, passionate, slight use of slang (lads, gaffer, squeaky bum time), but professional enough for an email.
    
    **REQUIRED JSON OUTPUT:**
    {
      "headline": "A short, punchy, tabloid-style headline about the big match (max 6 words).",
      "intro": "A 2-3 sentence intro welcoming the readers ('Right lads...'), mentioning the upcoming weekend action generally.",
      "analysis": "A deep dive paragraph (approx 60 words) analyzing ${bigMatch.homeTeam} vs ${bigMatch.awayTeam}. Mention form or stakes.",
      "tip": "A specific betting/fantasy tip for this match (e.g. 'Put a tenner on a Red Card').",
      "verdict": "A 3-word final verdict (e.g. 'Home Win. Easy.')."
    }
  `;

  try {
    const response = await ai.models.generateContent({
      model: model,
      contents: prompt
    });

    if (response.text) {
      let jsonString = response.text.trim();
      jsonString = jsonString.replace(/^```json\s*/i, '').replace(/^```\s*/i, '').replace(/```\s*$/i, '');
      const startIndex = jsonString.indexOf('{');
      const endIndex = jsonString.lastIndexOf('}');
      
      if (startIndex !== -1 && endIndex !== -1) {
        const data = JSON.parse(jsonString.substring(startIndex, endIndex + 1));
        return { ...data, match: bigMatch };
      }
    }
  } catch (e) {
    // console.error("Newsletter Generation Failed", e);
  }
  return null;
};


