"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { useFormState } from "react-dom";
import { useSnapshot } from "valtio";
import { Modal } from "~/components/modal";

import { ArrowsPointingOutIcon, XMarkIcon } from "@heroicons/react/24/outline";

import { BotSelect } from "./bot-select";
import {
  BOT_SETTINGS,
  cloneBot,
  createBot,
  deleteBot,
  updateBot,
} from "./bot-state";
import type { BotSettings } from "./bot-state";

type TextAreaProps = React.DetailedHTMLProps<
  React.TextareaHTMLAttributes<HTMLTextAreaElement>,
  HTMLTextAreaElement
>;

const FullscreenTextarea = ({ value, onChange, ...props }: TextAreaProps) => {
  const [isFullscreen, setIsFullscreen] = useState(false);

  return (
    <>
      <div className="relative w-full">
        <textarea
          {...props}
          value={value}
          onChange={onChange}
          rows={5}
          className={`${
            isFullscreen ? "h-full" : ""
          } block w-full flex-1 resize-none border-0 bg-transparent p-1.5 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6`}
        />
        <button
          type="button"
          className="absolute bottom-0 right-0"
          onClick={() => setIsFullscreen(true)}
        >
          <ArrowsPointingOutIcon className="h-8 w-8 p-1.5 text-sm text-gray-400 hover:text-gray-700" />
        </button>
      </div>
      <Modal show={isFullscreen} onClose={() => setIsFullscreen(false)}>
        <div className="relative h-[80vh] w-[90vw] pt-4 sm:h-[80vh] sm:w-[80vw] lg:w-[60vw]">
          <textarea
            {...props}
            value={value}
            onChange={onChange}
            rows={5}
            className={
              "block h-full w-full flex-1 resize-none border-0 bg-transparent p-1.5 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
            }
          />
        </div>
        <button
          type="button"
          className="absolute right-0 top-0"
          onClick={() => setIsFullscreen(false)}
        >
          <XMarkIcon className="h-10 w-10 p-1.5 text-sm text-gray-400 hover:text-gray-700" />
        </button>
      </Modal>
    </>
  );
};

const Settings = ({ botSettings }: { botSettings: BotSettings }) => {
  const [localSettings, setLocalSettings] = useState(botSettings);

  return (
    <>
      {/* Bot Name */}
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

      {/* Bot System Prompt */}
      <div className="sm:col-span-4">
        <label
          htmlFor="system-prompt"
          className="block text-sm font-medium leading-6 text-gray-900"
        >
          System Prompt
        </label>
        <div className="mt-2">
          <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md">
            <FullscreenTextarea
              name="system-prompt"
              id="system-prompt"
              value={localSettings.systemPrompt ?? ""}
              onChange={(event) => {
                setLocalSettings((settings) => ({
                  ...settings,
                  systemPrompt: event.target.value,
                }));
              }}
              placeholder="I am a helpful bot."
            />
          </div>
        </div>
      </div>

      {/* Bot Profile Prompt */}
      <div className="sm:col-span-4">
        <label
          htmlFor="profile-prompt"
          className="block text-sm font-medium leading-6 text-gray-900"
        >
          Profile Prompt
        </label>
        <div className="mt-2">
          <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md">
            <FullscreenTextarea
              name="profile-prompt"
              id="profile-prompt"
              value={localSettings.profilePrompt ?? ""}
              onChange={(event) => {
                setLocalSettings((settings) => ({
                  ...settings,
                  profilePrompt: event.target.value,
                }));
              }}
              placeholder="My name is Bot."
            />
          </div>
        </div>
      </div>

      {/* Bot Human Prompt */}
      <div className="sm:col-span-4">
        <label
          htmlFor="human-prompt"
          className="block text-sm font-medium leading-6 text-gray-900"
        >
          Human Profile Prompt
        </label>
        <div className="mt-2">
          <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md">
            <FullscreenTextarea
              name="human-prompt"
              id="human-prompt"
              value={localSettings.humanPrompt ?? ""}
              onChange={(event) => {
                setLocalSettings((settings) => ({
                  ...settings,
                  humanPrompt: event.target.value,
                }));
              }}
              placeholder="I am a human."
            />
          </div>
        </div>
      </div>
    </>
  );
};

const handleFormSave = (oldState: BotSettings, formData: FormData) => {
  const id = formData.get("selected-bot") as string;
  const name = formData.get("name") as string;
  const systemPrompt = formData.get("system-prompt") as string;
  const profilePrompt = formData.get("profile-prompt") as string;
  const humanPrompt = formData.get("human-prompt") as string;

  const newState: BotSettings = {
    id,
    name,
    systemPrompt,
    profilePrompt,
    humanPrompt,
  };

  updateBot(id, newState);

  return Promise.resolve(newState);
};

const handleFormCreate = (oldState: BotSettings, formData: FormData) => {
  const name = formData.get("name") as string;
  const systemPrompt = formData.get("system-prompt") as string;
  const profilePrompt = formData.get("profile-prompt") as string;
  const humanPrompt = formData.get("human-prompt") as string;

  const id = name.toLowerCase();

  const newState: BotSettings = {
    ...oldState,
    id,
    name,
    systemPrompt,
    profilePrompt,
    humanPrompt,
  };

  createBot(newState);

  BOT_SETTINGS.selectedId = id;
  return Promise.resolve(newState);
};

export default function BotsSettings({ params }: { params: { slug: string } }) {
  const router = useRouter();
  const botState = useSnapshot(BOT_SETTINGS);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleDelete = useCallback(() => {
    if (botState.selectedId !== undefined) {
      deleteBot(botState.selectedId);
    }
  }, [botState]);

  const handleClone = useCallback(() => {
    if (botState.selectedId !== undefined) {
      cloneBot(botState.selectedId);
    }
  }, [botState]);

  const [, saveFormAction] = useFormState<BotSettings, FormData>(
    handleFormSave,
    botState.selectedBot ?? { id: "", name: "" },
  );

  const [, createFormAction] = useFormState<BotSettings, FormData>(
    handleFormCreate,
    { id: "", name: "" },
  );

  const isNewPage = params?.slug?.[0]?.startsWith("new") ?? false;

  /*
   * TODOs:
   *  * Add delete confirm modal
   *  * Add save and reset buttons
   *  * Add all the settings that are needed
   *    * System
   *    * Profile
   *    * Human
   */

  if (!isClient) {
    return null;
  }

  if (isNewPage) {
    return (
      <main className="px-4 pb-4">
        <form id="settings" action={createFormAction}>
          <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
            <div className="sm:col-span-4">
              <div className="mt-2 flex space-x-2">
                <button
                  type="submit"
                  className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-400"
                  onClick={() => router.replace("/chat/settings/bots")}
                >
                  Create
                </button>
              </div>
            </div>
            <Settings botSettings={{ id: "", name: "" }} />
          </div>
        </form>
      </main>
    );
  }

  return (
    <main className="px-4 pb-4">
      <form id="settings" action={saveFormAction}>
        <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
          {botState.selectedBot ? (
            <>
              <div className="sm:col-span-4">
                <label
                  htmlFor="select-bot"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Select Bot
                </label>
                <div className="mt-2">
                  <BotSelect />
                </div>
                <div className="mt-2 flex space-x-2">
                  <button
                    type="button"
                    className="rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-400"
                    onClick={handleDelete}
                  >
                    Delete
                  </button>
                  <button
                    type="button"
                    className="rounded-md bg-green-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-green-400"
                    onClick={handleClone}
                  >
                    Clone
                  </button>
                  <button
                    type="submit"
                    className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-400"
                  >
                    Save
                  </button>
                </div>
              </div>
              <Settings
                key={botState.selectedBot.id}
                botSettings={botState.selectedBot}
              />
            </>
          ) : (
            <div className="sm:col-span-4">
              <Link
                href="/chat/settings/bots/new"
                className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-400"
              >
                Create Bot
              </Link>
            </div>
          )}
        </div>
      </form>
    </main>
  );
}
