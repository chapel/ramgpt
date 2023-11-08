"use client";

import { atom, useAtomValue } from "jotai";
import { useState } from "react";

import { BotSelect } from "./bot-select";

export const selectedBotAtom = atom<string | undefined>(undefined);

export interface BotListAtom {
  bots: Set<BotSettingsAtom>;
}

export const botListAtom = atom<Set<BotSettingsAtom>>(
  new Set<BotSettingsAtom>([
    { id: "test", name: "Test" },
    { id: "test2", name: "Test 2" },
  ]),
);

export interface BotSettingsAtom {
  id: string;
  name: string;
}

export const botSettingsAtom = atom<BotSettingsAtom | undefined>((get) => {
  const selectedBot = get(selectedBotAtom);
  const bots = [...get(botListAtom).values()];

  const botSettings = bots.find((bot) => bot.id === selectedBot);

  if (selectedBot === undefined || botSettings === undefined) {
    return bots[0] ?? undefined;
  }

  return botSettings;
});

const Settings = ({ botSettings }: { botSettings: BotSettingsAtom }) => {
  const [localSettings, setLocalSettings] = useState(botSettings);

  return (
    <div className="sm:col-span-4">
      <label
        htmlFor="name"
        className="block text-sm font-medium leading-6 text-gray-900"
      >
        Name
      </label>
      <div className="mt-2">
        <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md">
          <input
            type="text"
            name="name"
            id="name"
            value={localSettings.name ?? ""}
            onChange={(event) => {
              setLocalSettings((settings) => ({
                ...settings,
                name: event.target.value,
              }));
            }}
            placeholder="Bard"
            className="block flex-1 border-0 bg-transparent p-1.5 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
          />
        </div>
      </div>
    </div>
  );
};
export default function BotSettings() {
  const botSettings = useAtomValue(botSettingsAtom);

  /*
   * TODOs:
   *  * Add button to create new bot
   *  * Add button to delete bot
   *  * Add save and reset buttons
   *  * Add all the settings that are needed
   *    * System
   *    * Profile
   *    * Human
   */
  return (
    <main className="px-4">
      <form id="settings">
        <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
          <div className="sm:col-span-4">
            <label
              htmlFor="select-bot"
              className="block text-sm font-medium leading-6 text-gray-900"
            >
              Select Bot
            </label>
            <div className="mt-2">
              {botSettings === undefined ? "No bots" : <BotSelect />}
            </div>
          </div>
          {botSettings === undefined ? null : (
            <Settings key={botSettings.id} botSettings={botSettings} />
          )}
        </div>
      </form>
    </main>
  );
}
