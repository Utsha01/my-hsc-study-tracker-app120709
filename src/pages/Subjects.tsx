import { GlassCard, ProgressBar, ProgressRing, SectionTitle, TextInput, pageWrap } from "@/components/ui";
import { subjectCounts, subjectProgress, useStudyStore } from "@/store/useStudyStore";
import { BookOpen, ChevronRight, Layers, Plus } from "lucide-react";
import { useMemo, useState } from "react";
import { Link } from "react-router-dom";

export default function SubjectsPage() {
  const { subjects, addSubject } = useStudyStore();
  const [name, setName] = useState("");

  const overall = useMemo(() => {
    let total = 0;
    let done = 0;
    subjects.forEach((s) => {
      const c = subjectCounts(s);
      total += c.total;
      done += c.done;
    });
    return { pct: total > 0 ? Math.round((done / total) * 100) : 0, done, total };
  }, [subjects]);

  const submit = () => {
    if (!name.trim()) return;
    addSubject(name);
    setName("");
  };

  return (
    <div className={pageWrap}>
      <h1 className="font-display mb-1 text-xl font-bold lg:text-3xl">Subjects</h1>
      <p className="mb-4 text-xs text-muted-foreground">
        HSC Science syllabus — tick chapters as you conquer them.
      </p>

      {/* overall */}
      <GlassCard className="flex items-center gap-5 p-4">
        <ProgressRing value={overall.pct} size={92} stroke={9}>
          <span className="font-display text-2xl font-bold text-primary">{overall.pct}%</span>
        </ProgressRing>
        <div className="flex-1">
          <p className="font-display text-sm font-semibold">Overall Syllabus</p>
          <p className="mt-1 text-xs text-muted-foreground">
            {overall.done} of {overall.total} chapters complete
          </p>
          <p className="mt-2 flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-widest text-accent">
            <Layers size={11} /> {subjects.length} subjects tracked
          </p>
        </div>
      </GlassCard>

      {/* subject cards */}
      <div className="mt-5 grid grid-cols-1 gap-3 lg:grid-cols-2">
        {subjects.map((s, i) => {
          const pct = subjectProgress(s);
          const c = subjectCounts(s);
          return (
            <Link key={s.id} to={`/subjects/${s.id}`} className="press-scale block">
              <GlassCard delay={i * 0.04} className="p-4">
                <div className="flex items-center gap-3">
                  <span
                    className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl"
                    style={{
                      background: `${s.color}1f`,
                      color: s.color,
                      boxShadow: `inset 0 0 0 1px ${s.color}55`,
                    }}
                  >
                    <BookOpen size={19} />
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <p className="font-display truncate text-sm font-semibold">{s.name}</p>
                      <span className="font-display text-xs font-bold" style={{ color: s.color }}>
                        {pct}%
                      </span>
                    </div>
                    <p className="mt-0.5 text-[10px] text-muted-foreground">
                      {c.done}/{c.total} chapters · {s.papers.length}{" "}
                      {s.papers.length > 1 ? "papers" : "paper"}
                    </p>
                    <ProgressBar value={pct} color={s.color} className="mt-2" />
                  </div>
                  <ChevronRight size={16} className="shrink-0 text-muted-foreground" />
                </div>
              </GlassCard>
            </Link>
          );
        })}
      </div>

      {/* add custom subject */}
      <div className="mt-6">
        <SectionTitle>Add Custom Subject</SectionTitle>
        <GlassCard className="flex gap-2 p-3.5">
          <TextInput
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && submit()}
            placeholder="e.g. Statistics, General Science…"
          />
          <button
            onClick={submit}
            className="press-scale flex h-[42px] w-[42px] shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-[0_0_16px_hsl(var(--primary)/0.4)]"
            aria-label="Add subject"
          >
            <Plus size={18} />
          </button>
        </GlassCard>
      </div>
    </div>
  );
}
