import { OpenAIStream, StreamingTextResponse } from "ai";
import { openAIModel, openai } from "./openai";

export const runtime = "edge";

export async function POST(req: Request) {
  const { messages, model } = await req.json();

  const res = openAIModel.safeParse(model);

  if (!res.success) {
    return new Response(res.error.message);
  }

  const response = await openai.chat.completions.create({
    model: res.data,
    stream: true,
    messages,
  });
  const stream = OpenAIStream(response);
  return new StreamingTextResponse(stream);
}
