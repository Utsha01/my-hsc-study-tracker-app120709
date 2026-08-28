import { GlassCard, ProgressBar, ProgressRing, SectionTitle, TextInput, pageWrap } from "@/components/ui";
import { subjectCounts, subjectProgress, useStudyStore } from "@/store/useStudyStore";
import { cn } from "@/utils/cn";
import { motion } from "framer-motion";
import { ArrowLeft, Check, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { Link, Navigate, useNavigate, useParams } from "react-router-dom";

export default function SubjectDetailPage() {
  const { subjectId } = useParams();
  const navigate = useNavigate();
  const { subjects, toggleChapter, addChapter, removeChapter, removeSubject } =
    useStudyStore();
  const [draft, setDraft] = useState<Record<string, string>>({});

  const subject = subjects.find((s) => s.id === subjectId);
  if (!subject) return <Navigate to="/subjects" replace />;

  const pct = subjectProgress(subject);
  const counts = subjectCounts(subject);

  const submit = (paperId: string) => {
    const val = (draft[paperId] ?? "").trim();
    if (!val) return;
    addChapter(subject.id, paperId, val);
    setDraft((d) => ({ ...d, [paperId]: "" }));
  };

  return (
    <div className={pageWrap}>
      {/* header */}
      <div className="mb-4 flex items-center gap-3">
        <button
          onClick={() => navigate(-1)}
          className="glass-card press-scale flex h-10 w-10 items-center justify-center !rounded-full"
          aria-label="Back"
        >
          <ArrowLeft size={17} />
        </button>
        <div className="min-w-0 flex-1">
          <h1 className="font-display truncate text-xl font-bold" style={{ color: subject.color }}>
            {subject.name}
          </h1>
          <p className="text-[11px] text-muted-foreground">
            {counts.done}/{counts.total} chapters · {pct}% mastered
          </p>
        </div>
        <button
          onClick={() => {
            if (window.confirm(`Delete "${subject.name}" and all its chapters?`)) {
              removeSubject(subject.id);
              navigate("/subjects");
            }
          }}
          className="glass-card press-scale flex h-10 w-10 items-center justify-center !rounded-full text-destructive/80"
          aria-label="Delete subject"
        >
          <Trash2 size={15} />
        </button>
      </div>

      {/* overall ring */}
      <GlassCard className="mb-5 flex items-center gap-5 p-4">
        <ProgressRing value={pct} size={88} stroke={9} color={subject.color}>
          <span className="font-display text-xl font-bold" style={{ color: subject.color }}>
            {pct}%
          </span>
        </ProgressRing>
        <div className="flex-1 space-y-2.5">
          {subject.papers.map((p) => {
            const total = p.chapters.length;
            const done = p.chapters.filter((c) => c.completed).length;
            const pp = total > 0 ? Math.round((done / total) * 100) : 0;
            return (
              <div key={p.id}>
                <div className="mb-1 flex justify-between text-[11px]">
                  <span className="text-foreground/85">{p.name}</span>
                  <span className="text-muted-foreground">
                    {done}/{total}
                  </span>
                </div>
                <ProgressBar value={pp} color={subject.color} />
              </div>
            );
          })}
        </div>
      </GlassCard>

      {/* papers */}
      {subject.papers.map((paper, pi) => {
        const done = paper.chapters.filter((c) => c.completed).length;
        return (
          <div key={paper.id} className="mb-5">
            <SectionTitle
              action={
                <span className="text-[10px] font-semibold text-muted-foreground">
                  {done}/{paper.chapters.length}
                </span>
              }
            >
              {paper.name}
            </SectionTitle>
            <GlassCard delay={pi * 0.05} className="p-3">
              <div className="space-y-1">
                {paper.chapters.length === 0 && (
                  <p className="py-3 text-center text-xs text-muted-foreground">
                    No chapters yet — add your first one below.
                  </p>
                )}
                {paper.chapters.map((ch, i) => (
                  <motion.div
                    key={ch.id}
                    initial={{ opacity: 0, x: -6 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: Math.min(i * 0.02, 0.3) }}
                    className="group flex items-center gap-2.5 rounded-lg px-2 py-2 hover:bg-white/[0.03]"
                  >
                    <button
                      onClick={() => toggleChapter(subject.id, paper.id, ch.id)}
                      aria-label="Toggle chapter"
                      className={cn(
                        "flex h-5 w-5 shrink-0 items-center justify-center rounded-md border transition-all",
                        ch.completed
                          ? "text-primary-foreground"
                          : "border-white/20 hover:border-primary/60"
                      )}
                      style={
                        ch.completed
                          ? {
                              background: subject.color,
                              borderColor: subject.color,
                              boxShadow: `0 0 10px ${subject.color}80`,
                            }
                          : undefined
                      }
                    >
                      {ch.completed && <Check size={12} strokeWidth={3} />}
                    </button>
                    <span
                      className={cn(
                        "flex-1 text-xs leading-relaxed",
                        ch.completed && "text-muted-foreground line-through opacity-60"
                      )}
                    >
                      {ch.name}
                    </span>
                    <button
                      onClick={() => removeChapter(subject.id, paper.id, ch.id)}
                      aria-label="Remove chapter"
                      className="text-muted-foreground/40 opacity-0 transition-opacity hover:text-destructive group-hover:opacity-100"
                    >
                      <Trash2 size={12} />
                    </button>
                  </motion.div>
                ))}
              </div>
              <div className="mt-2.5 flex gap-2 border-t border-white/5 pt-2.5">
                <TextInput
                  value={draft[paper.id] ?? ""}
                  onChange={(e) => setDraft((d) => ({ ...d, [paper.id]: e.target.value }))}
                  onKeyDown={(e) => e.key === "Enter" && submit(paper.id)}
                  placeholder="Add a chapter…"
                  className="!py-2 text-xs"
                />
                <button
                  onClick={() => submit(paper.id)}
                  aria-label="Add chapter"
                  className="press-scale flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-primary-foreground"
                  style={{ background: subject.color, boxShadow: `0 0 14px ${subject.color}60` }}
                >
                  <Plus size={16} />
                </button>
              </div>
            </GlassCard>
          </div>
        );
      })}

      <Link
        to="/timer"
        className="press-scale glass-card flex items-center justify-center gap-2 p-3.5 text-sm font-semibold"
        style={{ color: subject.color }}
      >
        Study {subject.name} now
      </Link>
    </div>
  );
}
