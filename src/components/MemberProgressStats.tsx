
import { useState, useEffect } from 'react';
import { Member, MonthlyProgress } from '@/utils/types';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer,
  CartesianGrid,
  Legend
} from 'recharts';
import { format, parseISO, subMonths, startOfMonth } from 'date-fns';
import { Button } from '@/components/ui/button';
import { ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface MemberProgressStatsProps {
  member: Member;
  onClose: () => void;
}

const MemberProgressStats = ({ member, onClose }: MemberProgressStatsProps) => {
  const [data, setData] = useState<any[]>([]);

  useEffect(() => {
    // If member doesn't have monthly progress data, generate sample data
    if (!member.monthlyProgress || member.monthlyProgress.length === 0) {
      const sampleData: MonthlyProgress[] = generateSampleMonthlyData(member.completedAhzab);
      setData(formatChartData(sampleData));
    } else {
      setData(formatChartData(member.monthlyProgress));
    }
  }, [member]);

  // Generate sample data for demonstration purposes
  const generateSampleMonthlyData = (totalCompleted: number): MonthlyProgress[] => {
    const result: MonthlyProgress[] = [];
    const currentDate = new Date();
    let remainingAhzab = totalCompleted;
    
    // Generate data for the last 6 months
    for (let i = 0; i < 6; i++) {
      const monthDate = subMonths(startOfMonth(currentDate), i);
      const monthStr = format(monthDate, 'yyyy-MM');
      
      // Distribute the completed ahzab across months with some randomness
      const ahzabForThisMonth = i === 0 
        ? Math.min(remainingAhzab, Math.max(1, Math.floor(remainingAhzab * 0.4)))
        : Math.min(remainingAhzab, Math.max(0, Math.floor(Math.random() * (remainingAhzab * 0.3))));
      
      remainingAhzab -= ahzabForThisMonth;
      
      result.unshift({
        month: monthStr,
        ahzabCompleted: ahzabForThisMonth
      });
      
      if (remainingAhzab <= 0) break;
    }
    
    return result;
  };

  // Format data for the chart
  const formatChartData = (monthlyData: MonthlyProgress[]) => {
    return monthlyData.map(item => ({
      month: format(parseISO(item.month + '-01'), 'MMM yyyy'),
      completed: item.ahzabCompleted,
      color: member.avatarColor
    }));
  };

  return (
    <div className="glass p-6 rounded-xl animate-fade-in">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center space-x-3">
          <div 
            className="w-10 h-10 rounded-full flex items-center justify-center text-white text-lg font-medium"
            style={{ backgroundColor: member.avatarColor }}
          >
            {member.name.charAt(0).toUpperCase()}
          </div>
          <div className="mr-3">
            <h3 className="text-xl font-bold">{member.name}</h3>
            <p className="text-sm text-gray-500">
              إحصائيات التقدم الشهري
            </p>
          </div>
        </div>
        <Button variant="ghost" size="sm" onClick={onClose}>
          <ChevronRight className="mr-1" size={16} />
          رجوع
        </Button>
      </div>

      <div className="mt-4 mb-6">
        <div className="flex justify-between items-center mb-2">
          <h4 className="font-medium">تقدم الأحزاب الشهري</h4>
          <div className="text-sm text-gray-500">
            إجمالي: {member.completedAhzab} / {member.totalAhzab}
          </div>
        </div>
        
        <div className={cn("h-[300px] w-full", data.length === 0 && "flex items-center justify-center")}>
          {data.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={data}
                margin={{ top: 10, right: 10, left: 0, bottom: 20 }}
              >
                <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                <XAxis 
                  dataKey="month" 
                  tick={{ fontSize: 12 }}
                  tickMargin={10}
                />
                <YAxis 
                  tick={{ fontSize: 12 }}
                  tickMargin={10}
                  label={{ 
                    value: 'الأحزاب', 
                    angle: -90, 
                    position: 'insideLeft',
                    style: { textAnchor: 'middle' }
                  }}
                />
                <Tooltip 
                  formatter={(value) => [`${value} حزب`, 'تم الإنجاز']}
                  labelFormatter={(label) => `شهر: ${label}`}
                />
                <Legend verticalAlign="top" height={36} />
                <Bar 
                  dataKey="completed" 
                  name="الأحزاب المنجزة" 
                  fill={member.avatarColor} 
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="text-center text-gray-500">
              لا توجد بيانات متاحة
            </div>
          )}
        </div>
      </div>

      <div className="bg-gray-50 p-4 rounded-lg">
        <h5 className="font-medium mb-2">ملخص التقدم</h5>
        <div className="grid grid-cols-2 gap-4">
          <div className="glass p-3 rounded-lg text-center">
            <div className="text-2xl font-bold" style={{ color: member.avatarColor }}>
              {Math.round((member.completedAhzab / member.totalAhzab) * 100)}%
            </div>
            <div className="text-xs text-gray-500">نسبة الإنجاز</div>
          </div>
          <div className="glass p-3 rounded-lg text-center">
            <div className="text-2xl font-bold" style={{ color: member.avatarColor }}>
              {data.length > 0 ? Math.max(...data.map(d => d.completed)) : 0}
            </div>
            <div className="text-xs text-gray-500">أعلى إنجاز شهري</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MemberProgressStats;
