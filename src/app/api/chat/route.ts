import { openai } from '@ai-sdk/openai';
import { createIdGenerator, jsonSchema, tool, streamText, createDataStreamResponse } from 'ai';
import { Message } from 'ai';
import { Tool } from '@/store/types';

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;
interface ChatRequestBody {
  messages: Message[];
  apikey: string;
  systemMessage: string;
  tools: Tool[];
  model: string;
}

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
  return createDataStreamResponse({
    execute: (dataStream) => {
      dataStream.writeData('initialized call');
      try {
        const result = streamText({
          model: openai(`${model}`),
          system: systemMessage,
          messages,
          tools: tools_json,
          onFinish: () => {
            dataStream.writeMessageAnnotation({
              model: model,
            });
            dataStream.writeData('call completed');
          },
          experimental_generateMessageId: createIdGenerator({
            prefix: 'server',
            size: 16,
          }),
        });
        result.mergeIntoDataStream(dataStream);
      } catch (error) {
        dataStream.writeData('call completed');
        throw error;
      }
      
    },
    onError: error => {
      if (error == null) {
        return 'unknown error';
      }

      if (typeof error === 'string') {
        return error;
      }

      if (error instanceof Error) {
        // return (error as any).responseBody;
        return JSON.stringify(error);
      }

      return JSON.stringify(error);
    },
  });
}