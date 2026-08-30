import { DATA_SOURCE, resolveDataSource } from "./dataSource";

describe("shared/data/dataSource", () => {
  it("usa mock por padrão (sem EXPO_PUBLIC_DATA_SOURCE=http)", () => {
    expect(DATA_SOURCE).toBe("mock");
  });

  it("resolveDataSource devolve a implementação da fonte ativa", () => {
    const impls = { mock: "M" as const, http: "H" as const };
    expect(resolveDataSource(impls)).toBe(DATA_SOURCE === "http" ? "H" : "M");
  });
});
