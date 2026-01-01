import { motion, AnimatePresence } from 'framer-motion';
import { Mic, MicOff, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface VoiceInputButtonProps {
  isListening: boolean;
  isSupported: boolean;
  error?: string | null;
  onStart: () => void;
  onStop: () => void;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'default' | 'mobile-primary';
  className?: string;
  showLabel?: boolean;
  label?: string;
}

const sizeClasses = {
  sm: 'w-10 h-10',
  md: 'w-12 h-12',
  lg: 'w-16 h-16',
  xl: 'w-20 h-20',
};

const iconSizes = {
  sm: 'w-4 h-4',
  md: 'w-5 h-5',
  lg: 'w-7 h-7',
  xl: 'w-9 h-9',
};

export const VoiceInputButton = ({
  isListening,
  isSupported,
  error,
  onStart,
  onStop,
  size = 'md',
  variant = 'default',
  className,
  showLabel = false,
  label,
}: VoiceInputButtonProps) => {
  const handleClick = () => {
    if (!isSupported) return;
    if (isListening) {
      onStop();
    } else {
      onStart();
    }
  };

  if (!isSupported) {
    return (
      <div className={cn('flex items-center gap-2 text-muted-foreground', className)}>
        <div className={cn(
          'rounded-full bg-muted flex items-center justify-center',
          sizeClasses[size]
        )}>
          <MicOff className={cn(iconSizes[size], 'text-muted-foreground')} />
        </div>
        {showLabel && (
          <span className="text-xs">Voice not supported</span>
        )}
      </div>
    );
  }

  const isMobilePrimary = variant === 'mobile-primary';

  return (
    <div className={cn('flex flex-col items-center gap-2', className)}>
      <motion.button
        onClick={handleClick}
        className={cn(
          'relative rounded-full flex items-center justify-center transition-all duration-300 touch-target',
          'focus:outline-none focus-visible:ring-2 focus-visible:ring-mint focus-visible:ring-offset-2',
          sizeClasses[size],
          isMobilePrimary
            ? 'bg-gradient-to-br from-mint to-mint/80 text-ink shadow-lg'
            : isListening
              ? 'bg-mint text-ink'
              : 'bg-ink/10 dark:bg-white/10 text-ink dark:text-white hover:bg-mint/20 dark:hover:bg-mint/30',
          error && 'border-2 border-destructive'
        )}
        whileTap={{ scale: 0.95 }}
        aria-label={isListening ? 'Stop listening' : 'Start voice input'}
        aria-pressed={isListening}
      >
        {/* Pulse rings when listening */}
        <AnimatePresence>
          {isListening && (
            <>
              <motion.span
                className="absolute inset-0 rounded-full bg-mint"
                initial={{ scale: 1, opacity: 0.5 }}
                animate={{ scale: 1.5, opacity: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1, repeat: Infinity }}
              />
              <motion.span
                className="absolute inset-0 rounded-full bg-mint"
                initial={{ scale: 1, opacity: 0.5 }}
                animate={{ scale: 1.5, opacity: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1, repeat: Infinity, delay: 0.5 }}
              />
            </>
          )}
        </AnimatePresence>

        {/* Icon */}
        <motion.div
          animate={isListening ? { scale: [1, 1.1, 1] } : { scale: 1 }}
          transition={isListening ? { duration: 0.5, repeat: Infinity } : {}}
          className="relative z-10"
        >
          {error ? (
            <AlertCircle className={cn(iconSizes[size], 'text-destructive')} />
          ) : (
            <Mic className={iconSizes[size]} />
          )}
        </motion.div>

        {/* Audio wave visualizer when listening */}
        <AnimatePresence>
          {isListening && !error && (
            <motion.div
              className="absolute bottom-1 left-1/2 -translate-x-1/2 flex items-end gap-0.5"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {[0, 1, 2, 3, 4].map((i) => (
                <motion.span
                  key={i}
                  className="w-0.5 bg-ink rounded-full"
                  animate={{
                    height: ['4px', '12px', '4px'],
                  }}
                  transition={{
                    duration: 0.5,
                    repeat: Infinity,
                    delay: i * 0.1,
                    ease: 'easeInOut',
                  }}
                />
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>

      {/* Label */}
      {showLabel && (
        <span className={cn(
          'text-xs font-medium transition-colors',
          isListening ? 'text-mint' : 'text-muted-foreground'
        )}>
          {label || (isListening ? 'Listening...' : 'Tap to speak')}
        </span>
      )}

      {/* Error message */}
      <AnimatePresence>
        {error && (
          <motion.p
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="text-xs text-destructive text-center max-w-[200px]"
          >
            {error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
};

// Mobile-first voice prompt component
interface VoiceFirstPromptProps {
  isListening: boolean;
  isSupported: boolean;
  error?: string | null;
  onStart: () => void;
  onStop: () => void;
  onSwitchToText: () => void;
  placeholder?: string;
  className?: string;
}

export const VoiceFirstPrompt = ({
  isListening,
  isSupported,
  error,
  onStart,
  onStop,
  onSwitchToText,
  placeholder = 'Describe your question...',
  className,
}: VoiceFirstPromptProps) => {
  if (!isSupported) {
    return null;
  }

  return (
    <motion.div
      className={cn(
        'flex flex-col items-center justify-center py-8 px-4 text-center',
        className
      )}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <VoiceInputButton
        isListening={isListening}
        isSupported={isSupported}
        error={error}
        onStart={onStart}
        onStop={onStop}
        size="xl"
        variant="mobile-primary"
        showLabel
        label={isListening ? 'Listening...' : 'Tap to speak'}
      />

      <p className="text-sm text-muted-foreground mt-4 mb-2 max-w-xs">
        {placeholder}
      </p>

      <button
        onClick={onSwitchToText}
        className="text-xs text-mint-dark underline underline-offset-2 hover:text-mint transition-colors"
      >
        or type your question
      </button>
    </motion.div>
  );
};

// Inline voice button for text inputs
interface InlineVoiceButtonProps {
  isListening: boolean;
  isSupported: boolean;
  error?: string | null;
  onStart: () => void;
  onStop: () => void;
  className?: string;
}

export const InlineVoiceButton = ({
  isListening,
  isSupported,
  error,
  onStart,
  onStop,
  className,
}: InlineVoiceButtonProps) => {
  if (!isSupported) {
    return null;
  }

  return (
    <VoiceInputButton
      isListening={isListening}
      isSupported={isSupported}
      error={error}
      onStart={onStart}
      onStop={onStop}
      size="sm"
      className={className}
    />
  );
};

export default VoiceInputButton;










