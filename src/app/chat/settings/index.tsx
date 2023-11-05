"use client";

import { useAtom, useAtomValue, useSetAtom } from "jotai";
import { redirect } from "next/navigation";
import { useCallback } from "react";
import { useFormState } from "react-dom";
import slugify from "slugify";
import { PopoutSideMenu } from "~/components/popout-side-menu";

import { showSettingsAtom } from "../[selectedBotSlug]/page";
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

export const Settings = () => {
  const [show, setShow] = useAtom(showSettingsAtom);
  const [globalSettings, setGlobalSettings] = useAtom(globalSettingsAtom);
  const botSettings = useAtomValue(botSettingsAtom);
  const setBotList = useSetAtom(botListAtom);

  const handleCancel = useCallback(() => {
    setShow(false);
  }, [setShow]);

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

      setShow(false);

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
    [setGlobalSettings, setBotList, globalSettings, botSettings, setShow],
  );

  const [formState, formAction] = useFormState<SettingsForm, FormData>(
    handleFormAction,
    { globalSettings: {}, botSettings: {} },
  );

  return (
    <PopoutSideMenu
      show={show}
      title="Settings"
      description="Manage global settings and bot configurations."
      onClose={handleCancel}
      buttons={<Buttons onCancel={handleCancel} />}
    >
      <form
        id="settings"
        className="flex h-full flex-col divide-y divide-gray-200 bg-white"
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
    </PopoutSideMenu>
  );
};
