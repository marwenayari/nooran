import { WatsonXAI } from "@ibm-cloud/watsonx-ai";
import { IamAuthenticator } from "ibm-cloud-sdk-core";
import { systemPrompt } from "./systemPrompt";

export function createWatsonxAIService() {
  return WatsonXAI.newInstance({
    version: "2024-05-31",
    serviceUrl: "https://eu-de.ml.cloud.ibm.com",
    authenticator: new IamAuthenticator({
      apikey: process.env.WATSONX_AI_APIKEY || "",
    }),
  });
}

export const loadStory = async (words: string[], subject: string) => {
  const watsonxAIService = createWatsonxAIService();

  const textGenRequestParametersModel = {
    decoding_method: "greedy",
    max_new_tokens: 900,
    min_new_tokens: 0,
    stop_sequences: [],
    repetition_penalty: 1,
    temperature: 0.3,
  };
  const inputText = ` الكلمات: ${words.join(", ")}
    الموضوع: ${subject}`;
  const params = {
    input: `<<SYS>>${systemPrompt}<<SYS>>[INST]${inputText}[/INST]`,
    modelId: "sdaia/allam-1-13b-instruct",
    projectId: process.env.WATSONX_PROJECT_ID,
    parameters: textGenRequestParametersModel,
  };

  try {
    console.log("Generating text...");
    const response = await watsonxAIService.generateText(params);
    return response.result.results[0].generated_text;
  } catch (error) {
    console.error("Error generating text:", error);
    throw error;
  }
};
