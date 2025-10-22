import { useEffect, useState } from "react";

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

import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { CurrentOffGreen } from "./CurrentOffGreen";
import { CurrentOnGreen } from "./CurrentOnGreen";

export function CurrentShot() {
  const {
    updateShotData,
    currentShotIndex,
    finishShot,
    createNewShot,
    finishHole,
    shotInformation,
  } = useRound();
  const [club, setClub] = useState<Club | undefined>(
    (shotInformation.club as Club) || undefined,
  );
  const [distanceToHole, setDistanceToHole] = useState(
    shotInformation.distanceToHole || 0,
  );

  useEffect(() => {
    if (club || distanceToHole > 0) {
      const shotCategory = club === "Putter" ? "putt" : "standard";
      const shotType = club === "Putter" ? "Putt" : "Full Shot";

      updateShotData({
        distanceToHole: distanceToHole,
        club: club,
        shotCategory: shotCategory,
        shotType: shotType,
      });
    }
  }, [distanceToHole, club, updateShotData]);

  useEffect(() => {
    setClub((shotInformation.club as Club) || undefined);
    setDistanceToHole(shotInformation.distanceToHole || 0);
  }, [currentShotIndex, shotInformation.club, shotInformation.distanceToHole]);

  const handleSaveShot = () => {
    if (!club) {
      alert("Please select a club before saving the shot.");
      return;
    }
    finishShot();
    createNewShot(false);
  };

  const handleHoleOut = () => {
    finishHole();
    createNewShot(true);
  };

  return (
    <div className="flex flex-col items-center gap-4 m-4 p-4 border-2 border-deep-forest rounded-lg ">
      <h3 className="text-xl">Shot: {currentShotIndex}</h3>
      <div className="grid grid-cols-2 gap-5">
        {/* Club Selection */}
        <div className="flex flex-col gap-2 items-center ">
          <Label>Club Selection</Label>
          <Select
            value={club ?? ""}
            onValueChange={(value) => setClub(value as Club)}
          >
            <SelectTrigger className="w-full">
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
        <div className="flex flex-col gap-2 items-center ">
          <Label htmlFor="distance">Distance to Hole</Label>
          <div>
            <Input
              id="distance"
              placeholder="e.g. 25m"
              className="w-full"
              value={distanceToHole}
              onChange={(e) => setDistanceToHole(+e.target.value)}
            />
          </div>
        </div>
      </div>
      {club && (club === "Putter" ? <CurrentOnGreen /> : <CurrentOffGreen />)}

      <div className="flex flex-row border-red-500 gap-5">
        {club === "Putter" && (
          <Button
            className="px-4 py-4 text-md flex items-center justify-center bg-deep-forest text-dune-sand shadow-[0_4px_10px_rgba(0,0,0,0.5)]"
            onClick={handleHoleOut}
          >
            Sunk Putt
          </Button>
        )}
        {club && (
          <Button
            onClick={handleSaveShot}
            className="px-4 py-4 text-md flex items-center justify-center bg-deep-forest text-dune-sand shadow-[0_4px_10px_rgba(0,0,0,0.5)]"
          >
            Save Shot
          </Button>
        )}
      </div>
    </div>
  );
}
