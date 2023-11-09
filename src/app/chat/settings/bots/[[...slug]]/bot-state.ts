"use client";

import { proxy } from "valtio";
import { proxyMap } from "valtio/utils";

export interface BotSettings {
  id: string;
  name: string;
  systemPrompt?: string;
  profilePrompt?: string;
  humanPrompt?: string;
}

export interface BotSettingsProxy {
  selectedId?: string;
  map: Map<string, BotSettings>;
  selectedBot: BotSettings | undefined;
}

const DEFAULT_BOTS: readonly [string, BotSettings][] = [
  ["test", { id: "test", name: "Test" }],
  ["test2", { id: "test2", name: "Test 2" }],
];

export const BOT_SETTINGS = proxy<BotSettingsProxy>({
  selectedId: "test",
  map: proxyMap<string, BotSettings>(DEFAULT_BOTS),
  set selectedBot(bot: BotSettings | undefined) {
    this.selectedId = bot?.id;
  },
  get selectedBot(): BotSettings | undefined {
    if (this.map.size == 0) {
      return undefined;
    } else if (this.selectedId === undefined) {
      return Array.from(this.map.values())[0];
    }

    return this.map.get(this.selectedId);
  },
});

export const deleteBot = (id: string) => {
  BOT_SETTINGS.map.delete(id);
  BOT_SETTINGS.selectedId = Array.from(BOT_SETTINGS.map.keys())[0];
};

export const cloneBot = (id: string) => {
  const sourceBot = BOT_SETTINGS.map.get(id);
  if (sourceBot) {
    const cloneId = id + "-clone";
    BOT_SETTINGS.map.set(cloneId, {
      ...sourceBot,
      id: cloneId,
      name: sourceBot.name + " Clone",
    });
  }
};

export const updateBot = (id: string, settings: BotSettings) => {
  BOT_SETTINGS.map.set(id, settings);
};

export const createBot = (settings: BotSettings) => {
  BOT_SETTINGS.map.set(settings.id, settings);
};
