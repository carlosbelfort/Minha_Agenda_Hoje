"use client";

import React from "react";
import { useAgendaAlerts } from "../../hooks/useAgendaAlerts";

export function AgendaAlert() {
  const { alertActive, dismissAlert } = useAgendaAlerts();

  if (!alertActive) return null;

  return (
    <div
      style={{
        position: "fixed",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        backgroundColor: "hsl(222.2, 84%, 4.9%)",
        color: "#fff",
        border: "1px solid hsl(222.2, 84%, 15%)",
        padding: "1.5rem 2rem",
        borderRadius: "12px",
        zIndex: 9999,
        textAlign: "center",
        boxShadow: "0 8px 20px rgba(0,0,0,0.3)",
        maxWidth: "90%",
        minWidth: "300px",
      }}
    >
      <strong>Tarefa:</strong> {alertActive.title}
      <br />
      <button
        onClick={dismissAlert}
        style={{
          marginTop: "1rem",
          backgroundColor: "#ff4d4d",
          color: "#fff",
          border: "none",
          padding: "0.5rem 1rem",
          borderRadius: "6px",
          cursor: "pointer",
          fontWeight: "bold",
        }}
      >
        Desligar
      </button>
    </div>
  );
}