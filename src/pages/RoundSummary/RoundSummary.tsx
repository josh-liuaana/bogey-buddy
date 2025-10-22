import { useLocation } from "react-router-dom";

export function RoundSummary() {
  const location = useLocation();
  const { firebaseId } = location.state || {};

  return (
    <div className="flex flex-col items-center pt-4 pb-10 text-deep-forest bg-dune-sand min-h-screen">
      <h1 className="text-3xl font-bold mb-6">Round Summary</h1>
      {/* Round summary details will go here */}
      <p>This feature is under development</p>
      <p>Firebase Round ID: {firebaseId}</p>
    </div>
  );
}
