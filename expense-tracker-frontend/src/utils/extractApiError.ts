export function extractApiError(e: unknown, fallback = "Request failed"): string {
    if (e && typeof e === "object" && "response" in e) {
        const resp: any = (e as any).response;
        if (resp?.data?.errors) {
            return Object.values(resp.data.errors).flat().join(", ");
        }
        if (resp?.data?.message) return resp.data.message;
    }
    return fallback;
}