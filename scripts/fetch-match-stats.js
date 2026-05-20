// Fetch Premier League match stats and cache in Supabase
// Run with: node scripts/fetch-match-stats.js [--force]
//
// Data sources (no API keys required):
//   SofaScore API    → real possession, shots, shots on target per match
//   football-data.org → real goal scorers (uses VITE_FOOTBALL_DATA_API_KEY from .env)

import https from 'https';
import http from 'http';
import zlib from 'zlib';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ─── Environment ──────────────────────────────────────────────────────────────

function loadEnv() {
  for (const name of ['.env', '.env.local']) {
    const envPath = path.join(__dirname, '..', name);
    if (fs.existsSync(envPath)) {
      const content = fs.readFileSync(envPath, 'utf-8');
      content.split('\n').forEach(line => {
        const [key, ...vals] = line.split('=');
        if (key && vals.length > 0) process.env[key.trim()] = vals.join('=').trim();
      });
    }
  }
}

loadEnv();

// ─── Config ───────────────────────────────────────────────────────────────────

const SUPABASE_HOST = 'yvxxhetkunjwqzembixl.supabase.co';
const SUPABASE_KEY  = process.env.SUPABASE_SERVICE_ROLE_KEY ||
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl2eHhoZXRrdW5qd3F6ZW1iaXhsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ2MjUyMDMsImV4cCI6MjA5MDIwMTIwM30.eGstpgxKSZ_IrLhzOpgqNFXBouHWD3gjNu_73oh8Nkg';
const FD_API_KEY    = process.env.VITE_FOOTBALL_DATA_API_KEY || '';

const SF_PL_UT      = 17;     // Sofascore Premier League unique-tournament ID
const SF_PL_SEASON  = 76986;  // Sofascore PL 2025/26 season ID
const CACHE_HOURS   = 6;
const SEASON        = 2025;

const SF_HEADERS = {
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
  'Accept': 'application/json, text/plain, */*',
  'Accept-Encoding': 'gzip, deflate, br',
  'Referer': 'https://www.sofascore.com/',
  'Origin': 'https://www.sofascore.com',
};

const PREMIER_LEAGUE_TEAMS = [
  { id: 17, name: 'Manchester City' },
  { id: 42, name: 'Arsenal' },
  { id: 35, name: 'Manchester United' },
  { id: 44, name: 'Liverpool FC' },
  { id: 33, name: 'Tottenham Hotspur' },
  { id: 38, name: 'Chelsea' },
  { id: 40, name: 'Aston Villa' },
  { id: 39, name: 'Newcastle United' },
  { id: 30, name: 'Brighton & Hove Albion' },
  { id: 50, name: 'Brentford' },
  { id: 37, name: 'West Ham United' },
  { id: 7,  name: 'Crystal Palace' },
  { id: 60, name: 'Bournemouth' },
  { id: 14, name: 'Nottingham Forest' },
  { id: 48, name: 'Everton' },
  { id: 34, name: 'Leeds United' },
  { id: 3,  name: 'Wolverhampton' },
  { id: 41, name: 'Sunderland' },
  { id: 6,  name: 'Burnley' },
  { id: 43, name: 'Fulham' },
];

// ─── HTTP helpers ──────────────────────────────────────────────────────────────

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function httpGet(url) {
  return new Promise((resolve, reject) => {
    const req = https.get(url, { headers: SF_HEADERS }, (res) => {
      if (res.statusCode === 302 || res.statusCode === 301) {
        return httpGet(res.headers.location).then(resolve).catch(reject);
      }
      if (res.statusCode !== 200) {
        return reject(new Error(`HTTP ${res.statusCode} for ${url}`));
      }

      const chunks = [];
      const gunzip = zlib.createGunzip();
      res.pipe(gunzip);
      gunzip.on('data', chunk => chunks.push(chunk));
      gunzip.on('end', () => {
        try {
          resolve(JSON.parse(Buffer.concat(chunks).toString()));
        } catch (e) {
          reject(e);
        }
      });
      gunzip.on('error', reject);
    });
    req.on('error', reject);
    req.setTimeout(15000, () => {
      req.destroy();
      reject(new Error(`Timeout for ${url}`));
    });
  });
}

// ─── Supabase helpers ─────────────────────────────────────────────────────────

function supabaseRequest(method, urlPath, body = null, extraQuery = '') {
  return new Promise((resolve, reject) => {
    const payload = body ? JSON.stringify(body) : null;
    const headers = {
      'apikey':        SUPABASE_KEY,
      'Authorization': `Bearer ${SUPABASE_KEY}`,
    };
    if (method === 'POST' && extraQuery.includes('on_conflict')) {
      headers['Prefer'] = 'resolution=merge-duplicates,return=minimal';
    } else if (method !== 'GET') {
      headers['Prefer'] = 'return=minimal';
    }
    if (payload) {
      headers['Content-Type']   = 'application/json';
      headers['Content-Length'] = Buffer.byteLength(payload);
    }
    const fullPath = `/rest/v1/${urlPath}${extraQuery ? (urlPath.includes('?') ? '&' : '?') + extraQuery : ''}`;

    const req = https.request({ hostname: SUPABASE_HOST, path: fullPath, method, headers }, (res) => {
      let data = '';
      res.on('data', c => data += c);
      res.on('end', () => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          try { resolve(data ? JSON.parse(data) : []); }
          catch { resolve([]); }
        } else {
          reject(new Error(`Supabase ${method} ${urlPath}: HTTP ${res.statusCode}: ${data}`));
        }
      });
    });
    req.on('error', reject);
    if (payload) req.write(payload);
    req.end();
  });
}

// ─── SofaScore incidents (goal scorers) ────────────────────────────────────────

async function getMatchScorers(matchId, homeTeamId) {
  await sleep(100);
  try {
    const data = await httpGet(`https://api.sofascore.com/api/v1/event/${matchId}/incidents`);
    const incidents = data.incidents || [];

    const homeScorers = [];
    const awayScorers = [];

    for (const inc of incidents) {
      // type: 'goal' covers normal goals, penalties, own goals
      if (inc.incidentType !== 'goal') continue;
      // Skip own goals (they count for the other team, handled by incidentClass)
      const isOwnGoal = inc.incidentClass === 'ownGoal';
      const scorerName = inc.player?.shortName || inc.player?.name || 'Unknown';
      const scoringForHome = isOwnGoal
        ? inc.isHome === false   // own goal by away player → home team scores
        : inc.isHome === true;

      if (scoringForHome) {
        homeScorers.push(scorerName);
      } else {
        awayScorers.push(scorerName);
      }
    }

    return { homeScorers, awayScorers };
  } catch (e) {
    console.error(`  ❌ Failed to fetch incidents for match ${matchId}:`, e.message);
    return { homeScorers: [], awayScorers: [] };
  }
}

// ─── Sofascore helpers ────────────────────────────────────────────────────────

// Fetch the N most recent finished PL matches using the season-level events endpoint.
// Pages are in reverse chronological order (page 0 = most recent round).
async function getRecentPLMatches(maxMatches = 10) {
  const results = [];
  let page = 0;

  while (results.length < maxMatches && page < 8) { // max 8 pages to avoid hammering
    await sleep(150);
    try {
      const data = await httpGet(
        `https://api.sofascore.com/api/v1/unique-tournament/${SF_PL_UT}/season/${SF_PL_SEASON}/events/last/${page}`
      );
      const events = data.events || [];
      if (events.length === 0) break;

      // Events within the page are sorted oldest-first; reverse to process newest first
      for (const e of [...events].reverse()) {
        if (e.status?.type === 'finished') {
          results.push(e);
          if (results.length >= maxMatches) break;
        }
      }
      page++;
    } catch (err) {
      console.error(`  ❌ Failed to fetch PL events page ${page}:`, err.message);
      break;
    }
  }

  console.log(`  ✅ Found ${results.length} recent finished PL matches (${page} page(s) fetched)`);
  return results;
}

async function getMatchStatistics(matchId) {
  await sleep(100);
  try {
    const data = await httpGet(`https://api.sofascore.com/api/v1/event/${matchId}/statistics`);
    if (!data.statistics || data.statistics.length === 0) {
      return { possession: { home: 50, away: 50 }, shots: { home: 0, away: 0 }, shotsOnTarget: { home: 0, away: 0 } };
    }

    const stats = data.statistics[0];
    const groups = stats.groups || [];

    let possession = { home: 50, away: 50 };
    let shots = { home: 0, away: 0 };
    let shotsOnTarget = { home: 0, away: 0 };

    for (const group of groups) {
      for (const item of group.statisticsItems || []) {
        const name = (item.name || '').toLowerCase();
        // Parse values — SofaScore sometimes returns strings like "52%"
        const homeVal = parseFloat(String(item.home).replace('%', '')) || 0;
        const awayVal = parseFloat(String(item.away).replace('%', '')) || 0;

        if (name.includes('possession') || name === 'ball possession') {
          possession = { home: homeVal, away: awayVal };
        } else if (name === 'total shots' || name === 'shots') {
          shots = { home: homeVal, away: awayVal };
        } else if (name.includes('shots on target') || name === 'shots on goal') {
          shotsOnTarget = { home: homeVal, away: awayVal };
        }
      }
    }

    return { possession, shots, shotsOnTarget };
  } catch (e) {
    console.error(`  ❌ Failed to fetch statistics for match ${matchId}:`, e.message);
    return { possession: { home: 50, away: 50 }, shots: { home: 0, away: 0 }, shotsOnTarget: { home: 0, away: 0 } };
  }
}

// ─── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  const force = process.argv.includes('--force');

  // Cache check — skip API calls if data is fresh
  console.log('🔍 Checking Supabase cache...');
  const existing = await supabaseRequest(
    'GET',
    `match_stats_cache?season=eq.${SEASON}&order=fetched_at.desc&limit=1&select=fetched_at`
  );
  const rows = Array.isArray(existing) ? existing : [];

  if (rows.length > 0 && !force) {
    const ageMs = Date.now() - new Date(rows[0].fetched_at).getTime();
    const ageH  = (ageMs / 3_600_000).toFixed(1);
    if (ageMs < CACHE_HOURS * 3_600_000) {
      console.log(`✅ Cache is fresh (${ageH}h old). Use --force to refresh.`);
      return;
    }
    console.log(`⚠️  Cache is stale (${ageH}h old). Refreshing...`);
  } else {
    console.log(force ? '⚡ Force refresh.' : '📊 No cache found. Fetching...');
  }

  // Fetch most recent 10 PL matches directly from SofaScore's season endpoint
  console.log('\n🏆 Fetching most recent PL matches from SofaScore season endpoint...');
  const recentMatches = await getRecentPLMatches(10);

  if (recentMatches.length === 0) {
    console.log('❌ No recent matches found from SofaScore');
    return;
  }

  const output = [];

  for (const match of recentMatches) {
    const homeTeamName = match.homeTeam.name;
    const awayTeamName = match.awayTeam.name;
    const scoreStr     = `${match.homeScore?.current ?? 0}-${match.awayScore?.current ?? 0}`;
    const matchDate    = new Date(match.startTimestamp * 1000).toISOString().split('T')[0];

    console.log(`ℹ️  ${homeTeamName} ${scoreStr} ${awayTeamName} on ${matchDate}`);

    // Step 2: Real possession/shots from SofaScore
    const stats = await getMatchStatistics(match.id);
    console.log(`  ⚽ SofaScore: Possession ${stats.possession.home}%-${stats.possession.away}%, Shots ${stats.shots.home}-${stats.shots.away}, On Target ${stats.shotsOnTarget.home}-${stats.shotsOnTarget.away}`);

    // Step 3: Real scorers from SofaScore incidents API
    const { homeScorers, awayScorers } = await getMatchScorers(match.id, match.homeTeam?.id);
    if (homeScorers.length > 0 || awayScorers.length > 0) {
      console.log(`  🎯 Scorers: [${homeScorers.join(', ')}] vs [${awayScorers.join(', ')}]`);
    } else {
      console.log(`  ⚠️  No scorer data from incidents`);
    }

    output.push({
      season:           SEASON,
      home_team:        homeTeamName,
      away_team:        awayTeamName,
      score:            scoreStr,
      match_date:       matchDate,
      home_scorers:     homeScorers.length > 0 ? homeScorers : [],
      away_scorers:     awayScorers.length > 0 ? awayScorers : [],
      possession:       stats.possession,
      shots:            stats.shots,
      shots_on_target:  stats.shotsOnTarget,
      xg:               { home: null, away: null },
      xa:               { home: null, away: null },
      big_chances_created: { home: null, away: null },
      fetched_at:       new Date().toISOString(),
    });
  }

  if (output.length === 0) {
    console.log('\n❌ No match data fetched');
    return;
  }

  console.log(`\n💾 Saving ${output.length} matches to Supabase...`);

  // Upsert using unique constraint (season, home_team, away_team, match_date)
  await supabaseRequest(
    'POST',
    'match_stats_cache',
    output,
    'on_conflict=season%2Chome_team%2Caway_team%2Cmatch_date'
  );
  console.log('  ✅ Upserted');

  console.log(`\n🎉 Done! ${output.length} matches cached.`);
  console.log(`   Real possession/shots: SofaScore ✅`);
  console.log(`   Real scorers: SofaScore incidents ✅`);
}

main().catch(console.error);
