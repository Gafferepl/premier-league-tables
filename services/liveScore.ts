
export interface LiveScoreMatch {
  homeTeam: string;
  awayTeam: string;
  score: string;
  time: string; // e.g. "45'", "HT", "88'"
  status: 'live' | 'paused';
}

const API_KEY = process.env.VITE_FOOTBALL_DATA_KEY;
const API_URL = 'https://api.football-data.org/v4/competitions/PL/matches?status=IN_PLAY,PAUSED';

// Helper to check if we should poll based on UK time rules
// Returns true during active match windows to save API calls
const shouldPoll = (): boolean => {
  // If no API key is present, always "poll" (return mock data) so devs can see the UI
  if (!API_KEY) return true;

  const now = new Date();
  // Create date object strictly for London Time
  const ukDateStr = now.toLocaleString("en-US", { timeZone: "Europe/London" });
  const ukTime = new Date(ukDateStr);
  
  const day = ukTime.getDay(); // 0 = Sun, 1 = Mon, ..., 6 = Sat
  const hour = ukTime.getHours();

  // Saturday (6): 11:00 - 22:00
  if (day === 6 && hour >= 11 && hour < 22) return true;
  
  // Sunday (0): 13:00 - 19:00
  if (day === 0 && hour >= 13 && hour < 19) return true;
  
  // Weekdays (1-5): 18:00 - 23:00 (Evening games)
  if (day >= 1 && day <= 5 && hour >= 18 && hour < 23) return true;

  return false;
};

export const fetchLiveScores = async (): Promise<LiveScoreMatch[]> => {
  // 1. Mock Mode (Fallback if no key)
  if (!API_KEY) {
    console.log("LiveScore: No API Key found. Returning simulated live scores.");
    return [
      {
        homeTeam: "Man Utd",
        awayTeam: "Liverpool",
        score: "1 - 2",
        time: "88'",
        status: "live"
      },
      {
        homeTeam: "Arsenal",
        awayTeam: "Spurs",
        score: "2 - 2",
        time: "90+4'",
        status: "live"
      },
      {
        homeTeam: "Chelsea",
        awayTeam: "Fulham",
        score: "0 - 0",
        time: "HT",
        status: "paused"
      }
    ];
  }

  // 2. Smart Polling Optimization
  if (!shouldPoll()) {
    // Outside match windows, return empty to hide the bar and save quota
    return [];
  }

  // 3. Real API Call
  try {
    const response = await fetch(API_URL, {
      headers: {
        'X-Auth-Token': API_KEY
      }
    });

    if (!response.ok) {
        if (response.status === 429) {
            console.warn("LiveScore: Rate limited (429). Skipping update.");
            return [];
        }
        throw new Error(`Football-Data API Error: ${response.status}`);
    }

    const data = await response.json();
    
    if (!data.matches) return [];

    return data.matches.map((m: any) => {
        const homeScore = m.score.fullTime.home ?? 0;
        const awayScore = m.score.fullTime.away ?? 0;
        
        // Format Time
        let timeDisplay = "LIVE";
        if (m.status === 'PAUSED') timeDisplay = "HT";
        else if (m.minute) timeDisplay = `${m.minute}'`;

        return {
            homeTeam: m.homeTeam.shortName || m.homeTeam.name,
            awayTeam: m.awayTeam.shortName || m.awayTeam.name,
            score: `${homeScore} - ${awayScore}`,
            time: timeDisplay,
            status: m.status === 'PAUSED' ? 'paused' : 'live'
        };
    });

  } catch (error) {
    console.error("LiveScore Fetch Error:", error);
    return [];
  }
};
