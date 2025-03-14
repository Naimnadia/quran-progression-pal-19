
import { GroupData } from '@/utils/types';
import GroupStats from './GroupStats';
import MembersList from './MembersList';
import ProgressBar from './ProgressBar';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';

interface DashboardProps {
  data: GroupData;
  onRemoveMember: (memberId: string) => void;
}

const Dashboard = ({ data, onRemoveMember }: DashboardProps) => {
  // Sort members by progress percentage (highest to lowest)
  const sortedMembers = [...data.members].sort((a, b) => {
    const progressA = (a.completedAhzab / a.totalAhzab) * 100;
    const progressB = (b.completedAhzab / b.totalAhzab) * 100;
    return progressB - progressA;
  });

  return (
    <div className="space-y-8 animate-slide-up">
      <GroupStats data={data} />
      
      {/* Comparison of progress bars */}
      <div className="glass p-6 rounded-xl">
        <h3 className="text-xl font-medium mb-6">مقارنة التقدم</h3>
        <div className="space-y-4">
          {sortedMembers.map(member => {
            const progressPercentage = (member.completedAhzab / member.totalAhzab) * 100;
            return (
              <div key={member.id} className="flex items-center space-x-4">
                <Avatar className="w-10 h-10 flex-shrink-0">
                  {member.photoUrl ? (
                    <AvatarImage src={member.photoUrl} alt={member.name} />
                  ) : null}
                  <AvatarFallback 
                    style={{ backgroundColor: member.avatarColor }}
                    className="text-white text-sm font-medium"
                  >
                    {member.name.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-grow mr-4">
                  <div className="flex justify-between mb-1">
                    <span className="font-medium">{member.name}</span>
                    <span className="text-sm font-bold">{Math.round(progressPercentage)}%</span>
                  </div>
                  <ProgressBar
                    progress={progressPercentage}
                    color={member.avatarColor}
                    height="h-3"
                    animated={true}
                    showPercentage={false}
                  />
                  <div className="text-xs text-gray-500 mt-1">
                    {member.completedAhzab} / {member.totalAhzab} أحزاب
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      
      <MembersList 
        members={sortedMembers}
        onRemoveMember={onRemoveMember}
      />
    </div>
  );
};

export default Dashboard;
