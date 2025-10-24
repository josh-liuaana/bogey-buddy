import { getAuth } from "firebase/auth";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

import { useStatistics } from "@/contexts/StatisticsContext.tsx";
import { analyseGolfData, type GolfAnalysis } from "@/lib/genaiClient.ts";
import type { RoundData } from "@/types/roundData.ts";
import { calculateRoundStatistics } from "@/utils/dataAnalysis";
import { EXAMPLE_ANALYSIS_RESPONSE } from "@/utils/genaiPrompt";

export function RoundSummary() {
  const user = getAuth().currentUser;
  const { getUserSingleRoundStatistics } = useStatistics();
  const location = useLocation();
  const firebaseId = location.state || "No ID found";

  const [roundData, setRoundData] = useState<RoundData | null>(null);
  const [loading, setLoading] = useState(true);
  const [genaiAnalysis, setGenaiAnalysis] = useState<
    GolfAnalysis | string | null
  >(null);
  const [roundStats, setRoundStats] = useState<any>(null); // To come from calculateRoundStatistics utils

  // TODO Calculate round stats
  useEffect(() => {
    const fetchAndAnalyseRoundData = async () => {
      const data = await getUserSingleRoundStatistics(
        firebaseId,
        user?.uid || "",
      );

      const roundStatistics = calculateRoundStatistics(data as RoundData);
      setRoundStats(roundStatistics);
      console.log("Round Statistics:", roundStatistics);

      if (data) {
        setRoundData(data);
        const dataJsonString = JSON.stringify(data, null, 2);
        const genaiAnalysisResponse = await analyseGolfData(dataJsonString);
        setGenaiAnalysis(genaiAnalysisResponse);
      } else {
        setGenaiAnalysis("No analysis available.");
      }

      setLoading(false);
    };

    fetchAndAnalyseRoundData();
  }, [firebaseId, user?.uid, getUserSingleRoundStatistics]);

  if (loading) {
    return <div>Calculating your round statistics...</div>;
  }

  if (!roundData) {
    return <div>No round data found.</div>;
  }

  return (
    <div className="flex flex-col items-center pt-4 pb-10 text-deep-forest bg-dune-sand min-h-screen">
      <h1 className="text-3xl font-bold mb-6">Round Summary</h1>
      <p>
        Score: {roundData.totalScore} ({roundStats.scoreToPar})
      </p>
      <p>Total Putts: {roundData.totalPutts}</p>
      <p>
        Fairways Hit: {roundData.fairwaysHit}/
        {roundStats.fairwayData.totalFairways} -{" "}
        {roundStats.fairwayData.percentage}%
      </p>
      <p>Greens in Regulation: {roundData.greensInRegulation}</p>

      {!loading && genaiAnalysis && (
        <div className="border rounded-lg p-6 m-6 flex flex-col gap-2 items-center">
          <h3 className="text-xl">Summary</h3>

          <p>{EXAMPLE_ANALYSIS_RESPONSE.summary}</p>

          <h3>Strengths</h3>
          {EXAMPLE_ANALYSIS_RESPONSE.strengths.map((strength, index) => (
            <p key={index}>✅ {strength}</p>
          ))}

          <h3>Weaknesses</h3>
          {EXAMPLE_ANALYSIS_RESPONSE.weaknesses.map((weakness, index) => (
            <p key={index}>⚠️ {weakness}</p>
          ))}

          <p className="text-xs">created with genai - can make mistakes</p>
        </div>
      )}

      {!loading && !genaiAnalysis && <p>Analysis could not be generated.</p>}
    </div>
  );
}
