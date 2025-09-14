// import Navbar from "./components/layout/Navbar";
// import { Routes, Route, Navigate, Link, Outlet } from "react-router-dom";
// import { AuthProvider, useAuth } from "./context/AuthContext";
// import Login from "./pages/Auth/Login";
// import Register from "./pages/Auth/Register";
// import "./App.css";

// // function Navbar() {
// //     const { isAuthenticated, logout } = useAuth();
// //     return (
// //         <div className="navbar bg-base-100 shadow">
// //             <div className="flex-1">
// //                 <Link to="/" className="btn btn-ghost text-xl">ExpenseTracker</Link>
// //             </div>
// //             <div className="flex-none gap-2">
// //                 {isAuthenticated ? (
// //                     <button className="btn btn-sm" onClick={logout}>Logout</button>
// //                 ) : (
// //                     <>
// //                         <Link to="/login" className="btn btn-sm">Login</Link>
// //                         <Link to="/register" className="btn btn-sm btn-primary">Register</Link>
// //                     </>
// //                 )}
// //             </div>
// //         </div>
// //     );
// // }

// function Home() {
//     return (
//         <div className="p-4">
//             <h1 className="text-2xl font-semibold">Welcome</h1>
//             <p className="opacity-70">You can now log in and register.</p>
//         </div>
//     );
// }

// function ProtectedRoute() {
//     const { isAuthenticated } = useAuth();
//     if (!isAuthenticated) return <Navigate to="/login" replace />;
//     return <Outlet />;
// }

// function Dashboard() {
//     return <div className="p-4">Protected dashboard placeholder</div>;
// }

// export default function App() {
//     return (
//         <AuthProvider>
//             <div className="min-h-screen bg-base-200">
//                 <Navbar />
//                 <div className="container mx-auto p-4">
//                     <Routes>
//                         <Route path="/" element={<Home />} />
//                         <Route element={<ProtectedRoute />}>
//                             <Route path="/dashboard" element={<Dashboard />} />
//                         </Route>
//                         <Route path="/login" element={<Login />} />
//                         <Route path="/register" element={<Register />} />
//                         <Route path="*" element={<Navigate to="/" replace />} />
//                     </Routes>
//                 </div>
//             </div>
//         </AuthProvider>
//     );
// }

import Navbar from "./components/layout/Navbar";
import { AuthProvider } from "./context/AuthContext";
import AppRoutes from "./routes";
import "./App.css";

export default function App() {
    return (
        <AuthProvider>
            <div className="min-h-screen bg-base-200">
                <Navbar />
                <div className="container mx-auto p-4">
                    <AppRoutes />
                </div>
            </div>
        </AuthProvider>
    );
}