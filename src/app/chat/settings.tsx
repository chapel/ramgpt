import React, { Fragment, useCallback, useState } from "react";
import { Transition, Dialog } from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { atom, useAtom } from "jotai";

import { VisualTruncateInput } from "~/components/visual-truncate-input";

interface GlobalSettings {
  openaiApiKey?: string;
}

export const globalSettingsAtom = atom<GlobalSettings>({});

interface Props {
  show: boolean;
  setShow: (value: boolean) => void;
}

export const Settings = ({ show, setShow }: Props) => {
  const [globalSettings, setGlobalSettings] = useAtom(globalSettingsAtom);

  const [openaiApiKey, setOpenaiApiKey] = useState(
    globalSettings.openaiApiKey ?? "",
  );

  const handleSave = useCallback(() => {
    setGlobalSettings((settings) => ({
      ...settings,
      openaiApiKey,
    }));
  }, [setGlobalSettings, openaiApiKey]);

  const handleCancel = useCallback(() => {
    setShow(false);
    setOpenaiApiKey(globalSettings.openaiApiKey ?? "");
  }, [setShow, setOpenaiApiKey, globalSettings]);

  return (
    <Transition.Root show={show} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={() => setShow(false)}>
        <div className="fixed inset-0" />
        <div className="fixed inset-0 overflow-hidden">
          <div className="absolute inset-0 overflow-hidden">
            <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
              <Transition.Child
                as={Fragment}
                enter="transform transition ease-in-out duration-500 sm:duration-700"
                enterFrom="translate-x-full"
                enterTo="translate-x-0"
                leave="transform transition ease-in-out duration-500 sm:duration-700"
                leaveFrom="translate-x-0"
                leaveTo="translate-x-full"
              >
                <Dialog.Panel className="pointer-events-auto w-screen max-w-md">
                  <div className="flex h-full flex-col divide-y divide-gray-200 bg-white shadow-xl">
                    <div className="flex min-h-0 flex-1 flex-col overflow-y-scroll py-6">
                      <div className="px-4 sm:px-6">
                        <div className="flex items-start justify-between">
                          <Dialog.Title className="text-base font-semibold leading-6 text-gray-900">
                            Settings
                          </Dialog.Title>
                          <div className="ml-3 flex h-7 items-center">
                            <button
                              type="button"
                              className="relative rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                              onClick={handleCancel}
                            >
                              <span className="absolute -inset-2.5" />
                              <span className="sr-only">Close panel</span>
                              <XMarkIcon
                                className="h-6 w-6"
                                aria-hidden="true"
                              />
                            </button>
                          </div>
                        </div>
                        <div className="mt-1">
                          <p className="text-sm">
                            Control global and per-bot settings
                          </p>
                        </div>
                      </div>
                      <div className="relative mt-6 flex-1 px-4 sm:px-6">
                        <form className="flex h-full flex-col divide-y divide-gray-200 bg-white">
                          <div className="flex flex-1 flex-col justify-between">
                            <div className="divide-y divide-gray-200">
                              <div className="space-y-6">
                                <div className="border-b border-gray-900/10 pb-8">
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
                                      value={openaiApiKey}
                                      onChange={(e) =>
                                        setOpenaiApiKey(e.target.value)
                                      }
                                      startTrunc={3}
                                      endTrunc={4}
                                      className="block w-full rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
                                    />
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </form>
                      </div>
                    </div>
                    <div className="flex flex-shrink-0 justify-end px-4 py-4">
                      <button
                        type="button"
                        className="rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:ring-gray-400"
                        onClick={handleCancel}
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        onClick={handleSave}
                        className="ml-4 inline-flex justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
                      >
                        Save
                      </button>
                    </div>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
};
