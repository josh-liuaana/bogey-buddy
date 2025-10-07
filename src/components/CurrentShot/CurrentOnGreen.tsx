import type { IconType } from "react-icons";
import { FaRegCircle } from "react-icons/fa";
import {
  HiOutlineArrowDown,
  HiOutlineArrowDownLeft,
  HiOutlineArrowDownRight,
  HiOutlineArrowLeft,
  HiOutlineArrowRight,
  HiOutlineArrowUp,
  HiOutlineArrowUpLeft,
  HiOutlineArrowUpRight,
} from "react-icons/hi2";

import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useRound } from "@/contexts/RoundContext";
import {
  directionToTargets,
  distanceToTargets,
  missSides,
  type Pace,
  type Putt,
  type Read,
} from "@/types/roundData";

// Combine direction + pace options into one 3x3 grid
type ReadCombo = `${Pace}-${Read}`;

const readDirections: Read[] = ["Break Left", "Straight", "Break Right"];
const paceOptions: Pace[] = ["Uphill", "Flat", "Downhill"];

// Assign icons based on direction + pace for visual clarity
const readGridIcons: Record<ReadCombo, IconType> = {
  "Uphill-Break Left": HiOutlineArrowUpLeft,
  "Uphill-Straight": HiOutlineArrowUp,
  "Uphill-Break Right": HiOutlineArrowUpRight,
  "Flat-Break Left": HiOutlineArrowLeft,
  "Flat-Straight": FaRegCircle,
  "Flat-Break Right": HiOutlineArrowRight,
  "Downhill-Break Left": HiOutlineArrowDownLeft,
  "Downhill-Straight": HiOutlineArrowDown,
  "Downhill-Break Right": HiOutlineArrowDownRight,
};

export function CurrentOnGreen() {
  const { shotInformation, updateShotData } = useRound();

  // updates nested actualIntendedShotResult fields
  const handleIntendedShotChange = (value: string) => {
    const lieCondition = "Green";
    const pace = value.split("-")[0] as Pace;
    const read = value.split("-")[1] as Read;
    updateShotData({
      ...shotInformation,
      lieCondition,
      intendedShotResult: {
        ...(shotInformation.intendedShotResult || {}),
        pace,
        read,
      },
    });
  };

  // updates nested actualShotResult fields
  const handleActualShotChange = (field: string, value: string) => {
    updateShotData({
      actualShotResult: {
        ...(shotInformation.actualShotResult || {}),
        [field]: value,
      },
    });
  };

  const actual = (shotInformation.actualShotResult || {}) as Putt;

  return (
    <div className="space-y-6">
      {/* READ GRID */}
      <div className="space-y-3">
        <p className="font-semibold text-sm">READ & PACE</p>
        <p className="text-xs text-muted-foreground">
          Tap to select your <span className="font-medium">read direction</span>{" "}
          and <span className="font-medium">pace</span>.
        </p>

        <RadioGroup
          className="grid grid-cols-3 gap-2 max-w-[240px]"
          onValueChange={(value) => handleIntendedShotChange(value)}
        >
          {paceOptions.map((pace) =>
            readDirections.map((read) => {
              const combo = `${pace}-${read}` as ReadCombo;
              const Icon = readGridIcons[combo];
              return (
                <div key={combo} className="flex flex-col items-center">
                  <RadioGroupItem
                    value={combo}
                    id={combo}
                    className="peer sr-only"
                  />
                  <Label
                    htmlFor={combo}
                    className="flex h-12 w-12 items-center justify-center rounded-md border border-input bg-background cursor-pointer transition-colors peer-data-[state=checked]:bg-primary peer-data-[state=checked]:text-primary-foreground"
                  >
                    <Icon className="w-5 h-5" />
                  </Label>
                </div>
              );
            }),
          )}
        </RadioGroup>
      </div>

      <hr className="border" />

      {/* RESULT SECTION */}
      <div className="space-y-4">
        <p className="font-semibold text-sm">RESULT</p>

        {/* Miss Side */}
        <div className="space-y-1">
          <Label className="text-xs font-medium">Miss Side</Label>
          <RadioGroup
            value={actual.missSide}
            onValueChange={(value) => handleActualShotChange("missSide", value)}
          >
            <div className="flex flex-wrap gap-3">
              {missSides.map((missSide) => (
                <div key={missSide} className="flex items-center space-x-2">
                  <RadioGroupItem value={missSide} id={`miss-${missSide}`} />
                  <Label htmlFor={`miss-${missSide}`} className="text-sm">
                    {missSide}
                  </Label>
                </div>
              ))}
            </div>
          </RadioGroup>
        </div>

        <div className="space-y-1">
          <Label className="text-xs font-medium">Direction to Target</Label>
          <RadioGroup
            value={actual.directionToTarget}
            onValueChange={(value) =>
              handleActualShotChange("directionToTarget", value)
            }
          >
            <div className="flex flex-wrap gap-3">
              {directionToTargets.map((direction) => (
                <div key={direction} className="flex items-center space-x-2">
                  <RadioGroupItem value={direction} id={`dir-${direction}`} />
                  <Label htmlFor={`dir-${direction}`} className="text-sm">
                    {direction}
                  </Label>
                </div>
              ))}
            </div>
          </RadioGroup>
        </div>

        {/* Distance to Target */}
        <div className="space-y-1">
          <Label className="text-xs font-medium">Distance to Target</Label>
          <RadioGroup
            value={actual.distanceToTarget}
            onValueChange={(value) =>
              handleActualShotChange("distanceToTarget", value)
            }
          >
            <div className="flex flex-wrap gap-3">
              {distanceToTargets.map((distance) => (
                <div key={distance} className="flex items-center space-x-2">
                  <RadioGroupItem value={distance} id={`dist-${distance}`} />
                  <Label htmlFor={`dist-${distance}`} className="text-sm">
                    {distance}
                  </Label>
                </div>
              ))}
            </div>
          </RadioGroup>
        </div>
      </div>
    </div>
  );
}
