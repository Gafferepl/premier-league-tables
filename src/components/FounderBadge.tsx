import React from 'react';

interface FounderBadgeProps {
  isFounderMember: boolean;
  founderNumber?: number;
  size?: 'small' | 'medium' | 'large';
  showNumber?: boolean;
}

const FounderBadge: React.FC<FounderBadgeProps> = ({
  isFounderMember,
  founderNumber,
  size = 'medium',
  showNumber = true
}) => {
  if (!isFounderMember) return null;

  const sizeClasses = {
    small: 'text-xs px-2 py-1',
    medium: 'text-sm px-3 py-1',
    large: 'text-base px-4 py-2'
  };

  const iconSizes = {
    small: 'text-xs',
    medium: 'text-sm',
    large: 'text-base'
  };

  return (
    <div className={`inline-flex items-center gap-1 bg-gradient-to-r from-yellow-500 to-yellow-600 text-slate-900 rounded-full font-bold ${sizeClasses[size]}`}>
      <i className={`fas fa-crown ${iconSizes[size]}`}></i>
      <span>Founder Member</span>
      {showNumber && founderNumber && (
        <span className="bg-yellow-700 text-yellow-100 rounded-full px-1.5 py-0.5 text-xs">
          #{founderNumber}
        </span>
      )}
    </div>
  );
};

export default FounderBadge;


