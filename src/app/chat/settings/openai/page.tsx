"use client";

import { atom, useAtom } from "jotai";
import { VisualTruncateInput } from "~/components/visual-truncate-input";

export interface GlobalSettingsAtom {
  openaiApiKey?: string;
  openaiModel: string;
}

export const globalSettingsAtom = atom<GlobalSettingsAtom>({
  openaiModel: "gpt-4-1106-preview",
});

export default function Settings() {
  const [globalSettings, setGlobalSettings] = useAtom(globalSettingsAtom);

  return (
    <main className="px-4">
      <form id="settings">
        <p className="mt-4 text-sm font-medium leading-6 text-gray-900">
          Please note:
        </p>
        <ul className="text-sm leading-6 text-gray-600">
          <li>
            Your API key and any data you enter or generate remain private.
          </li>
          <li>
            All operations are performed locally in your browser, ensuring your
            information is never sent to our servers.
          </li>
        </ul>
        <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
          <div className="sm:col-span-4">
            <label
              htmlFor="openai-api-key"
              className="block text-sm font-medium leading-6 text-gray-900"
            >
              OpenAI API Key
            </label>
            <p className="mt-1 text-sm leading-6 text-gray-600">
              To retrieve your OpenAI API key, simply navigate to{" "}
              <a
                href="https://platform.openai.com/api-keys"
                target="_blank"
                rel="noreferrer"
                className="text- font-medium"
              >
                OpenAI API Keys
              </a>
              .
            </p>
            <div className="mt-2">
              <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md">
                <VisualTruncateInput
                  type="text"
                  name="openai-api-key"
                  id="openai-api-key"
                  value={globalSettings.openaiApiKey ?? ""}
                  onChange={(value) =>
                    setGlobalSettings((settings) => ({
                      ...settings,
                      openaiApiKey: value,
                    }))
                  }
                  startTrunc={3}
                  endTrunc={4}
                  placeholder="sk-...dQNq"
                  className="block flex-1 border-0 bg-transparent p-1.5 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                />
              </div>
            </div>
          </div>
          <div className="sm:col-span-3">
            <label
              htmlFor="openai-model"
              className="block text-sm font-medium leading-6 text-gray-900"
            >
              OpenAI Model
            </label>
            <div className="mt-2">
              <select
                id="openai-model"
                name="openai-model"
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
                value={globalSettings.openaiModel ?? ""}
                onChange={(event) =>
                  setGlobalSettings((settings) => ({
                    ...settings,
                    openaiModel: event.target.value,
                  }))
                }
              >
                <option value="gpt-4-1106-preview">
                  GPT-4 Turbo Preview (128k tokens)
                </option>
                <option value="gpt-4">GPT-4 (8k tokens)</option>
                <option value="gpt-3.5-turbo-16k">
                  GPT-3.5 Turbo (16k tokens)
                </option>
              </select>
            </div>
          </div>
        </div>
      </form>
    </main>
  );
}
