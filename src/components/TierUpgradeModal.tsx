import React, { useEffect } from 'react';

export type LockedFeature =
  | 'snapshot'
  | 'advanced-filters'
  | 'export-squad'
  | 'player-stats-deep'
  | 'live-points-full';

interface TierUpgradeModalProps {
  feature: LockedFeature;
  onClose: () => void;
}

/* ── Per-feature context copy ── */
const FEATURE_COPY: Record<LockedFeature, {
  icon: string;
  title: string;
  description: string;
  minTier: 'first-team' | 'season-pass';
}> = {
  'snapshot': {
    icon: '📸',
    title: 'Viral Snapshot',
    description: 'Download a branded polaroid card of your squad or player stats and share it directly to X / Twitter.',
    minTier: 'season-pass',
  },
  'advanced-filters': {
    icon: '🔍',
    title: 'Advanced Player Filters',
    description: 'Filter by xG, xA, ICT index, ownership range, price band, and injury status to find hidden gems.',
    minTier: 'first-team',
  },
  'export-squad': {
    icon: '📤',
    title: 'Export Squad',
    description: 'Export your Dream XI as a shareable image or copy the full squad breakdown to your clipboard.',
    minTier: 'season-pass',
  },
  'player-stats-deep': {
    icon: '📊',
    title: 'Deep Player Stats',
    description: 'Unlock full xG timelines, set-piece involvement, and head-to-head fixture history for every player.',
    minTier: 'first-team',
  },
  'live-points-full': {
    icon: '⚡',
    title: 'Full Live Points Feed',
    description: 'See live bonus point projections, BPS breakdowns, and captain multiplier tracking in real time.',
    minTier: 'first-team',
  },
};

/* ── Tier definitions — mirrors PricingSection exactly ── */
const TIERS: {
  id: 'free' | 'first-team' | 'season-pass';
  name: string;
  price: string;
  icon: string;
  borderColor: string;
  bgColor: string;
  badgeColor: string;
  features: string[];
  locked: string[];
  cta: string | null;
  ctaClass: string;
}[] = [
  {
    id: 'free',
    name: 'Free',
    price: 'Free forever',
    icon: '📋',
    borderColor: 'border-slate-600',
    bgColor: 'bg-slate-800/40',
    badgeColor: 'bg-slate-700 text-slate-300',
    features: [
      'League table & live fixtures',
      'Weekly newsletter',
      'Beat the Gaffer game',
      'Basic stats & analysis',
    ],
    locked: [
      'Advanced player filters',
      'Deep player stats',
      'Viral snapshots & export',
      'Live bonus projections',
    ],
    cta: null,
    ctaClass: '',
  },
  {
    id: 'first-team',
    name: 'First Team',
    price: '£2.99 / gameweek',
    icon: '👥',
    borderColor: 'border-green-500/40',
    bgColor: 'bg-green-900/20',
    badgeColor: 'bg-green-600 text-white',
    features: [
      'Everything in Free, plus:',
      'Advanced player filters',
      'Deep player stats & xG',
      'Full live points feed',
      'Captaincy Matrix',
      'Physio Room injury feed',
    ],
    locked: [
      'Viral snapshots & export',
    ],
    cta: 'Get First Team — £2.99/gw',
    ctaClass: 'bg-green-600 hover:bg-green-500 text-white',
  },
  {
    id: 'season-pass',
    name: 'Season Pass',
    price: '£49.99 one-time',
    icon: '👑',
    borderColor: 'border-yellow-500/40',
    bgColor: 'bg-yellow-900/20',
    badgeColor: 'bg-yellow-500 text-slate-900',
    features: [
      'Everything in First Team, plus:',
      'Viral snapshot & share to X',
      'Squad export',
      'Crystal Ball AI projections',
      'Set-Piece Radar',
      'Chip Strategy Vault',
      'Insider Blank/Double GW alerts',
    ],
    locked: [],
    cta: 'Get Season Pass — £49.99',
    ctaClass: 'bg-yellow-500 hover:bg-yellow-400 text-slate-900',
  },
];

const TierUpgradeModal: React.FC<TierUpgradeModalProps> = ({ feature, onClose }) => {
  const copy = FEATURE_COPY[feature];

  /* Close on Escape */
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [onClose]);

  /* Lock body scroll */
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  const scrollToPricing = () => {
    onClose();
    setTimeout(() => {
      const el = document.getElementById('newsletter');
      if (el) window.scrollTo({ top: el.offsetTop - 72, behavior: 'smooth' });
    }, 150);
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/75 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-xl bg-slate-900 rounded-2xl border border-white/10 shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">

        {/* Header */}
        <div className="bg-gradient-to-r from-slate-800 to-slate-900 px-5 py-4 border-b border-white/10 flex items-start justify-between gap-4 shrink-0">
          <div className="flex items-start gap-3">
            <span className="text-3xl leading-none mt-0.5">{copy.icon}</span>
            <div>
              <span className="inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-widest text-red-400 bg-red-400/10 px-2 py-0.5 rounded-full mb-1">
                <i className="fas fa-lock text-[8px]"></i> Locked Feature
              </span>
              <h2 className="text-lg font-black text-white leading-tight">{copy.title}</h2>
              <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">{copy.description}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="shrink-0 w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white/50 hover:text-white transition-colors"
          >
            <i className="fas fa-times text-xs"></i>
          </button>
        </div>

        {/* Tier cards */}
        <div className="overflow-y-auto p-4 space-y-3">
          <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">
            Upgrade to unlock this feature
          </p>

          {TIERS.map(tier => {
            const unlocks = copy.minTier === 'season-pass'
              ? tier.id === 'season-pass'
              : tier.id !== 'free';
            const isCurrent = tier.id === 'free';

            return (
              <div
                key={tier.id}
                className={`rounded-xl border p-4 transition-all ${tier.borderColor} ${tier.bgColor} ${
                  unlocks && !isCurrent ? 'ring-1 ring-white/15' : ''
                } ${isCurrent ? 'opacity-50' : ''}`}
              >
                {/* Tier header */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{tier.icon}</span>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-black text-white text-sm">{tier.name}</span>
                        {isCurrent && (
                          <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-slate-600 text-slate-300 uppercase tracking-wider">
                            Your plan
                          </span>
                        )}
                        {unlocks && !isCurrent && (
                          <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full uppercase tracking-wider ${tier.badgeColor}`}>
                            ✓ Unlocks this
                          </span>
                        )}
                      </div>
                      <span className="text-xs text-slate-400">{tier.price}</span>
                    </div>
                  </div>
                </div>

                {/* Feature list */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-3 gap-y-1 mb-3">
                  {tier.features.map(f => (
                    <div key={f} className="flex items-start gap-1.5 text-xs text-slate-300">
                      <i className="fas fa-check text-green-400 text-[9px] mt-0.5 shrink-0"></i>
                      <span>{f}</span>
                    </div>
                  ))}
                  {tier.locked.map(f => (
                    <div key={f} className="flex items-start gap-1.5 text-xs text-slate-500">
                      <i className="fas fa-lock text-slate-600 text-[9px] mt-0.5 shrink-0"></i>
                      <span>{f}</span>
                    </div>
                  ))}
                </div>

                {/* CTA */}
                {tier.cta && (
                  <button
                    onClick={scrollToPricing}
                    className={`w-full py-2.5 rounded-lg text-sm font-black transition-colors ${tier.ctaClass}`}
                  >
                    {tier.cta}
                  </button>
                )}
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="shrink-0 px-5 py-3 border-t border-white/10 bg-slate-900 flex items-center justify-between gap-3">
          <p className="text-xs text-slate-500">
            <i className="fas fa-shield-alt mr-1 text-green-500"></i>
            No credit card needed for Free · Cancel anytime
          </p>
          <button
            onClick={onClose}
            className="text-xs font-bold text-slate-400 hover:text-white transition-colors whitespace-nowrap"
          >
            Maybe later
          </button>
        </div>
      </div>
    </div>
  );
};

export default TierUpgradeModal;


