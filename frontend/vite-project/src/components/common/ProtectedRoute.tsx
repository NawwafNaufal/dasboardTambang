import { Navigate, Outlet } from "react-router";

export default function ProtectedRoute() {
  // Cek apakah user sudah login
  // Sesuaikan dengan cara kamu menyimpan auth (localStorage, context, dll)
  const isAuthenticated = !!localStorage.getItem("token"); 

  // Jika belum login, redirect ke halaman signin
  if (!isAuthenticated) {
    return <Navigate to="/signin" replace />;
  }

  return <Outlet />;
}