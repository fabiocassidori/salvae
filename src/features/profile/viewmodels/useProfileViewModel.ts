import { useMemo } from "react";

import { addressIcon, formatAddress, useAddressesQuery } from "@/features/addresses";
import { useImpactCard } from "@/features/impact";

import { displayName, memberSinceLabel } from "../model/user";
import { useCurrentUserQuery } from "../services/profileQueries";

type Params = {
  onEditProfile: () => void;
  onOpenImpact: () => void;
  onAddAddress: () => void;
  onOpenAddresses: () => void;
  onOpenSettings: () => void;
  onSignOut: () => void;
};

export function useProfileViewModel(params: Params) {
  const { data: user, isPending } = useCurrentUserQuery();
  const { data: addresses } = useAddressesQuery();
  const impact = useImpactCard();

  const addressCards = useMemo(
    () =>
      (addresses ?? []).slice(0, 2).map((a) => ({
        id: a.id,
        label: a.label,
        formatted: formatAddress(a),
        isDefault: a.isDefault,
        icon: addressIcon(a.kind),
      })),
    [addresses],
  );

  return {
    isLoading: isPending || !user,
    name: user ? displayName(user) : "",
    memberSince: user ? memberSinceLabel(user) : "",
    avatarUrl: user?.avatarUrl ?? null,
    personalData: user
      ? [
          {
            key: "name",
            icon: "person-outline" as const,
            label: "Nome completo",
            value: user.fullName,
          },
          { key: "email", icon: "mail-outline" as const, label: "E-mail", value: user.email },
          { key: "phone", icon: "call-outline" as const, label: "Telefone", value: user.phone },
        ]
      : [],
    impact,
    addressCards,
    hasMoreAddresses: (addresses?.length ?? 0) > 2,
    ...params,
  };
}
