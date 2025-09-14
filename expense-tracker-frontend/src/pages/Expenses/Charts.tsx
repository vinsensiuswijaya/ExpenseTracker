import { useEffect, useMemo, useState } from "react";
import { getExpenses } from "../../services/expensesService";
import type { Expense } from "../../types/expense";
import { formatCurrency } from "../../utils/format";
import Chart from "chart.js/auto";
import { CategoryScale } from "chart.js";
import {Pie} from "react-chartjs-2";
import { extractApiError } from "../../utils/extractApiError";

Chart.register(CategoryScale);

export default function Charts() {
    const [items, setItems] = useState<Expense[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        (async () => {
            try {
                setLoading(true);
                setError(null);
                const data = await getExpenses();
                setItems(data);
            } catch (e) {
                setError(extractApiError(e, "Failed to load data"));
            } finally {
                setLoading(false);
            }
        })();
    }, []);

    const byCategory = useMemo(() => {
        const map = new Map<string, number>();
        for (const e of items) {
            const key = e.categoryName ?? String(e.categoryId);
            map.set(key, (map.get(key) ?? 0) + e.amount);
        }
        return Array.from(map.entries()).map(([label, total]) => ({ label, total }));
    }, [items]);

    const chartData = {
        labels: byCategory.map((data) => data.label),
        datasets: [
            {
                label: "Total",
                data: byCategory.map((data) => data.total)
            }
        ]
    };

    return (
        <div className="p-4">
            <h1 className="text-2xl font-semibold mb-4">Expense Summary</h1>
            {loading ? (
                <div className="loading loading-lg" />
            ) : error ? (
                <div className="alert alert-error">{error}</div>
            ) : (
                <>
                    <div className="overflow-x-auto bg-base-100 rounded-box shadow">
                        <table className="table">
                            <thead>
                                <tr>
                                    <th>Category</th>
                                    <th className="text-right">Total</th>
                                </tr>
                            </thead>
                            <tbody>
                                {byCategory.map((row) => (
                                    <tr key={row.label}>
                                        <td>{row.label}</td>
                                        <td className="text-right">{formatCurrency(row.total)}</td>
                                    </tr>
                                ))}
                                {byCategory.length === 0 && (
                                    <tr><td colSpan={2} className="text-center opacity-70">No data</td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                    <div className="chart-container max-w-lg mx-auto mt-8">
                        <Pie data={chartData} />
                    </div>
                </>
            )}
        </div>
    );
}