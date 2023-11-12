import { proxy, subscribe } from "valtio";
import type { MessageText } from "~/components/chat/types";
import { MemGPT } from "~/gpt/memgpt";

import { BOT_SETTINGS } from "../../settings/bots/[[...slug]]/bot-state";
import { OPENAI_SETTINGS } from "../../settings/openai/openai-state";

export const memGPT = new MemGPT(
  OPENAI_SETTINGS.model,
  0.8,
  MemGPT.generateAiPrompt(
    BOT_SETTINGS.selectedBot?.systemPrompt ?? "",
    BOT_SETTINGS.selectedBot?.profilePrompt ?? "",
    BOT_SETTINGS.selectedBot?.humanPrompt ?? "",
  ),
  OPENAI_SETTINGS.apiKey ?? "",
);

subscribe(OPENAI_SETTINGS, () => {
  memGPT
    .setModel(OPENAI_SETTINGS.model)
    .setOpenaiApiKey(OPENAI_SETTINGS.apiKey ?? "");
});

subscribe(BOT_SETTINGS, () => {
  memGPT.setAiPrompt(
    MemGPT.generateAiPrompt(
      BOT_SETTINGS.selectedBot?.systemPrompt ?? "",
      BOT_SETTINGS.selectedBot?.profilePrompt ?? "",
      BOT_SETTINGS.selectedBot?.humanPrompt ?? "",
    ),
  );
});

export interface ChatHistoryProxy {
  messages: MessageText[];
  apiCallLog: string[];
}

export const CHAT_HISTORY = proxy<ChatHistoryProxy>({
  messages: [],
  apiCallLog: [],
});

export const addMessage = (message: MessageText) => {
  CHAT_HISTORY.messages.push(message);
};
