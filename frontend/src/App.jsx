import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './components/AuthProvider';
import RoleRoute from './components/RoleRoute';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import AdminDashboard from './pages/AdminDashboard';
import EmployeeDashboard from './pages/EmployeeInterface';

function AppRoutes() {
  const { user, role, loading } = useAuth();

  if (loading) return <div className="container" style={{ textAlign: 'center', marginTop: '2rem' }}>Loading...</div>;

  return (
    <Routes>
      <Route path="/login" element={!user ? <Login /> : <Navigate to="/" />} />

      {/* Hidden Admin Login: Reuse Login component but maybe show slight indication if needed, 
          or just rely on the user logging in with an ADMIN email at this route. 
          Actually user just asked for a URL. If they login at /login with admin credentials, it works.
          But if they want a separate visible "page", we can route /secret-admin-login to Login too.
       */}
      <Route path="/secret-admin-login" element={!user ? <Login isAdminLogin /> : <Navigate to="/" />} />

      {/* Role Based Redirector for Root */}
      <Route path="/" element={
        user ? (
          role === 'admin' ? <Navigate to="/admin" /> :
            role === 'employee' ? <Navigate to="/employee" /> :
              <Navigate to="/dashboard" />
        ) : <Navigate to="/login" />
      } />

      {/* Protected Routes */}
      <Route path="/dashboard" element={
        <RoleRoute allowedRoles={['user']}>
          <Dashboard />
        </RoleRoute>
      } />

      <Route path="/employee" element={
        <RoleRoute allowedRoles={['employee']}>
          <EmployeeDashboard />
        </RoleRoute>
      } />

      <Route path="/admin" element={
        <RoleRoute allowedRoles={['admin']}>
          <AdminDashboard />
        </RoleRoute>
      } />
    </Routes>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppRoutes />
      </Router>
    </AuthProvider>
  );
}

export default App;
