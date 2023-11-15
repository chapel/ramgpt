import { AIMessage, FunctionMessage, HumanMessage } from "langchain/schema";
import type { BaseMessageLike } from "langchain/schema";
import { addMessage } from "~/app/chat/bot/[selectedBotSlug]/memgpt";
import { MessageType } from "~/components/chat/types";

import { OpenaiFunctional } from "../openai-functional";
import {
  createArchivalMemoryInsert,
  createArchivalMemorySearch,
  createConversationSearch,
  createConversationSearchDate,
  createCoreMemoryAppend,
  createCoreMemoryReplace,
  createMessageChatGPT,
  createPauseHeartbeats,
  createRecallMemorySearch,
  createRecallMemorySearchDate,
  createSendMessage,
} from "./functions";
import type {
  ArchivalMemoryInsertFunc,
  ArchivalMemorySearchFunc,
  ConversationSearchDateFunc,
  ConversationSearchFunc,
  CoreMemoryAppendFunc,
  CoreMemoryReplaceFunc,
  MessageChatGPTFunc,
  PauseHeartbeatsFunc,
  RecallMemorySearchDateFunc,
  RecallMemorySearchFunc,
  SendMessageFunc,
} from "./functions";

export class MemGPT extends OpenaiFunctional {
  static generateAiPrompt(
    systemPrompt: string,
    profilePrompt: string,
    humanPrompt: string,
  ) {
    return [
      systemPrompt,
      "Core memory shown below (limited in size, additional information stored in archival / recall memory):",
      "<persona>",
      profilePrompt,
      "</persona>",
      "<human>",
      humanPrompt,
      "</human>",
    ].join("\n");
  }

  history: BaseMessageLike[] = [
    new AIMessage({
      content:
        "Bootup sequence complete. Persona activated. Testing messaging functionality.",
      additional_kwargs: {
        function_call: {
          name: "send_message",
          arguments: JSON.stringify({
            message: "More human than human is our motto.",
          }),
        },
      },
    }),
    new FunctionMessage({
      name: "send_message",
      content: JSON.stringify({ status: "OK", message: "" }),
    }),
    new HumanMessage(
      JSON.stringify({ type: "login", last_login: "Never (first login)" }),
    ),
  ];

  constructor(
    model: string,
    temperature: number,
    aiPrompt: string,
    openaiApiKey: string,
  ) {
    super({
      model,
      temperature,
      aiPrompt,
      functions: [],
      openaiApiKey,
    });

    this.setFunctions([
      createSendMessage(this.sendMessage),
      createPauseHeartbeats(this.pauseHeartbeats),
      createMessageChatGPT(this.messageChatGPT),
      createCoreMemoryAppend(this.coreMemoryAppend),
      createCoreMemoryReplace(this.coreMemoryReplace),
      createRecallMemorySearch(this.recallMemorySearch),
      createRecallMemorySearchDate(this.recallMemorySearchDate),
      createConversationSearch(this.conversationSearch),
      createConversationSearchDate(this.conversationSearchDate),
      createArchivalMemoryInsert(this.archivalMemoryInsert),
      createArchivalMemorySearch(this.archivalMemorySearch),
    ]);

    this.setOnIntermediateContent((content) => {
      if (content && typeof content === "string") {
        console.log("set intermediate thought");
        addMessage({
          type: MessageType.BOT_THOUGHT,
          text: content,
        });
      }
    });
  }

  processUserMessage(input: string) {
    return JSON.stringify({ type: "user_message", message: input });
  }

  async call(input: string): Promise<string> {
    const message = this.processUserMessage(input);
    const res = await super.call(message, this.history.slice());
    this.history.push(new HumanMessage(message));
    this.history.push(new AIMessage({ content: res }));
    if (res) {
      console.log("set return thought", res);
      addMessage({
        type: MessageType.BOT_THOUGHT,
        text: res,
      });
    }
    return res;
  }

  sendMessage: SendMessageFunc = (input) => {
    console.log("set message");
    addMessage({
      type: MessageType.BOT_MESSAGE,
      text: input.message,
    });
    this.history.push(
      new AIMessage({
        content: "",
        additional_kwargs: {
          function_call: {
            name: "send_message",
            arguments: JSON.stringify({ message: input.message }),
          },
        },
      }),
    );
    const response = JSON.stringify({ status: "OK", message: "" });
    this.history.push(
      new FunctionMessage({
        name: "send_message",
        content: response,
      }),
    );
    return Promise.resolve(response);
  };

  pauseHeartbeats: PauseHeartbeatsFunc = (input) => {
    console.log("pauseHeartbeats", input);
    return Promise.resolve("");
  };

  messageChatGPT: MessageChatGPTFunc = (input) => {
    console.log("messageChatGPT", input);
    return Promise.resolve("");
  };

  coreMemoryAppend: CoreMemoryAppendFunc = (input) => {
    console.log("coreMemoryAppend", input);
    return Promise.resolve("");
  };

  coreMemoryReplace: CoreMemoryReplaceFunc = (input) => {
    console.log("coreMemoryReplace", input);
    return Promise.resolve("");
  };

  recallMemorySearch: RecallMemorySearchFunc = (input) => {
    console.log("recallMemorySearch", input);
    return Promise.resolve("");
  };

  recallMemorySearchDate: RecallMemorySearchDateFunc = (input) => {
    console.log("recallMemorySearchDate", input);
    return Promise.resolve("");
  };

  conversationSearch: ConversationSearchFunc = (input) => {
    console.log("conversationSearch", input);
    return Promise.resolve("");
  };

  conversationSearchDate: ConversationSearchDateFunc = (input) => {
    console.log("conversationSearchDate", input);
    return Promise.resolve("");
  };

  archivalMemoryInsert: ArchivalMemoryInsertFunc = (input) => {
    console.log("archivalMemoryInsert", input);
    return Promise.resolve("");
  };

  archivalMemorySearch: ArchivalMemorySearchFunc = (input) => {
    console.log("archivalMemorySearch", input);
    return Promise.resolve("");
  };
}
