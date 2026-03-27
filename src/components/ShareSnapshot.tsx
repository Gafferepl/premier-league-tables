
import React, { useState } from 'react';
import html2canvas from 'html2canvas';
import TierUpgradeModal from './TierUpgradeModal';

export type SnapshotTemplate = 'default' | 'squad' | 'player-card' | 'gw-points';
export type UserTier = 'free' | 'season-pass' | 'first-team';

interface ShareSnapshotProps {
  targetId?: string;
  targetRef?: React.RefObject<HTMLElement | null>;
  cropHeight?: number;
  className?: string;
  label?: string;
  darkContext?: boolean;
  template?: SnapshotTemplate;
  userTier?: UserTier;
  shareText?: string; // Custom text for the X/Twitter share
}

/* ── Template config ── */
const TEMPLATE_CONFIG: Record<SnapshotTemplate, { stampText: string; filename: string; tweetPrefix: string }> = {
  'default':      { stampText: '@TheGafferEPL APPROVED',  filename: 'Gaffer_Report',   tweetPrefix: 'Check this out from @TheGafferEPL 👀' },
  'squad':        { stampText: 'MY DREAM XI ⚽',           filename: 'Gaffer_Squad',    tweetPrefix: 'Rate my Dream XI 👇 Built on @TheGafferEPL' },
  'player-card':  { stampText: 'PLAYER REPORT 📊',         filename: 'Gaffer_Player',   tweetPrefix: 'Player stats via @TheGafferEPL 📊' },
  'gw-points':    { stampText: 'GW POINTS HAUL 🏆',        filename: 'Gaffer_GW',       tweetPrefix: 'My Gameweek haul 🔥 via @TheGafferEPL' },
};

/* ── Draw diagonal watermark across image area ── */
const drawWatermark = (
  ctx: CanvasRenderingContext2D,
  x: number, y: number, w: number, h: number,
  scale: number, tier: UserTier
) => {
  if (tier === 'first-team') return; // Clean — no watermark

  ctx.save();
  ctx.globalAlpha = tier === 'free' ? 0.35 : 0.12;
  ctx.fillStyle = '#b91c1c';
  ctx.font = `900 ${28 * scale}px "Impact", "Arial Black", sans-serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  const text = tier === 'free' ? '🔒 UPGRADE TO SHARE • premierleaguetables.com • ' : 'premierleaguetables.com • ';
  const repeatCount = tier === 'free' ? 6 : 10;

  ctx.translate(x + w / 2, y + h / 2);
  ctx.rotate(-30 * Math.PI / 180);

  const lineSpacing = 80 * scale;
  const lines = Math.ceil(h / lineSpacing) + 4;
  for (let i = -lines; i <= lines; i++) {
    ctx.fillText(text.repeat(repeatCount), 0, i * lineSpacing);
  }
  ctx.restore();
};

const ShareSnapshot: React.FC<ShareSnapshotProps> = ({
  targetId, targetRef, cropHeight, className, label, darkContext,
  template = 'default', userTier = 'first-team', shareText
}) => {
  const [isCapturing, setIsCapturing] = useState(false);
  const [flash, setFlash] = useState(false);
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [lastBlobUrl, setLastBlobUrl] = useState<string | null>(null);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);

  const config = TEMPLATE_CONFIG[template];

  const buildCanvas = async (): Promise<{ canvas: HTMLCanvasElement; blobUrl: string } | null> => {
    let element: HTMLElement | null = null;
    if (targetRef?.current) {
      element = targetRef.current;
    } else if (targetId) {
      element = document.getElementById(targetId);
    }
    if (!element) { // console.error("Gaffer Camera: Target missing."); return null; }

    setFlash(true);
    setIsCapturing(true);
    document.body.style.cursor = 'wait';

    await new Promise(resolve => requestAnimationFrame(() => setTimeout(resolve, 300)));

    try {
      const scale = 2;

      const rawCanvas = await html2canvas(element, {
        scale,
        useCORS: true,
        backgroundColor: null,
        ignoreElements: (el) => el.hasAttribute('data-html2canvas-ignore'),
        logging: false,
        windowWidth: 1280,
      });

      const sourceWidth  = rawCanvas.width;
      const sourceHeight = cropHeight ? cropHeight * scale : rawCanvas.height;

      const borderX      = 30 * scale;
      const borderTop    = 30 * scale;
      const borderBottom = 150 * scale;

      const finalWidth  = sourceWidth + (borderX * 2);
      const finalHeight = sourceHeight + borderTop + borderBottom;

      const finalCanvas = document.createElement('canvas');
      finalCanvas.width  = finalWidth;
      finalCanvas.height = finalHeight;
      const ctx = finalCanvas.getContext('2d');
      if (!ctx) throw new Error("Canvas context failed");

      // Paper background
      const paperGradient = ctx.createLinearGradient(0, 0, finalWidth, finalHeight);
      paperGradient.addColorStop(0, '#fdfbf7');
      paperGradient.addColorStop(1, '#f2efe9');
      ctx.fillStyle = paperGradient;
      ctx.fillRect(0, 0, finalWidth, finalHeight);

      // Image with shadow
      ctx.save();
      ctx.shadowColor = "rgba(0,0,0,0.2)";
      ctx.shadowBlur = 20;
      ctx.shadowOffsetX = 0;
      ctx.shadowOffsetY = 5;
      ctx.drawImage(rawCanvas, 0, 0, sourceWidth, sourceHeight, borderX, borderTop, sourceWidth, sourceHeight);
      ctx.restore();

      // Hairline border
      ctx.strokeStyle = "rgba(0,0,0,0.1)";
      ctx.lineWidth = 1 * scale;
      ctx.strokeRect(borderX, borderTop, sourceWidth, sourceHeight);

      // Watermark over image area (tier-dependent)
      drawWatermark(ctx, borderX, borderTop, sourceWidth, sourceHeight, scale, userTier);

      // Footer
      const footerY       = borderTop + sourceHeight;
      const footerCenterY = footerY + (borderBottom / 2);

      // Stamp (left)
      ctx.save();
      const stampText = config.stampText;
      const stampW    = 300 * scale; // Reduced width to prevent overlap
      const stampH    = 55 * scale;
      const radius    = 6 * scale;
      const stampColor = userTier === 'free' ? '#6b7280' : '#b91c1c';

      const stampMarginLeft = borderX + (20 * scale);
      const stampCenterX    = stampMarginLeft + (stampW / 2);

      ctx.translate(stampCenterX, footerCenterY);
      ctx.rotate(-5 * Math.PI / 180);
      ctx.globalAlpha = userTier === 'free' ? 0.4 : 0.8;
      ctx.strokeStyle = stampColor;
      ctx.lineWidth = 4 * scale;

      ctx.beginPath();
      const rx = -stampW / 2;
      const ry = -stampH / 2;
      ctx.moveTo(rx + radius, ry);
      ctx.lineTo(rx + stampW - radius, ry);
      ctx.quadraticCurveTo(rx + stampW, ry, rx + stampW, ry + radius);
      ctx.lineTo(rx + stampW, ry + stampH - radius);
      ctx.quadraticCurveTo(rx + stampW, ry + stampH, rx + stampW - radius, ry + stampH);
      ctx.lineTo(rx + radius, ry + stampH);
      ctx.quadraticCurveTo(rx, ry + stampH, rx, ry + stampH - radius);
      ctx.lineTo(rx, ry + radius);
      ctx.quadraticCurveTo(rx, ry, rx + radius, ry);
      ctx.closePath();
      ctx.stroke();

      ctx.fillStyle = stampColor;
      ctx.font = `900 ${20 * scale}px "Impact", "Arial Black", sans-serif`; // Reduced font size
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(stampText, 0, 2 * scale);
      ctx.restore();

      // Tier badge (top-right corner of image) for season-pass
      if (userTier === 'season-pass') {
        ctx.save();
        ctx.globalAlpha = 0.9;
        ctx.fillStyle = '#7c3aed';
        const badgeW = 160 * scale;
        const badgeH = 28 * scale;
        const bx = borderX + sourceWidth - badgeW - (8 * scale);
        const by = borderTop + (8 * scale);
        ctx.fillRect(bx, by, badgeW, badgeH);
        ctx.fillStyle = '#ffffff';
        ctx.font = `700 ${13 * scale}px "Arial", sans-serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('⭐ SEASON PASS', bx + badgeW / 2, by + badgeH / 2);
        ctx.restore();
      }

      // Right side: URL + handle
      const textEndX = finalWidth - borderX - (20 * scale);
      const minTextX = stampMarginLeft + stampW + (40 * scale); // Ensure minimum spacing from stamp
      const actualTextX = Math.max(textEndX, minTextX); // Use the larger of the two
      
      ctx.textAlign = 'right';
      ctx.textBaseline = 'middle';
      ctx.fillStyle = '#0f172a';
      ctx.font = `bold ${20 * scale}px "Courier New", monospace`; // Slightly smaller font
      ctx.fillText("premierleaguetables.com", actualTextX, footerCenterY - (12 * scale));
      ctx.fillStyle = '#d4af37';
      ctx.font = `700 ${16 * scale}px "Montserrat", sans-serif`; // Slightly smaller font
      ctx.fillText("@TheGafferEPL", actualTextX, footerCenterY + (14 * scale));

      // Download
      const blobUrl = await new Promise<string>((resolve) => {
        finalCanvas.toBlob((blob) => {
          if (blob) {
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `${config.filename}_${Date.now()}.png`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            resolve(url);
          } else {
            resolve('');
          }
        }, 'image/png');
      });

      return { canvas: finalCanvas, blobUrl };

    } catch (err) {
      // console.error("Gaffer Card generation failed:", err);
      return null;
    } finally {
      setIsCapturing(false);
      setFlash(false);
      document.body.style.cursor = 'default';
    }
  };

  const handleCapture = async () => {
    if (userTier === 'free') {
      setShowUpgradeModal(true);
      return;
    }
    const result = await buildCanvas();
    if (result?.blobUrl) {
      setLastBlobUrl(result.blobUrl);
      setShowShareMenu(true);
    }
  };

  const handleShareToX = () => {
    const text = shareText || config.tweetPrefix;
    const url  = 'https://premierleaguetables.com';
    const tweetUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(`${text}\n${url}`)}`;
    window.open(tweetUrl, '_blank', 'noopener,noreferrer');
    setShowShareMenu(false);
  };

  const containerClass = className || "absolute top-4 right-4 z-30";
  const showLabel = !!label;
  const isLocked = userTier === 'free';

  return (
    <>
      {showUpgradeModal && (
        <TierUpgradeModal feature="snapshot" onClose={() => setShowUpgradeModal(false)} />
      )}

      <div className={containerClass} data-html2canvas-ignore>

        {/* Share menu popup */}
        {showShareMenu && (
          <div className="absolute bottom-full mb-2 right-0 bg-white dark:bg-slate-800 rounded-xl shadow-2xl border border-slate-200 dark:border-slate-700 overflow-hidden w-48 z-50">
            <div className="px-3 py-2 bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700">
              <p className="text-xs font-black text-slate-600 dark:text-slate-400 uppercase tracking-wider">Share</p>
            </div>
            <button onClick={handleShareToX}
              className="flex items-center gap-3 w-full px-4 py-3 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors text-sm font-bold text-slate-900 dark:text-white">
              <span className="w-6 h-6 bg-black rounded-full flex items-center justify-center text-white text-xs font-black">𝕏</span>
              Share on X
            </button>
            <button onClick={() => setShowShareMenu(false)}
              className="flex items-center gap-3 w-full px-4 py-3 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors text-sm font-bold text-slate-500">
              <i className="fas fa-times w-6 text-center text-xs"></i>
              Close
            </button>
          </div>
        )}

        <button
          onClick={handleCapture}
          disabled={isCapturing}
          className={`group relative flex items-center justify-center gap-2 transition-all duration-300 transform active:scale-95 disabled:opacity-50 disabled:cursor-wait ${
            isLocked
              ? 'w-12 h-12 rounded-full bg-slate-700 border-2 border-slate-500 text-slate-400 cursor-not-allowed'
              : showLabel
                ? `px-3 py-2 rounded-full shadow-lg backdrop-blur-md border ${darkContext ? 'text-white bg-white/10 hover:bg-white/20 border-white/20' : 'text-slate-700 dark:text-slate-200 bg-white/80 dark:bg-slate-800/80 hover:bg-accent hover:text-white border-slate-200 dark:border-slate-600 hover:border-accent'}`
                : 'w-12 h-12 rounded-full bg-slate-900 border-2 border-[#d4af37] text-[#d4af37] shadow-[0_0_20px_rgba(212,175,55,0.3)] hover:bg-[#d4af37] hover:text-slate-900 hover:scale-110'
          }`}
          title={isLocked ? 'Upgrade to unlock snapshots' : 'Snap Viral Card'}
        >
          {isCapturing ? (
            <i className="fas fa-circle-notch fa-spin text-xl"></i>
          ) : isLocked ? (
            <i className="fas fa-lock text-lg"></i>
          ) : (
            <i className="fas fa-camera text-xl"></i>
          )}

          {showLabel && !isCapturing && !isLocked && (
            <span className="text-xs font-bold max-w-0 overflow-hidden group-hover:max-w-[100px] transition-all duration-300 whitespace-nowrap">
              {label}
            </span>
          )}

          {!showLabel && !isCapturing && !isLocked && (
            <span className="absolute right-full mr-3 top-1/2 -translate-y-1/2 px-2 py-1 bg-black/80 text-white text-[10px] rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none font-bold">
              Snap Card
            </span>
          )}

          {isLocked && (
            <span className="absolute right-full mr-3 top-1/2 -translate-y-1/2 px-2 py-1 bg-black/80 text-white text-[10px] rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none font-bold">
              🔒 Season Pass only
            </span>
          )}
        </button>
      </div>

      {/* Camera Flash Overlay */}
      <div
        className={`fixed inset-0 bg-white z-[9999] pointer-events-none transition-opacity duration-300 ease-out ${flash ? 'opacity-90' : 'opacity-0'}`}
      />
    </>
  );
};

export default ShareSnapshot;


