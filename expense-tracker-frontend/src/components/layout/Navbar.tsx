import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function Navbar() {
    const { isAuthenticated, logout } = useAuth();
    return (
        <div className="navbar bg-base-100 shadow">
            <div className="flex-1">
                <Link to="/" className="btn btn-ghost text-xl">Expense Tracker</Link>
            </div>
            <div className="flex-none gap-2">
                {isAuthenticated && (
                    <>
                        <Link to="/categories" className="btn btn-sm">Categories</Link>
                        <Link to="/expenses" className="btn btn-sm">Expenses</Link>
                    </>
                )}
                {isAuthenticated ? (
                    <button className="btn btn-sm" onClick={logout}>Logout</button>
                ) : (
                    <>
                        <Link to="/login" className="btn btn-sm">Login</Link>
                        <Link to="/register" className="btn btn-sm btn-primary">Register</Link>
                    </>
                )}
            </div>
        </div>
    );
}