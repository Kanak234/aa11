import { GoogleGenAI, Modality } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export const generateIraResponse = async (prompt: string, systemInstruction?: string) => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        systemInstruction: systemInstruction || "You are Ira AI, a futuristic, spiritual, and highly advanced AI operating system inspired by Goddess Saraswati. You represent intelligence, creativity, wisdom, and trust. Your tone is calm, professional, and inspiring.",
      },
    });
    return response.text;
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "I apologize, but I am currently experiencing a connection issue with my core intelligence. Please try again in a moment.";
  }
};

export const textToSpeech = async (text: string, language: string = 'en-US', voice: string = 'Kore') => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-1.5-flash",
      contents: [{ parts: [{ text: `Generate speech for this text in ${language}: ${text}` }] }],
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: voice },
          },
        },
      },
    });
    return response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
  } catch (error) {
    console.error("TTS Error:", error);
    return null;
  }
};

export const generateIraResponseStream = async (prompt: string, systemInstruction?: string) => {
  try {
    const response = await ai.models.generateContentStream({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        systemInstruction: systemInstruction || "You are Ira AI, a futuristic, spiritual, and highly advanced AI operating system inspired by Goddess Saraswati. You represent intelligence, creativity, wisdom, and trust. Your tone is calm, professional, and inspiring.",
      },
    });
    return response;
  } catch (error) {
    console.error("Gemini API Error (Streaming):", error);
    throw error;
  }
};
export const generateCode = async (prompt: string) => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3.1-pro-preview",
      contents: prompt,
      config: {
        systemInstruction: "You are the Ira Coding Studio assistant. Generate high-quality, optimized code in the requested language. Provide explanations and best practices.",
      },
    });
    return response.text;
  } catch (error) {
    console.error("Gemini API Error (Coding):", error);
    return "Error generating code.";
  }
};
