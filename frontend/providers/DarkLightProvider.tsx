"use client";

import { useLightDark } from "@/hooks/useLightDark";
import { useEffect } from "react";

export default function ThemeModeProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isDarkMode] = useLightDark();

  useEffect(() => {
    if (isDarkMode) {
      document.body.classList.add("dark");
    } else {
      document.body.classList.remove("dark");
    }
  }, [isDarkMode]);

  return <>{children}</>;
}
