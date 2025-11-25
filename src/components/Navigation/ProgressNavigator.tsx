import { useScrollProgress } from '@/hooks/useScrollAnimation';
import { Button } from '@/components/ui/button';

const STAGES = [
  { id: 'hero', label: 'Start', progress: 0 },
  { id: 'problem', label: 'Discover', progress: 15 },
  { id: 'assessment', label: 'Assess', progress: 35 },
  { id: 'products', label: 'Build', progress: 55 },
  { id: 'trust', label: 'Connect', progress: 75 },
];

export const ProgressNavigator = () => {
  const scrollProgress = useScrollProgress();
  
  const currentStage = STAGES.reduce((acc, stage) => {
    if (scrollProgress >= stage.progress) return stage;
    return acc;
  }, STAGES[0]);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    element?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="fixed top-16 left-0 right-0 z-40 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="container-width py-2">
        <div className="flex items-center justify-between">
          {/* Progress Bar */}
          <div className="flex-1 flex items-center gap-2">
            {STAGES.map((stage, index) => (
              <div key={stage.id} className="flex-1 flex items-center gap-2">
                <button
                  onClick={() => scrollToSection(stage.id)}
                  className={`text-xs font-semibold transition-colors ${
                    scrollProgress >= stage.progress
                      ? 'text-mint'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {stage.label}
                </button>
                {index < STAGES.length - 1 && (
                  <div className="flex-1 h-0.5 bg-border rounded-full overflow-hidden">
                    <div
                      className="h-full bg-mint transition-all duration-300"
                      style={{
                        width: `${Math.min(100, Math.max(0, ((scrollProgress - stage.progress) / (STAGES[index + 1].progress - stage.progress)) * 100))}%`,
                      }}
                    />
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* CTA */}
          <Button
            size="sm"
            className="ml-4 bg-mint text-ink hover:bg-mint/90 font-bold hidden sm:flex"
            onClick={() => window.open('https://calendly.com/krish-raja/mindmaker-meeting', '_blank')}
          >
            Book Session
          </Button>
        </div>
      </div>
    </div>
  );
};
