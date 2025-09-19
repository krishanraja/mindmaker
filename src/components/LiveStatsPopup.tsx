import React, { useState, useEffect } from 'react';
import { X, TrendingUp, Users, Search, Brain } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface LiveStatsPopupProps {
  isVisible: boolean;
  onClose: () => void;
}

const LiveStatsPopup: React.FC<LiveStatsPopupProps> = ({ isVisible, onClose }) => {
  const [counters, setCounters] = useState({
    dailyReskilling: 847,
    searchAnxiety: 12400,
    skillsGap: 73.2
  });

  useEffect(() => {
    if (!isVisible) return;

    const interval = setInterval(() => {
      const now = new Date();
      const hours = now.getHours();
      const isBusinessHours = hours >= 9 && hours <= 17;

      setCounters(prev => ({
        dailyReskilling: prev.dailyReskilling + (isBusinessHours && Math.random() < 0.7 ? Math.floor(Math.random() * 3) + 1 : 0),
        searchAnxiety: prev.searchAnxiety + (isBusinessHours ? 
          Math.floor(Math.random() * 12) + 5 : 
          Math.floor(Math.random() * 4) + 1),
        skillsGap: Math.min(99.9, prev.skillsGap + (Math.random() < 0.15 ? 0.1 : 0))
      }));
    }, 3000);

    // Auto dismiss after 12 seconds
    const autoDismiss = setTimeout(() => {
      onClose();
    }, 12000);

    return () => {
      clearInterval(interval);
      clearTimeout(autoDismiss);
    };
  }, [isVisible, onClose]);

  const formatNumber = (num: number): string => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
      return Math.round(num).toLocaleString();
    }
    return (Math.round(num * 10) / 10).toString();
  };

  const statsData = [
    {
      key: 'dailyReskilling',
      value: counters.dailyReskilling,
      label: 'Workers needing reskilling daily',
      icon: Users,
      color: 'text-destructive',
      bgColor: 'bg-destructive/10',
      pulse: true
    },
    {
      key: 'searchAnxiety', 
      value: counters.searchAnxiety,
      label: 'Daily "AI will replace me" searches',
      icon: Search,
      color: 'text-primary',
      bgColor: 'bg-primary/10',
      pulse: true
    },
    {
      key: 'skillsGap',
      value: counters.skillsGap,
      label: '% unprepared for AI transformation',
      icon: Brain,
      color: 'text-accent',
      bgColor: 'bg-accent/10',
      pulse: false,
      suffix: '%'
    }
  ];

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-fade-in">
      <div className="glass-card p-6 w-80 border border-border/50 shadow-2xl">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <div className="w-2 h-2 bg-destructive rounded-full animate-pulse"></div>
              <span className="text-xs font-medium text-muted-foreground">LIVE STATS</span>
            </div>
            <h3 className="text-sm font-semibold text-foreground">The Human Challenge</h3>
          </div>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={onClose}
            className="h-6 w-6 p-0 hover:bg-muted"
          >
            <X className="h-3 w-3" />
          </Button>
        </div>

        {/* Stats Grid */}
        <div className="space-y-3 mb-4">
          {statsData.map((stat) => {
            const IconComponent = stat.icon;
            return (
              <div 
                key={stat.key} 
                className="flex items-center gap-3 p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors group"
              >
                <div className={`p-2 rounded-lg ${stat.bgColor} group-hover:scale-110 transition-transform`}>
                  <IconComponent className={`h-4 w-4 ${stat.color}`} />
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className={`text-lg font-bold ${stat.color} transition-all duration-500`}>
                      {formatNumber(stat.value)}{stat.suffix || ''}
                    </span>
                    {stat.pulse && <TrendingUp className="h-3 w-3 text-destructive animate-pulse" />}
                  </div>
                  <p className="text-xs text-muted-foreground leading-tight">
                    {stat.label}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer Message */}
        <div className="bg-gradient-primary/10 rounded-lg p-3 text-center">
          <p className="text-xs text-foreground font-medium mb-1">
            This is why MindMaker exists
          </p>
          <p className="text-xs text-muted-foreground">
            Bridging the gap between AI hype and human empowerment
          </p>
        </div>
      </div>
    </div>
  );
};

export default LiveStatsPopup;