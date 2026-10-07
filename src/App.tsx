import { lazy, Suspense, useEffect, useState } from "react";
import { BrowserRouter, Navigate, Route, Routes, useParams } from "react-router-dom";
import type { User as AuthUser } from "@supabase/supabase-js";
import { Login } from "./components/auth/Login";
import { CookieBanner } from "./components/layout/CookieBanner";
import { CustomCursor } from "./components/layout/CustomCursor";
import { SeoManager } from "./components/layout/SeoManager";
import { SplashScreen } from "./components/SplashScreen";
import { PortfolioPage } from "./pages/PortfolioPage";
import { ProjectsPage } from "./pages/ProjectsPage";
import { PrivacyPolicyPage } from "./pages/PrivacyPolicyPage";
import { ProjectCaseStudyPage } from "./components/project/ProjectCaseStudyPage";
import { UiUxCaseStudyPage } from "./components/uiux/UiUxCaseStudyPage";
import { useSplashScreen } from "./hooks/useSplashScreen";
import { supabase } from "./services/supabase";

const AdminDashboard = lazy(() =>
  import("./components/Admin").then((m) => ({ default: m.AdminDashboard })),
);

/** Force le remontage complet à chaque changement de slug (évite le cache HMR). */
function ProjectDetailRoute() {
  const { slug } = useParams();
  return <ProjectCaseStudyPage key={slug} />;
}

function AuthSpinner() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-black">
      <div className="h-12 w-12 animate-spin rounded-full border-4 border-brand-orange border-t-transparent" />
    </div>
  );
}

function AppShell({
  user,
  authLoading,
  onLogin,
  onLogout,
}: {
  user: AuthUser | null;
  authLoading: boolean;
  onLogin: (email: string, pass: string) => Promise<void>;
  onLogout: () => Promise<void>;
}) {
  const { showSplash, completeSplash } = useSplashScreen();

  return (
    <>
      {showSplash ? <SplashScreen onComplete={completeSplash} /> : null}
      <SeoManager />
      <CookieBanner />
      <CustomCursor />
      <Suspense fallback={<AuthSpinner />}>
        <Routes>
          <Route path="/" element={<PortfolioPage />} />
          <Route path="/projets" element={<ProjectsPage />} />
          <Route path="/projets/:slug" element={<ProjectDetailRoute />} />
          <Route path="/uiux/:id" element={<UiUxCaseStudyPage />} />
          <Route path="/confidentialite" element={<PrivacyPolicyPage />} />
          <Route
            path="/boubadev"
            element={
              authLoading ? (
                <AuthSpinner />
              ) : user ? (
                <AdminDashboard onLogout={onLogout} />
              ) : (
                <Login onLogin={onLogin} />
              )
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </>
  );
}

export default function App() {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    void supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setAuthLoading(false);
    });
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });
    return () => subscription.unsubscribe();
  }, []);

  const handleLogin = async (email: string, pass: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password: pass,
    });
    if (error) alert("Erreur de connexion : " + error.message);
  };

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) alert("Erreur de déconnexion : " + error.message);
  };

  return (
    <BrowserRouter>
      <AppShell
        user={user}
        authLoading={authLoading}
        onLogin={handleLogin}
        onLogout={handleLogout}
      />
    </BrowserRouter>
  );
}
