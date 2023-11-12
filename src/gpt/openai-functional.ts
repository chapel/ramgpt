import { AgentExecutor } from "langchain/agents";
import { OpenAIFunctionsAgentOutputParser } from "langchain/agents/openai/output_parser";
import { ChatOpenAI } from "langchain/chat_models/openai";
import { ChatPromptTemplate, MessagesPlaceholder } from "langchain/prompts";
import type { AgentStep, BaseMessage, BaseMessageLike } from "langchain/schema";
import { AIMessage, FunctionMessage } from "langchain/schema";
import { RunnableSequence } from "langchain/schema/runnable";
import type { StructuredTool } from "langchain/tools";
import { formatToOpenAIFunction } from "langchain/tools";

interface FunctionalInterface {
  functions: StructuredTool[];
  model: string;
  temperature: number;
  aiPrompt: string;
  call(input: string): Promise<string>;
}

export class OpenaiFunctional implements FunctionalInterface {
  model: string;
  temperature: number;
  functions: StructuredTool[];
  aiPrompt = "";
  openaiApiKey? = "";

  private executor?: AgentExecutor;

  constructor(
    model: string,
    temperature: number,
    aiPrompt: string,
    functions: StructuredTool[],
    openaiApiKey?: string,
  ) {
    this.model = model;
    this.temperature = temperature;
    this.functions = functions;
    this.aiPrompt = aiPrompt;
    this.openaiApiKey = openaiApiKey;
  }

  setupExecutor() {
    const model = new ChatOpenAI({
      modelName: this.model,
      temperature: this.temperature,
      openAIApiKey: this.openaiApiKey,
    }).bind({
      functions: [
        ...this.functions.map((tool) => formatToOpenAIFunction(tool)),
      ],
    });

    const prompt = ChatPromptTemplate.fromMessages([
      ["system", this.aiPrompt],
      new MessagesPlaceholder("chat_history"),
      ["human", "{input}"],
      new MessagesPlaceholder("agent_scratchpad"),
    ]);

    const agent = RunnableSequence.from([
      {
        input: (i: { input: string; steps: AgentStep[] }) => i.input,
        agent_scratchpad: (i: { input: string; steps: AgentStep[] }) => {
          return i.steps.flatMap(({ action, observation }) => {
            if ("messageLog" in action && action.messageLog !== undefined) {
              const log = action.messageLog as BaseMessage[];
              console.log(
                i.input,
                log.concat(new FunctionMessage(observation, action.tool)),
              );
              return log.concat(new FunctionMessage(observation, action.tool));
            } else {
              return [new AIMessage(action.log)] as BaseMessage[];
            }
          });
        },
        chat_history: (i: {
          input: string;
          steps: AgentStep[];
          chat_history: BaseMessage[];
        }) => {
          console.log(i.chat_history);
          return i.chat_history;
        },
      },
      prompt,
      model,
      new OpenAIFunctionsAgentOutputParser({
        agentType: "chat-conversational-react-description",
      }),
    ]);

    this.executor = AgentExecutor.fromAgentAndTools({
      agent,
      tools: this.functions,
    });
  }

  setModel(model: string): OpenaiFunctional {
    this.model = model;
    return this;
  }

  setTemperature(temperature: number): OpenaiFunctional {
    this.temperature = temperature;
    return this;
  }

  setAiPrompt(aiPrompt: string): OpenaiFunctional {
    this.aiPrompt = aiPrompt;
    return this;
  }

  setFunctions(functions: StructuredTool[]): OpenaiFunctional {
    this.functions = functions;
    return this;
  }

  setOpenaiApiKey(openaiApiKey: string): OpenaiFunctional {
    this.openaiApiKey = openaiApiKey;
    return this;
  }

  async call(
    input: string,
    chatHistory: BaseMessageLike[] = [],
  ): Promise<string> {
    if (!this.executor) {
      this.setupExecutor();
    }

    const result = await this.executor?.call({
      input,
      chat_history: chatHistory,
    });

    console.log(result);
    return typeof result !== "undefined" ? (result.output as string) : "";
  }
}
