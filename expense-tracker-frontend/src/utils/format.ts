export function formatCurrency(amount: number, locale = navigator.language, currency = "IDR") {
    try {
        return new Intl.NumberFormat(locale, { style: "currency", currency }).format(amount);
    } catch {
        return amount.toFixed(2);
    }
}