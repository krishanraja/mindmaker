import * as React from "react";
import { createContext, useContext, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ChevronLeft, X } from "lucide-react";

// ============================================================================
// Wizard Context
// ============================================================================

interface WizardContextType {
  currentStep: number;
  totalSteps: number;
  goToStep: (step: number) => void;
  nextStep: () => void;
  prevStep: () => void;
  canGoNext: boolean;
  canGoPrev: boolean;
  setCanGoNext: (can: boolean) => void;
}

const WizardContext = createContext<WizardContextType | null>(null);

export const useWizard = () => {
  const context = useContext(WizardContext);
  if (!context) {
    throw new Error("useWizard must be used within a WizardProvider");
  }
  return context;
};

// ============================================================================
// Wizard Provider
// ============================================================================

interface WizardProviderProps {
  children: React.ReactNode;
  totalSteps: number;
  initialStep?: number;
  onStepChange?: (step: number) => void;
  onComplete?: () => void;
}

export const WizardProvider = ({
  children,
  totalSteps,
  initialStep = 0,
  onStepChange,
  onComplete,
}: WizardProviderProps) => {
  const [currentStep, setCurrentStep] = useState(initialStep);
  const [canGoNext, setCanGoNext] = useState(true);

  const goToStep = useCallback(
    (step: number) => {
      if (step >= 0 && step < totalSteps) {
        setCurrentStep(step);
        onStepChange?.(step);
      } else if (step >= totalSteps) {
        onComplete?.();
      }
    },
    [totalSteps, onStepChange, onComplete]
  );

  const nextStep = useCallback(() => {
    if (currentStep < totalSteps - 1) {
      goToStep(currentStep + 1);
    } else {
      onComplete?.();
    }
  }, [currentStep, totalSteps, goToStep, onComplete]);

  const prevStep = useCallback(() => {
    if (currentStep > 0) {
      goToStep(currentStep - 1);
    }
  }, [currentStep, goToStep]);

  return (
    <WizardContext.Provider
      value={{
        currentStep,
        totalSteps,
        goToStep,
        nextStep,
        prevStep,
        canGoNext,
        canGoPrev: currentStep > 0,
        setCanGoNext,
      }}
    >
      {children}
    </WizardContext.Provider>
  );
};

// ============================================================================
// Wizard Container (Full-screen mobile layout)
// ============================================================================

interface WizardContainerProps {
  children: React.ReactNode;
  className?: string;
  onClose?: () => void;
  title?: string;
  showProgress?: boolean;
}

export const WizardContainer = ({
  children,
  className,
  onClose,
  title,
  showProgress = true,
}: WizardContainerProps) => {
  const { currentStep, totalSteps } = useWizard();

  return (
    <div
      className={cn(
        "fixed inset-0 z-50 flex flex-col bg-background",
        "sm:relative sm:inset-auto sm:z-auto sm:bg-transparent",
        className
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b sm:border-0">
        <div className="flex items-center gap-3">
          {currentStep > 0 && (
            <WizardBackButton />
          )}
          {title && (
            <h2 className="text-lg font-semibold truncate">{title}</h2>
          )}
        </div>
        {onClose && (
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="shrink-0"
          >
            <X className="h-5 w-5" />
            <span className="sr-only">Close</span>
          </Button>
        )}
      </div>

      {/* Progress */}
      {showProgress && totalSteps > 1 && (
        <WizardProgress className="px-4 py-2" />
      )}

      {/* Content */}
      <div className="flex-1 overflow-hidden">
        {children}
      </div>
    </div>
  );
};

// ============================================================================
// Wizard Progress Indicator
// ============================================================================

interface WizardProgressProps {
  className?: string;
  variant?: "dots" | "bar" | "steps";
}

export const WizardProgress = ({
  className,
  variant = "bar",
}: WizardProgressProps) => {
  const { currentStep, totalSteps } = useWizard();
  const progress = ((currentStep + 1) / totalSteps) * 100;

  if (variant === "dots") {
    return (
      <div className={cn("flex items-center justify-center gap-2", className)}>
        {Array.from({ length: totalSteps }).map((_, i) => (
          <button
            key={i}
            className={cn(
              "h-2 rounded-full transition-all duration-300",
              i === currentStep
                ? "w-8 bg-mint"
                : i < currentStep
                ? "w-2 bg-mint/60"
                : "w-2 bg-muted-foreground/30"
            )}
            aria-label={`Step ${i + 1}`}
          />
        ))}
      </div>
    );
  }

  if (variant === "steps") {
    return (
      <div className={cn("flex items-center justify-between", className)}>
        <span className="text-sm text-muted-foreground">
          Step {currentStep + 1} of {totalSteps}
        </span>
        <span className="text-sm font-medium">{Math.round(progress)}%</span>
      </div>
    );
  }

  // Default: bar
  return (
    <div className={cn("space-y-1", className)}>
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span>Step {currentStep + 1} of {totalSteps}</span>
        <span>{Math.round(progress)}%</span>
      </div>
      <div className="h-1.5 bg-muted rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-mint rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.3, ease: "easeOut" }}
        />
      </div>
    </div>
  );
};

// ============================================================================
// Wizard Step
// ============================================================================

interface WizardStepProps {
  children: React.ReactNode;
  step: number;
  className?: string;
}

export const WizardStep = ({ children, step, className }: WizardStepProps) => {
  const { currentStep } = useWizard();

  return (
    <AnimatePresence mode="wait">
      {currentStep === step && (
        <motion.div
          key={step}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.2 }}
          className={cn(
            "h-full flex flex-col overflow-y-auto overscroll-contain p-4",
            className
          )}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// ============================================================================
// Wizard Navigation Buttons
// ============================================================================

interface WizardBackButtonProps {
  className?: string;
  label?: string;
}

export const WizardBackButton = ({ className, label }: WizardBackButtonProps) => {
  const { prevStep, canGoPrev } = useWizard();

  if (!canGoPrev) return null;

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={prevStep}
      className={cn("gap-1", className)}
    >
      <ChevronLeft className="h-4 w-4" />
      {label || "Back"}
    </Button>
  );
};

interface WizardNextButtonProps {
  className?: string;
  label?: string;
  onClick?: () => void;
  disabled?: boolean;
}

export const WizardNextButton = ({
  className,
  label,
  onClick,
  disabled,
}: WizardNextButtonProps) => {
  const { nextStep, canGoNext, currentStep, totalSteps } = useWizard();
  const isLastStep = currentStep === totalSteps - 1;

  const handleClick = () => {
    if (onClick) {
      onClick();
    } else {
      nextStep();
    }
  };

  return (
    <Button
      onClick={handleClick}
      disabled={disabled || !canGoNext}
      className={cn("w-full bg-mint text-ink hover:bg-mint/90 font-semibold", className)}
    >
      {label || (isLastStep ? "Complete" : "Continue")}
    </Button>
  );
};

// ============================================================================
// Wizard Footer (Fixed at bottom on mobile)
// ============================================================================

interface WizardFooterProps {
  children: React.ReactNode;
  className?: string;
}

export const WizardFooter = ({ children, className }: WizardFooterProps) => {
  return (
    <div
      className={cn(
        "p-4 border-t bg-background mt-auto",
        "sm:border-0 sm:bg-transparent",
        className
      )}
    >
      {children}
    </div>
  );
};

// ============================================================================
// Wizard Content Section (For organizing content within a step)
// ============================================================================

interface WizardContentProps {
  children: React.ReactNode;
  className?: string;
  centered?: boolean;
}

export const WizardContent = ({
  children,
  className,
  centered = false,
}: WizardContentProps) => {
  return (
    <div
      className={cn(
        "flex-1",
        centered && "flex flex-col items-center justify-center text-center",
        className
      )}
    >
      {children}
    </div>
  );
};

// ============================================================================
// Wizard Header (For step titles/descriptions)
// ============================================================================

interface WizardHeaderProps {
  title: string;
  description?: string;
  className?: string;
}

export const WizardHeader = ({
  title,
  description,
  className,
}: WizardHeaderProps) => {
  return (
    <div className={cn("mb-6", className)}>
      <h3 className="text-xl font-bold mb-2">{title}</h3>
      {description && (
        <p className="text-sm text-muted-foreground">{description}</p>
      )}
    </div>
  );
};


