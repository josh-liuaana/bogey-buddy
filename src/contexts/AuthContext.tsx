import { getAuth, onAuthStateChanged, type User } from "firebase/auth";
import { createContext, useContext, useEffect, useState } from "react";
import { log } from "@/utils/logger";

import { app } from "../../firebase";

interface AuthContextType {
  user: User | null;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const auth = getAuth(app);

  useEffect(() => {
    log("AuthProvider", "Checking for valid user...");
    const unsubscribe = onAuthStateChanged(auth, (authUser) => {
      if (authUser) {
        log("AuthProvider", "User found:", { email: authUser.email });
      } else {
        log("AuthProvider", "No user logged in");
      }
      setUser(authUser);
      setLoading(false);
      log("AuthProvider", "Finished checking for user");
    });

    // Clean up the listener when the component unmounts
    return () => {
      log("AuthProvider", "Cleaning up auth listener");
      unsubscribe();
    };
  }, [auth]);

  return (
    <AuthContext.Provider value={{ user, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
}
