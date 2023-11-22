import type { Actions, RequestEvent } from "./$types";
import { OpenAI,type ClientOptions } from 'openai'
import { OPENAI_API_KEY } from '$env/static/private';

export const prerender = false;

type PickedValueOf<T, K extends keyof T> =  Required<Pick<T, K>>[keyof Pick<T, K>]

const configuration = {
  apiKey: OPENAI_API_KEY
} satisfies ClientOptions

const getOpenAI = () => new OpenAI(configuration)

export const actions = {
  send: async (event: RequestEvent) => {
    try {
      console.trace('POST start');

      const data = await event.request.formData();
      const file = data.get("voice");

      if (file == null) {
        return { message: `invalid argument ${file}'` };
      }
      
      const openAI = getOpenAI()

      // Chat Completion
      type ChatCompletionParamOf<T extends keyof OpenAI.ChatCompletionCreateParams> = PickedValueOf<OpenAI.ChatCompletionCreateParams, T>
      const chatModel = 'gpt-4-1106-preview' satisfies ChatCompletionParamOf<'model'>

      // whisper
      type WhisperParamOf<T extends keyof OpenAI.Audio.Transcriptions.TranscriptionCreateParams> = PickedValueOf<OpenAI.Audio.Transcriptions.TranscriptionCreateParams, T>
      const whisperModel = 'whisper-1' satisfies WhisperParamOf<'model'>
      const whisperLanguage = 'ja' satisfies WhisperParamOf<'language'>
      
      // OpenAI API で音声を text に変換
      const transcriptions = await openAI.audio.transcriptions.create({
        model: whisperModel,
        file: new File([file], 'file.ogg', { type: 'audio/ogg; codecs=opus' }),
        language: whisperLanguage
      })

      return { message: transcriptions.text }
    } catch (e) {
      console.error(e);

      return { message: `${e}` }
    }
  }
} satisfies Actions;
