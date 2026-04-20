import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AppProvider } from "./context/AppContext";
import { ProtectedRoute } from "./components/ProtectedRoute";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import DashboardPage from "./pages/DashboardPage";
import LawyersPage from "./pages/LawyersPage";
import RequestsPage from "./pages/RequestsPage";
import CasesPage from "./pages/CasesPage";
import CaseDetailPage from "./pages/CaseDetailPage";
import AppointmentsPage from "./pages/AppointmentsPage";
import DocumentsPage from "./pages/DocumentsPage";
import ProfilePage from "./pages/ProfilePage";

export default function App() {
  return (
    <BrowserRouter>
      <AppProvider>
        <Routes>
  
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

     
          <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
          <Route path="/lawyers" element={<ProtectedRoute><LawyersPage /></ProtectedRoute>} />
          <Route path="/requests" element={<ProtectedRoute><RequestsPage /></ProtectedRoute>} />
          <Route path="/cases" element={<ProtectedRoute><CasesPage /></ProtectedRoute>} />
          <Route path="/cases/:id" element={<ProtectedRoute><CaseDetailPage /></ProtectedRoute>} />
          <Route path="/appointments" element={<ProtectedRoute><AppointmentsPage /></ProtectedRoute>} />
          <Route path="/documents" element={<ProtectedRoute><DocumentsPage /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />

       
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </AppProvider>
    </BrowserRouter>
  );
}
