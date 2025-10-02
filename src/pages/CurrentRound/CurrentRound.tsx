import { useRound } from "@/contexts/RoundContext";

export function CurrentRound() {
  const { currentRound, endRound } = useRound();

  if (!currentRound) {
    return <p>No active round. Please start one first.</p>;
  }

  return (
    <div>
      <h1>Current Round</h1>
      <p>Course: {currentRound.course.title}</p>
      <p>Type: {currentRound.roundType}</p>
      {/* <button onClick={endRound}>End Round</button> */}
    </div>
  );
}
