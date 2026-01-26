"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { BackButton } from "@/components/ui/back-button";

type User = {
  id: string;
  name: string;
  email: string;
  role: "ADMIN" | "USER";
};

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api<User[]>("/users")
      .then(setUsers)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <div className="h-32 bg-muted animate-pulse rounded-md" />;
  }

  return (
    <main className="space-y-8">
      <BackButton />
      <div>
        <h2 className="text-xl font-semibold">Usuários</h2>

        <div className="rounded-md border border-border overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-muted">
              <tr>
                <th className="p-2 text-left">Nome</th>
                <th className="p-2 text-left">Email</th>
                <th className="p-2 text-left">Role</th>
              </tr>
            </thead>

            <tbody>
              {users.map((user) => (
                <tr key={user.id} className="border-t border-border">
                  <td className="p-2">{user.name}</td>
                  <td className="p-2">{user.email}</td>
                  <td className="p-2">{user.role}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}
