import { getCountdown } from "./countdown";
import { formatCurrencyBRL, formatPickupWindow, formatWeightKg } from "./format";

describe("shared/utils/format", () => {
  it("formata centavos como moeda BRL", () => {
    expect(formatCurrencyBRL(1990)).toContain("19,90");
    expect(formatCurrencyBRL(0)).toContain("0,00");
  });

  it("formata peso em kg", () => {
    expect(formatWeightKg(1000)).toBe("1 kg");
    expect(formatWeightKg(750)).toBe("0,75 kg");
  });

  it("formata janela de retirada", () => {
    expect(formatPickupWindow("18:00", "19:30")).toBe("18:00 – 19:30");
  });
});

describe("shared/utils/countdown", () => {
  const now = new Date("2026-08-30T12:00:00.000Z").getTime();

  it("usa minutos abaixo de 1h", () => {
    const c = getCountdown("2026-08-30T12:45:00.000Z", now);
    expect(c).toMatchObject({ expired: false, label: "encerra em 45 min" });
  });

  it("usa horas acima de 1h", () => {
    expect(getCountdown("2026-08-30T14:00:00.000Z", now).label).toBe("encerra em 2 h");
    expect(getCountdown("2026-08-30T14:30:00.000Z", now).label).toBe("encerra em 2 h 30 min");
  });

  it("marca como expirado quando já passou", () => {
    expect(getCountdown("2026-08-30T11:00:00.000Z", now)).toMatchObject({
      expired: true,
      totalMinutes: 0,
    });
  });
});
