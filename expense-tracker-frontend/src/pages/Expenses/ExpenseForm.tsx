import { useEffect, useState } from "react";
import type { Expense } from "../../types/expense";
import type { Category } from "../../types/category";

export type ExpenseFormValues = {
    categoryId: number;
    amount: number;
    date: string;
    description?: string;
};

export default function ExpenseForm({
    initial,
    categories,
    onSubmit,
    onCancel,
    submitting,
    error
}: {
    initial?: Expense | ExpenseFormValues;
    categories: Category[];
    onSubmit: (values: ExpenseFormValues) => Promise<void> | void;
    onCancel: () => void;
    submitting?: boolean;
    error?: string | null;
}) {
    const [values, setValues] = useState<ExpenseFormValues>(() => {
        if (!initial) {
            return {
                categoryId: 0,
                amount: 0,
                date: new Date().toISOString().slice(0, 10),
                description: "",
            };
        }
        return {
            categoryId: (initial as any).categoryId ?? 0,
            amount: (initial as any).amount ?? 0,
            date: ((initial as any).date ?? new Date().toISOString()).slice(0, 10),
            description: (initial as any).description ?? "",
        };
    });

    useEffect(() => {
        if (initial) {
            setValues({
                categoryId: (initial as any).categoryId ?? 0,
                amount: (initial as any).amount ?? 0,
                date: ((initial as any).date ?? new Date().toISOString()).slice(0, 10),
                description: (initial as any).description ?? "",
            });
        } else {
            setValues({
                categoryId: 0,
                amount: 0,
                date: new Date().toISOString().slice(0, 10),
                description: "",
            });
        }
    }, [initial]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        await onSubmit(values);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-3">
            {error && <div className="alert alert-error text-sm">{error}</div>}

            <div className="form-control">
                <label className="label"><span className="label-text">Category</span></label>
                <select
                    className="select select-bordered"
                    value={values.categoryId}
                    onChange={(e) => setValues({ ...values, categoryId: Number(e.target.value) })}
                    required
                >
                    <option value={0} disabled>Select Category</option>
                    {categories.map((c) => (
                        <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                </select>
            </div>

            <div className="form-control">
                <label className="label"><span className="label-text">Amount</span></label>
                <input 
                    type="number"
                    step="1"
                    min="0"
                    className="input input-bordered"
                    value={values.amount}
                    onChange={(e) => setValues({ ...values, amount: Number(e.target.value) })}
                    required
                />
            </div>

            <div className="form-control">
                <label className="label"><span className="label-text">Date</span></label>
                <input 
                    type="date"
                    className="input input-bordered"
                    value={values.date}
                    onChange={(e) => setValues({ ...values, date: e.target.value })}
                    required
                />
            </div>

            <div className="form-control">
                <label className="label"><span className="label-text">Description</span></label>
                <input
                    className="input input-bordered"
                    value={values.description}
                    onChange={(e) => setValues({ ...values, description: e.target.value })}
                />
            </div>

            <div className="flex justify-end gap-2">
                <button type="button" className="btn btn-ghost" onClick={onCancel} disabled={submitting}>Cancel</button>
                <button className={`btn btn-primary ${submitting ? "loading" : ""}`} disabled={submitting}>Save</button>
            </div>
        </form>
    )
}