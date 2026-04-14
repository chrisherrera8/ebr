const API_URL = import.meta.env['VITE_API_URL'] ?? 'http://localhost:8000';

export async function apiFetch<T>(
  endpoint: string,
  options?: RequestInit,
): Promise<T> {
  const isFormData = options?.body instanceof FormData;

  const headers: HeadersInit = isFormData
    ? { ...(options?.headers ?? {}) }
    : { 'Content-Type': 'application/json', ...(options?.headers ?? {}) };

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({})) as Record<string, unknown>;
    const detail = typeof error['detail'] === 'string' ? error['detail'] : 'API request failed';
    throw new Error(detail);
  }

  return response.json() as Promise<T>;
}

export { API_URL };
