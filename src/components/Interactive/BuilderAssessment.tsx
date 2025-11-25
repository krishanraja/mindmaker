import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useAssessment } from '@/hooks/useAssessment';
import { ArrowRight, RotateCcw, Award, CheckCircle2 } from 'lucide-react';

export const BuilderAssessment = () => {
  const { currentStep, questions, answers, profile, answerQuestion, nextQuestion, reset } = useAssessment();

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
                  <div className="w-6 h-6 rounded-full bg-mint/20 text-mint flex items-center justify-center text-xs font-bold flex-shrink-0">
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
              onClick={() => answerQuestion(currentQuestion.id, option.value)}
              className={`w-full p-4 rounded-lg border-2 text-left transition-all ${
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

      {/* Next Button */}
      <Button
        onClick={nextQuestion}
        disabled={!hasAnswered}
        size="lg"
        className="w-full bg-mint text-ink hover:bg-mint/90 font-bold disabled:opacity-50"
      >
        {currentStep === questions.length - 1 ? 'See My Profile' : 'Next Question'}
        <ArrowRight className="h-4 w-4 ml-2" />
      </Button>
    </Card>
  );
};
