import { WatsonXAI } from '@ibm-cloud/watsonx-ai'
import { IamAuthenticator } from 'ibm-cloud-sdk-core'
import { systemPrompt } from '../utils/systemPrompt'

export function createWatsonxAIService() {
  return WatsonXAI.newInstance({
    version: '2024-05-31',
    serviceUrl: 'https://eu-de.ml.cloud.ibm.com',
    authenticator: new IamAuthenticator({
      apikey: process.env.WATSONX_AI_APIKEY || ''
    })
  })
}

export const loadStory = async (words: string[], age: number) => {
  const watsonxAIService = createWatsonxAIService()

  const textGenRequestParametersModel = {
    decoding_method: 'greedy',
    max_new_tokens: 1200,
    min_new_tokens: 0,
    stop_sequences: [],
    repetition_penalty: 1.0,
    temperature: 0.2
  }
  const inputText = ` 
    باستخدام الكلمات التالية، قم باكمال القصة التالية
    كان يامكان، كان هناك 
    الكلمات: ${words.join(', ')}
    العمر: ${age}`

  const params = {
    input: `<<SYS>>${systemPrompt}<<SYS>>[INST]${inputText}[/INST]`,
    modelId: process.env.WATSONX_MODEL_ID ?? 'sdaia/allam-1-13b-instruct',
    projectId: process.env.WATSONX_PROJECT_ID,
    parameters: textGenRequestParametersModel
  }

  try {
    console.log('Generating text...')
    const response = await watsonxAIService.generateText(params)
    console.log(response.result.results[0].generated_text)
    return response.result.results[0].generated_text
  } catch (error) {
    console.error('Error generating text:', error)
    throw error
  }
}
