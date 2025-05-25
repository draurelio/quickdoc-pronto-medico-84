
import React from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { HashRouter, Routes, Route, Navigate } from "react-router-dom";
import Index from "./pages/Index";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";
import PrescriptionHistory from "./pages/PrescriptionHistory";
import Profile from "./pages/Profile";
import ChangePassword from "./pages/ChangePassword";
import UserManagement from "./pages/UserManagement";
import MedicalPrescription from "./pages/MedicalPrescription";
import ProtectedRoute from "./components/ProtectedRoute";
import UserMenu from "./components/UserMenu";

// Create QueryClient outside component to prevent recreation on each render
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      refetchOnWindowFocus: false,
    },
  },
});

const App: React.FC = () => {
  return (
    <React.StrictMode>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <HashRouter>
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route 
                path="/" 
                element={<Navigate to="/index" replace />} 
              />
              <Route 
                path="/historico" 
                element={
                  <ProtectedRoute>
                    <PrescriptionHistory />
                    <UserMenu />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/index" 
                element={
                  <ProtectedRoute>
                    <Index />
                    <UserMenu />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/receita-medica" 
                element={
                  <ProtectedRoute>
                    <MedicalPrescription />
                    <UserMenu />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/profile" 
                element={
                  <ProtectedRoute>
                    <Profile />
                    <UserMenu />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/change-password" 
                element={
                  <ProtectedRoute>
                    <ChangePassword />
                    <UserMenu />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/user-management" 
                element={
                  <ProtectedRoute requireAdmin={true}>
                    <UserManagement />
                    <UserMenu />
                  </ProtectedRoute>
                } 
              />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </HashRouter>
        </TooltipProvider>
      </QueryClientProvider>
    </React.StrictMode>
  );
};

export default App;
