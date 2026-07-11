"use client";

import { useEffect, useState } from "react";

const STORAGE_KEY = "theme";

type Theme = "light" | "dark" | "system";

function getSystemTheme(): "light" | "dark" {
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

function applyTheme(theme: Theme) {
  const resolved = theme === "system" ? getSystemTheme() : theme;
  document.documentElement.setAttribute("data-theme", resolved);
  return resolved;
}

export function useTheme() {
  const [theme, setThemeState] = useState<Theme>(() => {
    if (typeof window === "undefined") return "system";
    return (localStorage.getItem(STORAGE_KEY) as Theme) || "system";
  });

  useEffect(() => {
    applyTheme(theme);
    localStorage.setItem(STORAGE_KEY, theme);
  }, [theme]);

  useEffect(() => {
    const listener = (e: MediaQueryListEvent) => {
      if ((localStorage.getItem(STORAGE_KEY) as Theme) === "system") {
        document.documentElement.setAttribute("data-theme", e.matches ? "dark" : "light");
      }
    };
    window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", listener);
    return () => window.matchMedia("(prefers-color-scheme: dark)").removeEventListener("change", listener);
  }, []);

  return { theme, setTheme: setThemeState } as const;
}

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  const next: Record<Theme, Theme> = {
    light: "dark",
    dark: "system",
    system: "light",
  };

  const icons: Record<Theme, string> = {
    light: "☀️",
    dark: "🌙",
    system: "💻",
  };

  return (
    <button
      className="theme-toggle"
      onClick={() => setTheme(next[theme])}
      title={`Theme: ${theme} (click to switch)`}
      aria-label={`Current theme ${theme}, click to switch`}
    >
      <span className="theme-toggle__icon">{icons[theme]}</span>
      <span className="theme-toggle__label">{theme}</span>
    </button>
  );
}
