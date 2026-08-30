import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import type { ProfilePatch } from "./profile.contract";
import { profileRepository } from "./profileRepository";

export const profileKeys = {
  all: ["profile"] as const,
  currentUser: () => [...profileKeys.all, "currentUser"] as const,
};

export function useCurrentUserQuery() {
  return useQuery({
    queryKey: profileKeys.currentUser(),
    queryFn: () => profileRepository.getCurrentUser(),
  });
}

export function useUpdateProfileMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (patch: ProfilePatch) => profileRepository.updateProfile(patch),
    onSuccess: (user) => {
      queryClient.setQueryData(profileKeys.currentUser(), user);
    },
  });
}
