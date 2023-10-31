import { atom } from "jotai";
import { type MessageText } from "~/components/chat/types";

export const messagesAtom = atom<MessageText[]>([]);
export const loadingResultAtom = atom(false);