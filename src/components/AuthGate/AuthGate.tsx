import { useAuth } from "@/contexts/AuthContext";
import { log } from "@/utils/logger";

export function AuthGate({ children }: { children: React.ReactNode }) {
  const { loading } = useAuth();

  log("AuthGate", "Checking for valid user...");

  if (loading) {
    log("AuthGate", "Auth state still loading...");
    return (
      <div className="h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }

  log("AuthGate", "Auth state resolved — rendering children");
  return <>{children}</>;
}
