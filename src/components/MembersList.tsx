
import { useState } from 'react';
import { Member } from '@/utils/types';
import { cn } from '@/lib/utils';
import { Trash2, BarChart2 } from 'lucide-react';
import ProgressBar from './ProgressBar';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import MemberProgressStats from './MemberProgressStats';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';

interface MembersListProps {
  members: Member[];
  onRemoveMember: (memberId: string) => void;
}

const MembersList = ({ members, onRemoveMember }: MembersListProps) => {
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);

  if (members.length === 0) {
    return (
      <div className="glass p-6 rounded-xl text-center">
        <p className="text-gray-500">لا يوجد أعضاء في المجموعة.</p>
        <p className="text-sm text-gray-400 mt-2">
          أضف أعضاء للبدء في متابعة التقدم.
        </p>
      </div>
    );
  }

  const handleRemoveMember = (id: string, name: string) => {
    if (confirm(`هل أنت متأكد أنك تريد حذف ${name}؟`)) {
      onRemoveMember(id);
      toast.success(`تم حذف ${name} من المجموعة`);
    }
  };

  const handleViewStats = (member: Member) => {
    setSelectedMember(member);
  };

  const handleCloseStats = () => {
    setSelectedMember(null);
  };

  if (selectedMember) {
    return (
      <MemberProgressStats 
        member={selectedMember}
        onClose={handleCloseStats}
      />
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <h3 className="text-xl font-medium">أعضاء المجموعة</h3>
      
      <div className="grid grid-cols-1 gap-4">
        {members.map((member) => (
          <div 
            key={member.id}
            className="glass p-4 rounded-xl transition-all duration-300 hover:shadow-lg flex flex-col sm:flex-row sm:items-center"
          >
            <div className="flex items-center space-x-4 mb-4 sm:mb-0 sm:flex-1">
              <Avatar className="w-12 h-12 rounded-full flex-shrink-0">
                {member.photoUrl ? (
                  <AvatarImage src={member.photoUrl} alt={member.name} />
                ) : null}
                <AvatarFallback style={{ backgroundColor: member.avatarColor }} className="text-white text-lg font-medium">
                  {member.name.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              
              <div className="flex-1 mr-4">
                <h4 className="font-medium">{member.name}</h4>
                <div className="text-sm text-gray-400 mb-1">
                  {member.completedAhzab} / {member.totalAhzab} أحزاب تم إكمالها
                </div>
                <ProgressBar 
                  progress={(member.completedAhzab / member.totalAhzab) * 100}
                  color={member.avatarColor}
                  className="w-full sm:max-w-[200px]"
                />
              </div>
            </div>
            
            <div className="flex justify-between items-center sm:justify-end sm:space-x-4">
              <div className="text-xl font-bold text-primary">
                {Math.round((member.completedAhzab / member.totalAhzab) * 100)}%
              </div>
              
              <div className="flex space-x-2">
                <Button 
                  variant="ghost" 
                  size="icon"
                  className="text-gray-400 hover:text-primary mr-2"
                  onClick={() => handleViewStats(member)}
                  title="عرض الإحصائيات"
                >
                  <BarChart2 size={18} />
                </Button>
                
                <Button 
                  variant="ghost" 
                  size="icon"
                  className="text-gray-400 hover:text-red-500 mr-2"
                  onClick={() => handleRemoveMember(member.id, member.name)}
                  title="حذف العضو"
                >
                  <Trash2 size={18} />
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MembersList;
