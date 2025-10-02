// contexts/RoundContext.tsx
import type { CourseWithId } from "@/types/course";
import { createContext, useContext, useState, type ReactNode } from "react";

type RoundType = "playing-live" | "previous-entry";

type CurrentRound = {
  course: CourseWithId;
  roundType: RoundType;
};

type RoundContextType = {
  currentRound: CurrentRound | null;
  startRound: (round: CurrentRound) => void;
  endRound: () => void;
};

const RoundContext = createContext<RoundContextType | undefined>(undefined);

export function RoundProvider({ children }: { children: ReactNode }) {
  const [currentRound, setCurrentRound] = useState<CurrentRound | null>(null);

  const startRound = (round: CurrentRound) => setCurrentRound(round);
  const endRound = () => setCurrentRound(null);

  return (
    <RoundContext.Provider value={{ currentRound, startRound, endRound }}>
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
