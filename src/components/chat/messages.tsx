import React, { forwardRef } from "react";

import { type Props } from "~/components/types";
import { type MessageText, MessageType } from "~/components/chat/types";
import { TypeAnimation } from "react-type-animation";

const MultiLineText = ({ text }: { text: string }) => {
  return (
    <>
      {text.split("\n").map((line: string, idx: number) => {
        return (
          <div key={idx}>
            {line}
            <br />
          </div>
        );
      })}
    </>
  );
};

export const BotMessage = ({
  icon,
  children,
  showTyping,
}: Props & { icon: string; showTyping?: boolean }) => {
  return (
    <div className="flex items-end">
      <div className="order-2 mx-2 flex max-w-xl flex-col items-start space-y-2">
        {React.Children.map(children, (child: React.ReactNode) => {
          return (
            <div>
              <span className="inline-block rounded-lg rounded-bl-none bg-gray-300 px-4 py-2 text-gray-600">
                {showTyping ? (
                  <TypeAnimation
                    cursor={false}
                    sequence={[
                      child as string,
                      (el) =>
                        el?.classList.remove("custom-type-animation-cursor"),
                    ]}
                    splitter={(text) => text.split(/(?= |\n)/)}
                    className="custom-type-animation-cursor whitespace-pre-line"
                    speed={10}
                  />
                ) : (
                  <MultiLineText text={child as string} />
                )}
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
              <span className="inline-block rounded-lg bg-blue-600 px-4 py-2 text-white">
                <MultiLineText text={child as string} />
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
      return (
        <BotMessage icon="💭" showTyping={message.showTyping}>
          {message.text}
        </BotMessage>
      );
    case MessageType.BOT_FUNCTION:
      return (
        <BotMessage icon="⚡" showTyping={message.showTyping}>
          {message.text}
        </BotMessage>
      );
    case MessageType.BOT_MESSAGE:
      return (
        <BotMessage icon="🤖" showTyping={message.showTyping}>
          {message.text}
        </BotMessage>
      );
    case MessageType.USER_MESSAGE:
      return <UserMessage>{message.text}</UserMessage>;
  }
};

interface MessagesProps {
  messages: MessageText[];
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
