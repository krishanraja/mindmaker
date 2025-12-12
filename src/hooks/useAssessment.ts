import { useState, useCallback } from 'react';

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
  type: 'Curious Explorer' | 'Strategic Builder' | 'Transformation Leader';
  description: string;
  strengths: string[];
  nextSteps: string[];
  recommendedProduct: string;
  productLink: string;
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

  const answerQuestion = useCallback((questionId: string, value: string) => {
    setAnswers(prev => ({ ...prev, [questionId]: value }));
  }, []);

  const generateProfile = useCallback(() => {
    // Calculate total score
    let totalScore = 0;
    QUESTIONS.forEach(q => {
      const answer = answers[q.id];
      const option = q.options.find(o => o.value === answer);
      if (option) totalScore += option.score;
    });

    let generatedProfile: BuilderProfile;

    if (totalScore <= 4) {
      generatedProfile = {
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
      generatedProfile = {
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
      generatedProfile = {
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

    setProfile(generatedProfile);
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
  }, []);

  return {
    currentStep,
    questions: QUESTIONS,
    answers,
    profile,
    answerQuestion,
    nextQuestion,
    reset,
  };
};
