import { api } from "./api";

type LoginResponse = {
  token: string;
  user: {
    id: string;
    name: string;
    email: string;
    role: "ADMIN" | "USER";
    backgroundImage: string | null;
  };
};

export async function loginRequest(data: {
  email: string;
  password: string;
}): Promise<LoginResponse> {
  return api<LoginResponse>("/auth/login", {
    method: "POST",
    body: JSON.stringify(data),
  });
}