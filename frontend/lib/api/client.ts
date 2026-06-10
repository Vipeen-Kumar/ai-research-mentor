import { env } from "@/lib/config/env";

export async function apiGet<T>(path: string): Promise<T> {
  const response = await fetch(`${env.apiUrl}${path}`, {
    headers: {
      "Content-Type": "application/json",
    },
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`API request failed with status ${response.status}`);
  }

  return response.json() as Promise<T>;
}

export async function apiPost<TResponse, TRequest>(
  path: string,
  body: TRequest,
): Promise<TResponse> {
  const response = await fetch(`${env.apiUrl}${path}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
    cache: "no-store",
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || `API request failed with status ${response.status}`);
  }

  return response.json() as Promise<TResponse>;
}
