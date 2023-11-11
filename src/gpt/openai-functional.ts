import { AgentExecutor } from "langchain/agents";
import { OpenAIFunctionsAgentOutputParser } from "langchain/agents/openai/output_parser";
import { ChatOpenAI } from "langchain/chat_models/openai";
import type { AgentStep, BaseMessage } from "langchain/dist/schema";
import { AIMessage, FunctionMessage } from "langchain/dist/schema";
import { RunnableSequence } from "langchain/dist/schema/runnable";
import type { Runnable } from "langchain/dist/schema/runnable";
import type { StructuredTool } from "langchain/dist/tools/base";
import { formatToOpenAIFunction } from "langchain/dist/tools/convert_to_openai";
import { ChatPromptTemplate, MessagesPlaceholder } from "langchain/prompts";

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

  private modelInstance: Runnable;
  private prompt: ChatPromptTemplate;
  private runnableAgent: RunnableSequence;
  private executor: AgentExecutor;

  constructor(
    model: string,
    temperature: number,
    aiPrompt: string,
    functions: StructuredTool[],
  ) {
    this.model = model;
    this.temperature = temperature;
    this.functions = functions;
    this.aiPrompt = aiPrompt;

    this.modelInstance = this.createModel();
    this.prompt = this.createPrompt();
    this.runnableAgent = this.createRunnableAgent();
    this.executor = this.createExecutor();
  }

  generateInstances() {
    this.modelInstance = this.createModel();
    this.prompt = this.createPrompt();
    this.runnableAgent = this.createRunnableAgent();
    this.executor = this.createExecutor();
  }

  createModel(): Runnable {
    return new ChatOpenAI({
      modelName: this.model,
      temperature: this.temperature,
    }).bind({
      functions: [
        ...this.functions.map((tool) => formatToOpenAIFunction(tool)),
      ],
    });
  }

  createPrompt(): ChatPromptTemplate {
    return ChatPromptTemplate.fromMessages([
      ["ai", this.aiPrompt],
      ["human", "{input}"],
      new MessagesPlaceholder("agent_scratchpad"),
    ]);
  }

  createRunnableAgent(): RunnableSequence {
    return RunnableSequence.from([
      {
        input: (i: { input: string; steps: AgentStep[] }) => i.input,
        agent_scratchpad: (i: { input: string; steps: AgentStep[] }) =>
          i.steps.flatMap(({ action, observation }) => {
            if ("messageLog" in action && action.messageLog !== undefined) {
              const log = action.messageLog as BaseMessage[];
              return log.concat(new FunctionMessage(observation, action.tool));
            } else {
              return [new AIMessage(action.log)] as BaseMessage[];
            }
          }),
      },
      this.prompt,
      this.modelInstance,
      new OpenAIFunctionsAgentOutputParser(),
    ]);
  }

  createExecutor(): AgentExecutor {
    return AgentExecutor.fromAgentAndTools({
      agent: this.runnableAgent,
      tools: this.functions,
    });
  }

  setModel(model: string): OpenaiFunctional {
    this.model = model;
    this.generateInstances();
    return this;
  }

  setTemperature(temperature: number): OpenaiFunctional {
    this.temperature = temperature;
    this.generateInstances();
    return this;
  }

  setAiPrompt(aiPrompt: string): OpenaiFunctional {
    this.aiPrompt = aiPrompt;
    this.generateInstances();
    return this;
  }

  async call(input: string): Promise<string> {
    const result = await this.executor.call({
      input,
    });

    return result.output as string;
  }
}
