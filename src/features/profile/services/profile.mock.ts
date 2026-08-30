import { mockResponse } from "@/shared/lib";

import { currentUserSchema, type CurrentUser } from "../model/user";
import type { ProfileRepository } from "./profile.contract";
import { MOCK_USER } from "./user.fixtures";

let user: CurrentUser = { ...MOCK_USER };

export const profileMock: ProfileRepository = {
  async getCurrentUser() {
    return mockResponse(currentUserSchema.parse(user));
  },
  async updateProfile(patch) {
    user = currentUserSchema.parse({ ...user, ...patch });
    return mockResponse(user);
  },
};

/** Apenas para testes. */
export function __resetUser(): void {
  user = { ...MOCK_USER };
}
