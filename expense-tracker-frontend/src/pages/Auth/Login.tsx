import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function Login() {
    const { login } = useAuth();
    const navigate = useNavigate();
    const [form, setForm] = useState({ username: "", password: ""});
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setLoading(true);
        try {
            await login(form);
            navigate("/", { replace: true });
        } catch (err: unknown) {
            setError(err?.response?.data?.message || "Login Failed");
        } finally {
            setLoading(false);;
        }
    };

    return (
        <div className="flex justify-center pt-10">
            <form onSubmit={onSubmit} className="card w-full max-w-sm bg-base-100 shadow-xl">
                <div className="card-body">
                    <h2 className="card-title">Login</h2>
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
                        <div className="label"><span className="label-text">Password</span></div>
                        <input
                            type="password"
                            className="input input-bordered"
                            value={form.password}
                            onChange={(e) => setForm({ ...form, password: e.target.value })}
                            required
                        />
                    </label>
                    <div className="card-actions justify-end mt-2">
                        <button className={`btn btn-primary ${loading ? "loading" : ""}`} disabled={loading}>
                            {loading ? "Logging in..." : "Login"}
                        </button>
                    </div>
                    <p className="text-sm">
                        No Account? <Link className="link" to="/register">Register</Link>
                    </p>
                </div>
            </form>
        </div>
    );
}