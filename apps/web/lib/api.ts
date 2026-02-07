export async function api<T>(
  endpoint: string,
  options?: RequestInit,
): Promise<T> {
  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  const headers: HeadersInit = {
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options?.headers,
  };

  // 🚨 NÃO setar Content-Type quando for FormData
  if (!(options?.body instanceof FormData)) {
    headers ["Content-Type"] = "application/json";
  }

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}${endpoint}`,
    {
      ...options,
      headers,
    },
  );

  if (!response.ok) {
    let message = "Erro inesperado";

    try {
      const text = await response.text();
      message = text;
    } catch {}

    throw new Error(`API Error ${response.status}: ${message}`);
  }

  const contentType = response.headers.get("content-type");

  if (contentType?.includes("application/json")) {
    return response.json();
  }

  return null as T;
}