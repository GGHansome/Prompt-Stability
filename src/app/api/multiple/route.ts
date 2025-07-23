import { generateObject, generateText, jsonSchema, tool } from "ai";
import { ChatRequestBody } from "../type";
import { openai } from "@ai-sdk/openai";
import { Tool } from '@/store/types';
import z from "zod";

export async function POST(req: Request) {
  const { messages, apikey, systemMessage, tools, model }: ChatRequestBody = await req.json();
  let tools_json: Record<string, any> = {}
  tools.forEach((item: Tool) => {
    tools_json[item.name] = tool({
      description: item.description,
      parameters: jsonSchema(item.parameters),
      execute: async (args: any) => {
        return args
      },
    });
  });
  const { text } = await generateText({
    model: openai(model),
    system: systemMessage,
    messages,
    tools: tools_json,
  });

  const result = await generateObject<{
    reason: string;
    similarity: number;
  }>({
    model: openai('gpt-4'),
    system: '你是一个专业的相似度分析专家，请根据原文和期望结果，给出相似度分数和原因',
    prompt: text,
    schema: z.object({
      reason: z.string().describe('为什么要给出这个相似度的原因'),
      similarity: z.number().describe('原文与期望结果的相似度,分数在0-100之间'),
    }),
  });
  
  return new Response(JSON.stringify({
    response: text,
    reason: result.object.reason,
    similarity: result.object.similarity,
  }), {
    headers: {
      'Content-Type': 'application/json',
    },
  });
}