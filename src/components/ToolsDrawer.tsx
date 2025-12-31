import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { User, Lightbulb, Map, TrendingUp, Mic } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { useIsMobile } from "@/hooks/use-mobile";

type DialogType = 'quiz' | 'decision' | 'friction' | 'portfolio' | null;

interface ToolsDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onToolClick: (toolId: DialogType) => void;
}

interface InteractiveCardProps {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  description: string;
  onClick: () => void;
  delay?: number;
  hasVoice?: boolean;
}

const InteractiveCard = ({ icon, title, subtitle, description, onClick, delay = 0, hasVoice = true }: InteractiveCardProps) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay }}
      className="flex flex-col"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div 
        className="premium-card flex flex-col p-4 cursor-pointer group relative overflow-hidden rounded-2xl"
        onClick={onClick}
      >
        {/* Animated gradient border effect on hover */}
        <motion.div
          className="absolute inset-0 rounded-2xl pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: isHovered ? 1 : 0 }}
          transition={{ duration: 0.3 }}
          style={{
            background: 'linear-gradient(135deg, hsl(var(--mint) / 0.3) 0%, transparent 50%, hsl(var(--mint) / 0.2) 100%)',
          }}
        />

        {/* Content */}
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2.5">
              <motion.div 
                className="w-10 h-10 rounded-xl bg-gradient-to-br from-mint/30 to-mint/10 flex items-center justify-center shadow-lg shadow-mint/10 flex-shrink-0"
                animate={isHovered ? { scale: 1.05, rotate: 3 } : { scale: 1, rotate: 0 }}
                transition={{ duration: 0.3 }}
              >
                {icon}
              </motion.div>
              <div className="min-w-0">
                <h3 className="font-bold text-base leading-tight">{title}</h3>
                <p className="text-[10px] text-muted-foreground">{subtitle}</p>
              </div>
            </div>
            
            {/* Voice indicator badge */}
            {hasVoice && (
              <motion.div
                className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-mint/10 border border-mint/20 flex-shrink-0"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: delay + 0.3 }}
              >
                <Mic className="w-2.5 h-2.5 text-mint" />
                <span className="text-[9px] font-medium text-mint-dark">Voice</span>
              </motion.div>
            )}
          </div>
          
          <p className="text-xs text-muted-foreground mb-3 leading-relaxed line-clamp-2">
            {description}
          </p>
          
          <Button 
            variant="mint" 
            className="w-full group/btn relative overflow-hidden text-sm h-9"
            size="sm"
          >
            <span className="relative z-10 flex items-center justify-center gap-2">
              Open Tool
              <motion.span
                animate={isHovered ? { x: 4 } : { x: 0 }}
                transition={{ duration: 0.2 }}
              >
                →
              </motion.span>
            </span>
          </Button>
        </div>

        {/* Decorative corner accent */}
        <div className="absolute top-0 right-0 w-16 h-16 overflow-hidden pointer-events-none">
          <motion.div
            className="absolute -top-8 -right-8 w-16 h-16 bg-gradient-to-br from-mint/20 to-transparent rotate-45"
            animate={isHovered ? { scale: 1.5, opacity: 1 } : { scale: 1, opacity: 0.5 }}
            transition={{ duration: 0.3 }}
          />
        </div>
      </div>
    </motion.div>
  );
};

// Mobile card - compact to fit in viewport
const MobileInteractiveCard = ({ icon, title, subtitle, description, onClick, hasVoice = true }: InteractiveCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex flex-col"
    >
      <div 
        className="flex flex-col p-3 cursor-pointer rounded-xl relative overflow-hidden"
        onClick={onClick}
        style={{
          background: 'linear-gradient(135deg, hsl(var(--card) / 0.95), hsl(var(--mint) / 0.05))',
          backdropFilter: 'blur(12px)',
          border: '2px solid hsl(var(--mint) / 0.3)',
          boxShadow: '0 8px 32px hsl(var(--mint) / 0.1), inset 0 1px 0 hsl(var(--mint) / 0.1)',
        }}
      >
        {/* Voice indicator */}
        {hasVoice && (
          <div className="absolute top-2 right-2 flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-mint/15 border border-mint/25">
            <Mic className="w-2 h-2 text-mint" />
            <span className="text-[8px] font-medium text-mint-dark">Voice</span>
          </div>
        )}

        <div className="flex items-start gap-2.5 mb-2">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-mint/30 to-mint/10 flex items-center justify-center flex-shrink-0">
            {icon}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-sm leading-tight">{title}</h3>
            <p className="text-[10px] text-muted-foreground">{subtitle}</p>
          </div>
        </div>
        
        <p className="text-xs text-muted-foreground mb-2.5 leading-relaxed line-clamp-2">
          {description}
        </p>
        
        <Button 
          variant="mint" 
          className="w-full text-xs h-8"
          size="sm"
        >
          Open Tool →
        </Button>
      </div>
    </motion.div>
  );
};

export const ToolsDrawer = ({ open, onOpenChange, onToolClick }: ToolsDrawerProps) => {
  const isMobile = useIsMobile();

  const cards = [
    {
      id: 'quiz' as const,
      icon: <User className="w-5 h-5 text-mint-dark" />,
      title: "Builder Profile Quiz",
      subtitle: "60-second assessment",
      description: "Where are you on your AI journey? Take a quick assessment to get personalized recommendations."
    },
    {
      id: 'decision' as const,
      icon: <Lightbulb className="w-5 h-5 text-mint-dark" />,
      title: "AI Decision Helper",
      subtitle: "Instant clarity",
      description: "Stuck on an AI decision? Get structured advice and a clear next step right now."
    },
    {
      id: 'friction' as const,
      icon: <Map className="w-5 h-5 text-mint-dark" />,
      title: "Friction Map Builder",
      subtitle: "Map your time sink",
      description: "Visualize your biggest friction point and see how AI can help you reclaim your time."
    },
    {
      id: 'portfolio' as const,
      icon: <TrendingUp className="w-5 h-5 text-mint-dark" />,
      title: "Model out your starting points",
      subtitle: "Build your AI portfolio",
      description: "Select your weekly tasks and see your personalized transformation roadmap."
    }
  ];

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent 
        side="right" 
        className="w-full sm:max-w-md h-screen max-h-screen overflow-hidden flex flex-col p-0"
      >
        <SheetHeader className="shrink-0 px-6 pt-6 pb-4 border-b">
          <SheetTitle className="text-sm font-bold italic text-mint-dark dark:text-mint text-center tracking-widest">
            IDEATE WITH MINDMAKER AI
          </SheetTitle>
        </SheetHeader>

        {/* Content area - constrained to viewport, no scrolling */}
        <div className="flex-1 overflow-hidden flex flex-col min-h-0">
          {/* Desktop: Vertical Stack - All cards fit without scrolling */}
          <div className="hidden md:flex md:flex-col gap-2.5 px-5 py-3 h-full">
            {cards.map((card, index) => (
              <div key={card.id} className="flex-shrink-0">
                <InteractiveCard
                  icon={card.icon}
                  title={card.title}
                  subtitle={card.subtitle}
                  description={card.description}
                  onClick={() => {
                    onToolClick(card.id);
                    onOpenChange(false);
                  }}
                  delay={0.1 * (index + 1)}
                  hasVoice={true}
                />
              </div>
            ))}
          </div>

          {/* Mobile: Vertical Stack - All cards fit without scrolling */}
          <div className="md:hidden flex flex-col gap-2 px-3 py-2.5 h-full">
            {cards.map((card) => (
              <div key={card.id} className="flex-shrink-0">
                <MobileInteractiveCard
                  icon={card.icon}
                  title={card.title}
                  subtitle={card.subtitle}
                  description={card.description}
                  onClick={() => {
                    onToolClick(card.id);
                    onOpenChange(false);
                  }}
                  hasVoice={true}
                />
              </div>
            ))}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

