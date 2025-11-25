import { useState, useCallback } from 'react';

export interface Task {
  id: string;
  name: string;
  hoursPerWeek: number;
  selected: boolean;
  aiTools: string[];
  potentialSavings: number;
}

export interface PortfolioData {
  tasks: Task[];
  totalTimeSaved: number;
  totalCostSavings: number;
  implementationRoadmap: string[];
}

const DEFAULT_TASKS: Omit<Task, 'hoursPerWeek' | 'selected' | 'potentialSavings'>[] = [
  { id: '1', name: 'Strategic Planning & Analysis', aiTools: ['Claude Projects', 'Perplexity Pro', 'Custom GPTs'] },
  { id: '2', name: 'Weekly Reporting & Metrics', aiTools: ['ChatGPT Data Analysis', 'Zapier AI', 'Notion AI'] },
  { id: '3', name: 'Team Communication & Updates', aiTools: ['Slack AI', 'Superhuman', 'Grammarly'] },
  { id: '4', name: 'Decision Documentation', aiTools: ['Notion AI', 'Obsidian + AI', 'Mem'] },
  { id: '5', name: 'Market Research & Competitive Analysis', aiTools: ['Perplexity', 'Claude + Web Search', 'Consensus'] },
];

export const usePortfolio = () => {
  const [tasks, setTasks] = useState<Task[]>(
    DEFAULT_TASKS.map(t => ({
      ...t,
      hoursPerWeek: 0,
      selected: false,
      potentialSavings: 0,
    }))
  );

  const toggleTask = useCallback((taskId: string) => {
    setTasks(prev =>
      prev.map(task =>
        task.id === taskId ? { ...task, selected: !task.selected } : task
      )
    );
  }, []);

  const updateTaskHours = useCallback((taskId: string, hours: number) => {
    setTasks(prev =>
      prev.map(task =>
        task.id === taskId
          ? {
              ...task,
              hoursPerWeek: hours,
              potentialSavings: Math.round(hours * 0.4), // 40% savings
            }
          : task
      )
    );
  }, []);

  const getPortfolioData = useCallback((): PortfolioData => {
    const selectedTasks = tasks.filter(t => t.selected && t.hoursPerWeek > 0);
    const totalTimeSaved = selectedTasks.reduce((sum, t) => sum + t.potentialSavings, 0);
    const hourlyRate = 150; // Estimate
    const totalCostSavings = totalTimeSaved * 4 * hourlyRate; // Weekly to monthly

    return {
      tasks: selectedTasks,
      totalTimeSaved,
      totalCostSavings,
      implementationRoadmap: [
        'Week 1: Set up AI tools for highest-impact task',
        'Week 2-3: Build workflows and test systems',
        'Week 4: Expand to additional tasks',
        'Month 2+: Optimize and scale',
      ],
    };
  }, [tasks]);

  return {
    tasks,
    toggleTask,
    updateTaskHours,
    getPortfolioData,
  };
};
