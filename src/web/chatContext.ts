import type { ChatApi, Message, ClientMessage } from "@/features/chat/chat";
import { treaty } from "@elysiajs/eden";
import {createContext} from '@lit/context';
export type EdenChat = typeof treaty<ChatApi>;
export const chatApiContext = createContext<any>('chatApi');
