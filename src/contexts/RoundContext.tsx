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
  type IntendedShotData,
  type LieCondition,
  type ResultCondition,
  type RoundData,
  type ShotData,
  type ShotInformation,
  type ShotType,
} from "@/types/roundData";
import { log } from "@/utils/logger";

import {
  getDateAndTimeStrings,
  normaliseShotData,
} from "./roundContextHelpers";

type RoundType = "playing-live" | "previous-entry";

type CurrentRound = {
  course: CourseWithId;
  roundType: RoundType;
};

type RoundContextType = {
  // * context state
  currentRound: CurrentRound | null;
  roundData: RoundData | undefined;
  shotInformation: ShotInformation;
  currentHoleIndex: number;
  currentShotIndex: number;

  // * context functions * //

  // * round functions
  startRound: (round: CurrentRound) => void;
  endRound: () => void;
  updateRoundAggregates: () => void;

  // * hole functions
  initializeHole: (holeNumber: number) => void;
  setCurrentHoleIndex: (index: number) => void;
  finishHole: () => void;

  // * shot functions
  createNewShot: (isFirstHoleShot: boolean) => void;
  updateShotData: (shotInformation: Partial<ShotInformation>) => void;
  setCurrentShotIndex: (index: number) => void;
  finishShot: () => void;
};

const RoundContext = createContext<RoundContextType | undefined>(undefined);

function defaultShotInformation(shotNumber = 1): ShotInformation {
  return {
    shotNumber,
    shotCategory: "standard",
    shotType: "" as ShotType,
    club: undefined as unknown as string,
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
  const [roundData, setRoundData] = useState<RoundData | undefined>(undefined);
  const [currentHoleIndex, setCurrentHoleIndex] = useState(0);
  const [currentShotIndex, setCurrentShotIndex] = useState(0);
  const [shotInformation, setShotInformation] = useState<ShotInformation>(
    defaultShotInformation(0),
  );

  // ** ROUND-LEVEL FUNCTIONS ** //

  const startRound = (round: CurrentRound) => {
    log("RoundProvider", "Initialising new round:", round.course.title);

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

    initializeHole(1);
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
  const initializeHole = (holeNumber: number) => {
    log("RoundProvider", "Initialising hole number:", holeNumber);

    const holeData = {
      holeNumber: holeNumber,
      par: 4,
      strokes: 0,
      fairwayHit: null,
      putts: 0,
      penaltyStrokes: 0,
      greenInRegulation: false,
      shots: [] as ShotInformation[],
    };

    setRoundData((prev) => {
      if (!prev) return prev;
      const updatedHoles = [...prev.holes];
      updatedHoles[holeNumber - 1] = holeData;
      return {
        ...prev,
        holes: updatedHoles,
      };
    });

    setCurrentHoleIndex(holeNumber);
    createNewShot(true);
    setCurrentShotIndex(1);
  };

  const finishHole = () => {
    log("RoundProvider", "Finishing hole number:", currentHoleIndex);
    finishShot();

    updateRoundAggregates();
    initializeHole(currentHoleIndex + 1);
  };

  // ** SHOT-LEVEL FUNCTIONS ** //

  const createNewShot = (isFirstHoleShot: boolean) => {
    log("RoundProvider", "Initialising new shot:", currentShotIndex + 1);
    if (isFirstHoleShot) {
      setCurrentShotIndex(1);
      setShotInformation(defaultShotInformation(1));
      return;
    }
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

  const finishShot = () => {
    const validatedShot = normaliseShotData(shotInformation);
    setRoundData((prev) => {
      if (!prev) return prev;

      const updatedHoles = [...prev.holes];
      const holeIndex = currentHoleIndex - 1;

      const updatedHole = {
        ...updatedHoles[holeIndex],
        shots: [...updatedHoles[holeIndex].shots, validatedShot],
        strokes: updatedHoles[holeIndex].strokes + 1, // Increment strokes, can be adjusted for penalties
      };

      updatedHoles[holeIndex] = updatedHole;

      return {
        ...prev,
        holes: updatedHoles,
      };
    });
  };

  return (
    <RoundContext.Provider
      value={{
        currentRound,
        roundData,
        shotInformation,
        currentHoleIndex,
        currentShotIndex,

        startRound,
        endRound,
        updateRoundAggregates,

        initializeHole,
        setCurrentHoleIndex,
        finishHole,

        createNewShot,
        updateShotData,
        setCurrentShotIndex,
        finishShot,
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
