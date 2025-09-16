import { useEffect, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import type { ExpenseChartPoint } from "../../types/expense";
import { getExpenseChart } from "../../services/expensesService";
import { formatCurrency } from "../../utils/format";
import Chart from "chart.js/auto";
import { CategoryScale } from "chart.js";
import { Pie } from "react-chartjs-2";
import { extractApiError } from "../../utils/extractApiError";

Chart.register(CategoryScale);

export default function Charts() {
    const { data: chartData, isLoading, error } = useQuery({
        queryKey: ['expenseChart'],
        queryFn: getExpenseChart,
    });

    return (
        <div className="p-4">
            <h1 className="text-2xl font-semibold mb-4">Expense Summary</h1>
            {isLoading ? (
                <div className="loading loading-lg" />
            ) : error ? (
                <div className="alert alert-error">{extractApiError(error, "Failed to load data")}</div>
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
                                {chartData?.map((row) => (
                                    <tr key={row.category}>
                                        <td>{row.category}</td>
                                        <td className="text-right">{formatCurrency(row.total)}</td>
                                    </tr>
                                ))}
                                {chartData?.length === 0 && (
                                    <tr><td colSpan={2} className="text-center opacity-70">No data</td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                    <div className="chart-container max-w-lg mx-auto mt-8">
                        <Pie data={{
                            labels: chartData?.map(row => row.category),
                            datasets: [{ label: "Total", data: chartData?.map(row => row.total) }]
                        }} />
                    </div>
                </>
            )}
        </div>
    );
}