export type LoginDto = {
    username: string;
    password: string;
};

export type RegisterDto = {
    username: string;
    email: string;
    password: string;
};

export type AuthResponse = {
    token?: string;
    accessToken?: string;
    jwt?: string;
    username: string;
    email: string;
}

export function extractToken(resp: AuthResponse): string | null {
    return resp.token ?? resp.accessToken ?? resp.jwt ?? null;
}