
import { BookOpen, Award, BarChart4 } from 'lucide-react';
import { GroupData, Member } from '@/utils/types';
import ProgressBar from './ProgressBar';
import { calculateAverageProgress, calculateGroupProgress } from '@/utils/storage';
import { cn } from '@/lib/utils';

interface GroupStatsProps {
  data: GroupData;
}

const GroupStats = ({ data }: GroupStatsProps) => {
  const groupProgress = calculateGroupProgress(data);
  const averageProgress = calculateAverageProgress(data);
  
  // Find top performer
  let topPerformer: Member | null = null;
  let topPerformancePercentage = 0;
  
  data.members.forEach(member => {
    const percentage = (member.completedAhzab / member.totalAhzab) * 100;
    if (percentage > topPerformancePercentage) {
      topPerformancePercentage = percentage;
      topPerformer = member;
    }
  });
  
  // Calculate total completed ahzab
  const totalCompletedAhzab = data.members.reduce(
    (sum, member) => sum + member.completedAhzab, 0
  );

  return (
    <div className="glass p-6 rounded-xl animate-fade-in">
      <h3 className="text-xl font-medium mb-6 flex items-center">
        <BarChart4 className="mr-2" size={20} />
        Statistiques du groupe
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Total Group Progress */}
        <div className="glass p-4 rounded-lg">
          <div className="text-sm text-gray-500 mb-2">Progression globale</div>
          <div className="text-3xl font-bold text-brand-600 mb-2">
            {Math.round(groupProgress)}%
          </div>
          <ProgressBar 
            progress={groupProgress}
            height="h-3"
            color="bg-brand-500"
            className="mt-2"
          />
          <div className="text-xs text-gray-400 mt-3 flex items-center">
            <BookOpen size={14} className="mr-1" />
            {totalCompletedAhzab} ahzab complétés au total
          </div>
        </div>

        {/* Average Progress */}
        <div className="glass p-4 rounded-lg">
          <div className="text-sm text-gray-500 mb-2">Moyenne par membre</div>
          <div className="text-3xl font-bold text-brand-600 mb-2">
            {Math.round(averageProgress)}%
          </div>
          <ProgressBar 
            progress={averageProgress}
            height="h-3"
            color="bg-brand-400"
            className="mt-2"
          />
          <div className="text-xs text-gray-400 mt-3">
            Basé sur {data.members.length} membre{data.members.length > 1 ? 's' : ''}
          </div>
        </div>

        {/* Top Performer */}
        <div className="glass p-4 rounded-lg">
          <div className="text-sm text-gray-500 mb-2">Meilleure progression</div>
          {topPerformer ? (
            <>
              <div className="flex items-center space-x-2 mb-2">
                <div 
                  className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm"
                  style={{ backgroundColor: topPerformer.avatarColor }}
                >
                  {topPerformer.name.charAt(0).toUpperCase()}
                </div>
                <div className="font-semibold">{topPerformer.name}</div>
                <div className="text-xs glass px-2 py-0.5 rounded-full bg-brand-100">
                  <Award size={12} className="inline mr-1" />
                  <span>{Math.round(topPerformancePercentage)}%</span>
                </div>
              </div>
              <ProgressBar 
                progress={topPerformancePercentage}
                height="h-3"
                color={`bg-[${topPerformer.avatarColor}]`}
                className="mt-2"
              />
              <div className="text-xs text-gray-400 mt-3">
                {topPerformer.completedAhzab} sur {topPerformer.totalAhzab} ahzab complétés
              </div>
            </>
          ) : (
            <div className="text-gray-400 py-4 text-center">
              Aucune donnée disponible
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default GroupStats;
