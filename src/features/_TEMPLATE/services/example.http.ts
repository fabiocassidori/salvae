import { httpClient } from "@/shared/api";

import { exampleListSchema } from "../model/example";
import type { ExampleRepository } from "./example.contract";

/** Implementação HTTP — forma final da chamada ao backend C# .NET. */
export const exampleHttp: ExampleRepository = {
  async getExamples() {
    const { data } = await httpClient.get("/examples");
    return exampleListSchema.parse(data);
  },
};
