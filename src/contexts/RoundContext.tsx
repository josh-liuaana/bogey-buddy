import { getAuth } from "firebase/auth";
import {
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useState,
} from "react";

import type { CourseWithId } from "@/types/course";
import {
  type HoleData,
  type IntendedShotData,
  type LieCondition,
  type ResultCondition,
  type RoundData,
  type ShotData,
  type ShotInformation,
  type ShotType,
} from "@/types/roundData";

import { getDateAndTimeStrings } from "./roundContextHelpers";

type RoundType = "playing-live" | "previous-entry";

type CurrentRound = {
  course: CourseWithId;
  roundType: RoundType;
};

type RoundContextType = {
  currentRound: CurrentRound | null;
  startRound: (round: CurrentRound) => void;
  endRound: () => void;
  roundData: RoundData;
  holeData: HoleData[];
  currentHoleIndex: number;
  setCurrentHoleIndex: (index: number) => void;
  currentShotIndex: number;
  setCurrentShotIndex: (index: number) => void;
  updateRoundAggregates: () => void;
  updateShotData: (shotInformation: Partial<ShotInformation>) => void;
  createNewShot: () => void;
  finishHole: () => void;
  shotInformation: ShotInformation;
};

const RoundContext = createContext<RoundContextType | undefined>(undefined);

const initialRoundData: RoundData = {
  userId: getAuth().currentUser?.uid ?? "",
  courseId: "",
  roundDate: "",
  roundTime: "",
  holes: [],
  totalScore: 0,
  totalPutts: 0,
  totalPenaltyStrokes: 0,
  fairwaysHit: 0,
  greensInRegulation: 0,
};

function defaultShotInformation(shotNumber = 1): ShotInformation {
  return {
    shotNumber,
    shotCategory: "standard",
    shotType: "" as ShotType,
    club: "",
    distanceToHole: 0,
    lieCondition: "" as unknown as LieCondition,
    result: "" as unknown as ResultCondition,
    actualShotResult: {
      directionToTarget: "",
      distanceToTarget: "",
      // defaults for non-putt standard shot (keeps inputs controlled)
      ballFlight: null,
      ballShape: null,
      swingType: null,
      // putt-specific optional fields left empty (they won't be used for standard shots)
      read: null,
      pace: null,
      missSide: null,
    } as unknown as ShotData,
    intendedShotResult: {
      ballFlight: null,
      ballShape: null,
      swingType: null,
      elevationChange: null,
      // putt-specific optional fields left empty (they won't be used for standard shots)
      read: null,
      pace: null,
    } as unknown as IntendedShotData,
  };
}

export function RoundProvider({ children }: { children: ReactNode }) {
  const [currentRound, setCurrentRound] = useState<CurrentRound | null>(null);
  const [roundData, setRoundData] = useState<RoundData>(initialRoundData);
  const [currentHoleIndex, setCurrentHoleIndex] = useState(0);
  const [currentShotIndex, setCurrentShotIndex] = useState(0);
  const [shotInformation, setShotInformation] = useState<ShotInformation>(
    defaultShotInformation(0),
  );

  // ** ROUND-LEVEL FUNCTIONS ** //

  const startRound = (round: CurrentRound) => {
    setRoundData({
      userId: getAuth().currentUser?.uid ?? "",
      courseId: round.course.id,
      roundDate: getDateAndTimeStrings().currentDateString,
      roundTime: getDateAndTimeStrings().currentTimeString,
      holes: [],
      totalScore: 0,
      totalPutts: 0,
      totalPenaltyStrokes: 0,
      fairwaysHit: 0,
      greensInRegulation: 0,
    });
    setCurrentRound(round);
    setCurrentHoleIndex(1);
    setCurrentShotIndex(0);
    createNewShot();
  };

  const updateRoundAggregates = () => {
    // TODO Calculations for score, putts, penalties, FIR, GIR
  };

  const endRound = () => {
    // TODO Calculate final aggregates before ending, then redirect to a round summary page
    updateRoundAggregates();
    setCurrentRound(null);
  };

  // ** HOLE-LEVEL FUNCTIONS ** //
  const finishHole = () => {
    // TODO Finalize current hole data, update round aggregates, and prepare for next hole
    // push hole information into roundData.holes
    updateRoundAggregates();
    setCurrentHoleIndex((prev) => prev + 1);
    setCurrentShotIndex(0);
    createNewShot();
  };

  // ** SHOT-LEVEL FUNCTIONS ** //

  const createNewShot = () => {
    console.log("Creating new shot...");
    setCurrentShotIndex((prev) => {
      const next = prev + 1;
      setShotInformation(defaultShotInformation(next));
      return next;
    });
  };

  const updateShotData = useCallback(
    (partialShotInformation: Partial<ShotInformation>) => {
      setShotInformation((prev) => {
        // merge the top level shot information
        const merged: ShotInformation = {
          ...prev,
          ...partialShotInformation,
          // merge the nested actualShotResult and intendedShotResult objects
          actualShotResult: {
            ...prev.actualShotResult,
            ...partialShotInformation.actualShotResult,
          },
          intendedShotResult: {
            ...prev.intendedShotResult,
            ...partialShotInformation.intendedShotResult,
          },
        };
        return merged;
      });
    },
    [setShotInformation],
  );

  return (
    <RoundContext.Provider
      value={{
        currentRound,
        startRound,
        endRound,
        roundData,
        holeData: [],
        currentHoleIndex: currentHoleIndex,
        setCurrentHoleIndex: () => {},
        currentShotIndex: currentShotIndex,
        setCurrentShotIndex: () => {},
        updateRoundAggregates: () => {},
        updateShotData,
        createNewShot,
        finishHole,
        shotInformation,
      }}
    >
      {children}
    </RoundContext.Provider>
  );
}

export function useRound() {
  const context = useContext(RoundContext);
  if (!context) {
    throw new Error("useRound must be used within RoundProvider");
  }
  return context;
}
