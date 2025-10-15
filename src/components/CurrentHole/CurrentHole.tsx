import { CurrentShot } from "@/components/CurrentShot";
import { useCourse } from "@/contexts/CourseContext";
import { useRound } from "@/contexts/RoundContext";

import { Button } from "../ui/button";

export function CurrentHole() {
  const { currentHoleIndex } = useRound();
  const { selectedCourse } = useCourse();

  const hole =
    selectedCourse?.holes[currentHoleIndex > 0 ? currentHoleIndex - 1 : 0];
  const holeAttributes = {
    par: hole?.par ?? null,
    length: hole?.distance ?? null,
    strokeIndex: hole?.stroke ?? null,
  };

  const handleEndHole = () => {
    console.log("Ending hole with Attributes:", holeAttributes);
  };

  return (
    <div className="border-2 m-4">
      <p>Hole Number: {currentHoleIndex}</p>

      <div className="grid grid-cols-3 gap-4 m-4">
        <div className="flex flex-col items-center gap-2">
          <p className="">Par</p>
          <p>{holeAttributes.par ?? ""}</p>
        </div>
        <div className="flex flex-col items-center gap-2">
          <p className="">Length</p>
          <p>{holeAttributes.length ?? ""} metres</p>
        </div>
        <div className="flex flex-col items-center gap-2">
          <p className="">Stroke</p>
          <p>{holeAttributes.strokeIndex ?? ""}</p>
        </div>
      </div>
      <CurrentShot />
      <Button onClick={handleEndHole}>End Hole</Button>
    </div>
  );
}
