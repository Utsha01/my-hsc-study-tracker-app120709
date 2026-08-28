export const uid = (): string =>
  typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : Math.random().toString(36).slice(2) + Date.now().toString(36);

/** Local YYYY-MM-DD key (matches the app's daily-log model) */
export const dateKey = (d: Date | string | number = new Date()): string => {
  const x = new Date(d);
  return `${x.getFullYear()}-${String(x.getMonth() + 1).padStart(2, "0")}-${String(
    x.getDate()
  ).padStart(2, "0")}`;
};

export const todayKey = (): string => dateKey(new Date());

export const addDays = (d: Date, n: number): Date => {
  const x = new Date(d);
  x.setDate(x.getDate() + n);
  return x;
};

export const clamp = (n: number, min: number, max: number): number =>
  Math.min(max, Math.max(min, n));

export const daysUntil = (dateStr: string): number | null => {
  if (!dateStr) return null;
  const target = new Date(`${dateStr}T00:00:00`);
  if (Number.isNaN(target.getTime())) return null;
  const now = new Date();
  const midnight = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  return Math.max(0, Math.ceil((target.getTime() - midnight.getTime()) / 86400000));
};

export const greeting = (): string => {
  const h = new Date().getHours();
  if (h < 5) return "Late Night Session";
  if (h < 12) return "Good Morning";
  if (h < 17) return "Good Afternoon";
  if (h < 20) return "Good Evening";
  return "Good Night";
};

export const fmtClock = (totalSeconds: number): string => {
  const m = Math.floor(totalSeconds / 60);
  const s = totalSeconds % 60;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
};

export const avg = (arr: number[]): number =>
  arr.length ? arr.reduce((a, b) => a + b, 0) / arr.length : 0;
