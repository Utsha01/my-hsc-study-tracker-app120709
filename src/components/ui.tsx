import { cn } from "@/utils/cn";
import { motion } from "framer-motion";
import type { ReactNode } from "react";

/* ---------------- GlassCard ---------------- */
export const GlassCard = ({
  children,
  className,
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
}) => (
  <motion.div
    initial={{ opacity: 0, y: 12, scale: 0.98 }}
    animate={{ opacity: 1, y: 0, scale: 1 }}
    transition={{ duration: 0.4, delay, ease: [0.22, 1, 0.36, 1] }}
    className={cn("glass-card", className)}
  >
    {children}
  </motion.div>
);

/* ---------------- SectionTitle ---------------- */
export const SectionTitle = ({
  children,
  action,
}: {
  children: ReactNode;
  action?: ReactNode;
}) => (
  <div className="mb-3 flex items-center justify-between">
    <h2 className="font-display text-sm font-semibold tracking-wide">{children}</h2>
    {action}
  </div>
);

/* ---------------- ProgressBar ---------------- */
export const ProgressBar = ({
  value,
  color,
  className,
}: {
  value: number; // 0-100
  color?: string;
  className?: string;
}) => (
  <div className={cn("h-1.5 w-full overflow-hidden rounded-full bg-secondary", className)}>
    <motion.div
      initial={{ width: 0 }}
      animate={{ width: `${Math.min(100, Math.max(0, value))}%` }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      className="h-full rounded-full"
      style={{
        background: color ?? "hsl(var(--primary))",
        boxShadow: `0 0 12px ${color ?? "hsl(var(--primary) / 0.6)"}`,
      }}
    />
  </div>
);

/* ---------------- ProgressRing ---------------- */
export const ProgressRing = ({
  value,
  size = 120,
  stroke = 10,
  color,
  track = "hsl(var(--muted))",
  children,
}: {
  value: number; // 0-100
  size?: number;
  stroke?: number;
  color?: string;
  track?: string;
  children?: ReactNode;
}) => {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const pct = Math.min(100, Math.max(0, value));
  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={track}
          strokeWidth={stroke}
        />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={color ?? "hsl(var(--primary))"}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={c}
          initial={{ strokeDashoffset: c }}
          animate={{ strokeDashoffset: c - (c * pct) / 100 }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          style={{ filter: `drop-shadow(0 0 8px ${color ?? "hsl(var(--primary) / 0.7)"})` }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        {children}
      </div>
    </div>
  );
};

/* ---------------- TextInput ---------------- */
export const TextInput = ({
  className,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement>) => (
  <input
    className={cn(
      "w-full rounded-xl border border-white/10 bg-secondary/50 px-3.5 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-1 focus:ring-primary",
      className
    )}
    {...props}
  />
);

/* ---------------- StatPill ---------------- */
export const StatTile = ({
  label,
  value,
  colorClass = "text-primary",
  icon,
  delay = 0,
}: {
  label: string;
  value: ReactNode;
  colorClass?: string;
  icon?: ReactNode;
  delay?: number;
}) => (
  <GlassCard delay={delay} className="p-3 text-center">
    <div className="flex items-center justify-center gap-1">
      <p className={cn("font-display text-2xl font-bold", colorClass)}>{value}</p>
      {icon}
    </div>
    <p className="mt-0.5 text-[9px] font-semibold tracking-[0.18em] text-muted-foreground">
      {label}
    </p>
  </GlassCard>
);

export const pageWrap = "mx-auto max-w-lg px-4 pb-32 pt-5 lg:max-w-6xl lg:px-8";
