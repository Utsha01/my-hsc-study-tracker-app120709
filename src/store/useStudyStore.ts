import { create } from "zustand";
import { persist } from "zustand/middleware";
import { buildDefaultSubjects, DEFAULT_EXAM_DATE } from "@/data/syllabus";
import { dateKey, todayKey, uid } from "@/lib/utils";
import type {
  AppSettings,
  Chapter,
  DailyLog,
  StudySession,
  Subject,
  Todo,
} from "./types";

interface StudyState {
  subjects: Subject[];
  sessions: StudySession[];
  todos: Todo[];
  dailyLogs: DailyLog[];
  settings: AppSettings;

  // chapters
  toggleChapter: (subjectId: string, paperId: string, chapterId: string) => void;
  addChapter: (subjectId: string, paperId: string, name: string) => void;
  removeChapter: (subjectId: string, paperId: string, chapterId: string) => void;

  // subjects
  addSubject: (name: string, color?: string) => void;
  removeSubject: (subjectId: string) => void;

  // sessions
  addSession: (subjectId: string | null, durationMinutes: number) => void;

  // todos
  addTodo: (text: string) => void;
  toggleTodo: (id: string) => void;
  removeTodo: (id: string) => void;

  // settings & data
  updateSettings: (patch: Partial<AppSettings>) => void;
  exportData: () => string;
  clearCache: () => void;
}

const initialData = () => ({
  subjects: buildDefaultSubjects(),
  sessions: [] as StudySession[],
  todos: [
    {
      id: uid(),
      text: "Revise one chapter of Physics 1st Paper",
      completed: false,
      createdAt: new Date().toISOString(),
    },
    {
      id: uid(),
      text: "Solve 20 Higher Math problems",
      completed: false,
      createdAt: new Date().toISOString(),
    },
  ] as Todo[],
  dailyLogs: [] as DailyLog[],
  settings: {
    profileName: "Scholar",
    examDate: DEFAULT_EXAM_DATE,
  } as AppSettings,
});

const bumpLog = (
  logs: DailyLog[],
  patch: Partial<Pick<DailyLog, "studyMinutes" | "tasksCompleted">>
): DailyLog[] => {
  const key = todayKey();
  const idx = logs.findIndex((l) => l.date === key);
  if (idx === -1) {
    return [
      ...logs,
      {
        date: key,
        studyMinutes: patch.studyMinutes ?? 0,
        tasksCompleted: patch.tasksCompleted ?? 0,
      },
    ];
  }
  const next = [...logs];
  next[idx] = {
    ...next[idx],
    studyMinutes: next[idx].studyMinutes + (patch.studyMinutes ?? 0),
    tasksCompleted: next[idx].tasksCompleted + (patch.tasksCompleted ?? 0),
  };
  return next;
};

export const useStudyStore = create<StudyState>()(
  persist(
    (set, get) => ({
      ...initialData(),

      toggleChapter: (subjectId, paperId, chapterId) =>
        set((s) => ({
          subjects: s.subjects.map((sub) =>
            sub.id !== subjectId
              ? sub
              : {
                  ...sub,
                  papers: sub.papers.map((p) =>
                    p.id !== paperId
                      ? p
                      : {
                          ...p,
                          chapters: p.chapters.map((c: Chapter) =>
                            c.id === chapterId ? { ...c, completed: !c.completed } : c
                          ),
                        }
                  ),
                }
          ),
        })),

      addChapter: (subjectId, paperId, name) =>
        set((s) => ({
          subjects: s.subjects.map((sub) =>
            sub.id !== subjectId
              ? sub
              : {
                  ...sub,
                  papers: sub.papers.map((p) =>
                    p.id !== paperId
                      ? p
                      : {
                          ...p,
                          chapters: [
                            ...p.chapters,
                            { id: uid(), name: name.trim(), completed: false },
                          ],
                        }
                  ),
                }
          ),
        })),

      removeChapter: (subjectId, paperId, chapterId) =>
        set((s) => ({
          subjects: s.subjects.map((sub) =>
            sub.id !== subjectId
              ? sub
              : {
                  ...sub,
                  papers: sub.papers.map((p) =>
                    p.id !== paperId
                      ? p
                      : {
                          ...p,
                          chapters: p.chapters.filter((c) => c.id !== chapterId),
                        }
                  ),
                }
          ),
        })),

      addSubject: (name, color = "#10b981") =>
        set((s) => ({
          subjects: [
            ...s.subjects,
            {
              id: uid(),
              name: name.trim(),
              color,
              papers: [{ id: uid(), name: "Full Syllabus", chapters: [] }],
            },
          ],
        })),

      removeSubject: (subjectId) =>
        set((s) => ({ subjects: s.subjects.filter((sub) => sub.id !== subjectId) })),

      addSession: (subjectId, durationMinutes) =>
        set((s) => ({
          sessions: [
            ...s.sessions,
            {
              id: uid(),
              subjectId,
              date: new Date().toISOString(),
              durationMinutes,
            },
          ],
          dailyLogs: bumpLog(s.dailyLogs, { studyMinutes: durationMinutes }),
        })),

      addTodo: (text) =>
        set((s) => ({
          todos: [
            ...s.todos,
            {
              id: uid(),
              text: text.trim(),
              completed: false,
              createdAt: new Date().toISOString(),
            },
          ],
        })),

      toggleTodo: (id) =>
        set((s) => {
          const todo = s.todos.find((t) => t.id === id);
          const becameComplete = todo ? !todo.completed : false;
          return {
            todos: s.todos.map((t) =>
              t.id === id ? { ...t, completed: !t.completed } : t
            ),
            dailyLogs: becameComplete
              ? bumpLog(s.dailyLogs, { tasksCompleted: 1 })
              : s.dailyLogs,
          };
        }),

      removeTodo: (id) =>
        set((s) => ({ todos: s.todos.filter((t) => t.id !== id) })),

      updateSettings: (patch) =>
        set((s) => ({ settings: { ...s.settings, ...patch } })),

      exportData: () => {
        const { subjects, sessions, todos, dailyLogs, settings } = get();
        return JSON.stringify(
          {
            app: "HSC Pinnacle Ultra",
            exportedAt: new Date().toISOString(),
            settings,
            subjects,
            sessions,
            todos,
            dailyLogs,
          },
          null,
          2
        );
      },

      clearCache: () => set({ ...initialData() }),
    }),
    {
      name: "hsc-pinnacle-storage",
      version: 2,
    }
  )
);

/* ---------- derived helpers ---------- */

export const minutesForDate = (
  sessions: StudySession[],
  logs: DailyLog[],
  key: string
): number => {
  const log = logs.find((l) => l.date === key);
  if (log) return log.studyMinutes;
  return sessions
    .filter((s) => dateKey(s.date) === key)
    .reduce((a, s) => a + s.durationMinutes, 0);
};

export const subjectProgress = (subject: Subject): number => {
  const total = subject.papers.reduce((a, p) => a + p.chapters.length, 0);
  const done = subject.papers.reduce(
    (a, p) => a + p.chapters.filter((c) => c.completed).length,
    0
  );
  return total > 0 ? Math.round((done / total) * 100) : 0;
};

export const subjectCounts = (subject: Subject): { done: number; total: number } => {
  const total = subject.papers.reduce((a, p) => a + p.chapters.length, 0);
  const done = subject.papers.reduce(
    (a, p) => a + p.chapters.filter((c) => c.completed).length,
    0
  );
  return { done, total };
};
