"use client";

import { AuthProvider } from "@/context/AuthContext";
import { AgendaAlertProvider } from "@/context/AgendaAlertContext";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <AgendaAlertProvider>{children}</AgendaAlertProvider>
    </AuthProvider>
  );
}
