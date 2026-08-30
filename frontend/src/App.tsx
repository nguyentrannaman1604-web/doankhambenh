import { Navigate, Route, Routes } from "react-router-dom";

import { useAuth } from "./context/AuthContext";

import LoginPage from "./pages/auth/LoginPage";
import RegisterPage from "./pages/auth/RegisterPage";

import PatientHomePage from "./pages/patient/PatientHomePage";
import DoctorHomePage from "./pages/doctor/DoctorHomePage";
import AdminHomePage from "./pages/admin/AdminHomePage";

import ProtectedRoute from "./routes/ProtectedRoute";
import MainLayout from "./layouts/MainLayout";
import PatientProfilePage from "./pages/patient/PatientProfilePage";
import DoctorListPage from "./pages/patient/DoctorListPage";
import DoctorDetailPage from "./pages/patient/DoctorDetailPage";
import MyAppointmentsPage from "./pages/patient/MyAppointmentsPage";

function App() {
  const { user, isAuthenticated } = useAuth();

  const getHomePath = () => {
    if (!user) {
      return "/login";
    }

    switch (user.role) {
      case "PATIENT":
        return "/patient";

      case "DOCTOR":
        return "/doctor";

      case "ADMIN":
      case "RECEPTIONIST":
        return "/admin";

      default:
        return "/login";
    }
  };

  return (
    <Routes>
      <Route
        path="/"
        element={
          <Navigate to={isAuthenticated ? getHomePath() : "/login"} replace />
        }
      />

      <Route
        path="/login"
        element={
          isAuthenticated ? (
            <Navigate to={getHomePath()} replace />
          ) : (
            <LoginPage />
          )
        }
      />

      <Route
        path="/register"
        element={
          isAuthenticated ? (
            <Navigate to={getHomePath()} replace />
          ) : (
            <RegisterPage />
          )
        }
      />

      <Route
        element={
          <ProtectedRoute allowedRoles={["PATIENT"]}>
            <MainLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/patient" element={<PatientHomePage />} />
        <Route path="/patient/profile" element={<PatientProfilePage />} />
        <Route path="/patient/doctors" element={<DoctorListPage />} />
        <Route path="/patient/doctors/:id" element={<DoctorDetailPage />} />
        <Route path="/patient/appointments" element={<MyAppointmentsPage />} />
      </Route>

      <Route
        element={
          <ProtectedRoute allowedRoles={["DOCTOR"]}>
            <MainLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/doctor" element={<DoctorHomePage />} />
      </Route>

      <Route
        element={
          <ProtectedRoute allowedRoles={["ADMIN", "RECEPTIONIST"]}>
            <MainLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/admin" element={<AdminHomePage />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
