/**
 * Helper de dados mockados para navegação offline nesta etapa.
 *
 * Cada `*Repository.ts` de feature usa a implementação `*.mock.ts`, que devolve
 * `mockResponse(...)` no lugar de uma chamada real ao `httpClient`. Para plugar
 * o backend (C# .NET), a fonte de dados passa a ser `*.http.ts` — a assinatura
 * e o schema Zod permanecem os mesmos (ver `@/shared/data`).
 */
const isTest = process.env.NODE_ENV === "test";

export function mockResponse<T>(data: T, ms = 350): Promise<T> {
  if (isTest) return Promise.resolve(data);
  return new Promise((resolve) => setTimeout(() => resolve(data), ms));
}
