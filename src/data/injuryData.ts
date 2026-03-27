export interface InjuredPlayer {
  id: number;
  name: string;
  team: string;
  position: 'GK' | 'DEF' | 'MID' | 'FWD';
  status: 'out' | 'doubtful' | '75%' | '25%';
  injury: string;
  expectedReturn: string;
  ownership: number;
  gafferNote: string;
}

/* Mock data — will be replaced by FPL API via Supabase.
   FPL API fields: chance_of_playing_this_round, chance_of_playing_next_round, news */
export const INJURY_DATA: InjuredPlayer[] = [
  { id: 1,  name: 'Haaland',           team: 'Man City',       position: 'FWD', status: 'doubtful', injury: 'Knee — light training',         expectedReturn: 'GW28',  ownership: 72.3, gafferNote: "Knowing Haaland, he'll still play. And still score." },
  { id: 2,  name: 'Alexander-Arnold',  team: 'Liverpool',      position: 'DEF', status: 'out',      injury: 'Hamstring',                     expectedReturn: 'GW29',  ownership: 31.5, gafferNote: "Big loss. Trent's delivery is half of Liverpool's attack." },
  { id: 3,  name: 'Saka',              team: 'Arsenal',        position: 'MID', status: '75%',      injury: 'Knock — expected to play',      expectedReturn: 'GW27',  ownership: 48.1, gafferNote: "He'll play. Arteta wraps him in cotton wool mid-week then unleashes him Saturday." },
  { id: 4,  name: 'Rashford',          team: 'Man Utd',        position: 'FWD', status: 'out',      injury: 'Muscle injury',                 expectedReturn: 'GW30',  ownership: 5.2,  gafferNote: "Out again. At this point his physio sees him more than his teammates." },
  { id: 5,  name: 'Digne',             team: 'Aston Villa',    position: 'DEF', status: 'out',      injury: 'Ankle',                         expectedReturn: 'GW29',  ownership: 3.8,  gafferNote: "Villa's left side loses its best crosser. Budget owners can safely move on." },
  { id: 6,  name: 'Isak',              team: 'Newcastle',      position: 'FWD', status: '75%',      injury: 'Illness — trained today',       expectedReturn: 'GW27',  ownership: 28.4, gafferNote: "Should be fine. Isak doesn't miss games — he misses chances. Wait, no he doesn't." },
  { id: 7,  name: 'Éderson',           team: 'Man City',       position: 'GK',  status: 'out',      injury: 'Knee ligament',                 expectedReturn: 'GW32',  ownership: 8.9,  gafferNote: "Long-term. Ortega's been solid anyway. Move on." },
  { id: 8,  name: 'Matheus Nunes',     team: 'Man City',       position: 'MID', status: 'doubtful', injury: 'Calf tightness',                expectedReturn: 'GW28',  ownership: 2.1,  gafferNote: "Touch and go. Pep's wheel of rotation will decide." },
  { id: 9,  name: 'Calvert-Lewin',     team: 'Everton',        position: 'FWD', status: '25%',      injury: 'Groin — unlikely to play',      expectedReturn: 'GW28',  ownership: 4.7,  gafferNote: "DCL and injuries — name a more iconic duo. I'll wait." },
  { id: 10, name: 'Mitoma',            team: 'Brighton',       position: 'MID', status: '75%',      injury: 'Back spasm — in training',      expectedReturn: 'GW27',  ownership: 12.6, gafferNote: "Should make it. Brighton can't afford to lose their main dribbler." },
  { id: 11, name: 'Neto',              team: 'Wolves',         position: 'MID', status: 'out',      injury: 'Hamstring',                     expectedReturn: 'GW30',  ownership: 6.3,  gafferNote: "Wolves without Neto are like toast without butter. Dry and depressing." },
  { id: 12, name: 'Shaw',              team: 'Man Utd',        position: 'DEF', status: 'out',      injury: 'Muscle — long-term',            expectedReturn: 'GW33',  ownership: 1.2,  gafferNote: "Shaw being injured isn't news anymore. Him being fit would be the headline." },
  { id: 13, name: 'Wan-Bissaka',       team: 'West Ham',       position: 'DEF', status: 'doubtful', injury: 'Knock',                         expectedReturn: 'GW28',  ownership: 1.8,  gafferNote: "Moyes will decide on matchday. Classic 50/50." },
  { id: 14, name: 'Elanga',            team: 'Nott\'m Forest', position: 'MID', status: '75%',      injury: 'Dead leg — trained fully',      expectedReturn: 'GW27',  ownership: 9.4,  gafferNote: "He'll play. A dead leg won't stop this lad. Forest need him too much." },
  { id: 15, name: 'Senesi',            team: 'Bournemouth',    position: 'DEF', status: 'out',      injury: 'Knee',                          expectedReturn: 'GW29',  ownership: 7.5,  gafferNote: "Hill at £4.0m steps in. That's the real FPL story here." },
];


