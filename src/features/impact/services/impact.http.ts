import { httpClient } from "@/shared/api";

import { impactSummarySchema } from "../model/impact";
import type { ImpactRepository } from "./impact.contract";

export const impactHttp: ImpactRepository = {
  async getSummary() {
    const { data } = await httpClient.get("/impacto/resumo");
    return impactSummarySchema.parse(data);
  },
};
