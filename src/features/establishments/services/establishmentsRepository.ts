import { resolveDataSource } from "@/shared/data";

import { establishmentsHttp } from "./establishments.http";
import { establishmentsMock } from "./establishments.mock";
import type { EstablishmentsRepository } from "./establishments.contract";

/**
 * Camada de repositório da fatia `establishments` — **único** ponto de acesso a
 * dados de Salvados e parceiros. As ViewModels (via `establishmentsQueries`)
 * dependem só daqui; a origem (`mock` | `http`) é resolvida em um lugar só.
 */
export const establishmentsRepository: EstablishmentsRepository = resolveDataSource({
  mock: establishmentsMock,
  http: establishmentsHttp,
});
