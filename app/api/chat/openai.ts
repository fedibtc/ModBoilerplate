import OpenAI from "openai";
import { z } from "zod";

export const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const openAIModel = z.enum(["gpt-4-1106-preview", "gpt-3.5-turbo-1106"]);

export type OpenAIModel = z.infer<typeof openAIModel>;

export interface ModelInfo {
  // Model display name
  name: string;
  // Cost per message in sats
  messageCost: number;
}

export const modelInfo: Record<OpenAIModel, ModelInfo> = {
  "gpt-4-1106-preview": {
    name: "GPT-4 Turbo",
    messageCost: 10,
  },
  "gpt-3.5-turbo-1106": {
    name: "GPT-3.5 Turbo",
    messageCost: 5,
  },
};
