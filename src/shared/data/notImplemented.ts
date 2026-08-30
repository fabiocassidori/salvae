/**
 * Marcador para os métodos HTTP ainda não ligados ao backend.
 *
 * As implementações `*.http.ts` já têm a forma final (endpoint + `schema.parse`),
 * mas enquanto `DATA_SOURCE === "mock"` elas nunca são chamadas. Se alguém
 * ligar `EXPO_PUBLIC_DATA_SOURCE=http` antes do backend existir, o erro é
 * explícito em vez de um `undefined` silencioso.
 */
export function httpNotWired(operation: string): never {
  throw new Error(
    `[data/http] "${operation}" ainda não está ligado ao backend. ` +
      `Implemente a chamada em @/shared/api ou volte para EXPO_PUBLIC_DATA_SOURCE=mock.`,
  );
}
