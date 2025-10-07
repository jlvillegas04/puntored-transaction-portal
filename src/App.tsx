import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useEffect } from "react";
import { LoginPage } from "@/pages/LoginPage";
import { TopUpPage } from "@/pages/TopUpPage";
import { HistoryPage } from "@/pages/HistoryPage";
import { ProtectedRoute } from "@/components/layout/ProtectedRoute";
import { Toaster } from "@/components/ui/toaster";
import { useToast } from "@/hooks/use-toast";

function App() {
  const { toast } = useToast();

  useEffect(() => {
    const handleLogout = (event: CustomEvent) => {
      const { reason } = event.detail;
      if (reason) {
        toast({
          variant: 'error',
          title: 'Sesión Expirada',
          description: reason,
        });
      }
    };

    window.addEventListener('auth:logout', handleLogout as EventListener);

    return () => {
      window.removeEventListener('auth:logout', handleLogout as EventListener);
    };
  }, [toast]);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />

        {/* Protected routes */}
        <Route element={<ProtectedRoute />}>
          <Route path="/topup" element={<TopUpPage />} />
          <Route path="/history" element={<HistoryPage />} />
        </Route>

        <Route path="/" element={<Navigate to="/topup" replace />} />
        <Route path="*" element={<Navigate to="/topup" replace />} />
      </Routes>

      <Toaster />
    </BrowserRouter>
  );
}

export default App;