
import type { VercelRequest, VercelResponse } from '@vercel/node';
import { TwitterApi } from 'twitter-api-v2';
import axios from 'axios';
import { kv } from '@vercel/kv';
import { GAFFER_QUIPS } from '../src/data/gafferQuotes';

// --- CONFIGURATION ---
const API_FOOTBALL_KEY = process.env.API_FOOTBALL_KEY;
const KO_FI_LINK = "https://ko-fi.com/premierleaguetables";
const SITE_LINK = "premierleaguetables.com";

// Twitter Client Init
const twitterClient = new TwitterApi({
  appKey: process.env.TWITTER_API_KEY!,
  appSecret: process.env.TWITTER_API_SECRET!,
  accessToken: process.env.TWITTER_ACCESS_TOKEN!,
  accessSecret: process.env.TWITTER_ACCESS_SECRET!,
});

// --- HELPER FUNCTIONS ---

// 1. Generate SVG Snapshot (Lightweight Image Generation)
const generateSnapshotSvg = (event: any, text: string) => {
  const teamColor = "#1a472a"; // Gaffer Green
  const accentColor = "#d4af37"; // Gaffer Gold
  
  // Basic SVG Template mimicking the Polaroid component
  return `
  <svg width="600" height="400" viewBox="0 0 600 400" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="bg" x1="0" x2="0" y1="0" y2="1">
        <stop offset="0%" stop-color="#fdfbf7"/>
        <stop offset="100%" stop-color="#f2efe9"/>
      </linearGradient>
    </defs>
    
    <!-- Background Paper -->
    <rect width="600" height="400" fill="url(#bg)"/>
    
    <!-- Photo Frame Area -->
    <rect x="20" y="20" width="560" height="300" fill="#0f172a" stroke="#d4af37" stroke-width="4"/>
    
    <!-- Chalkboard Texture Placeholder -->
    <rect x="25" y="25" width="550" height="290" fill="#1a472a" opacity="0.9"/>
    
    <!-- Event Text -->
    <text x="300" y="140" font-family="Courier New, monospace" font-weight="bold" font-size="60" fill="#d4af37" text-anchor="middle">
      ${event.type.toUpperCase()}
    </text>
    
    <text x="300" y="200" font-family="Arial, sans-serif" font-weight="bold" font-size="40" fill="white" text-anchor="middle">
      ${event.player.name} (${event.time.elapsed}')
    </text>
    
    <text x="300" y="260" font-family="Arial, sans-serif" font-size="30" fill="#cbd5e1" text-anchor="middle">
      ${event.team.name}
    </text>

    <!-- Gaffer Stamp (Bottom Right) -->
    <g transform="translate(400, 340) rotate(-5)">
       <rect x="0" y="0" width="180" height="40" rx="5" stroke="#b91c1c" stroke-width="3" fill="none" opacity="0.7"/>
       <text x="90" y="28" font-family="Impact, sans-serif" font-size="20" fill="#b91c1c" text-anchor="middle" opacity="0.8">GAFFER APPROVED</text>
    </g>

    <!-- Site Branding (Bottom Left) -->
    <text x="30" y="370" font-family="Courier New, monospace" font-weight="bold" font-size="16" fill="#0f172a">
      ${SITE_LINK}
    </text>
  </svg>
  `;
};

const getRandomQuip = (category: keyof typeof GAFFER_QUIPS, data: any) => {
  const templates = GAFFER_QUIPS[category];
  if (!templates) return "Proper football, that.";
  
  const template = templates[Math.floor(Math.random() * templates.length)];
  return template
    .replace('{scorer}', data.player?.name || 'Unknown')
    .replace('{player}', data.player?.name || 'Unknown')
    .replace('{team}', data.team?.name || 'Team')
    .replace('{minute}', data.time?.elapsed || '0')
    .replace('{link}', KO_FI_LINK);
};

// --- MAIN HANDLER ---

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Security Check (Basic Cron Secret if set)
  if (process.env.CRON_SECRET && req.headers.authorization !== `Bearer ${process.env.CRON_SECRET}`) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    // 1. Fetch Live Matches from API-Football
    // (In production, replace '39' with actual Premier League ID)
    const response = await axios.get('https://v3.football.api-sports.io/fixtures', {
      headers: { 'x-apisports-key': API_FOOTBALL_KEY },
      params: { live: '39' } // PL ID is 39
    });

    const liveMatches = response.data.response;

    if (!liveMatches || liveMatches.length === 0) {
      return res.status(200).json({ message: 'No live PL matches found. Gaffer is sleeping.' });
    }

    const processedEvents = [];

    // 2. Iterate Matches
    for (const match of liveMatches) {
      const fixtureId = match.fixture.id;
      const events = match.events;

      if (!events) continue;

      // 3. Check for New Events (using KV for state)
      // Key format: gaffer_processed_{fixtureId} -> [eventId1, eventId2]
      const kvKey = `gaffer_processed_${fixtureId}`;
      const processedIds: any[] = (await kv.get(kvKey)) || [];
      const newEvents = events.filter((e: any) => !processedIds.includes(JSON.stringify(e)));

      for (const event of newEvents) {
        // Determine Tweet Category
        let category: keyof typeof GAFFER_QUIPS | null = null;
        
        if (event.type === 'Goal') {
           if (event.detail === 'Own Goal') category = 'OWN_GOAL';
           else if (event.detail === 'Penalty') category = 'PENALTY_GOAL';
           else if (event.comments === 'Missed Penalty') category = 'PENALTY_MISS';
           else {
              // Simple heuristic for position based on no data: default to Forward logic
              category = 'GOAL_FORWARD'; 
           }
        } else if (event.type === 'Card') {
           category = event.detail === 'Red Card' ? 'RED_CARD' : 'YELLOW_CARD';
        }

        if (category) {
          // 4. Generate Content
          const quip = getRandomQuip(category, event);
          const tweetText = `${quip} ⚽\n\n#PL #${match.teams.home.name.replace(/\s/g,'')}vs${match.teams.away.name.replace(/\s/g,'')}\n\nCheck the chaos: https://${SITE_LINK}`;

          // 5. Generate Image (SVG -> Buffer)
          // Note: In Vercel Serverless, we can't easily use Canvas/Puppeteer for heavy lifting.
          // We will upload the SVG directly as media if Twitter supports it, or base64.
          // Twitter API v2 Media Upload is complex in Node without Buffer.
          // For MVP reliability on Free Tier Vercel, we'll tweet Text Only first, 
          // or use a pre-hosted image URL if we had one.
          // However, let's try to just post the text to ensure reliability first.
          
          try {
             await twitterClient.v2.tweet(tweetText);
             console.log(`Tweeted: ${tweetText}`);
          } catch (twError) {
             console.error('Twitter Error:', twError);
          }

          // 6. Update State
          processedIds.push(JSON.stringify(event));
          processedEvents.push(event);
        }
      }

      // Save updated state back to KV
      if (newEvents.length > 0) {
        await kv.set(kvKey, processedIds, { ex: 86400 }); // Expire in 24h
      }
    }

    return res.status(200).json({ 
      status: 'Success', 
      matches: liveMatches.length, 
      newEvents: processedEvents.length 
    });

  } catch (error) {
    console.error('Gaffer Bot Error:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}
