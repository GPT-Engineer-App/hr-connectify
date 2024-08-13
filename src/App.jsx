import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { navItems } from "./nav-items";
import { SupabaseAuthProvider, useSupabaseAuth } from './integrations/supabase/auth';

const queryClient = new QueryClient();

const AppRoutes = () => {
  const { session, loading } = useSupabaseAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <Routes>
      {navItems.map(({ to, page }) => (
        <Route
          key={to}
          path={to}
          element={
            to === '/' ? (
              page
            ) : session ? (
              page
            ) : (
              <Navigate to="/" replace />
            )
          }
        />
      ))}
    </Routes>
  );
};

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <SupabaseAuthProvider>
        <TooltipProvider>
          <Toaster />
          <BrowserRouter>
            <AppRoutes />
          </BrowserRouter>
        </TooltipProvider>
      </SupabaseAuthProvider>
    </QueryClientProvider>
  );
};

export default App;
