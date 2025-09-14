import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function Register() {
    const { register } = useAuth();
    const navigate = useNavigate();
    const [form, setForm] = useState({ username: "", email: "", password: ""});
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setLoading(true);
        try {
            await register(form);
            navigate("/", { replace: true});
        } catch (err: unknown) {
            const msg =
                err?.response?.data?.message ||
                err?.response?.data?.error?.Password?.[0] ||
                "Registration failed.";
            setError(msg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex justify-center pt-10">
            <form onSubmit={onSubmit} className="card w-full max-w-sm bg-base-100 shadow-xl">
                <div className="card-body">
                    <h2 className="card-title">Register</h2>
                    {error && <div className="alert alert-error text-sm">{error}</div>}
                    <label className="form-control">
                        <div className="label"><span className="label-text">Username</span></div>
                        <input
                            className="input input-bordered"
                            value={form.username}
                            onChange={(e) => setForm({ ...form, username: e.target.value })}
                            required
                        />
                    </label>
                    <label className="form-control">
                        <div className="label"><span className="label-text">Email</span></div>
                        <input
                            type="email"
                            className="input input-bordered"
                            value={form.email}
                            onChange={(e) => setForm({ ...form, email: e.target.value })}
                            required
                        />
                    </label>
                    <label className="form-control">
                        <div className="label"><span className="label-text">Password</span></div>
                        <input
                            type="password"
                            className="input input-bordered"
                            value={form.password}
                            onChange={(e) => setForm({ ...form, password: e.target.value })}
                            required
                            pattern="^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*\W).{8,}$"
                            title="At least 8 characters, 1 uppercase, 1 lowercase, 1 digit, 1 special character"
                        />
                    </label>
                    <div className="card-actions justify-end mt-2">
                        <button className={`btn btn-primary ${loading ? "loading" : ""}`} disabled={loading}>
                            {loading ? "Signing up..." : "Sign Up"}
                        </button>
                    </div>
                    <p className="text-sm">
                        Have an account? <Link className="link" to="/login">Login</Link>
                    </p>
                </div>
            </form>
        </div>
    );
}