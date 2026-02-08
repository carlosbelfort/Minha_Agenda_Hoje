import { api } from "./api";

export async function getMe(): Promise<{
  id: string;
  name: string;
  email: string;
  role: "ADMIN" | "USER";
  backgroundImage?: string | null;
}> {
  return api("/users/me");
}
