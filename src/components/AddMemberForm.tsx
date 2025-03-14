
import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { UserPlus, Upload, X } from 'lucide-react';
import { toast } from 'sonner';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';

interface AddMemberFormProps {
  onAddMember: (name: string, photoUrl?: string) => void;
}

const AddMemberForm = ({ onAddMember }: AddMemberFormProps) => {
  const [name, setName] = useState('');
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim()) {
      toast.error('يرجى إدخال اسم');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      onAddMember(name.trim(), photoUrl || undefined);
      setName('');
      setPhotoUrl(null);
      toast.success('تمت إضافة العضو بنجاح');
    } catch (error) {
      toast.error('خطأ في إضافة العضو');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // Check file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      toast.error('حجم الصورة كبير جدًا، يجب أن يكون أقل من 2 ميجابايت');
      return;
    }
    
    // Check file type
    if (!file.type.startsWith('image/')) {
      toast.error('يرجى اختيار ملف صورة');
      return;
    }
    
    // Create object URL for preview
    const url = URL.createObjectURL(file);
    setPhotoUrl(url);
  };

  const clearPhoto = () => {
    setPhotoUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
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
        
        <div className="space-y-2">
          <label htmlFor="photo" className="text-sm font-medium">
            صورة العضو (اختياري)
          </label>
          <div className="flex flex-col items-center space-y-3">
            {photoUrl ? (
              <div className="relative">
                <Avatar className="w-20 h-20 rounded-full overflow-hidden">
                  <AvatarImage src={photoUrl} alt="Member photo" />
                  <AvatarFallback>{name.charAt(0).toUpperCase()}</AvatarFallback>
                </Avatar>
                <Button 
                  type="button" 
                  variant="destructive" 
                  size="icon" 
                  className="absolute -top-2 -right-2 h-6 w-6 rounded-full"
                  onClick={clearPhoto}
                >
                  <X size={14} />
                </Button>
              </div>
            ) : (
              <Button 
                type="button" 
                variant="outline" 
                className="w-20 h-20 rounded-full"
                onClick={() => fileInputRef.current?.click()}
              >
                <Upload size={24} />
              </Button>
            )}
            <Input
              id="photo"
              type="file"
              accept="image/*"
              ref={fileInputRef}
              className="hidden"
              onChange={handlePhotoUpload}
            />
            <Button 
              type="button"
              variant="outline"
              size="sm"
              onClick={() => fileInputRef.current?.click()}
              className="mt-2"
            >
              اختر صورة
            </Button>
          </div>
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
