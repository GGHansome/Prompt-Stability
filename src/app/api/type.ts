import { MultipleResponseMessage, Tool } from "@/store/types";
import { Message } from "ai";

// API 统一响应格式
export interface ApiResponse<T = any> {
  status: 'success' | 'error';
  data?: T;
  message?: string;
}
export interface ChatRequestBody {
  messages: Message[];
  apikey: string;
  system_message: string;
  tools: Tool[];
  model: string;
}

export interface MultipleRequestBody extends ChatRequestBody {
  test_number: number;
  expected_response: string;
}

export interface OptimizeRequestBody {
  system_message: string;
  expected_response: string;
  multiple_response_messages: MultipleResponseMessage[];
}

// Multiple API 的响应数据类型
export interface MultipleResponseData {
  response: string;
  reason: string;
  similarity: number;
}

// Multiple API 的完整响应类型
export type MultipleApiResponse = ApiResponse<MultipleResponseData>;

