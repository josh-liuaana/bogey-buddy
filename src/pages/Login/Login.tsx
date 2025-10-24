import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";

import { app } from "@/lib/firebase";
import { log } from "@/utils/logger";

export function Login() {
  const provider = new GoogleAuthProvider();

  const handleLogin = () => {
    const auth = getAuth(app);

    signInWithPopup(auth, provider)
      .then((result) => {
        const { user } = result;
        // const credential = GoogleAuthProvider.credentialFromResult(result);
        // const token = credential?.accessToken;

        // Can use the token to fetch the users data (when there is data to fetch)

        log("", "Successfully signed in with Google. User ID:", user.uid);
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;

        console.error("Google sign-in failed:", errorCode, errorMessage);

        if (error.customData && error.customData.email) {
          console.error("Email used:", error.customData.email);
        }
      });
  };

  return (
    <main className="flex min-h-screen items-center justify-center flex-col gap-4">
      <h1 className="text-2xl">Welcome to Bogey Buddy</h1>
      <button
        onClick={handleLogin}
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
      >
        Sign In with Google
      </button>
    </main>
  );
}
