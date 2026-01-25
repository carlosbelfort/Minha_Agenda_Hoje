import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function LandingPage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-color1">
      <div className="bg-black/40 backdrop-blur-md p-8 rounded-xl text-center max-w-md">
        <h1 className="text-3xl font-bold text-color5 mb-4">
          Minha Agenda Hoje
        </h1>

        <p className="text-color4 mb-6">
          Organize seus compromissos diários de forma simples e eficiente.
        </p>

        <Link href="/login">
          <Button>Acessar minha agenda</Button>
        </Link>
      </div>
    </main>
  );
}