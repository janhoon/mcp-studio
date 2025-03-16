import { streamText } from 'ai';
import { createOpenAI} from "@ai-sdk/openai"
import { createAnthropic} from "@ai-sdk/anthropic"
import type { Message } from '@/types';

interface ChatRequest {
  messages: Message[];
  apiKey: string;
  provider: string;
}

export const maxDuration = 30;

export async function POST(req: Request) {
  const { messages, apiKey, provider } = (await req.json()) as ChatRequest;

  if (!apiKey) {
    return new Response('API key is required', { status: 400 });
  }

  if (!provider) {
    return new Response('Provider is required', { status: 400 });
  }

  try {
    switch (provider) {
      case 'openai': {
        const openai = createOpenAI({ apiKey });

        const result = streamText({
          model: openai('gpt-3.5-turbo'),
          messages,
        });

        return result.toDataStreamResponse({
            getErrorMessage: errorHandler,
        });
      }

      case 'anthropic': {
        const anthropic = createAnthropic({ apiKey });
        const result = streamText({
          model: anthropic('claude-3-5-sonnet-latest'),
          messages,
          maxRetries: 3
        });

        return result.toDataStreamResponse({
            getErrorMessage: errorHandler,
        });
      }

      default:
        return new Response(`Unsupported provider: ${provider}`, { status: 400 });
    }
  } catch (error) {
    console.error(error);
    const message = error instanceof Error ? error.message : 'Error processing request';
    return new Response(message, { status: 500 });
  }
} 

export function errorHandler(error: unknown) {
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
}