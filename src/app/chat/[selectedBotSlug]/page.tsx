"use client";

import { atom, useAtom, useAtomValue, useSetAtom } from "jotai";
import { notFound } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef } from "react";
import { Header, HeaderName, SettingsButton } from "~/components/chat/header";
import { Input } from "~/components/chat/input";
import { Messages } from "~/components/chat/messages";
import { MessageType } from "~/components/chat/types";

import { Settings } from "../settings";
import { botListAtom, botSettingsAtom, selectedBotAtom } from "../settings/bot";
import { globalSettingsAtom } from "../settings/global";
import { simple } from "../simple";
import { loadingResultAtom, messagesAtom } from "../state";

export const showSettingsAtom = atom<boolean>(false);

export default function Chat({
  params,
}: {
  params: { selectedBotSlug: string };
}) {
  const setShowSettings = useSetAtom(showSettingsAtom);
  const [messages, setMessages] = useAtom(messagesAtom);
  const setLoadingResult = useSetAtom(loadingResultAtom);
  const globalSettings = useAtomValue(globalSettingsAtom);
  const botSettings = useAtomValue(botSettingsAtom);
  const bots = useAtomValue(botListAtom);
  const setSelectedBot = useSetAtom(selectedBotAtom);

  const messagesContainerRef = useRef<HTMLDivElement>(null);

  const handleMessageSubmit = useCallback(
    async (value: string) => {
      value = value.trim();
      if (value) {
        setMessages((messages) => [
          ...messages,
          { type: MessageType.USER_MESSAGE, text: value },
        ]);

        setLoadingResult(true);
        const history = messages.map((message) => message.text);
        const res = await simple(value, history, globalSettings.openaiApiKey);
        setMessages((messages) => [
          ...messages,
          { type: MessageType.BOT_MESSAGE, text: res },
        ]);
        setLoadingResult(false);
      }
    },
    [messages, setMessages, setLoadingResult, globalSettings],
  );

  const handleSettingsClick = useCallback(() => {
    setShowSettings((showSettings) => !showSettings);
  }, [setShowSettings]);

  const isValidSelectedBot = useMemo(() => {
    return [...bots.values()].some((bot) => bot.id === params.selectedBotSlug);
  }, [params.selectedBotSlug, bots]);

  useEffect(() => {
    if (isValidSelectedBot) {
      setSelectedBot(params.selectedBotSlug);
    }
  }, [isValidSelectedBot, setSelectedBot, params]);

  if (!isValidSelectedBot) {
    return notFound();
  }

  return (
    <div className="mx-auto flex w-full max-w-7xl items-start gap-x-8 px-4 py-0 sm:px-6 lg:px-8">
      <main className="flex-1">
        <div className="p:2 flex h-screen flex-1 flex-col justify-between pb-4">
          <Header>
            <HeaderName>{botSettings?.name}</HeaderName>
            <SettingsButton onClick={handleSettingsClick} />
          </Header>
          <div
            className="max-w-screen flex flex-1 flex-col-reverse overflow-y-auto"
            ref={messagesContainerRef}
          >
            <Messages messages={messages} />
          </div>
          <Input onMessageSubmit={handleMessageSubmit} />
        </div>
      </main>
      <Settings />
    </div>
  );
}
