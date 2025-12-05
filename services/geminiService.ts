import { GoogleGenAI } from "@google/genai";
import { Language, SignerType } from "../types";

const createClient = () => {
  if (!process.env.API_KEY) {
    console.warn("Gemini API Key is missing. Mocking response.");
    return null;
  }
  return new GoogleGenAI({ apiKey: process.env.API_KEY });
};

export const generateThankYouMessage = async (
  language: Language,
  signerType: SignerType,
  name: string
): Promise<string> => {
  const client = createClient();

  // Fallback if no API key is present
  if (!client) {
    return language === Language.DE 
      ? `Vielen Dank, ${name}. Ihre Stimme zählt!` 
      : language === Language.TR 
      ? `Teşekkürler, ${name}. Sesiniz bizim için önemli!` 
      : `Thank you, ${name}. Your voice matters!`;
  }

  const prompt = `
    You are an advocate for the logistics industry in Germany.
    A user has just signed a petition to allow IHK truck driver exams in multiple languages.
    
    User details:
    - Name: ${name}
    - Role: ${signerType === 'driver' ? 'Professional Truck Driver (Berufskraftfahrer)' : 'Transport Company Owner'}
    - Language: ${language}
    
    Task: Write a very short, motivating, and professional thank you note (max 2 sentences) in the user's language (${language}). 
    Acknowledge their specific role. Be encouraging about the future of logistics.
    Do not add any preamble, just the message.
  `;

  try {
    const response = await client.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    return response.text || "Thank you for your support.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Thank you for signing the petition.";
  }
};