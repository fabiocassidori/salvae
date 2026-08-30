import type { CurrentUser } from "../model/user";

export type ProfilePatch = Partial<Pick<CurrentUser, "fullName" | "email" | "phone">>;

/** Contrato do repositório de perfil (= contrato do backend C# .NET). */
export type ProfileRepository = {
  getCurrentUser(): Promise<CurrentUser>;
  updateProfile(patch: ProfilePatch): Promise<CurrentUser>;
};
