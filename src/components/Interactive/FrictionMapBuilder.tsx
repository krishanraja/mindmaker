import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { useFrictionMap } from '@/hooks/useFrictionMap';
import { ArrowRight, Download, Clock } from 'lucide-react';
import { useSessionData } from '@/contexts/SessionDataContext';
import { generateFrictionMapPDF } from '@/utils/pdfGenerator';
import { useIsMobile } from '@/hooks/use-mobile';
import { motion, AnimatePresence } from 'framer-motion';
import { MindmakerIcon, MindmakerBadge } from '@/components/ui/MindmakerIcon';
import { ToolDrawerHeader } from '@/components/ui/tool-drawer-header';
import { openCalendlyPopup } from '@/utils/calendly';
import { useVoiceInput } from '@/hooks/useVoiceInput';
import { VoiceInputButton, InlineVoiceButton } from '@/components/ui/VoiceInputButton';

interface FrictionMapBuilderProps {
  compact?: boolean;
  onClose?: () => void;
}

export const FrictionMapBuilder = ({ compact = false, onClose }: FrictionMapBuilderProps) => {
  const [problem, setProblem] = useState('');
  const [showTextInput, setShowTextInput] = useState(false);
  const { frictionMap, isGenerating, error, generateFrictionMap, clearFrictionMap } = useFrictionMap();
  const { setFrictionMap } = useSessionData();
  const isMobile = useIsMobile();
  const [resultTab, setResultTab] = useState<'overview' | 'tools' | 'prompts'>('overview');

  const {
    isListening,
    transcript,
    interimTranscript,
    isSupported: voiceSupported,
    error: voiceError,
    startListening,
    stopListening,
    resetTranscript,
  } = useVoiceInput({
    silenceTimeout: 2500,
    onTranscript: (text, isFinal) => {
      if (isFinal) {
        setProblem(prev => prev + text);
      }
    },
  });

  useEffect(() => {
    if (frictionMap) {
      setFrictionMap(frictionMap);
    }
  }, [frictionMap, setFrictionMap]);

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (problem.trim() && problem.trim().length >= 10) {
      resetTranscript();
      await generateFrictionMap(problem.trim());
    }
  };

  const handleDownload = () => {
    if (!frictionMap) return;
    generateFrictionMapPDF(frictionMap);
  };

  const handleVoiceStart = () => {
    resetTranscript();
    startListening();
  };

  const handleReset = () => {
    clearFrictionMap();
    setProblem('');
    setShowTextInput(false);
    resetTranscript();
  };

  // Compact mode - Results view
  if (compact && frictionMap) {
    return (
      <div className="space-y-4">
        <div>
          <div className="text-xs font-bold text-muted-foreground mb-2">TIME SAVED</div>
          <div className="flex items-center justify-center gap-4 p-3 bg-mint/10 rounded-lg">
            <div className="text-center">
              <div className="text-lg font-bold">{frictionMap.timeSaved}</div>
              <div className="text-[10px] text-muted-foreground">estimated</div>
            </div>
          </div>
        </div>
        <div>
          <div className="text-xs font-bold text-muted-foreground mb-2">TOP TOOLS</div>
          <div className="space-y-1">
            {frictionMap.toolRecommendations.slice(0, 2).map((tool, i) => (
              <div key={i} className="flex items-start gap-2 text-xs">
                <div className="w-4 h-4 rounded-full bg-mint/20 text-mint-dark flex items-center justify-center text-[10px] font-bold flex-shrink-0 mt-0.5">
                  {i + 1}
                </div>
                <div className="line-clamp-2">{tool.name}</div>
              </div>
            ))}
          </div>
        </div>
        <Button
          size="sm"
          variant="outline"
          className="w-full"
          onClick={handleReset}
        >
          Build Another
        </Button>
      </div>
    );
  }

  // Compact mode - Input form
  if (compact) {
    return (
      <form onSubmit={handleSubmit} className="space-y-3">
        <div className="relative">
          <Input
            value={problem + (isListening ? interimTranscript : '')}
            onChange={(e) => setProblem(e.target.value)}
            placeholder="e.g., Weekly reports take 5 hours"
            className="text-sm pr-12"
            disabled={isGenerating}
          />
          {voiceSupported && (
            <div className="absolute right-2 top-1/2 -translate-y-1/2">
              <InlineVoiceButton
                isListening={isListening}
                isSupported={voiceSupported}
                error={voiceError}
                onStart={handleVoiceStart}
                onStop={stopListening}
              />
            </div>
          )}
        </div>
        {error && <p className="text-xs text-destructive">{error}</p>}
        <Button
          type="submit"
          size="sm"
          className="w-full bg-mint text-ink hover:bg-mint/90 font-bold"
          disabled={isGenerating || problem.trim().length < 10}
        >
          {isGenerating ? (
            <>
              <MindmakerIcon size={12} animated className="mr-2" />
              Generating...
            </>
          ) : (
            'Generate Map'
          )}
        </Button>
      </form>
    );
  }

  // Mobile full-screen wizard layout
  if (isMobile) {
    return (
      <div className="flex flex-col flex-1 min-h-0 h-full overflow-hidden">
        <ToolDrawerHeader 
          title="Friction Map Builder"
          onClose={onClose}
        />

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
                <MindmakerIcon size={48} animated />
                <h3 className="text-lg font-bold mt-4 mb-2">Analyzing Your Challenge</h3>
                <p className="text-sm text-muted-foreground">
                  Building your personalized AI friction map...
                </p>
              </motion.div>
            ) : frictionMap ? (
              <motion.div
                key="results"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex-1 flex flex-col"
              >
                {/* Tab Navigation */}
                <div className="flex border-b">
                  {(['overview', 'tools', 'prompts'] as const).map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setResultTab(tab)}
                      className={`flex-1 py-3 text-sm font-medium transition-colors ${
                        resultTab === tab
                          ? 'text-mint border-b-2 border-mint'
                          : 'text-muted-foreground'
                      }`}
                    >
                      {tab === 'overview' ? 'Overview' : tab === 'tools' ? 'Tools' : 'Prompts'}
                    </button>
                  ))}
                </div>

                {/* Tab Content */}
                <div className="flex-1 overflow-y-auto p-4 min-h-0">
                  <AnimatePresence mode="wait">
                    {resultTab === 'overview' && (
                      <motion.div
                        key="overview-tab"
                        initial={{ opacity: 0, x: 10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -10 }}
                        className="space-y-4"
                      >
                        <MindmakerBadge text="Analyzed using First-Principles Framework" />
                        
                        <div>
                          <div className="text-xs font-bold text-muted-foreground mb-2">YOUR CHALLENGE</div>
                          <p className="font-medium">{frictionMap.problem}</p>
                        </div>

                        <div className="flex items-center justify-center p-4 bg-mint/10 rounded-lg">
                          <Clock className="h-5 w-5 text-mint mr-3" />
                          <div>
                            <div className="text-lg font-bold">{frictionMap.timeSaved}</div>
                            <div className="text-xs text-muted-foreground">Estimated savings</div>
                          </div>
                        </div>

                        <div className="p-4 rounded-lg bg-muted/50">
                          <div className="text-xs font-bold text-muted-foreground mb-2">CURRENT STATE</div>
                          <p className="text-sm">{frictionMap.currentState}</p>
                        </div>

                        <div className="p-4 rounded-lg bg-mint/10 border border-mint/20">
                          <div className="text-xs font-bold text-mint mb-2">AI-ENABLED STATE</div>
                          <p className="text-sm">{frictionMap.aiEnabledState}</p>
                        </div>
                      </motion.div>
                    )}
                    {resultTab === 'tools' && (
                      <motion.div
                        key="tools-tab"
                        initial={{ opacity: 0, x: 10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -10 }}
                        className="space-y-3"
                      >
                        {frictionMap.toolRecommendations.map((tool, i) => (
                          <div key={i} className="p-4 rounded-lg bg-muted/50 border">
                            <div className="flex items-start gap-3">
                              <div className="w-6 h-6 rounded-full bg-mint/20 text-mint-dark flex items-center justify-center text-xs font-bold shrink-0">
                                {i + 1}
                              </div>
                              <div>
                                <div className="font-semibold">{tool.name}</div>
                                <p className="text-xs text-muted-foreground mt-1">{tool.description}</p>
                                <p className="text-xs text-mint-dark mt-2 italic">→ {tool.useCase}</p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </motion.div>
                    )}
                    {resultTab === 'prompts' && (
                      <motion.div
                        key="prompts-tab"
                        initial={{ opacity: 0, x: 10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -10 }}
                        className="space-y-4"
                      >
                        {frictionMap.masterPrompts?.map((prompt, i) => (
                          <div key={i} className="p-4 rounded-lg bg-ink/5 border">
                            <div className="font-semibold mb-2">{prompt.title}</div>
                            <div className="text-xs font-mono bg-background p-3 rounded border whitespace-pre-wrap max-h-40 overflow-y-auto">
                              {prompt.prompt}
                            </div>
                          </div>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Actions */}
                <div className="p-4 border-t space-y-2 shrink-0">
                  <Button onClick={handleDownload} variant="outline" className="w-full">
                    <Download className="h-4 w-4 mr-2" />
                    Download PDF
                  </Button>
                  <Button
                    className="w-full bg-mint text-ink hover:bg-mint/90"
                    onClick={() => openCalendlyPopup({ source: 'friction-map' })}
                  >
                    Build 4 More Like This →
                  </Button>
                </div>
              </motion.div>
            ) : !showTextInput && voiceSupported ? (
              <motion.div
                key="voice-first"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex-1 flex flex-col"
              >
                <div className="text-center p-4 pt-6 shrink-0">
                  <h3 className="text-xl sm:text-2xl font-bold mb-2 overflow-hidden">Build Your AI Friction Map</h3>
                  <p className="text-muted-foreground text-sm overflow-hidden">
                    Speak your biggest time drain
                  </p>
                </div>

                <div className="flex-1 flex flex-col items-center justify-center p-4">
                  <VoiceInputButton
                    isListening={isListening}
                    isSupported={voiceSupported}
                    error={voiceError}
                    onStart={handleVoiceStart}
                    onStop={stopListening}
                    size="xl"
                    variant="mobile-primary"
                    showLabel
                    label={isListening ? 'Listening...' : 'Tap to speak'}
                  />

                  {/* Show transcript as it's being recorded */}
                  <AnimatePresence>
                    {(problem || interimTranscript) && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        className="mt-6 p-4 rounded-xl bg-muted/50 border max-w-sm text-center"
                      >
                        <p className="text-sm">
                          {problem}
                          {isListening && interimTranscript && (
                            <span className="text-muted-foreground">{interimTranscript}</span>
                          )}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <button
                    onClick={() => setShowTextInput(true)}
                    className="mt-6 text-xs text-mint-dark underline underline-offset-2 hover:text-mint transition-colors"
                  >
                    or type your challenge
                  </button>
                </div>

                {/* Submit button when there's voice input */}
                {problem && !isListening && problem.trim().length >= 10 && (
                  <div className="p-4 border-t">
                    <Button
                      onClick={() => handleSubmit()}
                      size="lg"
                      className="w-full bg-mint text-ink hover:bg-mint/90 font-bold"
                    >
                      Generate Friction Map
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  </div>
                )}
              </motion.div>
            ) : (
              <motion.div
                key="input"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex-1 flex flex-col p-4"
              >
                <div className="text-center mb-6 shrink-0">
                  <h3 className="text-xl sm:text-2xl font-bold mb-2 overflow-hidden">Build Your AI Friction Map</h3>
                  <p className="text-muted-foreground text-sm overflow-hidden">
                    Describe a workflow challenge and get AI-powered recommendations.
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="flex-1 flex flex-col">
                  <div className="flex-1">
                    <label className="text-sm font-medium mb-2 block">
                      What's your biggest time drain?
                    </label>
                    <div className="relative">
                      <Input
                        value={problem + (isListening ? interimTranscript : '')}
                        onChange={(e) => setProblem(e.target.value)}
                        placeholder="e.g., Weekly reports take 5 hours to compile"
                        className="text-base pr-14"
                        disabled={isGenerating}
                      />
                      {voiceSupported && (
                        <div className="absolute right-3 top-1/2 -translate-y-1/2">
                          <VoiceInputButton
                            isListening={isListening}
                            isSupported={voiceSupported}
                            error={voiceError}
                            onStart={handleVoiceStart}
                            onStop={stopListening}
                            size="sm"
                          />
                        </div>
                      )}
                    </div>
                    {error && <p className="text-xs text-destructive mt-2">{error}</p>}
                    <p className="text-xs text-muted-foreground mt-2">
                      Be specific for better recommendations (min 10 characters)
                    </p>
                  </div>
                  
                  <Button
                    type="submit"
                    size="lg"
                    className="w-full mt-4 bg-mint text-ink hover:bg-mint/90 font-bold"
                    disabled={isGenerating || problem.trim().length < 10}
                  >
                    Generate Friction Map
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </form>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    );
  }

  // Desktop layout
  if (frictionMap) {
    return (
      <div className="flex flex-col h-full max-h-[70vh] min-h-0 bg-white dark:bg-gray-900/90 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg animate-in fade-in duration-500">
        {/* Header - Fixed */}
        <div className="shrink-0 flex items-center justify-between p-6 pb-4 border-b">
          <h3 className="text-xl font-bold flex items-center gap-2 text-gray-900 dark:text-white">
            <MindmakerIcon size={20} />
            Your AI Friction Map
          </h3>
          <Button variant="ghost" size="sm" onClick={handleReset} className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">
            Build Another
          </Button>
        </div>
        
        {/* Scrollable Content Area */}
        <div className="flex-1 overflow-y-auto min-h-0 p-6 pr-4">
          <div className="space-y-6">
            <MindmakerBadge text="Analyzed using Mindmaker's First-Principles Framework" />

            <div>
              <div className="text-xs font-bold text-gray-500 dark:text-gray-400 mb-2">YOUR CHALLENGE</div>
              <div className="text-lg font-semibold text-gray-900 dark:text-white">{frictionMap.problem}</div>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700">
                <div className="text-xs font-bold text-gray-500 dark:text-gray-400 mb-2">CURRENT STATE</div>
                <p className="text-sm text-gray-700 dark:text-gray-300">{frictionMap.currentState}</p>
              </div>
              <div className="p-4 rounded-lg bg-mint/10 dark:bg-mint/20 border border-mint/30 dark:border-mint/40">
                <div className="text-xs font-bold text-mint dark:text-mint mb-2">AI-ENABLED STATE</div>
                <p className="text-sm text-gray-900 dark:text-white">{frictionMap.aiEnabledState}</p>
              </div>
            </div>

            <div className="flex items-center justify-center gap-8 py-4 bg-gray-50 dark:bg-gray-800/30 rounded-lg">
              <div className="text-center">
                <Clock className="h-6 w-6 text-mint mx-auto mb-2" />
                <div className="text-xl font-bold text-gray-900 dark:text-white">{frictionMap.timeSaved}</div>
                <div className="text-xs text-gray-500 dark:text-gray-400">Estimated savings</div>
              </div>
            </div>

            <div>
              <div className="text-xs font-bold text-gray-500 dark:text-gray-400 mb-3">RECOMMENDED TOOLS</div>
              <div className="space-y-3">
                {frictionMap.toolRecommendations.map((tool, i) => (
                  <div key={i} className="p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700">
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-mint/20 dark:bg-mint/30 text-mint-dark flex items-center justify-center text-xs font-bold flex-shrink-0">
                        {i + 1}
                      </div>
                      <div>
                        <div className="font-semibold text-sm text-gray-900 dark:text-white">{tool.name}</div>
                        <div className="text-xs text-gray-600 dark:text-gray-400">{tool.description}</div>
                        <div className="text-xs text-mint-dark mt-1 italic">→ {tool.useCase}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {frictionMap.masterPrompts && frictionMap.masterPrompts.length > 0 && (
              <div>
                <div className="text-xs font-bold text-gray-500 dark:text-gray-400 mb-3">MASTER PROMPTS</div>
                <div className="space-y-3">
                  {frictionMap.masterPrompts.map((prompt, i) => (
                    <div key={i} className="p-4 rounded-lg bg-ink/5 dark:bg-ink/20 border border-ink/10 dark:border-ink/30">
                      <div className="font-semibold text-sm mb-2 text-gray-900 dark:text-white">{prompt.title}</div>
                      <div className="text-xs text-gray-700 dark:text-gray-300 font-mono whitespace-pre-wrap bg-white dark:bg-gray-900 p-3 rounded border max-h-40 overflow-y-auto">
                        {prompt.prompt}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Fixed Buttons at Bottom */}
        <div className="shrink-0 flex flex-col sm:flex-row gap-3 p-6 pt-4 border-t bg-white dark:bg-gray-900/90">
          <Button onClick={handleDownload} variant="outline" className="flex-1">
            <Download className="h-4 w-4 mr-2" />
            Download PDF
          </Button>
          <Button 
            className="flex-1 bg-mint text-ink hover:bg-mint/90"
            onClick={() => openCalendlyPopup({ source: 'friction-map' })}
          >
            Build 4 More Like This →
          </Button>
        </div>
      </div>
    );
  }

  // Desktop input form
  return (
    <Card className="p-6 sm:p-8 bg-white dark:bg-gray-900/90 backdrop-blur-sm border border-gray-200 dark:border-gray-700 hover:border-mint dark:hover:border-mint transition-colors shadow-lg">
      <div className="mb-4">
        <h3 className="text-xl font-bold mb-2 flex items-center gap-2">
          <MindmakerIcon size={20} animated={isGenerating} />
          Build Your AI Friction Map
        </h3>
        <p className="text-sm text-muted-foreground">
          Describe a workflow challenge and get AI-powered tool recommendations with ready-to-use prompts.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="text-sm font-medium mb-2 block">
            What's your biggest time drain?
          </label>
          <div className="relative">
            <Input
              value={problem + (isListening ? interimTranscript : '')}
              onChange={(e) => setProblem(e.target.value)}
              placeholder="e.g., Weekly reports take 5 hours to compile and format"
              className="text-base pr-14"
              disabled={isGenerating}
            />
            {voiceSupported && (
              <div className="absolute right-3 top-1/2 -translate-y-1/2">
                <VoiceInputButton
                  isListening={isListening}
                  isSupported={voiceSupported}
                  error={voiceError}
                  onStart={handleVoiceStart}
                  onStop={stopListening}
                  size="sm"
                />
              </div>
            )}
          </div>
          {error && <p className="text-xs text-destructive mt-2">{error}</p>}
          <p className="text-xs text-muted-foreground mt-2">
            Be specific for better recommendations (min 10 characters)
          </p>
        </div>

        {/* Voice status indicator */}
        <AnimatePresence>
          {isListening && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="flex items-center justify-center gap-2 text-sm text-mint"
            >
              <span className="w-2 h-2 rounded-full bg-mint animate-pulse" />
              Listening... describe your challenge
            </motion.div>
          )}
        </AnimatePresence>

        <Button
          type="submit"
          size="lg"
          className="w-full bg-mint text-ink hover:bg-mint/90 font-bold"
          disabled={isGenerating || problem.trim().length < 10}
        >
          {isGenerating ? (
            <>
              <MindmakerIcon size={16} animated className="mr-2" />
              Analyzing Your Challenge...
            </>
          ) : (
            <>
              Generate Friction Map
              <ArrowRight className="h-4 w-4 ml-2" />
            </>
          )}
        </Button>
      </form>

      <p className="text-xs text-muted-foreground mt-4 text-center">
        Free • No email required • AI-powered analysis
      </p>
    </Card>
  );
};
