import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { getCategories } from "../services/categoriesService";
import { getExpenses } from "../services/expensesService";
import type { Expense } from "../types/expense";

export default function Home() {
    const { isAuthenticated } = useAuth();
    const [loading, setLoading] = useState(false);
    const [categoryCount, setCategoryCount] = useState(0);
    const [expenseCount, setExpenseCount] = useState(0);
    const [totalSpent, setTotalSpent] = useState(0);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!isAuthenticated) return;
        (async () => {
            try {
                setLoading(true);
                setError(null);
                const [cats, exps] = await Promise.all([getCategories(), getExpenses()]);
                setCategoryCount(cats.length);
                setExpenseCount(exps.length);
                setTotalSpent(exps.reduce((sum: number, e: Expense) => sum + e.amount, 0));
            } catch (e: any) {
                setError(e?.response?.data?.message || "Failed to load dashboard data");
            } finally {
                setLoading(false);
            }
        })();
    }, [isAuthenticated]);

    if (!isAuthenticated) {
        return (
            <div className="p-6">
                <h1 className="text-3xl font-bold mb-2">Expense Tracker</h1>
                <p className="opacity-70 mb-4">
                    Please login or register to manage categories and expenses.
                </p>
            </div>
        );
    }

    return (
        <div className="p-6 space-y-6">
            <h1 className="text-2xl font-semibold">Dashboard</h1>
            {loading ? (
                <div className="flex items-center gap-2"><span className="loading loading-spinner" />Loading...</div>
            ) : error ? (
                <div className="alert alert-error">{error}</div>
            ) : (
                <div className="grid gap-4 md:grid-cols-3">
                    <div className="stat bg-base-100 rounded-box shadow">
                        <div className="stat-title">Categories</div>
                        <div className="stat-value text-primary">{categoryCount}</div>
                    </div>
                    <div className="stat bg-base-100 rounded-box shadow">
                        <div className="stat-title">Expenses</div>
                        <div className="stat-value text-secondary">{expenseCount}</div>
                    </div>
                    <div className="stat bg-base-100 rounded-box shadow">
                        <div className="stat-title">Total Spent</div>
                        <div className="stat-value">Rp{totalSpent.toFixed(2)}</div>
                    </div>
                </div>
            )}
        </div>
    );
}