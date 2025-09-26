import { getAuth, signInAnonymously } from "firebase/auth";

import { app } from "../../../firebase";

export function Login() {
  const handleLogin = () => {
    const auth = getAuth(app);
    signInAnonymously(auth)
      .then((userCredential) => {
        const { user } = userCredential;
        console.log("Successfully signed in as:", user.uid);
      })
      .catch((error) => {
        console.error("Anonymous sign-in failed:", error.code, error.message);
      });
  };

  return (
    <main className="flex min-h-screen items-center justify-center">
      <button
        onClick={handleLogin}
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
      >
        Sign In
      </button>
    </main>
  );
}
