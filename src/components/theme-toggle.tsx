"use client";

import { useEffect, useState } from "react";

type Theme = "light" | "dark";

function currentTheme(): Theme {
  return document.documentElement.dataset.theme === "dark" ? "dark" : "light";
}

export function ThemeToggle() {
  const [theme, setTheme] = useState<Theme | null>(null);

  useEffect(() => {
    setTheme(currentTheme());
  }, []);

  function choose(next: Theme) {
    if (next === currentTheme()) return;
    // Crossfades the whole page for the moment the colors change.
    const root = document.documentElement;
    root.classList.add("theme-fading");
    window.setTimeout(() => root.classList.remove("theme-fading"), 600);
    root.dataset.theme = next;
    try {
      localStorage.setItem("ara67-theme", next);
    } catch {
      // The choice still applies to this visit if storage is blocked.
    }
    setTheme(next);
  }

  return (
    <div
      role="group"
      aria-label="Color theme"
      data-value={theme ?? undefined}
      // Stays invisible until the browser has read the visitor's theme.
      className={`theme-switch ${theme ? "" : "invisible"}`}
    >
      {(["light", "dark"] as const).map((option) => (
        <button
          key={option}
          type="button"
          aria-pressed={theme === option}
          onClick={() => choose(option)}
          className="theme-option"
        >
          {option === "light" ? "Light" : "Dark"}
        </button>
      ))}
    </div>
  );
}
