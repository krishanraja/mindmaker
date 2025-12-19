import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface AssessmentQuestion {
  id: string;
  question: string;
  options: {
    value: string;
    label: string;
    score: number;
  }[];
}

export interface BuilderProfile {
  type: string;
  description: string;
  strengths: string[];
  nextSteps: string[];
  recommendedProduct: string;
  productLink: string;
  frameworkUsed?: string;
}

const QUESTIONS: AssessmentQuestion[] = [
  {
    id: 'approach',
    question: 'How do you currently approach AI in your work?',
    options: [
      { value: 'exploring', label: "I'm exploring but haven't built systems yet", score: 1 },
      { value: 'experimenting', label: "I'm experimenting with a few tools", score: 2 },
      { value: 'building', label: "I'm actively building AI workflows", score: 3 },
    ],
  },
  {
    id: 'frustration',
    question: "What's your biggest AI frustration?",
    options: [
      { value: 'overwhelm', label: 'Too many tools, unclear where to start', score: 1 },
      { value: 'implementation', label: "I know what's possible but can't implement", score: 2 },
      { value: 'scale', label: 'Built pilots but struggling to scale', score: 3 },
    ],
  },
  {
    id: 'goal',
    question: 'What would success look like for you in 90 days?',
    options: [
      { value: 'clarity', label: 'Clear understanding of AI for my role', score: 1 },
      { value: 'systems', label: '3-5 working AI systems I use daily', score: 2 },
      { value: 'transformation', label: 'Team-wide AI transformation underway', score: 3 },
    ],
  },
];

export const useAssessment = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [profile, setProfile] = useState<BuilderProfile | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const answerQuestion = useCallback((questionId: string, value: string) => {
    setAnswers(prev => ({ ...prev, [questionId]: value }));
  }, []);

  const generateProfile = useCallback(async () => {
    setIsGenerating(true);
    setError(null);

    // Calculate total score for fallback
    let totalScore = 0;
    QUESTIONS.forEach(q => {
      const answer = answers[q.id];
      const option = q.options.find(o => o.value === answer);
      if (option) totalScore += option.score;
    });

    // Build context from answers for AI
    const answerSummary = QUESTIONS.map(q => {
      const answer = answers[q.id];
      const option = q.options.find(o => o.value === answer);
      return `${q.question}: ${option?.label || 'Not answered'}`;
    }).join('\n');

    try {
      const { data, error: apiError } = await supabase.functions.invoke('chat-with-krish', {
        body: {
          messages: [
            {
              role: 'user',
              content: `Generate a personalized AI Builder Profile for this leader based on their assessment answers:

${answerSummary}

Return ONLY a valid JSON object (no markdown, no explanation) with this exact structure:
{
  "type": "A creative 2-3 word profile title (e.g., 'Strategic Visionary', 'Pragmatic Builder', 'Innovation Catalyst')",
  "description": "A personalized 2-sentence description of their AI journey stage and potential",
  "frameworkUsed": "Name of the Mindmaker framework you applied (e.g., 'First-Principles Thinking')",
  "strengths": ["3 specific strengths based on their answers"],
  "nextSteps": ["3 personalized, actionable next steps mentioning specific Mindmaker programs"],
  "recommendedProduct": "Builder Session OR AI Literacy-to-Influence OR AI Leadership Lab",
  "productLink": "/builder-session OR /builder-sprint OR /leadership-lab"
}

Apply the Mindmaker Five Cognitive Frameworks to analyze their responses. Be specific and avoid generic advice. Reference their actual answers in the profile.`
            }
          ],
          widgetMode: 'tryit'
        }
      });

      if (apiError) throw new Error(apiError.message || 'API error');

      // Parse the AI response with robust extraction
      const responseText = data?.message || '';
      
      // Try multiple JSON extraction strategies
      let parsed: any = null;
      
      // Strategy 1: Direct JSON parse (if response is pure JSON)
      try {
        parsed = JSON.parse(responseText.trim());
      } catch {
        // Strategy 2: Extract JSON object from markdown or mixed content
        const jsonMatch = responseText.match(/\{[\s\S]*?\}(?=[^}]*$)/);
        if (jsonMatch) {
          try {
            parsed = JSON.parse(jsonMatch[0]);
          } catch {
            // Strategy 3: More aggressive extraction - find outermost braces
            const start = responseText.indexOf('{');
            const end = responseText.lastIndexOf('}');
            if (start !== -1 && end > start) {
              try {
                parsed = JSON.parse(responseText.slice(start, end + 1));
              } catch {
                // Give up on parsing
              }
            }
          }
        }
      }
      
      // Validate the parsed object has required fields
      if (parsed && parsed.type && (parsed.strengths || parsed.nextSteps)) {
        setProfile({
          type: parsed.type || 'AI Builder',
          description: parsed.description || "You're on a unique AI journey with significant potential.",
          strengths: Array.isArray(parsed.strengths) ? parsed.strengths : ['Strategic thinking', 'Leadership drive', 'Growth mindset'],
          nextSteps: Array.isArray(parsed.nextSteps) ? parsed.nextSteps : ['Book a Builder Session to map your first AI system'],
          recommendedProduct: parsed.recommendedProduct || 'Builder Session',
          productLink: parsed.productLink || '/builder-session',
          frameworkUsed: parsed.frameworkUsed,
        });
        return;
      }
      
      throw new Error('Invalid AI response structure');
    } catch (err) {
      console.error('AI profile generation failed:', err);
      // Fallback to score-based profile
      let fallbackProfile: BuilderProfile;
      
      if (totalScore <= 4) {
        fallbackProfile = {
          type: 'Curious Explorer',
          description: "You're at the beginning of your AI journey. You see the potential but need a structured entry point.",
          strengths: ['Open mindset', 'Willingness to learn', 'Recognition of AI importance'],
          nextSteps: [
            'Start with a 1:1 Builder Session to build your first system',
            'Focus on one high-impact use case',
            'Build confidence through hands-on practice',
          ],
          recommendedProduct: 'Builder Session',
          productLink: '/builder-session',
        };
      } else if (totalScore <= 7) {
        fallbackProfile = {
          type: 'Strategic Builder',
          description: "You're actively experimenting and ready to systematize your approach.",
          strengths: ['Hands-on experience', 'Understanding of possibilities', 'Ready for structure'],
          nextSteps: [
            'Join AI Literacy-to-Influence to build working systems',
            'Develop a personal AI operating system',
            'Create reusable frameworks for your work',
          ],
          recommendedProduct: 'AI Literacy-to-Influence',
          productLink: '/builder-sprint',
        };
      } else {
        fallbackProfile = {
          type: 'Transformation Leader',
          description: "You're thinking at scale and ready to transform how your team works.",
          strengths: ['Strategic vision', 'Implementation experience', 'Leadership mandate'],
          nextSteps: [
            'Run an AI Leadership Lab for your executive team',
            'Build organization-wide AI capabilities',
            'Create a 90-day transformation roadmap',
          ],
          recommendedProduct: 'AI Leadership Lab',
          productLink: '/leadership-lab',
        };
      }
      setProfile(fallbackProfile);
    } finally {
      setIsGenerating(false);
    }
  }, [answers]);

  const nextQuestion = useCallback(() => {
    if (currentStep < QUESTIONS.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      generateProfile();
    }
  }, [currentStep, generateProfile]);

  const reset = useCallback(() => {
    setCurrentStep(0);
    setAnswers({});
    setProfile(null);
    setError(null);
  }, []);

  return {
    currentStep,
    questions: QUESTIONS,
    answers,
    profile,
    isGenerating,
    error,
    answerQuestion,
    nextQuestion,
    reset,
  };
};
