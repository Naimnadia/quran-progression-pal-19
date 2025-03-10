
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { UserPlus } from 'lucide-react';
import { toast } from 'sonner';

interface AddMemberFormProps {
  onAddMember: (name: string) => void;
}

const AddMemberForm = ({ onAddMember }: AddMemberFormProps) => {
  const [name, setName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim()) {
      toast.error('يرجى إدخال اسم');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      onAddMember(name.trim());
      setName('');
      toast.success('تمت إضافة العضو بنجاح');
    } catch (error) {
      toast.error('خطأ في إضافة العضو');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="glass p-6 rounded-xl animate-fade-in">
      <h3 className="text-lg font-medium mb-4">إضافة عضو</h3>
      
      <div className="flex flex-col space-y-4">
        <div className="space-y-2">
          <label htmlFor="name" className="text-sm font-medium">
            اسم العضو
          </label>
          <Input
            id="name"
            placeholder="أدخل الاسم"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="bg-white bg-opacity-50"
          />
        </div>
        
        <Button 
          type="submit" 
          className="w-full group transition-all"
          disabled={isSubmitting}
        >
          <UserPlus size={18} className="ml-2 group-hover:scale-110 transition-transform" />
          إضافة
        </Button>
      </div>
    </form>
  );
};

export default AddMemberForm;
