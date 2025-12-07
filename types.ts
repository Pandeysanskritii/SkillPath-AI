export interface Resource {
  title: string;
  url: string;
  type: string;
  duration: string;
}

export interface Subtopic {
  concept: string;
  explanation: string;
  resources: Resource[];
  task: string;
  acceptance_criteria: string;
}

export interface QuizQuestion {
  question: string;
  options: string[];
  correct_answer: string;
}

export interface Project {
  title: string;
  description: string;
}

export interface Module {
  level: string;
  title: string;
  subtopics: Subtopic[];
  quiz: QuizQuestion[];
  project: Project;
}

export interface RoadmapData {
  topic: string;
  palette: {
    primary: string;
    secondary: string;
    accent: string;
    background?: string;
  };
  summary_markdown: string;
  modules: Module[];
  final_assessment: QuizQuestion[];
  career_guidance: {
    next_steps: string[];
    certifications: string[];
  };
}

export enum AppState {
  IDLE = 'IDLE',
  GENERATING = 'GENERATING',
  READY = 'READY',
  ERROR = 'ERROR'
}