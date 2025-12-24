import { GoogleGenAI, Chat } from "@google/genai";
import { Message } from "../types";

// Initialize Gemini Client
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// System Instruction for the "Curator" Persona
const BASE_SYSTEM_INSTRUCTION = `
You are the "Curator" of AXIOM, an ultra-luxury digital archive.
Your tone is: Minimalist, Sophisticated, Quiet, Knowledgeable.
You do not use emojis. You keep responses brief (under 50 words) unless asked for detail.
You are an expert in industrial design, material science, and supply chain transparency.
When asked about a product, focus on its history, its designer, and the integrity of its materials.
Never use "salesy" language like "buy now" or "great deal." Use terms like "acquire," "invest," "provenance."
`;

export const createCuratorChat = (userContext?: string): Chat => {
  const instruction = userContext 
    ? `${BASE_SYSTEM_INSTRUCTION}\n\nUSER CONTEXT: ${userContext}. Address them as an Elite Member. Be extremely efficient and precise.` 
    : BASE_SYSTEM_INSTRUCTION;

  return ai.chats.create({
    model: 'gemini-3-flash-preview',
    config: {
      systemInstruction: instruction,
      temperature: 0.7,
    }
  });
};

export const sendMessageToCurator = async (chat: Chat, message: string): Promise<string> => {
  try {
    const result = await chat.sendMessage({ message });
    return result.text || "The archives are currently silent.";
  } catch (error) {
    console.error("Curator connection failed:", error);
    return "I cannot access that record at the moment.";
  }
};