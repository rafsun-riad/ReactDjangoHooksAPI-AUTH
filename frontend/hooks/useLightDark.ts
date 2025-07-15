"use client";

import { useEffect, useState } from "react";

export function useLightDark(): [boolean, () => void] {
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    const savedTheme = localStorage.getItem("preferred-theme");
    if (savedTheme !== null) {
      return savedTheme === "dark";
    }
    return (
      window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: dark)").matches
    );
  });

  const toggleTheme = () => {
    setIsDarkMode((prev) => {
      const newMode = !prev;
      localStorage.setItem("preferred-theme", newMode ? "dark" : "light");
      return newMode;
    });
  };

  useEffect(() => {
    const savedTheme = localStorage.getItem("preferred-theme");
    if (savedTheme === null) {
      const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
      const handleChange = (e: MediaQueryListEvent) => {
        setIsDarkMode(e.matches);
      };
      mediaQuery.addEventListener("change", handleChange);
      return () => mediaQuery.removeEventListener("change", handleChange);
    }
  }, []);

  return [isDarkMode, toggleTheme];
}
