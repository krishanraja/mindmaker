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

const FRICTION_MAP_PROMPT = `You are an AI implementation strategist for MindMaker, helping leaders identify friction in their workflows and recommend AI solutions.

Analyze the user's problem and return a JSON response with this exact structure:
{
  "currentState": "A 2-3 sentence description of how this problem is typically handled today without AI, focusing on the pain points and inefficiencies.",
  "aiEnabledState": "A 2-3 sentence description of how this would work with AI implementation, focusing on the transformation and benefits.",
  "timeSaved": "A specific estimate like '5-8 hours per week' or '60% reduction in processing time' with brief reasoning.",
  "toolRecommendations": [
    {
      "name": "Tool Name",
      "description": "One sentence explaining what this tool does.",
      "useCase": "Specific use case for solving their problem."
    }
  ],
  "masterPrompts": [
    {
      "title": "Prompt Title (e.g., 'Weekly Report Generator')",
      "prompt": "A ready-to-use prompt with [PLACEHOLDERS] for their specific context. Make it actionable and specific to their problem."
    }
  ]
}

Guidelines:
- Provide 3-5 tool recommendations, mixing well-known tools (ChatGPT, Claude, Notion AI) with specialized ones
- Provide 2-3 master prompts that are immediately usable
- Use [YOUR_ROLE], [YOUR_COMPANY], [SPECIFIC_TASK], [TIME_PERIOD] style placeholders
- Be specific to their industry/context if mentioned
- Focus on practical, immediate wins over complex implementations
- Time savings should be realistic and defensible

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
      currentState: 'Writing tasks require significant time for drafting, editing, and ensuring consistent tone across communications.',
      aiEnabledState: 'AI assists with first drafts, tone adjustments, and format consistency, reducing writing time by 60-70%.',
      timeSaved: '5-8 hours per week',
      toolRecommendations: [
        { name: 'Claude', description: 'Advanced AI for nuanced writing and editing.', useCase: 'Draft and refine professional communications.' },
        { name: 'Grammarly', description: 'AI-powered writing assistant.', useCase: 'Real-time grammar, tone, and clarity improvements.' },
        { name: 'Copy.ai', description: 'Marketing copy generator.', useCase: 'Generate multiple variations of marketing content.' },
      ],
      masterPrompts: [
        { title: 'Professional Email Drafter', prompt: 'You are a professional communication specialist. Draft an email for [YOUR_ROLE] at [YOUR_COMPANY] addressing [RECIPIENT_ROLE] about [TOPIC]. Tone should be [professional/friendly/urgent]. Key points to cover: [POINT_1], [POINT_2], [POINT_3]. Keep it under [WORD_COUNT] words.' },
        { title: 'Content Repurposer', prompt: 'Take this [CONTENT_TYPE]: "[PASTE_CONTENT]" and repurpose it into [NUMBER] variations for [PLATFORM/AUDIENCE]. Maintain the core message while adapting tone and format for each version.' },
      ],
    };
  }

  if (isData) {
    return {
      currentState: 'Data analysis and research tasks involve manual collection, processing, and interpretation across multiple sources.',
      aiEnabledState: 'AI automates data gathering, pattern recognition, and initial analysis, enabling faster insights.',
      timeSaved: '6-10 hours per week',
      toolRecommendations: [
        { name: 'ChatGPT + Code Interpreter', description: 'Data analysis with natural language.', useCase: 'Upload data and get instant analysis and visualizations.' },
        { name: 'Perplexity AI', description: 'AI-powered research assistant.', useCase: 'Comprehensive research with cited sources.' },
        { name: 'Julius AI', description: 'Specialized data analysis tool.', useCase: 'Complex data transformations and insights.' },
      ],
      masterPrompts: [
        { title: 'Data Analysis Framework', prompt: 'Analyze this [DATA_TYPE] data: [PASTE_OR_DESCRIBE_DATA]. I need: 1) Key trends and patterns, 2) Anomalies or concerns, 3) Actionable recommendations for [YOUR_GOAL]. Present findings in a format suitable for [AUDIENCE].' },
        { title: 'Research Synthesizer', prompt: 'I need comprehensive research on [TOPIC] for [PURPOSE]. Focus areas: [AREA_1], [AREA_2]. Provide: key findings, conflicting viewpoints, gaps in current knowledge, and recommended next steps. Cite sources where possible.' },
      ],
    };
  }

  if (isMeetings) {
    return {
      currentState: 'Meetings generate scattered notes, action items get lost, and follow-up requires manual effort.',
      aiEnabledState: 'AI captures, summarizes, and tracks meeting outcomes automatically, ensuring nothing falls through.',
      timeSaved: '3-5 hours per week',
      toolRecommendations: [
        { name: 'Otter.ai', description: 'AI meeting transcription and notes.', useCase: 'Automatic meeting recording and smart summaries.' },
        { name: 'Notion AI', description: 'Integrated workspace with AI.', useCase: 'Organize and query meeting notes with AI assistance.' },
        { name: 'Fireflies.ai', description: 'Meeting intelligence platform.', useCase: 'Search across all meetings and extract insights.' },
      ],
      masterPrompts: [
        { title: 'Meeting Summary Generator', prompt: 'Here are notes from a [MEETING_TYPE] meeting: "[PASTE_NOTES]". Create: 1) Executive summary (3 sentences), 2) Key decisions made, 3) Action items with owners and deadlines, 4) Open questions requiring follow-up. Format for sharing with [AUDIENCE].' },
        { title: 'Pre-Meeting Prep', prompt: 'I have a [MEETING_TYPE] meeting about [TOPIC] with [ATTENDEES]. Based on these background materials: [PASTE_CONTEXT], prepare: 1) Key talking points, 2) Potential questions I might face, 3) Recommended outcomes to push for.' },
      ],
    };
  }

  return {
    currentState: 'Current workflow involves manual steps, context-switching, and repetitive tasks that consume valuable time.',
    aiEnabledState: 'AI handles routine elements, maintains context, and accelerates decision-making across the workflow.',
    timeSaved: '4-7 hours per week',
    toolRecommendations: [
      { name: 'ChatGPT', description: 'Versatile AI assistant for various tasks.', useCase: 'Draft, analyze, and ideate across different contexts.' },
      { name: 'Claude', description: 'AI assistant with strong reasoning.', useCase: 'Complex analysis and nuanced communication.' },
      { name: 'Notion AI', description: 'AI-powered workspace.', useCase: 'Organize information and generate content in context.' },
    ],
    masterPrompts: [
      { title: 'Task Accelerator', prompt: 'I am a [YOUR_ROLE] at [YOUR_COMPANY]. I need help with [SPECIFIC_TASK]. Context: [RELEVANT_BACKGROUND]. Please provide: 1) A clear approach, 2) Potential pitfalls to avoid, 3) A draft output I can refine. Format the response for [INTENDED_USE].' },
      { title: 'Decision Framework', prompt: 'Help me think through this decision: [DESCRIBE_DECISION]. Key factors: [FACTOR_1], [FACTOR_2], [FACTOR_3]. Constraints: [CONSTRAINTS]. Provide a structured analysis with pros/cons and a recommended path forward.' },
    ],
  };
}
