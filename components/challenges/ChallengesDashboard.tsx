import React, { useState } from 'react';
import { useAppContext } from '../../hooks/useAppContext';
import Leaderboard from './Leaderboard';
import ChallengeCard from './ChallengeCard';
import BadgesDisplay from './BadgesDisplay';
import { ChallengeType, View } from '../../types';
import UserSwitcher from '../layout/UserSwitcher';
import { SparklesIcon } from '../ui/Icon';
import Button from '../ui/Button';
import { refreshChallenges } from '../../services/workflows/challengeRefreshWorkflow';

interface ChallengesDashboardProps {
  setCurrentView: (view: View) => void;
}

const ChallengesDashboard: React.FC<ChallengesDashboardProps> = ({ setCurrentView }) => {
  const { challenges, familyMembers, budgetCategories, addGeneratedChallenges, currentUser } = useAppContext();
  const [isGenerating, setIsGenerating] = useState(false);
  const [genError, setGenError] = useState<string | null>(null);

  const handleGenerateChallenges = async () => {
    setIsGenerating(true);
    setGenError(null);
    try {
      const newChallenges = await refreshChallenges(budgetCategories, familyMembers, challenges);
      if (newChallenges.length > 0) {
        addGeneratedChallenges(newChallenges);
      } else {
        setGenError('No new challenges generated. Try again!');
      }
    } catch (err) {
      console.error('Challenge generation error:', err);
      setGenError('Failed to generate challenges. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

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
        <div className="flex items-center gap-2">
          <Button onClick={handleGenerateChallenges} disabled={isGenerating} variant="secondary">
            <SparklesIcon className="w-5 h-5" />
            {isGenerating ? 'Generating...' : 'AI Challenges'}
          </Button>
          <UserSwitcher />
        </div>
      </header>
      {genError && (
        <p className="text-red-400 text-sm px-1">{genError}</p>
      )}

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