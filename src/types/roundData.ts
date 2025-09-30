export type RoundData = {
  userId: string;
  courseId: string;
  roundDate: string;
  roundTime: string;
  holes: HoleData[];
  totalScore: number;
  totalPutts: number;
  totalPenaltyStrokes: number;
  fairwaysHit: number;
  greensInRegulation: number;
};

type HoleData = {
  holeNumber: number;
  par: number;
  strokes: number;
  fairwayHit: boolean | null; // null for par 3s
  putts: number;
  penaltyStrokes: number;
  greenInRegulation: boolean;
  shots: ShotInformation[];
};

type ShotInformation = {
  shotNumber: number;
  shotCategory: "standard" | "putt";
  shotType: ShotType;
  club: string;
  distanceToHole: number;
  lieCondition: LieCondition;
  result: ResultCondition;
  actualShotResult: ShotData;
  intendedShotResult: IntendedShotData;
};

type ShotData = StandardShot | Putt;
type IntendedShotData = BaseStandardShot | BasePutt;

type ShotType = "Tee Shot" | "Full Shot" | "Approach Shot" | "Putt";
type LieCondition = "Tee" | "Fairway" | "Rough" | "Bunker" | "Green";
type ResultCondition =
  | "Fairway"
  | "Rough"
  | "Bunker"
  | "Green"
  | "Hole Out"
  | "Water"
  | "Out of Bounds"
  | "Hazard";

// * Putts

interface BasePutt {
  read: Read;
  pace: Pace;
}

interface Putt extends BasePutt {
  distanceToTarget: DistanceToTarget;
  missSide: MissSide;
  breakRead: BreakRead;
  directionToTarget: DirectionToTarget;
}

// * Non-putts

interface BaseStandardShot {
  ballFlight: BallFlight;
  ballShape: ballShape;
  swingType: SwingType;
}

interface StandardShot extends BaseStandardShot {
  distanceToTarget: DistanceToTarget;
  directionToTarget: DirectionToTarget;
  elevationChange: ElevationChange;
}

type Read = "Break Left" | "Break Right" | "Straight";
type Pace = "Uphill" | "Downhill" | "Flat";
type DistanceToTarget = "Short" | "Long" | "On Target";
type DirectionToTarget = "Left" | "Right" | "Straight";
type ElevationChange = "Up" | "Down" | "Level";
type MissSide = "High" | "Low";
type BreakRead = "Over Read" | "Under Read" | "On Read";
type SwingType =
  | "Normal"
  | "Punch"
  | "Pitch"
  | "Chip"
  | "Flop"
  | "Lob"
  | "Bump and Run";
type BallFlight = "Low" | "Standard" | "High";
type ballShape = "Fade" | "Draw" | "Straight" | "Slice" | "Hook";
