"use client";

import { useCallback, useRef, useState } from "react";
import { useAtom, useAtomValue, useSetAtom } from "jotai";

import { Messages } from "~/components/chat/messages";
import { Header, HeaderName, SettingsButton } from "~/components/chat/header";
import { Input } from "~/components/chat/input";
import { MessageType } from "~/components/chat/types";

import { simple } from "./simple";
import { messagesAtom, loadingResultAtom } from "./state";
import { Settings, globalSettingsAtom } from "./settings";

export default function Chat() {
  const [showSettings, setShowSettings] = useState<boolean>(false);
  const [messages, setMessages] = useAtom(messagesAtom);
  const setLoadingResult = useSetAtom(loadingResultAtom);
  const globalSettings = useAtomValue(globalSettingsAtom);

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

  const handleSettingsClick = () => {
    setShowSettings(!showSettings);
  };

  return (
    <div className="mx-auto flex w-full max-w-7xl items-start gap-x-8 px-4 py-0 sm:px-6 lg:px-8">
      <main className="flex-1">
        <div className="p:2 flex h-screen flex-1 flex-col justify-between pb-4">
          <Header>
            <HeaderName>Bot</HeaderName>
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
      <Settings show={showSettings} setShow={setShowSettings} />
    </div>
  );
}
