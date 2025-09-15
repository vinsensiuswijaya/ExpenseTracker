import { useEffect, useState } from "react";

export type CategoryFormValues = { name: string };

export default function CategoryForm({
    initial,
    onSubmit,
    onCancel,
    submitting,
    error
}: {
    initial?: CategoryFormValues;
    onSubmit: (values: CategoryFormValues) => Promise<void> | void;
    onCancel: () => void;
    submitting?: boolean;
    error?: string | null;
}) {
    const [values, setValues] = useState<CategoryFormValues>(initial ?? { name: ""});

    useEffect(() => {
        if (initial) {
            setValues({ name: initial.name });
        } else {
            setValues({ name: "" });
        }
    }, [initial]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        await onSubmit(values);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-3">
            {error && <div className="alert alert-error text-sm">{error}</div>}
            <label className="form-control">
                <div className="label"><span className="label-text">Name</span></div>
                <input
                    className="input input-bordered"
                    value={values.name}
                    onChange={(e) => setValues({ ...values, name: e.target.value })}
                    required
                    minLength={1}
                />
            </label>
            <div className="flex justify-end gap-2">
                <button type="button" className="btn btn-ghost" onClick={onCancel} disabled={submitting}>Cancel</button>
                <button className={`btn btn-primary ${submitting ? "loading" : ""}`} disabled={submitting}>Save</button>
            </div>
        </form>
    );
}