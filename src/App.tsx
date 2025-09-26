import { useState, useEffect } from "react";
import { getAuth, signInAnonymously } from "firebase/auth";
import { app } from "../firebase";

export function App() {
  const [user, setUser] = useState<import("firebase/auth").User | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      const auth = getAuth(app);

      signInAnonymously(auth)
        .then((userCredential) => {
          const user = userCredential.user;
          setUser(user);
          console.log("Successfully signed in as:", user.uid);
        })
        .catch((error) => {
          console.error("Anonymous sign-in failed:", error.code, error.message);
        });
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div>
      {user ? (
        <main className="flex min-h-screen items-center justify-center">
          <h1 className="text-4xl font-bold">Bogey Buddy</h1>
        </main>
      ) : (
        <main className="flex min-h-screen items-center justify-center">
          <h1 className="text-4xl font-bold text-red-500">
            Anonymously Signing in...
          </h1>
        </main>
      )}
    </div>
  );
}
