import { Routes, Route, Navigate } from "react-router-dom";
import AuthLanding from "./modules/auth/AuthLanding";
import Dashboard from "./modules/dashboard/Dashboard";
import { useAuth } from "./modules/auth/AuthContext";

function RequireAuth({ children }: { children: JSX.Element }) {
  const { user } = useAuth();
  return user ? children : <Navigate to="/auth" replace />;
}

export default function App() {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <RequireAuth>
            <Dashboard />
          </RequireAuth>
        }
      />
      <Route path="/auth" element={<AuthLanding />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
