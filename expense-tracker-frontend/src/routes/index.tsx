import { Routes, Route, Navigate } from "react-router-dom";
import Home from "../pages/Home";
import Login from "../pages/Auth/Login";
import Register from "../pages/Auth/Register";
import CategoriesList from "../pages/Categories/CategoriesList";
import ExpensesList from "../pages/Expenses/ExpensesList";
import Charts from "../pages/Expenses/Charts";
import { useAuth } from "../context/AuthContext";
import type { ReactElement } from "react";

function Protected({ children }: { children: ReactElement }) {
    const { isAuthenticated } = useAuth();
    if (!isAuthenticated) return <Navigate to="/login" replace />;
    return children;
}

export default function AppRoutes() {
    return (
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/categories" element={<Protected><CategoriesList /></Protected>} />
            <Route path="/expenses" element={<Protected><ExpensesList /></Protected>} />
            <Route path="/expenses/charts" element={<Protected><Charts /></Protected>} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
    );
}