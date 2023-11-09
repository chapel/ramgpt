"use client";

import { humanId } from "human-id";
import { proxy, subscribe } from "valtio";
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

class BotSettingsContainer implements BotSettingsProxy {
  selectedId?: string;
  map: Map<string, BotSettings>;

  constructor(map: Map<string, BotSettings>) {
    this.map = map;
  }

  get selectedBot(): BotSettings | undefined {
    if (this.map.size == 0) {
      return undefined;
    } else if (this.selectedId === undefined) {
      return Array.from(this.map.values())[0];
    }

    return this.map.get(this.selectedId);
  }

  set selectedBot(bot: BotSettings | undefined) {
    this.selectedId = bot?.id;
  }
}

interface StoredBotSettings {
  selectedId?: string;
  map: [string, BotSettings][];
}

const isStoredSettings = (settings: unknown): settings is StoredBotSettings => {
  return (settings as StoredBotSettings).map !== undefined;
};

const getStoredSettings = (): BotSettingsProxy | undefined => {
  const settings = new BotSettingsContainer(proxyMap<string, BotSettings>());
  const storedSettings = localStorage.getItem("bot-settings");
  if (storedSettings) {
    const parsedSettings: unknown = JSON.parse(storedSettings);
    if (isStoredSettings(parsedSettings)) {
      settings.selectedId = parsedSettings.selectedId;
      settings.map = proxyMap<string, BotSettings>(parsedSettings.map);
    }
  }
  return settings;
};

export const BOT_SETTINGS = proxy<BotSettingsProxy>(getStoredSettings());

subscribe(BOT_SETTINGS, () => {
  const settingsToStore = {
    selectedId: BOT_SETTINGS.selectedId,
    map: Array.from(BOT_SETTINGS.map.entries()),
  };
  localStorage.setItem("bot-settings", JSON.stringify(settingsToStore));
});

export const deleteBot = (id: string) => {
  BOT_SETTINGS.map.delete(id);
  BOT_SETTINGS.selectedId = Array.from(BOT_SETTINGS.map.keys())[0];
};

export const cloneBot = (id: string) => {
  const sourceBot = BOT_SETTINGS.map.get(id);
  if (sourceBot) {
    createBot({
      ...sourceBot,
      name: sourceBot.name + " Clone",
    });
  }
};

export const updateBot = (id: string, settings: BotSettings) => {
  BOT_SETTINGS.map.set(id, settings);
};

export const createBot = (settings: BotSettings) => {
  settings.id = humanId({
    separator: "-",
    capitalize: false,
  });

  if (BOT_SETTINGS.map.has(settings.id)) {
    createBot(settings);
    return;
  }

  BOT_SETTINGS.map.set(settings.id, settings);
};

export const setSelectedId = (value: string) => {
  BOT_SETTINGS.selectedId = value;
};
