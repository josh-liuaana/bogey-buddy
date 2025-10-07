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
    <div className="space-y-6">
      {/* Lie + Swing dropdowns */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 space-y-2">
          <Label>Lie Condition</Label>
          <Select
            onValueChange={(value) => handleInputChange("lieCondition", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select condition" />
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

        <div className="flex-1 space-y-2">
          <Label>Shot type</Label>
          <Select
            onValueChange={(value) => handleInputChange("shotType", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select shot type" />
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

        <div className="flex-1 space-y-2">
          <Label>Swing Type</Label>
          <Select
            // onValueChange={(value) => handleInputChange("swingType", value)}
            onValueChange={(value) =>
              handleIntendedShotChange("swingType", value)
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Select swing" />
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

        <div className="flex-1 space-y-2">
          <Label>Elevation Change</Label>
          <Select
            onValueChange={(value) =>
              handleInputChange("elevationChange", value)
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Select elevation change" />
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

      {/* Intended Shot */}
      <div className="space-y-3">
        <p className="font-semibold text-sm">INTENDED SHOT</p>
        <div className="space-y-4">
          {/* Ball Flight */}
          <div className="space-y-1">
            <Label className="text-xs font-medium">Ball Flight</Label>
            <RadioGroup
              value={intended.ballFlight ?? ""}
              onValueChange={(value) =>
                handleIntendedShotChange("ballFlight", value)
              }
            >
              <div className="flex flex-wrap gap-3">
                {ballFlights.map((flight) => (
                  <div key={flight} className="flex items-center space-x-2">
                    <RadioGroupItem value={flight} id={`int-${flight}`} />
                    <Label htmlFor={`int-${flight}`} className="text-sm">
                      {flight}
                    </Label>
                  </div>
                ))}
              </div>
            </RadioGroup>
          </div>

          {/* Shot Shape */}
          <div className="space-y-1">
            <Label className="text-xs font-medium">Shot Shape</Label>
            <RadioGroup
              value={intended.ballShape}
              onValueChange={(value) =>
                handleIntendedShotChange("ballShape", value)
              }
            >
              <div className="flex flex-wrap gap-3">
                {ballShapes.map((shape) => (
                  <div key={shape} className="flex items-center space-x-2">
                    <RadioGroupItem value={shape} id={`int-${shape}`} />
                    <Label htmlFor={`int-${shape}`} className="text-sm">
                      {shape}
                    </Label>
                  </div>
                ))}
              </div>
            </RadioGroup>
          </div>
        </div>
      </div>

      {/* Result */}
      <div className="space-y-3">
        <p className="font-semibold text-sm">RESULT</p>
        <div className="space-y-4">
          {/* Ball Flight */}
          <div className="space-y-1">
            <Label className="text-xs font-medium">Ball Flight</Label>
            <RadioGroup
              value={actual.ballFlight}
              onValueChange={(value) =>
                handleActualShotChange("ballFlight", value)
              }
            >
              <div className="flex flex-wrap gap-3">
                {ballFlights.map((flight) => (
                  <div key={flight} className="flex items-center space-x-2">
                    <RadioGroupItem value={flight} id={`res-${flight}`} />
                    <Label htmlFor={`res-${flight}`} className="text-sm">
                      {flight}
                    </Label>
                  </div>
                ))}
              </div>
            </RadioGroup>
          </div>

          {/* Shot Shape */}
          <div className="space-y-1">
            <Label className="text-xs font-medium">Shot Shape</Label>
            <RadioGroup
              value={actual.ballShape}
              onValueChange={(value) =>
                handleActualShotChange("ballShape", value)
              }
            >
              <div className="flex flex-wrap gap-3">
                {ballShapes.map((shape) => (
                  <div key={shape} className="flex items-center space-x-2">
                    <RadioGroupItem value={shape} id={`res-${shape}`} />
                    <Label htmlFor={`res-${shape}`} className="text-sm">
                      {shape}
                    </Label>
                  </div>
                ))}
              </div>
            </RadioGroup>
          </div>

          {/* Direction to Target */}
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
          <div className="flex-1 space-y-2">
            <Label>Result Condition</Label>
            <Select
              onValueChange={(value) => handleInputChange("result", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select result condition" />
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
      </div>
    </div>
  );
}
