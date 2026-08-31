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
import AiSuggestionPage from "./pages/patient/AiSuggestionPage";
import DoctorSchedulePage from "./pages/doctor/DoctorSchedulePage";
import DoctorPatientsTodayPage from "./pages/doctor/DoctorPatientsTodayPage";
import AdminAppointmentsPage from "./pages/admin/AdminAppointmentsPage";
import AdminDoctorsPage from "./pages/admin/AdminDoctorsPage";
import AdminSpecialtiesPage from "./pages/admin/AdminSpecialtiesPage";
import AdminStatisticsPage from "./pages/admin/AdminStatisticsPage";

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
        <Route path="/patient/ai-suggestion" element={<AiSuggestionPage />} />
      </Route>

      <Route
        element={
          <ProtectedRoute allowedRoles={["DOCTOR"]}>
            <MainLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/doctor" element={<DoctorHomePage />} />
        <Route path="/doctor/schedules" element={<DoctorSchedulePage />} />
        <Route
          path="/doctor/patients-today"
          element={<DoctorPatientsTodayPage />}
        />
      </Route>

      <Route
        element={
          <ProtectedRoute allowedRoles={["ADMIN", "RECEPTIONIST"]}>
            <MainLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/admin" element={<AdminHomePage />} />
        <Route path="/admin/appointments" element={<AdminAppointmentsPage />} />
        <Route path="/admin/doctors" element={<AdminDoctorsPage />} />
        <Route path="/admin/specialties" element={<AdminSpecialtiesPage />} />
        <Route path="/admin/statistics" element={<AdminStatisticsPage />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
