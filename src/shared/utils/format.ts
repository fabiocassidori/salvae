/** Formata um valor em centavos como moeda BRL (ex.: 1990 -> "R$ 19,90"). */
export function formatCurrencyBRL(valueInCents: number): string {
  return (valueInCents / 100).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

/** Peso em gramas -> string em kg com 1 casa (ex.: 750 -> "0,75 kg"). */
export function formatWeightKg(grams: number): string {
  return `${(grams / 1000).toLocaleString("pt-BR", {
    minimumFractionDigits: grams % 1000 === 0 ? 0 : 1,
    maximumFractionDigits: 2,
  })} kg`;
}

/** "18:00 – 19:30" a partir de dois horários "HH:MM". */
export function formatPickupWindow(startHHMM: string, endHHMM: string): string {
  return `${startHHMM} – ${endHHMM}`;
}
