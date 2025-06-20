import { openai } from '@ai-sdk/openai';
import { createIdGenerator, smoothStream, streamText } from 'ai';

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
  // console.log(req.json());
  const { messages, apikey, systemMessage } = await req.json();
  console.log("systemMessage", systemMessage);
  const result = streamText({
    model: openai('gpt-4o-mini'),
    system: systemMessage,
    messages,
    experimental_generateMessageId: createIdGenerator({
      prefix: 'server',
      size: 16,
    }),
  });

  return result.toDataStreamResponse({
    getErrorMessage: error => {
      if (error == null) {
        return 'unknown error';
      }

      if (typeof error === 'string') {
        return error;
      }

      if (error instanceof Error) {
        return error.message;
      }

      return JSON.stringify(error);
    },
  });
}