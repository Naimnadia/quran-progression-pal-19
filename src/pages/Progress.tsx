import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import Header from '@/components/Header';
import UpdateProgressForm from '@/components/UpdateProgressForm';
import { getGroupData, updateMemberProgress, saveGroupData } from '@/utils/storage';
import { GroupData, Member, MonthlyProgress } from '@/utils/types';
import { ArrowLeft } from 'lucide-react';
import { format } from 'date-fns';
import { toast } from 'sonner';

const Progress = () => {
  const [groupData, setGroupData] = useState<GroupData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get data from local storage on component mount
    const data = getGroupData();
    setGroupData(data);
    setLoading(false);
  }, []);

  const handleUpdateProgress = (memberId: string, completedAhzab: number, month?: string) => {
    if (!groupData) return;

    try {
      // Create a new copy of group data to work with
      const updatedGroupData = { ...groupData };
      
      // Find the member by ID
      const memberIndex = updatedGroupData.members.findIndex(m => m.id === memberId);
      if (memberIndex === -1) {
        toast.error('العضو غير موجود');
        return;
      }
      
      // Update the progress
      const updatedMembers = [...updatedGroupData.members];
      
      if (month) {
        // Update for a specific month - pass memberId instead of member object
        const updatedData = updateMemberProgress(memberId, completedAhzab, month);
        updatedGroupData.members = updatedData.members;
      } else {
        // Update current progress directly
        updatedMembers[memberIndex].completedAhzab = completedAhzab;
        updatedGroupData.members = updatedMembers;
        saveGroupData(updatedGroupData);
      }
      
      setGroupData(updatedGroupData);
      
      toast.success('تم تحديث التقدم بنجاح');
    } catch (error) {
      console.error('Error updating progress:', error);
      toast.error('حدث خطأ أثناء تحديث التقدم');
    }
  };

  if (loading || !groupData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-primary font-medium">جار التحميل...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" dir="rtl">
      <Header 
        groupName={groupData.name} 
        memberCount={groupData.members.length} 
      />
      
      <main className="max-w-7xl mx-auto pt-28 px-4 pb-16">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold mb-2">تحديث التقدم في القراءة</h1>
            <p className="text-gray-500">تحديث تقدم الأعضاء في قراءة القرآن الكريم</p>
          </div>
          <Link to="/">
            <Button variant="outline" size="sm" className="gap-2">
              <ArrowLeft size={16} />
              العودة للرئيسية
            </Button>
          </Link>
        </div>
        
        <Card className="glass p-6">
          <UpdateProgressForm 
            members={groupData.members} 
            onUpdateProgress={handleUpdateProgress} 
          />
        </Card>
      </main>
    </div>
  );
};

export default Progress;
