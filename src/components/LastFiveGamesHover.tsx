import React, { useState, useEffect } from 'react';
import { getTeamLogo } from '../constants';
import LogoWithFallback from './LogoWithFallback';

interface LastGame {
  opponent: string;
  result: 'W' | 'D' | 'L';
  score: string;
  home: boolean;
  gameweek?: number;
  date?: string;
}

interface LastFiveGamesHoverProps {
  homeTeam: string;
  awayTeam: string;
  children: React.ReactNode;
}

const LastFiveGamesHover: React.FC<LastFiveGamesHoverProps> = ({ 
  homeTeam, 
  awayTeam, 
  children 
}) => {
  const [showHover, setShowHover] = useState(false);
  const [hoverPosition, setHoverPosition] = useState({ x: 0, y: 0 });

  // Inject CSS to ensure maximum z-index
  useEffect(() => {
    const styleId = 'last-five-games-hover-styles';
    if (!document.getElementById(styleId)) {
      const style = document.createElement('style');
      style.id = styleId;
      style.textContent = `
        .last-five-games-popup {
          position: fixed !important;
          z-index: 2147483647 !important;
          pointer-events: auto !important;
          user-select: none !important;
        }
      `;
      document.head.appendChild(style);
    }
  }, []);

  // Mock last 5 games data - in real app this would come from API
  const getLastFiveGames = (team: string): LastGame[] => {
    // Mock data for demonstration with full club names
    const mockData: Record<string, LastGame[]> = {
      'Arsenal': [
        { opponent: 'Chelsea', result: 'W', score: '3-1', home: true, gameweek: 22, date: 'Sat 25 Jan' },
        { opponent: 'Manchester United', result: 'D', score: '2-2', home: false, gameweek: 23, date: 'Sat 1 Feb' },
        { opponent: 'Liverpool', result: 'L', score: '1-2', home: true, gameweek: 24, date: 'Sat 8 Feb' },
        { opponent: 'Tottenham Hotspur', result: 'W', score: '2-0', home: false, gameweek: 25, date: 'Sun 15 Feb' },
        { opponent: 'Manchester City', result: 'D', score: '1-1', home: true, gameweek: 26, date: 'Sat 22 Feb' }
      ],
      'Chelsea': [
        { opponent: 'Liverpool', result: 'W', score: '2-1', home: true, gameweek: 22, date: 'Sat 25 Jan' },
        { opponent: 'Arsenal', result: 'L', score: '1-3', home: false, gameweek: 23, date: 'Sat 1 Feb' },
        { opponent: 'Manchester City', result: 'D', score: '1-1', home: true, gameweek: 24, date: 'Sat 8 Feb' },
        { opponent: 'Tottenham Hotspur', result: 'W', score: '3-2', home: false, gameweek: 25, date: 'Sun 15 Feb' },
        { opponent: 'Manchester United', result: 'L', score: '0-1', home: true, gameweek: 26, date: 'Sat 22 Feb' }
      ],
      'Liverpool': [
        { opponent: 'Manchester City', result: 'W', score: '3-2', home: true, gameweek: 22, date: 'Sun 26 Jan' },
        { opponent: 'Chelsea', result: 'L', score: '1-2', home: false, gameweek: 23, date: 'Sat 1 Feb' },
        { opponent: 'Arsenal', result: 'W', score: '2-1', home: true, gameweek: 24, date: 'Sun 9 Feb' },
        { opponent: 'Manchester United', result: 'D', score: '1-1', home: false, gameweek: 25, date: 'Sat 15 Feb' },
        { opponent: 'Tottenham Hotspur', result: 'W', score: '4-2', home: true, gameweek: 26, date: 'Sat 22 Feb' }
      ],
      'Manchester City': [
        { opponent: 'Manchester United', result: 'W', score: '3-0', home: true, gameweek: 22, date: 'Sat 25 Jan' },
        { opponent: 'Liverpool', result: 'L', score: '2-3', home: false, gameweek: 23, date: 'Sun 2 Feb' },
        { opponent: 'Chelsea', result: 'D', score: '1-1', home: true, gameweek: 24, date: 'Sat 8 Feb' },
        { opponent: 'Arsenal', result: 'W', score: '2-1', home: false, gameweek: 25, date: 'Sun 16 Feb' },
        { opponent: 'Tottenham Hotspur', result: 'W', score: '3-1', home: true, gameweek: 26, date: 'Sat 22 Feb' }
      ],
      'Manchester United': [
        { opponent: 'Tottenham Hotspur', result: 'W', score: '2-1', home: true, gameweek: 22, date: 'Sat 25 Jan' },
        { opponent: 'Manchester City', result: 'L', score: '0-3', home: false, gameweek: 23, date: 'Sat 1 Feb' },
        { opponent: 'Liverpool', result: 'D', score: '1-1', home: true, gameweek: 24, date: 'Sat 8 Feb' },
        { opponent: 'Chelsea', result: 'W', score: '1-0', home: false, gameweek: 25, date: 'Sun 15 Feb' },
        { opponent: 'Arsenal', result: 'D', score: '2-2', home: true, gameweek: 26, date: 'Sat 22 Feb' }
      ],
      'Tottenham Hotspur': [
        { opponent: 'Arsenal', result: 'L', score: '0-2', home: true, gameweek: 22, date: 'Sat 25 Jan' },
        { opponent: 'Manchester United', result: 'L', score: '1-2', home: false, gameweek: 23, date: 'Sat 1 Feb' },
        { opponent: 'Manchester City', result: 'L', score: '1-3', home: true, gameweek: 24, date: 'Sun 9 Feb' },
        { opponent: 'Liverpool', result: 'L', score: '2-4', home: false, gameweek: 25, date: 'Sat 15 Feb' },
        { opponent: 'Chelsea', result: 'L', score: '2-3', home: true, gameweek: 26, date: 'Sat 22 Feb' }
      ],
      'Aston Villa': [
        { opponent: 'Brighton & Hove Albion', result: 'W', score: '2-1', home: true, gameweek: 22, date: 'Sat 25 Jan' },
        { opponent: 'Newcastle United', result: 'D', score: '1-1', home: false, gameweek: 23, date: 'Sat 1 Feb' },
        { opponent: 'West Ham United', result: 'W', score: '3-0', home: true, gameweek: 24, date: 'Sat 8 Feb' },
        { opponent: 'Crystal Palace', result: 'L', score: '1-2', home: false, gameweek: 25, date: 'Sun 16 Feb' },
        { opponent: 'Brentford', result: 'W', score: '2-0', home: true, gameweek: 26, date: 'Sat 22 Feb' }
      ],
      'Newcastle United': [
        { opponent: 'Everton', result: 'W', score: '3-1', home: true, gameweek: 22, date: 'Sat 25 Jan' },
        { opponent: 'Aston Villa', result: 'D', score: '1-1', home: false, gameweek: 23, date: 'Sun 2 Feb' },
        { opponent: 'Fulham', result: 'W', score: '2-0', home: true, gameweek: 24, date: 'Sat 8 Feb' },
        { opponent: 'Wolverhampton', result: 'L', score: '1-2', home: false, gameweek: 25, date: 'Sat 15 Feb' },
        { opponent: 'Nottingham Forest', result: 'W', score: '2-1', home: true, gameweek: 26, date: 'Sat 22 Feb' }
      ],
      'Brighton & Hove Albion': [
        { opponent: 'Aston Villa', result: 'L', score: '1-2', home: true, gameweek: 22, date: 'Sun 26 Jan' },
        { opponent: 'Bournemouth', result: 'W', score: '2-0', home: false, gameweek: 23, date: 'Sat 1 Feb' },
        { opponent: 'Crystal Palace', result: 'D', score: '1-1', home: true, gameweek: 24, date: 'Sat 8 Feb' },
        { opponent: 'West Ham United', result: 'W', score: '3-1', home: false, gameweek: 25, date: 'Sun 15 Feb' },
        { opponent: 'Brentford', result: 'L', score: '0-1', home: true, gameweek: 26, date: 'Sat 22 Feb' }
      ],
      'West Ham United': [
        { opponent: 'Aston Villa', result: 'L', score: '0-3', home: true, gameweek: 22, date: 'Sat 25 Jan' },
        { opponent: 'Brighton & Hove Albion', result: 'L', score: '1-3', home: false, gameweek: 23, date: 'Sat 1 Feb' },
        { opponent: 'Fulham', result: 'D', score: '1-1', home: true, gameweek: 24, date: 'Sat 8 Feb' },
        { opponent: 'Wolverhampton', result: 'W', score: '2-1', home: false, gameweek: 25, date: 'Sat 15 Feb' },
        { opponent: 'Crystal Palace', result: 'W', score: '2-0', home: true, gameweek: 26, date: 'Sat 22 Feb' }
      ]
    };

    return mockData[team] || [
      { opponent: 'Crystal Palace', result: 'W', score: '2-1', home: true, gameweek: 22, date: 'Sat 25 Jan' },
      { opponent: 'Fulham', result: 'D', score: '1-1', home: false, gameweek: 23, date: 'Sat 1 Feb' },
      { opponent: 'Brentford', result: 'L', score: '0-1', home: true, gameweek: 24, date: 'Sat 8 Feb' },
      { opponent: 'Wolverhampton', result: 'W', score: '3-2', home: false, gameweek: 25, date: 'Sat 15 Feb' },
      { opponent: 'Everton', result: 'D', score: '2-2', home: true, gameweek: 26, date: 'Sat 22 Feb' }
    ];
  };

  const getResultColor = (result: string) => {
    switch (result) {
      case 'W': return 'bg-green-500 text-white';
      case 'D': return 'bg-yellow-500 text-white';
      case 'L': return 'bg-red-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  const homeTeamGames = getLastFiveGames(homeTeam);
  const awayTeamGames = getLastFiveGames(awayTeam);

  return (
    <div 
      className="relative inline-block"
      onMouseEnter={() => setShowHover(true)}
      onMouseLeave={() => setShowHover(false)}
      onMouseMove={(e) => {
        setHoverPosition({ x: e.clientX, y: e.clientY });
      }}
    >
      {children}
      
      {showHover && (
        <div 
          className="last-five-games-popup bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-600 rounded-lg shadow-2xl p-0 w-[500px] overflow-hidden"
          style={{
            left: `${Math.min(hoverPosition.x + 80, window.innerWidth - 520)}px`,
            top: '50%',
            transform: 'translateY(-50%)'
          }}
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-red-600 text-white p-3 text-center">
            <h3 className="font-bold text-sm uppercase tracking-wider">Last 5 Games</h3>
            <p className="text-xs opacity-90 mt-1">Form & Recent Results</p>
          </div>

          {/* Teams Header */}
          <div className="grid grid-cols-2 gap-0 border-b border-slate-200 dark:border-slate-600">
            <div className="bg-blue-50 dark:bg-blue-900/20 p-3 text-center border-r border-slate-200 dark:border-slate-600">
              <div className="flex items-center justify-center gap-2">
                <div className="w-8 h-8 shrink-0">
                  <LogoWithFallback 
                    src={getTeamLogo(homeTeam)} 
                    teamName={homeTeam} 
                    size="w-full h-full" 
                    className="drop-shadow-sm" 
                  />
                </div>
                <span className="font-bold text-sm text-blue-900 dark:text-blue-300">{homeTeam}</span>
              </div>
            </div>
            <div className="bg-red-50 dark:bg-red-900/20 p-3 text-center">
              <div className="flex items-center justify-center gap-2">
                <div className="w-8 h-8 shrink-0">
                  <LogoWithFallback 
                    src={getTeamLogo(awayTeam)} 
                    teamName={awayTeam} 
                    size="w-full h-full" 
                    className="drop-shadow-sm" 
                  />
                </div>
                <span className="font-bold text-sm text-red-900 dark:text-red-300">{awayTeam}</span>
              </div>
            </div>
          </div>

          {/* Games Grid */}
          <div className="grid grid-cols-2 gap-0">
            {/* Home Team Games */}
            <div className="border-r border-slate-200 dark:border-slate-600">
              <div className="divide-y divide-slate-100 dark:divide-slate-700">
                {homeTeamGames.map((game, index) => (
                  <div key={index} className="px-2 py-1.5 hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors">
                    <div className="flex items-center gap-1.5">
                      <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold flex-shrink-0 ${getResultColor(game.result)}`}>
                        {game.result}
                      </span>
                      <div className="w-4 h-4 flex-shrink-0">
                        <LogoWithFallback 
                          src={getTeamLogo(game.opponent)} 
                          teamName={game.opponent} 
                          size="w-full h-full" 
                          className="drop-shadow-sm" 
                        />
                      </div>
                      <div className="min-w-0 flex-1 overflow-hidden">
                        <div className="text-[11px] font-medium text-slate-700 dark:text-slate-300 leading-tight truncate">
                          {game.opponent}
                        </div>
                        <div className="text-[9px] text-slate-400 dark:text-slate-500 leading-tight truncate">
                          {game.home ? 'Home' : 'Away'}{game.gameweek ? ` • GW${game.gameweek}` : ''}{game.date ? ` • ${game.date}` : ''}
                        </div>
                      </div>
                      <span className="font-mono text-[10px] font-bold text-slate-900 dark:text-slate-100 bg-slate-100 dark:bg-slate-700 px-1.5 py-0.5 rounded flex-shrink-0">
                        {game.score}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Away Team Games */}
            <div>
              <div className="divide-y divide-slate-100 dark:divide-slate-700">
                {awayTeamGames.map((game, index) => (
                  <div key={index} className="px-2 py-1.5 hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors">
                    <div className="flex items-center gap-1.5">
                      <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold flex-shrink-0 ${getResultColor(game.result)}`}>
                        {game.result}
                      </span>
                      <div className="w-4 h-4 flex-shrink-0">
                        <LogoWithFallback 
                          src={getTeamLogo(game.opponent)} 
                          teamName={game.opponent} 
                          size="w-full h-full" 
                          className="drop-shadow-sm" 
                        />
                      </div>
                      <div className="min-w-0 flex-1 overflow-hidden">
                        <div className="text-[11px] font-medium text-slate-700 dark:text-slate-300 leading-tight truncate">
                          {game.opponent}
                        </div>
                        <div className="text-[9px] text-slate-400 dark:text-slate-500 leading-tight truncate">
                          {game.home ? 'Home' : 'Away'}{game.gameweek ? ` • GW${game.gameweek}` : ''}{game.date ? ` • ${game.date}` : ''}
                        </div>
                      </div>
                      <span className="font-mono text-[10px] font-bold text-slate-900 dark:text-slate-100 bg-slate-100 dark:bg-slate-700 px-1.5 py-0.5 rounded flex-shrink-0">
                        {game.score}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Form Summary Footer */}
          <div className="bg-slate-50 dark:bg-slate-900 border-t border-slate-200 dark:border-slate-600 p-3">
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <div className="text-xs text-slate-600 dark:text-slate-400 mb-1 font-medium">Form</div>
                <div className="flex justify-center gap-1">
                  {homeTeamGames.slice(-5).map((game, index) => (
                    <span key={index} className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold ${getResultColor(game.result)}`}>
                      {game.result}
                    </span>
                  ))}
                </div>
              </div>
              <div className="text-center">
                <div className="text-xs text-slate-600 dark:text-slate-400 mb-1 font-medium">Form</div>
                <div className="flex justify-center gap-1">
                  {awayTeamGames.slice(-5).map((game, index) => (
                    <span key={index} className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold ${getResultColor(game.result)}`}>
                      {game.result}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LastFiveGamesHover;


