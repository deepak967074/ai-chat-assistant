import "dotenv/config";
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
});

const getGeminiAPIResponse = async (messages) => {
    const contents = messages.map((msg) => ({
        role: msg.role === "assistant" ? "model" : "user",
        parts: [{ text: msg.content }],
    }));

    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents,
    });

    return response.text;
};

export default getGeminiAPIResponse;