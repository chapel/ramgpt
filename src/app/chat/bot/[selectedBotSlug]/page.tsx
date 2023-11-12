"use client";

import { useSetAtom } from "jotai";
import { notFound } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef } from "react";
import { useSnapshot } from "valtio";
import { Input } from "~/components/chat/input";
import { Messages } from "~/components/chat/messages";
import { MessageType } from "~/components/chat/types";

import { BOT_SETTINGS } from "../../settings/bots/[[...slug]]/bot-state";
import { loadingResultAtom } from "../../state";
import { CHAT_HISTORY, addMessage, memGPT } from "./memgpt";

export default function Chat({
  params,
}: {
  params: { selectedBotSlug: string };
}) {
  const setLoadingResult = useSetAtom(loadingResultAtom);
  const botState = useSnapshot(BOT_SETTINGS);
  const chatHistory = useSnapshot(CHAT_HISTORY);

  const messagesContainerRef = useRef<HTMLDivElement>(null);

  const handleMessageSubmit = useCallback(
    async (value: string) => {
      value = value.trim();
      if (value) {
        addMessage({ type: MessageType.USER_MESSAGE, text: value });

        setLoadingResult(true);
        await memGPT.call(value);
        setLoadingResult(false);
      }
    },
    [setLoadingResult],
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
              <Messages messages={chatHistory.messages} />
            </div>
            <Input onMessageSubmit={handleMessageSubmit} />
          </div>
        </div>
      </div>
    </main>
  );
}
