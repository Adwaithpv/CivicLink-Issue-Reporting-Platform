import type { ReactNode } from "react";
import { useMemo, useState } from "react";
import { Navigate, Route, Routes, useLocation, useNavigate } from "react-router-dom";
import { Header } from "./components/Header";
import { LandingPage } from "./components/LandingPage";
import { LoginPage } from "./components/LoginPage";
import { CitizenDashboard } from "./components/CitizenDashboard";
import { ReportIssuePage } from "./components/ReportIssuePage";
import { TrackComplaintPage } from "./components/TrackComplaintPage";
import { AdminDashboard } from "./components/AdminDashboard";
import { InteractiveBackground } from "./components/InteractiveBackground";
import { useAuth } from "./state/auth";

type Page = "landing" | "login" | "dashboard" | "report" | "track" | "admin";

function pageFromPath(pathname: string): Page {
  if (pathname === "/login") return "login";
  if (pathname === "/dashboard") return "dashboard";
  if (pathname === "/report") return "report";
  if (pathname === "/track") return "track";
  if (pathname === "/admin") return "admin";
  return "landing";
}

function RequireAuth({ children }: { children: ReactNode }) {
  const { user, isLoading } = useAuth();
  const location = useLocation();
  if (isLoading) return null;
  if (!user) return <Navigate to="/login" state={{ from: location }} replace />;
  return children;
}

function RequireAdmin({ children }: { children: ReactNode }) {
  const { user, isLoading } = useAuth();
  if (isLoading) return null;
  if (!user) return <Navigate to="/login" replace />;
  if (user.role !== "admin") return <Navigate to="/dashboard" replace />;
  return children;
}

export default function App() {
  const { user, logout, isLoading } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const currentPage = useMemo(() => pageFromPath(location.pathname), [location.pathname]);
  const isLoggedIn = !!user;
  const isAdmin = user?.role === "admin";
  const [isDarkMode, setIsDarkMode] = useState(false);

  const handleNavigate = (page: string) => {
    const map: Record<Page, string> = {
      landing: "/",
      login: "/login",
      dashboard: "/dashboard",
      report: "/report",
      track: "/track",
      admin: "/admin",
    };
    const target = map[page as Page] ?? "/";
    navigate(target);
  };

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  return (
    <div className={`min-h-screen ${isDarkMode ? 'dark' : ''}`}>
      <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300 relative">
        {/* Interactive Background */}
        <InteractiveBackground isDarkMode={isDarkMode} />
        
        {/* Content */}
        <div className="relative z-10">
          {currentPage !== "login" && (
            <Header
              currentPage={currentPage}
              onNavigate={handleNavigate}
              isLoggedIn={isLoggedIn}
              isAdmin={isAdmin}
              isDarkMode={isDarkMode}
              onToggleTheme={toggleTheme}
              onLogout={async () => {
                await logout();
                navigate("/");
              }}
            />
          )}

          {isLoading ? null : (
            <Routes>
              <Route path="/" element={<LandingPage onNavigate={handleNavigate} isDarkMode={isDarkMode} />} />
              <Route
                path="/login"
                element={
                  <LoginPage
                    isDarkMode={isDarkMode}
                    onAuthed={(role) => {
                      navigate(role === "admin" ? "/admin" : "/dashboard", { replace: true });
                    }}
                  />
                }
              />
              <Route
                path="/dashboard"
                element={
                  <RequireAuth>
                    <CitizenDashboard onNavigate={handleNavigate} isDarkMode={isDarkMode} />
                  </RequireAuth>
                }
              />
              <Route
                path="/report"
                element={
                  <RequireAuth>
                    <ReportIssuePage onNavigate={handleNavigate} isDarkMode={isDarkMode} />
                  </RequireAuth>
                }
              />
              <Route
                path="/track"
                element={
                  <RequireAuth>
                    <TrackComplaintPage onNavigate={handleNavigate} isDarkMode={isDarkMode} />
                  </RequireAuth>
                }
              />
              <Route
                path="/admin"
                element={
                  <RequireAdmin>
                    <AdminDashboard onNavigate={handleNavigate} isDarkMode={isDarkMode} />
                  </RequireAdmin>
                }
              />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          )}
        </div>
      </div>
    </div>
  );
}