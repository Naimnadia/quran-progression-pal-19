
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { BookOpen, Save } from 'lucide-react';
import { Member } from '@/utils/types';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import ProgressBar from './ProgressBar';

interface UpdateProgressFormProps {
  members: Member[];
  onUpdateProgress: (memberId: string, completedAhzab: number) => void;
}

const UpdateProgressForm = ({ members, onUpdateProgress }: UpdateProgressFormProps) => {
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);
  const [ahzabCount, setAhzabCount] = useState<number>(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSelectMember = (member: Member) => {
    setSelectedMember(member);
    setAhzabCount(member.completedAhzab);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedMember) {
      toast.error('Veuillez sélectionner un membre');
      return;
    }
    
    if (ahzabCount < 0 || ahzabCount > selectedMember.totalAhzab) {
      toast.error(`Le nombre d'ahzab doit être entre 0 et ${selectedMember.totalAhzab}`);
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      onUpdateProgress(selectedMember.id, ahzabCount);
      toast.success('Progression mise à jour avec succès');
      setSelectedMember(null);
    } catch (error) {
      toast.error('Erreur lors de la mise à jour');
    } finally {
      setIsSubmitting(false);
    }
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
            <div className="flex-1">
              <div className="font-medium">{member.name}</div>
              <div className="text-xs text-gray-500">
                {member.completedAhzab} / {member.totalAhzab} ahzab ({Math.round((member.completedAhzab / member.totalAhzab) * 100)}%)
              </div>
              <ProgressBar 
                progress={(member.completedAhzab / member.totalAhzab) * 100}
                color={`bg-[${member.avatarColor}]`}
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
          Mettre à jour la progression de {selectedMember.name}
        </h3>
        
        <div className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="ahzabCount" className="text-sm font-medium flex items-center">
              <BookOpen size={16} className="mr-2" />
              Nombre d'ahzab complétés
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
              <span className="text-sm text-gray-500">
                sur {selectedMember.totalAhzab}
              </span>
            </div>
          </div>
          
          <ProgressBar 
            progress={(ahzabCount / selectedMember.totalAhzab) * 100}
            height="h-3"
            showPercentage={true}
          />
          
          <div className="flex space-x-3 pt-2">
            <Button 
              type="submit" 
              className="flex-1 group"
              disabled={isSubmitting}
            >
              <Save size={18} className="mr-2 group-hover:scale-110 transition-transform" />
              Enregistrer
            </Button>
            <Button 
              type="button" 
              variant="outline"
              className="flex-1"
              onClick={() => setSelectedMember(null)}
            >
              Annuler
            </Button>
          </div>
        </div>
      </form>
    );
  };

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-medium">Mettre à jour la progression</h3>
      {renderMembersList()}
      {renderUpdateForm()}
    </div>
  );
};

export default UpdateProgressForm;
