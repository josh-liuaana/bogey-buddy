import { CurrentHole } from "@/components/CurrentHole";
import { useRound } from "@/contexts/RoundContext";

export function CurrentRound() {
  const { currentRound } = useRound();

  if (!currentRound) {
    return <p>No active round. Please start one first.</p>;
  }

  return (
    <div className="flex flex-col items-center pt-4 text-deep-forest bg-dune-sand min-h-screen">
      <h1 className="text-xl ">{currentRound.course.title}</h1>
      <CurrentHole />
    </div>
  );
}
