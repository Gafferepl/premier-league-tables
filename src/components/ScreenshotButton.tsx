
import React, { useState } from 'react';
import html2canvas from 'html2canvas';

interface ScreenshotButtonProps {
  targetRef: React.RefObject<HTMLElement | null>;
  label?: string;
  darkContext?: boolean;
  className?: string;
}

const ScreenshotButton: React.FC<ScreenshotButtonProps> = ({ targetRef, label = "Copy as Image", darkContext = false, className }) => {
  const [status, setStatus] = useState<'idle' | 'capturing' | 'success' | 'error'>('idle');

  const handleCapture = async () => {
    if (!targetRef.current) return;

    setStatus('capturing');

    try {
      const canvas = await html2canvas(targetRef.current, {
        scale: 2, // High resolution
        useCORS: true,
        backgroundColor: null, // Transparent to capture rounded corners/themes correctly
        ignoreElements: (element) => element.hasAttribute('data-html2canvas-ignore'),
        onclone: (clonedDoc) => {
          // You could manipulate the cloned DOM here if needed
          const element = clonedDoc.querySelector(`[data-screenshot-target]`) as HTMLElement;
          if (element) {
             element.style.borderRadius = '0'; // Flatten corners for image if desired, keeping consistent for now
          }
        }
      });

      // Add Watermark
      const ctx = canvas.getContext('2d');
      if (ctx) {
        const text = "The Gaffer's Proper Table | premierleaguetables.com";
        const fontSize = 24;
        ctx.font = `bold ${fontSize}px Courier New`;
        ctx.fillStyle = "rgba(255, 255, 255, 0.6)";
        ctx.textAlign = "right";
        ctx.textBaseline = "bottom";
        
        // Add text shadow for readability
        ctx.shadowColor = "rgba(0, 0, 0, 0.8)";
        ctx.shadowBlur = 4;
        ctx.shadowOffsetX = 2;
        ctx.shadowOffsetY = 2;

        ctx.fillText(text, canvas.width - 20, canvas.height - 20);
        
        // Reset shadow
        ctx.shadowColor = "transparent";
      }

      canvas.toBlob(async (blob) => {
        if (!blob) throw new Error('Canvas is empty');
        
        try {
          // Try writing to clipboard
          await navigator.clipboard.write([
            new ClipboardItem({ 'image/png': blob })
          ]);
          setStatus('success');
          setTimeout(() => setStatus('idle'), 3000);
        } catch (err) {
          // Fallback to download if clipboard fails (e.g., Firefox default settings or HTTP)
          const link = document.createElement('a');
          link.href = canvas.toDataURL('image/png');
          link.download = `gaffer-stats-${Date.now()}.png`;
          link.click();
          setStatus('success');
          setTimeout(() => setStatus('idle'), 3000);
        }
      });

    } catch (error) {
      // console.error("Screenshot failed:", error);
      setStatus('error');
      setTimeout(() => setStatus('idle'), 3000);
    }
  };

  // Use provided className or default
  const containerClass = className || "absolute top-4 right-4 z-30";

  return (
    <div className={containerClass} data-html2canvas-ignore>
      <button
        onClick={handleCapture}
        disabled={status === 'capturing'}
        className={`group flex items-center gap-2 px-3 py-2 rounded-full shadow-lg transition-all duration-300 backdrop-blur-md border ${
            status === 'success' 
            ? 'bg-green-500 text-white border-green-400' 
            : status === 'error'
            ? 'bg-red-500 text-white border-red-400'
            : 'bg-white/80 dark:bg-slate-800/80 hover:bg-accent hover:text-white border-slate-200 dark:border-slate-600 hover:border-accent'
        } ${darkContext ? 'text-white' : 'text-slate-700 dark:text-slate-200'}`}
        title={label}
      >
        {status === 'capturing' ? (
          <i className="fas fa-circle-notch fa-spin"></i>
        ) : status === 'success' ? (
          <>
            <i className="fas fa-check"></i>
            <span className="text-xs font-bold hidden group-hover:inline-block">Copied!</span>
          </>
        ) : status === 'error' ? (
          <i className="fas fa-exclamation-triangle"></i>
        ) : (
          <>
            <i className="fas fa-camera"></i>
            <span className="text-xs font-bold max-w-0 overflow-hidden group-hover:max-w-[100px] transition-all duration-300 whitespace-nowrap">
              {label}
            </span>
          </>
        )}
      </button>
    </div>
  );
};

export default ScreenshotButton;


