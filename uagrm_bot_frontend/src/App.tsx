import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Login } from './pages/Login';
import { PublicChat } from './pages/PublicChat';
import { Unauthorized } from './pages/Unauthorized';
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { MassiveMessagingDashboard } from './features/massiveMessaging/components/MassiveMessagingDashboard';
import { UploaderDashboard } from './pages/uploader/UploaderDashboard';
import { VerifierDashboard } from './pages/verifier/VerifierDashboard';
import { DashboardLayout } from './layouts/DashboardLayout';
import { ProtectedRoute } from './components/ProtectedRoute';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<PublicChat />} />
        <Route path="/login" element={<Login />} />
        <Route path="/unauthorized" element={<Unauthorized />} />

        {/* Protected Routes */}
        <Route element={<ProtectedRoute />}>
          <Route element={<DashboardLayout />}>

            {/* Admin Routes */}
            <Route element={<ProtectedRoute allowedRoles={['Admin']} />}>
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/admin/massive-messaging" element={<MassiveMessagingDashboard />} />
            </Route>

            {/* Verifier Routes */}
            <Route element={<ProtectedRoute allowedRoles={['Verifier']} />}>
              <Route path="/verifier" element={<VerifierDashboard />} />
            </Route>

            {/* Uploader Routes */}
            <Route element={<ProtectedRoute allowedRoles={['Uploader']} />}>
              <Route path="/uploader" element={<UploaderDashboard />} />
            </Route>

          </Route>
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
