import { resolveDataSource } from "@/shared/data";

import type { ExampleRepository } from "./example.contract";
import { exampleHttp } from "./example.http";
import { exampleMock } from "./example.mock";

/**
 * Camada de repositório — único ponto de acesso a dados da fatia. As ViewModels
 * (via `exampleQueries`) dependem só daqui; a origem (`mock` | `http`) é
 * resolvida em um lugar só por `EXPO_PUBLIC_DATA_SOURCE`.
 */
export const exampleRepository: ExampleRepository = resolveDataSource({
  mock: exampleMock,
  http: exampleHttp,
});
