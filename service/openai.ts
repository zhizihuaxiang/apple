import OpenAI, { ClientOptions } from "openai";

export function getOpenAIClient(model?: string): OpenAI {
  const options: ClientOptions = {
    baseURL: process.env.OPENAI_BASE_URL,
    apiKey: process.env.OPENAI_API_KEY,
  };

  //   if (model) {
  //     if (model.startsWith("rwkv")) {
  //       options.baseURL = process.env.RWKV_BASE_URL;
  //       options.apiKey = process.env.RWKV_API_KEY;
  //     } else if (model.startsWith("step")) {
  //       options.baseURL = process.env.STEPFUN_BASE_URL;
  //       options.apiKey = process.env.STEPFUN_API_KEY;
  //     } else if (model.startsWith("tts-1")) {
  //       options.baseURL = process.env.GPT_BASE_URL;
  //       options.apiKey = process.env.GPT_API_KEY;
  //     }
  //   }

  const openai = new OpenAI(options);
  return openai;
}
