import { useAtomValue } from "jotai";
import React, { useState } from "react";

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
        <div className="loading-dot-one h-2 w-2 animate-bounce rounded-full bg-white p-1"></div>
        <div className="loading-dot-two h-2 w-2 animate-bounce rounded-full bg-white p-1"></div>
        <div className="loading-dot-three h-2 w-2 animate-bounce rounded-full bg-white p-1"></div>
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
  const [message, setMessage] = useState(messageText ?? "");

  const handleChange = (value: string) => {
    setMessage(value);
  };

  const handleSubmit = () => {
    onMessageSubmit(message);
    setMessage("");
  };

  return (
    <div className="mb-2 border-t-2 border-gray-200 px-4 pt-4 text-sm sm:mb-0">
      <div className="relative flex space-x-2">
        <div className="w-full rounded-md bg-gray-200 p-3">
          <ExpandableTextArea
            placeholder="Write your message!"
            className="w-full resize-none rounded-md bg-gray-200 text-gray-600 placeholder-gray-600 focus:placeholder-gray-400 focus:outline-none"
            value={message}
            rows={1}
            maxRows={5}
            onValueChange={handleChange}
          ></ExpandableTextArea>
        </div>
        <div className="hidden items-center sm:flex">
          <button
            disabled={loadingResult}
            type="button"
            className="inline-flex h-10 w-24 items-center justify-center rounded-lg bg-blue-500 px-4 py-3 text-white transition duration-500 ease-in-out hover:bg-blue-400 focus:outline-none"
            onClick={handleSubmit}
          >
            {loadingResult ? (
              <LoadingDots />
            ) : (
              <>
                <span className="font-bold">Send</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  className="ml-2 h-6 w-6 rotate-90 transform"
                >
                  <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z"></path>
                </svg>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
