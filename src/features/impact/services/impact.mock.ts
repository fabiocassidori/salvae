import { mockResponse } from "@/shared/lib";

import { impactSummarySchema } from "../model/impact";
import type { ImpactRepository } from "./impact.contract";
import { IMPACT_SUMMARY_MOCK } from "./impact.fixtures";

export const impactMock: ImpactRepository = {
  async getSummary() {
    return mockResponse(impactSummarySchema.parse(IMPACT_SUMMARY_MOCK));
  },
};
