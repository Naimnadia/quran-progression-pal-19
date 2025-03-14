
import { useState, useEffect } from 'react';
import { Book, Users } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Link } from 'react-router-dom';

interface HeaderProps {
  groupName: string;
  memberCount: number;
  quickAccess?: boolean;
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
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
        scrolled 
          ? 'bg-white/80 backdrop-blur-xl shadow-sm py-3' 
          : 'bg-transparent py-4'
      )}
      dir="rtl"
    >
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center">
            <div className="soft-gradient text-white p-2.5 rounded-2xl mr-3 shadow-sm">
              <Book size={20} />
            </div>
            <div>
              <h1 className="text-xl font-cairo font-bold tracking-tight">{groupName}</h1>
              <p className="text-sm text-muted-foreground flex items-center mt-0.5">
                <Users size={14} className="ml-1" /> {memberCount} الأعضاء
              </p>
            </div>
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Header;
