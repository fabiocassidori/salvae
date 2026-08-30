import { useQuery } from "@tanstack/react-query";

import { exampleRepository } from "./exampleRepository";

export const exampleKeys = {
  all: ["example"] as const,
  list: () => [...exampleKeys.all, "list"] as const,
};

export function useExamplesQuery() {
  return useQuery({
    queryKey: exampleKeys.list(),
    queryFn: () => exampleRepository.getExamples(),
  });
}
