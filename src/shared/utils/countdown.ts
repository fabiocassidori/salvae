/**
 * Contagem regressiva da "Janela de Salvamento" (tempo até a OFERTA expirar).
 *
 * Formato de tempo relativo, com redundância textual (nunca só cor) —
 * `contexto-design.md` §1 e §6.
 */
export type CountdownState = {
  totalMinutes: number;
  expired: boolean;
  /** Texto pronto para o chip, ex.: "encerra em 45 min" / "encerra em 2 h". */
  label: string;
};

export function getCountdown(expiresAtISO: string, nowMs: number = Date.now()): CountdownState {
  const diffMs = new Date(expiresAtISO).getTime() - nowMs;
  const totalMinutes = Math.max(0, Math.round(diffMs / 60_000));

  if (totalMinutes <= 0) {
    return { totalMinutes: 0, expired: true, label: "oferta encerrada" };
  }

  if (totalMinutes < 60) {
    return { totalMinutes, expired: false, label: `encerra em ${totalMinutes} min` };
  }

  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  const hoursLabel = `${hours} h`;
  return {
    totalMinutes,
    expired: false,
    label: minutes === 0 ? `encerra em ${hoursLabel}` : `encerra em ${hoursLabel} ${minutes} min`,
  };
}
