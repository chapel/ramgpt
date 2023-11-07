"use client";

import { useAtom, useAtomValue, useSetAtom } from "jotai";
import { redirect, usePathname } from "next/navigation";
import { useCallback } from "react";
import { useFormState } from "react-dom";
import slugify from "slugify";
import { VisualTruncateInput } from "~/components/visual-truncate-input";

import { botListAtom, botSettingsAtom } from "../bot/page";
import { GlobalSettings, globalSettingsAtom } from "../global";

interface ButtonProps {
  onCancel: () => void;
}

const Buttons = ({ onCancel }: ButtonProps) => {
  return (
    <>
      <button
        type="button"
        className="rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:ring-gray-400"
        onClick={onCancel}
      >
        Cancel
      </button>
      <button
        form="settings"
        type="submit"
        className="ml-4 inline-flex justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
      >
        Save
      </button>
    </>
  );
};

interface GlobalSettingsFormData {
  openaiApiKey?: string;
}

interface BotSettingsFormData {
  name?: string;
}

interface SettingsForm {
  globalSettings: GlobalSettingsFormData;
  botSettings: BotSettingsFormData;
}

export default function Settings() {
  const [globalSettings, setGlobalSettings] = useAtom(globalSettingsAtom);
  const botSettings = useAtomValue(botSettingsAtom);
  const setBotList = useSetAtom(botListAtom);
  const pathname = usePathname();

  const handleFormAction = useCallback(
    (previousState: SettingsForm, formData: FormData) => {
      const openaiApiKey = formData.get("openai-api-key") as string;
      const name = formData.get("name") as string;
      let nameChanged = false;

      setGlobalSettings({ ...globalSettings, openaiApiKey });
      setBotList((botList) => {
        const duplicateNameCount = [...botList.values()].filter(
          (bot) => bot.name === name,
        ).length;
        if (botSettings) {
          nameChanged = botSettings.name !== name;
          (botSettings.id = slugify(
            duplicateNameCount > 0 ? `${name}-${duplicateNameCount}` : name,
            {
              lower: true,
            },
          )),
            (botSettings.name = name);
        }
        return botList;
      });

      if (nameChanged) {
        redirect(`/chat/${botSettings?.id}`);
      }

      return Promise.resolve({
        ...previousState,
        globalSettings: {
          ...previousState.globalSettings,
          openaiApiKey,
        },
        botSettings: {
          ...previousState.botSettings,
          name,
        },
      });
    },
    [setGlobalSettings, setBotList, globalSettings, botSettings],
  );

  const [formState, formAction] = useFormState<SettingsForm, FormData>(
    handleFormAction,
    { globalSettings: {}, botSettings: {} },
  );

  return (
    <main className="px-4">
      <form id="settings" action={formAction}>
        <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
          <div className="sm:col-span-4">
            <label
              htmlFor="openai-api-key"
              className="block text-sm font-medium leading-6 text-gray-900"
            >
              OpenAI API Key
            </label>
            <p className="mt-1 text-sm leading-6 text-gray-600">
              To find your OpenAI API key, go to{" "}
              <a
                href="https://platform.openai.com/api-keys"
                target="_blank"
                rel="noreferrer"
              >
                https://platform.openai.com/api-keys
              </a>
              .
            </p>
            <p className="mt-1 text-sm leading-6 text-gray-600">
              Your API key and any information input or generated will never be
              sent to our servers.
            </p>
            <p className="text-sm leading-6 text-gray-600">
              Everything is run in your browser only.
            </p>
            <div className="mt-2">
              <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md">
                <VisualTruncateInput
                  type="text"
                  name="openai-api-key"
                  id="openai-api-key"
                  defaultValue={""}
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
              >
                <option value="gpt-4-1106-preview">
                  GPT-4 Turbo Preview (128k)
                </option>
                <option value="gpt-4">GPT-4 (8k)</option>
                <option value="gpt-3.5-turbo-16k">GPT-3.5 Turbo (16k)</option>
              </select>
            </div>
          </div>
        </div>
      </form>
    </main>
  );
}
