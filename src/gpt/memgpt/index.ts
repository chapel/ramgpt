import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { AIMessage, FunctionMessage, HumanMessage } from "langchain/schema";
import type { BaseMessageLike } from "langchain/schema";
import { MemoryVectorStore } from "langchain/vectorstores/memory";
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

const addBotMessage = (message: string) => {
  addMessage({
    type: MessageType.BOT_MESSAGE,
    text: message,
  });
};

const addBotThought = (thought: string) => {
  addMessage({
    type: MessageType.BOT_THOUGHT,
    text: thought,
  });
};

const addBotFunction = (funcName: string, args: string) => {
  addMessage({
    type: MessageType.BOT_FUNCTION,
    text: `${funcName}(${args})`,
  });
};

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

  inflightHistory: BaseMessageLike[] = [];
  hasCalledSendMessage = false;
  retryLimit = 3;
  retryCount = 0;
  pauseHeartbeatsStart: Date | undefined;
  pauseHeartbeatsMinutes: number | undefined;
  maxPauseHeartbeatsMinutes = 60;
  systemPrompt = "";
  profilePrompt = "";
  humanPrompt = "";

  vectorStore?: MemoryVectorStore;

  constructor(
    model: string,
    temperature: number,
    openaiApiKey: string,
    systemPrompt: string,
    profilePrompt: string,
    humanPrompt: string,
  ) {
    super({
      model,
      temperature,
      aiPrompt: "",
      functions: [],
      openaiApiKey,
    });

    this.setPrompts(systemPrompt, profilePrompt, humanPrompt);

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

    this.setOnIntermediateContent((message) => {
      const content = message.content;
      this.inflightHistory.push(message);
      if (typeof content === "string" && content.length > 0) {
        addBotThought(content);
      }
    });
  }

  setPrompts(
    systemPrompt: string,
    profilePrompt: string,
    humanPrompt: string,
  ): OpenaiFunctional {
    this.systemPrompt = systemPrompt;
    this.profilePrompt = profilePrompt;
    this.humanPrompt = humanPrompt;
    return this.setAiPrompt(
      MemGPT.generateAiPrompt(systemPrompt, profilePrompt, humanPrompt),
    );
  }

  setupVectorStore() {
    this.vectorStore = new MemoryVectorStore(
      new OpenAIEmbeddings({ openAIApiKey: this.openaiApiKey }),
    );
  }

  processUserMessage(input: string) {
    return JSON.stringify({ type: "user_message", message: input });
  }

  async call(input: string): Promise<string> {
    const message = this.processUserMessage(input);
    this.inflightHistory.push(new HumanMessage(message));

    let res: string;

    try {
      res = await super.call(message, this.history.slice());
    } catch (e) {
      console.log(e);
      if (this.retryCount <= this.retryLimit) {
        this.retryCount += 1;
        this.inflightHistory = [];
        return this.call(input);
      }
      return Promise.resolve("");
    }

    if (!this.hasCalledSendMessage) {
      console.log("needs to call send message");
      if (this.retryCount <= this.retryLimit) {
        this.retryCount += 1;
        this.inflightHistory.push(new AIMessage({ content: res }));

        if (res) {
          addBotThought(res);
        }
        return this.call(input);
      }
    }

    this.inflightHistory.push(new AIMessage({ content: res }));

    if (res) {
      addBotThought(res);
    }

    this.history = [...this.history, ...this.inflightHistory];
    this.inflightHistory = [];
    this.retryCount = 0;
    return res;
  }

  respondAndAddHistory(name: string, content = ""): Promise<string> {
    const response = JSON.stringify({ status: "OK", message: content });
    this.inflightHistory.push(
      new FunctionMessage({
        name,
        content: response,
      }),
    );
    return Promise.resolve(response);
  }

  sendMessage: SendMessageFunc = (input) => {
    this.hasCalledSendMessage = true;
    addBotMessage(input.message);
    return this.respondAndAddHistory("send_message");
  };

  pauseHeartbeats: PauseHeartbeatsFunc = (input) => {
    this.pauseHeartbeatsStart = new Date();
    this.pauseHeartbeatsMinutes = Math.min(
      input.minutes,
      this.maxPauseHeartbeatsMinutes,
    );
    addBotFunction("pause_heartbeats", JSON.stringify(input));
    return this.respondAndAddHistory(
      "pause_heartbeats",
      `Pausing timed heartbeats for ${this.pauseHeartbeatsMinutes} min`,
    );
  };

  messageChatGPT: MessageChatGPTFunc = (input) => {
    console.log("messageChatGPT", input);
    return this.respondAndAddHistory("message_chat_gpt");
  };

  // TODO - DRY this a little, handle max length for prompts
  coreMemoryAppend: CoreMemoryAppendFunc = ({
    name,
    content,
    request_heartbeat, // TODO - handle this
  }) => {
    if (name === "profile") {
      this.profilePrompt += "\n" + content;
    } else if (name === "human") {
      this.humanPrompt += "\n" + content;
    }
    this.setPrompts(this.systemPrompt, this.profilePrompt, this.humanPrompt);
    addBotFunction(
      "core_memory_append",
      JSON.stringify({ name, content, request_heartbeat }),
    );
    return this.respondAndAddHistory("core_memory_append");
  };

  coreMemoryReplace: CoreMemoryReplaceFunc = ({
    name,
    old_content,
    new_content,
    request_heartbeat, // TODO - handle this
  }) => {
    if (name === "profile") {
      this.profilePrompt.replace(old_content, new_content);
    } else if (name === "human") {
      this.humanPrompt.replace(old_content, new_content);
    }
    this.setPrompts(this.systemPrompt, this.profilePrompt, this.humanPrompt);
    addBotFunction(
      "core_memory_replace",
      JSON.stringify({ name, old_content, new_content, request_heartbeat }),
    );
    return this.respondAndAddHistory("core_memory_resplace");
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

  archivalMemoryInsert: ArchivalMemoryInsertFunc = async (input) => {
    if (!this.vectorStore) {
      this.setupVectorStore();
    }
    await this.vectorStore?.addDocuments([
      { pageContent: input.content, metadata: {} },
    ]);
    addBotFunction("archival_memory_insert", JSON.stringify(input));
    return this.respondAndAddHistory("archival_memory_insert");
  };

  archivalMemorySearch: ArchivalMemorySearchFunc = async (input) => {
    if (!this.vectorStore) {
      this.setupVectorStore();
    }
    const res = await this.vectorStore?.similaritySearch(input.query);
    addBotFunction("archival_memory_search", JSON.stringify(input));
    return this.respondAndAddHistory(
      "archival_memory_search",
      JSON.stringify(res?.map((r) => r.pageContent)),
    );
  };
}
