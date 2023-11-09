import { proxy } from "valtio";

const GPT_4_TURBO = "gpt-4-1106-preview";
const GPT_4 = "gpt-4";
const GPT_3_5_TURBO = "gpt-3.5-turbo-16k";

export const MODEL_MAP = {
  [GPT_4_TURBO]: "GPT-4 Turbo Preview (128k tokens)",
  [GPT_4]: "GPT-4 (8k tokens)",
  [GPT_3_5_TURBO]: "GPT-3.5 Turbo (16k tokens)",
};

export interface OpenaiSettings {
  apiKey?: string;
  model: string;
}

export const OPENAI_SETTINGS = proxy<OpenaiSettings>({
  model: GPT_4_TURBO,
});

export const setApiKey = (apiKey: string) => {
  OPENAI_SETTINGS.apiKey = apiKey;
};

export const setModel = (model: string) => {
  OPENAI_SETTINGS.model = model;
};
