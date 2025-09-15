import { useEffect, useMemo, useRef, useState } from "react";
import { createCategory, deleteCategory, getCategories, updateCategory } from "../../services/categoriesService";
import type { Category } from "../../types/category";
import CategoryForm from "./CategoryForm";
import type { CategoryFormValues } from "./CategoryForm";
import { extractApiError } from "../../utils/extractApiError";

export default function CategoriesList() {
    const [items, setItems] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [editing, setEditing] = useState<Category | null>(null);
    const [submitting, setSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState<string | null>(null);
    const [creationCount, setCreationCount] = useState(0);
    const dialogRef = useRef<HTMLDialogElement | null>(null);

    const title = useMemo(() => (editing ? "Edit Category" : "New Category"), [editing]);

    useEffect(() => {
        (async () => {
            try {
                setLoading(true);
                setError(null);
                const data = await getCategories();
                setItems(data);
            } catch (e: any) {
                setError(extractApiError(e, "Failed to load categories"));
            } finally {
                setLoading(false);
            }
        })();
    }, []);

    const openCreate = () => {
        setEditing(null);
        setCreationCount(c => c + 1);
        dialogRef.current?.showModal();
    };

    const openEdit = (c: Category) => {
        setEditing(c);
        dialogRef.current?.showModal();
    }

    const closeDialog = () => {
        setEditing(null);
        setSubmitError(null);
        dialogRef.current?.close();
    };

    const handleSubmit = async (values: CategoryFormValues) => {
        setSubmitting(true);
        setSubmitError(null);
        try {
            if (editing) {
                await updateCategory(editing.id, {name: values.name});
                setItems((prev) => prev.map((x) => (x.id === editing.id ? {...x, name: values.name} : x)));
            } else {
                const created = await createCategory({name: values.name});
                setItems((prev) => [created, ...prev]);
            }
            closeDialog();
        } catch (e) {
            setSubmitError(extractApiError(e, "Save Failed"));
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (c: Category) => {
        if (!confirm(`Delete category "${c.name}"?`)) return;
        try {
            await deleteCategory(c.id);
            setItems((prev) => prev.filter((x) => x.id !== c.id));
        } catch (e) {
            alert(extractApiError(e, "Delete failed"));
        }
    };

    return (
        <div className="p-4">
            <div className="flex items-center justify-between mb-4">
                <h1 className="text-2xl font-semibold">Categories</h1>
                <button className="btn btn-primary" onClick={openCreate}>New Category</button>
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
                                <th>No.</th>
                                <th>Name</th>
                                <th className="w-40" />
                            </tr>
                        </thead>
                        <tbody>
                            {items.map((c, idx) => (
                                <tr key={c.id}>
                                    <td>{idx + 1}</td>
                                    <td>{c.name}</td>
                                    <td className="flex gap-2 justify-end">
                                        <button className="btn btn-xs" onClick={() => openEdit(c)}>Edit</button>
                                        <button className="btn btn-xs btn-error" onClick={() => handleDelete(c)}>Delete</button>
                                    </td>
                                </tr>
                            ))}
                            {items.length === 0 && (
                                <tr><td colSpan={3} className="text-center opacity-70">No Categories</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>
            )}

            <dialog className="modal" ref={dialogRef}>
                <div className="modal-box">
                    <h3 className="font-bold text-lg mb-2">{title}</h3>
                    <CategoryForm 
                        key={editing?. id || `new-${creationCount}`}
                        initial={editing ? { name: editing.name } : undefined}
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