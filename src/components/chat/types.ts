export const enum MessageType {
  BOT_THOUGHT,
  BOT_FUNCTION,
  BOT_MESSAGE,
  USER_MESSAGE,
}

export interface MessageText {
  type: MessageType;
  text: string;
  showTyping?: boolean;
}