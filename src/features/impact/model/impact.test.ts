import { co2eKgAvoided, levelFor } from "./impact";

describe("model/impact", () => {
  it("classifica o nível pelo total de comida resgatada", () => {
    expect(levelFor(0).current.level).toBe("BRONZE");
    expect(levelFor(9_000).current.level).toBe("BRONZE");
    expect(levelFor(10_000).current.level).toBe("SILVER");
    expect(levelFor(60_000).current.level).toBe("GOLD");
  });

  it("informa quanto falta para o próximo nível", () => {
    const level = levelFor(4_000);
    expect(level.next?.level).toBe("SILVER");
    expect(level.next?.remainingKg).toBeCloseTo(6);
    expect(level.progress).toBeCloseTo(0.4);
  });

  it("estima CO2e evitado por proxy", () => {
    expect(co2eKgAvoided(10_000)).toBeCloseTo(25);
  });
});
