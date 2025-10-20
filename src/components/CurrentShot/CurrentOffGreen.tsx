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
import { useRound } from "@/contexts/RoundContext";
import { cn } from "@/lib/utils";
import {
  ballFlights,
  ballShapes,
  type BaseStandardShot,
  directionToTargets,
  distanceToTargets,
  elevationChanges,
  lieConditions,
  resultConditions,
  shotTypes,
  type StandardShot,
  swingTypes,
} from "@/types/roundData";

export function CurrentOffGreen() {
  const { updateShotData, shotInformation } = useRound();
  const [shotPlan, setShotPlan] = useState(true);

  // Updates a top-level field in shotInformation
  const handleInputChange = (field: string, value: string) => {
    updateShotData({ [field]: value } as Partial<typeof shotInformation>);
  };

  // updates nested actualIntendedShotResult fields
  const handleIntendedShotChange = (field: string, value: string) => {
    updateShotData({
      intendedShotResult: {
        ...(shotInformation.intendedShotResult || {}),
        [field]: value,
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

  const actual = (shotInformation.actualShotResult || {}) as StandardShot;
  const intended = (shotInformation.intendedShotResult ||
    {}) as Partial<BaseStandardShot>;

  return (
    <div className="w-full space-y-6">
      {/* Lie + Swing dropdowns */}
      <div className="grid grid-cols-2 gap-5">
        <div className="flex flex-col gap-2 items-center ">
          <Label>Lie Condition</Label>
          <Select
            onValueChange={(value) => handleInputChange("lieCondition", value)}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Lie" />
            </SelectTrigger>
            <SelectContent>
              {lieConditions.map((condition) => (
                <SelectItem key={condition} value={condition}>
                  {condition}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex flex-col gap-2 items-center ">
          <Label>Shot type</Label>
          <Select
            onValueChange={(value) => handleInputChange("shotType", value)}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Shot type" />
            </SelectTrigger>
            <SelectContent>
              {shotTypes.map((type) => (
                <SelectItem key={type} value={type}>
                  {type}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex flex-col gap-2 items-center ">
          <Label>Swing Type</Label>
          <Select
            // onValueChange={(value) => handleInputChange("swingType", value)}
            onValueChange={(value) =>
              handleIntendedShotChange("swingType", value)
            }
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Swing Type" />
            </SelectTrigger>
            <SelectContent>
              {swingTypes.map((type) => (
                <SelectItem key={type} value={type}>
                  {type}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex flex-col gap-2 items-center ">
          <Label>Elevation Change</Label>
          <Select
            onValueChange={(value) =>
              handleIntendedShotChange("elevationChange", value)
            }
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Elevation" />
            </SelectTrigger>
            <SelectContent>
              {elevationChanges.map((type) => (
                <SelectItem key={type} value={type}>
                  {type}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

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
        // {/* Intended Shot */}
        <div className="">
          {/* Ball Flight */}
          <div className="mb-4 gap-3 flex flex-col border rounded-lg py-2 px-4">
            <Label className="text-md font-medium justify-center">
              Ball Flight
            </Label>
            <RadioGroup
              value={intended.ballFlight ?? ""}
              onValueChange={(value) =>
                handleIntendedShotChange("ballFlight", value)
              }
              className="grid grid-cols-3 gap-2 w-full"
            >
              {ballFlights.map((flight) => (
                <div key={flight}>
                  <RadioGroupItem
                    value={flight}
                    id={`int-${flight}`}
                    className="peer sr-only"
                  />
                  <label
                    htmlFor={`int-${flight}`}
                    className={cn(
                      "flex items-center justify-center rounded-md border border-muted bg-background px-3 py-2 text-sm font-medium",
                      "peer-data-[state=checked]:bg-deep-forest peer-data-[state=checked]:text-dune-sand peer-data-[state=checked]:border-deep-forest",
                      "peer-data-[state=unchecked]:bg-dune-sand peer-data-[state=unchecked]:text-deep-forest peer-data-[state=unchecked]:border-deep-forest",
                    )}
                  >
                    {flight}
                  </label>
                </div>
              ))}
            </RadioGroup>
          </div>

          {/* Shot Shape */}
          <div className="mb-4 gap-3 flex flex-col border rounded-lg py-2 px-4">
            <Label className="text-md font-medium justify-center">
              Shot Shape
            </Label>
            <RadioGroup
              value={intended.ballShape}
              onValueChange={(value) =>
                handleIntendedShotChange("ballShape", value)
              }
              className="grid grid-cols-3 gap-2 w-full"
            >
              {ballShapes.map((shape) => (
                <div key={shape}>
                  <RadioGroupItem
                    value={shape}
                    id={`int-${shape}`}
                    className="peer sr-only"
                  />
                  <label
                    htmlFor={`int-${shape}`}
                    className={cn(
                      "flex items-center justify-center rounded-md border border-muted bg-background px-3 py-2 text-sm font-medium",
                      "peer-data-[state=checked]:bg-deep-forest peer-data-[state=checked]:text-dune-sand peer-data-[state=checked]:border-deep-forest",
                      "peer-data-[state=unchecked]:bg-dune-sand peer-data-[state=unchecked]:text-deep-forest peer-data-[state=unchecked]:border-deep-forest",
                    )}
                  >
                    {shape}
                  </label>
                </div>
              ))}
            </RadioGroup>
          </div>
        </div>
      ) : (
        <div className="">
          {/* Ball Flight */}
          <div className="mb-4 gap-3 flex flex-col border rounded-lg py-2 px-4">
            <Label className="text-md font-medium justify-center">
              Ball Flight
            </Label>
            <RadioGroup
              value={actual.ballFlight ?? ""}
              onValueChange={(value) =>
                handleActualShotChange("ballFlight", value)
              }
              className="grid grid-cols-3 gap-2 w-full"
            >
              {ballFlights.map((flight) => (
                <div key={flight}>
                  <RadioGroupItem
                    value={flight}
                    id={`int-${flight}`}
                    className="peer sr-only"
                  />
                  <label
                    htmlFor={`int-${flight}`}
                    className={cn(
                      "flex items-center justify-center rounded-md border border-muted bg-background px-3 py-2 text-sm font-medium",
                      "peer-data-[state=checked]:bg-deep-forest peer-data-[state=checked]:text-dune-sand peer-data-[state=checked]:border-deep-forest",
                      "peer-data-[state=unchecked]:bg-dune-sand peer-data-[state=unchecked]:text-deep-forest peer-data-[state=unchecked]:border-deep-forest",
                    )}
                  >
                    {flight}
                  </label>
                </div>
              ))}
            </RadioGroup>
          </div>

          {/* Shot Shape */}
          <div className="mb-4 gap-3 flex flex-col border rounded-lg py-2 px-4">
            <Label className="text-md font-medium justify-center">
              Shot Shape
            </Label>
            <RadioGroup
              value={actual.ballShape}
              onValueChange={(value) =>
                handleActualShotChange("ballShape", value)
              }
              className="grid grid-cols-3 gap-2 w-full"
            >
              {ballShapes.map((shape) => (
                <div key={shape}>
                  <RadioGroupItem
                    value={shape}
                    id={`int-${shape}`}
                    className="peer sr-only"
                  />
                  <label
                    htmlFor={`int-${shape}`}
                    className={cn(
                      "flex items-center justify-center rounded-md border border-muted bg-background px-3 py-2 text-sm font-medium",
                      "peer-data-[state=checked]:bg-deep-forest peer-data-[state=checked]:text-dune-sand peer-data-[state=checked]:border-deep-forest",
                      "peer-data-[state=unchecked]:bg-dune-sand peer-data-[state=unchecked]:text-deep-forest peer-data-[state=unchecked]:border-deep-forest",
                    )}
                  >
                    {shape}
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

          <div className="flex flex-row gap-5 items-center justify-evenly">
            <Label>Result</Label>
            <Select
              onValueChange={(value) => handleInputChange("result", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select result" />
              </SelectTrigger>
              <SelectContent>
                {resultConditions.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      )}
    </div>
  );
}
