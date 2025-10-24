import type { HoleData, RoundData } from "@/types/roundData";

const calculateScoreToPar = (score: number, par: number) => {
  return score - par;
};

// calculate number or par 4s and par 5s
const calculateTotalFairways = (holes: HoleData[]) => {
  return holes.filter((hole) => hole.par === 4 || hole.par === 5).length;
};

// calculate fairways hit percentage
const calculateFairwayData = (fairwayHits: number, holes: HoleData[]) => {
  const totalFairways = calculateTotalFairways(holes);
  if (totalFairways === 0) return { percentage: 0, totalFairways: 0 };
  return {
    percentage: (fairwayHits / totalFairways) * 100,
    fairwayHits,
    totalFairways,
  };
};

export const calculateRoundStatistics = (roundData: RoundData) => {
  const { totalScore, totalPutts, fairwaysHit, holes } = roundData;

  const scoreToPar = calculateScoreToPar(
    totalScore,
    holes.reduce((acc, hole) => acc + hole.par, 0),
  );

  const fairwayData = calculateFairwayData(fairwaysHit, holes);

  return {
    scoreToPar,
    totalPutts,
    fairwayData,
  };
};
