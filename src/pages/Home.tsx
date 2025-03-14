
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Header from '@/components/Header';
import { 
  getGroupData, 
  calculateGroupProgress, 
  calculateAverageProgress 
} from '@/utils/storage';
import { GroupData, Member } from '@/utils/types';
import { ArrowRight, Users, BarChart, Book, Award, Star } from 'lucide-react';
import { format } from 'date-fns';
import { useIsMobile } from '@/hooks/use-mobile';

const Home = () => {
  const [groupData, setGroupData] = useState<GroupData | null>(null);
  const [loading, setLoading] = useState(true);
  const [topMonthlyPerformers, setTopMonthlyPerformers] = useState<Member[]>([]);
  const isMobile = useIsMobile();

  useEffect(() => {
    // Get data from local storage on component mount
    const data = getGroupData();
    setGroupData(data);
    
    // Find top performers for the current month
    const currentMonth = format(new Date(), 'yyyy-MM');
    const topPerformers = findTopPerformersForMonth(data.members, currentMonth);
    setTopMonthlyPerformers(topPerformers);
    
    setLoading(false);
  }, []);

  // Find top performers for a specific month
  const findTopPerformersForMonth = (members: Member[], month: string) => {
    return [...members]
      .filter(member => {
        const monthlyData = member.monthlyProgress?.find(mp => mp.month === month);
        return monthlyData && monthlyData.ahzabCompleted > 0;
      })
      .sort((a, b) => {
        const progressA = a.monthlyProgress?.find(mp => mp.month === month)?.ahzabCompleted || 0;
        const progressB = b.monthlyProgress?.find(mp => mp.month === month)?.ahzabCompleted || 0;
        return progressB - progressA;
      })
      .slice(0, 3);
  };

  if (loading || !groupData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-pulse text-primary font-medium">جار التحميل...</div>
      </div>
    );
  }

  const currentMonth = format(new Date(), 'MMMM yyyy');
  
  // Get best performer of the month
  const bestPerformer = topMonthlyPerformers.length > 0 ? topMonthlyPerformers[0] : null;
  const bestPerformerProgress = bestPerformer?.monthlyProgress?.find(
    mp => mp.month === format(new Date(), 'yyyy-MM')
  )?.ahzabCompleted || 0;

  return (
    <div className="min-h-screen bg-background" dir="rtl">
      <Header 
        groupName={groupData.name} 
        memberCount={groupData.members.length}
        quickAccess={true}
      />
      
      <main className="max-w-7xl mx-auto pt-28 px-4 pb-16">
        <div className="mb-8 animate-fade-in">
          <h1 className="text-2xl md:text-3xl font-bold mb-2">مرحبا بك في {groupData.name}</h1>
          <p className="text-muted-foreground">شاشة إحصائيات المجموعة والتقدم في قراءة القرآن</p>
        </div>
        
        <div className="mb-8">
          <Card className="soft-gradient text-white overflow-hidden border-0 shadow-md">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center">
                <Star className="h-5 w-5 mr-2 text-yellow-200 animate-pulse-scale" />
                أفضل أداء للشهر الحالي
              </CardTitle>
            </CardHeader>
            <CardContent>
              {bestPerformer ? (
                <div className="flex items-center p-2">
                  <div 
                    className="w-14 h-14 rounded-full flex items-center justify-center text-white mr-3 shadow-lg border-2 border-white/20 bg-white/20"
                  >
                    {bestPerformer.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <div className="text-xl font-bold">{bestPerformer.name}</div>
                    <div className="flex items-center mt-1">
                      <Award className="h-5 w-5 mr-1 text-yellow-200" />
                      <span className="text-lg">{bestPerformerProgress} حزب</span>
                    </div>
                  </div>
                </div>
              ) : (
                <p className="text-white/80">لا توجد بيانات متاحة للشهر الحالي</p>
              )}
            </CardContent>
          </Card>
        </div>
        
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold flex items-center">
              <Award className="h-5 w-5 mr-2 text-primary" />
              أفضل المتسابقين في {currentMonth}
            </h2>
            <Link to="/">
              <Button variant="ghost" size="sm" className="gap-1 hover:bg-primary/10">
                عرض الكل
                <ArrowRight size={16} />
              </Button>
            </Link>
          </div>
          
          {topMonthlyPerformers.length > 0 ? (
            <div className={`grid grid-cols-1 ${isMobile ? '' : 'md:grid-cols-3'} gap-4`}>
              {topMonthlyPerformers.map((member, index) => {
                const monthlyProgress = member.monthlyProgress?.find(
                  mp => mp.month === format(new Date(), 'yyyy-MM')
                );
                const ahzabCompleted = monthlyProgress?.ahzabCompleted || 0;
                
                // Apply different styles based on position
                const positionClasses = index === 0 
                  ? 'border-2 border-primary/30 shadow-md' 
                  : index === 1 
                    ? 'border border-gray-100' 
                    : 'border border-gray-100';
                
                return (
                  <Card 
                    key={member.id} 
                    className={`bg-white animate-fade-in ${positionClasses} rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-md`}
                  >
                    <CardContent className="pt-6 pb-4">
                      <div className="flex items-center mb-3">
                        <div 
                          className="w-12 h-12 rounded-full flex items-center justify-center text-white mr-3 shadow-sm soft-gradient"
                        >
                          {member.name.charAt(0).toUpperCase()}
                        </div>
                        <div className="flex-1">
                          <h3 className="text-lg font-bold">{member.name}</h3>
                          <p className="text-sm text-muted-foreground">
                            {index === 0 ? 'المركز الأول' : index === 1 ? 'المركز الثاني' : 'المركز الثالث'}
                          </p>
                        </div>
                        <div className="flex items-center justify-center bg-primary/10 rounded-full w-14 h-14 p-2">
                          <div className="text-xl font-bold text-center text-primary">{ahzabCompleted}</div>
                        </div>
                      </div>
                      <div className="w-full bg-gray-100 h-2.5 rounded-full overflow-hidden mt-3">
                        <div 
                          className="h-full bg-gradient-to-r from-primary/70 to-primary rounded-full"
                          style={{ width: `${Math.min(100, (ahzabCompleted / 60) * 100)}%` }}
                        ></div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          ) : (
            <Card className="bg-white p-8 text-center shadow-sm rounded-2xl">
              <p className="text-muted-foreground">لا توجد بيانات متاحة للشهر الحالي</p>
            </Card>
          )}
        </div>
      </main>
    </div>
  );
};

export default Home;
