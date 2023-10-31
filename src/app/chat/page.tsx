"use client";

import { useRef, useState } from "react";

import { Messages } from "~/components/chat/messages";
import { Header, HeaderName, SettingsButton } from "~/components/chat/header";
import { Input } from "~/components/chat/input";
import { Placeholder } from "~/components/placeholder";
import { MessageType } from "~/components/chat/types";

import { simple } from "./simple";
import { messagesAtom, loadingResultAtom } from "./state";
import { useAtom, useSetAtom } from "jotai";

export default function Chat() {
  const [showSettings, setShowSettings] = useState<boolean>(false);
  const [messages, setMessages] = useAtom(messagesAtom);
  const setLoadingResult = useSetAtom(loadingResultAtom);

  const messagesContainerRef = useRef<HTMLDivElement>(null);

  const handleMessageSubmit = async (value: string) => {
    value = value.trim();
    if (value) {
      setMessages((messages) => [
        ...messages,
        { type: MessageType.USER_MESSAGE, text: value },
      ]);

      setLoadingResult(true);
      const history = messages.map((message) => message.text);
      const res = await simple(value, history);
      setMessages((messages) => [
        ...messages,
        { type: MessageType.BOT_MESSAGE, text: res, showTyping: true },
      ]);
      setLoadingResult(false);
    }
  };

  const handleSettingsClick = () => {
    setShowSettings(!showSettings);
  };

  return (
    <div className="mx-auto flex w-full max-w-7xl items-start gap-x-8 px-4 py-10 pt-0 sm:px-6 lg:px-8">
      <main className="flex-1">
        <div className="p:2 flex h-[calc(100vh-6rem)] flex-1 flex-col justify-between">
          <Header>
            <HeaderName>Bot</HeaderName>
            <SettingsButton onClick={handleSettingsClick} />
          </Header>
          <div
            className="flex flex-1 flex-col-reverse overflow-y-auto"
            ref={messagesContainerRef}
          >
            <Messages messages={messages} />
          </div>
          <Input onMessageSubmit={handleMessageSubmit} />
        </div>
      </main>
      {showSettings && (
        <aside className="sticky top-8 hidden w-96 shrink-0 xl:block">
          <Placeholder />
        </aside>
      )}
    </div>
  );
}
