import { z } from "zod";

/**
 * Configuração de ambiente validada em tempo de boot.
 *
 * No Expo SDK 57, variáveis expostas ao bundle usam o prefixo `EXPO_PUBLIC_`
 * e devem ser lidas de forma estática (`process.env.EXPO_PUBLIC_X`).
 * Nunca coloque segredos aqui — apenas configuração pública do cliente.
 */
const envSchema = z.object({
  apiBaseUrl: z.string().url(),
  environment: z.enum(["development", "staging", "production"]),
  /** Fonte de dados ativa — ver `@/shared/data`. */
  dataSource: z.enum(["mock", "http"]),
});

export const env = envSchema.parse({
  apiBaseUrl: process.env.EXPO_PUBLIC_API_BASE_URL ?? "https://api.salvae.local",
  environment: process.env.EXPO_PUBLIC_ENV ?? "development",
  dataSource: process.env.EXPO_PUBLIC_DATA_SOURCE === "http" ? "http" : "mock",
});

export type Env = z.infer<typeof envSchema>;
