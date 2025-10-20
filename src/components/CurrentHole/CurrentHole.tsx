import { CurrentShot } from "@/components/CurrentShot";
import { useCourse } from "@/contexts/CourseContext";
import { useRound } from "@/contexts/RoundContext";

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

  return (
    <div className="">
      <div className="grid grid-cols-4 gap-4 m-4">
        <div className="flex flex-col items-center gap-2 rounded-lg p-2 justify-center text-center text-deep-forest border-2 border-deep-forest">
          <p>Hole</p>
          <p>{currentHoleIndex}</p>
        </div>
        <div className="flex flex-col items-center gap-2 rounded-lg p-2 justify-center text-center text-deep-forest border-2 border-deep-forest">
          <p className="">Par</p>
          <p>{holeAttributes.par ?? ""}</p>
        </div>
        <div className="flex flex-col items-center gap-2 rounded-lg p-2 justify-center text-center text-deep-forest border-2 border-deep-forest">
          <p className="">Length</p>
          <p>{holeAttributes.length ?? ""}</p>
        </div>
        <div className="flex flex-col items-center gap-2 rounded-lg p-2 justify-center text-center text-deep-forest border-2 border-deep-forest">
          <p className="">Stroke</p>
          <p>{holeAttributes.strokeIndex ?? ""}</p>
        </div>
      </div>
      <CurrentShot />
    </div>
  );
}
