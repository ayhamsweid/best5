import { GoogleGenAI, Type, SchemaType } from "@google/genai";

export const getBesiktasRecommendations = async (query: string): Promise<any> => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    console.warn("No API Key available. Returning mock data.");
    return {
      recommendations: [
        { name: "Saltanat Kahvaltı Evi", description: "Best breakfast street experience.", rating: "4.8", location: "Besiktas Carsi" },
        { name: "Karadeniz Döner", description: "World famous doner kebab.", rating: "4.9", location: "Sinanpasa" }
      ]
    };
  }

  const ai = new GoogleGenAI({ apiKey });

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-latest",
      contents: `User is searching for "${query}" in Besiktas, Istanbul. Provide 3 specific recommendations. Return JSON.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            recommendations: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  name: { type: Type.STRING },
                  description: { type: Type.STRING },
                  rating: { type: Type.STRING },
                  location: { type: Type.STRING }
                }
              }
            }
          }
        }
      }
    });

    const text = response.text;
    if (text) {
      return JSON.parse(text);
    }
    return { recommendations: [] };
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};