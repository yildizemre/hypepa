const API_URL = (import.meta.env.VITE_API_URL || '').replace(/\/$/, '') || 'http://127.0.0.1:3001';

const TOKEN_KEY = 'orbitra_token';

export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token: string | null): void {
  if (token) localStorage.setItem(TOKEN_KEY, token);
  else localStorage.removeItem(TOKEN_KEY);
}

export type UserRole = 'admin' | 'user';

export interface AppUser {
  id: string;
  username: string;
  role: UserRole;
  created_at?: string;
}

async function request<T>(
  path: string,
  options: RequestInit & { token?: string | null } = {}
): Promise<T> {
  const { token, ...init } = options;
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(init.headers as Record<string, string>),
  };
  if (token) (headers as Record<string, string>)['Authorization'] = `Bearer ${token}`;

  let res: Response;
  try {
    res = await fetch(`${API_URL}${path}`, { ...init, headers });
  } catch (e) {
    throw new Error(
      'Sunucuya bağlanılamadı. API (backend) çalışıyor mu? Adres: ' + API_URL
    );
  }

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error((data as { error?: string }).error || res.statusText || 'İstek başarısız.');
  }
  return data as T;
}

export interface LoginResponse {
  user: AppUser;
  token: string;
}

export async function login(username: string, password: string): Promise<LoginResponse> {
  return request<LoginResponse>('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify({ username: username.trim(), password }),
  });
}

export interface UserRow {
  id: string;
  username: string;
  role: string;
  created_at: string;
}

export async function listUsers(token: string): Promise<UserRow[]> {
  return request<UserRow[]>('/api/users', { method: 'GET', token });
}

export async function createUser(
  token: string,
  username: string,
  password: string,
  role: 'admin' | 'user'
): Promise<UserRow> {
  return request<UserRow>('/api/users', {
    method: 'POST',
    token,
    body: JSON.stringify({ username: username.trim(), password, role }),
  });
}

export async function deleteUser(token: string, userId: string): Promise<void> {
  return request<void>(`/api/users/${encodeURIComponent(userId)}`, {
    method: 'DELETE',
    token,
  });
}
