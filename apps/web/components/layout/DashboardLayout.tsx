"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { Menu, LogOut, Users, Calendar, User } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { clsx } from "clsx";

/* =========================
   HEADER
========================= */

const pageTitles: Record<string, string> = {
  "/dashboard": "Dashboard",
  "/dashboard/users": "Usuários",
  "/dashboard/profile": "Meu Perfil",
};

export function Header({ onMenuClick }: { onMenuClick: () => void }) {
  const { logout } = useAuth();
  const pathname = usePathname();

  const title = pageTitles[pathname] ?? "Minha Agenda Hoje";

  return (
    <header className="h-14 flex items-center justify-between px-4 border-b bg-black/40 backdrop-blur-md text-foreground">
      <button
        className="md:hidden"
        onClick={onMenuClick}
        aria-label="Abrir menu"
      >
        <Menu />
      </button>

      {/* TITLE + BREADCRUMB */}
      <div className="flex flex-col">
        <h1 className="font-semibold text-lg">{title}</h1>
      </div>

      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <button onClick={logout} aria-label="Sair">
              <LogOut />
            </button>
          </TooltipTrigger>
          <TooltipContent>Sair</TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </header>
  );
}

/* =========================
   SIDEBAR
========================= */

export function Sidebar({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const { user } = useAuth();
  const pathname = usePathname();
  const isAdmin = user?.role === "ADMIN";
  const handleLinkClick = () => {
    // fecha apenas no mobile
    if (window.innerWidth < 768) {
      onClose();
    }
  };

  const linkClass = (href: string) =>
    clsx(
      "group flex items-center gap-2 rounded-md px-3 py-2 transition-all duration-200",
      "border border-transparent",
      "hover:bg-black/60 hover:border-border/40",
      "hover:text-foreground",
      pathname === href
        ? "bg-black/70 text-foreground border-border"
        : "text-black-foreground",
    );

  return (
    <aside
      className={`
        fixed md:static top-14 left-0 z-40
        h-[calc(100vh-56px)] w-64
        bg-black/40 backdrop-blur-md border-r border-border
        transform transition-transform
        ${isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
      `}
    >
      <nav className="p-4 space-y-2">
        <Link
          href="/dashboard"
          className={linkClass("/dashboard")}
          onClick={handleLinkClick}
        >
          <Calendar size={18} className="transition-colors group-hover:text-foreground" /> Dashboard
        </Link>
        <Link
          href="/dashboard/agendas"
          className={linkClass("/agendas")}
          onClick={handleLinkClick}
        >
          <Calendar size={18} /> Lista de tarefas
        </Link>
        <Link
          href="/dashboard/agendas/new"
          className={linkClass("/agendas/new")}
          onClick={handleLinkClick}
        >
          <Calendar size={18} /> Criar tarefa
        </Link>

        {isAdmin && (
          <Link
            href="/dashboard/users"
            className={linkClass("/users")}
            onClick={handleLinkClick}
          >
            <Users size={18} /> Usuários
          </Link>
        )}

        <Link
          href="/dashboard/profile"
          className={linkClass("/profile")}
          onClick={handleLinkClick}
        >
          <User size={18} /> Perfil
        </Link>
      </nav>
    </aside>
  );
}

/* =========================
   LAYOUT DE USO
========================= */

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const { user, loading } = useAuth();

  if (loading) return <p>Carregando...</p>; // evita renderizar antes do user

  return (
    <div className="min-h-screen bg-transparent text-foreground">
      <Header onMenuClick={() => setMenuOpen(!menuOpen)} />

      <div className="flex">
        <Sidebar isOpen={menuOpen} onClose={() => setMenuOpen(false)} />

        <main className="flex-1 p-6 bg-transparent">{children}</main>
      </div>
    </div>
  );
}
