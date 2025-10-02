import { Navigate, Outlet, Route, Routes } from "react-router-dom"; // 👈 Import Routes/Route/Outlet

import { Navbar } from "@/components/Navbar";
import { useAuth } from "@/contexts/AuthContext";
import { Home } from "@/pages/Home";
import { Login } from "@/pages/Login";
import { Profile } from "@/pages/Profile";
import { RoundSetup } from "@/pages/RoundSetup";
import { Statistics } from "@/pages/Statistics";
import { CurrentRound } from "./pages/CurrentRound";

function PrivateRoute() {
  const { user, loading } = useAuth();
  if (loading)
    return (
      <div className="h-screen flex items-center justify-center">
        Loading...
      </div>
    ); //spinner
  return user ? (
    <>
      <Navbar />
      <Outlet />
    </>
  ) : (
    <Navigate to="/login" replace />
  );
}

function PublicRoute() {
  const { user } = useAuth();
  return user ? <Navigate to="/" replace /> : <Outlet />;
}

export function App() {
  return (
    <Routes>
      <Route element={<PublicRoute />}>
        <Route path="/login" element={<Login />} />
      </Route>

      <Route element={<PrivateRoute />}>
        <Route path="/" element={<Home />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/statistics" element={<Statistics />} />
        <Route path="/round-setup" element={<RoundSetup />} />
        <Route path="/current-round" element={<CurrentRound />} />
      </Route>
    </Routes>
  );
}
