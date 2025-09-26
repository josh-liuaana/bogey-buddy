import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { Home } from "./pages/Home/";
import { Login } from "./pages/Login/";

function AppContent() {
  const { user } = useAuth();
  return <div>{user ? <Home /> : <Login />}</div>;
}

export function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
