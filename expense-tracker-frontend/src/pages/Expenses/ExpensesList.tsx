import { useMemo, useRef, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getExpenses, createExpense, updateExpense, deleteExpense } from "../../services/expensesService";
import { getCategories } from "../../services/categoriesService";
import type { Expense, CreateExpenseDto } from "../../types/expense";
import ExpenseForm, { type ExpenseFormValues } from "./ExpenseForm";
import { formatCurrency } from "../../utils/format";
import { extractApiError } from "../../utils/extractApiError";

export default function ExpensesList() {
    const [editingExpense, setEditingExpense] = useState<Expense | null>()
    const dialogRef = useRef<HTMLDialogElement | null>(null);

    const queryClient = useQueryClient();

    const title = useMemo(() => (editingExpense ? "Edit Expense" : "New Expense"), [editingExpense]);

    const { data: expenses, isLoading: isLoadingExpenses, error: expensesError } = useQuery({
        queryKey: ['expenses'],
        queryFn: getExpenses,
    })

    const { data: categories, isLoading: isLoadingCategories } = useQuery({
        queryKey: ['categories'],
        queryFn: getCategories,
    });

    const saveMutation = useMutation({
        mutationFn: async (data: { id?: number, values: CreateExpenseDto }) => {
            if (data.id) {
                await updateExpense(data.id, data.values);
            } else {
                await createExpense(data.values);
            }
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['expenses'] });
            closeDialog();
        },
    });

    const deleteMutation = useMutation({
        mutationFn: deleteExpense,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['expenses'] });
        },
    });

    const openCreate = () => {
        saveMutation.reset();
        setEditingExpense(null);
        dialogRef.current?.showModal();
    };

    const openEdit = (expense: Expense) => {
        saveMutation.reset();
        setEditingExpense(expense);
        dialogRef.current?.showModal();
    };

    const closeDialog = () => {
        setEditingExpense(null);
        dialogRef.current?.close();
    };

    const handleSubmit = (values: ExpenseFormValues) => {
        saveMutation.mutate({ id: editingExpense?.id, values });
    };

    const handleDelete = (id: number) => {
        if (confirm("Delete this expense?")) {
            deleteMutation.mutate(id);
        }
    };

    const isLoading = isLoadingExpenses || isLoadingCategories;

    return (
        <div className="p-4">
            <div className="flex items-center justify-between mb-4">
                <h1 className="text-2xl font-bold">Expenses</h1>
                <button className="btn btn-primary" onClick={openCreate}>New Expense</button>
            </div>

            {isLoading ? (
                <div className="flex justify-center"><span className="loading loadin-lg"></span></div>
            ) : expensesError ? (
                <div className="alert alert-error">{extractApiError(expensesError, "Failed to load expenses")}</div>
            ) : (
                <div className="overflow-x-auto bg-base-100 rounded-box shadow">
                    <table className="table">
                        <thead>
                            <tr>
                                <th>Date</th>
                                <th>Description</th>
                                <th className="text-right">Amount</th>
                                <th>Category</th>
                                <th className="w-40" />
                            </tr>
                        </thead>
                        <tbody>
                            {expenses?.map((expense) => (
                                <tr key={expense.id}>
                                    <td>{(expense.date).slice(0, 10)}</td>
                                    <td>{expense.description}</td>
                                    <td className="text-right">{formatCurrency(expense.amount)}</td>
                                    <td>{expense.categoryName ?? expense.categoryId}</td>
                                    <td className="flex gap-2 justify-end">
                                        <button className="btn btn-xs" onClick={() => openEdit(expense)}>Edit</button>
                                        <button 
                                            className="btn btn-xs btn-error"
                                            onClick={() => handleDelete(expense.id)}
                                            disabled={deleteMutation.isPending && deleteMutation.variables === expense.id}
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            {expenses?.length === 0 && (
                                <tr><td colSpan={5} className="text-center opacity-70">No Expenses</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>
            )}

            <dialog className="modal" ref={dialogRef}>
                <div className="modal-box">
                    <h3 className="font-bold text-lg mb-2">{title}</h3>
                    <ExpenseForm 
                        key={editingExpense?.id || 'new'}
                        initial={editingExpense ?? undefined}
                        categories={categories || []}
                        onSubmit={handleSubmit}
                        onCancel={closeDialog}
                        submitting={saveMutation.isPending}
                        error={saveMutation.error ? extractApiError(saveMutation.error, "Save failed") : null}
                    />
                </div>
                <form method="dialog" className="modal-backdrop" onClick={closeDialog}><button>close</button></form>
            </dialog>
        </div>
    );
}