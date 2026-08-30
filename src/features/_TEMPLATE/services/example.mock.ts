import { mockResponse } from "@/shared/lib";

import { exampleListSchema } from "../model/example";
import type { ExampleRepository } from "./example.contract";
import { EXAMPLE_FIXTURES } from "./example.fixtures";

/** Implementação MOCK — fixtures/estado em memória + validação Zod. */
export const exampleMock: ExampleRepository = {
  async getExamples() {
    return mockResponse(exampleListSchema.parse(EXAMPLE_FIXTURES));
  },
};
