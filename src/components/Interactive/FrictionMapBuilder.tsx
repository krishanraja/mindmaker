import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { useFrictionMap } from '@/hooks/useFrictionMap';
import { ArrowRight, Download, Sparkles, Clock, Zap } from 'lucide-react';
import { useSessionData } from '@/contexts/SessionDataContext';
import { generateFrictionMapPDF } from '@/utils/pdfGenerator';

interface FrictionMapBuilderProps {
  compact?: boolean;
}

export const FrictionMapBuilder = ({ compact = false }: FrictionMapBuilderProps) => {
  const [problem, setProblem] = useState('');
  const { frictionMap, isGenerating, error, generateFrictionMap, clearFrictionMap } = useFrictionMap();
  const { setFrictionMap } = useSessionData();

  useEffect(() => {
    if (frictionMap) {
      setFrictionMap(frictionMap);
    }
  }, [frictionMap, setFrictionMap]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (problem.trim()) {
      await generateFrictionMap(problem.trim());
    }
  };

  const handleDownload = () => {
    if (!frictionMap) return;
    generateFrictionMapPDF(frictionMap);
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
          onClick={clearFrictionMap}
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
        <Input
          value={problem}
          onChange={(e) => setProblem(e.target.value)}
          placeholder="e.g., Weekly reports take 5 hours"
          className="text-sm"
          disabled={isGenerating}
        />
        {error && <p className="text-xs text-destructive">{error}</p>}
        <Button
          type="submit"
          size="sm"
          className="w-full bg-mint text-ink hover:bg-mint/90 font-bold"
          disabled={isGenerating || !problem.trim()}
        >
          {isGenerating ? (
            <>
              <Sparkles className="h-3 w-3 mr-2 animate-spin" />
              Generating...
            </>
          ) : (
            'Generate Map'
          )}
        </Button>
      </form>
    );
  }

  // Full mode - Results view
  if (frictionMap) {
    return (
      <Card className="p-6 sm:p-8 -mt-4 bg-white dark:bg-gray-900/90 border border-gray-200 dark:border-gray-700 shadow-lg animate-in fade-in duration-500">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold flex items-center gap-2 text-gray-900 dark:text-white">
            <Sparkles className="h-5 w-5 text-mint dark:text-mint" />
            Your AI Friction Map
          </h3>
          <Button variant="ghost" size="sm" onClick={clearFrictionMap} className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">
            Build Another
          </Button>
        </div>

        <div className="space-y-6">
          {/* Problem */}
          <div>
            <div className="text-xs font-bold text-gray-500 dark:text-gray-400 mb-2">YOUR CHALLENGE</div>
            <div className="text-lg font-semibold text-gray-900 dark:text-white">{frictionMap.problem}</div>
          </div>

          {/* States Comparison */}
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

          {/* Time Saved */}
          <div className="flex items-center justify-center gap-8 py-4 bg-gray-50 dark:bg-gray-800/30 rounded-lg">
            <div className="text-center">
              <Clock className="h-6 w-6 text-mint mx-auto mb-2" />
              <div className="text-xl font-bold text-gray-900 dark:text-white">{frictionMap.timeSaved}</div>
              <div className="text-xs text-gray-500 dark:text-gray-400">Estimated savings</div>
            </div>
          </div>

          {/* Tool Recommendations */}
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

          {/* Master Prompts */}
          {frictionMap.masterPrompts && frictionMap.masterPrompts.length > 0 && (
            <div>
              <div className="text-xs font-bold text-gray-500 dark:text-gray-400 mb-3">MASTER PROMPTS</div>
              <div className="space-y-3">
                {frictionMap.masterPrompts.map((prompt, i) => (
                  <div key={i} className="p-4 rounded-lg bg-ink/5 dark:bg-ink/20 border border-ink/10 dark:border-ink/30">
                    <div className="font-semibold text-sm mb-2 text-gray-900 dark:text-white">{prompt.title}</div>
                    <div className="text-xs text-gray-700 dark:text-gray-300 font-mono whitespace-pre-wrap bg-white dark:bg-gray-900 p-3 rounded border">
                      {prompt.prompt}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t">
            <Button onClick={handleDownload} variant="outline" className="flex-1">
              <Download className="h-4 w-4 mr-2" />
              Download PDF
            </Button>
            <Button 
              className="flex-1 bg-mint text-ink hover:bg-mint/90"
              onClick={() => window.location.href = '/builder-session'}
            >
              Build 4 More Like This →
            </Button>
          </div>
        </div>
      </Card>
    );
  }

  // Full mode - Input form
  return (
    <Card className="p-6 sm:p-8 -mt-4 bg-white dark:bg-gray-900/90 backdrop-blur-sm border border-gray-200 dark:border-gray-700 hover:border-mint dark:hover:border-mint transition-colors shadow-lg">
      <div className="mb-4">
        <h3 className="text-xl font-bold mb-2 flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-mint animate-pulse" />
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
          <Input
            value={problem}
            onChange={(e) => setProblem(e.target.value)}
            placeholder="e.g., Weekly reports take 5 hours to compile and format"
            className="text-base"
            disabled={isGenerating}
          />
          {error && <p className="text-xs text-destructive mt-2">{error}</p>}
          <p className="text-xs text-muted-foreground mt-2">
            Be specific for better recommendations (min 10 characters)
          </p>
        </div>

        <Button
          type="submit"
          size="lg"
          className="w-full bg-mint text-ink hover:bg-mint/90 font-bold"
          disabled={isGenerating || problem.trim().length < 10}
        >
          {isGenerating ? (
            <>
              <Sparkles className="h-4 w-4 mr-2 animate-spin" />
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
