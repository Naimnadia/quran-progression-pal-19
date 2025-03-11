
import { Member } from '@/utils/types';
import ProgressBar from './ProgressBar';
import { Trophy } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TopMembersProps {
  members: Member[];
}

const TopMembers = ({ members }: TopMembersProps) => {
  if (members.length === 0) {
    return null;
  }

  // Define medal colors for top 3
  const medalColors = ['#FFD700', '#C0C0C0', '#CD7F32'];
  
  return (
    <div className="glass rounded-xl p-6 animate-fade-in">
      <div className="flex items-center mb-6">
        <Trophy className="text-yellow-500 mr-2" size={24} />
        <h2 className="text-xl font-bold">المتصدرون</h2>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {members.map((member, index) => {
          const progress = (member.completedAhzab / member.totalAhzab) * 100;
          const isTopThree = index < 3;
          
          return (
            <div 
              key={member.id}
              className={cn(
                "relative p-4 rounded-lg transition-all duration-300",
                isTopThree ? "glass-highlight" : "glass-secondary"
              )}
            >
              {isTopThree && (
                <div 
                  className="absolute -top-3 -right-3 w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold shadow-lg"
                  style={{ backgroundColor: medalColors[index] }}
                >
                  {index + 1}
                </div>
              )}
              
              <div className="flex items-center mb-3">
                <div 
                  className="w-10 h-10 rounded-full flex items-center justify-center text-white text-md font-medium mr-3"
                  style={{ backgroundColor: member.avatarColor }}
                >
                  {member.name.charAt(0).toUpperCase()}
                </div>
                <div className="truncate">
                  <h4 className="font-medium truncate">{member.name}</h4>
                </div>
              </div>
              
              <div className="mt-4">
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-500">التقدم</span>
                  <span className="font-bold">{Math.round(progress)}%</span>
                </div>
                <ProgressBar 
                  progress={progress}
                  color={member.avatarColor}
                  className="w-full"
                  height="h-3"
                />
                <div className="text-sm text-gray-500 mt-2 text-center">
                  {member.completedAhzab} / {member.totalAhzab}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default TopMembers;
