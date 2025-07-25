import { generateObject, generateText, jsonSchema, NoObjectGeneratedError, streamObject, tool } from "ai";
import { OptimizeRequestBody } from "../type";
import { openai } from "@ai-sdk/openai";
import { Tool } from '@/store/types';
import z from "zod";
import { createApiResponse } from '@/utils/tools';

export async function POST(req: Request) {
  const { system_message, expected_response, multiple_response_messages }: OptimizeRequestBody = await req.json();
  const result = streamObject({
    model: openai('gpt-4o-mini'),
    prompt: `
    `,
    schema: z.object({
      optimization_suggestions: z.string(),
      optimization_example: z.string(),
    }),
  });
  return result.toTextStreamResponse();
}