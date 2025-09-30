import { getAuth } from "firebase/auth";

export function Home() {
  const user = getAuth().currentUser;

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
    </main>
  );
}
