import { GoogleGenAI, Type } from "@google/genai";

import { PROMPT } from "@/utils/genaiPrompt";

export interface GolfAnalysis {
  strengths: string[];
  weaknesses: string[];
  summary: string;
}

const GEMINI_API_KEY = import.meta.env.VITE_GENAI_API_KEY;

if (!GEMINI_API_KEY) {
  // Throw an error if the key is missing to prevent silent failures
  throw new Error("GEMINI_API_KEY not found");
}

const ai = new GoogleGenAI({
  apiKey: GEMINI_API_KEY,
});

export { ai };

export async function analyseGolfData(
  dataJsonString: string,
): Promise<GolfAnalysis> {
  const finalPrompt = PROMPT.replace("{DATA_PLACEHOLDER}", dataJsonString);

  const responseSchema = {
    type: Type.OBJECT,
    properties: {
      strengths: {
        type: Type.ARRAY,
        description: "List of 2-3 key strengths demonstrated by the player.",
        items: { type: Type.STRING },
      },
      weaknesses: {
        type: Type.ARRAY,
        description: "List of 2-3 key weaknesses or areas for improvement.",
        items: { type: Type.STRING },
      },
      summary: {
        type: Type.STRING,
        description:
          "A one-paragraph, three-sentence summary of the round's key takeaways.",
      },
    },
    required: ["strengths", "weaknesses", "summary"],
  };

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: finalPrompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: responseSchema,
    },
  });

  const analysisObject: GolfAnalysis = JSON.parse(response.text as string);
  return analysisObject;
}
