import React from 'react';
import { useAppContext } from '../../hooks/useAppContext';
import Leaderboard from './Leaderboard';
import ChallengeCard from './ChallengeCard';
import BadgesDisplay from './BadgesDisplay';
import { ChallengeType, View } from '../../types';
import UserSwitcher from '../layout/UserSwitcher';

interface ChallengesDashboardProps {
  setCurrentView: (view: View) => void;
}

const ChallengesDashboard: React.FC<ChallengesDashboardProps> = ({ setCurrentView }) => {
  const { challenges, familyMembers } = useAppContext();
  // For demo, we'll assume a "current user" to complete challenges
  const currentUser = familyMembers[1]; // Mom

  const dailyChallenge = challenges.find(c => c.type === ChallengeType.DAILY);
  const weeklyChallenge = challenges.find(c => c.type === ChallengeType.WEEKLY);
  const memberChallenges = challenges.filter(c => c.type === ChallengeType.MEMBER);

  return (
    <div className="p-4 space-y-6">
      <header className="flex justify-between items-center">
        <div className="flex items-center gap-4">
            <button onClick={() => setCurrentView('home')} className="p-2 rounded-lg hover:bg-slate-700 transition-colors" title="Go to Home">
                <span className="text-3xl">🏠</span>
            </button>
            <h1 className="text-3xl font-bold text-white">Challenges 🎯</h1>
        </div>
        <UserSwitcher />
      </header>

      <Leaderboard />

      {dailyChallenge && (
        <div>
          <h2 className="text-xl font-semibold mb-3">Today's Daily Challenge 🔥</h2>
          <ChallengeCard challenge={dailyChallenge} currentUserId={currentUser.id} />
        </div>
      )}

      {weeklyChallenge && (
        <div>
          <h2 className="text-xl font-semibold mb-3">This Week's Challenge 🏆</h2>
          <ChallengeCard challenge={weeklyChallenge} currentUserId={currentUser.id} />
        </div>
      )}

      <div>
        <h2 className="text-xl font-semibold mb-3">Member Challenges ⚔️</h2>
        {memberChallenges.length > 0 ? (
          <div className="space-y-4">
            {memberChallenges.map(challenge => (
              <ChallengeCard key={challenge.id} challenge={challenge} currentUserId={currentUser.id}/>
            ))}
          </div>
        ) : (
          <p className="text-slate-400">No active member challenges.</p>
        )}
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-3">Your Badges</h2>
        <BadgesDisplay member={currentUser} />
      </div>
    </div>
  );
};

export default ChallengesDashboard;