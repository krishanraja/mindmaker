import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface ToolRecommendation {
  name: string;
  description: string;
  useCase: string;
}

export interface MasterPrompt {
  title: string;
  prompt: string;
}

export interface FrictionMapData {
  problem: string;
  currentState: string;
  aiEnabledState: string;
  timeSaved: string;
  toolRecommendations: ToolRecommendation[];
  masterPrompts: MasterPrompt[];
  generatedAt: Date;
}

const FRICTION_MAP_PROMPT = `You are Krish from MindMaker, an AI implementation strategist who helps leaders build working AI systems around their real work.

## MINDMAKER METHODOLOGY (Use this to inform your response)

### Core Principle
"AI literacy is about compounding leadership performance—using AI to think better, faster, and more creatively as a leader."

### The Five Cognitive Frameworks for AI Decision-Making:
1. **A/B Framing**: Reframe decisions positively AND negatively to expose hidden bias
2. **Dialectical Reasoning**: Explore thesis-antithesis-synthesis for better decisions
3. **Mental Contrasting (WOOP)**: Wish → Outcome → Obstacle → Plan
4. **Reflective Equilibrium**: Ensure decisions align with organizational values
5. **First-Principles Thinking**: Strip assumptions, find fundamental truths, rebuild

### Mindmaker Values:
- Build working systems, not concepts
- Real work from their actual problems, not case studies
- Literacy that outlives any tool
- No vendor theatre or generic training

## YOUR TASK

Analyze the user's workflow challenge and create a personalized AI friction map. Return a JSON response with this exact structure:

{
  "currentState": "2-3 sentences describing THEIR specific situation today - pain points, time drains, frustrations. Be specific to what they described.",
  "aiEnabledState": "2-3 sentences describing how THEIR workflow transforms with AI - specific to their context, not generic benefits.",
  "timeSaved": "A specific, defensible estimate with reasoning (e.g., '6-8 hours per week based on automating your weekly compilation and reducing review cycles by 50%').",
  "toolRecommendations": [
    {
      "name": "Tool Name",
      "description": "What this tool does specifically for their use case.",
      "useCase": "EXACTLY how they would use it for their stated problem - be specific."
    }
  ],
  "masterPrompts": [
    {
      "title": "Descriptive Title for Their Specific Task",
      "prompt": "A COMPLETE, READY-TO-USE prompt they can copy-paste immediately. Include specific context from their problem. NO placeholders like [YOUR_ROLE] - instead, write it for their actual situation. The prompt should be 3-5 sentences, actionable, and produce immediate value."
    }
  ]
}

## CRITICAL RULES:
1. **NO PLACEHOLDERS** - Write complete, ready-to-use prompts based on what they told you
2. **BE SPECIFIC** - Reference their actual problem, not generic workflow issues
3. **PROVIDE VALUE IMMEDIATELY** - They should be able to use this output right now
4. **USE MINDMAKER FRAMEWORKS** - Apply first-principles thinking, mental contrasting when relevant
5. **FOCUS ON WINS** - Prioritize quick wins (1-2 week implementation) over complex transformations
6. Provide 3 tool recommendations and 2 master prompts
7. Time savings must be realistic and tied to their specific situation

Return ONLY valid JSON, no markdown or explanation.`;

export const useFrictionMap = () => {
  const [frictionMap, setFrictionMap] = useState<FrictionMapData | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateFrictionMap = useCallback(async (problem: string) => {
    if (!problem.trim() || problem.length < 10) {
      setError('Please describe your challenge in at least 10 characters.');
      return;
    }

    setIsGenerating(true);
    setError(null);

    try {
      const { data, error: functionError } = await supabase.functions.invoke('chat-with-krish', {
        body: {
          messages: [
            { role: 'system', content: FRICTION_MAP_PROMPT },
            { role: 'user', content: `Analyze this workflow challenge and provide AI implementation recommendations:\n\n"${problem}"` }
          ],
          widgetMode: 'tryit',
        },
      });

      if (functionError) throw functionError;

      const responseText = data?.message || '';
      
      let parsedResponse;
      try {
        const jsonMatch = responseText.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          parsedResponse = JSON.parse(jsonMatch[0]);
        } else {
          throw new Error('No JSON found in response');
        }
      } catch (parseError) {
        console.error('Failed to parse AI response:', parseError, responseText);
        parsedResponse = generateFallbackResponse(problem);
      }

      const newFrictionMap: FrictionMapData = {
        problem,
        currentState: parsedResponse.currentState || 'Manual processes consuming significant time and mental energy.',
        aiEnabledState: parsedResponse.aiEnabledState || 'Streamlined workflows with AI handling routine tasks.',
        timeSaved: parsedResponse.timeSaved || '4-6 hours per week',
        toolRecommendations: parsedResponse.toolRecommendations || [],
        masterPrompts: parsedResponse.masterPrompts || [],
        generatedAt: new Date(),
      };

      setFrictionMap(newFrictionMap);
      localStorage.setItem('mindmaker-friction-map', JSON.stringify(newFrictionMap));
    } catch (err) {
      console.error('Error generating friction map:', err);
      setError('Failed to generate analysis. Please try again.');
      
      const fallback = generateFallbackResponse(problem);
      setFrictionMap({
        problem,
        ...fallback,
        generatedAt: new Date(),
      });
    } finally {
      setIsGenerating(false);
    }
  }, []);

  const clearFrictionMap = useCallback(() => {
    setFrictionMap(null);
    setError(null);
    localStorage.removeItem('mindmaker-friction-map');
  }, []);

  return {
    frictionMap,
    isGenerating,
    error,
    generateFrictionMap,
    clearFrictionMap,
  };
};

function generateFallbackResponse(problem: string): Omit<FrictionMapData, 'problem' | 'generatedAt'> {
  const problemLower = problem.toLowerCase();
  
  const isWriting = problemLower.includes('writ') || problemLower.includes('content') || problemLower.includes('email');
  const isData = problemLower.includes('data') || problemLower.includes('report') || problemLower.includes('analys');
  const isMeetings = problemLower.includes('meeting') || problemLower.includes('notes') || problemLower.includes('summary');

  if (isWriting) {
    return {
      currentState: `Your writing workflow—drafting, editing, and ensuring consistent tone—is consuming hours that could go toward strategic work. Each piece requires multiple revision cycles and context-switching between different communication types.`,
      aiEnabledState: `AI generates solid first drafts in your voice within seconds, handles tone adjustments automatically, and maintains consistency across all your communications. You shift from writer to editor, reducing writing time by 60-70%.`,
      timeSaved: '5-8 hours per week (based on typical leadership communication volume)',
      toolRecommendations: [
        { name: 'Claude', description: 'Advanced AI with nuanced writing capabilities and strong reasoning.', useCase: `Draft your emails, memos, and strategic communications. Claude excels at matching professional tone and can handle complex, multi-stakeholder messages.` },
        { name: 'Grammarly Business', description: 'AI writing assistant that integrates everywhere you write.', useCase: `Real-time improvements as you write—catches tone mismatches, clarity issues, and ensures your communications land as intended.` },
        { name: 'Notion AI', description: 'AI embedded in your workspace for contextual writing.', useCase: `Generate content within your existing documents and projects. Great for internal communications and documentation that needs organizational context.` },
      ],
      masterPrompts: [
        { title: 'Executive Communication Drafter', prompt: `I need to communicate a decision to my team about our strategic direction change. The key message is that we're shifting focus to prioritize our core product over expansion. Draft a clear, confident email that acknowledges the change, explains the reasoning (market conditions require focus), and maintains team morale. Keep it under 200 words, professional but warm tone.` },
        { title: 'Stakeholder Update Generator', prompt: `Write a weekly stakeholder update covering: 1) Progress on our main initiative this week, 2) Key blockers we're working through, 3) What's coming next week. Use bullet points, keep it scannable, executive-friendly. Include a one-sentence summary at the top.` },
      ],
    };
  }

  if (isData) {
    return {
      currentState: `Your data analysis workflow involves manually gathering information from multiple sources, processing it in spreadsheets, and interpreting patterns—a process that takes hours and is prone to human error and inconsistency.`,
      aiEnabledState: `AI automates data gathering, recognizes patterns you might miss, and generates initial analysis with visualizations in minutes. You move from data processor to insight validator and strategic decision-maker.`,
      timeSaved: '6-10 hours per week (based on typical executive reporting cycles)',
      toolRecommendations: [
        { name: 'ChatGPT with Code Interpreter', description: 'Upload data files and analyze with natural language.', useCase: `Upload your spreadsheets or CSVs, ask questions in plain English, get instant charts and insights. Perfect for ad-hoc analysis and board prep.` },
        { name: 'Perplexity AI', description: 'AI research assistant with real-time web access and citations.', useCase: `Research competitors, market trends, and industry data with cited sources. Saves hours of manual research and gives you defensible insights.` },
        { name: 'Julius AI', description: 'Specialized data analysis platform for business users.', useCase: `Complex data transformations and recurring analysis. Build reusable analysis workflows that run on new data automatically.` },
      ],
      masterPrompts: [
        { title: 'Weekly Metrics Analysis', prompt: `Here's our weekly performance data: [paste your metrics]. Analyze this and give me: 1) The 3 most important trends I should know about, 2) Any anomalies or concerns that need attention, 3) One specific recommendation for next week. Format this for a 2-minute executive review.` },
        { title: 'Competitive Intelligence Brief', prompt: `Research our competitor [competitor name] and their recent moves in [your market]. I need: key strategic initiatives they've announced in the last 90 days, how this might affect our positioning, and what questions we should be asking internally. Keep it to one page, cite your sources.` },
      ],
    };
  }

  if (isMeetings) {
    return {
      currentState: `Your meetings generate scattered notes, action items fall through the cracks, and follow-up takes significant effort. The value from meetings dissipates because capture and follow-through are manual.`,
      aiEnabledState: `AI captures everything automatically, generates structured summaries with clear action items, and tracks follow-up—ensuring every meeting produces lasting value without your manual effort.`,
      timeSaved: '3-5 hours per week (based on typical leadership meeting load)',
      toolRecommendations: [
        { name: 'Otter.ai', description: 'AI meeting transcription with smart summaries.', useCase: `Automatically records and transcribes your meetings, then generates summaries with action items. Join meetings knowing capture is handled.` },
        { name: 'Fireflies.ai', description: 'Meeting intelligence that makes conversations searchable.', useCase: `Search across all your meetings for specific discussions. "What did we decide about the Q2 budget?" becomes instantly answerable.` },
        { name: 'Notion AI', description: 'AI-powered workspace for meeting management.', useCase: `Organize meeting notes, generate follow-up tasks, and keep everything connected to your projects. Meetings become actionable, not just recorded.` },
      ],
      masterPrompts: [
        { title: 'Meeting Summary & Actions', prompt: `Here are my raw notes from today's leadership meeting: [paste notes]. Create: 1) A 3-sentence executive summary, 2) Decisions made (with owners), 3) Action items with deadlines and responsible parties, 4) Open questions for next meeting. Format this so I can share directly with the team.` },
        { title: 'Meeting Prep Brief', prompt: `I have a board meeting tomorrow about our Q4 results. Based on these materials [paste key docs or summary], prepare: 1) My opening talking points (90 seconds), 2) The 5 questions I'm most likely to get and strong answers to each, 3) The one thing I absolutely need to leave the room having communicated.` },
      ],
    };
  }

  // Default fallback - apply first-principles thinking
  return {
    currentState: `Your workflow involves manual steps, context-switching, and repetitive tasks that fragment your attention and consume time that should go toward strategic thinking and leadership.`,
    aiEnabledState: `AI handles the routine elements—drafting, summarizing, analyzing, organizing—while you focus on judgment and decision-making. Context is maintained automatically, and your output velocity increases 2-3x.`,
    timeSaved: '4-7 hours per week (based on typical executive time allocation)',
    toolRecommendations: [
      { name: 'Claude', description: 'Advanced AI with strong reasoning for complex tasks.', useCase: `Your go-to for drafting, analysis, and thinking through complex problems. Particularly strong at nuanced communication and multi-step reasoning.` },
      { name: 'ChatGPT Plus', description: 'Versatile AI assistant with broad capabilities.', useCase: `Quick tasks, brainstorming, and general acceleration. The Swiss Army knife of AI tools—good at almost everything.` },
      { name: 'Notion AI', description: 'AI embedded in your workspace.', useCase: `Generate content within your existing documents and projects. Great for keeping AI assistance connected to your actual work context.` },
    ],
    masterPrompts: [
      { title: 'Strategic Thinking Accelerator', prompt: `I'm working on a strategic challenge: ${problem}. Help me think through this using first-principles: 1) What's the fundamental problem we're actually trying to solve? 2) What are we assuming that might not be true? 3) What would we do if we started from scratch? 4) What's the simplest path to testing our hypothesis?` },
      { title: 'Decision Framework', prompt: `I need to make a decision about ${problem}. Apply dialectical reasoning: What's the strongest case FOR moving forward? What's the strongest case AGAINST? What synthesis or middle path might capture the benefits while mitigating the risks? Give me a clear recommendation with your reasoning.` },
    ],
  };
}
