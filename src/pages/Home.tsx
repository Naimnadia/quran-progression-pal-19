
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import Header from '@/components/Header';
import { 
  getGroupData
} from '@/utils/storage';
import { GroupData, Member } from '@/utils/types';
import { Users, BarChart, Book } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import ProgressBar from '@/components/ProgressBar';

const Home = () => {
  const [groupData, setGroupData] = useState<GroupData | null>(null);
  const [loading, setLoading] = useState(true);
  const [sortedMembers, setSortedMembers] = useState<Member[]>([]);
  const isMobile = useIsMobile();

  useEffect(() => {
    // Get data from local storage on component mount
    const data = getGroupData();
    setGroupData(data);
    
    // Sort members by total progress
    const sorted = [...data.members].sort((a, b) => b.completedAhzab - a.completedAhzab);
    setSortedMembers(sorted);
    
    setLoading(false);
  }, []);

  if (loading || !groupData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-pulse text-primary font-medium">جار التحميل...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background" dir="rtl">
      <Header 
        groupName={groupData.name} 
        memberCount={groupData.members.length}
        quickAccess={false}
      />
      
      <main className="max-w-7xl mx-auto pt-20 px-4 pb-16">
        {/* Quick access icons */}
        <div className="flex justify-center gap-6 mb-8 pt-4 animate-fade-in">
          <Link to="/members" className="flex flex-col items-center p-3 rounded-xl transition-all bg-white/70 shadow-sm hover:shadow-md">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-2">
              <Users size={24} />
            </div>
            <span className="text-sm font-medium">الأعضاء</span>
          </Link>
          
          <Link to="/progress" className="flex flex-col items-center p-3 rounded-xl transition-all bg-white/70 shadow-sm hover:shadow-md">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-2">
              <BarChart size={24} />
            </div>
            <span className="text-sm font-medium">التقدم</span>
          </Link>
        </div>
        
        <div className="mb-8">
          <h2 className="text-xl font-bold mb-6 flex items-center">
            <Book className="h-5 w-5 ml-2 text-primary" />
            ترتيب الأعضاء حسب التقدم الإجمالي
          </h2>
          
          <div className="grid grid-cols-1 gap-4">
            {sortedMembers.length > 0 ? (
              sortedMembers.map((member, index) => {
                const progress = (member.completedAhzab / member.totalAhzab) * 100;
                
                return (
                  <Card 
                    key={member.id} 
                    className={`bg-white animate-fade-in ${index < 3 ? 'border-2 border-primary/30 shadow-md' : 'border border-gray-100'} rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-md`}
                  >
                    <CardContent className="pt-6 pb-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div 
                            className={`w-12 h-12 rounded-full flex items-center justify-center text-white mr-3 ${index === 0 ? 'bg-yellow-500' : index === 1 ? 'bg-slate-400' : index === 2 ? 'bg-amber-700' : 'soft-gradient'}`}
                          >
                            {member.name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <h3 className="text-lg font-bold">{member.name}</h3>
                            <p className="text-sm text-muted-foreground">
                              {index === 0 ? 'المركز الأول' : index === 1 ? 'المركز الثاني' : index === 2 ? 'المركز الثالث' : `المركز ${index + 1}`}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center justify-center bg-primary/10 rounded-full w-14 h-14 p-2">
                          <div className="text-xl font-bold text-center text-primary">{member.completedAhzab}</div>
                        </div>
                      </div>
                      
                      <div className="mt-4">
                        <div className="flex justify-between text-sm mb-2">
                          <span className="text-gray-500">التقدم الإجمالي</span>
                          <span className="font-bold">{Math.round(progress)}%</span>
                        </div>
                        <ProgressBar 
                          progress={progress}
                          color={member.avatarColor}
                          className="w-full"
                          height="h-3"
                        />
                        <div className="text-sm text-gray-500 mt-2 text-center">
                          {member.completedAhzab} / {member.totalAhzab} حزب
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })
            ) : (
              <Card className="bg-white p-8 text-center shadow-sm rounded-2xl">
                <p className="text-muted-foreground">لا توجد بيانات متاحة</p>
              </Card>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Home;
