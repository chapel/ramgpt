import { atom, useAtomValue } from "jotai";
import { VisualTruncateInput } from "~/components/visual-truncate-input";

import { BotSelect } from "./bot/bot-select";

export interface GlobalSettingsAtom {
  openaiApiKey?: string;
}

export const globalSettingsAtom = atom<GlobalSettingsAtom>({});

export const GlobalSettings = () => {
  const { openaiApiKey } = useAtomValue(globalSettingsAtom);

  return (
    <div className="border-b border-gray-900/10 pb-8">
      <div className="text-md mb-4 font-medium leading-6 text-gray-900">
        Global Settings
      </div>

      <label
        htmlFor="openai-api-key"
        className="block text-sm font-medium leading-6 text-gray-900"
      >
        OpenAI API Key
      </label>
      <div className="mt-2">
        <VisualTruncateInput
          type="text"
          name="openai-api-key"
          id="openai-api-key"
          defaultValue={openaiApiKey ?? ""}
          startTrunc={3}
          endTrunc={4}
          className="block w-full rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
        />
      </div>
    </div>
  );
};
