
import { useState } from 'react';
import { Book, Users } from 'lucide-react';
import { cn } from '@/lib/utils';

interface HeaderProps {
  groupName: string;
  memberCount: number;
}

const Header = ({ groupName, memberCount }: HeaderProps) => {
  const [scrolled, setScrolled] = useState(false);
  
  // Add scroll listener
  if (typeof window !== 'undefined') {
    window.addEventListener('scroll', () => {
      setScrolled(window.scrollY > 10);
    });
  }

  return (
    <header 
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300 py-4 px-6',
        scrolled 
          ? 'glass shadow-md backdrop-blur-md py-3' 
          : 'bg-transparent py-6'
      )}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="bg-brand-500 text-white p-2 rounded-lg animate-pulse-scale">
            <Book size={20} />
          </div>
          <div>
            <h1 className="text-xl font-semibold tracking-tight">{groupName}</h1>
            <p className="text-sm text-muted-foreground flex items-center mt-0.5">
              <Users size={14} className="mr-1" /> {memberCount} membres
            </p>
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="hidden md:flex relative">
            <div className="glass px-3 py-1.5 rounded-full text-sm font-medium">
              Progression du Coran
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
