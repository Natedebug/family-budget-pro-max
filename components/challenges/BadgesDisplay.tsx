
import React from 'react';
import Card from '../ui/Card';
import { FamilyMember } from '../../types';
import { useAppContext } from '../../hooks/useAppContext';

interface BadgesDisplayProps {
  member: FamilyMember;
}

const BadgesDisplay: React.FC<BadgesDisplayProps> = ({ member }) => {
  const { badges } = useAppContext();

  const earnedBadges = badges.filter(b => member.badges.includes(b.id));

  return (
    <Card>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {earnedBadges.map(badge => (
          <div key={badge.id} className="flex flex-col items-center text-center p-2 bg-slate-700/50 rounded-lg">
            <span className="text-4xl mb-2">{badge.icon}</span>
            <p className="font-semibold text-sm text-white">{badge.name}</p>
            <p className="text-xs text-slate-400">{badge.description}</p>
          </div>
        ))}
      </div>
    </Card>
  );
};

export default BadgesDisplay;
