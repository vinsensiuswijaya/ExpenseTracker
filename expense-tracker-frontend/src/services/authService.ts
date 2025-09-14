import api from "./apiClient";
import type { LoginDto, RegisterDto, AuthResponse } from "../types/auth.ts";
import { extractToken } from "../types/auth.ts";

export async function login(data: LoginDto): Promise<AuthResponse> {
    const res = await api.post<AuthResponse>("/Account/login", data);
    return res.data;
}

export async function  register(data: RegisterDto): Promise<AuthResponse> {
    const res = await api.post<AuthResponse>("/Account/register", data);
    return res.data;
}

export function saveTokenFromResponse(resp: AuthResponse): string | null {
    const token = extractToken(resp);
    if (token) localStorage.setItem("auth_token", token);
    return token ?? null;
}

export function logout(): void {
    localStorage.removeItem("auth_token");
}