# `src/` — visão geral

**Salvaê** — app de resgate de alimentos próximos do vencimento (Expo SDK 57 /
RN 0.86 / React 19). Arquitetura: **Vertical Slice + MVVM**.

Documentos: [`docs/ARCHITECTURE.md`](../docs/ARCHITECTURE.md) (stack, camadas,
regras) e [`docs/ENTREGA-01-DESIGN-E-TELAS.md`](../docs/ENTREGA-01-DESIGN-E-TELAS.md)
(design system, telas, modelo de dados mockado).

## Camadas

| Pasta       | Papel                                                                                                                      |
| ----------- | -------------------------------------------------------------------------------------------------------------------------- |
| `app/`      | composição raiz: providers globais + navegação (RootStack + abas). Sem regra de negócio.                                   |
| `features/` | fatias verticais de domínio, cada uma em MVVM. Ver `features/README.md`.                                                   |
| `shared/`   | infra **sem domínio**: `ui/` (design system), `api/`, `lib/`, `fonts/`, `config/`, `theme/`, `utils/`, `hooks/`, `types/`. |

## Regra de dependência

```
app/        → importa de  features/*  e  shared/
features/*  → importa de  shared/  e de outra feature SÓ pelo barrel (@/features/x)
shared/     → NÃO importa de  features/  nem de  app/
```

Dentro da fatia (MVVM): `views → viewmodels → services → model`. Reforçado por
ESLint (`no-restricted-imports`).

## Estado

- **React Query** → estado de servidor (Salvados, parceiros, pedidos, impacto).
- **Zustand** (em `services/`) → estado de cliente (sacola, endereço/pagamento
  ativo, favoritos, usuário mockado).
- **`useState`** → estado efêmero de um componente.

## Dados (etapa atual)

Offline: cada `services/*Repository.ts` retorna `mockResponse(schema.parse(...))`
a partir de `services/*.mock.ts`. Integrar o backend C# .NET = trocar o corpo do
repositório por `httpClient` — schema e assinatura não mudam.

## Alias

`@/app/…`, `@/features/…`, `@/shared/…` (`tsconfig.json`). Reinicie o Expo após
alterar `tsconfig.json`.
