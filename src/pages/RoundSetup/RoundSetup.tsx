import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCourse } from "@/contexts/CourseContext";
import { useNavigate } from "react-router-dom";
import { useRound } from "@/contexts/RoundContext";

export function RoundSetup() {
  const { selectedCourse, setSelectedCourse, courseList } = useCourse();
  const [roundType, setRoundType] = useState<"playing-live" | "previous-entry">(
    "playing-live"
  );
  const { startRound } = useRound();
  const navigate = useNavigate();

  const handlePlay = () => {
    // -> Will need to implement some form of local storage to persist data in case of a refresh
    alert(`Starting round on course ID: ${selectedCourse}`);
    if (!selectedCourse) {
      alert("No course selected");
      return;
    }
    startRound({ course: selectedCourse, roundType });
    navigate("/current-round");
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center text-center gap-8 p-10">
      <h1 className="text-4xl text-center">Round Setup Page</h1>
      <h1>New Round</h1>

      <RadioGroup
        value={roundType}
        onValueChange={(value) => setRoundType(value as typeof roundType)}
        defaultValue="playing-live"
        className="flex flex-col space-x-4"
      >
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="playing-live" id="playing-live" />
          <Label htmlFor="playing-live">Playing now</Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="previous-entry" id="previous-entry" />
          <Label htmlFor="previous-entry">Filling in previous round</Label>
        </div>
      </RadioGroup>
      <div>
        <Label className="">Course Selection</Label>
        <Select
          onValueChange={(id) => {
            const course = courseList?.find((c) => c.id === id) || null;
            setSelectedCourse(course);
          }}
        >
          <SelectTrigger className="">
            <SelectValue placeholder="Select a Course" />
          </SelectTrigger>
          <SelectContent>
            {courseList?.map((course) => (
              <SelectItem key={course.id} value={course.id}>
                {course.title}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button onClick={handlePlay} className="">
          Play
        </Button>
      </div>
    </div>
  );
}
