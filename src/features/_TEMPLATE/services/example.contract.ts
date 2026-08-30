import type { Example } from "../model/example";

/**
 * Contrato do repositório da fatia. É a fronteira única entre ViewModels/queries
 * e a origem dos dados; as implementações `mock` e `http` o satisfazem.
 * Também é o contrato esperado do backend C# .NET.
 */
export type ExampleRepository = {
  getExamples(): Promise<Example[]>;
};
