import { DynamicStructuredTool } from "langchain/tools";
import { z } from "zod";

const REQUEST_HEARTBEAT = z
  .boolean()
  .describe(
    "Request an immediate heartbeat after function execution. Set to 'true' if you want to send a follow-up message or run a follow-up function.",
  );

// send_message({ message: string })
export type SendMessageFunc = (input: { message: string }) => Promise<string>;
export const createSendMessage = (func: SendMessageFunc) =>
  new DynamicStructuredTool({
    name: "send_message",
    description: "Sends a message to the human user",
    func,
    schema: z.object({
      message: z
        .string()
        .describe(
          "Message contents. All unicode (including emojis) are supported.",
        ),
    }),
  });

// pause_heartbeats({ minutes: number })
export type PauseHeartbeatsFunc = (input: {
  minutes: number;
}) => Promise<string>;
export const createPauseHeartbeats = (func: PauseHeartbeatsFunc) =>
  new DynamicStructuredTool({
    name: "pause_heartbeats",
    description:
      "Temporarily ignore timed heartbeats. You may still receive messages from manual heartbeats and other events.",
    func,
    schema: z.object({
      minutes: z
        .number()
        .min(1)
        .max(360)
        .describe(
          "Number of minutes to ignore heartbeats for. Max value of 360 minutes (6 hours).",
        ),
    }),
  });

// message_chatgpt({ message: string, request_heartbeat: boolean })
export type MessageChatGPTFunc = (input: {
  message: string;
  request_heartbeat: boolean;
}) => Promise<string>;
export const createMessageChatGPT = (func: MessageChatGPTFunc) =>
  new DynamicStructuredTool({
    name: "message_chatgpt",
    description:
      "Send a message to a more basic AI, ChatGPT. A useful resource for asking questions. ChatGPT does not retain memory of previous interactions.",
    func,
    schema: z.object({
      message: z
        .string()
        .describe(
          "Message to send ChatGPT. Phrase your message as a full English sentence.",
        ),
      request_heartbeat: REQUEST_HEARTBEAT,
    }),
  });

// core_memory_append({ name: string, content: string, request_heartbeat: boolean })
export type CoreMemoryAppendFunc = (input: {
  name: string;
  content: string;
  request_heartbeat: boolean;
}) => Promise<string>;
export const createCoreMemoryAppend = (func: CoreMemoryAppendFunc) =>
  new DynamicStructuredTool({
    name: "core_memory_append",
    description: "Append to the contents of core memory.",
    func,
    schema: z.object({
      name: z
        .string()
        .describe("Section of the memory to be edited (persona or human)."),
      content: z
        .string()
        .describe(
          "Content to write to the memory. All unicode (including emojis) are supported.",
        ),
      request_heartbeat: REQUEST_HEARTBEAT,
    }),
  });

// core_memory_replace({ name: string, old_content: string, new_content: string, request_heartbeat: boolean })
export type CoreMemoryReplaceFunc = (input: {
  name: string;
  old_content: string;
  new_content: string;
  request_heartbeat: boolean;
}) => Promise<string>;
export const createCoreMemoryReplace = (func: CoreMemoryReplaceFunc) =>
  new DynamicStructuredTool({
    name: "core_memory_replace",
    description: "Replace the contents of core memory.",
    func,
    schema: z.object({
      name: z
        .string()
        .describe("Section of the memory to be edited (persona or human)."),
      old_content: z
        .string()
        .describe("String to replace. Must be an exact match."),
      new_content: z
        .string()
        .describe(
          "Content to write to the memory. All unicode (including emojis) are supported.",
        ),
      request_heartbeat: REQUEST_HEARTBEAT,
    }),
  });

// recall_memory_search({ query: string, page: number, request_heartbeat: boolean })
export type RecallMemorySearchFunc = (input: {
  query: string;
  page: number;
  request_heartbeat: boolean;
}) => Promise<string>;
export const createRecallMemorySearch = (func: RecallMemorySearchFunc) =>
  new DynamicStructuredTool({
    name: "recall_memory_search",
    description: "Search prior conversation history using a string.",
    func,
    schema: z.object({
      query: z.string().describe("String to search for."),
      page: z
        .number()
        .min(0)
        .default(0)
        .describe(
          "Allows you to page through results. Only use on a follow-up query. Defaults to 0 (first page).",
        ),
      request_heartbeat: REQUEST_HEARTBEAT,
    }),
  });

// recall_memory_search_date({ start_date: string, end_date: string, page: number, request_heartbeat: boolean })
export type RecallMemorySearchDateFunc = (input: {
  start_date: string;
  end_date: string;
  page: number;
  request_heartbeat: boolean;
}) => Promise<string>;
export const createRecallMemorySearchDate = (
  func: RecallMemorySearchDateFunc,
) =>
  new DynamicStructuredTool({
    name: "recall_memory_search_date",
    description: "Search prior conversation history using a date range.",
    func,
    schema: z.object({
      start_date: z
        .string()
        .describe(
          "The start of the date range to search, in the format 'YYYY-MM-DD'.",
        ),
      end_date: z
        .string()
        .describe(
          "The end of the date range to search, in the format 'YYYY-MM-DD'.",
        ),
      page: z
        .number()
        .min(0)
        .default(0)
        .describe(
          "Allows you to page through results. Only use on a follow-up query. Defaults to 0 (first page).",
        ),
      request_heartbeat: REQUEST_HEARTBEAT,
    }),
  });

// conversation_search({ query: string, page: number, request_heartbeat: boolean })
export type ConversationSearchFunc = (input: {
  query: string;
  page: number;
  request_heartbeat: boolean;
}) => Promise<string>;
export const createConversationSearch = (func: ConversationSearchFunc) =>
  new DynamicStructuredTool({
    name: "conversation_search",
    description:
      "Search prior conversation history using case-insensitive string matching.",
    func,
    schema: z.object({
      query: z.string().describe("String to search for."),
      page: z
        .number()
        .min(0)
        .default(0)
        .describe(
          "Allows you to page through results. Only use on a follow-up query. Defaults to 0 (first page).",
        ),
      request_heartbeat: REQUEST_HEARTBEAT,
    }),
  });

// conversation_search_date({ start_date: string, end_date: string, page: number, request_heartbeat: boolean })
export type ConversationSearchDateFunc = (input: {
  start_date: string;
  end_date: string;
  page: number;
  request_heartbeat: boolean;
}) => Promise<string>;
export const createConversationSearchDate = (
  func: ConversationSearchDateFunc,
) =>
  new DynamicStructuredTool({
    name: "conversation_search_date",
    description: "Search prior conversation history using a date range.",
    func,
    schema: z.object({
      start_date: z
        .string()
        .describe(
          "The start of the date range to search, in the format 'YYYY-MM-DD'.",
        ),
      end_date: z
        .string()
        .describe(
          "The end of the date range to search, in the format 'YYYY-MM-DD'.",
        ),
      page: z
        .number()
        .min(0)
        .default(0)
        .describe(
          "Allows you to page through results. Only use on a follow-up query. Defaults to 0 (first page).",
        ),
      request_heartbeat: REQUEST_HEARTBEAT,
    }),
  });

// archival_memory_insert({ content: string, request_heartbeat: boolean })
export type ArchivalMemoryInsertFunc = (input: {
  content: string;
  request_heartbeat: boolean;
}) => Promise<string>;
export const createArchivalMemoryInsert = (func: ArchivalMemoryInsertFunc) =>
  new DynamicStructuredTool({
    name: "archival_memory_insert",
    description:
      "Add to archival memory. Make sure to phrase the memory contents such that it can be easily queried later.",
    func,
    schema: z.object({
      content: z
        .string()
        .describe(
          "Content to write to the memory. All unicode (including emojis) are supported.",
        ),
      request_heartbeat: REQUEST_HEARTBEAT,
    }),
  });

// archival_memory_search({ query: string, page: number, request_heartbeat: boolean })
export type ArchivalMemorySearchFunc = (input: {
  query: string;
  page: number;
  request_heartbeat: boolean;
}) => Promise<string>;
export const createArchivalMemorySearch = (func: ArchivalMemorySearchFunc) =>
  new DynamicStructuredTool({
    name: "archival_memory_search",
    description:
      "Search archival memory using semantic (embedding-based) search.",
    func,
    schema: z.object({
      query: z.string().describe("String to search for."),
      page: z
        .number()
        .min(0)
        .default(0)
        .describe(
          "Allows you to page through results. Only use on a follow-up query. Defaults to 0 (first page).",
        ),
      request_heartbeat: REQUEST_HEARTBEAT,
    }),
  });
