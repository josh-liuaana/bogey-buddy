import { CurrentHole } from "@/components/CurrentHole";
import { Button } from "@/components/ui/button";
import { useRound } from "@/contexts/RoundContext";

export function CurrentRound() {
  const { currentRound, endRound } = useRound();

  if (!currentRound) {
    return <p>No active round. Please start one first.</p>;
  }

  return (
    <div className="m-2">
      <h1>Current Round</h1>
      <p>Course: {currentRound.course.title}</p>
      <CurrentHole />
      <Button onClick={endRound}>End Round</Button>
    </div>
  );
}
