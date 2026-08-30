/** Grade base 8 — fonte: `contexto-design.md` §5. */
export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
} as const;

/** Raios — Cards/Campos 8dp, Botões 12dp, Chips 24dp. */
export const radius = {
  card: 8,
  field: 8,
  button: 12,
  chip: 24,
} as const;

/** Margem lateral da tela: sempre 16dp. */
export const screenMargin = 16;

/** Alvo de toque mínimo absoluto (WCAG 2.5.5). */
export const minTouchTarget = 48;

/** Distância mínima entre elementos interativos (proximidade). */
export const minInteractiveGap = 8;
