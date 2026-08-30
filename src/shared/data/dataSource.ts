/**
 * Seleção da fonte de dados da aplicação.
 *
 * Toda a camada de repositório (`features/<x>/services/<x>Repository.ts`) usa
 * `resolveDataSource` para escolher, em um único ponto, de onde os dados vêm:
 *
 * - `"mock"`  → fixtures / store em memória (cenário atual, navegação offline);
 * - `"http"`  → backend real via `@/shared/api` (quando o C# .NET estiver pronto).
 *
 * A troca é feita pela variável de ambiente `EXPO_PUBLIC_DATA_SOURCE` — nenhum
 * arquivo de ViewModel, tela ou hook de query precisa mudar.
 */
export type DataSourceKind = "mock" | "http";

export const DATA_SOURCE: DataSourceKind =
  process.env.EXPO_PUBLIC_DATA_SOURCE === "http" ? "http" : "mock";

/** Retorna a implementação correspondente à fonte de dados ativa. */
export function resolveDataSource<T>(implementations: { mock: T; http: T }): T {
  return DATA_SOURCE === "http" ? implementations.http : implementations.mock;
}
