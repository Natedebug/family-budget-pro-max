
import React, { useState } from 'react';
import Card from '../ui/Card';
import Button from '../ui/Button';
import { Challenge, ChallengeType } from '../../types';
import { useAppContext } from '../../hooks/useAppContext';

interface ChallengeCardProps {
  challenge: Challenge;
  currentUserId: string;
}

const ChallengeCard: React.FC<ChallengeCardProps> = ({ challenge, currentUserId }) => {
  const { completeChallenge, familyMembers } = useAppContext();
  const [isCompleted, setIsCompleted] = useState(challenge.isCompleted);
  const [showConfetti, setShowConfetti] = useState(false);

  const handleComplete = () => {
    if (isCompleted) return;
    completeChallenge(challenge.id, currentUserId);
    setIsCompleted(true);
    setShowConfetti(true);
    setTimeout(() => setShowConfetti(false), 3000); // Confetti effect for 3s
  };
  
  const getMemberName = (id?: string) => familyMembers.find(m => m.id === id)?.name || 'Someone';

  const renderMemberChallengeInfo = () => {
    if (challenge.type !== ChallengeType.MEMBER) return null;
    return (
        <div className="text-sm text-slate-400 mt-2">
            <p>{getMemberName(challenge.challengerId)} challenged {getMemberName(challenge.challengedId)}</p>
            <p>Status: <span className="font-semibold capitalize text-yellow-400">{challenge.status}</span></p>
        </div>
    );
  }

  return (
    <Card className="relative overflow-hidden">
      {showConfetti && <div className="absolute inset-0 pointer-events-none text-3xl animate-ping">🎉</div>}
      <div className="flex justify-between items-start">
        <div className="flex items-start">
          <span className="text-4xl mr-4">{challenge.icon}</span>
          <div>
            <h4 className="text-lg font-bold text-white">{challenge.title}</h4>
            <p className="text-slate-300">{challenge.description}</p>
            {renderMemberChallengeInfo()}
          </div>
        </div>
        <div className="text-right flex-shrink-0 ml-4">
          <p className="font-bold text-xl text-yellow-400">+{challenge.points}</p>
          <p className="text-xs text-slate-400">Points</p>
        </div>
      </div>
      <div className="mt-4 flex justify-end space-x-2">
        {challenge.type === ChallengeType.MEMBER && challenge.challengedId === currentUserId && challenge.status === 'pending' && (
           <>
            <Button onClick={() => alert('Accepted!')} variant="secondary">Accept</Button>
            <Button onClick={() => alert('Declined!')} variant="secondary">Decline</Button>
           </>
        )}
        {challenge.type !== ChallengeType.MEMBER && (
          <Button onClick={handleComplete} disabled={isCompleted}>
            {isCompleted ? 'Completed! 🎉' : 'Complete Challenge'}
          </Button>
        )}
      </div>
    </Card>
  );
};

export default ChallengeCard;
