import { getAuth, signOut } from "firebase/auth";

import { app } from "../../../firebase";

export function Home() {
  const handleLogout = () => {
    const auth = getAuth(app);
    signOut(auth)
      .then(() => {
        console.log("User signed out successfully.");
      })
      .catch((error) => {
        console.error("Sign-out failed:", error);
      });
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center">
      <h1 className="text-4xl text-center">Welcome to Bogey Buddy</h1>
      <button
        onClick={handleLogout}
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
      >
        Log Out
      </button>
    </main>
  );
}
