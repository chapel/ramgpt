import { ChatOpenAI } from 'langchain/chat_models/openai'
import { StringOutputParser } from 'langchain/schema/output_parser'
import { PromptTemplate } from 'langchain/prompts'

import { env } from '../../env.mjs'

const TEMPLATE = `
  You are a helpful bot that helps people with their problems.
    
  Current conversation:
  {chat_history}
  
  User: {input}
  AI:
`;

export async function simple(userPrompt: string, history: string[]) {
  history ??= [];

  const prompt = PromptTemplate.fromTemplate(TEMPLATE);

  const model = new ChatOpenAI({
    temperature: 0.8,
    openAIApiKey: env.NEXT_PUBLIC_OPENAI_API_KEY,
  });

  const outputParser = new StringOutputParser();

  const chain = prompt.pipe(model).pipe(outputParser);

  return chain.invoke({
    chat_history: history.join('\n'),
    input: userPrompt
  });
}