"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { api } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { CalendarCheck, Clock, UserCircle } from "lucide-react";

type DashboardData = {
  appointmentsToday: number;
  nextAppointment: string | null;
  userRole: "ADMIN" | "USER";
};

export default function DashboardPage() {
  const { user } = useAuth();
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  async function fetchData() {
    try {
      const response = await api<DashboardData>("/dashboard");
      setData(response);
    } catch (error) {
      console.error("Erro ao carregar dashboard", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (user) {
      fetchData();
    }
  }, [user]);

  console.log("DASHBOARD ROLE:", user?.role);

  if (loading) {
    return (
      <div className="p-6">
        <p className="text-muted-foreground">Carregando dashboard...</p>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="p-6">
        <p className="text-muted-foreground">Nenhum dado disponível</p>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* HEADER */}
      <div>
        <h1 className="text-2xl font-semibold">Dashboard</h1>
        <p className="text-sm text-muted-foreground">
          Visão geral da sua agenda hoje
        </p>
      </div>

      {/* GRID DE CARDS */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {/* CARD - AGENDAMENTOS HOJE (onClick) */}
        <Card
          clickable
          onClick={() => console.log("Card Agendamentos Hoje clicado")}
          className="border-border bg-card"
        >
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Agendamentos hoje
            </CardTitle>
            <CalendarCheck className="h-5 w-5 text-muted-foreground" />
          </CardHeader>

          <CardContent>
            <div className="text-3xl font-bold">{data.appointmentsToday}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Total de compromissos do dia
            </p>
          </CardContent>
        </Card>

        {/* CARD - PRÓXIMO AGENDAMENTO */}
        {data?.nextAppointment !== undefined && (
          <Link href="/dashboard/agendas" className="block">
            <Card clickable className="border-border bg-card h-full">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">
                  Próximo agendamento
                </CardTitle>
                <Clock className="h-5 w-5 text-muted-foreground" />
              </CardHeader>

              <CardContent>
                <div className="text-2xl font-semibold">
                  {data.nextAppointment
                    ? new Date(data.nextAppointment).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })
                    : "Nenhum"}
                </div>

                <p className="text-xs text-muted-foreground mt-1">
                  Clique para ver sua agenda
                </p>
              </CardContent>
            </Card>
          </Link>
        )}

        {/* CARD - CRIAR TAREFA (Link) */}
        <Link href="/dashboard/agendas/new" className="block">
          <Card clickable className="border-border bg-card h-full">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle>Criar tarefa</CardTitle>
              <CalendarCheck className="h-5 w-5 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <p>Acessar criação de nova agenda</p>
            </CardContent>
          </Card>
        </Link>

        {/* CARD - PERFIL */}
        <Link href="/dashboard/profile" className="block">
          <Card clickable className="border-border bg-card h-full">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Perfil</CardTitle>
              <UserCircle className="h-5 w-5 text-muted-foreground" />
            </CardHeader>

            <CardContent>
              <div className="text-lg font-semibold">
                {data.userRole === "ADMIN" ? "Administrador" : "Usuário"}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Acessar dados da conta
              </p>
            </CardContent>
          </Card>
        </Link>

        {/* CARD - Usuários (apenas ADMIN) */}
        {data.userRole === "ADMIN" && (
          <Link href="/dashboard/users" className="block">
            <Card clickable className="border-border bg-card h-full">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Usuários</CardTitle>
                <UserCircle className="h-5 w-5 text-muted-foreground" />
              </CardHeader>

              <CardContent>
                <div className="text-lg font-semibold">Administrador</div>
                <p className="text-xs text-muted-foreground mt-1">
                  Acessar dados da conta
                </p>
              </CardContent>
            </Card>
          </Link>
        )}
      </div>
    </div>
  );
}
