import { doc, getDoc } from "firebase/firestore";
import { createContext, useContext } from "react";

import { db } from "@/lib/firebase";
import type { RoundData } from "@/types/roundData";

interface StatisticsContextType {
  getUserSingleRoundStatistics: (
    firebaseId: string,
    userId: string,
  ) => Promise<RoundData | null>; // replace 'any' with appropriate type once object shape has been creating, or just the rawData
}

const StatisticsContext = createContext<StatisticsContextType | undefined>(
  undefined,
);

export function StatisticsProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  async function getUserSingleRoundStatistics(
    roundId: string,
    userId: string,
  ): Promise<RoundData | null> {
    try {
      const roundDocRef = doc(db, "roundData", roundId);
      const roundDocSnap = await getDoc(roundDocRef);

      if (!roundDocSnap.exists()) {
        console.error("Round does not exist");
        return null;
      }

      const roundData = roundDocSnap.data();

      if (roundData.userId !== userId) {
        console.error("User does not have access to this round data");
        return null;
      }

      return roundData as RoundData;
    } catch (error) {
      console.error("Error fetching user single round statistics:", error);
      return null;
    }
  }

  return (
    <StatisticsContext.Provider
      value={{
        getUserSingleRoundStatistics,
      }}
    >
      {children}
    </StatisticsContext.Provider>
  );
}

export function useStatistics() {
  const context = useContext(StatisticsContext);
  if (!context) {
    throw new Error("useStatistics must be used within StatisticsProvider");
  }
  return context;
}
