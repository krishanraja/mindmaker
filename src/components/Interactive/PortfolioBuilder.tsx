import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';
import { usePortfolio } from '@/hooks/usePortfolio';
import { TrendingUp, Download, ArrowRight } from 'lucide-react';
import { useSessionData } from '@/contexts/SessionDataContext';
import { generatePortfolioPDF } from '@/utils/pdfGenerator';

interface PortfolioBuilderProps {
  compact?: boolean;
}

export const PortfolioBuilder = ({ compact = false }: PortfolioBuilderProps) => {
  const { tasks, toggleTask, updateTaskHours, getPortfolioData } = usePortfolio();
  const [showResults, setShowResults] = useState(false);
  const portfolioData = getPortfolioData();
  const { setPortfolioBuilder } = useSessionData();

  useEffect(() => {
    if (showResults) {
      const portfolio = getPortfolioData();
      setPortfolioBuilder({
        selectedTasks: portfolio.tasks.map(t => ({
          name: t.name,
          hours: t.hoursPerWeek,
          savings: t.potentialSavings
        })),
        totalTimeSaved: portfolio.totalTimeSaved,
        totalCostSavings: portfolio.totalCostSavings
      });
    }
  }, [showResults, getPortfolioData, setPortfolioBuilder]);

  const handleGenerate = () => {
    if (portfolioData.tasks.length > 0) {
      setShowResults(true);
    }
  };

  const handleDownload = () => {
    const masterPrompts = generateMasterPrompts(portfolioData.tasks);
    generatePortfolioPDF({
      ...portfolioData,
      masterPrompts,
    });
  };

  if (showResults) {
    return (
      <Card className="p-6 sm:p-8 bg-gradient-to-br from-mint/5 to-ink/5 border-2 border-mint">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-mint" />
            Your AI Portfolio
          </h3>
          <Button variant="ghost" size="sm" onClick={() => setShowResults(false)}>
            Edit
          </Button>
        </div>

        <div className="space-y-6">
          {/* Tasks */}
          <div>
            <div className="text-xs font-bold text-muted-foreground mb-3">YOUR AI SYSTEMS</div>
            <div className="space-y-3">
              {portfolioData.tasks.map(task => (
                <div key={task.id} className="p-4 rounded-lg bg-background border">
                    <div className="flex items-start justify-between mb-2">
                      <div className="font-semibold text-sm">{task.name}</div>
                      <div className="text-right">
                        <div className="text-xs text-muted-foreground">Saves</div>
                        <div className="text-lg font-bold text-mint-dark">{task.potentialSavings}h/wk</div>
                    </div>
                  </div>
                    <div className="text-xs text-muted-foreground space-y-1">
                      <div>Current: {task.hoursPerWeek}h/week</div>
                      <div className="flex flex-wrap gap-1 mt-2">
                        {task.aiTools.map((tool, i) => (
                          <span key={i} className="px-2 py-0.5 bg-mint/10 text-mint-dark rounded-full text-xs">
                            {tool}
                          </span>
                        ))}
                      </div>
                    </div>
                </div>
              ))}
            </div>
          </div>

          {/* Total Impact */}
          <div className="grid sm:grid-cols-2 gap-4 p-4 rounded-lg bg-background">
            <div className="text-center">
              <div className="text-3xl font-bold text-mint-dark">{portfolioData.totalTimeSaved}h</div>
              <div className="text-xs text-muted-foreground">Saved per week</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-gold">${(portfolioData.totalCostSavings / 1000).toFixed(0)}K</div>
              <div className="text-xs text-muted-foreground">Value per month</div>
            </div>
          </div>

          {/* Roadmap */}
          <div>
            <div className="text-xs font-bold text-muted-foreground mb-3">IMPLEMENTATION ROADMAP</div>
            <div className="space-y-2">
              {portfolioData.implementationRoadmap.map((step, i) => (
                <div key={i} className="flex items-start gap-3 text-sm">
                  <div className="w-6 h-6 rounded-full bg-mint/20 text-mint-dark flex items-center justify-center text-xs font-bold flex-shrink-0">
                    {i + 1}
                  </div>
                  <div className="pt-0.5">{step}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t">
            <Button onClick={handleDownload} variant="outline" className="flex-1">
              <Download className="h-4 w-4 mr-2" />
              Download PDF
            </Button>
            <Button 
              className="flex-1 bg-mint text-ink hover:bg-mint/90"
              onClick={() => window.location.href = '/builder-sprint'}
            >
              Build This Portfolio →
            </Button>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6 sm:p-8 bg-background/50 backdrop-blur-sm border-2 border-mint/30 hover:border-mint transition-colors">
      <div className="mb-6">
        <h3 className="text-xl font-bold mb-2">Model out your starting points</h3>
        <p className="text-sm text-muted-foreground">
          Select your weekly tasks and see your personalized transformation roadmap
        </p>
      </div>

      <div className="space-y-6">
        {tasks.map(task => (
          <div key={task.id} className="space-y-3 pb-6 border-b last:border-0">
            <div className="flex items-start gap-3">
              <Checkbox
                id={task.id}
                checked={task.selected}
                onCheckedChange={() => toggleTask(task.id)}
                className="mt-1"
              />
              <label htmlFor={task.id} className="flex-1 cursor-pointer">
                <div className="font-semibold text-sm">{task.name}</div>
                <div className="text-xs text-muted-foreground mt-1">
                  Tools: {task.aiTools.slice(0, 2).join(', ')}
                </div>
              </label>
            </div>

            {task.selected && (
              <div className="ml-7 space-y-2 animate-in fade-in slide-in-from-top-2 duration-300">
                <label className="text-xs text-muted-foreground">
                  Hours per week: <span className="font-bold text-foreground">{task.hoursPerWeek}h</span>
                </label>
                <Slider
                  value={[task.hoursPerWeek]}
                  onValueChange={([value]) => updateTaskHours(task.id, value)}
                  min={1}
                  max={20}
                  step={1}
                  className="w-full"
                />
                {task.hoursPerWeek > 0 && (
                  <div className="text-xs text-mint-dark font-semibold">
                    → Could save {task.potentialSavings}h per week
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      <Button
        onClick={handleGenerate}
        size="lg"
        className="w-full mt-6 bg-mint text-ink hover:bg-mint/90 font-bold"
        disabled={portfolioData.tasks.length === 0}
      >
        Generate Portfolio
        <ArrowRight className="h-4 w-4 ml-2" />
      </Button>
    </Card>
  );
};

// Generate master prompts based on selected tasks - using Mindmaker methodology
function generateMasterPrompts(tasks: Array<{ name: string; aiTools: string[] }>) {
  const prompts: Array<{ title: string; prompt: string }> = [];
  
  tasks.forEach(task => {
    const taskLower = task.name.toLowerCase();
    
    if (taskLower.includes('email') || taskLower.includes('communication')) {
      prompts.push({
        title: `Executive Communication Drafter`,
        prompt: `I need to draft a professional communication to my team about an important update. The key message is our strategic priority shift for this quarter. Write a clear, confident message that:
1. Opens with the key decision/update (don't bury the lead)
2. Explains the reasoning in 2-3 sentences
3. Addresses how this affects the team
4. Ends with clear next steps

Keep it under 200 words, professional but warm tone. Make it something I can send with minimal editing.`
      });
    } else if (taskLower.includes('report') || taskLower.includes('data')) {
      prompts.push({
        title: `Weekly Performance Analysis`,
        prompt: `I'm sharing our key metrics for this week. Analyze this data and give me:
1. The 3 most important trends I should know about
2. Any anomalies or red flags that need immediate attention
3. One specific, actionable recommendation for next week
4. A one-paragraph executive summary I can share with leadership

Format this for a busy executive who has 2 minutes to review. Use bullet points, be direct, highlight what matters.`
      });
    } else if (taskLower.includes('meeting') || taskLower.includes('notes')) {
      prompts.push({
        title: `Meeting Summary Generator`,
        prompt: `Here are my raw notes from today's leadership meeting. Transform these into a shareable summary with:
1. Executive summary (3 sentences max - what does the reader NEED to know?)
2. Decisions made (what was decided and by whom)
3. Action items with owners and deadlines (table format)
4. Open questions for next meeting
5. Key quotes worth remembering

Format this so I can paste it directly into Slack or email to the team.`
      });
    } else if (taskLower.includes('strategic') || taskLower.includes('planning') || taskLower.includes('analysis')) {
      prompts.push({
        title: `Strategic Analysis Framework`,
        prompt: `I'm working through a strategic decision and want to apply structured thinking. Help me analyze this using the dialectical method:

1. THESIS: What's the strongest case FOR this direction?
2. ANTITHESIS: What's the strongest case AGAINST?
3. SYNTHESIS: What path captures the benefits while mitigating the risks?
4. FIRST-PRINCIPLES CHECK: What are we assuming that might not be true?
5. RECOMMENDATION: Given all this, what should we actually do?

Be direct, challenge my thinking, and give me a clear recommendation with reasoning.`
      });
    } else if (taskLower.includes('research') || taskLower.includes('market') || taskLower.includes('competitive')) {
      prompts.push({
        title: `Competitive Intelligence Brief`,
        prompt: `I need a quick competitive intelligence brief on our market. Research and provide:
1. Key moves by our top 3 competitors in the last 90 days
2. Emerging trends that could affect our positioning
3. Gaps in the market we could potentially exploit
4. Questions we should be asking internally based on this analysis

Keep it to one page, cite sources where possible, and end with 2-3 specific recommendations for our team.`
      });
    } else {
      prompts.push({
        title: `${task.name} Accelerator`,
        prompt: `I'm a senior leader working on ${task.name.toLowerCase()}. I need to move faster on this without sacrificing quality.

Help me by:
1. Identifying the 20% of this work that drives 80% of the value
2. Suggesting how AI tools (specifically ${task.aiTools.slice(0, 2).join(' or ')}) could accelerate each step
3. Creating a draft framework or template I can use immediately
4. Flagging potential pitfalls so I avoid common mistakes

Be direct and practical—I want to implement this today, not someday.`
      });
    }
  });

  // Add strategic decision prompt if we have less than 2
  if (prompts.length < 2) {
    prompts.push({
      title: 'First-Principles Decision Framework',
      prompt: `I'm facing a strategic decision and want to think through it rigorously. Apply first-principles thinking:

1. What's the fundamental problem I'm actually trying to solve? (Strip away the symptoms)
2. What are we assuming that might not be true?
3. If we started from scratch with no constraints, what would we do?
4. What's the minimum viable test to validate our hypothesis?
5. What would change our mind about this direction?

Then give me a clear recommendation with your reasoning. Be willing to tell me if I'm thinking about this wrong.`
    });
  }

  return prompts;
}
