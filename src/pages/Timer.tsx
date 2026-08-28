import { GlassCard, SectionTitle, pageWrap } from "@/components/ui";
import { fmtClock } from "@/lib/utils";
import { useStudyStore } from "@/store/useStudyStore";
import { cn } from "@/utils/cn";
import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle2, Flag, Pause, Play, RotateCcw } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";

const PRESETS = [
  { label: "Pomodoro", mins: 25 },
  { label: "Short", mins: 15 },
  { label: "Deep", mins: 45 },
  { label: "Hour", mins: 60 },
];

export default function TimerPage() {
  const { subjects, addSession } = useStudyStore();
  const [subjectId, setSubjectId] = useState<string | null>(subjects[0]?.id ?? null);
  const [mins, setMins] = useState(25);
  const [secondsLeft, setSecondsLeft] = useState(25 * 60);
  const [running, setRunning] = useState(false);
  const [done, setDone] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const totalSeconds = mins * 60;
  const elapsed = totalSeconds - secondsLeft;
  const pct = totalSeconds > 0 ? (elapsed / totalSeconds) * 100 : 0;

  const subject = useMemo(
    () => subjects.find((s) => s.id === subjectId) ?? null,
    [subjects, subjectId]
  );

  useEffect(() => {
    if (running) {
      intervalRef.current = setInterval(() => {
        setSecondsLeft((s) => {
          if (s <= 1) {
            clearInterval(intervalRef.current!);
            setRunning(false);
            setDone(true);
            return 0;
          }
          return s - 1;
        });
      }, 1000);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [running]);

  // save session when timer completes
  useEffect(() => {
    if (done) {
      addSession(subjectId, mins);
      navigator.vibrate?.([120, 60, 120]);
      toast.success(`Focus session saved — ${mins} min`, {
        description: subject ? subject.name : "General study",
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [done]);

  const selectPreset = (m: number) => {
    setMins(m);
    setSecondsLeft(m * 60);
    setRunning(false);
    setDone(false);
  };

  const reset = () => {
    setRunning(false);
    setDone(false);
    setSecondsLeft(totalSeconds);
  };

  const finishEarly = () => {
    const used = Math.max(1, Math.round(elapsed / 60));
    addSession(subjectId, used);
    toast.success(`Session logged — ${used} min`, {
      description: subject ? subject.name : "General study",
    });
    navigator.vibrate?.(80);
    reset();
  };

  const size = 264;
  const stroke = 12;
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;

  return (
    <div className={pageWrap}>
      <h1 className="font-display mb-1 text-xl font-bold lg:text-3xl">Deep Focus</h1>
      <p className="mb-4 text-xs text-muted-foreground">
        Pick a subject, set your target, and go all in.
      </p>

      {/* subject chips */}
      <div className="no-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4 pb-1">
        <button
          onClick={() => setSubjectId(null)}
          className={cn(
            "press-scale shrink-0 rounded-full border px-3.5 py-1.5 text-[11px] font-semibold transition-all",
            subjectId === null
              ? "border-primary bg-primary/15 text-primary"
              : "border-white/10 bg-secondary/40 text-muted-foreground"
          )}
        >
          General
        </button>
        {subjects.map((s) => (
          <button
            key={s.id}
            onClick={() => setSubjectId(s.id)}
            className={cn(
              "press-scale shrink-0 rounded-full border px-3.5 py-1.5 text-[11px] font-semibold transition-all",
              subjectId === s.id
                ? "border-transparent text-primary-foreground"
                : "border-white/10 bg-secondary/40 text-muted-foreground"
            )}
            style={
              subjectId === s.id
                ? { background: s.color, boxShadow: `0 0 16px ${s.color}70` }
                : undefined
            }
          >
            {s.name}
          </button>
        ))}
      </div>

      {/* ring */}
      <div className="mt-6 flex flex-col items-center">
        <div className="relative" style={{ width: size, height: size }}>
          <div
            className="absolute inset-0 rounded-full blur-2xl transition-opacity"
            style={{
              background: "hsl(var(--primary) / 0.18)",
              opacity: running ? 1 : 0.4,
            }}
          />
          <svg width={size} height={size} className="-rotate-90">
            <circle
              cx={size / 2}
              cy={size / 2}
              r={r}
              fill="none"
              stroke="hsl(var(--muted))"
              strokeWidth={stroke}
            />
            <circle
              cx={size / 2}
              cy={size / 2}
              r={r}
              fill="none"
              stroke={subject?.color ?? "hsl(var(--primary))"}
              strokeWidth={stroke}
              strokeLinecap="round"
              strokeDasharray={c}
              strokeDashoffset={c - (c * pct) / 100}
              style={{
                transition: "stroke-dashoffset 1s linear, stroke 0.3s ease",
                filter: `drop-shadow(0 0 10px ${subject?.color ?? "hsl(var(--primary) / 0.8)"})`,
              }}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <AnimatePresence mode="wait">
              {done ? (
                <motion.div
                  key="done"
                  initial={{ scale: 0.7, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="flex flex-col items-center"
                >
                  <CheckCircle2 size={40} className="text-primary" />
                  <p className="font-display mt-2 text-lg font-bold text-primary">
                    Session Complete
                  </p>
                  <p className="text-[11px] text-muted-foreground">{mins} minutes logged</p>
                </motion.div>
              ) : (
                <motion.div key="clock" className="flex flex-col items-center">
                  <p className="font-display text-6xl font-bold tabular-nums tracking-tight">
                    {fmtClock(secondsLeft)}
                  </p>
                  <p className="mt-1.5 text-[11px] font-semibold uppercase tracking-[0.25em] text-muted-foreground">
                    {running ? "Focusing" : "Ready"}
                  </p>
                  {subject && (
                    <p
                      className="mt-1 text-[11px] font-semibold"
                      style={{ color: subject.color }}
                    >
                      {subject.name}
                    </p>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* controls */}
        <div className="mt-7 flex items-center gap-4">
          <button
            onClick={reset}
            aria-label="Reset"
            className="glass-card press-scale flex h-12 w-12 items-center justify-center !rounded-full text-muted-foreground"
          >
            <RotateCcw size={17} />
          </button>
          <button
            onClick={() => {
              if (done) {
                reset();
                return;
              }
              setRunning((r) => !r);
            }}
            aria-label={running ? "Pause" : "Start"}
            className="press-scale flex h-16 w-16 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-[0_0_28px_hsl(var(--primary)/0.55)]"
          >
            {running ? <Pause size={24} /> : <Play size={24} className="ml-0.5" />}
          </button>
          <button
            onClick={finishEarly}
            disabled={elapsed < 60 || done}
            aria-label="Finish early"
            className="glass-card press-scale flex h-12 w-12 items-center justify-center !rounded-full text-muted-foreground disabled:opacity-35"
          >
            <Flag size={15} />
          </button>
        </div>
        <p className="mt-2.5 h-4 text-[10px] text-muted-foreground">
          {elapsed >= 60 && !done && running
            ? "Flag finishes early and logs your minutes"
            : ""}
        </p>
      </div>

      {/* presets */}
      <div className="mt-4">
        <SectionTitle>Session Length</SectionTitle>
        <div className="grid grid-cols-4 gap-2.5">
          {PRESETS.map((p) => (
            <GlassCard
              key={p.mins}
              className={cn("p-0", mins === p.mins && "border-primary/50")}
            >
              <button
                onClick={() => selectPreset(p.mins)}
                className={cn(
                  "flex w-full flex-col items-center gap-0.5 rounded-[inherit] p-3 transition-colors",
                  mins === p.mins && "bg-primary/10"
                )}
              >
                <span
                  className={cn(
                    "font-display text-lg font-bold",
                    mins === p.mins ? "text-primary" : "text-foreground/85"
                  )}
                >
                  {p.mins}
                </span>
                <span className="text-[9px] font-semibold uppercase tracking-wider text-muted-foreground">
                  {p.label}
                </span>
              </button>
            </GlassCard>
          ))}
        </div>
      </div>
    </div>
  );
}
