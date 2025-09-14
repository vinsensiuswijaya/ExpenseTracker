import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import {
    login as apiLogin,
    register as apiRegister,
    saveTokenFromResponse,
    logout as apiLogout
} from "../services/authService.ts";
import type { LoginDto, RegisterDto } from "../types/auth.ts";

type AuthContextType = {
    token: string | null;
    isAuthenticated: boolean;
    login: (dto: LoginDto) => Promise<void>;
    register: (dto: RegisterDto) => Promise<void>;
    logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [token, setToken] = useState<string | null>(() => localStorage.getItem("auth_token"));

    useEffect(() => {
        const onStorage = () => setToken(localStorage.getItem("auth_token"));
        window.addEventListener("storage", onStorage);;
        return () => window.removeEventListener("storage", onStorage);
    }, []);

    const value = useMemo<AuthContextType>(() => ({
        token,
        isAuthenticated: !!token,
        async login(dto) {
            const resp = await apiLogin(dto);
            const t = saveTokenFromResponse(resp);
            if (!t) throw new Error("No token returned from server.");
            setToken(t);
        },
        async register(dto) {
            const resp = await apiRegister(dto);
            const t = saveTokenFromResponse(resp);
            if (!t) throw new Error("No token returned from server.");
            setToken(t);
        },
        logout() {
            apiLogout();
            setToken(null);
        },
    }), [token]);

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error("useAuth must be used within AuthProvider");
    return ctx;
}