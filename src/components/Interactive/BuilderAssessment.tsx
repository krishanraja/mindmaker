import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useAssessment } from '@/hooks/useAssessment';
import { ArrowRight, RotateCcw, Award, CheckCircle2, Loader2, X } from 'lucide-react';
import { useSessionData } from '@/contexts/SessionDataContext';
import { useEffect, useState } from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import { motion, AnimatePresence } from 'framer-motion';
import { MindmakerIcon } from '@/components/ui/MindmakerIcon';

interface BuilderAssessmentProps {
  compact?: boolean;
  onClose?: () => void;
}

export const BuilderAssessment = ({ compact = false, onClose }: BuilderAssessmentProps) => {
  const { currentStep, questions, answers, profile, isGenerating, answerQuestion, nextQuestion, reset } = useAssessment();
  const { setAssessment } = useSessionData();
  const isMobile = useIsMobile();
  const [resultTab, setResultTab] = useState<'profile' | 'strengths' | 'next'>('profile');

  useEffect(() => {
    if (profile) {
      setAssessment({
        answers,
        profileType: profile.type,
        profileDescription: profile.description,
        recommendedProduct: profile.recommendedProduct
      });
    }
  }, [profile, answers, setAssessment]);

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

  const currentQuestion = questions[currentStep];
  const progress = ((currentStep + 1) / questions.length) * 100;

  // Mobile full-screen wizard layout
  if (isMobile && !compact) {
    return (
      <div className="flex flex-col h-full min-h-0 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center gap-3">
            <MindmakerIcon size={24} />
            <div>
              <h2 className="font-semibold">Builder Profile Quiz</h2>
              <p className="text-xs text-muted-foreground">Powered by Mindmaker</p>
            </div>
          </div>
          {onClose && (
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-5 w-5" />
            </Button>
          )}
        </div>

        {/* Progress */}
        {!profile && !isGenerating && (
          <div className="px-4 py-3 border-b bg-muted/30">
            <div className="flex justify-between text-xs text-muted-foreground mb-1">
              <span>Question {currentStep + 1} of {questions.length}</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <div className="h-1.5 bg-muted rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-mint rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
          </div>
        )}

        {/* Content */}
        <div className="flex-1 flex flex-col overflow-hidden min-h-0">
          <AnimatePresence mode="wait">
            {isGenerating ? (
              <motion.div
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex-1 flex flex-col items-center justify-center p-8 text-center"
              >
                <div className="relative mb-6">
                  <MindmakerIcon size={64} animated />
                </div>
                <h3 className="text-xl font-bold mb-2">Analyzing Your Responses</h3>
                <p className="text-muted-foreground text-sm max-w-sm">
                  Creating your personalized AI Builder Profile...
                </p>
              </motion.div>
            ) : profile ? (
              <motion.div
                key="results"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex-1 flex flex-col"
              >
                {/* Tab Navigation */}
                <div className="flex border-b">
                  {(['profile', 'strengths', 'next'] as const).map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setResultTab(tab)}
                      className={`flex-1 py-3 text-sm font-medium transition-colors ${
                        resultTab === tab
                          ? 'text-mint border-b-2 border-mint'
                          : 'text-muted-foreground'
                      }`}
                    >
                      {tab === 'profile' ? 'Profile' : tab === 'strengths' ? 'Strengths' : 'Next Steps'}
                    </button>
                  ))}
                </div>

                {/* Tab Content */}
                <div className="flex-1 overflow-y-auto p-4">
                  <AnimatePresence mode="wait">
                    {resultTab === 'profile' && (
                      <motion.div
                        key="profile-tab"
                        initial={{ opacity: 0, x: 10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -10 }}
                        className="text-center py-4"
                      >
                        <Award className="h-10 w-10 text-mint mx-auto mb-4" />
                        <div className="inline-block px-5 py-2.5 bg-mint text-ink rounded-full font-bold text-lg mb-4">
                          {profile.type}
                        </div>
                        <p className="text-muted-foreground">{profile.description}</p>
                        {profile.frameworkUsed && (
                          <p className="text-xs text-mint-dark mt-4 flex items-center justify-center gap-1.5">
                            <MindmakerIcon size={14} />
                            Analyzed using {profile.frameworkUsed}
                          </p>
                        )}
                      </motion.div>
                    )}
                    {resultTab === 'strengths' && (
                      <motion.div
                        key="strengths-tab"
                        initial={{ opacity: 0, x: 10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -10 }}
                        className="space-y-3"
                      >
                        {profile.strengths.map((strength, i) => (
                          <div key={i} className="p-4 rounded-lg bg-success/10 border border-success/20">
                            <div className="flex items-center gap-3">
                              <CheckCircle2 className="h-5 w-5 text-success shrink-0" />
                              <span className="font-medium">{strength}</span>
                            </div>
                          </div>
                        ))}
                      </motion.div>
                    )}
                    {resultTab === 'next' && (
                      <motion.div
                        key="next-tab"
                        initial={{ opacity: 0, x: 10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -10 }}
                        className="space-y-3"
                      >
                        {profile.nextSteps.map((step, i) => (
                          <div key={i} className="flex items-start gap-3 p-4 rounded-lg bg-muted/50">
                            <div className="w-6 h-6 rounded-full bg-mint/20 text-mint-dark flex items-center justify-center text-xs font-bold shrink-0">
                              {i + 1}
                            </div>
                            <span className="text-sm">{step}</span>
                          </div>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Fixed CTA */}
                <div className="p-4 border-t bg-ink text-white">
                  <div className="text-xs font-bold text-mint text-center mb-2">RECOMMENDED FOR YOU</div>
                  <div className="text-lg font-bold text-center mb-3">{profile.recommendedProduct}</div>
                  <Button
                    size="lg"
                    className="w-full bg-mint text-ink hover:bg-mint/90 font-bold"
                    onClick={() => window.location.href = profile.productLink}
                  >
                    Learn More
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key={`question-${currentStep}`}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
                className="flex-1 flex flex-col p-4"
              >
                <h3 className="text-xl font-bold mb-6">{currentQuestion.question}</h3>
                <div className="space-y-3 flex-1">
                  {currentQuestion.options.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => {
                        answerQuestion(currentQuestion.id, option.value);
                        setTimeout(() => nextQuestion(), 300);
                      }}
                      className={`w-full p-4 rounded-xl border-2 text-left transition-all ${
                        answers[currentQuestion.id] === option.value
                          ? 'border-mint bg-mint/10 font-semibold'
                          : 'border-border hover:border-mint/50 hover:bg-mint/5'
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    );
  }

  // Desktop layout (original with minor improvements)
  if (isGenerating) {
    return (
      <Card className="p-6 sm:p-8 bg-gradient-to-br from-mint/10 to-ink/10 border-2 border-mint/50">
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <div className="relative mb-6">
            <MindmakerIcon size={64} animated />
          </div>
          <h3 className="text-xl font-bold mb-2">Analyzing Your Responses</h3>
          <p className="text-muted-foreground text-sm max-w-sm">
            Applying Mindmaker's Five Cognitive Frameworks to create your personalized AI Builder Profile...
          </p>
        </div>
      </Card>
    );
  }

  if (profile) {
    return (
      <div className="flex flex-col h-full max-h-[70vh] min-h-0 bg-gradient-to-br from-mint/10 to-ink/10 border-2 border-mint rounded-lg animate-in fade-in duration-500">
        {/* Header - Fixed */}
        <div className="shrink-0 flex items-center justify-between p-6 pb-4 border-b">
          <h3 className="text-2xl font-bold flex items-center gap-2">
            <Award className="h-6 w-6 text-mint" />
            Your Builder Profile
          </h3>
          <Button variant="ghost" size="sm" onClick={reset}>
            <RotateCcw className="h-4 w-4" />
          </Button>
        </div>

        {/* Scrollable Content Area */}
        <div className="flex-1 overflow-y-auto min-h-0 p-6 pr-4">
          <div className="space-y-6">
            <div className="text-center py-6">
              <div className="inline-block px-6 py-3 bg-mint text-ink rounded-full font-bold text-xl mb-4">
                {profile.type}
              </div>
              <p className="text-lg text-muted-foreground">{profile.description}</p>
              {profile.frameworkUsed && (
                <p className="text-xs text-mint-dark mt-3 flex items-center justify-center gap-1">
                  <MindmakerIcon size={12} />
                  Analyzed using {profile.frameworkUsed}
                </p>
              )}
            </div>

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
          </div>
        </div>

        {/* Fixed CTA at Bottom */}
        <div className="shrink-0 p-6 pt-4 border-t bg-ink text-white">
          <div className="text-xs font-bold text-mint mb-2 text-center">RECOMMENDED FOR YOU</div>
          <div className="text-xl font-bold mb-4 text-center">{profile.recommendedProduct}</div>
          <Button
            size="lg"
            className="w-full bg-mint text-ink hover:bg-mint/90 font-bold"
            onClick={() => window.location.href = profile.productLink}
          >
            Learn More
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        </div>
      </div>
    );
  }

  return (
    <Card className="p-6 sm:p-8 bg-background/50 backdrop-blur-sm border-2 border-mint/30 hover:border-mint transition-colors">
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
