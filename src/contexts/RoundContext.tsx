import { getAuth } from "firebase/auth";
import { addDoc, collection } from "firebase/firestore";
import {
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

import { db } from "@/lib/firebase";
import type { CurrentRound } from "@/types/course";
import type {
  IntendedShotData,
  LieCondition,
  ResultCondition,
  RoundData,
  ShotData,
  ShotInformation,
  ShotType,
} from "@/types/roundData";
import { log } from "@/utils/logger";

import {
  clearLocalStorageState,
  loadLocalStorageState,
  saveLocalStorageState,
} from "./localStorage";
import {
  getDateAndTimeStrings,
  normaliseShotData,
} from "./roundContextHelpers";

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
  endRound: () => Promise<string | null>;
  abandonRound: () => void;

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

const initialLocalStorageState = loadLocalStorageState();

const initialCurrentRound = initialLocalStorageState
  ? initialLocalStorageState.currentRound
  : null;
const initialRoundData = initialLocalStorageState
  ? initialLocalStorageState.roundData
  : undefined;
const initialHoleIndex = initialLocalStorageState
  ? initialLocalStorageState.currentHoleIndex
  : 0;
const initialShotIndex = initialLocalStorageState
  ? initialLocalStorageState.currentShotIndex
  : 0;
const initialShotInformation = initialLocalStorageState
  ? initialLocalStorageState.shotInformation
  : defaultShotInformation(initialShotIndex || 0);

export function RoundProvider({ children }: { children: ReactNode }) {
  const [currentRound, setCurrentRound] = useState<CurrentRound | null>(
    initialCurrentRound,
  );
  const [roundData, setRoundData] = useState<RoundData | undefined>(
    initialRoundData,
  );
  const [currentHoleIndex, setCurrentHoleIndex] = useState(initialHoleIndex);
  const [currentShotIndex, setCurrentShotIndex] = useState(initialShotIndex);
  const [shotInformation, setShotInformation] = useState<ShotInformation>(
    initialShotInformation,
  );

  useEffect(() => {
    if (currentRound && roundData) {
      const stateToPersist = {
        currentRound,
        roundData,
        currentHoleIndex,
        currentShotIndex,
        shotInformation,
      };
      saveLocalStorageState(stateToPersist);
    }
  }, [
    currentRound,
    roundData,
    currentHoleIndex,
    currentShotIndex,
    shotInformation,
  ]);

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
    setRoundData((prev) => {
      if (!prev) return prev;

      const totalScore = prev.holes.reduce(
        (sum, hole) => sum + hole.strokes,
        0,
      );
      const totalPutts = prev.holes.reduce((sum, hole) => sum + hole.putts, 0);
      const totalPenaltyStrokes = prev.holes.reduce(
        (sum, hole) => sum + hole.penaltyStrokes,
        0,
      );
      const fairwaysHit = prev.holes.reduce((sum, hole) => {
        if (hole.fairwayHit) return sum + 1;
        return sum;
      }, 0);
      const greensInRegulation = prev.holes.reduce((sum, hole) => {
        if (hole.greenInRegulation) return sum + 1;
        return sum;
      }, 0);

      return {
        ...prev,
        totalScore,
        totalPutts,
        totalPenaltyStrokes,
        fairwaysHit,
        greensInRegulation,
      };
    });

    log("RoundProvider", "Updating round aggregates");
  };

  const endRound = async () => {
    updateRoundAggregates();

    log(
      "RoundProvider",
      "Ending round for course:",
      currentRound?.course.title,
    );

    try {
      log("RoundProvider", "Final round data to be saved:", roundData);
      const docRef = await addDoc(collection(db, "roundData"), roundData);
      log("RoundProvider", "Round data saved with ID:", docRef.id);

      clearLocalStorageState();

      setCurrentRound(null);
      return docRef.id;
    } catch (error) {
      log("RoundProvider", "Error saving round data:", error);
      return null;
    }
  };

  const abandonRound = () => {
    log(
      "RoundProvider",
      "Abandoning round for course:",
      currentRound?.course.title,
    );
    clearLocalStorageState();
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

    calculateHoleStatistics();
    finishShot();

    initializeHole(currentHoleIndex + 1);
    updateRoundAggregates();
  };

  const calculateHoleStatistics = () => {
    const holePar = roundData?.holes?.[currentHoleIndex - 1]?.par ?? 0;

    const shots = roundData?.holes?.[currentHoleIndex - 1]?.shots ?? [];
    const strokesToGreen =
      shots.filter((shot) => shot.result !== "Green").length || 0;

    let FIR = false;
    if (holePar !== 3) {
      FIR = shots[0].result === "Fairway";
    }

    const GIR = strokesToGreen <= holePar - 2;
    const putts = shots.length - strokesToGreen;

    setRoundData((prev) => {
      if (!prev) return prev;

      const updatedHoles = [...prev.holes];
      const holeIndex = currentHoleIndex - 1;

      const updatedHole = {
        ...updatedHoles[holeIndex],
        putts: putts,
        fairwayHit: FIR,
        greenInRegulation: GIR,
      };

      updatedHoles[holeIndex] = updatedHole;

      return {
        ...prev,
        holes: updatedHoles,
      };
    });
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
        abandonRound,

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
