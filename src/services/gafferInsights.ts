import { MatchStats } from '../../types';

// Gaffer's tactical wisdom library
const GAFFERISMS = {
  GOAL_FEST: [ 
    "If you like goals, you're happy. If you like clean sheets, look away.",
    "Keepers might as well have brought deckchairs. Both managers forgot to defend.",
    "More holes than a trawler net. Defenders on holiday. Proper entertainment though.",
    "Both teams playing 4-3-3 with no holding midfielder. Tactical suicide!",
    "This is what happens when everyone wants to be Guardiola. Defending is optional."
  ],
  SMASH_GRAB: [ 
    "Proper performance. Parked the bus and smashed 'em on the break.",
    "They can keep the ball, we'll take the three points. Simple as.",
    "5-4-1 formation worked perfectly. Absorbed pressure, hit them on the counter.",
    "Possession stats don't win games, goals do. Lesson learned for the tippy-tappy team.",
    "Classic underdog tactics. Deep block, quick transitions. Football 101."
  ],
  TIPPY_TAPPY: [ 
    "Passed it to death and got nothing. Tippy-tappy rubbish.",
    "All gear, no idea. 70% possession and zero threat. Typical modern football.",
    "Playing 4-2-3-1 but the front four are all playing the same position!",
    "Pretty patterns, but no punch. No one wants to shoot. All style, no substance.",
    "Possession is vanity. Points are sanity. They'll learn the hard way."
  ],
  WASTEFUL: [ 
    "Couldn't hit a cow's backside with a banjo today.",
    "Barn door safe from that lot. Strikers need shooting practice, not passing drills.",
    "All the build-up, none of the finish. Manager tearing his hair out.",
    "Left their shooting boots on the bus. 20 shots, 1 goal. Pathetic conversion rate.",
    "Too many fancy Dans trying to score the perfect goal. Just put it in the net!"
  ],
  TIGHT_GAME: [
    "Proper battle. Two good teams cancelling each other out.",
    "Chess match, not football. Every tackle mattered. Both managers earned their money.",
    "Tight as a drum. One moment quality wins it. Defenses on top today.",
    "Nail-biter. Both teams playing 4-3-3 but midfield battle was key.",
    "Tactical masterclass from both managers. Respectable point for both."
  ],
  ONE_SIDED: [
    "Men against boys. Game over by half-time. Tactical mismatch.",
    "Training session. Too easy for the big team. Formation completely wrong for losers.",
    "No contest. One team turned up, one didn't. 3-5-2 vs 4-4-2 and it showed.",
    "Damage limitation exercise for the losers. Should have changed formation at half-time.",
    "Superior tactics won the day. Simple as that."
  ]
};

const FANTASY_IMPACTS = {
  GOAL_FEST: [
    "Defenders on both teams are toxic until further notice. Stack attackers.",
    "Clean sheet bonus? Forget it. Every keeper's a liability this week.",
    "If you didn't have attackers from this game, you're already behind.",
    "Both teams playing high defensive lines - wingers and full-backs are gold mines."
  ],
  SMASH_GRAB: [
    "Counter-attack merchants are gold dust. Check the assist makers.",
    "The underdog's striker might be cheap differential gold.",
    "Defenders from the smash-and-grab team could be clean sheet bargains.",
    "Wing-backs in a 5-4-1 system often get attacking returns on the break."
  ],
  TIPPY_TAPPY: [
    "Possession merchants with no end product. Avoid the fancy Dans.",
    "Midfielders who pass sideways all day. Transfer market fodder.",
    "Look for the team that actually wanted to score, not just pose.",
    "False 9s in tippy-tappy systems rarely score. Avoid like the plague."
  ],
  WASTEFUL: [
    "Strikers who couldn't finish. Drop them before they cost you points.",
    "Keepers who had nothing to do. Might be value for clean sheets next week.",
    "Check who took the shots - if they can't finish, they're bench warmers.",
    "Teams playing 4-2-3-1 but not creating - the front three are useless."
  ],
  TIGHT_GAME: [
    "Tight games mean set-piece specialists are valuable. Check corners/free-kicks.",
    "Both teams solid defensively. Defenders might be safe plays.",
    "Penalty takers are premium assets in tight matches.",
    "In tactical battles, defensive midfielders often get bonus points for tackles."
  ],
  ONE_SIDED: [
    "The winning team's attackers are essential transfers right now.",
    "Clean sheet potential for the dominant team's defense.",
    "Losing team players? Avoid like the plague until they bounce back.",
    "When formations dominate, players in key positions get maximum returns."
  ]
};

// Pattern detection engine
const detectMatchPattern = (stats: MatchStats): keyof typeof GAFFERISMS => {
  const totalGoals = (stats.score.split('-').reduce((a: number, b: string) => a + parseInt(b), 0) || 0);
  const possessionDiff = Math.abs((stats.possession?.home || 50) - (stats.possession?.away || 50));
  const totalShots = (stats.shots?.home || 0) + (stats.shots?.away || 0);
  const shotsOnTarget = (stats.shotsOnTarget?.home || 0) + (stats.shotsOnTarget?.away || 0);
  const [homeScore, awayScore] = stats.score.split('-').map(s => parseInt(s) || 0);
  const goalDiff = Math.abs(homeScore - awayScore);
  
  // High-scoring game (3+ goals by one team)
  if (homeScore >= 3 || awayScore >= 3) {
    return 'GOAL_FEST';
  }
  
  // One-sided (2+ goal difference + low possession for loser)
  if (goalDiff >= 2 && possessionDiff >= 20) {
    return 'ONE_SIDED';
  }
  
  // High-scoring draw (2-2 or higher)
  if (homeScore >= 2 && awayScore >= 2) {
    return 'GOAL_FEST'; // Use existing pattern instead
  }
  
  // Wasteful (lots of shots, few goals)
  if (totalShots >= 20 && totalGoals <= 1 && shotsOnTarget / totalShots < 0.3) {
    return 'WASTEFUL';
  }
  
  // Tippy-tappy (high possession, low shots/goals)
  if (possessionDiff >= 15 && totalShots <= 15 && totalGoals <= 1) {
    return 'TIPPY_TAPPY';
  }
  
  // Smash and grab (low possession, won the game)
  const homeWon = homeScore > awayScore;
  const awayWon = awayScore > homeScore;
  
  // Upset winner with low possession
  if ((homeWon && (stats.possession?.home || 50) < 45) ||
      (awayWon && (stats.possession?.away || 50) < 45)) {
    return 'SMASH_GRAB'; // Use existing pattern
  }
  
  // Default to tight game for close matches
  return 'TIGHT_GAME';
};

// Get random element from array
const getRandomElement = <T,>(array: T[]): T => {
  return array[Math.floor(Math.random() * array.length)];
};

// Extract key players from match stats
const extractKeyPlayers = (stats: MatchStats) => {
  const players = [];
  const [homeScore, awayScore] = stats.score.split('-').map(s => parseInt(s) || 0);
  
  // This would be enhanced with real player data
  // For now, return generic key positions
  if (homeScore >= 2) {
    players.push(`${stats.homeTeam} attackers`);
  }
  if (awayScore >= 2) {
    players.push(`${stats.awayTeam} attackers`);
  }
  
  return players;
};

// Generate next week advice
const generateNextWeekAdvice = (stats: MatchStats, pattern: keyof typeof GAFFERISMS) => {
  const homeTeam = stats.homeTeam;
  const awayTeam = stats.awayTeam;
  
  const advice = {
    GOAL_FEST: `${homeTeam} and ${awayTeam} defenses are on notice. Check their upcoming fixtures.`,
    SMASH_GRAB: `The counter-attack specialists from this game might be differential gold next week.`,
    TIPPY_TAPPY: `Avoid the possession merchants from this match. Look for teams that actually shoot.`,
    WASTEFUL: `Strikers who couldn't finish here might be dropped. Check team news before transferring.`,
    TIGHT_GAME: `Both teams look solid defensively. Their players could be safe picks for clean sheets.`,
    ONE_SIDED: `The dominant team's players are must-haves. The losers? Give them a wide berth.`
  };
  
  return advice[pattern];
};

// Main insight generation function
export const generateGafferInsight = (stats: MatchStats) => {
  const pattern = detectMatchPattern(stats);
  const gafferism = getRandomElement(GAFFERISMS[pattern]);
  const fantasyImpact = getRandomElement(FANTASY_IMPACTS[pattern]);
  const keyPlayers = extractKeyPlayers(stats);
  const nextWeekAdvice = generateNextWeekAdvice(stats, pattern);
  
  return {
    headline: gafferism,
    analysis: `${stats.homeTeam} ${stats.score} ${stats.awayTeam}`,
    fantasyImpact,
    keyPlayers,
    nextWeekAdvice,
    pattern,
    confidence: 0.85 // Rule-based confidence score
  };
};

// Batch analysis for multiple matches
export const generateWeeklyGafferAnalysis = (matchStats: MatchStats[]) => {
  return matchStats.map(stats => generateGafferInsight(stats));
};

// Get overall weekly theme
export const generateWeeklyTheme = (insights: ReturnType<typeof generateGafferInsight>[]) => {
  const patterns = insights.map(i => i.pattern);
  const mostCommon = patterns.sort((a,b) => 
    patterns.filter(v => v===a).length - patterns.filter(v => v===b).length
  ).pop();
  
  const themes = {
    GOAL_FEST: "Week of Goal Festivals - Defenders Need Not Apply",
    SMASH_GRAB: "Week of the Underdog - Counter Attacks Rule",
    TIPPY_TAPPY: "Week of Pretty Football - Nothing to Show For It",
    WASTEFUL: "Week of Wasted Chances - Strikers on the Bench",
    TIGHT_GAME: "Week of Proper Battles - Every Point Matters",
    ONE_SIDED: "Week of Dominance - Some Teams Just Turned Up"
  };
  
  return themes[mostCommon as keyof typeof themes] || "Week of Proper Football";
};


