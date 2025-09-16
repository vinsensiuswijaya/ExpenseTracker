import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "../context/AuthContext";
import { getCategories } from "../services/categoriesService";
import { getExpenses } from "../services/expensesService";
import { formatCurrency } from "../utils/format";
import { extractApiError } from "../utils/extractApiError";
import Charts from "./Expenses/Charts";

export default function Home() {
    const { isAuthenticated } = useAuth();
    
    const {
        data: categories,
        isLoading: isLoadingCategories,
        error: categoriesError
    } = useQuery({
        queryKey: ['categories'],
        queryFn: getCategories,
        enabled: isAuthenticated,
    });

    const {
        data: expenses,
        isLoading: isLoadingExpenses,
        error: expensesError
    } = useQuery({
        queryKey: ['expenses'],
        queryFn: getExpenses,
        enabled: isAuthenticated,
    });

    const categoryCount = categories?.length ?? 0;
    const expenseCount = expenses?.length ?? 0;
    const totalSpent = useMemo(() => 
        expenses?.reduce((sum, e) => sum + e.amount, 0) ?? 0,
        [expenses]
    );

    const isLoading = isLoadingCategories || isLoadingExpenses;
    const combinedError = categoriesError || expensesError;

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
        <>
        <div className="p-4">
            <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
            {isLoading ? (
                <div className="flex items-center gap-2"><span className="loading loading-spinner" />Loading...</div>
            ) : combinedError ? (
                <div className="alert alert-error">{extractApiError(combinedError, "Failed to load data")}</div>
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
                        <div className="stat-value">{formatCurrency(totalSpent)}</div>
                    </div>
                </div>
            )}
        </div>
        <Charts />
        </>
    );
}