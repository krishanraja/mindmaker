import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useAssessment } from '@/hooks/useAssessment';
import { ArrowRight, RotateCcw, Award, CheckCircle2 } from 'lucide-react';

interface BuilderAssessmentProps {
  compact?: boolean;
}

export const BuilderAssessment = ({ compact = false }: BuilderAssessmentProps) => {
  const { currentStep, questions, answers, profile, answerQuestion, nextQuestion, reset } = useAssessment();

  // Compact mode - Results view
  if (compact && profile) {
    return (
      <div className="space-y-4">
        <div className="text-center p-4 bg-mint/10 rounded-lg border border-mint/20">
          <div className="text-sm font-bold text-mint-dark mb-2">{profile.type}</div>
          <p className="text-xs text-muted-foreground line-clamp-2">{profile.description}</p>
        </div>
        <div className="space-y-2">
          <div className="text-xs font-bold text-muted-foreground">NEXT STEPS</div>
          {profile.nextSteps.slice(0, 2).map((step, i) => (
            <div key={i} className="flex items-start gap-2 text-xs">
              <div className="w-4 h-4 rounded-full bg-mint/20 text-mint-dark flex items-center justify-center text-[10px] font-bold flex-shrink-0 mt-0.5">
                {i + 1}
              </div>
              <div className="line-clamp-2">{step}</div>
            </div>
          ))}
        </div>
        <Button
          size="sm"
          variant="outline"
          className="w-full"
          onClick={reset}
        >
          <RotateCcw className="h-3 w-3 mr-2" />
          Retake
        </Button>
      </div>
    );
  }

  // Compact mode - Start button
  if (compact && !profile) {
    const hasStarted = Object.keys(answers).length > 0;
    
    if (!hasStarted) {
      return (
        <Button
          size="sm"
          className="w-full bg-mint text-ink hover:bg-mint/90 font-bold"
          onClick={() => {
            // This will trigger the quiz to start
            const firstQuestion = questions[0];
            // Just mark as started by scrolling into the full quiz state
          }}
        >
          Start Assessment
          <ArrowRight className="h-3 w-3 ml-2" />
        </Button>
      );
    }

    // Show compact question view
    const currentQuestion = questions[currentStep];
    const progress = ((currentStep + 1) / questions.length) * 100;
    
    return (
      <div className="space-y-3">
        <div className="h-1 bg-muted rounded-full overflow-hidden">
          <div 
            className="h-full bg-mint transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div>
          <p className="text-xs font-semibold mb-3">{currentQuestion.question}</p>
          <div className="space-y-2">
            {currentQuestion.options.map((option) => (
              <button
                key={option.value}
                onClick={() => {
                  answerQuestion(currentQuestion.id, option.value);
                  setTimeout(() => nextQuestion(), 300);
                }}
                className={`w-full p-2 rounded text-xs text-left transition-all border ${
                  answers[currentQuestion.id] === option.value
                    ? 'border-mint bg-mint/10 font-semibold'
                    : 'border-border hover:border-mint/50 hover:bg-mint/5'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Full mode - Results view
  if (profile) {
    return (
      <Card className="p-6 sm:p-8 bg-gradient-to-br from-mint/10 to-ink/10 border-2 border-mint animate-in fade-in duration-500">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-2xl font-bold flex items-center gap-2">
            <Award className="h-6 w-6 text-mint" />
            Your Builder Profile
          </h3>
          <Button variant="ghost" size="sm" onClick={reset}>
            <RotateCcw className="h-4 w-4" />
          </Button>
        </div>

        <div className="space-y-6">
          {/* Profile Type */}
          <div className="text-center py-6">
            <div className="inline-block px-6 py-3 bg-mint text-ink rounded-full font-bold text-xl mb-4">
              {profile.type}
            </div>
            <p className="text-lg text-muted-foreground">{profile.description}</p>
          </div>

          {/* Strengths */}
          <div>
            <div className="text-xs font-bold text-muted-foreground mb-3">YOUR STRENGTHS</div>
            <div className="grid sm:grid-cols-3 gap-3">
              {profile.strengths.map((strength, i) => (
                <div key={i} className="p-3 rounded-lg bg-success/10 border border-success/20 text-center">
                  <CheckCircle2 className="h-4 w-4 text-success mx-auto mb-1" />
                  <div className="text-sm font-medium">{strength}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Next Steps */}
          <div>
            <div className="text-xs font-bold text-muted-foreground mb-3">YOUR NEXT STEPS</div>
            <div className="space-y-3">
              {profile.nextSteps.map((step, i) => (
                <div key={i} className="flex items-start gap-3 p-3 rounded-lg bg-background">
                  <div className="w-6 h-6 rounded-full bg-mint/20 text-mint-dark flex items-center justify-center text-xs font-bold flex-shrink-0">
                    {i + 1}
                  </div>
                  <div className="text-sm pt-0.5">{step}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Recommended Product */}
          <div className="p-6 rounded-lg bg-ink text-white text-center">
            <div className="text-xs font-bold text-mint mb-2">RECOMMENDED FOR YOU</div>
            <div className="text-xl font-bold mb-4">{profile.recommendedProduct}</div>
            <Button
              size="lg"
              className="bg-mint text-ink hover:bg-mint/90 font-bold"
              onClick={() => window.location.href = profile.productLink}
            >
              Learn More
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </div>
        </div>
      </Card>
    );
  }

  const currentQuestion = questions[currentStep];
  const hasAnswered = !!answers[currentQuestion.id];
  const progress = ((currentStep + 1) / questions.length) * 100;

  return (
    <Card className="p-6 sm:p-8 bg-background/50 backdrop-blur-sm border-2 border-mint/30 hover:border-mint transition-colors">
      {/* Progress Bar */}
      <div className="mb-6">
        <div className="flex justify-between text-xs text-muted-foreground mb-2">
          <span>Question {currentStep + 1} of {questions.length}</span>
          <span>{Math.round(progress)}%</span>
        </div>
        <div className="h-2 bg-muted rounded-full overflow-hidden">
          <div 
            className="h-full bg-mint transition-all duration-300 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Question */}
      <div className="mb-6">
        <h3 className="text-xl font-bold mb-4">{currentQuestion.question}</h3>
        <div className="space-y-3">
          {currentQuestion.options.map((option) => (
            <button
              key={option.value}
              onClick={() => {
                answerQuestion(currentQuestion.id, option.value);
                setTimeout(() => nextQuestion(), 300);
              }}
              className={`w-full p-4 rounded-lg border-2 text-left transition-all text-foreground ${
                answers[currentQuestion.id] === option.value
                  ? 'border-mint bg-mint/10 font-semibold'
                  : 'border-border hover:border-mint/50 hover:bg-mint/5'
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>
    </Card>
  );
};
