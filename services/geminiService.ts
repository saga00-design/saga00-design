import { GoogleGenAI, Type } from "@google/genai";

const getAIClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("API Key not found");
  }
  return new GoogleGenAI({ apiKey });
};

export const enhanceProductDescription = async (
  currentTitle: string,
  currentDescription: string
): Promise<string> => {
  try {
    const ai = getAIClient();
    const model = ai.models;
    
    const prompt = `
      Rewrite the description for a product named "${currentTitle}".
      Current description: "${currentDescription}".
      Make it more marketing-oriented, catchy, and professional. 
      Keep it under 60 words.
    `;

    const response = await model.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        systemInstruction: "You are a professional copywriter for a high-end e-commerce brand.",
      }
    });

    return response.text || currentDescription;
  } catch (error) {
    console.error("Failed to enhance description:", error);
    throw error;
  }
};

export const suggestPrice = async (
  title: string,
  description: string
): Promise<number> => {
  try {
    const ai = getAIClient();
    
    const prompt = `
      Suggest a realistic price (number only) for this product:
      Title: ${title}
      Description: ${description}
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            suggestedPrice: { type: Type.NUMBER }
          }
        }
      }
    });

    // Parse the JSON string manually as .text returns a string
    const text = response.text;
    if (!text) return 99;
    
    const data = JSON.parse(text);
    return data.suggestedPrice || 99;

  } catch (error) {
    console.error("Failed to suggest price:", error);
    return 0;
  }
};
