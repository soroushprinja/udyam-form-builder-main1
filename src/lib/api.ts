export type ApiResponse<T> = { ok?: boolean } & T;

const API_URL = (import.meta as any).env?.VITE_API_URL || "http://localhost:3001";

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    headers: { 'Content-Type': 'application/json', ...(options?.headers || {}) },
    ...options,
  });
  const contentType = res.headers.get('content-type') || '';
  const isJson = contentType.includes('application/json');
  const body = isJson ? await res.json() : (await res.text());
  if (!res.ok) {
    const message = isJson && (body as any)?.error ? (body as any).error : `HTTP ${res.status}`;
    throw new Error(message);
  }
  return body as T;
}

export async function createSubmission(): Promise<{ id: string }> {
  return request<{ id: string }>(`/api/submissions`, { method: 'POST' });
}

export async function saveStep1(submissionId: string, data: any): Promise<ApiResponse<{}>> {
  return request<ApiResponse<{}>>(`/api/submissions/${submissionId}/step1`, {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function saveStep2(submissionId: string, data: any): Promise<ApiResponse<{}>> {
  return request<ApiResponse<{}>>(`/api/submissions/${submissionId}/step2`, {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function saveStep3(submissionId: string, data: any): Promise<ApiResponse<{}>> {
  return request<ApiResponse<{}>>(`/api/submissions/${submissionId}/step3`, {
    method: 'POST',
    body: JSON.stringify(data),
  });
}


