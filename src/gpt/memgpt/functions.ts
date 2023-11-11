import { DynamicStructuredTool } from "langchain/dist/tools/dynamic";
import { z } from "zod";

// send_message({ message: string })
export const sendMessage = new DynamicStructuredTool({
  name: "send_message",
  description: "Sends a message to the human user",
  func: (input: { message: string }) => {
    console.log("send_message", input);
    // TODO figure out how to add this to messages so the user can see
    return Promise.resolve("");
  },
  schema: z
    .object({ message: z.string() })
    .describe(
      "Message contents. All unicode (including emojis) are supported.",
    ),
});

// pause_heartbeats({ minutes: number })

// message_chatgpt({ message: string, request_heartbeat: boolean })

// core_memory_append

// core_memory_replace

// recall_memory_search

// recall_memory_search_date

// conversation_search

// conversation_search_date

// archival_memory_insert

// archival_memory_search
