import React from 'react';
import { X, TrendingUp, Search, Brain } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useRealisticCounters } from '@/hooks/useRealisticCounters';

interface LiveStatsPopupProps {
  isVisible: boolean;
  onClose: () => void;
}

const LiveStatsPopup: React.FC<LiveStatsPopupProps> = ({ isVisible, onClose }) => {
  const { counterData, formatNumber, marketSentiment } = useRealisticCounters({ isVisible });
  const [lastUpdated, setLastUpdated] = React.useState<Date>(new Date());

  // Track when data updates for "last updated" display
  React.useEffect(() => {
    if (isVisible && counterData.length > 0) {
      setLastUpdated(new Date());
    }
  }, [counterData, isVisible]);

  // Auto dismiss after 20 seconds (increased for better UX)
  React.useEffect(() => {
    if (!isVisible) return;

    const autoDismiss = setTimeout(() => {
      onClose();
    }, 20000);

    return () => {
      clearTimeout(autoDismiss);
    };
  }, [isVisible, onClose]);

  // Map icon names to components
  const iconMap = {
    'Search': Search,
    'Brain': Brain
  };

  const statsData = counterData.map(stat => ({
    ...stat,
    icon: iconMap[stat.icon as keyof typeof iconMap] || Search
  }));

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-4 right-4 left-4 sm:left-auto sm:bottom-6 sm:right-6 z-50 animate-fade-in">
      <div className="glass-card p-3 sm:p-6 w-full max-w-xs sm:max-w-80 border border-border/50 shadow-2xl mx-auto overflow-hidden">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <div className="w-2 h-2 bg-destructive rounded-full animate-pulse"></div>
              <span className="text-xs font-medium text-muted-foreground">LIVE STATS</span>
              <span className="text-xs text-muted-foreground/70 truncate">
                • {lastUpdated.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
              </span>
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
                    <span className={`text-sm sm:text-lg font-bold ${stat.color} transition-all duration-300 animate-pulse truncate`}>
                      {formatNumber(stat.value)}{stat.suffix || ''}
                    </span>
                    <TrendingUp className="h-3 w-3 text-destructive animate-pulse opacity-60 flex-shrink-0" />
                  </div>
                  <p className="text-xs text-muted-foreground leading-tight truncate">
                    {stat.label}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Market Context - Enhanced visibility */}
        <div className="border-t border-border/30 pt-3 space-y-2">
          {marketSentiment.newsContext && marketSentiment.newsContext !== 'Standard market conditions' && (
            <div className="flex items-start gap-2">
              <div className="w-1.5 h-1.5 bg-primary rounded-full mt-1.5 animate-pulse"></div>
              <div className="text-xs text-muted-foreground">
                <span className="font-medium text-foreground">AI Impact:</span> {marketSentiment.newsContext}
              </div>
            </div>
          )}
          
          {/* Multiplier indicators for debug */}
          {process.env.NODE_ENV === 'development' && (
            <div className="text-xs text-muted-foreground/60 space-y-1">
              <div>Anxiety: {marketSentiment.aiAnxietyMultiplier.toFixed(2)}x</div>
              <div>Training: {marketSentiment.trainingInterestMultiplier.toFixed(2)}x</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LiveStatsPopup;