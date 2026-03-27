import React, { useState } from 'react';
import TeamIcon from './TeamIcon';

interface LogoWithFallbackProps {
  src: string | null;
  teamName: string;
  size?: string;
  className?: string;
}

const LogoWithFallback: React.FC<LogoWithFallbackProps> = ({ src, teamName, size = "w-8 h-8", className = "" }) => {
  const [error, setError] = useState(false);

  // Reset error state if src changes (e.g. reused component in virtual list)
  React.useEffect(() => {
    setError(false);
  }, [src]);

  if (src && !error) {
    return (
      <img
        src={src}
        alt={teamName}
        className={`${size} object-contain ${className}`}
        onError={() => setError(true)}
        loading="lazy"
      />
    );
  }

  // Fallback to the CSS-generated TeamIcon
  return (
    <div className={`${size} flex items-center justify-center ${className}`}>
        <TeamIcon team={teamName} size={size} />
    </div>
  );
};

export default LogoWithFallback;


