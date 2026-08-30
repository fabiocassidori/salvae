import axios from "axios";

import { env } from "@/shared/config";

/**
 * Cliente HTTP único da aplicação.
 *
 * Ponto de extensão central para: injeção de token de sessão, headers de
 * tracing, retry, e normalização de erros de API. As features NÃO devem criar
 * instâncias próprias de axios — elas importam `httpClient` daqui.
 */
// eslint-disable-next-line import/no-named-as-default-member -- `axios.create` é a API oficial do default export
export const httpClient = axios.create({
  baseURL: env.apiBaseUrl,
  timeout: 15_000,
});

httpClient.interceptors.request.use((config) => {
  // const token = readSessionToken();
  // if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

httpClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // TODO: mapear para um tipo de erro único da aplicação (ApiError).
    return Promise.reject(error);
  },
);
