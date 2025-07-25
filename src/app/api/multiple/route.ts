import { generateObject, generateText, jsonSchema, tool } from "ai";
import { MultipleRequestBody } from "../type";
import { openai } from "@ai-sdk/openai";
import { Tool } from '@/store/types';
import z from "zod";
import { createApiResponse } from '@/utils/tools';

export async function POST(req: Request) {
  const { messages, apikey, system_message, tools, model, expected_response }: MultipleRequestBody = await req.json();
  let similarityResult = null;
  let responseResult = "";
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
  try {
    const { text } = await generateText({
      model: openai(model),
      system: system_message,
      messages,
      tools: tools_json
    });
    responseResult = text;
  } catch (error) {
    return createApiResponse(null, error);
  }
  try {
    const result = await generateObject<{
      reason: string;
      similarity: number;
    }>({
      model: openai('gpt-4.1-mini'),
      system: '你是一个专业的相似度分析专家，请结合原文和期望结果，给出客观性而非主观性的相似度分数和原因，如果偏差非常大，甚至可以给出0分',
      prompt: `原文：${responseResult}\n期望结果：${expected_response}`,
      schema: z.object({
        reason: z.string().describe('用简短描述告诉我为什么要给出这个相似度的原因'),
        similarity: z.number().describe('原文与期望结果的相似度,分数在0-100之间'),
      }),
    });
    similarityResult = result.object;
  } catch (error) {
      return createApiResponse(null, error);
  }
  return createApiResponse({
    response: responseResult,
    reason: similarityResult?.reason,
    similarity: similarityResult?.similarity,
  });
}