
import { Award } from 'lucide-react';
import { GroupData } from '@/utils/types';
import ProgressBar from './ProgressBar';

interface GroupStatsProps {
  data: GroupData;
}

const GroupStats = ({ data }: GroupStatsProps) => {
  // Find top 3 performers
  const topPerformers = [...data.members]
    .sort((a, b) => {
      const progressA = (a.completedAhzab / a.totalAhzab) * 100;
      const progressB = (b.completedAhzab / b.totalAhzab) * 100;
      return progressB - progressA;
    })
    .slice(0, 3);
  
  return (
    <div className="glass p-6 rounded-xl animate-fade-in">
      <h3 className="text-xl font-medium mb-6">أفضل المتسابقين</h3>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {topPerformers.map((performer, index) => {
          const performancePercentage = (performer.completedAhzab / performer.totalAhzab) * 100;
          
          return (
            <div key={performer.id} className="glass p-4 rounded-lg">
              <div className="text-sm text-gray-500 mb-2">
                {index === 0 ? "المركز الأول" : index === 1 ? "المركز الثاني" : "المركز الثالث"}
              </div>
              <div className="flex items-center space-x-2 mb-2">
                <div 
                  className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm"
                  style={{ backgroundColor: performer.avatarColor }}
                >
                  {performer.name.charAt(0).toUpperCase()}
                </div>
                <div className="font-semibold mr-2">{performer.name}</div>
                <div className="text-xs glass px-2 py-0.5 rounded-full bg-brand-100">
                  <Award size={12} className="inline ml-1" />
                  <span>{Math.round(performancePercentage)}%</span>
                </div>
              </div>
              <ProgressBar 
                progress={performancePercentage}
                height="h-3"
                color={performer.avatarColor}
                className="mt-2"
              />
              <div className="text-xs text-gray-400 mt-3">
                {performer.completedAhzab} من {performer.totalAhzab} أحزاب مكتملة
              </div>
            </div>
          );
        })}
        
        {topPerformers.length === 0 && (
          <div className="glass p-4 rounded-lg col-span-3 text-center py-8">
            <div className="text-gray-400">
              لا توجد بيانات متاحة
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default GroupStats;
