export interface SetPieceTaker {
  team: string;
  penalties: string;
  directFK: string;
  cornersL: string;
  cornersR: string;
  gafferNote: string;
}

/* Mock data — will be replaced with Supabase data.
   Updated manually from match footage / press conferences. */
export const SET_PIECE_DATA: SetPieceTaker[] = [
  { team: 'Arsenal',        penalties: 'Saka',         directFK: 'Saka',          cornersL: 'Saka',        cornersR: 'Rice',          gafferNote: "Saka's on everything. The kid's set-piece monopoly is better than Monopoly itself." },
  { team: 'Aston Villa',    penalties: 'Watkins',      directFK: 'McGinn',         cornersL: 'Digne',       cornersR: 'McGinn',        gafferNote: "Watkins steps up from the spot. McGinn whips them in like he's posting letters." },
  { team: 'Bournemouth',    penalties: 'Solanke',      directFK: 'Tavernier',      cornersL: 'Tavernier',   cornersR: 'Kluivert',      gafferNote: "Tavernier's delivery is filthy. Budget gold if he keeps taking these." },
  { team: 'Brentford',      penalties: 'Mbeumo',       directFK: 'Mbeumo',         cornersL: 'Mbeumo',      cornersR: 'Jensen',        gafferNote: "Mbeumo does the lot. If he could take throw-ins too, he would." },
  { team: 'Brighton',       penalties: 'João Pedro',   directFK: 'Mitoma',         cornersL: 'Mitoma',      cornersR: 'Gross',         gafferNote: "JP from the spot, Mitoma bends them in. Brighton's set-pieces are underrated." },
  { team: 'Chelsea',        penalties: 'Palmer',       directFK: 'Palmer',         cornersL: 'Palmer',      cornersR: 'Madueke',       gafferNote: "Palmer's on everything. Cold. Calculated. Like a robot with better hair." },
  { team: 'Crystal Palace', penalties: 'Eze',          directFK: 'Eze',            cornersL: 'Eze',         cornersR: 'Mitchell',      gafferNote: "Eze is Palace's talisman. Everything goes through his left foot." },
  { team: 'Everton',        penalties: 'Calvert-Lewin',directFK: 'Doucoure',       cornersL: 'McNeil',      cornersR: 'Harrison',      gafferNote: "DCL from the spot when he's fit. McNeil's corners are Everton's best attacking weapon." },
  { team: 'Fulham',         penalties: 'Jimenez',      directFK: 'Andreas',        cornersL: 'Andreas',     cornersR: 'Wilson',        gafferNote: "Andreas Pereira on free kicks — the man loves a Hollywood ball." },
  { team: 'Ipswich',        penalties: 'Szmodics',     directFK: 'Chaplin',        cornersL: 'Chaplin',     cornersR: 'Morsy',         gafferNote: "Newly promoted, still figuring it out. Szmodics grabs the ball from the spot." },
  { team: 'Leicester',      penalties: 'Vardy',        directFK: 'Maddison',       cornersL: 'Maddison',    cornersR: 'Dewsbury-Hall', gafferNote: "Vardy still wants the pens. The man's got ice in his veins at 38." },
  { team: 'Liverpool',      penalties: 'Salah',        directFK: 'Alexander-Arnold',cornersL: 'Robertson',  cornersR: 'Alexander-Arnold', gafferNote: "Trent's delivery is a cheat code. Salah from the spot — never misses." },
  { team: 'Man City',       penalties: 'Haaland',      directFK: 'De Bruyne',      cornersL: 'Grealish',    cornersR: 'De Bruyne',     gafferNote: "Haaland WILL take the pen. Even if Guardiola tells him not to. KDB's deliveries are still elite." },
  { team: 'Man Utd',        penalties: 'Bruno Fernandes',directFK: 'Bruno Fernandes',cornersL: 'Shaw',      cornersR: 'Bruno Fernandes', gafferNote: "Bruno does everything. Pens, free kicks, corners, complaining — the full package." },
  { team: 'Newcastle',      penalties: 'Isak',         directFK: 'Trippier',       cornersL: 'Gordon',      cornersR: 'Trippier',      gafferNote: "Isak's got the pens. Trippier's delivery from the right is like a heat-seeking missile." },
  { team: 'Nott\'m Forest', penalties: 'Wood',         directFK: 'Gibbs-White',    cornersL: 'Gibbs-White', cornersR: 'Elanga',        gafferNote: "Chris Wood is ice cold from the spot. Gibbs-White runs the show otherwise." },
  { team: 'Southampton',    penalties: 'Ward-Prowse',  directFK: 'Ward-Prowse',    cornersL: 'Ward-Prowse', cornersR: 'Dibling',       gafferNote: "Ward-Prowse IS set pieces. The man could score from a free kick in his sleep." },
  { team: 'Spurs',          penalties: 'Son',          directFK: 'Son',            cornersL: 'Son',         cornersR: 'Maddison',      gafferNote: "Son takes pens and free kicks. Maddison whips them in from the right. Tasty." },
  { team: 'West Ham',       penalties: 'Bowen',        directFK: 'Ward-Prowse',    cornersL: 'Ward-Prowse', cornersR: 'Bowen',         gafferNote: "JWP on set-pieces is arguably West Ham's best signing. That right foot is a wand." },
  { team: 'Wolves',         penalties: 'Cunha',        directFK: 'Cunha',          cornersL: 'Neto',        cornersR: 'Sarabia',       gafferNote: "Cunha does everything for Wolves. Without him they're a mid-table pub team." },
];


