import { useEffect, useMemo, useRef, useState } from "react";
import { createExpense, deleteExpense, getExpense, getExpenses, updateExpense } from "../../services/expensesService";
import { getCategories } from "../../services/categoriesService";
import type { Expense } from "../../types/expense";
import type { Category } from "../../types/category";
import ExpenseForm from "./ExpenseForm";
import type { ExpenseFormValues } from "./ExpenseForm";
import { formatCurrency } from "../../utils/format";
import { extractApiError } from "../../utils/extractApiError";

export default function ExpensesList() {
    const [items, setItems] = useState<Expense[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [editing, setEditing] = useState<Expense | null>(null);
    const [submitting, setSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState<string | null>(null);
    const dialogRef = useRef<HTMLDialogElement | null>(null);

    const title = useMemo(() => (editing ? "Edit Expense" : "New Expense"), [editing]);

    useEffect(() => {
        (async () => {
            try {
                setLoading(true);
                setError(null);
                const [cats, exps] = await Promise.all([getCategories(), getExpenses()]);
                setCategories(cats);
                setItems(
                    exps.map((e) => ({
                        ...e,
                        categoryName: e.categoryName ?? cats.find((c) => c.id === e.categoryId)?.name
                    }))
                );
            } catch (e) {
                setError(extractApiError(e, "Failed to load expenses"));
            } finally {
                setLoading(false);
            }
        })();
    }, []);

    const openCreate = () => {
        setEditing(null);
        dialogRef.current?.showModal();
    };

    const openEdit = (e: Expense) => {
        setEditing(e);
        dialogRef.current?.showModal();
    }

    const closeDialog = () => {
        dialogRef.current?.close();
        setEditing(null);
        setSubmitError(null);
    };

    const handleSubmit = async (values: ExpenseFormValues) => {
        setSubmitting(true);
        setSubmitError(null);
        try {
            if (editing) {
                await updateExpense(editing.id, {
                    categoryId: values.categoryId,
                    amount: values.amount,
                    date: new Date(values.date).toISOString(),
                    description: values.description,
                });
                setItems((prev) =>
                    prev.map((x) => 
                        x.id === editing.id
                            ? {
                                ...x,
                                ...values,
                                date: values.date,
                                categoryName: categories.find((c) => c.id === values.categoryId)?.name,
                            }
                        : x
                    )
                );
            } else {
                const created = await createExpense({
                    categoryId: values.categoryId,
                    amount: values.amount,
                    date: new Date(values.date).toISOString(),
                    description: values.description,
                });
                setItems((prev) => [
                    {
                        ...created,
                        date: created.date?.slice(0, 10) ?? values.date,
                        categoryName: categories.find((c) => c.id === created.categoryId)?.name,
                    },
                    ...prev,
                ]);
            }
            closeDialog();
        } catch (e) {
            setSubmitError(extractApiError(e, "Save failed"));
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (exp: Expense) => {
        if (!confirm("Delete this expense?")) return;
        try {
            await deleteExpense(exp.id);
            setItems((prev) => prev.filter((x) => x.id !== exp.id));
        } catch (e) {
            alert(extractApiError(e, "Delete failed"));
        }
    };

    return (
        <div className="p-4">
            <div className="flex items-center justify-between mb-4">
                <h1 className="text-2xl font-semibold">Expenses</h1>
                <button className="btn btn-primary" onClick={openCreate}>New Expense</button>
            </div>

            {loading ? (
                <div className="loading loading-lg" />
            ) : error ? (
                <div className="alert aler-error">{error}</div>
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
                            {items.map((e) => (
                                <tr key={e.id}>
                                    <td>{(e.date || "").slice(0, 10)}</td>
                                    <td>{e.description}</td>
                                    <td className="text-right">{formatCurrency(e.amount)}</td>
                                    <td>{e.categoryName ?? e.categoryId}</td>
                                    <td className="flex gap-2 justify-end">
                                        <button className="btn btn-xs" onClick={() => openEdit(e)}>Edit</button>
                                        <button className="btn btn-xs btn-error" onClick={() => handleDelete(e)}>Delete</button>
                                    </td>
                                </tr>
                            ))}
                            {items.length === 0 && (
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
                        initial={editing ?? undefined}
                        categories={categories}
                        onSubmit={handleSubmit}
                        onCancel={closeDialog}
                        submitting={submitting}
                        error={submitError}
                    />
                </div>
                <form method="dialog" className="modal-backdrop" onClick={closeDialog}><button>close</button></form>
            </dialog>
        </div>
    );
}