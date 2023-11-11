import { OpenaiFunctional } from "./openai-functional";

export class MemGPT extends OpenaiFunctional {
  constructor(model: string, temperature: number) {
    super(model, temperature, "", []);
  }
}
