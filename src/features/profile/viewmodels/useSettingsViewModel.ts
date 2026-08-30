import { useState } from "react";

/**
 * Configurações locais da conta. Nesta etapa o estado é apenas em memória —
 * vira preferências persistidas / no backend depois.
 */
export function useSettingsViewModel() {
  const [prefs, setPrefs] = useState({
    pushOffers: true,
    pushOrderUpdates: true,
    favoritePartnerAlerts: true,
    weeklyImpactDigest: false,
  });

  const toggle = (key: keyof typeof prefs) => setPrefs((p) => ({ ...p, [key]: !p[key] }));

  return {
    groups: [
      {
        title: "Notificações",
        items: [
          {
            key: "pushOffers" as const,
            label: "Novos Salvados perto de mim",
            value: prefs.pushOffers,
          },
          {
            key: "pushOrderUpdates" as const,
            label: "Atualizações dos meus pedidos",
            value: prefs.pushOrderUpdates,
          },
          {
            key: "favoritePartnerAlerts" as const,
            label: "Quando um parceiro favorito publica",
            value: prefs.favoritePartnerAlerts,
          },
          {
            key: "weeklyImpactDigest" as const,
            label: "Resumo semanal de impacto",
            value: prefs.weeklyImpactDigest,
          },
        ],
      },
    ],
    toggle,
  };
}
