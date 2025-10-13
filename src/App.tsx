import { Navigate, Outlet, Route, Routes } from "react-router-dom";

import { AuthGate } from "@/components/AuthGate";
import { Navbar } from "@/components/Navbar";
import { useAuth } from "@/contexts/AuthContext";
import { CurrentRound } from "@/pages/CurrentRound";
import { Home } from "@/pages/Home";
import { Login } from "@/pages/Login";
import { Profile } from "@/pages/Profile";
import { RoundSetup } from "@/pages/RoundSetup";
import { Statistics } from "@/pages/Statistics";

import { log } from "./utils/logger";

function PrivateRoute() {
  const { user } = useAuth();

  log("PrivateRoute", "Checking access", { hasUser: !!user });

  if (!user) {
    log("PrivateRoute", "No user — redirecting to /login");
    return <Navigate to="/login" replace />;
  }

  log("PrivateRoute", "User verified — rendering private routes");
  return (
    <>
      <Navbar />
      <Outlet />
    </>
  );
}

function PublicRoute() {
  const { user } = useAuth();

  log("PublicRoute", "Checking if user already logged in", { hasUser: !!user });

  if (user) {
    log("PublicRoute", "Redirecting authenticated user to /");
    return <Navigate to="/" replace />;
  }

  log("PublicRoute", "No user — showing public route");
  return <Outlet />;
}

export function App() {
  return (
    <Routes>
      <Route
        element={
          <AuthGate>
            <PublicRoute />
          </AuthGate>
        }
      >
        <Route path="/login" element={<Login />} />
      </Route>

      <Route
        element={
          <AuthGate>
            <PrivateRoute />
          </AuthGate>
        }
      >
        <Route path="/" element={<Home />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/statistics" element={<Statistics />} />
        <Route path="/round-setup" element={<RoundSetup />} />
        <Route path="/current-round" element={<CurrentRound />} />
      </Route>
    </Routes>
  );
}
