import { __resetAddresses, addressesMock } from "./addresses.mock";

const draft = {
  label: "Casa da praia",
  kind: "OTHER" as const,
  street: "Rua do Mar",
  number: "42",
  complement: "",
  district: "Riviera",
  city: "Bertioga",
  state: "SP",
  zipCode: "11250-000",
  reference: "",
};

describe("addresses mock repository", () => {
  beforeEach(() => __resetAddresses());

  it("cria um endereço novo e o inclui na listagem", async () => {
    const before = (await addressesMock.getAddresses()).length;
    const created = await addressesMock.saveAddress(draft);

    expect(created.id).toMatch(/^addr-/);
    const list = await addressesMock.getAddresses();
    expect(list).toHaveLength(before + 1);
    expect(list.some((a) => a.id === created.id)).toBe(true);
  });

  it("atualiza um endereço existente pelo id (sem duplicar)", async () => {
    const created = await addressesMock.saveAddress(draft);
    const before = (await addressesMock.getAddresses()).length;

    const updated = await addressesMock.saveAddress({
      ...draft,
      id: created.id,
      label: "Casa da praia (novo)",
    });

    expect(updated.id).toBe(created.id);
    const list = await addressesMock.getAddresses();
    expect(list).toHaveLength(before);
    expect(list.find((a) => a.id === created.id)?.label).toBe("Casa da praia (novo)");
  });

  it("remove um endereço", async () => {
    const created = await addressesMock.saveAddress(draft);
    await addressesMock.deleteAddress(created.id);
    const list = await addressesMock.getAddresses();
    expect(list.some((a) => a.id === created.id)).toBe(false);
  });
});
