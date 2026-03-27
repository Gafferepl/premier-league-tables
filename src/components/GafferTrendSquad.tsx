import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { getTeamLogo } from '../constants';
import LogoWithFallback from './LogoWithFallback';
import ShareSnapshot from './ShareSnapshot';

// Force rebuild - v2.0

interface TrendPlayer {
  id: string;
  name: string;
  team: string;
  position: 'GK' | 'DEF' | 'MID' | 'FWD';
  price: string;
  form: 'rising' | 'stable' | 'falling';
  ownership: number; // percentage
  risk: 'wildcard' | 'adventurous' | 'safe';
  reasoning: string;
  upcomingFixture: string;
  fixtureDifficulty: number; // 1-5
}

interface TrendSquadProps {
  matchStats: any[];
}

const GafferTrendSquad: React.FC<TrendSquadProps> = ({ matchStats }) => {
  const [trendSquad, setTrendSquad] = useState<TrendPlayer[]>([]);
  const [formation, setFormation] = useState<string>('4-3-3');
  const [loading, setLoading] = useState(true);
  const [selectedWeek, setSelectedWeek] = useState<string>('GW 25');
  const containerRef = React.useRef<HTMLDivElement>(null);
  const [hoveredPlayer, setHoveredPlayer] = useState<{player: TrendPlayer; position: string; rect: DOMRect} | null>(null);

  // PlayerCard - icon only, tooltip rendered via portal
  const PlayerCard: React.FC<{ player: TrendPlayer; position: string }> = ({ player, position }) => {
    if (!player) return null;
    
    const getPositionColor = (pos: string) => {
      switch (pos) {
        case 'GK': return 'bg-yellow-400 text-slate-800';
        case 'DEF': return 'bg-blue-400 text-white';
        case 'MID': return 'bg-green-400 text-white';
        case 'FWD': return 'bg-red-400 text-white';
        default: return 'bg-slate-400 text-white';
      }
    };

    return (
      <div
        className="relative"
        onMouseEnter={(e) => {
          const rect = e.currentTarget.getBoundingClientRect();
          setHoveredPlayer({ player, position, rect });
        }}
        onMouseLeave={() => setHoveredPlayer(null)}
      >
        <div className="bg-white/90 backdrop-blur-sm rounded-full p-2 shadow-lg border-2 border-white/50 hover:scale-110 transition-all duration-300 cursor-pointer">
          <div className="w-10 h-10 flex items-center justify-center">
            <LogoWithFallback 
              src={getTeamLogo(player.team)} 
              teamName={player.team} 
              size="w-8 h-8" 
              className="rounded-full"
            />
          </div>
        </div>
        <div className={`absolute -top-1 -right-1 w-3 h-3 ${getPositionColor(position)} rounded-full flex items-center justify-center text-xs font-bold`}>
          {position[0]}
        </div>
      </div>
    );
  };

  // Tooltip rendered via React Portal into document.body - CANNOT be clipped
  const renderTooltip = () => {
    if (!hoveredPlayer) return null;
    const { player, rect } = hoveredPlayer;
    // Show to the right of the icon; if near right edge, show to the left
    let left = rect.right + 8;
    let top = rect.top + rect.height / 2 - 40;
    if (left + 300 > window.innerWidth) {
      left = rect.left - 308;
    }
    if (top < 10) top = 10;
    if (top + 120 > window.innerHeight) top = window.innerHeight - 130;

    return ReactDOM.createPortal(
      <div
        style={{ position: 'fixed', left, top, zIndex: 2147483647, pointerEvents: 'none' }}
        className="w-72 bg-white dark:bg-slate-800 rounded-lg shadow-2xl border-2 border-slate-300 dark:border-slate-600 p-3"
      >
        <div className="flex items-center gap-2">
          <LogoWithFallback
            src={getTeamLogo(player.team)}
            teamName={player.team}
            size="w-8 h-8"
            className="rounded-full"
          />
          <div className="flex-1 min-w-0">
            <p className="font-bold text-xs text-slate-800 dark:text-white truncate">{player.name}</p>
            <p className="text-[10px] text-slate-500">{player.team} • {player.price} • {player.ownership}% owned</p>
            <p className="text-[10px] text-slate-600 dark:text-slate-300 mt-1 line-clamp-2">{player.reasoning}</p>
            <div className="flex gap-1 mt-1">
              <span className={`px-1.5 py-0.5 rounded text-[10px] ${getRiskColor(player.risk)}`}>{player.risk}</span>
              <span className={`px-1.5 py-0.5 rounded text-[10px] ${getDifficultyColor(player.fixtureDifficulty)}`}>{player.upcomingFixture}</span>
            </div>
          </div>
        </div>
      </div>,
      document.body
    );
  };

  useEffect(() => {
    // Generate AI-powered trend squad
    generateTrendSquad();
    setLoading(false);
  }, [matchStats]);

  const generateTrendSquad = () => {
    // Mock AI-generated trend squad - in production this would use real data
    const mockSquad: TrendPlayer[] = [
      {
        id: '1',
        name: 'Alphonse Areola',
        team: 'West Ham',
        position: 'GK',
        price: '£4.0m',
        form: 'rising',
        ownership: 2.1,
        risk: 'wildcard',
        reasoning: 'Three clean sheets in last four. West Ham have favorable fixtures and Areola is making saves.',
        upcomingFixture: 'vs Everton (H)',
        fixtureDifficulty: 2
      },
      {
        id: '2',
        name: 'Kieran Trippier',
        team: 'Newcastle',
        position: 'DEF',
        price: '£5.5m',
        form: 'stable',
        ownership: 15.3,
        risk: 'safe',
        reasoning: 'Set-piece specialist with attacking returns. Newcastle playing well at home.',
        upcomingFixture: 'vs Luton (H)',
        fixtureDifficulty: 1
      },
      {
        id: '3',
        name: 'Gabriel',
        team: 'Arsenal',
        position: 'DEF',
        price: '£4.9m',
        form: 'rising',
        ownership: 8.7,
        risk: 'adventurous',
        reasoning: 'Arsenal keeping clean sheets and Gabriel scoring from set-pieces. Differential pick.',
        upcomingFixture: 'vs Burnley (H)',
        fixtureDifficulty: 1
      },
      {
        id: '4',
        name: 'Micky van de Ven',
        team: 'Tottenham',
        position: 'DEF',
        price: '£4.4m',
        form: 'rising',
        ownership: 4.2,
        risk: 'wildcard',
        reasoning: 'Tottenham defense improving rapidly. Young defender with attacking potential.',
        upcomingFixture: 'vs Brighton (H)',
        fixtureDifficulty: 3
      },
      {
        id: '5',
        name: 'Pervis Estupiñán',
        team: 'Brighton',
        position: 'DEF',
        price: '£5.0m',
        form: 'stable',
        ownership: 3.8,
        risk: 'adventurous',
        reasoning: 'Brighton full-backs always involved. Estupiñán getting forward more under new system.',
        upcomingFixture: 'vs Tottenham (A)',
        fixtureDifficulty: 3
      },
      {
        id: '6',
        name: 'Pascal Groß',
        team: 'Brighton',
        position: 'MID',
        price: '£5.3m',
        form: 'rising',
        ownership: 6.9,
        risk: 'adventurous',
        reasoning: 'Set-piece duties and creating chances. Brighton playing attractive football.',
        upcomingFixture: 'vs Tottenham (A)',
        fixtureDifficulty: 3
      },
      {
        id: '7',
        name: 'Douglas Luiz',
        team: 'Aston Villa',
        position: 'MID',
        price: '£5.2m',
        form: 'stable',
        ownership: 11.4,
        risk: 'safe',
        reasoning: 'Penalty taker and Villa in good form. Consistent points return.',
        upcomingFixture: 'vs Man Utd (H)',
        fixtureDifficulty: 2
      },
      {
        id: '8',
        name: 'Phil Foden',
        team: 'Man City',
        position: 'MID',
        price: '£8.2m',
        form: 'rising',
        ownership: 22.1,
        risk: 'adventurous',
        reasoning: 'Foden playing centrally and scoring. City have run of favorable fixtures.',
        upcomingFixture: 'vs Burnley (A)',
        fixtureDifficulty: 1
      },
      {
        id: '9',
        name: 'Mohamed Salah',
        team: 'Liverpool',
        position: 'MID',
        price: '£12.9m',
        form: 'rising',
        ownership: 28.7,
        risk: 'safe',
        reasoning: 'Back in form with goals and assists. Liverpool pushing for top four.',
        upcomingFixture: 'vs Brentford (H)',
        fixtureDifficulty: 2
      },
      {
        id: '10',
        name: 'Ollie Watkins',
        team: 'Aston Villa',
        position: 'FWD',
        price: '£9.1m',
        form: 'rising',
        ownership: 18.3,
        risk: 'adventurous',
        reasoning: 'In goal-scoring form and Villa creating chances. Penalty taker.',
        upcomingFixture: 'vs Man Utd (H)',
        fixtureDifficulty: 2
      },
      {
        id: '11',
        name: 'Alexander Isak',
        team: 'Newcastle',
        position: 'FWD',
        price: '£7.5m',
        form: 'stable',
        ownership: 9.8,
        risk: 'adventurous',
        reasoning: 'Newcastle attacking well and Isak scoring regularly. Good differential.',
        upcomingFixture: 'vs Luton (H)',
        fixtureDifficulty: 1
      }
    ];

    setTrendSquad(mockSquad);
  };

  const getFormationPositions = (formation: string) => {
    const formations: Record<string, { positions: string[], layout: string[][] }> = {
      '4-3-3': {
        positions: ['GK', 'DEF', 'DEF', 'DEF', 'DEF', 'MID', 'MID', 'MID', 'FWD', 'FWD', 'FWD'],
        layout: [
          ['', '', 'GK', '', ''],
          ['DEF', '', 'DEF', '', 'DEF'],
          ['', 'DEF', '', 'DEF', ''],
          ['', 'MID', '', 'MID', ''],
          ['MID', '', '', '', 'MID'],
          ['', 'FWD', '', 'FWD', ''],
          ['', '', 'FWD', '', '']
        ]
      },
      '3-5-2': {
        positions: ['GK', 'DEF', 'DEF', 'DEF', 'MID', 'MID', 'MID', 'MID', 'MID', 'FWD', 'FWD'],
        layout: [
          ['', '', 'GK', '', ''],
          ['', 'DEF', '', 'DEF', ''],
          ['', '', 'DEF', '', ''],
          ['MID', '', 'MID', '', 'MID'],
          ['', 'MID', '', 'MID', ''],
          ['', 'FWD', '', 'FWD', ''],
          ['', '', '', '', '']
        ]
      }
    };
    return formations[formation] || formations['4-3-3'];
  };

  const getTrendIcon = (form: string) => {
    switch (form) {
      case 'rising': return '📈';
      case 'falling': return '📉';
      case 'stable': return '➡️';
      default: return '➡️';
    }
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'wildcard': return 'text-red-600 bg-red-50 border-red-200';
      case 'adventurous': return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'safe': return 'text-green-600 bg-green-50 border-green-200';
      default: return 'text-slate-600 bg-slate-50 border-slate-200';
    }
  };

  const getRiskIcon = (risk: string) => {
    switch (risk) {
      case 'wildcard': return '⚡⚡⚡';
      case 'adventurous': return '⚡⚡';
      case 'safe': return '⚡';
      default: return '⚡';
    }
  };

  const getDifficultyColor = (difficulty: number) => {
    if (difficulty <= 2) return 'text-green-600 bg-green-50';
    if (difficulty <= 3) return 'text-yellow-600 bg-yellow-50';
    return 'text-red-600 bg-red-50';
  };

  if (loading) {
    return (
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl overflow-hidden border border-slate-200/50 dark:border-slate-700/50 relative backdrop-blur-sm p-6 animate-pulse">
        <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded mb-4"></div>
        <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded mb-2"></div>
        <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded"></div>
      </div>
    );
  }

  const formationLayout = getFormationPositions(formation);

  return (
    <div ref={containerRef} className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl overflow-hidden border border-slate-200/50 dark:border-slate-700/50 relative backdrop-blur-sm">
      {/* Tooltip Portal - renders into document.body, never clipped */}
      {renderTooltip()}
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-accent p-6 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent"></div>
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] animate-pulse"></div>
        </div>
        
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
              <i className="fas fa-whistle text-white text-xl"></i>
            </div>
            <div>
              <h3 className="text-2xl font-bold text-white">Gaffer's Trend Squad</h3>
              <p className="text-white/90 text-sm font-medium">Tactical selections based on emerging patterns</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4 text-white/80 text-sm">
            <span className="px-3 py-1 bg-white/20 rounded-full font-medium">
              <i className="fas fa-calendar-alt mr-2"></i>
              {selectedWeek}
            </span>
            <span className="px-3 py-1 bg-white/20 rounded-full font-medium">
              <i className="fas fa-chess-board mr-2"></i>
              {formation}
            </span>
            <span className="px-3 py-1 bg-white/20 rounded-full font-medium">
              <i className="fas fa-chart-line mr-2"></i>
              11 Players • 4 Subs
            </span>
          </div>
        </div>
      </div>

      {/* Football Pitch with Gaffer's Analysis */}
      <div className="p-6 bg-gradient-to-br from-slate-50 to-white dark:from-slate-900/50 dark:to-slate-800/50 overflow-visible">
        <div className="max-w-7xl mx-auto" style={{overflow: 'visible'}}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6" style={{overflow: 'visible'}}>
            {/* Premier League Style Pitch - Vertical Full Length */}
            <div className="w-full flex flex-col overflow-visible" style={{overflow: 'visible'}}>
            <div className="relative bg-gradient-to-b from-green-500 via-green-600 to-green-700 rounded-xl p-4 border-4 border-white/20 shadow-2xl min-h-[600px]" style={{overflow: 'visible', isolation: 'auto', zIndex: 2147483647}}>
              {/* Pitch Texture - UK Football Pitch Style */}
              <div className="absolute inset-0 rounded-xl overflow-hidden opacity-20">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-green-400/20 to-transparent"></div>
                <div className="absolute inset-0 bg-gradient-to-b from-green-800/20 to-transparent"></div>
              </div>
              
              {/* Pitch Lines - Proper Vertical Football Pitch */}
              <div className="absolute inset-0 rounded-xl" style={{overflow: 'visible'}}>
                {/* Outer Boundary */}
                <div className="absolute inset-4 border-2 border-white/50"></div>
                
                {/* Center Line - Horizontal across middle */}
                <div className="absolute top-1/2 left-4 right-4 h-0.5 bg-white/50"></div>
                
                {/* Center Circle */}
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-20 h-20 border-2 border-white/50 rounded-full"></div>
                
                {/* Center Spot */}
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-white/50 rounded-full"></div>
                
                {/* Top Penalty Area (Attacking) */}
                <div className="absolute top-4 left-1/4 right-1/4 h-24 border-2 border-white/50 border-t-0"></div>
                
                {/* Top Six-yard Box */}
                <div className="absolute top-4 left-1/3 right-1/3 h-12 border-2 border-white/50 border-t-0"></div>
                
                {/* Top Goal */}
                <div className="absolute top-2 left-1/2 transform -translate-x-1/2 w-16 h-1.5 bg-white/60"></div>
                
                {/* Top Penalty Spot */}
                <div className="absolute top-16 left-1/2 transform -translate-x-1/2 w-1.5 h-1.5 bg-white/50 rounded-full"></div>
                
                {/* Bottom Penalty Area (Defending) */}
                <div className="absolute bottom-4 left-1/4 right-1/4 h-24 border-2 border-white/50 border-b-0"></div>
                
                {/* Bottom Six-yard Box */}
                <div className="absolute bottom-4 left-1/3 right-1/3 h-12 border-2 border-white/50 border-b-0"></div>
                
                {/* Bottom Goal */}
                <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 w-16 h-1.5 bg-white/60"></div>
                
                {/* Bottom Penalty Spot */}
                <div className="absolute bottom-16 left-1/2 transform -translate-x-1/2 w-1.5 h-1.5 bg-white/50 rounded-full"></div>
                
                {/* Corner Arcs */}
                <div className="absolute top-4 left-4 w-3 h-3 border-t-2 border-l-2 border-white/50 rounded-tl-lg"></div>
                <div className="absolute top-4 right-4 w-3 h-3 border-t-2 border-r-2 border-white/50 rounded-tr-lg"></div>
                <div className="absolute bottom-4 left-4 w-3 h-3 border-b-2 border-l-2 border-white/50 rounded-bl-lg"></div>
                <div className="absolute bottom-4 right-4 w-3 h-3 border-b-2 border-r-2 border-white/50 rounded-br-lg"></div>
              </div>

              {/* Players on Pitch - Vertical 4-3-3 Formation */}
              <div className="relative mx-auto min-h-[600px]" style={{zIndex: 10, overflow: 'visible', isolation: 'auto'}}>
                {/* Goalkeeper - Right on goal line at bottom */}
                <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2">
                  <PlayerCard player={trendSquad[0]} position="GK" />
                </div>

                {/* Defenders - 4 across with better spacing */}
                <div className="absolute bottom-20 left-[10%]">
                  <PlayerCard player={trendSquad[1]} position="DEF" />
                </div>
                <div className="absolute bottom-20 left-[35%]">
                  <PlayerCard player={trendSquad[2]} position="DEF" />
                </div>
                <div className="absolute bottom-20 right-[35%]">
                  <PlayerCard player={trendSquad[3]} position="DEF" />
                </div>
                <div className="absolute bottom-20 right-[10%]">
                  <PlayerCard player={trendSquad[4]} position="DEF" />
                </div>

                {/* Midfielders - 3 in proper midfield line */}
                <div className="absolute top-1/2 left-[20%] transform -translate-y-1/2">
                  <PlayerCard player={trendSquad[5]} position="MID" />
                </div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                  <PlayerCard player={trendSquad[6]} position="MID" />
                </div>
                <div className="absolute top-1/2 right-[20%] transform -translate-y-1/2">
                  <PlayerCard player={trendSquad[7]} position="MID" />
                </div>

                {/* Forwards - 3 in proper attacking line */}
                <div className="absolute top-12 left-[20%]">
                  <PlayerCard player={trendSquad[8]} position="FWD" />
                </div>
                <div className="absolute top-12 left-1/2 transform -translate-x-1/2">
                  <PlayerCard player={trendSquad[9]} position="FWD" />
                </div>
                <div className="absolute top-12 right-[20%]">
                  <PlayerCard player={trendSquad[10]} position="FWD" />
                </div>
              </div>
            </div>
            </div>

            {/* Gaffer's Take - Side by Side on Large Screens */}
            <div className="w-full flex flex-col">
            <div className="bg-gradient-to-r from-slate-800 via-slate-900 to-slate-800 rounded-xl p-6 border-2 border-slate-700 shadow-xl h-full">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-orange-500 rounded-full flex items-center justify-center">
                  <i className="fas fa-quote-left text-white text-sm"></i>
                </div>
                <h4 className="text-xl font-bold text-white">The Gaffer's Take</h4>
              </div>

              <div className="space-y-4">
                {/* Main Gafferism */}
                <div className="bg-gradient-to-r from-red-900/30 to-orange-900/30 rounded-lg p-4 border-l-4 border-red-500">
                  <p className="text-white text-lg font-bold italic leading-relaxed">
                    "Right then, listen up. This squad's not about fancy names or big price tags - it's about proper football intelligence. We've got differentials here that'll have your mates scratching their heads come Sunday evening."
                  </p>
                </div>

                {/* Tactical Breakdown */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-slate-700/50 rounded-lg p-4">
                    <h5 className="text-red-400 font-bold mb-2 flex items-center">
                      <i className="fas fa-shield-alt mr-2"></i>
                      Defensive Nous
                    </h5>
                    <p className="text-slate-300 text-sm leading-relaxed">
                      "Four at the back, solid as a rock. Trippier's set-piece delivery is like having an extra midfielder. Gabriel's scoring from corners - defenders who chip in are worth their weight in gold."
                    </p>
                  </div>

                  <div className="bg-slate-700/50 rounded-lg p-4">
                    <h5 className="text-blue-400 font-bold mb-2 flex items-center">
                      <i className="fas fa-running mr-2"></i>
                      Midfield Engine
                    </h5>
                    <p className="text-slate-300 text-sm leading-relaxed">
                      "Three in the middle controlling the tempo. Groß on set-pieces, Luiz on penalties, Foden playing centrally - that's where the magic happens. No passengers here."
                    </p>
                  </div>

                  <div className="bg-slate-700/50 rounded-lg p-4">
                    <h5 className="text-green-400 font-bold mb-2 flex items-center">
                      <i className="fas fa-bullseye mr-2"></i>
                      Attacking Intent
                    </h5>
                    <p className="text-slate-300 text-sm leading-relaxed">
                      "Salah's back in form, Watkins is on fire, Isak's got easy fixtures. Three forwards who know where the net is. That's 4-3-3 done properly."
                    </p>
                  </div>

                  <div className="bg-slate-700/50 rounded-lg p-4">
                    <h5 className="text-yellow-400 font-bold mb-2 flex items-center">
                      <i className="fas fa-gem mr-2"></i>
                      The Differential Gem
                    </h5>
                    <p className="text-slate-300 text-sm leading-relaxed">
                      "Areola at 2.1% ownership? That's your secret weapon. West Ham's fixtures are tasty and he's making saves. While everyone's got the same keeper, you've got the edge."
                    </p>
                  </div>
                </div>

                {/* Final Wisdom */}
                <div className="bg-gradient-to-r from-purple-900/30 to-pink-900/30 rounded-lg p-4 border-l-4 border-purple-500">
                  <p className="text-purple-200 text-sm font-medium italic">
                    "Remember - this isn't about following the crowd. It's about spotting patterns before they become obvious. Form is temporary, class is permanent, but fixtures and ownership? That's where mini-leagues are won. Trust the process, back your picks, and don't bottle it when your differential blanks one week. Proper football wisdom, not fancy algorithms."
                  </p>
                </div>
              </div>
            </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="bg-gradient-to-r from-slate-100 to-slate-50 dark:from-slate-900 dark:to-slate-800 px-6 py-4 border-t border-slate-200/50 dark:border-slate-700/50">
        <p className="text-xs text-slate-500 dark:text-slate-400 text-center font-medium">
          <i className="fas fa-whistle mr-2 text-accent"></i>
          Gaffer's trend squad for GW {selectedWeek.split(' ')[1]}. Updated every Wednesday for upcoming fixtures. Use at your own risk!
        </p>
      </div>
    </div>
  );
};

export default GafferTrendSquad;


