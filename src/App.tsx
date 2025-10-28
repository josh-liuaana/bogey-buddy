import { lazy, Suspense } from "react";
import { Navigate, Outlet, Route, Routes, useLocation } from "react-router-dom";

import { AuthGate } from "@/components/AuthGate";
import { Navbar } from "@/components/Navbar";
import { useAuth } from "@/contexts/AuthContext";

import { log } from "./utils/logger";

const Home = lazy(() =>
  import("@/pages/Home").then((m) => ({ default: m.Home }))
);
const Login = lazy(() =>
  import("@/pages/Login").then((m) => ({ default: m.Login }))
);
const Profile = lazy(() =>
  import("@/pages/Profile").then((m) => ({ default: m.Profile }))
);
const Statistics = lazy(() =>
  import("@/pages/Statistics").then((m) => ({ default: m.Statistics }))
);
const CurrentRound = lazy(() =>
  import("@/pages/CurrentRound").then((m) => ({ default: m.CurrentRound }))
);
const RoundSetup = lazy(() =>
  import("@/pages/RoundSetup").then((m) => ({ default: m.RoundSetup }))
);
const RoundSummary = lazy(() =>
  import("@/pages/RoundSummary").then((m) => ({ default: m.RoundSummary }))
);

function PrivateRoute() {
  const { user } = useAuth();
  const location = useLocation();

  log("PrivateRoute", "Checking access", { hasUser: !!user });

  if (!user) {
    log("PrivateRoute", "No user — redirecting to /login");
    return <Navigate to="/login" replace />;
  }

  log("PrivateRoute", "User verified — rendering private routes");
  return (
    <>
      {location.pathname !== "/" && <Navbar />}
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
    <Suspense fallback={<div>Loading Application...</div>}>
      <Routes>
        <Route
          element={
            <AuthGate>
              <PublicRoute />
            </AuthGate>
          }
        >
          {/* Use the lazy-loaded components */}
          <Route path="/login" element={<Login />} />
        </Route>

        <Route
          element={
            <AuthGate>
              <PrivateRoute />
            </AuthGate>
          }
        >
          {/* Use the lazy-loaded components */}
          <Route path="/" element={<Home />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/statistics" element={<Statistics />} />
          <Route path="/round-setup" element={<RoundSetup />} />
          <Route path="/current-round" element={<CurrentRound />} />
          <Route path="/round-summary" element={<RoundSummary />} />
        </Route>
      </Routes>
    </Suspense>
  );
}
