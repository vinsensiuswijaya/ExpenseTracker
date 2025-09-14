export type Expense = {
    id: number;
    categoryId: number;
    categoryName?: string;
    amount: number;
    description?: string | null;
    date: string;
};

export type CreateExpenseDto = {
    categoryId: number;
    amount: number;
    description?: string;
    date: string;
}

export type UpdateExpenseDto = CreateExpenseDto;

export type ExpenseChartPoint = {
    category: string;
    total: number;
}