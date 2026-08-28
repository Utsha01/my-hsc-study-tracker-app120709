import { GlassCard, TextInput, pageWrap } from "@/components/ui";
import { useStudyStore } from "@/store/useStudyStore";
import { CalendarClock, Download, Heart, Trash2, User } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export default function SettingsPage() {
  const { settings, updateSettings, exportData, clearCache } = useStudyStore();
  const [name, setName] = useState(settings.profileName);
  const [examDate, setExamDate] = useState(settings.examDate);

  const save = () => {
    updateSettings({ profileName: name.trim() || "Scholar", examDate });
    toast.success("Settings saved");
  };

  const exportJson = () => {
    const data = exportData();
    const blob = new Blob([data], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "hsc-pinnacle-backup.json";
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Backup downloaded");
  };

  return (
    <div className={pageWrap + " space-y-4"}>
      <h1 className="font-display mb-1 text-xl font-bold lg:text-3xl">Settings</h1>

      {/* profile */}
      <GlassCard className="space-y-4 p-4">
        <div>
          <label className="mb-1.5 flex items-center gap-2 text-xs text-muted-foreground">
            <User size={14} className="text-primary" /> Profile Name
          </label>
          <TextInput value={name} onChange={(e) => setName(e.target.value)} />
        </div>
        <div>
          <label className="mb-1.5 flex items-center gap-2 text-xs text-muted-foreground">
            <CalendarClock size={14} className="text-accent" /> HSC Exam Date
          </label>
          <TextInput
            type="date"
            value={examDate}
            onChange={(e) => setExamDate(e.target.value)}
          />
        </div>
        <button
          onClick={save}
          className="press-scale w-full rounded-xl bg-primary py-2.5 text-sm font-semibold text-primary-foreground shadow-[0_0_20px_hsl(var(--primary)/0.4)]"
        >
          Save Changes
        </button>
      </GlassCard>

      {/* data */}
      <GlassCard delay={0.08} className="space-y-3 p-4">
        <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
          Data Management
        </p>
        <button
          onClick={exportJson}
          className="press-scale flex w-full items-center justify-center gap-2 rounded-xl bg-secondary py-2.5 text-sm text-secondary-foreground"
        >
          <Download size={16} /> Export Data as JSON
        </button>
        <button
          onClick={() => {
            if (window.confirm("This will clear all your data. Are you sure?")) {
              clearCache();
              setName("Scholar");
              toast.success("All data cleared — fresh start");
            }
          }}
          className="press-scale flex w-full items-center justify-center gap-2 rounded-xl bg-destructive/10 py-2.5 text-sm text-destructive"
        >
          <Trash2 size={16} /> Clear All Data
        </button>
        <p className="text-[10px] leading-relaxed text-muted-foreground">
          All data stays on this device (offline-first). Export regularly to keep a
          safe backup.
        </p>
      </GlassCard>

      <p className="flex items-center justify-center gap-1 pt-4 text-center text-[10px] text-muted-foreground">
        HSC Pinnacle Ultra v2.0 — Built with
        <Heart size={10} className="fill-primary text-primary" />
        for HSC warriors
      </p>
    </div>
  );
}
