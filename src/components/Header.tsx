
import { useState, useEffect } from 'react';
import { Book, Users, BarChart, Menu, Home, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Link } from 'react-router-dom';
import { useIsMobile } from '@/hooks/use-mobile';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";

interface HeaderProps {
  groupName: string;
  memberCount: number;
  quickAccess?: boolean;
}

const Header = ({ groupName, memberCount, quickAccess = false }: HeaderProps) => {
  const [scrolled, setScrolled] = useState(false);
  const isMobile = useIsMobile();
  
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    
    window.addEventListener('scroll', handleScroll);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const QuickAccessLinks = () => (
    <>
      <h2 className="text-lg font-bold mb-3 flex items-center">
        <ArrowRight className="h-5 w-5 ml-2 text-primary" />
        الوصول السريع
      </h2>
      <div className="flex flex-col gap-3">
        <Link to="/" className="glass-dark px-4 py-3 rounded-xl hover:bg-primary/10 transition-all flex items-center text-sm shadow-sm">
          <Home className="h-5 w-5 ml-2 text-primary" />
          <div className="text-right">
            <div className="font-medium">الرئيسية</div>
            <div className="text-xs text-muted-foreground">العودة إلى الصفحة الرئيسية</div>
          </div>
        </Link>
        <Link to="/members" className="glass-dark px-4 py-3 rounded-xl hover:bg-primary/10 transition-all flex items-center text-sm shadow-sm">
          <Users className="h-5 w-5 ml-2 text-primary" />
          <div className="text-right">
            <div className="font-medium">إدارة الأعضاء</div>
            <div className="text-xs text-muted-foreground">إضافة أعضاء جدد وإدارة الأعضاء الحاليين</div>
          </div>
        </Link>
        <Link to="/progress" className="glass-dark px-4 py-3 rounded-xl hover:bg-primary/10 transition-all flex items-center text-sm shadow-sm">
          <BarChart className="h-5 w-5 ml-2 text-primary" />
          <div className="text-right">
            <div className="font-medium">تحديث التقدم</div>
            <div className="text-xs text-muted-foreground">تسجيل التقدم في قراءة القرآن</div>
          </div>
        </Link>
      </div>
    </>
  );

  return (
    <header 
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
        scrolled 
          ? 'glass-dark shadow-lg backdrop-blur-xl py-3' 
          : 'bg-transparent py-4'
      )}
      dir="rtl"
    >
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="bg-primary text-white p-2.5 rounded-xl mr-3 shadow-md">
              <Book size={20} />
            </div>
            <div>
              <h1 className="text-xl font-cairo font-bold tracking-tight">{groupName}</h1>
              <p className="text-sm text-muted-foreground flex items-center mt-0.5">
                <Users size={14} className="ml-1" /> {memberCount} الأعضاء
              </p>
            </div>
          </div>
          
          {quickAccess && (
            <>
              {isMobile ? (
                <Sheet>
                  <SheetTrigger asChild>
                    <Button variant="outline" size="icon" className="ml-2 rounded-xl bg-black/20 border-white/10 hover:bg-black/30">
                      <Menu className="h-5 w-5" />
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="right" className="w-[85%] p-6 bg-gradient-to-br from-background to-secondary/70 border-white/10">
                    <div className="mt-8">
                      <QuickAccessLinks />
                    </div>
                  </SheetContent>
                </Sheet>
              ) : (
                <div className="hidden md:block">
                  <QuickAccessLinks />
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
