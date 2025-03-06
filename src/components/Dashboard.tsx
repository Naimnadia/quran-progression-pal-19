
import { GroupData } from '@/utils/types';
import GroupStats from './GroupStats';
import MembersList from './MembersList';
import ProgressBar from './ProgressBar';
import { calculateGroupProgress } from '@/utils/storage';

interface DashboardProps {
  data: GroupData;
  onRemoveMember: (memberId: string) => void;
}

const Dashboard = ({ data, onRemoveMember }: DashboardProps) => {
  const groupProgress = calculateGroupProgress(data);
  
  // Sort members by progress percentage (highest to lowest)
  const sortedMembers = [...data.members].sort((a, b) => {
    const progressA = (a.completedAhzab / a.totalAhzab) * 100;
    const progressB = (b.completedAhzab / b.totalAhzab) * 100;
    return progressB - progressA;
  });

  return (
    <div className="space-y-8 animate-slide-up">
      <div className="glass p-6 rounded-xl">
        <h2 className="text-2xl font-semibold mb-6">Progression globale</h2>
        <div className="mb-2 flex justify-between">
          <span className="text-sm text-gray-500">Progression du groupe</span>
          <span className="text-sm font-medium">{Math.round(groupProgress)}%</span>
        </div>
        <ProgressBar 
          progress={groupProgress}
          height="h-4"
          animated={true}
          className="mb-6"
        />
        
        <div className="grid grid-cols-2 gap-4 mt-4">
          <div>
            <div className="text-3xl font-bold">{data.members.length}</div>
            <div className="text-sm text-gray-500">Membres</div>
          </div>
          <div>
            <div className="text-3xl font-bold">{data.totalAhzab}</div>
            <div className="text-sm text-gray-500">Ahzab au total</div>
          </div>
        </div>
      </div>
      
      <GroupStats data={data} />
      
      {/* Comparison of progress bars */}
      <div className="glass p-6 rounded-xl">
        <h3 className="text-xl font-medium mb-6">Comparaison des progressions</h3>
        <div className="space-y-4">
          {sortedMembers.map(member => {
            const progressPercentage = (member.completedAhzab / member.totalAhzab) * 100;
            return (
              <div key={member.id} className="flex items-center space-x-4">
                <div
                  className="w-10 h-10 rounded-full flex-shrink-0 flex items-center justify-center text-white text-sm font-medium"
                  style={{ backgroundColor: member.avatarColor }}
                >
                  {member.name.charAt(0).toUpperCase()}
                </div>
                <div className="flex-grow">
                  <div className="flex justify-between mb-1">
                    <span className="font-medium">{member.name}</span>
                    <span className="text-sm font-bold">{Math.round(progressPercentage)}%</span>
                  </div>
                  <ProgressBar
                    progress={progressPercentage}
                    color={`bg-[${member.avatarColor}]`}
                    height="h-3"
                    animated={true}
                    showPercentage={false}
                  />
                  <div className="text-xs text-gray-500 mt-1">
                    {member.completedAhzab} / {member.totalAhzab} ahzab
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      
      <MembersList 
        members={data.members}
        onRemoveMember={onRemoveMember}
      />
    </div>
  );
};

export default Dashboard;
