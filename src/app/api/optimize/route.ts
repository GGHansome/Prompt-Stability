import { streamObject } from "ai";
import { OptimizeRequestBody } from "../type";
import { openai } from "@ai-sdk/openai";
import z from "zod";
import { createApiResponse } from "@/utils/tools";

export const OptimizeSchema = z.object({
  optimization_suggestions: z.string().describe("给出系统提示词的优化建议"),
  optimization_example: z.string().describe("根据优化建议给出的优化后的示例"),
})

export async function POST(req: Request) {
  try {
    const { system_message, expected_response, multiple_response_messages, averageSimilarity, coefficientOfVariation }: OptimizeRequestBody = await req.json();
    const result = streamObject({
      model: openai('gpt-4.1'),
      prompt: `对话的系统提示词:[${system_message}],
      用户期望AI的回复:[${expected_response}],
      与AI多次单轮对话的回复(不高于10条的相似度最低的AI回复,其中包括回复内容、相似度、给出相似度的原因):[${JSON.stringify(multiple_response_messages)}],
      多轮回复中计算的:平均相似度:${averageSimilarity},变异系数:${coefficientOfVariation}
      当变异系数大但平均相似度较高时,尽可能不破坏原有的提示词,以增量的方式优化系统提示词,处理回复中相似度过低的情况以防止再次出现。
      当变异系数小但平均相似度很低时,此时说明提示词与期望回复偏差较大,请重新编辑系统提示词,以响应用户期望AI的回复。
      请根据以上信息,给出优化建议与示例。优化建议里无需给出原因,以列表的方式给出实质性的建议,注意列表换行的输出。
      示例的语种与系统提示词的语种一致。
      `,
      schema: OptimizeSchema,
      onError: (error) => {
        console.error(error)
      }
    });
    return result.toTextStreamResponse();
  } catch (error) {
    return createApiResponse(null, error);
  }
}