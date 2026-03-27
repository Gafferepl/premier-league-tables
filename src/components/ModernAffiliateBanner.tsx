import React, { useEffect, useRef, useState } from 'react';

// Coming Soon mode - disable affiliate links temporarily
const COMING_SOON_MODE = false;

// Easy to update affiliate links - change these here!
const AFFILIATE_LINKS = {
  streaming: 'https://your-streaming-link.com',
  betting: 'https://your-betting-link.com', 
  merchandise: 'https://your-merchandise-link.com',
  gaming: 'https://your-equipment-link.com'
};

// Coming Soon banner content
const COMING_SOON_CONTENT = {
  streaming: {
    title: "Live Streaming Partnerships",
    description: "Premium streaming partnerships coming soon. Reach thousands of Premier League fans.",
    placeholder: "📺"
  },
  betting: {
    title: "Betting Partnerships", 
    description: "Exclusive betting partnerships launching soon. Connect with engaged football fans.",
    placeholder: "🎰"
  },
  merchandise: {
    title: "Merchandise Partnerships",
    description: "Official merchandise partnerships coming soon. Showcase your brand to our community.",
    placeholder: "👕"
  },
  gaming: {
    title: "Equipment Partnerships",
    description: "Football equipment partnerships launching soon. Showcase boots, kits and gear to our community.",
    placeholder: "⚽"
  }
};

interface ModernAffiliateBannerProps {
  type: 'streaming' | 'betting' | 'merchandise' | 'gaming';
  title: string;
  description: string;
  imageUrl: string;
  ctaText: string;
  imageAlt?: string;
  darkMode?: boolean;
}

const ModernAffiliateBanner: React.FC<ModernAffiliateBannerProps> = ({
  type,
  title,
  description,
  imageUrl,
  ctaText,
  imageAlt = "Advertisement",
  darkMode = false
}) => {
  const bannerRef = useRef<HTMLDivElement>(null);
  const [showTooltip, setShowTooltip] = useState(false);

  useEffect(() => {
    const banner = bannerRef.current;
    if (!banner) return;

    const tiltEffectStrength = 8;

    // Only apply the effect on devices with a mouse
    if (window.matchMedia('(pointer: fine)').matches) {
      const handleMouseMove = (e: MouseEvent) => {
        const { left, top, width, height } = banner.getBoundingClientRect();
        const x = e.clientX - left;
        const y = e.clientY - top;

        const halfWidth = width / 2;
        const halfHeight = height / 2;

        const rotateX = ((y - halfHeight) / halfHeight) * -tiltEffectStrength;
        const rotateY = ((x - halfWidth) / halfWidth) * tiltEffectStrength;
        
        banner.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`;
      };

      const handleMouseLeave = () => {
        banner.style.transform = 'rotateX(0deg) rotateY(0deg) scale(1)';
      };

      banner.addEventListener('mousemove', handleMouseMove);
      banner.addEventListener('mouseleave', handleMouseLeave);

      return () => {
        banner.removeEventListener('mousemove', handleMouseMove);
        banner.removeEventListener('mouseleave', handleMouseLeave);
      };
    }
  }, []);

  const getAffiliateLink = () => {
    return AFFILIATE_LINKS[type] || '#';
  };

  const handleComingSoonClick = () => {
    // Open email for serious partnership inquiries
    const emailSubject = encodeURIComponent(`${type.charAt(0).toUpperCase() + type.slice(1)} Partnership Inquiry`);
    const emailBody = encodeURIComponent(`Hi, I'm interested in discussing a partnership opportunity for the ${type} section.`);
    window.location.href = `mailto:partnerships@premierleaguetables.com?subject=${emailSubject}&body=${emailBody}`;
  };

  // Use coming soon content if in coming soon mode
  const displayContent = COMING_SOON_MODE ? COMING_SOON_CONTENT[type] : {
    title,
    description,
    placeholder: ""
  };

  return (
    <>
      <style>{`
        .modern-affiliate-banner {
          background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%);
          border: 1px solid #334155;
          border-radius: 12px;
          padding: 24px;
          width: 100%;
          max-width: 1200px;
          margin: 32px auto;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.3), 0 2px 4px -1px rgba(0, 0, 0, 0.2);
          position: relative;
          overflow: hidden;
          transition: all 0.3s ease;
        }

        .modern-affiliate-banner:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.4), 0 4px 6px -2px rgba(0, 0, 0, 0.3);
        }

        .modern-affiliate-banner.light {
          background: linear-gradient(135deg, #475569 0%, #334155 100%);
          border: 1px solid #64748b;
        }

        .banner-content {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 24px;
          position: relative;
          z-index: 2;
        }

        .banner-text {
          flex: 1;
          text-align: left;
        }

        .modern-affiliate-banner h2 {
          font-size: 24px;
          font-weight: 700;
          margin: 0 0 8px 0;
          color: #f8fafc;
          line-height: 1.2;
          font-family: system-ui, -apple-system, sans-serif;
        }

        .light .modern-affiliate-banner h2 {
          color: #f1f5f9;
        }

        .modern-affiliate-banner p {
          font-size: 15px;
          margin: 0;
          line-height: 1.5;
          color: #cbd5e1;
          font-family: system-ui, -apple-system, sans-serif;
        }

        .light .modern-affiliate-banner p {
          color: #e2e8f0;
        }

        .banner-actions {
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .partner-badge {
          position: absolute;
          top: 12px;
          right: 12px;
          background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
          color: white;
          padding: 6px 14px;
          border-radius: 16px;
          font-size: 11px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          box-shadow: 0 2px 4px rgba(245, 158, 11, 0.3);
          cursor: pointer;
          transition: all 0.3s ease;
          z-index: 10;
          border: none;
          text-decoration: none;
          display: inline-flex;
          align-items: center;
          gap: 4px;
        }

        .partner-badge:hover {
          transform: translateY(-1px);
          box-shadow: 0 4px 8px rgba(245, 158, 11, 0.4);
          background: linear-gradient(135deg, #d97706 0%, #b45309 100%);
        }

        .partner-badge::before {
          content: "🤝";
          font-size: 12px;
        }

        .cta-button {
          display: inline-block;
          padding: 12px 24px;
          background: linear-gradient(135deg, #64748b 0%, #475569 100%);
          color: #cbd5e1;
          text-decoration: none;
          font-weight: 500;
          font-size: 15px;
          border-radius: 8px;
          transition: all 0.3s ease;
          position: relative;
          overflow: hidden;
          cursor: not-allowed;
          border: 1px solid #475569;
          font-family: system-ui, -apple-system, sans-serif;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
          opacity: 0.7;
        }

        .cta-button:hover {
          transform: none;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
          background: linear-gradient(135deg, #64748b 0%, #475569 100%);
          opacity: 0.7;
        }

        .cta-button::after {
          content: " (Partnership Only)";
          font-size: 12px;
          opacity: 0.7;
          margin-left: 4px;
        }

        .banner-decoration {
          position: absolute;
          top: 0;
          right: 0;
          width: 180px;
          height: 180px;
          background: linear-gradient(135deg, rgba(245, 158, 11, 0.05) 0%, rgba(217, 119, 6, 0.02) 100%);
          border-radius: 50%;
          transform: translate(50%, -50%);
          z-index: 1;
        }

        .light .banner-decoration {
          background: linear-gradient(135deg, rgba(245, 158, 11, 0.08) 0%, rgba(217, 119, 6, 0.04) 100%);
        }

        .banner-overlay {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(135deg, rgba(245, 158, 11, 0.02) 0%, transparent 50%);
          z-index: 1;
        }

        @media (max-width: 768px) {
          .modern-affiliate-banner {
            padding: 20px;
            margin: 24px auto;
          }

          .banner-content {
            flex-direction: column;
            text-align: center;
            gap: 16px;
          }

          .banner-text {
            text-align: center;
          }

          .modern-affiliate-banner h2 {
            font-size: 20px;
          }

          .banner-actions {
            flex-direction: column;
            width: 100%;
            gap: 12px;
          }

          .cta-button {
            width: 100%;
            justify-content: center;
          }

          .partner-badge {
            position: static;
            margin-bottom: 12px;
            align-self: center;
          }
        }
      `}</style>

      <div className={`modern-affiliate-banner ${darkMode ? '' : 'light'}`} ref={bannerRef}>
        <div className="banner-overlay"></div>
        <div className="banner-decoration"></div>
        
        {/* Become a Partner Badge - ONLY CLICKABLE ELEMENT */}
        <a 
          href="mailto:info@premierleaguetables.com?subject=Partnership%20Inquiry&body=Hi%2C%20I'm%20interested%20in%20discussing%20a%20partnership%20opportunity%20with%20Premier%20League%20Hub.%0A%0ABanner%20Type%3A%20${type}%0A%0APlease%20let%20me%20know%20more%20about%20partnership%20opportunities."
          className="partner-badge"
          title="Become a Partner - Contact Us"
        >
          Become a Partner
        </a>

        <div className="banner-content">
          <div className="banner-text">
            <h2>{title}</h2>
            <p>{description}</p>
          </div>
          
          <div className="banner-actions">
            {/* Disabled CTA Button - Banner Display Only */}
            <button
              className="cta-button"
              disabled
              title="Partnership opportunities available - Contact us above"
            >
              {ctaText}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default ModernAffiliateBanner;


