import { useCallback, useState } from "react";
import { useLocation } from "react-router-dom";
import {
  SPLASH_ENABLED,
  SPLASH_STORAGE_KEY,
} from "../config/splash";

const ADMIN_PREFIX = "/boubadev";

function shouldShowSplash(pathname: string): boolean {
  if (!SPLASH_ENABLED) return false;
  if (pathname.startsWith(ADMIN_PREFIX)) return false;
  if (typeof window === "undefined") return false;
  return localStorage.getItem(SPLASH_STORAGE_KEY) !== "2";
}

export function useSplashScreen() {
  const location = useLocation();
  const [showSplash, setShowSplash] = useState(() =>
    shouldShowSplash(location.pathname),
  );

  const completeSplash = useCallback(() => {
    localStorage.setItem(SPLASH_STORAGE_KEY, "1");
    setShowSplash(false);
  }, []);

  return {
    showSplash: showSplash && shouldShowSplash(location.pathname),
    completeSplash,
  };
}
