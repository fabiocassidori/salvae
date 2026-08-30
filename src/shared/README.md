# `shared/` — infraestrutura sem domínio

Código reutilizável por qualquer feature que **não conhece regra de negócio**.
Nada aqui "sabe" o que é um Salvado, um pedido ou uma sacola.

> Regra de ouro: `shared/` **nunca** importa de `features/` ou de `app/`.

| Pasta     | Papel                                                                                                                                                                             |
| --------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `ui/`     | design system Salvaê (fonte: `contexto-design.md`): `Text`, `Screen`, `OfferCard`, `SafetySeal`, `CountdownChip`, `PriceTag`, `PrimaryButton`, `SelectableRow`, `StatusPill`, ... |
| `theme/`  | tokens: `colors` semânticas, `spacing` (base 8), `radius`, `typography` (escala restrita), `fontFamily` (Inter)                                                                   |
| `fonts/`  | `useAppFonts()` — carrega a família Inter exigida pelo design system                                                                                                              |
| `api/`    | `httpClient` — instância única de axios + interceptors                                                                                                                            |
| `lib/`    | adaptadores de libs: `queryClient` (React Query) + `mockResponse()`                                                                                                               |
| `config/` | `env` validado com Zod (`EXPO_PUBLIC_*`)                                                                                                                                          |
| `utils/`  | funções puras: `formatCurrencyBRL`, `formatWeightKg`, `getCountdown`, ...                                                                                                         |
| `hooks/`  | hooks genéricos sem domínio                                                                                                                                                       |
| `types/`  | tipos utilitários transversais (`Nullable`, `Paginated`, `Id`)                                                                                                                    |

Cada subpasta expõe um `index.ts`. Importe de `@/shared/ui`, `@/shared/theme`
etc., não de arquivos internos.

O design system impõe acessibilidade por construção: `Text` alinha à esquerda e
só aceita as 4 variantes tipográficas; toda info de tempo/segurança/preço tem
redundância ícone + texto (WCAG 1.4.1); alvos de toque de 48dp; o vermelho
(`colors.feedbackError`) é exclusivo de erro de sistema.
