
import { useState, useEffect } from 'react';
import { Book, Users } from 'lucide-react';
import { cn } from '@/lib/utils';

interface HeaderProps {
  groupName: string;
  memberCount: number;
}

const Header = ({ groupName, memberCount }: HeaderProps) => {
  const [scrolled, setScrolled] = useState(false);
  
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    
    window.addEventListener('scroll', handleScroll);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <header 
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300 py-4 px-6',
        scrolled 
          ? 'glass shadow-lg backdrop-blur-xl py-3' 
          : 'bg-transparent py-6'
      )}
      dir="rtl"
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="bg-primary text-white p-2 rounded-lg">
            <Book size={20} />
          </div>
          <div>
            <h1 className="text-xl font-cairo font-bold tracking-tight">{groupName}</h1>
            <p className="text-sm text-muted-foreground flex items-center mt-0.5">
              <Users size={14} className="ml-1" /> {memberCount} الأعضاء
            </p>
          </div>
        </div>
        
        <div className="flex items-center">
          <div className="relative">
            <div className="glass px-3 py-1.5 rounded-full text-sm font-medium font-cairo bg-primary/20">
              قراءة القرآن
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
