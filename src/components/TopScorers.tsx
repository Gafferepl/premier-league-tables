
import React, { useState, useMemo, useRef } from 'react';
import { Player } from '../../types';
import { getTeamLogo } from '../constants';
import ScreenshotButton from './ScreenshotButton';
import PlayerKit from './PlayerKit'; // Import the new Locker Room component
import LogoWithFallback from './LogoWithFallback';
import SkeletonTopScorers from './skeletons/SkeletonTopScorers';
import ShareSnapshot from './ShareSnapshot';

interface TopScorersProps {
  data?: Player[];
}

const GAFFER_BOOT_QUOTES = [
  // Classics (Existing)
  "Decent boots, them. Might help you hit a barn door.",
  "In my day boots were black, heavy, and we liked it!",
  "Cost more than my first house, but they do look sharp.",
  "If you wear these, you better be tracking back, son.",
  "They won't score the goal for you, but they'll look good missing.",
  "Fancy colours. Do they come in 'Hard Work'?",
  
  // Speed & Movement
  "Quicker than a VAR decision, and twice as reliable.",
  "The only thing catching you in these is a cold.",
  "Perfect for running away from your defensive duties.",
  "Faster than the physio running on to waste time in the 90th minute.",
  "You'll be past the full-back before he’s even tied his own laces.",
  "Aerodynamic enough to get you to the canteen before the queue starts.",
  "Lightweight design. Unlike our centre-forward after Christmas.",
  "Built for box-to-box midfielders. Or box-to-bench, depending on your fitness.",
  "So fast, you'll need to check your brakes before the advertising hoardings.",
  "Give the linesman a workout trying to keep up with you.",
  
  // Technique & Skill
  "Might turn that 50p foot of yours into a £50m transfer.",
  "So grippy, you could climb the league table in them.",
  "They won't score the penalty for you, but you'll look good missing it.",
  "Engineered to make your step-overs actually go somewhere.",
  "Helps you find the top corner, or at least the car park behind it.",
  "Touch like velvet. Tackle like a chainsaw. (Chainsaw not included).",
  "Makes a toe-poke look like a tactical finish.",
  "Designed for the 'False 9'. Or the 'False Footballer', in your case.",
  "Even you couldn't trip over the ball in these. Surely.",
  
  // Flashy / Ego
  "If you can't play good, at least look expensive.",
  "Bright enough to distract the keeper while you scuff it in.",
  "These cost more than my first striker, but look at the shine!",
  "Wear these and you're legally required to demand every free-kick.",
  "Approved for use on cold, wet Tuesday nights in Stoke.",
  "Flashy enough to get you kicked, light enough to dodge the tackle.",
  "Colors so loud the referee might book you for dissent.",
  "They don't make them black anymore, do they? Still, nice boots.",
  "Perfect for the player who spends more time on their hair than shooting.",
  "Clean sheets? These boots demand dirty knees.",
  "Finally, a pair of boots that match the size of your ego.",
  
  // Impact & Opposition
  "Send the left-back for a hot dog and a program.",
  "Defenders will need a sat-nav to track your runs.",
  "Twists blood, turns ankles, breaks hearts.",
  "Leave the opposition appealing for offside just to stop you.",
  "So sharp, you'll slice through the defence like a knife through hot butter.",
  "Get these and the opposition manager will put two men on you.",
  "Ghost past defenders like they’re waiting for a bus.",
  "Guaranteed to annoy the opposition fans. And I love that.",
  "Make the centre-half wish he'd taken up golf.",
  "The boots say 'Premier League', even if the fitness says 'Sunday League'."
];

const BOOT_DESCRIPTIONS = [
  "Engineered to leave defenders asking for a taxi.",
  "Aerodynamic enough to outrun the linesman's flag.",
  "Scientifically proven to improve your knee-slide celebrations.",
  "So light, you'll think you've forgotten to put them on.",
  "Built for pace, power, and avoiding training on Mondays."
];

const TIME_SLOTS = ['0-15', '16-30', '31-45', '46-60', '61-75', '76-90+'];

const TopScorers: React.FC<TopScorersProps> = ({ data }) => {
  const [expandedPlayer, setExpandedPlayer] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  
  const players = data?.slice(0, 6) || [];
  const isLoading = players.length === 0;

  // Dynamic season detection based on current date
  const getCurrentSeason = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth();
    
    // Football season runs from August to May
    // August 2024 - May 2025 = 2024/25 season
    if (month >= 7) { // August onwards (month 7 = August)
      return `${year}/${year + 1}`;
    } else { // Before August
      return `${year - 1}/${year}`;
    }
  };

  const currentSeason = getCurrentSeason();

  // Memoize random assignments so they don't change on re-render
  // Updated dependency: Re-roll if the player NAMES change, not just length
  const playerQuotes = useMemo(() => {
    return players.map(() => {
      const randomQuoteIndex = Math.floor(Math.random() * GAFFER_BOOT_QUOTES.length);
      const randomDescIndex = Math.floor(Math.random() * BOOT_DESCRIPTIONS.length);
      return {
        quote: GAFFER_BOOT_QUOTES[randomQuoteIndex],
        desc: BOOT_DESCRIPTIONS[randomDescIndex]
      };
    });
  }, [players.map(p => p.name).join(',')]); 

  const toggleExpand = (name: string) => {
    setExpandedPlayer(expandedPlayer === name ? null : name);
  };

  // Helper for Sentiment Icon
  const getSentimentIcon = (sentiment?: 'up' | 'down' | 'stable') => {
    switch(sentiment) {
      case 'up': return <i className="fas fa-arrow-trend-up text-emerald-500" title="Sentiment: Trending Up"></i>;
      case 'down': return <i className="fas fa-arrow-trend-down text-red-500" title="Sentiment: Trending Down"></i>;
      default: return <i className="fas fa-minus text-slate-300" title="Sentiment: Stable"></i>;
    }
  };

  return (
    <section className="py-16 md:py-24 bg-white dark:bg-dark relative">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-5xl font-heading font-bold mb-4 text-primary dark:text-white inline-block relative pb-2">
            Golden Boot Table <span className="text-accent">{currentSeason}</span>
            <span className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-24 h-1 bg-accent rounded-full"></span>
          </h2>
          <p className="text-slate-600 dark:text-slate-300 mt-4 max-w-2xl mx-auto">
            The deadliest finishers in the league. Click a player for the Gaffer's analysis.
          </p>
        </div>

        <div ref={containerRef} className="max-w-5xl mx-auto bg-white dark:bg-slate-800 rounded-2xl shadow-2xl overflow-hidden border border-slate-200 dark:border-slate-700 relative">
          
          <ShareSnapshot targetRef={containerRef} className="absolute top-2 right-2 z-30" />

          <div className="grid grid-cols-12 bg-slate-100 dark:bg-[#0f172a] text-slate-500 dark:text-slate-400 text-xs font-bold uppercase tracking-widest py-4 px-4 md:px-6 border-b border-slate-200 dark:border-slate-700 pr-16">
            <div className="col-span-1 text-center">#</div>
            <div className="col-span-5 md:col-span-4">Player</div>
            <div className="col-span-2 text-center hidden md:block">Club</div>
            <div className="col-span-2 md:col-span-2 text-center">Total</div>
            <div className="col-span-4 md:col-span-3 text-right">Breakdown</div>
          </div>

          <div className="divide-y divide-slate-100 dark:divide-slate-700">
            {isLoading ? (
               <SkeletonTopScorers />
            ) : (
              players.map((player, index) => {
              const teamLogo = getTeamLogo(player.team);
              const isExpanded = expandedPlayer === player.name;
              const rankColor = index === 0 ? 'text-yellow-500' : index === 1 ? 'text-slate-400' : index === 2 ? 'text-orange-500' : 'text-slate-300';
              
              const assignedQuote = playerQuotes[index]?.quote || GAFFER_BOOT_QUOTES[0];
              const assignedDesc = playerQuotes[index]?.desc || BOOT_DESCRIPTIONS[0];

              const total = player.goals || 0;
              const penalties = player.penalties || 0;
              const nonPenaltyGoals = total - penalties;
              
              const timingData = player.goalTiming || {};
              
              const chartData: { slot: string; count: number; penaltyCount: number; openCount: number }[] = TIME_SLOTS.map(slot => {
                const count = timingData[slot as keyof typeof timingData] || 0;
                return { 
                  slot, 
                  count, 
                  penaltyCount: 0, 
                  openCount: count 
                };
              });

              let penaltiesToDistribute = penalties;
              const sortedIndices = chartData
                .map((d, i) => ({ idx: i, count: d.count }))
                .filter(d => d.count > 0)
                .sort((a, b) => b.count - a.count);

              let safety = 0;
              while (penaltiesToDistribute > 0 && sortedIndices.length > 0 && safety < 50) {
                 for (const item of sortedIndices) {
                    if (penaltiesToDistribute > 0 && chartData[item.idx].openCount > 0) {
                       chartData[item.idx].penaltyCount += 1;
                       chartData[item.idx].openCount -= 1;
                       penaltiesToDistribute -= 1;
                    }
                 }
                 safety++;
              }
              
              const maxVal = Math.max(...chartData.map(d => d.count), 1);

              return (
                <div key={index} className="group transition-colors hover:bg-slate-50 dark:hover:bg-slate-700/20">
                  
                  <div 
                    className="grid grid-cols-12 items-center py-4 px-4 md:px-6 cursor-pointer"
                    onClick={() => toggleExpand(player.name)}
                  >
                    <div className={`col-span-1 text-center font-black text-lg ${rankColor}`}>
                      {index + 1}
                    </div>
                    
                    <div className="col-span-5 md:col-span-4 flex items-center gap-3 md:gap-4">
                      
                      <div className="relative w-12 h-14 md:w-14 md:h-16 shrink-0 transition-transform group-hover:scale-105 duration-300">
                         <PlayerKit 
                            team={player.team} 
                            name={player.name} 
                            number={player.shirtNumber || 9} 
                            className="w-full h-full"
                         />
                         
                         <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-white dark:bg-slate-800 rounded-full flex items-center justify-center shadow-md border border-slate-100 dark:border-slate-600 text-[10px] z-10">
                           {getSentimentIcon(player.transferSentiment)}
                        </div>
                      </div>

                      <div>
                        <h3 className="font-heading font-bold text-primary dark:text-white text-sm md:text-base leading-tight group-hover:text-accent transition-colors">
                          {player.name}
                        </h3>
                        <div className="text-xs text-slate-400 md:hidden flex items-center gap-1 mt-1">
                           <LogoWithFallback src={teamLogo} teamName={player.team} size="w-3 h-3" />
                           {player.team}
                        </div>
                      </div>
                    </div>

                    <div className="col-span-2 text-center hidden md:flex justify-center items-center">
                       <div className="w-8 h-8 transition-transform group-hover:scale-110">
                          <LogoWithFallback src={teamLogo} teamName={player.team} size="w-full h-full" />
                       </div>
                    </div>

                    <div className="col-span-2 md:col-span-2 text-center flex flex-col items-center justify-center">
                      <span className="inline-block bg-primary/10 dark:bg-white/10 text-primary dark:text-white font-black text-xl px-4 py-1 rounded-lg">
                        {player.goals}
                      </span>
                    </div>

                    <div className="col-span-4 md:col-span-3 flex items-center justify-end gap-2 md:gap-4 pl-2">
                       <div className="flex flex-col items-end">
                          <span className="text-xs font-bold text-slate-500 uppercase">Open Play</span>
                          <span className="font-mono font-bold text-slate-700 dark:text-slate-300">{nonPenaltyGoals}</span>
                       </div>
                       
                       <div className="h-8 w-px bg-slate-200 dark:bg-slate-700 mx-1"></div>

                       <div className="flex flex-col items-center min-w-[40px]">
                          <span className="text-[10px] font-bold text-slate-400 uppercase mb-1">Pens</span>
                          <div className={`px-2 py-0.5 rounded text-xs font-bold border ${penalties > 0 ? 'bg-red-50 border-red-200 text-red-600 dark:bg-red-900/20 dark:border-red-800 dark:text-red-400' : 'bg-slate-50 border-slate-200 text-slate-300 dark:bg-slate-800 dark:border-slate-700'}`}>
                             {penalties}
                          </div>
                       </div>
                    </div>
                  </div>

                  <div 
                    className={`grid md:grid-cols-2 gap-6 bg-slate-50 dark:bg-slate-900/50 border-y border-slate-200 dark:border-slate-700 overflow-hidden transition-all duration-500 ease-in-out ${isExpanded ? 'max-h-[600px] opacity-100 p-6' : 'max-h-0 opacity-0 p-0 border-none'}`}
                  >
                    
                    <div className="bg-white dark:bg-slate-800 p-5 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 flex flex-col h-full">
                       <div className="flex justify-between items-center mb-4">
                          <h4 className="text-sm font-bold uppercase tracking-wider text-slate-500 flex items-center gap-2">
                            <i className="far fa-clock text-accent"></i> When They Strike
                          </h4>
                          
                          <div className="flex items-center gap-3 text-[10px] font-bold uppercase">
                             <div className="flex items-center gap-1">
                                <div className="w-2 h-2 bg-primary rounded-sm"></div> Open Play
                             </div>
                             {penalties > 0 && (
                               <div className="flex items-center gap-1">
                                  <div className="w-2 h-2 bg-red-500/80 rounded-sm bg-[url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAQAAAAECAYAAACp8Z5+AAAAIklEQVQIW2NkQAKrVq36zwjjgzhhYWGMYAEYB8RmROaABADeOQ8CXl/xfgAAAABJRU5ErkJggg==')] border border-red-600/30"></div> Pens
                               </div>
                             )}
                          </div>
                       </div>
                       
                       <div className="flex items-end justify-between h-48 gap-2 px-2 flex-grow relative">
                          <div className="absolute inset-0 flex flex-col justify-between text-[9px] text-slate-300 pointer-events-none z-0 h-[85%]">
                             <div className="w-full border-b border-dashed border-slate-100 dark:border-slate-700/50 h-px"></div>
                             <div className="w-full border-b border-dashed border-slate-100 dark:border-slate-700/50 h-px"></div>
                             <div className="w-full border-b border-dashed border-slate-100 dark:border-slate-700/50 h-px"></div>
                             <div className="w-full border-b border-slate-200 dark:border-slate-600 h-px"></div>
                          </div>

                          {chartData.map((d) => {
                             const openHeightPct = maxVal > 0 ? (d.openCount / maxVal) * 100 : 0;
                             const penHeightPct = maxVal > 0 ? (d.penaltyCount / maxVal) * 100 : 0;
                             
                             const totalCount = d.count;
                             const isMax = totalCount === maxVal && totalCount > 0;

                             return (
                               <div key={d.slot} className="flex flex-col items-center justify-end h-full flex-1 z-10 group/bar relative">
                                  <div className={`text-sm font-black mb-1 transition-all duration-300 ${isMax ? 'text-accent scale-110' : 'text-slate-600 dark:text-slate-300'}`}>
                                    {totalCount > 0 ? totalCount : ''}
                                  </div>
                                  
                                  <div className="w-full h-full flex flex-col justify-end rounded-t-md overflow-hidden relative">
                                     {penHeightPct > 0 && (
                                       <div 
                                         className="w-full bg-red-500/90 bg-[url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAQAAAAECAYAAACp8Z5+AAAAIklEQVQIW2NkQAKrVq36zwjjgzhhYWGMYAEYB8RmROaABADeOQ8CXl/xfgAAAABJRU5ErkJggg==')] border-b border-white/10 relative z-20 transition-all duration-500 flex items-center justify-center"
                                         style={{ height: `${penHeightPct}%` }}
                                         title={`${d.penaltyCount} Penalties`}
                                       >
                                          <span className="text-[10px] text-white font-black drop-shadow-md">
                                            {d.penaltyCount}
                                          </span>
                                       </div>
                                     )}
                                     
                                     {openHeightPct > 0 && (
                                       <div 
                                         className={`w-full bg-primary transition-all duration-500 group-hover/bar:bg-blue-800 relative z-10 ${isMax && penHeightPct === 0 ? 'shadow-[0_0_15px_rgba(26,35,126,0.5)]' : ''}`}
                                         style={{ height: `${openHeightPct}%` }}
                                         title={`${d.openCount} Open Play`}
                                       >
                                          {penHeightPct === 0 && <div className="absolute top-0 w-full h-1 bg-primary rounded-t-md"></div>}
                                          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-50"></div>
                                       </div>
                                     )}
                                  </div>
                                  
                                  <div className={`text-[9px] md:text-[10px] mt-2 font-mono font-bold ${isMax ? 'text-accent' : 'text-slate-400'}`}>{d.slot}</div>
                               </div>
                             );
                          })}
                       </div>
                    </div>

                    <div className="relative bg-gradient-to-br from-primary to-blue-900 rounded-xl p-1 shadow-lg overflow-hidden text-white flex flex-col">
                       <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
                       
                       <div className="relative z-10 p-4 h-full flex flex-col">
                          <div className="flex items-center gap-3 mb-3 border-b border-white/10 pb-3">
                             <img src="/says.svg" className="w-12 h-12 object-contain bg-white rounded-full p-1 border-2 border-accent" alt="Gaffer" data-html2canvas-ignore loading="lazy" />
                             <div>
                                <h4 className="font-heading font-bold text-warning text-sm uppercase tracking-widest">The Gaffer's Boot Room</h4>
                                <p className="text-xs text-blue-200 italic">"{assignedQuote}"</p>
                             </div>
                          </div>

                          <div className="flex-grow flex flex-col justify-center items-center text-center space-y-2">
                             <div className="text-4xl text-accent mb-1">
                                <i className="fas fa-shoe-prints transform -rotate-12"></i>
                             </div>
                             <h5 className="font-bold text-lg">{player.boots}</h5>
                             <p className="text-xs text-blue-200 max-w-xs mx-auto">
                                Worn by {player.name}. {assignedDesc}
                             </p>
                          </div>

                          <div className="mt-2 text-center">
                             <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-white/10 border border-white/20 ${player.transferSentiment === 'up' ? 'text-emerald-400' : player.transferSentiment === 'down' ? 'text-red-400' : 'text-slate-300'}`}>
                                {getSentimentIcon(player.transferSentiment)}
                                <span className="uppercase tracking-wide">Form: {player.transferSentiment || 'Stable'}</span>
                             </span>
                          </div>

                          <div className="mt-4">
                             <button 
                               onClick={(e) => {
                                 e.preventDefault();
                                 // Open email for serious affiliate inquiries
                                 window.location.href = 'mailto:partnerships@premierleaguetables.com?subject=Golden Boot Partnership Inquiry&body=Hi, I\'m interested in discussing a partnership opportunity for the Golden Boot section.';
                               }}
                               className="bg-orange-500 hover:bg-orange-600 text-white py-2 px-4 rounded-lg font-bold text-center text-sm shadow-lg transition-transform hover:-translate-y-1 flex items-center justify-center gap-2 w-full"
                               data-html2canvas-ignore
                             >
                               <span>Partner With Us</span>
                               <i className="fas fa-envelope text-xs"></i>
                             </button>
                             <div className="text-[9px] text-center mt-2 text-white/40">
                                Partnership opportunities available. Contact us for details.
                             </div>
                          </div>
                       </div>
                    </div>

                  </div>
                </div>
              );
            }))}
          </div>
        </div>
        
        <div className="max-w-4xl mx-auto mt-10 px-4">
           <div className="bg-yellow-50 dark:bg-yellow-900/10 border border-yellow-200 dark:border-yellow-800 rounded-xl p-4 md:p-6 flex flex-col md:flex-row items-center gap-4 shadow-sm">
              <div className="shrink-0 bg-white dark:bg-slate-800 p-3 rounded-full border border-yellow-100 shadow-sm">
                 <i className="fas fa-hand-holding-usd text-warning text-2xl"></i>
              </div>
              <div className="text-center md:text-left">
                 <p className="text-sm font-bold text-slate-700 dark:text-slate-200 mb-2 font-heading italic">
                    "Listen lads, using these links helps keep the floodlights on and buys the odd pie for the backroom staff. I'm not buying a yacht, I'm buying bandwidth (and gravy)."
                 </p>
                 <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                    <span className="font-bold text-primary dark:text-accent uppercase tracking-wider mr-1">Transparency Note:</span> 
                    If you click a link and buy something, we may earn a small commission. <strong>It costs you absolutely nothing extra</strong> – the price is the same for you. It just helps support the site so we can keep bringing you the stats without a paywall. Cheers!
                 </p>
              </div>
           </div>
        </div>

      </div>
    </section>
  );
};

export default TopScorers;


