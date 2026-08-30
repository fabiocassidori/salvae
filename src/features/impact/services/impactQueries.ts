import { useQuery } from "@tanstack/react-query";

import { impactRepository } from "./impactRepository";

export const impactKeys = {
  all: ["impact"] as const,
  summary: () => [...impactKeys.all, "summary"] as const,
};

export function useImpactSummaryQuery() {
  return useQuery({
    queryKey: impactKeys.summary(),
    queryFn: () => impactRepository.getSummary(),
  });
}
