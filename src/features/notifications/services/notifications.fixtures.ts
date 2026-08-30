import type { AppNotification } from "../model/notification";

const now = Date.now();
const iso = (minAgo: number) => new Date(now - minAgo * 60_000).toISOString();

/** Dados mockados (etapa offline). Formato = contrato do backend C# .NET. */
export const NOTIFICATIONS_MOCK: AppNotification[] = [
  {
    id: "ntf-1",
    type: "FAVORITE_PUBLISHED",
    title: "Padaria Central publicou um Salvado",
    body: "Cesta de Pães Artesanais por R$ 8,00. Janela de salvamento curta.",
    createdAt: iso(12),
    read: false,
    salvadoId: "slv-cesta-paes-artesanais",
    orderId: null,
  },
  {
    id: "ntf-2",
    type: "ORDER_UPDATE",
    title: "Seu pedido está pronto para retirada",
    body: "Pedido SV-892A na Padaria Central. Retire entre 18:00 e 19:30.",
    createdAt: iso(45),
    read: false,
    salvadoId: null,
    orderId: "ord-sv-892a",
  },
  {
    id: "ntf-3",
    type: "OFFER_NEARBY",
    title: "3 novos Salvados perto de você",
    body: "Mercado da Vila e Café & Cia acabaram de publicar.",
    createdAt: iso(140),
    read: true,
    salvadoId: null,
    orderId: null,
  },
  {
    id: "ntf-4",
    type: "IMPACT",
    title: "Você chegou a 14 kg de comida resgatada",
    body: "Faltam poucos kg para o nível Salvador Prata. Continue assim!",
    createdAt: iso(60 * 20),
    read: true,
    salvadoId: null,
    orderId: null,
  },
];
