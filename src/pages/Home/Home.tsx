import { getAuth, signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";

import { app } from "../../../firebase";

export function Home() {
  const navigate = useNavigate();
  const user = getAuth().currentUser;

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
      <h1 className="text-4xl text-center">
        Hi {user?.displayName?.split(" ")[0]}
      </h1>
      <button
        onClick={() => alert("functionality to come")}
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
      >
        Start new round
      </button>
      <button
        onClick={() => navigate("/statistics")}
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
      >
        Stats
      </button>
      <button
        onClick={() => navigate("/profile")}
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
      >
        Profile
      </button>
      <button
        onClick={handleLogout}
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
      >
        Log Out
      </button>
    </main>
  );
}
