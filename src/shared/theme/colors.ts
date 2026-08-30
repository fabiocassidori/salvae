/**
 * Cores semânticas — fonte: `contexto-design.md` §4.
 *
 * É PROIBIDO usar cores fora destas funções. Em especial:
 * - vermelho (`feedback.error`) é EXCLUSIVO de erro de sistema — nunca prazo/urgência;
 * - `urgency` / `urgencyBg` são exclusivos do chip de contagem regressiva.
 */
export const colors = {
  /** Ações primárias, selos de segurança, item ativo de navegação. */
  brandPrimary: "#1E7A4C",

  /** Texto de contagem regressiva e prazo. Nunca como alerta geral. */
  urgency: "#8A5300",
  /** Fundo exclusivo do chip de contagem regressiva. */
  urgencyBg: "#FDF0D9",

  /** Títulos, textos base, preços, rótulos. */
  textPrimary: "#22252A",
  /** Metadados e apoio. */
  textSecondary: "#5B6068",

  /** Fundo de cards e barras. */
  surfaceBase: "#FFFFFF",
  /** Fundo geral das telas. */
  surfaceBg: "#F4F5F6",

  /** Restrito a erro de sistema. Nunca prazos. */
  feedbackError: "#B3261E",

  // Neutros de apoio (bordas, divisórias) — derivados, sem função semântica de conteúdo.
  border: "#E4E6E8",
  overlay: "rgba(34, 37, 42, 0.45)",
  // Fundo suave de ícone/realce dentro de cards (brand a 8%).
  brandTint: "#E9F2ED",
} as const;

export type ColorToken = keyof typeof colors;
