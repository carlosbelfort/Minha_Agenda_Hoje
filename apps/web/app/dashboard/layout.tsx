/*"use client";

import { ReactNode } from "react";
import { AuthProvider } from "@/context/AuthContext";
import { DashboardLayout } from "@/components/layout/DashboardLayout";

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <AuthProvider>
      <DashboardLayout>{children}</DashboardLayout>
    </AuthProvider>
  );
}*/

"use client";

import { ReactNode } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";

export default function Layout({ children }: { children: ReactNode }) {
  return <DashboardLayout>{children}</DashboardLayout>;
}
