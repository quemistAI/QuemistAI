export interface Topic {
  id: string;
  name: string;
  level: "Orgo 1" | "Orgo 2";
  description: string;
  tags: string[];
}

export interface PracticeQuestion {
  id: string;
  topicId: string;
  questionText: string;
  initialStructures?: string;
  hint: string;
  options?: string[]; // If multiple choice
  correctAnswer?: string; // Correct choice or structural formula
  type: "multiple-choice" | "free-response";
}

export type TutorMode = "general" | "photo_analysis" | "synthesis" | "spectroscopy";

export interface Message {
  id: string;
  sender: "student" | "ai";
  text: string;
  timestamp: Date;
  image?: string; // base64 representation of image
  mode?: TutorMode;
  isDetailed?: boolean;
}

export interface ChemistryTool {
  id: string;
  name: string;
  description: string;
  icon: string;
  mode: TutorMode;
  placeholder: string;
}
