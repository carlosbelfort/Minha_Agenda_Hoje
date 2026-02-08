"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { loginRequest } from "@/lib/auth";
import { getMe } from "@/lib/users";

type User = {
  id: string;
  name: string;
  email: string;
  role: "ADMIN" | "USER";
  backgroundImage?: string | null;
};

type AuthContextType = {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  loading: boolean;
};

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  /* =========================
     REIDRATAÇÃO DO USUÁRIO
  ========================= */
  useEffect(() => {
    const token = localStorage.getItem("token");
    const userData = localStorage.getItem("user");

    if (token && userData && userData !== "undefined") {
      setUser(JSON.parse(userData));
    } else {
      localStorage.removeItem("user");
      setUser(null);
    }

    setLoading(false); 
  }, []);

  /* =========================
     APLICAR FUNDO DO USUÁRIO
  ========================= */
  useEffect(() => {
    if (user?.backgroundImage) {
      document.body.style.setProperty(
        "--user-background",
        `url("${user.backgroundImage}")`,
      );
    } else {
      document.body.style.removeProperty("--user-background");
    }
  }, [user]);

  
  async function login(email: string, password: string) {
    const { token } = await loginRequest({ email, password });

    localStorage.setItem("token", token);

    const user = await getMe(); //busca perfil completo

    localStorage.setItem("user", JSON.stringify(user));
    setUser(user);

    router.push("/dashboard");
  }

  function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    router.push("/login");
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
