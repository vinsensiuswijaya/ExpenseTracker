import { useEffect, useMemo, useState } from "react";
import type { ExpenseChartPoint } from "../../types/expense";
import { getExpenseChart } from "../../services/expensesService";
import { formatCurrency } from "../../utils/format";
import Chart from "chart.js/auto";
import { CategoryScale } from "chart.js";
import { Pie } from "react-chartjs-2";
import { extractApiError } from "../../utils/extractApiError";

Chart.register(CategoryScale);

export default function Charts() {
    const [items, setItems] = useState<ExpenseChartPoint[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        (async () => {
            try {
                setLoading(true);
                setError(null);
                const points = await getExpenseChart();
                setItems(points.map(p => ({
                    category: p.category,
                    total: p.total
                })));
            } catch (e) {
                setError(extractApiError(e, "Failed to load data"));
            } finally {
                setLoading(false);
            }
        })();
    }, []);

    const byCategory = useMemo(() => {
        return items.map(e => ({ label: e.category, total: e.total }));
    }, [items]);

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
                        <Pie data={{
                            labels: byCategory.map(r => r.label),
                            datasets: [{ label: "Total", data: byCategory.map(r => r.total) }]
                        }} />
                    </div>
                </>
            )}
        </div>
    );
}