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

export function RoundSetup() {
  const { selectedCourse, setSelectedCourse, courseList } = useCourse();
  const [roundType, setRoundType] = useState("playing-live");

  const handlePlay = () => {
    // TODO: Navigate to the round page with the selected course and round type for user interaction
    // -> Will need to implement a data context and some form of local storage to persist data
    alert(`Starting round on course ID: ${selectedCourse}`);
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center text-center gap-8 p-10">
      <h1 className="text-4xl text-center">Round Setup Page</h1>
      <h1>New Round</h1>

      <RadioGroup
        value={roundType}
        onValueChange={setRoundType}
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
        <Select onValueChange={setSelectedCourse}>
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
        <Button
          onClick={() => {
            if (selectedCourse) {
              handlePlay();
            } else {
              alert("Please select a course");
            }
          }}
          className=""
        >
          Play
        </Button>
      </div>
    </div>
  );
}
