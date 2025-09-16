import { useRef, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getCategories, createCategory, updateCategory, deleteCategory } from "../../services/categoriesService";
import CategoryForm from "./CategoryForm";
import { extractApiError } from "../../utils/extractApiError";
import type { Category, CreateCategoryDto } from "../../types/category";

export default function CategoriesList() {
    const [isFormOpen, setFormOpen] = useState(false);
    const [editingCategory, setEditingCategory] = useState<Category | null>(null);
    const [submitError, setSubmitError] = useState<string | null>(null);
    const dialogRef = useRef<HTMLDialogElement | null>(null);

    const queryClient = useQueryClient();

    const { data: categories, isLoading, isError, error } = useQuery({
        queryKey: ['categories'],
        queryFn: getCategories
    });

    const deleteMutation = useMutation({
        mutationFn: deleteCategory,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['categories'] });
        },
        onError: (err) => {
            setSubmitError(extractApiError(err, "Failed to delete category"));
        }
    });

    const saveMutation = useMutation({
        mutationFn: async (data: { id?: number, name: CreateCategoryDto }) => {
            if (data.id) {
                await updateCategory(data.id, data.name);
            } else {
                await createCategory(data.name)
            }
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['categories'] });
            closeForm();
        },
        onError: (err) => {
            setSubmitError(extractApiError(err, "Failed to save category"));
        }
    });

    const handleEdit = (category: Category) => {
        setEditingCategory(category);
        setSubmitError(null);
        setFormOpen(true);
    };

    const handleAddNew = () => {
        setEditingCategory(null);
        setSubmitError(null);
        setFormOpen(true);
    };

    const closeForm = () => {
        setFormOpen(false);
        setEditingCategory(null);
        setSubmitError(null);
    };

    if (isLoading) {
        return <div className="p-4">Loading categories...</div>;
    }

    if (isError) {
        return <div className="p-4 text-red-500">Error: {error.message}</div>;
    }

    return (
        <div className="p-4">
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-2xl font-bold">Categories</h1>
                <button className="btn btn-primary" onClick={handleAddNew}>New Category</button>
            </div>

            {submitError && <div className="alert alert-error mb-4">{submitError}</div>}

            {isFormOpen && (
                <div className="mb-4">
                    <CategoryForm 
                        initial={editingCategory ?? undefined}
                        onSubmit={(name) => saveMutation.mutate({ id: editingCategory?.id, name})}
                        onCancel={closeForm}
                        submitting={saveMutation.isPending}
                        error={saveMutation.error ? extractApiError(saveMutation.error) : null}
                    />
                </div>
            )}

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
                                    <button className="btn btn-sm" onClick={() => handleEdit(category)}>Edit</button>
                                    <button
                                        className="btn btn-sm btn-error ml-2"
                                        onClick={() => deleteMutation.mutate(category.id)}
                                        disabled={deleteMutation.isPending && deleteMutation.variables === category.id}
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}