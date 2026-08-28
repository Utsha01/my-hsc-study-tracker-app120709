import { cn } from "@/utils/cn";
import { BarChart3, BookOpen, Home, Settings, Timer } from "lucide-react";
import { NavLink } from "react-router-dom";

const tabs = [
  { to: "/", label: "Home", icon: Home },
  { to: "/subjects", label: "Subjects", icon: BookOpen },
  { to: "/timer", label: "Focus", icon: Timer, center: true },
  { to: "/insights", label: "Insights", icon: BarChart3 },
  { to: "/settings", label: "Settings", icon: Settings },
];

export const BottomNav = () => (
  <nav className="fixed inset-x-0 bottom-0 z-50 px-4 pb-[max(env(safe-area-inset-bottom),0.9rem)] pt-2">
    <div className="mx-auto flex max-w-lg items-end justify-between rounded-[1.6rem] border border-white/10 bg-[hsl(155_26%_6%/0.82)] px-3 py-2 shadow-[0_-8px_40px_-12px_hsl(156_70%_2%/0.9)] backdrop-blur-2xl lg:max-w-xl">
      {tabs.map(({ to, label, icon: Icon, center }) =>
        center ? (
          <NavLink key={to} to={to} className="press-scale group -mt-9 flex flex-col items-center">
            {({ isActive }) => (
              <>
                <span
                  className={cn(
                    "flex h-14 w-14 items-center justify-center rounded-full border transition-all duration-300",
                    isActive
                      ? "border-primary/60 bg-primary text-primary-foreground shadow-[0_0_28px_hsl(var(--primary)/0.65)]"
                      : "border-white/15 bg-[hsl(155_30%_10%)] text-primary shadow-[0_0_18px_hsl(var(--primary)/0.25)] group-hover:border-primary/40"
                  )}
                >
                  <Icon size={24} strokeWidth={2.2} />
                </span>
                <span
                  className={cn(
                    "mt-1 text-[9px] font-semibold tracking-wider",
                    isActive ? "text-primary" : "text-muted-foreground"
                  )}
                >
                  {label}
                </span>
              </>
            )}
          </NavLink>
        ) : (
          <NavLink key={to} to={to} end={to === "/"} className="press-scroll flex-1">
            {({ isActive }) => (
              <div
                className={cn(
                  "press-scale mx-auto flex w-14 flex-col items-center gap-1 rounded-xl py-1.5 transition-colors",
                  isActive ? "text-primary" : "text-muted-foreground hover:text-foreground/80"
                )}
              >
                <Icon size={21} strokeWidth={isActive ? 2.3 : 1.9} />
                <span className="text-[9px] font-semibold tracking-wider">{label}</span>
                <span
                  className={cn(
                    "h-1 w-1 rounded-full transition-all",
                    isActive ? "bg-primary shadow-[0_0_6px_hsl(var(--primary))]" : "bg-transparent"
                  )}
                />
              </div>
            )}
          </NavLink>
        )
      )}
    </div>
  </nav>
);
