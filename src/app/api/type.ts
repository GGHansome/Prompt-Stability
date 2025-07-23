import { Tool } from "@/store/types";
import { Message } from "ai";

export interface ChatRequestBody {
  messages: Message[];
  apikey: string;
  systemMessage: string;
  tools: Tool[];
  model: string;
}