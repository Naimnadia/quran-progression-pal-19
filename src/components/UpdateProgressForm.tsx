
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { BookOpen, Save, Calendar } from 'lucide-react';
import { Member, MonthlyProgress } from '@/utils/types';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import ProgressBar from './ProgressBar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { format, parseISO, subMonths } from 'date-fns';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';

interface UpdateProgressFormProps {
  members: Member[];
  onUpdateProgress: (memberId: string, completedAhzab: number, month?: string) => void;
}

const UpdateProgressForm = ({ members, onUpdateProgress }: UpdateProgressFormProps) => {
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);
  const [ahzabCount, setAhzabCount] = useState<number>(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [isHistoricalMode, setIsHistoricalMode] = useState(false);

  const handleSelectMember = (member: Member) => {
    setSelectedMember(member);
    setAhzabCount(member.completedAhzab);
    
    // Reset historical mode when selecting a new member
    setIsHistoricalMode(false);
    setSelectedDate(new Date());
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedMember) {
      toast.error('يرجى تحديد عضو');
      return;
    }
    
    if (ahzabCount < 0 || ahzabCount > selectedMember.totalAhzab) {
      toast.error(`يجب أن يكون عدد الأحزاب بين 0 و ${selectedMember.totalAhzab}`);
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // If in historical mode, format the month as YYYY-MM
      const monthStr = isHistoricalMode ? format(selectedDate, 'yyyy-MM') : undefined;
      
      onUpdateProgress(selectedMember.id, ahzabCount, monthStr);
      
      // Show different success message based on mode
      if (isHistoricalMode) {
        toast.success(`تم تحديث التقدم لشهر ${format(selectedDate, 'MMMM yyyy')} بنجاح`);
      } else {
        toast.success('تم تحديث التقدم بنجاح');
      }
      
      setSelectedMember(null);
      setIsHistoricalMode(false);
    } catch (error) {
      toast.error('خطأ أثناء التحديث');
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleHistoricalMode = () => {
    setIsHistoricalMode(!isHistoricalMode);
  };

  const renderMembersList = () => {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-6">
        {members.map((member) => (
          <div
            key={member.id}
            className={cn(
              "p-4 rounded-lg cursor-pointer transition-all duration-200 flex items-center space-x-3",
              selectedMember?.id === member.id
                ? "glass-dark text-white shadow-md transform scale-[1.02]"
                : "glass hover:shadow-md"
            )}
            onClick={() => handleSelectMember(member)}
          >
            <div 
              className="w-10 h-10 rounded-full flex items-center justify-center text-white"
              style={{ backgroundColor: member.avatarColor }}
            >
              {member.name.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 mr-3">
              <div className="font-medium">{member.name}</div>
              <div className="text-xs text-gray-500">
                {member.completedAhzab} / {member.totalAhzab} أحزاب ({Math.round((member.completedAhzab / member.totalAhzab) * 100)}%)
              </div>
              <ProgressBar 
                progress={(member.completedAhzab / member.totalAhzab) * 100}
                color={member.avatarColor}
                className="mt-2"
              />
            </div>
          </div>
        ))}
      </div>
    );
  };

  const renderUpdateForm = () => {
    if (!selectedMember) return null;

    return (
      <form onSubmit={handleSubmit} className="glass p-6 rounded-xl animate-fade-in">
        <h3 className="text-lg font-medium mb-4">
          تحديث تقدم {selectedMember.name}
        </h3>
        
        <div className="space-y-4">
          {/* Add toggle for historical mode */}
          <div className="flex items-center space-x-2 mb-4">
            <Button 
              type="button" 
              variant={isHistoricalMode ? "default" : "outline"}
              size="sm"
              onClick={toggleHistoricalMode}
              className="mr-2"
            >
              <Calendar size={16} className="ml-2" />
              {isHistoricalMode ? 'تحديث شهر سابق' : 'تحديث الشهر الحالي'}
            </Button>
            
            {isHistoricalMode && (
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" size="sm">
                    {format(selectedDate, 'MMMM yyyy')}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <CalendarComponent
                    mode="month"
                    defaultMonth={selectedDate}
                    selected={selectedDate}
                    onSelect={(date) => date && setSelectedDate(date)}
                    disabled={(date) => date > new Date()}
                    initialFocus
                    className="p-3 pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
            )}
          </div>
          
          <div className="space-y-2">
            <label htmlFor="ahzabCount" className="text-sm font-medium flex items-center">
              <BookOpen size={16} className="ml-2" />
              {isHistoricalMode 
                ? `عدد الأحزاب المكتملة في ${format(selectedDate, 'MMMM yyyy')}`
                : 'عدد الأحزاب المكتملة'}
            </label>
            <div className="flex items-center space-x-4">
              <Input
                id="ahzabCount"
                type="number"
                min="0"
                max={selectedMember.totalAhzab}
                value={ahzabCount}
                onChange={(e) => setAhzabCount(parseInt(e.target.value) || 0)}
                className="bg-white bg-opacity-50"
              />
              <span className="text-sm text-gray-500 mr-4">
                من {selectedMember.totalAhzab}
              </span>
            </div>
          </div>
          
          <ProgressBar 
            progress={(ahzabCount / selectedMember.totalAhzab) * 100}
            height="h-3"
            showPercentage={true}
            color={selectedMember.avatarColor}
          />
          
          <div className="flex space-x-3 pt-2">
            <Button 
              type="submit" 
              className="flex-1 group"
              disabled={isSubmitting}
            >
              <Save size={18} className="ml-2 group-hover:scale-110 transition-transform" />
              حفظ
            </Button>
            <Button 
              type="button" 
              variant="outline"
              className="flex-1 mr-3"
              onClick={() => {
                setSelectedMember(null);
                setIsHistoricalMode(false);
              }}
            >
              إلغاء
            </Button>
          </div>
        </div>
      </form>
    );
  };

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-medium">تحديث التقدم</h3>
      {renderMembersList()}
      {renderUpdateForm()}
    </div>
  );
};

export default UpdateProgressForm;
