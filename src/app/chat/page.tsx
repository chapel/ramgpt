"use client";

import { useRef, useState } from "react";

import { Messages } from "~/components/chat/messages";
import { Header, HeaderName, SettingsButton } from "~/components/chat/header";
import { Input } from "~/components/chat/input";
import { Placeholder } from "~/components/placeholder";

import { type MessageText, MessageType } from "../../components/chat/types";

export default function Chat() {
  const [showSettings, setShowSettings] = useState<boolean>(false);
  const [messages, setMessages] = useState<MessageText[]>([
    { type: MessageType.BOT_THOUGHT, text: "This is a bot thought!" },
    {
      type: MessageType.BOT_FUNCTION,
      text: "This is a bot function!",
    },
    { type: MessageType.BOT_MESSAGE, text: "This is a bot message!" },
  ]);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const handleMessageSubmit = (value: string) => {
    value = value.trim();
    if (value) {
      setMessages([
        ...messages,
        { type: MessageType.USER_MESSAGE, text: value },
      ]);
    }

    setTimeout(() => {
      if (messagesEndRef.current && messagesContainerRef.current) {
        messagesContainerRef.current.scroll({
          top: messagesEndRef.current.offsetTop,
          behavior: "smooth",
        });
      }
    }, 1);
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
            className="flex flex-1 overflow-y-auto"
            ref={messagesContainerRef}
          >
            <Messages messages={messages} ref={messagesEndRef} />
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
