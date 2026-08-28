export interface Chapter {
  id: string;
  name: string;
  completed: boolean;
}

export interface Paper {
  id: string;
  name: string;
  chapters: Chapter[];
}

export interface Subject {
  id: string;
  name: string;
  color: string;
  papers: Paper[];
}

export interface StudySession {
  id: string;
  subjectId: string | null;
  date: string; // ISO
  durationMinutes: number;
}

export interface Todo {
  id: string;
  text: string;
  completed: boolean;
  createdAt: string; // ISO
}

export interface DailyLog {
  date: string; // YYYY-MM-DD
  studyMinutes: number;
  tasksCompleted: number;
}

export interface AppSettings {
  profileName: string;
  examDate: string; // YYYY-MM-DD
}
