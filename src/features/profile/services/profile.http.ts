import { httpClient } from "@/shared/api";

import { currentUserSchema } from "../model/user";
import type { ProfileRepository } from "./profile.contract";

export const profileHttp: ProfileRepository = {
  async getCurrentUser() {
    const { data } = await httpClient.get("/perfil");
    return currentUserSchema.parse(data);
  },
  async updateProfile(patch) {
    const { data } = await httpClient.patch("/perfil", patch);
    return currentUserSchema.parse(data);
  },
};
