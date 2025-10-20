import { useState } from "react";
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
import { cn } from "@/lib/utils";
import {
  directionToTargets,
  distanceToTargets,
  missSides,
  type Pace,
  type Putt,
  type Read,
} from "@/types/roundData";

import { Button } from "../ui/button";

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
  const [shotPlan, setShotPlan] = useState(true);

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
    <div className="w-full space-y-6">
      <div className="grid grid-cols-2 gap-5 bg-off-green">
        <Button
          onClick={() => setShotPlan(true)}
          className={cn(
            "w-full px-4 py-4 text-md flex items-center justify-center",
            {
              "bg-deep-forest text-dune-sand shadow-[0_4px_10px_rgba(0,0,0,0.5)]":
                shotPlan,
              "bg-dune-sand text-deep-bg-deep-forest shadow-none border border-deep-forest":
                !shotPlan,
            },
          )}
        >
          Shot Plan
        </Button>
        <Button
          onClick={() => setShotPlan(false)}
          className={cn(
            "w-full px-4 py-4 text-md flex items-center justify-center",
            {
              "bg-deep-forest text-dune-sand shadow-[0_4px_10px_rgba(0,0,0,0.5)]":
                !shotPlan,
              "bg-dune-sand text-deep-bg-deep-forest shadow-none border border-deep-forest":
                shotPlan,
            },
          )}
        >
          Result
        </Button>
      </div>

      {shotPlan ? (
        // {/* READ GRID */}
        <div className="border rounded-lg py-2 px-4 flex flex-col items-center gap-4">
          <div>
            <p className="text-md font-medium text-center">Read & Pace</p>
            <p className="text-xs text-center text-muted-foreground">
              Tap to select your{" "}
              <span className="font-medium">read direction</span> and{" "}
              <span className="font-medium">pace</span>.
            </p>
          </div>
          <RadioGroup
            className="grid grid-cols-3 gap-5 w-full"
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
                      className="flex aspect-square w-full items-center justify-center rounded-md border border-deep-forest bg-dune-sand peer-data-[state=checked]:bg-deep-forest peer-data-[state=checked]:text-dune-sand"
                    >
                      <Icon className="w-6 h-6" />
                    </Label>
                  </div>
                );
              }),
            )}
          </RadioGroup>
        </div>
      ) : (
        // {/* RESULT SECTION */}
        <div className="">
          <div className="mb-4 gap-3 flex flex-col border rounded-lg py-2 px-4">
            <Label className="text-md font-medium justify-center">
              Miss Side
            </Label>
            <RadioGroup
              value={actual.missSide}
              onValueChange={(value) =>
                handleActualShotChange("missSide", value)
              }
              className="grid grid-cols-3 gap-2 w-full"
            >
              {missSides.map((missSide) => (
                <div key={missSide}>
                  <RadioGroupItem
                    value={missSide}
                    id={`int-${missSide}`}
                    className="peer sr-only"
                  />
                  <label
                    htmlFor={`int-${missSide}`}
                    className={cn(
                      "flex items-center justify-center rounded-md border border-muted bg-background px-3 py-2 text-sm font-medium",
                      "peer-data-[state=checked]:bg-deep-forest peer-data-[state=checked]:text-dune-sand peer-data-[state=checked]:border-deep-forest",
                      "peer-data-[state=unchecked]:bg-dune-sand peer-data-[state=unchecked]:text-deep-forest peer-data-[state=unchecked]:border-deep-forest",
                    )}
                  >
                    {missSide}
                  </label>
                </div>
              ))}
            </RadioGroup>
          </div>

          {/* Direction to Target */}
          <div className="mb-4 gap-3 flex flex-col border rounded-lg py-2 px-4">
            <Label className="text-md font-medium justify-center">
              Direction to Target
            </Label>
            <RadioGroup
              value={actual.directionToTarget}
              onValueChange={(value) =>
                handleActualShotChange("directionToTarget", value)
              }
              className="grid grid-cols-3 gap-2 w-full"
            >
              {directionToTargets.map((direction) => (
                <div key={direction}>
                  <RadioGroupItem
                    value={direction}
                    id={`dir-${direction}`}
                    className="peer sr-only"
                  />
                  <label
                    htmlFor={`dir-${direction}`}
                    className={cn(
                      "flex items-center justify-center rounded-md border border-muted bg-background px-3 py-2 text-sm font-medium",
                      "peer-data-[state=checked]:bg-deep-forest peer-data-[state=checked]:text-dune-sand peer-data-[state=checked]:border-deep-forest",
                      "peer-data-[state=unchecked]:bg-dune-sand peer-data-[state=unchecked]:text-deep-forest peer-data-[state=unchecked]:border-deep-forest",
                    )}
                  >
                    {direction}
                  </label>
                </div>
              ))}
            </RadioGroup>
          </div>

          {/* Distance to Target */}
          <div className="mb-4 gap-3 flex flex-col border rounded-lg py-2 px-4">
            <Label className="text-md font-medium justify-center">
              Distance to Target
            </Label>
            <RadioGroup
              value={actual.distanceToTarget}
              onValueChange={(value) =>
                handleActualShotChange("distanceToTarget", value)
              }
              className="grid grid-cols-3 gap-2 w-full"
            >
              {distanceToTargets.map((distance) => (
                <div key={distance}>
                  <RadioGroupItem
                    value={distance}
                    id={`dist-${distance}`}
                    className="peer sr-only"
                  />
                  <label
                    htmlFor={`dist-${distance}`}
                    className={cn(
                      "flex items-center justify-center rounded-md border border-muted bg-background px-3 py-2 text-sm font-medium",
                      "peer-data-[state=checked]:bg-deep-forest peer-data-[state=checked]:text-dune-sand peer-data-[state=checked]:border-deep-forest",
                      "peer-data-[state=unchecked]:bg-dune-sand peer-data-[state=unchecked]:text-deep-forest peer-data-[state=unchecked]:border-deep-forest",
                    )}
                  >
                    {distance === "On Target" ? "True" : distance}
                  </label>
                </div>
              ))}
            </RadioGroup>
          </div>
        </div>
      )}
    </div>
  );
}
