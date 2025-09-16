import { useMemo, useRef, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getCategories, createCategory, updateCategory, deleteCategory } from "../../services/categoriesService";
import CategoryForm, { type CategoryFormValues } from "./CategoryForm";
import { extractApiError } from "../../utils/extractApiError";
import type { Category, CreateCategoryDto } from "../../types/category";

export default function CategoriesList() {
    const [editingCategory, setEditingCategory] = useState<Category | null>(null);
    const dialogRef = useRef<HTMLDialogElement | null>(null);

    const queryClient = useQueryClient();

    const title = useMemo(() => (editingCategory ? "Edit Category" : "New Category"), [editingCategory])

    const { data: categories, isLoading, error } = useQuery({
        queryKey: ['categories'],
        queryFn: getCategories
    });

    const saveMutation = useMutation({
        mutationFn: async (data: { id?: number, values: CreateCategoryDto }) => {
            if (data.id) {
                await updateCategory(data.id, data.values);
            } else {
                await createCategory(data.values)
            }
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['categories'] });
            closeDialog();
        },
    });

    const deleteMutation = useMutation({
        mutationFn: deleteCategory,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['categories'] });
        },
    });
    
    const openCreate = () => {
        saveMutation.reset();
        setEditingCategory(null);
        dialogRef.current?.showModal();
    };

    const openEdit = (category: Category) => {
        saveMutation.reset();
        setEditingCategory(category);
        dialogRef.current?.showModal();
    };

    const closeDialog = () => {
        setEditingCategory(null);
        dialogRef.current?.close();
    };

    const handleSubmit = (values: CategoryFormValues) => {
        saveMutation.mutate({ id: editingCategory?.id, values });
    };

    const handleDelete = (id: number) => {
        if (confirm("Delete this category?")) {
            deleteMutation.mutate(id);
        }
    };

    return (
        <div className="p-4">
            <div className="flex items-center justify-between mb-4">
                <h1 className="text-2xl font-bold">Categories</h1>
                <button className="btn btn-primary" onClick={openCreate}>New Category</button>
            </div>

            {isLoading ? (
                <div className="flex justify-center"><span className="loading loading-lg"></span></div>
            ) : error ? (
                <div className="alert alert-error">{extractApiError(error, "Failed to load categories")}</div>
            ) : (
                <div className="overflow-x-auto bg-base-100 rounded-box shadow">
                    <table className="table">
                        <thead>
                            <tr>
                                <th className="w-20">No.</th>
                                <th>Name</th>
                                <th className="w-40" />
                            </tr>
                        </thead>
                        <tbody>
                            {categories?.map((category, idx) => (
                                <tr key={category.id}>
                                    <td>{idx + 1}</td>
                                    <td>{category.name}</td>
                                    <td className="flex gap-2 justify-end">
                                        <button className="btn btn-sm" onClick={() => openEdit(category)}>Edit</button>
                                        <button
                                            className="btn btn-sm btn-error"
                                            onClick={() => handleDelete(category.id)}
                                            disabled={deleteMutation.isPending && deleteMutation.variables === category.id}
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            {categories?.length === 0 && (
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
                        key={editingCategory?.id || 'new'}
                        initial={editingCategory ?? undefined}
                        onSubmit={handleSubmit}
                        onCancel={closeDialog}
                        submitting={saveMutation.isPending}
                        error={saveMutation.error ? extractApiError(saveMutation.error, "Save failed") : null}
                    />
                </div>
            </dialog>
        </div>
    )
}