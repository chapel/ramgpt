"use client";

import { atom, useAtomValue } from "jotai";

import { PopoutTextarea } from "./popout-textarea";

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
  const bots = get(botListAtom);

  if (selectedBot === undefined) {
    return undefined;
  }

  return [...bots.values()].find((bot) => bot.id === selectedBot) ?? undefined;
});

export default function BotSettings() {
  const botSettings = useAtomValue(botSettingsAtom);

  return (
    <div className="border-b border-gray-900/10 pb-8">
      <div className="text-md mb-4 font-medium leading-6 text-gray-900">
        Bot Settings
      </div>

      <label
        htmlFor="name"
        className="mt-4 block text-sm font-medium leading-6 text-gray-900"
      >
        Name
      </label>
      <div className="mt-2">
        <input
          type="text"
          name="name"
          id="name"
          key={`name-${botSettings?.id}`}
          defaultValue={botSettings?.name ?? ""}
          className="block w-full rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
        />
      </div>
      <label
        htmlFor="system-prompt"
        className="mt-4 block text-sm font-medium leading-6 text-gray-900"
      >
        System Prompt
      </label>
      <div className="mt-2">
        <PopoutTextarea
          rows={4}
          name="system-prompt"
          id="system-prompt"
          className="block w-full rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
          defaultValue={""}
        />
      </div>
    </div>
  );
}
