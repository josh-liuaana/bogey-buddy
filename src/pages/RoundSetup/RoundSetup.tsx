import { useState } from "react";
import { useNavigate } from "react-router-dom";

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
import { useRound } from "@/contexts/RoundContext";

import logo from "../../assets/logo_proto.png";

export function RoundSetup() {
  const { selectedCourse, setSelectedCourse, courseList } = useCourse();
  const [roundType, setRoundType] = useState<"playing-live" | "previous-entry">(
    "playing-live",
  );
  const { startRound } = useRound();
  const navigate = useNavigate();

  const handlePlay = () => {
    // -> Will need to implement some form of local storage to persist data in case of a refresh
    if (!selectedCourse) {
      alert("No course selected");
      return;
    }
    startRound({
      course: selectedCourse,
      roundType,
    });
    navigate("/current-round");
  };

  return (
    <div className="bg-dune-sand text-deep-forest h-screen flex flex-col items-center justify-center gap-8">
      <img src={logo} alt="Golf" className="w-30 h-30" />
      <div>
        <h1 className="text-4xl text-center mb-3">Before you tee off</h1>
        <h2 className="text-xl text-center">Choose your course and lock in</h2>
      </div>
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
      <div className="flex flex-col gap-2 items-center">
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
      </div>
      <Button
        onClick={handlePlay}
        className="px-6 py-6 text-2xl bg-terracotta text-dune-sand rounded flex items-center justify-center shadow-[0_4px_10px_rgba(0,0,0,0.5)]"
      >
        Tee off
      </Button>
    </div>
  );
}
