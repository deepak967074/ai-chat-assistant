import "dotenv/config";
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
});

const getGeminiAPIResponse = async (message) => {
    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: message,
    });

    return response.text;
};

export default getGeminiAPIResponse;