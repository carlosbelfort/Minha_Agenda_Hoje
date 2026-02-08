"use client";

import { createContext, useContext, useEffect, useRef, useState } from "react";
import { api } from "@/lib/api";

type Agenda = {
  id: string;
  title: string;
  date: string;
};

type AlertContextType = {
  stopAlert: () => void;
  isAlerting: boolean;
};

const AgendaAlertContext = createContext<AlertContextType>(
  {} as AlertContextType,
);

export function AgendaAlertProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const timersRef = useRef<NodeJS.Timeout[]>([]);
  const [isAlerting, setIsAlerting] = useState(false);
  const [currentAgenda, setCurrentAgenda] = useState<Agenda | null>(null);

  function stopAlert() {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    setIsAlerting(false);
    setCurrentAgenda(null);
  }

  // Inicializa o áudio UMA VEZ
  useEffect(() => {
    audioRef.current = new Audio("/sounds/alert.mp3");
    audioRef.current.loop = true;
    audioRef.current.volume = 0.9;
  }, []);

  // Agenda os alertas
  useEffect(() => {
    async function scheduleAlerts() {
      try {
        const token = localStorage.getItem("token");

        // 🔐 Sem login = sem alerta (e sem erro)
        if (!token) return;

        const agendas = await api<Agenda[]>("/agendas");
        const now = Date.now();

        agendas.forEach((agenda) => {
          const triggerTime = new Date(agenda.date).getTime();
          const delay = triggerTime - now;

          if (delay > 0) {
            const timer = setTimeout(() => {
              setCurrentAgenda(agenda);
              setIsAlerting(true);

              audioRef.current?.play().catch(() => {
                // navegador bloqueou
              });
            }, delay);

            timersRef.current.push(timer);
          }
        });
      } catch (error) {
        // 🚫 NUNCA quebrar a aplicação
        console.warn("Alertas não carregados:", error);
      }
    }

    scheduleAlerts();

    return () => {
      timersRef.current.forEach(clearTimeout);
    };
  }, []);

  // Se o usuário clicar no botão e o som estiver bloqueado, tenta tocar de novo
  function handleUserInteraction() {
    audioRef.current?.play().catch(() => {});
  }

  return (
    <AgendaAlertContext.Provider value={{ stopAlert, isAlerting }}>
      {children}

      {/* 🔔 ALERTA VISUAL + SONORO */}
      {isAlerting && currentAgenda && (
        <div
          className="fixed bottom-6 right-6 z-50 flex flex-col gap-2
                     rounded-xl bg-red-600 p-4 text-white shadow-2xl"
        >
          <p className="text-sm opacity-90">⏰ Tarefa agendada</p>

          <p className="text-base font-semibold">{currentAgenda.title}</p>

          <div className="flex gap-2 pt-2">
            <button
              onClick={handleUserInteraction}
              className="flex-1 rounded-md bg-white/20 px-3 py-2
                         text-sm hover:bg-white/30 transition"
            >
              🔊 Ativar som
            </button>

            <button
              onClick={stopAlert}
              className="flex-1 rounded-md bg-black/30 px-3 py-2
                         text-sm hover:bg-black/40 transition"
            >
              🔕 Desligar
            </button>
          </div>
        </div>
      )}
    </AgendaAlertContext.Provider>
  );
}

export function useAgendaAlert() {
  return useContext(AgendaAlertContext);
}
