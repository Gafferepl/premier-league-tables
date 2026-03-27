import React from 'react';
import FounderBadge from './FounderBadge';

interface UserProfile {
  id: string;
  email: string;
  name?: string;
  tier: 'free' | 'firstTeam' | 'seasonPass';
  isFounderMember?: boolean;
  founderNumber?: number;
  joinDate: string;
}

interface UserProfileCardProps {
  user: UserProfile;
  showDetails?: boolean;
}

const UserProfileCard: React.FC<UserProfileCardProps> = ({ 
  user, 
  showDetails = false 
}) => {
  const getTierColor = (tier: string) => {
    switch (tier) {
      case 'seasonPass': return 'text-yellow-500';
      case 'firstTeam': return 'text-green-500';
      default: return 'text-blue-500';
    }
  };

  const getTierIcon = (tier: string) => {
    switch (tier) {
      case 'seasonPass': return 'fas fa-crown';
      case 'firstTeam': return 'fas fa-users';
      default: return 'fas fa-envelope';
    }
  };

  return (
    <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center ${getTierColor(user.tier)}`}>
            <i className={getTierIcon(user.tier)}></i>
          </div>
          <div>
            <h3 className="font-bold text-white">
              {user.name || user.email.split('@')[0]}
            </h3>
            <p className="text-sm text-slate-400">{user.email}</p>
          </div>
        </div>
        
        {/* Founder Badge */}
        {user.isFounderMember && (
          <FounderBadge 
            isFounderMember={true}
            founderNumber={user.founderNumber}
            size="small"
          />
        )}
      </div>

      {showDetails && (
        <div className="border-t border-slate-700 pt-3 space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-slate-400">Tier:</span>
            <span className={`font-bold ${getTierColor(user.tier)}`}>
              {user.tier === 'seasonPass' ? 'Season Pass' : 
               user.tier === 'firstTeam' ? 'First Team' : 'Free'}
            </span>
          </div>
          
          <div className="flex justify-between text-sm">
            <span className="text-slate-400">Member Since:</span>
            <span className="text-white">
              {new Date(user.joinDate).toLocaleDateString()}
            </span>
          </div>

          {user.isFounderMember && (
            <div className="flex justify-between text-sm">
              <span className="text-slate-400">Founder Status:</span>
              <span className="text-yellow-500 font-bold">
                Member #{user.founderNumber} of 150
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default UserProfileCard;


