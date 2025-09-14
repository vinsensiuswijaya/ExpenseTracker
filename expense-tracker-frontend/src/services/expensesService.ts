import api from "./apiClient";
import type { Expense, CreateExpenseDto, UpdateExpenseDto, ExpenseChartPoint } from "../types/expense";

const base = "/Expense";

export async function getExpenses(): Promise<Expense[]> {
    const res = await api.get<Expense[]>(base);
    return res.data;
}

export async function getExpense(id: number): Promise<Expense> {
    const res = await api.get<Expense>(`${base}/${id}`);
    return res.data;
}

export async function createExpense(dto: CreateExpenseDto): Promise<Expense> {
    const res = await api.post<Expense>(base, dto);
    return res.data;
}

export async function updateExpense(id:number, dto: UpdateExpenseDto): Promise<void> {
    await api.put(`${base}/${id}`, dto);
}

export async function deleteExpense(id:number): Promise<void> {
    await api.delete(`${base}/${id}`);
}

export async function getExpenseChart(): Promise<ExpenseChartPoint[]> {
    const res = await api.get<ExpenseChartPoint[]>(`${base}/chart`);
    return res.data;
}