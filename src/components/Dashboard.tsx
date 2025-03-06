
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
      
      <MembersList 
        members={data.members}
        onRemoveMember={onRemoveMember}
      />
    </div>
  );
};

export default Dashboard;
