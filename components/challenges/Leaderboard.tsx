
import React from 'react';
import Card from '../ui/Card';
import { useAppContext } from '../../hooks/useAppContext';

const Leaderboard: React.FC = () => {
  const { familyMembers, badges } = useAppContext();

  const sortedMembers = [...familyMembers].sort((a, b) => b.points - a.points);
  const medals = ['🥇', '🥈', '🥉'];
  
  const getBadgeIcons = (memberBadges: string[]) => {
    return memberBadges.slice(0, 4).map(badgeId => {
      const badge = badges.find(b => b.id === badgeId);
      return badge ? <span key={badge.id} title={badge.name} className="text-sm">{badge.icon}</span> : null;
    });
  }

  return (
    <Card>
      <h3 className="text-lg font-semibold mb-3">Family Leaderboard</h3>
      <ul className="space-y-3">
        {sortedMembers.map((member, index) => (
          <li key={member.id} className="flex items-center justify-between bg-slate-700/50 p-3 rounded-lg">
            <div className="flex items-center">
              <span className="text-2xl mr-3">{medals[index] || '🔹'}</span>
              <span className="text-3xl mr-3">{member.avatar}</span>
              <div>
                <p className="font-bold text-white">{member.name}</p>
                <div className="flex items-center text-xs text-slate-400 space-x-2">
                   <span>{member.points.toLocaleString()} pts</span>
                   <span className="flex items-center">🔥 {member.streak}</span>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-1 bg-slate-800 px-2 py-1 rounded-full">
              {getBadgeIcons(member.badges)}
            </div>
          </li>
        ))}
      </ul>
    </Card>
  );
};

export default Leaderboard;
