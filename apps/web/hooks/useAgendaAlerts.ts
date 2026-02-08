import { useEffect, useRef, useState } from "react";
import { api } from "../lib/api";

export interface Agenda {
  id: string;
  title: string;
  date: string;
}

export function useAgendaAlerts() {
  const [agendas, setAgendas] = useState<Agenda[]>([]);
  const [alertActive, setAlertActive] = useState<Agenda | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Pegar token do localStorage
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

  useEffect(() => {
    audioRef.current = new Audio("/sounds/alert.mp3");
  }, []);

  useEffect(() => {
    if (!token) return; // evita erro 401

    const interval = setInterval(async () => {
      try {
        const response = await api<Agenda[]>("/agendas", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setAgendas(response);
      } catch (err) {
        console.error("Erro ao buscar agendas:", err);
      }
    }, 60000); // checa a cada 1 minuto

    return () => clearInterval(interval);
  }, [token]);

  useEffect(() => {
    if (!agendas.length || !audioRef.current) return;

    const now = new Date();
    const upcoming = agendas.find(a => {
      const agendaTime = new Date(a.date);
      return Math.abs(agendaTime.getTime() - now.getTime()) < 60000; // +/- 1 minuto
    });

    if (upcoming) {
      setAlertActive(upcoming);
      audioRef.current.play().catch(() => {
        console.log("Clique do usuário necessário para tocar som no desktop");
      });
    }
  }, [agendas]);

  function dismissAlert() {
    setAlertActive(null);
    audioRef.current?.pause();
    audioRef.current!.currentTime = 0;
  }

  return { alertActive, dismissAlert };
}