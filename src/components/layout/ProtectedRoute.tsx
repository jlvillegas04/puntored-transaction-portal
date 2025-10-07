import { useEffect } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "@/store/authStore";
import { AppLayout } from "./AppLayout";

export const ProtectedRoute = () => {
  const { isAuthenticated, checkExpiration } = useAuthStore();

  useEffect(() => {
    checkExpiration();
  }, [checkExpiration]);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <AppLayout>
      <Outlet />
    </AppLayout>
  );
};