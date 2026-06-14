"use client";

import { SessionProvider } from "next-auth/react";
import { ThemeProvider } from "@/components/theme/ThemeProvider";

interface ProvidersProps {
  children: React.ReactNode;
  userThemeId?: string | null;
  isAuthenticated?: boolean;
}

export function Providers({
  children,
  userThemeId,
  isAuthenticated,
}: ProvidersProps) {
  return (
    <SessionProvider>
      <ThemeProvider
        userThemeId={userThemeId}
        isAuthenticated={isAuthenticated}
      >
        {children}
      </ThemeProvider>
    </SessionProvider>
  );
}
