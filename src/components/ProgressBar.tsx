
import { useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils';

interface ProgressBarProps {
  progress: number;
  color?: string;
  height?: string;
  animated?: boolean;
  className?: string;
  showPercentage?: boolean;
}

const ProgressBar = ({
  progress,
  color = 'bg-brand-500',
  height = 'h-2',
  animated = true,
  className,
  showPercentage = false,
}: ProgressBarProps) => {
  const progressRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const clampedProgress = Math.min(100, Math.max(0, progress));

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (progressRef.current) {
      observer.observe(progressRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <div className="relative">
      <div 
        ref={progressRef}
        className={cn('progress-bar-container', height, className)}
      >
        <div
          className={cn(
            'progress-bar', 
            color,
            { 'transition-all duration-1000': animated }
          )}
          style={{
            width: isVisible ? `${clampedProgress}%` : '0%',
            '--progress-width': `${clampedProgress}%`,
          } as React.CSSProperties}
        />
      </div>
      {showPercentage && (
        <span className="text-xs text-gray-500 mt-1 absolute -right-1 -top-6">
          {Math.round(clampedProgress)}%
        </span>
      )}
    </div>
  );
};

export default ProgressBar;
