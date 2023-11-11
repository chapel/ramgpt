"use client";

import { useAtom, useSetAtom } from "jotai";
import { notFound } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef } from "react";
import { useSnapshot } from "valtio";
import { Input } from "~/components/chat/input";
import { Messages } from "~/components/chat/messages";
import { MessageType } from "~/components/chat/types";

import { BOT_SETTINGS } from "../../settings/bots/[[...slug]]/bot-state";
import { OPENAI_SETTINGS } from "../../settings/openai/openai-state";
import { simple } from "../../simple";
import { loadingResultAtom, messagesAtom } from "../../state";

export default function Chat({
  params,
}: {
  params: { selectedBotSlug: string };
}) {
  const [messages, setMessages] = useAtom(messagesAtom);
  const setLoadingResult = useSetAtom(loadingResultAtom);
  const botState = useSnapshot(BOT_SETTINGS);
  const openaiState = useSnapshot(OPENAI_SETTINGS);

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
        const res = await simple(
          value,
          history,
          openaiState.apiKey,
          openaiState.model,
        );
        setMessages((messages) => [
          ...messages,
          { type: MessageType.BOT_MESSAGE, text: res },
        ]);
        setLoadingResult(false);
      }
    },
    [messages, setMessages, setLoadingResult, openaiState],
  );

  const isValidSelectedBot = useMemo(() => {
    return [...botState.map.values()].some(
      (bot) => bot.id === params.selectedBotSlug,
    );
  }, [params.selectedBotSlug, botState]);

  useEffect(() => {
    if (isValidSelectedBot) {
      BOT_SETTINGS.selectedId = params.selectedBotSlug;
    }
  }, [isValidSelectedBot, params]);

  if (!isValidSelectedBot) {
    return notFound();
  }

  return (
    <main className="h-full">
      <div className="h-full py-10 lg:py-6">
        <div className="h-full flex-1">
          <div className="p:2 flex h-full flex-1 flex-col justify-between">
            <div
              className="max-w-screen flex flex-1 flex-col-reverse overflow-y-auto"
              ref={messagesContainerRef}
            >
              <Messages messages={messages} />
            </div>
            <Input onMessageSubmit={handleMessageSubmit} />
          </div>
        </div>
      </div>
    </main>
  );
}
