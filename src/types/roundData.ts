// Stores a full round of golf, including all holes and shots taken
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

// Data for each hole played in the round
export type HoleData = {
  holeNumber: number;
  par: number;
  strokes: number;
  fairwayHit: boolean | null; // null for par 3s
  putts: number;
  penaltyStrokes: number;
  greenInRegulation: boolean;
  shots: ShotInformation[];
};

// Data for each shot taken during a hole
export type ShotInformation = {
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

export type ShotData = StandardShot | Putt;
export type IntendedShotData = BaseStandardShot | BasePutt;

// Shot Categories and Types

export const shotTypes = [
  "Tee Shot",
  "Full Shot",
  "Approach Shot",
  "Putt",
] as const;

export const lieConditions = [
  "Tee",
  "Fairway",
  "Rough",
  "Bunker",
  "Green",
] as const;

export const resultConditions = [
  "Fairway",
  "Rough",
  "Bunker",
  "Green",
  "Hole Out",
  "Water",
  "Out of Bounds",
  "Hazard",
] as const;

export type ShotType = (typeof shotTypes)[number];
export type LieCondition = (typeof lieConditions)[number];
export type ResultCondition = (typeof resultConditions)[number];

// * Non-putts

export interface BaseStandardShot {
  ballFlight: BallFlight;
  ballShape: BallShape;
  swingType: SwingType;
  elevationChange: ElevationChange;
}

export interface StandardShot extends BaseStandardShot {
  distanceToTarget: DistanceToTarget;
  directionToTarget: DirectionToTarget;
}

// * Putts

export interface BasePutt {
  read: Read;
  pace: Pace;
}

export interface Putt extends BasePutt {
  distanceToTarget: DistanceToTarget;
  directionToTarget: DirectionToTarget;
  missSide: MissSide;
}

// * Specific shot attributes * //

// * Common attributes

export const distanceToTargets = ["Short", "On Target", "Long"] as const;
export const directionToTargets = ["Left", "Straight", "Right"] as const;

export type DistanceToTarget = (typeof distanceToTargets)[number];
export type DirectionToTarget = (typeof directionToTargets)[number];

// * Standard shots

export const ballFlights = ["Low", "Standard", "High"] as const;
export const ballShapes = ["Draw", "Straight", "Fade"] as const;
export const swingTypes = [
  "Normal",
  "Punch",
  "Pitch",
  "Chip",
  "Flop",
  "Lob",
  "Bump and Run",
] as const;
export const elevationChanges = ["Up", "Level", "Down"] as const;

type BallFlight = (typeof ballFlights)[number];
type BallShape = (typeof ballShapes)[number];
type SwingType = (typeof swingTypes)[number];
type ElevationChange = (typeof elevationChanges)[number];

// * putt specific intended attributes

export const reads = ["Break Left", "Straight", "Break Right"] as const;
export const paces = ["Uphill", "Flat", "Downhill"] as const;

export type Read = (typeof reads)[number];
export type Pace = (typeof paces)[number];

// * putt specific actual attributes

export const missSides = ["Low", "On Read", "High"] as const;

export type MissSide = (typeof missSides)[number];
