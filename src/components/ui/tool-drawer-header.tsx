import { Button } from '@/components/ui/button';
import { MindmakerIcon } from '@/components/ui/MindmakerIcon';
import { X } from 'lucide-react';

interface ToolDrawerHeaderProps {
  title: string;
  subtitle?: string;
  onClose?: () => void;
  showIcon?: boolean;
}

/**
 * Shared header component for tool drawers (mobile wizard layout).
 * Ensures consistent styling across all tools:
 * - Builder Profile Quiz
 * - AI Decision Helper
 * - Friction Map Builder
 * - Portfolio Builder
 * 
 * The close button uses:
 * - variant="outline" (NOT ghost)
 * - size="sm" (NOT icon)
 * - X icon + "Close" text label (NOT icon-only)
 * 
 * This pattern was established to avoid "old website" style X buttons.
 */
export const ToolDrawerHeader = ({
  title,
  subtitle = 'Powered by Mindmaker',
  onClose,
  showIcon = true,
}: ToolDrawerHeaderProps) => {
  return (
    <div className="flex items-center justify-between p-4 border-b shrink-0">
      <div className="flex items-center gap-3">
        {showIcon && <MindmakerIcon size={24} />}
        <div>
          <h2 className="font-semibold text-base">{title}</h2>
          {subtitle && (
            <p className="text-xs text-muted-foreground">{subtitle}</p>
          )}
        </div>
      </div>
      {onClose && (
        <Button 
          variant="outline" 
          size="sm" 
          onClick={onClose}
          className="min-w-[44px] min-h-[44px] touch-target gap-1.5 px-3"
          aria-label={`Close ${title}`}
        >
          <X className="h-4 w-4" />
          <span className="text-xs font-medium">Close</span>
        </Button>
      )}
    </div>
  );
};

export default ToolDrawerHeader;

