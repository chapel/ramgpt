import { useAtomValue } from "jotai";
import React, { useCallback, useState } from "react";
import { useHotkeys } from "react-hotkeys-hook";
import { loadingResultAtom } from "~/app/chat/state";
import { ExpandableTextArea } from "~/components/expandable-text-area";

const LoadingDots = () => {
  return (
    <>
      <style jsx>{`
        .loading-dot-one {
          animation-delay: 0.1s;
        }
        .loading-dot-two {
          animation-delay: 0.2s;
        }
        .loading-dot-three {
          animation-delay: 0.3s;
        }
      `}</style>
      <div className="flex space-x-2">
        <div className="loading-dot-one h-2 w-2 animate-bounce rounded-full bg-gray-500 p-1"></div>
        <div className="loading-dot-two h-2 w-2 animate-bounce rounded-full bg-gray-500 p-1"></div>
        <div className="loading-dot-three h-2 w-2 animate-bounce rounded-full bg-gray-500 p-1"></div>
      </div>
    </>
  );
};

export const Input = ({
  messageText,
  onMessageSubmit,
}: {
  messageText?: string;
  onMessageSubmit: (value: string) => void;
}) => {
  const loadingResult = useAtomValue(loadingResultAtom);
  const [message, setMessage] = useState<string>(messageText ?? "");

  const handleChange = useCallback(
    (value: string) => {
      setMessage(value);
    },
    [setMessage],
  );

  const handleSubmit = useCallback(() => {
    onMessageSubmit(message);
    setMessage("");
  }, [message, onMessageSubmit, setMessage]);

  const ref = useHotkeys<HTMLTextAreaElement>(
    "shift+enter",
    () => handleSubmit(),
    { enableOnFormTags: ["textarea"], preventDefault: true },
    [handleSubmit],
  );

  return (
    <div className="mb-2 border-t-2 border-gray-200 px-4 pt-4 text-sm sm:mb-0">
      <div className="relative flex space-x-2 rounded-md bg-gray-200 px-3 py-2">
        <ExpandableTextArea
          placeholder="Write your message!"
          className="w-full resize-none rounded-md bg-gray-200 text-gray-600 placeholder-gray-600 focus:placeholder-gray-400 focus:outline-none"
          wrapperClassName="flex flex-1 items-center"
          value={message}
          rows={1}
          maxRows={5}
          ref={ref}
          onValueChange={handleChange}
        ></ExpandableTextArea>
        <div className="flex">
          <button
            disabled={loadingResult}
            type="button"
            className={`inline-flex h-6 w-16 items-center justify-end rounded-lg ${
              message.length > 0 ? "text-blue-600" : "text-gray-400"
            } transition duration-500 ease-in-out focus:outline-none`}
            onClick={handleSubmit}
          >
            {loadingResult ? (
              <LoadingDots />
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                className="h-6 w-6 rotate-90 transform"
              >
                <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z"></path>
              </svg>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
