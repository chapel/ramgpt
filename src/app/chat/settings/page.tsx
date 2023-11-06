"use client";

import { useAtom, useAtomValue, useSetAtom } from "jotai";
import { redirect } from "next/navigation";
import { useCallback } from "react";
import { useFormState } from "react-dom";
import slugify from "slugify";

import { BotSettings, botListAtom, botSettingsAtom } from "./bot";
import { GlobalSettings, globalSettingsAtom } from "./global";

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
    <main className="lg:pl-72">
      <div className="xl:pr-96">
        <div className="px-4 py-10 sm:px-6 lg:px-8 lg:py-6">
          <form
            id="settings"
            className="flex h-full w-[80vw] flex-col divide-y divide-gray-200 bg-white"
            action={formAction}
          >
            <div className="flex flex-1 flex-col justify-between">
              <div className="divide-y divide-gray-200">
                <div className="space-y-6">
                  <GlobalSettings />
                  <BotSettings />
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}
