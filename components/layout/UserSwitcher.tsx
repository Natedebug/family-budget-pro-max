import React from 'react';
import { useAppContext } from '../../hooks/useAppContext';

const UserSwitcher: React.FC = () => {
  const { familyMembers, currentUser, setCurrentUser } = useAppContext();

  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedMember = familyMembers.find(m => m.id === event.target.value);
    if (selectedMember) {
      setCurrentUser(selectedMember);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <span className="text-2xl">{currentUser.avatar}</span>
      <select
        value={currentUser.id}
        onChange={handleChange}
        className="bg-slate-700 border border-slate-600 rounded-md py-1 pl-2 pr-8 text-sm font-semibold text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
      >
        {familyMembers.map(member => (
          <option key={member.id} value={member.id}>
            {member.name} ({member.role})
          </option>
        ))}
      </select>
    </div>
  );
};

export default UserSwitcher;
