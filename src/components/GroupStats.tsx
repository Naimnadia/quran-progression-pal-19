
import { Award, BarChart4 } from 'lucide-react';
import { GroupData, Member } from '@/utils/types';
import ProgressBar from './ProgressBar';
import { cn } from '@/lib/utils';

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
      <h3 className="text-xl font-medium mb-6 flex items-center">
        <BarChart4 className="mr-2" size={20} />
        Statistiques du groupe
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {topPerformers.map((performer, index) => {
          const performancePercentage = (performer.completedAhzab / performer.totalAhzab) * 100;
          
          return (
            <div key={performer.id} className="glass p-4 rounded-lg">
              <div className="text-sm text-gray-500 mb-2">
                {index === 0 ? "1ère place" : index === 1 ? "2ème place" : "3ème place"}
              </div>
              <div className="flex items-center space-x-2 mb-2">
                <div 
                  className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm"
                  style={{ backgroundColor: performer.avatarColor }}
                >
                  {performer.name.charAt(0).toUpperCase()}
                </div>
                <div className="font-semibold">{performer.name}</div>
                <div className="text-xs glass px-2 py-0.5 rounded-full bg-brand-100">
                  <Award size={12} className="inline mr-1" />
                  <span>{Math.round(performancePercentage)}%</span>
                </div>
              </div>
              <ProgressBar 
                progress={performancePercentage}
                height="h-3"
                color={`bg-[${performer.avatarColor}]`}
                className="mt-2"
              />
              <div className="text-xs text-gray-400 mt-3">
                {performer.completedAhzab} sur {performer.totalAhzab} ahzab complétés
              </div>
            </div>
          );
        })}
        
        {topPerformers.length === 0 && (
          <div className="glass p-4 rounded-lg col-span-3 text-center py-8">
            <div className="text-gray-400">
              Aucune donnée disponible
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default GroupStats;
