import { BottomNav } from "@/components/BottomNav";
import HomePage from "@/pages/Home";
import InsightsPage from "@/pages/Insights";
import NotFoundPage from "@/pages/NotFound";
import SettingsPage from "@/pages/Settings";
import SubjectDetailPage from "@/pages/SubjectDetail";
import SubjectsPage from "@/pages/Subjects";
import TimerPage from "@/pages/Timer";
import { HashRouter, Route, Routes } from "react-router-dom";
import { Toaster } from "sonner";

export default function App() {
  return (
    <HashRouter>
      <Toaster
        theme="dark"
        position="top-center"
        toastOptions={{
          style: {
            background: "hsl(155, 26%, 8%)",
            border: "1px solid hsl(0 0% 100% / 0.1)",
            color: "hsl(150, 20%, 92%)",
          },
        }}
      />
      <div className="min-h-svh">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/subjects" element={<SubjectsPage />} />
          <Route path="/subjects/:subjectId" element={<SubjectDetailPage />} />
          <Route path="/timer" element={<TimerPage />} />
          <Route path="/insights" element={<InsightsPage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
        <BottomNav />
      </div>
    </HashRouter>
  );
}
