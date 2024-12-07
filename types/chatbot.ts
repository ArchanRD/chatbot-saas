export interface ChatbotConfig {
    name: string;
    description: string;
    language: string;
    personality: string;
    initialMessage: string;
    maxResponseLength: number;
    tone: 'professional' | 'casual' | 'friendly';
    avatar?: string;
  }
  
  export type StepStatus = 'upcoming' | 'current' | 'complete';
  
  export interface Step {
    id: number;
    title: string;
    description: string;
    status: StepStatus;
  }