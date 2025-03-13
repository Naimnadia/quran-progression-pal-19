
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Header from '@/components/Header';
import TopMembers from '@/components/TopMembers';
import { 
  getGroupData, 
  calculateGroupProgress, 
  calculateAverageProgress 
} from '@/utils/storage';
import { GroupData, Member } from '@/utils/types';
import { ArrowRight, Users, BarChart, Book } from 'lucide-react';
import { format } from 'date-fns';

const Home = () => {
  const [groupData, setGroupData] = useState<GroupData | null>(null);
  const [loading, setLoading] = useState(true);
  const [topMonthlyPerformers, setTopMonthlyPerformers] = useState<Member[]>([]);

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
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-primary font-medium">جار التحميل...</div>
      </div>
    );
  }

  const groupProgress = calculateGroupProgress(groupData);
  const averageProgress = calculateAverageProgress(groupData);
  const currentMonth = format(new Date(), 'MMMM yyyy');

  return (
    <div className="min-h-screen" dir="rtl">
      <Header 
        groupName={groupData.name} 
        memberCount={groupData.members.length}
        quickAccess={true}
      />
      
      <main className="max-w-7xl mx-auto pt-28 px-4 pb-16">
        <div className="mb-8 animate-fade-in">
          <h1 className="text-2xl font-bold mb-2">مرحبا بك في {groupData.name}</h1>
          <p className="text-gray-500">شاشة إحصائيات المجموعة والتقدم في قراءة القرآن</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <Card className="glass">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">إجمالي الأعضاء</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <Users className="h-6 w-6 ml-2 text-primary" />
                <div className="text-3xl font-bold">{groupData.members.length}</div>
              </div>
              <p className="text-sm text-gray-500 mt-2">عدد الأعضاء المسجلين في المجموعة</p>
            </CardContent>
          </Card>
          
          <Card className="glass">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">متوسط التقدم</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <BarChart className="h-6 w-6 ml-2 text-primary" />
                <div className="text-3xl font-bold">{Math.round(averageProgress)}%</div>
              </div>
              <p className="text-sm text-gray-500 mt-2">متوسط تقدم جميع الأعضاء</p>
            </CardContent>
          </Card>
          
          <Card className="glass">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">الشهر الحالي</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{currentMonth}</div>
              <p className="text-sm text-gray-500 mt-2">التقدم للشهر الحالي</p>
            </CardContent>
          </Card>
        </div>
        
        <div className="mb-10">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold">أفضل المتسابقين في {currentMonth}</h2>
            <Link to="/">
              <Button variant="ghost" size="sm" className="gap-1">
                عرض الكل
                <ArrowRight size={16} />
              </Button>
            </Link>
          </div>
          
          {topMonthlyPerformers.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {topMonthlyPerformers.map((member, index) => {
                const monthlyProgress = member.monthlyProgress?.find(
                  mp => mp.month === format(new Date(), 'yyyy-MM')
                );
                const ahzabCompleted = monthlyProgress?.ahzabCompleted || 0;
                
                return (
                  <Card key={member.id} className={`glass animate-fade-in ${index === 0 ? 'border-2 border-yellow-400' : ''}`}>
                    <CardHeader className="pb-2">
                      <div className="flex items-center">
                        <div 
                          className="w-10 h-10 rounded-full flex items-center justify-center text-white mr-3"
                          style={{ backgroundColor: member.avatarColor }}
                        >
                          {member.name.charAt(0).toUpperCase()}
                        </div>
                        <CardTitle className="text-lg">{member.name}</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{ahzabCompleted} حزب</div>
                      <p className="text-sm text-gray-500 mt-2">
                        {index === 0 ? 'المركز الأول' : index === 1 ? 'المركز الثاني' : 'المركز الثالث'}
                      </p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          ) : (
            <Card className="glass p-8 text-center">
              <p className="text-gray-500">لا توجد بيانات متاحة للشهر الحالي</p>
            </Card>
          )}
        </div>
      </main>
    </div>
  );
};

export default Home;
