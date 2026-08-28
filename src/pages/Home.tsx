import { GlassCard, ProgressBar, SectionTitle, StatTile, TextInput, pageWrap } from "@/components/ui";
import { addDays, dateKey, daysUntil, greeting, todayKey } from "@/lib/utils";
import {
  minutesForDate,
  subjectCounts,
  subjectProgress,
  useStudyStore,
} from "@/store/useStudyStore";
import { cn } from "@/utils/cn";
import { motion } from "framer-motion";
import {
  ArrowRight,
  BarChart3,
  BookOpen,
  CalendarClock,
  Check,
  ChevronRight,
  Flame,
  Plus,
  Sparkles,
  Target,
  Timer,
  Trash2,
  TrendingUp,
} from "lucide-react";
import { useMemo, useState } from "react";
import { Link } from "react-router-dom";

const QUICK = [
  { to: "/timer", label: "Focus", sub: "Start a session", icon: Timer },
  { to: "/subjects", label: "Subjects", sub: "Track syllabus", icon: BookOpen },
  { to: "/insights", label: "Insights", sub: "Neural stats", icon: BarChart3 },
];

export default function HomePage() {
  const { subjects, sessions, todos, dailyLogs, settings, addTodo, toggleTodo, removeTodo } =
    useStudyStore();
  const [task, setTask] = useState("");

  const todayMin = minutesForDate(sessions, dailyLogs, todayKey());
  const examDays = daysUntil(settings.examDate);

  const streak = useMemo(() => {
    let count = 0;
    for (let i = 0; i < 400; i++) {
      const key = dateKey(addDays(new Date(), -i));
      if (minutesForDate(sessions, dailyLogs, key) > 0) count++;
      else if (i > 0) break;
      else continue;
    }
    return count;
  }, [sessions, dailyLogs]);

  const overall = useMemo(() => {
    let total = 0;
    let done = 0;
    subjects.forEach((s) => {
      const c = subjectCounts(s);
      total += c.total;
      done += c.done;
    });
    return total > 0 ? Math.round((done / total) * 100) : 0;
  }, [subjects]);

  const topSubjects = useMemo(
    () =>
      [...subjects]
        .map((s) => ({ s, pct: subjectProgress(s) }))
        .sort((a, b) => b.pct - a.pct)
        .slice(0, 4),
    [subjects]
  );

  const openTodos = todos.filter((t) => !t.completed);
  const doneTodos = todos.filter((t) => t.completed);

  const submit = () => {
    if (!task.trim()) return;
    addTodo(task);
    setTask("");
  };

  const firstName = (settings.profileName || "Scholar").split(" ")[0];

  return (
    <div className={pageWrap}>
      {/* header */}
      <motion.header
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-5 flex items-center justify-between"
      >
        <div>
          <p className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.22em] text-primary">
            <Sparkles size={12} /> HSC Pinnacle
          </p>
          <h1 className="font-display mt-1 text-2xl font-bold leading-tight lg:text-3xl">
            {greeting()}, {firstName}
          </h1>
        </div>
        <div className="glass-card flex h-11 w-11 items-center justify-center !rounded-full text-primary">
          <Target size={20} />
        </div>
      </motion.header>

      {/* countdown hero */}
      <GlassCard className="relative overflow-hidden p-5">
        <div
          className="pointer-events-none absolute -right-10 -top-14 h-44 w-44 rounded-full blur-3xl"
          style={{ background: "hsl(var(--primary) / 0.22)" }}
        />
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
              <CalendarClock size={12} className="text-accent" /> HSC Exam Countdown
            </p>
            <p className="font-display mt-2 text-6xl font-bold leading-none text-primary drop-shadow-[0_0_22px_hsl(var(--primary)/0.45)]">
              {examDays ?? "--"}
            </p>
            <p className="mt-1.5 text-xs text-muted-foreground">
              {examDays === null
                ? "Set your exam date in Settings"
                : examDays === 0
                  ? "The day is here. Give it everything."
                  : "days remaining — own every one of them"}
            </p>
          </div>
          <div className="flex flex-col items-center gap-1.5">
            <div className="glass-soft flex h-16 w-16 flex-col items-center justify-center">
              <span className="font-display text-xl font-bold text-accent">{overall}%</span>
              <span className="text-[8px] font-semibold tracking-widest text-muted-foreground">
                SYLLABUS
              </span>
            </div>
          </div>
        </div>
      </GlassCard>

      {/* stats */}
      <div className="mt-4 grid grid-cols-3 gap-3">
        <StatTile
          label="TODAY"
          value={`${todayMin}m`}
          colorClass="text-primary"
          icon={<TrendingUp size={13} className="text-primary/70" />}
          delay={0.05}
        />
        <StatTile
          label="STREAK"
          value={streak}
          colorClass="text-accent"
          icon={<Flame size={13} className="text-accent/80" />}
          delay={0.1}
        />
        <StatTile
          label="TASKS OPEN"
          value={openTodos.length}
          colorClass="text-primary"
          delay={0.15}
        />
      </div>

      {/* quick actions */}
      <div className="mt-6">
        <SectionTitle>Quick Actions</SectionTitle>
        <div className="grid grid-cols-3 gap-3">
          {QUICK.map((q, i) => (
            <Link key={q.to} to={q.to} className="press-scale">
              <GlassCard delay={0.1 + i * 0.05} className="flex h-full flex-col items-center gap-1.5 p-3.5 text-center">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/12 text-primary shadow-[inset_0_0_0_1px_hsl(var(--primary)/0.25)]">
                  <q.icon size={18} />
                </span>
                <span className="font-display text-xs font-semibold">{q.label}</span>
                <span className="text-[9px] text-muted-foreground">{q.sub}</span>
              </GlassCard>
            </Link>
          ))}
        </div>
      </div>

      {/* tasks */}
      <div className="mt-6">
        <SectionTitle
          action={
            <span className="text-[10px] font-semibold text-muted-foreground">
              {doneTodos.length}/{todos.length} done
            </span>
          }
        >
          Today's Tasks
        </SectionTitle>
        <GlassCard className="p-3.5">
          <div className="flex gap-2">
            <TextInput
              value={task}
              onChange={(e) => setTask(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && submit()}
              placeholder="Add a task for today…"
            />
            <button
              onClick={submit}
              className="press-scale flex h-[42px] w-[42px] shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-[0_0_16px_hsl(var(--primary)/0.4)]"
              aria-label="Add task"
            >
              <Plus size={18} />
            </button>
          </div>
          <div className="mt-3 space-y-1.5">
            {todos.length === 0 && (
              <p className="py-4 text-center text-xs text-muted-foreground">
                No tasks yet — plan today's study.
              </p>
            )}
            {[...openTodos, ...doneTodos].map((t) => (
              <motion.div
                layout
                key={t.id}
                className="group flex items-center gap-2.5 rounded-xl bg-secondary/40 px-2.5 py-2"
              >
                <button
                  onClick={() => toggleTodo(t.id)}
                  aria-label="Toggle task"
                  className={cn(
                    "flex h-5 w-5 shrink-0 items-center justify-center rounded-md border transition-all",
                    t.completed
                      ? "border-primary bg-primary text-primary-foreground shadow-[0_0_10px_hsl(var(--primary)/0.5)]"
                      : "border-white/20 hover:border-primary/60"
                  )}
                >
                  {t.completed && <Check size={12} strokeWidth={3} />}
                </button>
                <span
                  className={cn(
                    "flex-1 text-xs",
                    t.completed && "text-muted-foreground line-through opacity-60"
                  )}
                >
                  {t.text}
                </span>
                <button
                  onClick={() => removeTodo(t.id)}
                  aria-label="Delete task"
                  className="text-muted-foreground/50 opacity-0 transition-opacity hover:text-destructive group-hover:opacity-100"
                >
                  <Trash2 size={13} />
                </button>
              </motion.div>
            ))}
          </div>
        </GlassCard>
      </div>

      {/* subject progress */}
      <div className="mt-6">
        <SectionTitle
          action={
            <Link
              to="/subjects"
              className="flex items-center gap-0.5 text-[10px] font-semibold text-primary"
            >
              View all <ArrowRight size={11} />
            </Link>
          }
        >
          Syllabus Mastery
        </SectionTitle>
        <GlassCard className="space-y-3.5 p-4">
          {topSubjects.map(({ s, pct }) => (
            <Link key={s.id} to={`/subjects/${s.id}`} className="block">
              <div className="mb-1.5 flex items-center justify-between text-xs">
                <span className="flex items-center gap-2 font-medium text-foreground/90">
                  <span
                    className="h-2 w-2 rounded-full"
                    style={{ background: s.color, boxShadow: `0 0 8px ${s.color}` }}
                  />
                  {s.name}
                </span>
                <span className="font-display font-semibold text-muted-foreground">{pct}%</span>
              </div>
              <ProgressBar value={pct} color={s.color} />
            </Link>
          ))}
        </GlassCard>
      </div>

      {/* CTA */}
      <Link to="/timer" className="mt-6 block press-scale">
        <div className="glass-card flex items-center justify-between p-4">
          <div className="flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-[0_0_20px_hsl(var(--primary)/0.55)]">
              <Timer size={20} />
            </span>
            <div>
              <p className="font-display text-sm font-semibold">Enter Deep Focus</p>
              <p className="text-[11px] text-muted-foreground">
                One distraction-free session changes everything
              </p>
            </div>
          </div>
          <ChevronRight size={18} className="text-muted-foreground" />
        </div>
      </Link>
    </div>
  );
}
