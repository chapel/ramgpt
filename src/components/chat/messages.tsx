import React from "react";
import { TypeAnimation } from "react-type-animation";
import { MessageType } from "~/components/chat/types";
import type { MessageText } from "~/components/chat/types";
import type { Props } from "~/components/types";

// TODO: Fix this to handle history properly
// (i.e. don't show typing animation)
export const BotMessage = ({ icon, children }: Props & { icon: string }) => {
  return (
    <div className="flex items-end">
      <div className="order-2 mx-2 flex max-w-xl flex-col items-start space-y-2">
        {React.Children.map(children, (child: React.ReactNode) => {
          return (
            <div>
              <span className="inline-block whitespace-pre-wrap break-words rounded-lg rounded-bl-none bg-gray-300 px-4 py-2 text-gray-600">
                {
                  <TypeAnimation
                    cursor={false}
                    sequence={[
                      child as string,
                      (el) =>
                        el?.classList.remove("custom-type-animation-cursor"),
                    ]}
                    splitter={(text) => text.split(/(?= |\n)/)}
                    className="custom-type-animation-cursor whitespace-pre-wrap"
                    speed={10}
                  />
                }
              </span>
            </div>
          );
        })}
      </div>
      <div className="order-1 h-6 w-6">{icon}</div>
    </div>
  );
};

export const UserMessage = ({ children }: Props) => {
  return (
    <div className="flex items-end justify-end">
      <div className="order-1 mx-2 flex max-w-xl flex-col items-end space-y-2">
        {React.Children.map(children, (child: React.ReactNode) => {
          return (
            <div>
              <span className="inline-block whitespace-pre-wrap break-words rounded-lg bg-blue-600 px-4 py-2 text-white">
                {child}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export const Message = ({ message }: { message: MessageText }) => {
  switch (message.type) {
    case MessageType.BOT_THOUGHT:
      return <BotMessage icon="💭">{message.text}</BotMessage>;
    case MessageType.BOT_FUNCTION:
      return <BotMessage icon="⚡">{message.text}</BotMessage>;
    case MessageType.BOT_MESSAGE:
      return <BotMessage icon="🤖">{message.text}</BotMessage>;
    case MessageType.USER_MESSAGE:
      return <UserMessage>{message.text}</UserMessage>;
  }
};

interface MessagesProps {
  messages: readonly MessageText[];
}

export const Messages = ({ messages }: MessagesProps) => {
  return (
    <div className="mt-auto flex flex-1 flex-col justify-end space-y-4 p-3 text-sm">
      {messages.map((message: MessageText, idx: number) => {
        return <Message message={message} key={idx} />;
      })}
    </div>
  );
};
