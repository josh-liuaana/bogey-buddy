import { useEffect, useState } from "react";
import { TbRulerMeasure } from "react-icons/tb";

import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { type Club, clubs } from "@/constants/clubs";
import { useRound } from "@/contexts/RoundContext";
import { cn } from "@/lib/utils";

import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { CurrentOffGreen } from "./CurrentOffGreen";
import { CurrentOnGreen } from "./CurrentOnGreen";

export function CurrentShot() {
  const [club, setClub] = useState<Club | undefined>(undefined);
  const [distanceToHole, setDistanceToHole] = useState(0);
  const { updateShotData, currentShotIndex } = useRound();

  useEffect(() => {
    const shotCategory = club === "Putter" ? "putt" : "standard";
    const shotType = club === "Putter" ? "Putt" : "Full Shot";
    updateShotData({
      distanceToHole: distanceToHole,
      club: club,
      shotCategory: shotCategory,
      shotType: shotType,
    });
  }, [distanceToHole, club, updateShotData]);

  return (
    <div className="border-2 m-4 flex flex-col items-center">
      <p>Shot: {currentShotIndex}</p>
      <div className="flex flex-row gap-4 h-20">
        {/* Club Selection */}
        <div className="space-y-2 w-1/2">
          <Label className="">Club Selection</Label>
          <Select
            defaultValue={club}
            onValueChange={(value) => setClub(value as Club)}
          >
            <SelectTrigger
              className={cn(
                "border",
                !club ? "border-red-500" : "border-gray-300",
              )}
            >
              <SelectValue placeholder="Select a Club" />
            </SelectTrigger>
            <SelectContent>
              {clubs.map((selectedClub: Club) => (
                <SelectItem key={selectedClub} value={selectedClub}>
                  {selectedClub}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        {/* Distance to Hole */}
        <div className="space-y-2  w-1/2">
          <Label htmlFor="distance">Distance to Hole</Label>
          <div className="flex items-center gap-2">
            <Input
              id="distance"
              placeholder="e.g. 25m"
              className="flex-1"
              value={distanceToHole}
              onChange={(e) => setDistanceToHole(+e.target.value)}
            />
            <TbRulerMeasure className="text-muted-foreground" />
          </div>
        </div>
      </div>
      {club && (club === "Putter" ? <CurrentOnGreen /> : <CurrentOffGreen />)}

      <Button
        onClick={() =>
          updateShotData({
            club,
            shotCategory: club === "Putter" ? "putt" : "standard",
          })
        }
      >
        Save Shot
      </Button>
    </div>
  );
}
