import { useAtomValue, useSetAtom } from "jotai";
import { Fragment, useCallback } from "react";

import { Listbox, Transition } from "@headlessui/react";
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/react/24/outline";

import { botListAtom, botSettingsAtom, selectedBotAtom } from "./page";

export const BotSelect = () => {
  const botSettings = useAtomValue(botSettingsAtom);
  const bots = useAtomValue(botListAtom);
  const setSelectedBot = useSetAtom(selectedBotAtom);

  const handleChange = useCallback(
    (value: string) => {
      setSelectedBot(value);
    },
    [setSelectedBot],
  );

  return (
    <Listbox value={botSettings?.id} onChange={handleChange}>
      {({ open }) => (
        <div className="relative max-w-xs">
          <Listbox.Button className="relative w-full cursor-default rounded-md bg-white py-1.5 pl-1.5 pr-10 text-left text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6">
            <span className="block truncate">{botSettings?.name}</span>
            <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
              <ChevronUpDownIcon
                className="h-5 w-5 text-gray-400"
                aria-hidden="true"
              />
            </span>
          </Listbox.Button>
          <Transition
            show={open}
            as={Fragment}
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Listbox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
              {Array.from(bots.values()).map((bot) => (
                <Listbox.Option
                  key={bot.id}
                  value={bot.id}
                  className={({ active }) =>
                    `relative cursor-default select-none py-2 pl-8 pr-4 ${
                      active ? "bg-blue-600 text-white" : "text-gray-900"
                    }`
                  }
                >
                  {({ selected, active }) => (
                    <>
                      <span
                        className={`block truncate ${
                          selected ? "font-semibold" : "font-normal"
                        }`}
                      >
                        {bot.name}
                      </span>
                      {selected ? (
                        <span
                          className={`absolute inset-y-0 left-0 flex items-center pl-1.5 ${
                            active ? "text-white" : "text-blue-600"
                          }`}
                        >
                          <CheckIcon
                            className={`h-5 w-5 ${
                              active ? "text-white" : "text-blue-600"
                            }`}
                            aria-hidden="true"
                          />
                        </span>
                      ) : null}
                    </>
                  )}
                </Listbox.Option>
              ))}
            </Listbox.Options>
          </Transition>
        </div>
      )}
    </Listbox>
  );
};
