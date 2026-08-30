import { resolveDataSource } from "@/shared/data";

import type { ImpactRepository } from "./impact.contract";
import { impactHttp } from "./impact.http";
import { impactMock } from "./impact.mock";

/** Camada de repositório da fatia `impact` — único ponto de acesso a dados. */
export const impactRepository: ImpactRepository = resolveDataSource({
  mock: impactMock,
  http: impactHttp,
});
