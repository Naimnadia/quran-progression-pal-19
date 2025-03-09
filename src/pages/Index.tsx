
import { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Header from '@/components/Header';
import AddMemberForm from '@/components/AddMemberForm';
import UpdateProgressForm from '@/components/UpdateProgressForm';
import Dashboard from '@/components/Dashboard';
import MembersList from '@/components/MembersList';
import { 
  getGroupData, 
  addMember as addMemberToStorage, 
  updateMemberProgress as updateMemberProgressInStorage,
  removeMember as removeMemberFromStorage
} from '@/utils/storage';
import { GroupData, Member } from '@/utils/types';
import { Gauge, Users, BookOpen } from 'lucide-react';

const Index = () => {
  const [groupData, setGroupData] = useState<GroupData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get data from local storage on component mount
    const data = getGroupData();
    setGroupData(data);
    setLoading(false);
  }, []);

  const handleAddMember = (name: string) => {
    const updatedData = addMemberToStorage(name);
    setGroupData(updatedData);
  };

  const handleUpdateProgress = (memberId: string, completedAhzab: number) => {
    const updatedData = updateMemberProgressInStorage(memberId, completedAhzab);
    setGroupData(updatedData);
  };

  const handleRemoveMember = (memberId: string) => {
    const updatedData = removeMemberFromStorage(memberId);
    setGroupData(updatedData);
  };

  if (loading || !groupData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-primary font-medium">Chargement...</div>
      </div>
    );
  }

  // Sort members by progress percentage (highest to lowest)
  const sortedMembers = [...groupData.members].sort((a, b) => {
    const progressA = (a.completedAhzab / a.totalAhzab) * 100;
    const progressB = (b.completedAhzab / b.totalAhzab) * 100;
    return progressB - progressA;
  });

  const sortedGroupData = {
    ...groupData,
    members: sortedMembers
  };

  return (
    <div className="min-h-screen">
      <Header 
        groupName={groupData.name} 
        memberCount={groupData.members.length} 
      />
      
      <main className="max-w-7xl mx-auto pt-28 px-4 pb-16">
        <Tabs defaultValue="dashboard" className="w-full animate-fade-in">
          <TabsList className="glass mb-8 p-1 w-full sm:w-auto grid grid-cols-3 sm:flex">
            <TabsTrigger value="dashboard" className="px-4 py-2">
              <Gauge size={16} className="mr-2" />
              <span>Tableau de bord</span>
            </TabsTrigger>
            <TabsTrigger value="members" className="px-4 py-2">
              <Users size={16} className="mr-2" />
              <span>Membres</span>
            </TabsTrigger>
            <TabsTrigger value="progress" className="px-4 py-2">
              <BookOpen size={16} className="mr-2" />
              <span>Progression</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="dashboard" className="animate-slide-up">
            <Dashboard 
              data={sortedGroupData}
              onRemoveMember={handleRemoveMember}
            />
          </TabsContent>
          
          <TabsContent value="members" className="animate-slide-up">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="md:col-span-2">
                <MembersList 
                  members={sortedMembers}
                  onRemoveMember={handleRemoveMember}
                />
              </div>
              <div>
                <AddMemberForm onAddMember={handleAddMember} />
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="progress" className="animate-slide-up">
            <UpdateProgressForm 
              members={sortedMembers}
              onUpdateProgress={handleUpdateProgress}
            />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Index;
