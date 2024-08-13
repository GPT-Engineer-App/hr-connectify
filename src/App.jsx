import { useState, useEffect } from 'react';
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { navItems } from "./nav-items";
import { supabase } from './lib/supabase';

const queryClient = new QueryClient();

const App = () => {
  const [session, setSession] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session) {
        checkAdminStatus(session.user.id);
      }
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session) {
        checkAdminStatus(session.user.id);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const checkAdminStatus = async (userId) => {
    if (!userId) return;
    try {
      const { data, error } = await supabase
        .from('users')
        .select('role')
        .eq('user_id', userId);
      if (error) throw error;
      if (data && data.length > 0) {
        setIsAdmin(data[0].role === 'admin');
      } else {
        console.warn('No user found with the given user_id');
        setIsAdmin(false);
      }
    } catch (error) {
      console.error('Error checking admin status:', error.message);
      setIsAdmin(false); // Default to non-admin if there's an error
    }
  };

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <BrowserRouter>
          <Routes>
            {navItems.map(({ to, page }) => (
              <Route
                key={to}
                path={to}
                element={
                  to === '/' ? (
                    page
                  ) : session ? (
                    to === '/admin' ? (
                      isAdmin ? page : <Navigate to="/dashboard" replace />
                    ) : (
                      page
                    )
                  ) : (
                    <Navigate to="/" replace />
                  )
                }
              />
            ))}
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
