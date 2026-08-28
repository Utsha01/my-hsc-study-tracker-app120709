import { GlassCard, SectionTitle, StatTile, pageWrap } from "@/components/ui";
import { addDays, dateKey, todayKey } from "@/lib/utils";
import {
  minutesForDate,
  subjectCounts,
  subjectProgress,
  useStudyStore,
} from "@/store/useStudyStore";
import {
  BrainCircuit,
  Flame,
  Lightbulb,
  Rocket,
  TrendingDown,
  TrendingUp,
  Trophy,
} from "lucide-react";
import { useMemo } from "react";
import {
  Bar,
  BarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const masteryBg = (pct: number): string =>
  pct >= 90
    ? "hsl(var(--primary))"
    : pct >= 70
      ? "hsl(var(--primary) / 0.7)"
      : pct >= 50
        ? "hsl(var(--primary) / 0.45)"
        : pct >= 25
          ? "hsl(var(--primary) / 0.25)"
          : pct > 0
            ? "hsl(var(--primary) / 0.12)"
            : "hsl(var(--muted))";

export default function InsightsPage() {
  const { subjects, sessions, todos, dailyLogs } = useStudyStore();

  const todayMin = minutesForDate(sessions, dailyLogs, todayKey());
  const yesterdayMin = minutesForDate(sessions, dailyLogs, dateKey(addDays(new Date(), -1)));

  const week = useMemo(
    () =>
      Array.from({ length: 7 }, (_, i) => {
        const d = addDays(new Date(), -(6 - i));
        return {
          day: d.toLocaleDateString("en", { weekday: "short" }),
          mins: minutesForDate(sessions, dailyLogs, dateKey(d)),
        };
      }),
    [sessions, dailyLogs]
  );

  const heatmap = useMemo(
    () =>
      Array.from({ length: 30 }, (_, i) => {
        const d = addDays(new Date(), -(29 - i));
        const key = dateKey(d);
        return { key, mins: minutesForDate(sessions, dailyLogs, key) };
      }),
    [sessions, dailyLogs]
  );
  const heatMax = Math.max(...heatmap.map((h) => h.mins), 1);

  const mastery = useMemo(
    () =>
      subjects.map((s) => ({
        id: s.id,
        name: s.name,
        pct: subjectProgress(s),
      })),
    [subjects]
  );

  const counts = useMemo(() => {
    let total = 0;
    let done = 0;
    subjects.forEach((s) => {
      const c = subjectCounts(s);
      total += c.total;
      done += c.done;
    });
    return { total, done, pct: total > 0 ? Math.round((done / total) * 100) : 0 };
  }, [subjects]);

  const tasksDone =
    todos.filter((t) => t.completed).length +
    dailyLogs.reduce((a, l) => a + l.tasksCompleted, 0);

  const distribution = useMemo(() => {
    const map = subjects
      .map((s) => ({
        name: s.name,
        color: s.color,
        value: sessions
          .filter((x) => x.subjectId === s.id)
          .reduce((a, x) => a + x.durationMinutes, 0),
      }))
      .filter((x) => x.value > 0)
      .sort((a, b) => b.value - a.value);
    return map;
  }, [subjects, sessions]);
  const distTotal = distribution.reduce((a, x) => a + x.value, 0);

  const weakest = useMemo(() => {
    const sorted = [...mastery].sort((a, b) => a.pct - b.pct);
    return sorted[0] ?? null;
  }, [mastery]);

  /* ---- status messaging ---- */
  const status =
    counts.pct >= 90
      ? {
          icon: Trophy,
          color: "text-primary",
          msg: "Mastery Achieved. Ready for the Board Exam!",
        }
      : counts.pct >= 50
        ? {
            icon: Flame,
            color: "text-accent",
            msg: "Halfway there! You are doing great.",
          }
        : counts.pct >= 20
          ? {
              icon: TrendingUp,
              color: "text-accent",
              msg: "Building momentum. Keep going!",
            }
          : {
              icon: Rocket,
              color: "text-muted-foreground",
              msg: "Journey Started! Keep going.",
            };

  const tip =
    todayMin >= 120
      ? `On fire! ${todayMin} mins studied today. Keep it up!`
      : todayMin >= 60
        ? `Good progress! Focus more on ${weakest?.name ?? "your subjects"} today.`
        : todayMin > 0
          ? `You've started! Try to hit 60 mins. ${weakest?.name ?? "A weak subject"} needs attention.`
          : `Start your day! ${weakest?.name ?? "Your syllabus"} is waiting.`;

  const deltaIcon =
    todayMin > yesterdayMin ? (
      <TrendingUp size={14} className="text-primary" />
    ) : todayMin < yesterdayMin ? (
      <TrendingDown size={14} className="text-accent" />
    ) : null;

  const StatusIcon = status.icon;

  return (
    <div className={pageWrap}>
      <h1 className="font-display mb-1 flex items-center gap-2 text-xl font-bold lg:text-3xl">
        <BrainCircuit size={22} className="text-primary" /> Neural Insights
      </h1>
      <p className="mb-4 text-xs text-muted-foreground">
        Your effort, visualized.
      </p>

      <div className="space-y-4 lg:grid lg:grid-cols-2 lg:gap-4 lg:space-y-0">
        {/* status */}
        <GlassCard className="p-4 text-center">
          <div className="mb-1 flex items-center justify-center gap-2">
            <StatusIcon size={16} className={status.color} />
            <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
              Progress Status
            </span>
          </div>
          <p className={`font-display text-sm font-semibold ${status.color}`}>{status.msg}</p>
          <p className="mt-1 text-xs text-muted-foreground">
            {counts.pct}% syllabus complete · {counts.done}/{counts.total} chapters
          </p>
        </GlassCard>

        {/* smart tip */}
        <GlassCard delay={0.05} className="flex items-center gap-3 p-3.5">
          <Lightbulb size={18} className="shrink-0 text-accent" />
          <p className="text-xs leading-relaxed text-foreground/85">{tip}</p>
        </GlassCard>

        {/* stats */}
        <div className="grid grid-cols-3 gap-3 lg:col-span-2">
          <StatTile label="TODAY" value={`${todayMin}m`} icon={deltaIcon} colorClass="text-primary" />
          <StatTile label="YESTERDAY" value={`${yesterdayMin}m`} colorClass="text-accent" delay={0.05} />
          <StatTile label="TASKS DONE" value={tasksDone} colorClass="text-primary" delay={0.1} />
        </div>

        {/* 7-day chart */}
        <GlassCard className="p-4">
          <SectionTitle>Study Activity (7 days)</SectionTitle>
          <ResponsiveContainer width="100%" height={150}>
            <BarChart data={week}>
              <XAxis
                dataKey="day"
                tick={{ fontSize: 10, fill: "hsl(155, 10%, 50%)" }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis hide />
              <Tooltip
                cursor={{ fill: "hsl(0 0% 100% / 0.04)" }}
                contentStyle={{
                  background: "hsl(155, 25%, 8%)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: 10,
                  fontSize: 12,
                }}
                labelStyle={{ color: "hsl(150, 20%, 92%)" }}
                formatter={(v) => [`${v} min`, "Study"]}
              />
              <Bar dataKey="mins" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </GlassCard>

        {/* subject mastery */}
        <GlassCard className="p-4">
          <SectionTitle>Subject Mastery</SectionTitle>
          <div className="grid grid-cols-4 gap-2">
            {mastery.map((m) => (
              <div
                key={m.id}
                className="relative flex aspect-square flex-col items-center justify-center rounded-xl border border-white/5 transition-all duration-500"
                style={{
                  backgroundColor: masteryBg(m.pct),
                  boxShadow: m.pct >= 70 ? `0 0 20px ${masteryBg(m.pct)}` : "none",
                }}
              >
                <span className="font-display text-lg font-bold">{m.pct}%</span>
                <span className="line-clamp-1 px-1 text-center text-[8px] leading-tight opacity-80">
                  {m.name}
                </span>
              </div>
            ))}
          </div>
        </GlassCard>

        {/* time distribution */}
        {distribution.length > 0 && (
          <GlassCard className="p-4">
            <SectionTitle>Time Distribution</SectionTitle>
            <div className="space-y-2.5">
              {distribution.slice(0, 5).map((d) => {
                const pct = distTotal > 0 ? Math.round((d.value / distTotal) * 100) : 0;
                return (
                  <div key={d.name}>
                    <div className="mb-1 flex justify-between text-xs">
                      <span className="text-foreground/85">{d.name}</span>
                      <span className="text-muted-foreground">
                        {pct}% · {d.value}m
                      </span>
                    </div>
                    <div className="h-1.5 overflow-hidden rounded-full bg-secondary">
                      <div
                        className="h-full rounded-full transition-all duration-700"
                        style={{ width: `${pct}%`, background: d.color }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </GlassCard>
        )}

        {/* 30-day heatmap */}
        <GlassCard className="p-4">
          <SectionTitle>Activity (30 days)</SectionTitle>
          <div className="grid grid-cols-10 gap-1">
            {heatmap.map((h) => {
              const intensity = h.mins > 0 ? Math.max(0.2, h.mins / heatMax) : 0;
              return (
                <div
                  key={h.key}
                  title={`${h.key}: ${h.mins} min`}
                  className="aspect-square rounded-[3px] transition-colors"
                  style={{
                    backgroundColor:
                      h.mins > 0
                        ? `hsl(var(--primary) / ${intensity})`
                        : "hsl(var(--muted))",
                  }}
                />
              );
            })}
          </div>
          <div className="mt-2 flex items-center justify-between text-[9px] text-muted-foreground">
            <span>Less</span>
            <div className="flex gap-1">
              {[0, 0.2, 0.4, 0.6, 0.8, 1].map((v) => (
                <div
                  key={v}
                  className="h-3 w-3 rounded-[3px]"
                  style={{
                    backgroundColor:
                      v === 0 ? "hsl(var(--muted))" : `hsl(var(--primary) / ${v})`,
                  }}
                />
              ))}
            </div>
            <span>More</span>
          </div>
        </GlassCard>

        {/* recent sessions */}
        <GlassCard className="p-4 lg:col-span-2">
          <SectionTitle>Recent Sessions</SectionTitle>
          {sessions.length > 0 ? (
            <div className="no-scrollbar max-h-48 space-y-1.5 overflow-y-auto pr-1">
              {[...sessions]
                .reverse()
                .slice(0, 15)
                .map((s) => (
                  <div
                    key={s.id}
                    className="flex items-center justify-between rounded-lg bg-secondary/30 px-2.5 py-2 text-xs"
                  >
                    <span className="text-muted-foreground">
                      {new Date(s.date).toLocaleDateString("en-BD", {
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                      {" · "}
                      {subjects.find((x) => x.id === s.subjectId)?.name ?? "General"}
                    </span>
                    <span className="font-display font-semibold">{s.durationMinutes} min</span>
                  </div>
                ))}
            </div>
          ) : (
            <p className="py-4 text-center text-sm text-muted-foreground">
              No sessions recorded yet.
            </p>
          )}
        </GlassCard>
      </div>
    </div>
  );
}
