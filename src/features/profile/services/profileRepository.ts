import { resolveDataSource } from "@/shared/data";

import type { ProfileRepository } from "./profile.contract";
import { profileHttp } from "./profile.http";
import { profileMock } from "./profile.mock";

/** Camada de repositório da fatia `profile` — único ponto de acesso a dados. */
export const profileRepository: ProfileRepository = resolveDataSource({
  mock: profileMock,
  http: profileHttp,
});

export { __resetUser } from "./profile.mock";
export type { ProfileRepository, ProfilePatch } from "./profile.contract";
