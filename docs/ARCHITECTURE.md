# Arquitetura — salvae

**Salvaê** — app de resgate de alimentos próximos do vencimento (React Native /
Expo). Não é um clone de iFood: o diferencial é comida perto de vencer, própria
para consumo, num modelo de **compra no app** com **retirada ou entrega**.
Este documento descreve a stack, a organização de pastas, as responsabilidades
de cada camada e **como o projeto evolui**. Para o design system, as telas e o
modelo de dados desta etapa, ver
[`ENTREGA-01-DESIGN-E-TELAS.md`](./ENTREGA-01-DESIGN-E-TELAS.md).

> TL;DR: **Vertical Slice** (o código é agrupado por funcionalidade de negócio)
> **+ MVVM** dentro de cada fatia (Model → ViewModel → View, com
> responsabilidades separadas). Fronteiras reforçadas por ESLint.

---

## 1. Stack

| Camada               | Ferramenta                                                            | Versão           | Papel                                                                                |
| -------------------- | --------------------------------------------------------------------- | ---------------- | ------------------------------------------------------------------------------------ |
| Runtime / build      | **Expo SDK** + React Native + React                                   | 57 / 0.86 / 19.2 | Toolchain, build nativo, OTA, APIs de dispositivo.                                   |
| Navegação            | **React Navigation** `native` + `bottom-tabs` + `native-stack`        | 7                | Shell de abas (raiz) + stacks por feature.                                           |
| Estado de servidor   | **Repositório + TanStack React Query**                                | 5                | Repositório = seam único por fatia (`mock`↔`http`); React Query faz cache/mutations. |
| Estado de cliente    | **Zustand** (slices enxutos)                                          | 5                | Só o que é reativo e não vai ao servidor: sacola, id selecionado, favoritos.         |
| HTTP                 | **Axios**                                                             | 1.x              | Cliente único com interceptors (`src/shared/api`).                                   |
| Contrato / validação | **Zod**                                                               | 4                | Schemas como fonte da verdade; validação na borda da API.                            |
| Ícones / fontes      | **@expo/vector-icons** + **@expo-google-fonts/inter** + **expo-font** | —                | Iconografia e a família **Inter** exigida pelo design system.                        |
| Linguagem            | **TypeScript** (strict)                                               | 6.x              | Alias `@/*` → `src/*`.                                                               |
| Qualidade            | **ESLint** (flat config) + **Prettier**                               | 9 / 3            | `eslint-config-expo` + regras de fronteira de arquitetura.                           |
| Testes               | **Jest** (`jest-expo`) + **Testing Library**                          | 29 / 14          | Unidade (funções puras, ViewModels) e componente (Views).                            |
| Fonte de dados       | **`EXPO_PUBLIC_DATA_SOURCE`** (`mock` \| `http`)                      | —                | `mock` = fixtures/estado em memória (offline); `http` = backend C# .NET.             |

### Por que essas escolhas

- **React Query + Zustand** separam claramente _estado de servidor_ de _estado
  de cliente_ — o erro mais comum em apps RN é misturar os dois num só store.
- **Zod** faz o dado remoto ser validado **uma vez**, na borda; o resto do app
  confia nos tipos.
- **React Navigation** (e não expo-router) porque o roteamento é montado em
  código, o que combina melhor com o "cada feature dona da sua navegação".

---

## 2. Princípios de arquitetura

### 2.1 Vertical Slice (fatias verticais)

O código é agrupado **por funcionalidade de negócio**, não por tipo técnico.
Não existe uma pasta global `components/`, `hooks/`, `services/` — cada feature
carrega o que precisa.

**Ganhos:** uma mudança de produto toca **uma pasta**; features entram e saem
sem efeito cascata; times trabalham em paralelo com pouco conflito; o custo de
entender uma feature é local.

### 2.2 MVVM dentro da fatia

Cada fatia separa três responsabilidades:

| Pilar         | Onde                                 | Faz                                                                                   | Não faz                                 |
| ------------- | ------------------------------------ | ------------------------------------------------------------------------------------- | --------------------------------------- |
| **Model**     | `model/` + `services/`               | forma dos dados (Zod), regras de domínio puras, acesso a dados (repo, queries, store) | JSX, formatação para tela               |
| **ViewModel** | `viewmodels/`                        | estado de apresentação, orquestra services/model, formata para a View, expõe ações    | JSX, chamadas diretas de `httpClient`   |
| **View**      | `views/screens` + `views/components` | renderizar; encaminhar eventos por callback                                           | fetch, regra de negócio, acesso a store |

A **View** consome **exatamente uma ViewModel** e recebe tudo pronto (labels
formatados, flags `isLoading`/`hasError`, handlers). Isso torna a lógica
testável sem renderizar nada e mantém as telas triviais.

### 2.3 Como os dois se combinam

```
features/<feature>/           ← a fatia vertical (Vertical Slice)
├── model/                     ┐ Model — domínio (schemas Zod + regras puras)
├── services/                  ┘ Model — dados (camada de repositório: contract/mock/http/Repository/Queries)
├── viewmodels/                  ViewModel — use<Tela>ViewModel
├── views/                       View — screens/ + components/
└── index.ts                     API pública da fatia (barrel)
```

As telas empilháveis são registradas em `src/app/navigation/RootNavigator.tsx`
(a fatia expõe a tela pelo `index.ts`; a navegação é montada na camada `app/`).

---

## 3. Estrutura de pastas

```
salvae/
├── App.tsx                     # entrypoint fino → re-exporta @/app/App
├── index.ts                    # registerRootComponent (Expo)
├── docs/                       # ARCHITECTURE.md + ENTREGA-01/02-*.md
├── eslint.config.js            # flat config + regras de fronteira
├── jest.config.js / jest.setup.ts
└── src/
    ├── app/                    # COMPOSIÇÃO RAIZ (sem regra de negócio)
    │   ├── App.tsx                 # carrega fontes + providers + navegação raiz
    │   ├── providers/              # AppProviders (SafeArea, React Query)
    │   └── navigation/            # RootNavigator + AppTabBar + routes.ts (contrato)
    │
    ├── features/               # FATIAS VERTICAIS (uma pasta por funcionalidade)
    │   ├── _TEMPLATE/              # molde MVVM para novas features
    │   │
    │   ├── establishments/       # Salvados + parceiros ── Início, Explorar,
    │   │   │                     #   Detalhe, "Ver tudo", Perfil do parceiro
    │   │   ├── model/                 # salvado.ts, establishment.ts, filters.ts
    │   │   ├── services/              # CAMADA DE REPOSITÓRIO:
    │   │   │   ├── *.contract.ts          #   tipo do repositório (= contrato do backend)
    │   │   │   ├── *.fixtures.ts           #   dados mockados crus
    │   │   │   ├── *.mock.ts               #   implementação MOCK (fixtures + Zod)
    │   │   │   ├── *.http.ts               #   implementação HTTP (axios + Zod)
    │   │   │   ├── *Repository.ts          #   resolveDataSource({ mock, http }) — o seam
    │   │   │   └── *Queries.ts             #   hooks React Query que chamam o repositório
    │   │   ├── viewmodels/            # salvadoPresenter + use*ViewModel
    │   │   ├── views/screens|components/
    │   │   └── index.ts               # API pública
    │   │
    │   ├── cart/        # sacola (Zustand + regras puras em model/cart.ts)
    │   ├── checkout/    # recebimento (retirada/entrega) + pagamento + criação do pedido
    │   ├── orders/      # "Pedido": lista, detalhe (linha do tempo), confirmação
    │   ├── payments/    # formas de pagamento (cartão, Pix, pagar na retirada)
    │   ├── addresses/   # CRUD de endereços + endereço de entrega ativo
    │   ├── profile/     # Perfil, Editar, Configurações + usuário mockado
    │   ├── impact/      # Impacto Salvo: níveis Bronze/Prata/Ouro, streak
    │   ├── notifications/  # central de notificações + badge do sino
    │   ├── favorites/   # estabelecimentos favoritos (store + hooks)
    │   └── authentication/ coupons/   # README de escopo — próximas etapas
    │
    └── shared/                  # INFRA SEM DOMÍNIO (nunca importa de features/)
        ├── ui/                     # design system (contexto-design.md): OfferCard,
        │                          #   SafetySeal, CountdownChip, PriceTag, Text, ...
        ├── api/                    # httpClient (axios único + interceptors)
        ├── data/                   # DATA_SOURCE + resolveDataSource({ mock, http })
        ├── lib/                    # queryClient + mockResponse()
        ├── fonts/                  # useAppFonts() (Inter)
        ├── config/                 # env validado com Zod (EXPO_PUBLIC_*)
        ├── theme/                  # tokens: colors, spacing, radius, typography, elevation()
        ├── utils/                  # funções puras: formatCurrencyBRL, getCountdown, ...
        ├── hooks/  └── types/      # genéricos sem domínio
```

---

## 4. Regra de dependência entre camadas

```
app/        →  pode importar de  features/*  e  shared/
features/*  →  pode importar de  shared/  e (com parcimônia) de outra feature PELO BARREL
shared/     →  NÃO importa de  features/  nem de  app/
```

Dentro de uma fatia (MVVM):

```
views/       →  viewmodels/  (+ shared/, navigation/)
viewmodels/  →  services/, model/  (+ shared/)
services/    →  model/  (+ shared/api, shared/lib)
model/       →  nada além de shared/ puro (utils/types)
```

Essas regras são **verificadas pelo ESLint** (`no-restricted-imports`) — ver §8.

---

## 5. Fluxo de dados

```
        ┌─ *.mock.ts  (fixtures/estado em memória + Zod.parse)
        │
*Repository.ts ─ resolveDataSource({ mock, http }) ── escolhe a fonte 1x
        │                                               (EXPO_PUBLIC_DATA_SOURCE)
        └─ *.http.ts  (axios @/shared/api + Zod.parse)
     │
services/…Queries.ts      ── React Query (cache, retry, loading/error, mutations)
     │
viewmodels/use…ViewModel  ── deriva + formata + expõe ações  (usa model/ p/ regras)
     │  { state, actions }  (sem tipos de domínio crus, sem JSX)
     ▼
views/screens/…Screen     ── renderiza; eventos saem por callback
```

**Camada de repositório.** Cada fatia tem um `*Repository.ts` que é o **único**
ponto de acesso a dados. Ele implementa um `*.contract.ts` (o tipo é também o
contrato esperado do backend C# .NET) e delega para `*.mock.ts` ou `*.http.ts`
conforme `resolveDataSource` — as ViewModels/queries nunca sabem a origem.
Migrar para o backend = `EXPO_PUBLIC_DATA_SOURCE=http` + ajustar os paths em
`*.http.ts`. Validação Zod roda na borda das duas implementações.

Estado de cliente puro (conteúdo da sacola, id do endereço/pagamento
selecionado) fica em Zustand, acessado direto pela ViewModel — **não** passa
pelo repositório (é estado reativo da aplicação, não dado a buscar).

---

## 6. Política de estado

| Tipo                     | Ferramenta                | Exemplos                                                                           |
| ------------------------ | ------------------------- | ---------------------------------------------------------------------------------- |
| Estado de **servidor**   | Repositório + React Query | Salvados, parceiros, pedidos, impacto, endereços, pagamentos, perfil, notificações |
| Estado de **cliente**    | Zustand (slice enxuto)    | conteúdo da sacola, id do endereço/pagamento selecionado, favoritos                |
| Estado **efêmero de UI** | `useState` / `useReducer` | campo de texto, acordeão aberto, aba ativa                                         |

Regra: se o dado "pertence" ao backend (existe/existirá lá, tem CRUD), é
**repositório + React Query** — mesmo no cenário mock atual. Só é Zustand o que
é decisão do usuário na sessão e precisa ser reativo sem ir ao servidor (a
sacola, a seleção ativa). Se morre com o componente, é `useState`.

> Nota da migração de repositório: fatias como `addresses`, `payments`,
> `notifications` e `profile` deixaram de guardar a lista num store Zustand
> (que fazia o papel de "banco") e passaram a `*Repository` + React Query +
> um slice Zustand só para o "id selecionado". Isso já é a forma final com o
> backend — a `*.mock.ts` mantém o array em memória, a `*.http.ts` só troca por
> `httpClient`.

---

## 7. Validação (Zod)

- O **schema** é a fonte da verdade; o tipo TS é `z.infer<typeof schema>`.
- `schema.parse(data)` roda **só** nas implementações do repositório
  (`*.mock.ts` e `*.http.ts`), na borda.
- A partir daí, ViewModels e Views confiam nos tipos — nada de checar campo
  indefinido nas telas.
- `src/shared/config/env.ts` valida as variáveis `EXPO_PUBLIC_*` no boot
  (incluindo `EXPO_PUBLIC_DATA_SOURCE`).

---

## 8. Fronteiras reforçadas por lint

`eslint.config.js` aplica `no-restricted-imports` para:

1. **Feature só é importada pelo barrel** — `@/features/x`, nunca
   `@/features/x/services/...`. O interior da fatia é privado.
2. **`shared/` não depende de `features/` nem de `app/`**.
3. **View não importa `services/` nem `model/`** — passa pela ViewModel.
4. **ViewModel não importa `views/`** — não conhece JSX.

Arquivos `*.test.ts(x)` ficam livres dessas restrições.

Scripts: `yarn lint`, `yarn lint:fix`, `yarn format`, `yarn typecheck`.

---

## 9. Navegação

- **`RootStack`** (`native-stack`, em `src/app/navigation/RootNavigator.tsx`)
  contém **`Tabs`** (bottom-tabs com `AppTabBar` custom: Início · Explorar ·
  Pedidos · Perfil) **+** as telas empilháveis transversais a mais de uma aba
  (Detalhe do Salvado, Sacola, Checkout, Pedido confirmado, Detalhe do Pedido,
  e as telas internas do Perfil).
- **O contrato de rotas vive em `src/app/navigation/routes.ts`**
  (`RootStackParamList`, `RootStackScreenProps<T>`, `TabScreenProps<T>`). Como
  essas telas são genuinamente transversais, a montagem é centralizada na
  camada `app/` — cada fatia apenas **expõe suas telas pelo `index.ts`**; as
  fatias não navegam umas para as outras diretamente.
- As telas (`views/screens/`) recebem `*ScreenProps` tipados e repassam a
  navegação para a ViewModel via callback (`onOpenSalvado`, `onConfirmed`, …),
  mantendo a ViewModel agnóstica de navegação. O `import type` do contrato de
  rotas é a única dependência de uma `view/` em relação a `@/app`.

---

## 10. Testes

| Alvo                         | Como                                        | Exemplo                                |
| ---------------------------- | ------------------------------------------- | -------------------------------------- |
| Regras de domínio (`model/`) | Jest puro, sem render                       | `src/features/cart/model/cart.test.ts` |
| Utils (`shared/utils`)       | Jest puro                                   | `src/shared/utils/format.test.ts`      |
| ViewModels                   | `renderHook` + query client de teste        | (a adicionar por feature)              |
| Views                        | `@testing-library/react-native`, mock da VM | (a adicionar por feature)              |

Teste ao lado do arquivo (`cart.ts` ↔ `cart.test.ts`). `yarn test` /
`yarn test:watch`.

---

## 11. Convenções

- **Alias**: sempre `@/…` (nunca `../../..`). Reinicie o Expo após mexer em
  `tsconfig.json`.
- **Barrels**: cada feature e cada subpasta de `shared/` expõem `index.ts`.
  Importe do barrel, não de arquivos internos.
- **Nomes**: `use<Tela>ViewModel.ts`, `<dominio>.contract.ts`,
  `<dominio>.fixtures.ts`, `<dominio>.mock.ts`, `<dominio>.http.ts`,
  `<dominio>Repository.ts`, `<dominio>Queries.ts`, `selected<X>Store.ts`.
- **Camada de repositório**: as ViewModels/queries importam só o
  `*Repository.ts`; ele resolve `mock`/`http` via `resolveDataSource`. Integrar
  o backend = `EXPO_PUBLIC_DATA_SOURCE=http` + ajustar paths em `*.http.ts`.
- **Dinheiro** em centavos (`number`), formatado só na fronteira da View
  (`formatCurrencyBRL`).
- **Presenter**: transformação entidade → labels vive em
  `viewmodels/<x>Presenter.ts` (puro, testável, reutilizável entre fatias).
- **Cross-platform**: cores de sombra via `elevation()` (nunca `shadow*` ou
  `elevation` soltos); texto só pelo componente `Text`; formulários usam
  `<Screen avoidKeyboard>`; cabeçalhos aplicam o inset superior por conta
  própria (telas com cabeçalho não pedem o edge `top` ao `Screen`).

---

## 12. Como adicionar uma feature

1. `cp -r src/features/_TEMPLATE src/features/<nome>`.
2. `model/` — escreva o schema Zod e as regras puras primeiro.
3. `services/` — `*.contract.ts` (o tipo do repositório) → `*.fixtures.ts` +
   `*.mock.ts` → `*.http.ts` (paths do backend) → `*Repository.ts`
   (`resolveDataSource`) → `*Queries.ts` (hooks React Query). Se houver estado
   de cliente puro, um `selected<X>Store.ts` enxuto (só o id/flag).
4. `viewmodels/` — um hook por tela: junta queries + model, formata, expõe ações.
5. `views/` — telas e componentes de apresentação.
6. `index.ts` — exporte só a superfície mínima (telas + hooks + tipos + repositório).
7. Registre as telas em `src/app/navigation/RootNavigator.tsx` e acrescente as
   rotas em `src/app/navigation/routes.ts`.
8. Escreva testes de `model/` e da implementação `*.mock.ts`.

---

## 13. Como o projeto evolui

**Estado atual (Entrega 01):** design system completo (`shared/ui` +
`shared/theme` conforme `contexto-design.md`); camada `app/` com navegação
montada; 18 telas navegáveis com **dados mockados**; fatias `establishments`,
`cart`, `checkout`, `orders`, `payments`, `addresses`, `profile`, `impact`,
`notifications` e `favorites` implementadas; `authentication` e `coupons` como
README de escopo. Detalhes em `ENTREGA-01-DESIGN-E-TELAS.md`.

**Próximas etapas** (aproveitando a jornada do usuário):

1. `authentication` — sessão + token no interceptor de `shared/api` (hoje é
   usuário fixo mockado).
2. Backend C# .NET expondo os contratos da Entrega 01; `*Repository.ts` trocam
   `mockResponse` por `httpClient`.
3. `orders` — acompanhamento em tempo real via `refetchInterval`.
4. `coupons` / "Compre 1, Salve 1" / doações ("Salvados Solidários"),
   `favorites` com tela, mapa em tempo real, Clube Salvaê.

**Quando promover algo para `shared/`:** quando duas features passam a depender
do mesmo conceito **sem domínio** (um componente visual, um formatador, um
hook). Se o conceito **tem domínio** e é compartilhado (ex.: "endereço" usado
por `checkout` e `profile`), mantenha-o numa feature dona e consuma pelo barrel;
só extraia para um módulo `src/domain/<x>/` dedicado se a dependência cruzada
virar regra.

**Quando quebrar em pacotes:** enquanto for um app, `src/` basta. Se surgir um
segundo app (ex.: app do entregador, painel do lojista) que compartilhe
domínio, migre `shared/` e os módulos de domínio para um monorepo
(`packages/`), mantendo as features específicas em cada app.

**Escala de time:** a fronteira do barrel + as regras de lint permitem que cada
feature seja "propriedade" de uma pessoa/dupla. PRs ficam contidos numa pasta.

**Evoluções técnicas previstas:**

- `shared/api`: mapear erros para um `ApiError` único; retry/backoff; refresh de
  token.
- Persistência da sacola/sessão (`AsyncStorage` + `zustand/middleware`).
- `expo-notifications` para push (feature `notifications`).
- Camada de testes de ViewModel/View por feature.
- CI rodando `typecheck` + `lint` + `test`.

---

## 14. Setup pendente

- [ ] `.env` com `EXPO_PUBLIC_API_BASE_URL` e `EXPO_PUBLIC_ENV`.
- [ ] Backend C# .NET (contratos na Entrega 01); `*Repository.ts` → `httpClient`.
- [ ] Implementar `authentication` e ligar o token no interceptor.
- [ ] Persistir sacola / endereço / pagamento (`AsyncStorage` + `zustand/middleware`).
- [ ] Substituir imagens `picsum.photos` por assets/CDN reais.
- [ ] Pipeline de CI (`yarn typecheck && yarn lint && yarn test`).
- [ ] Mover `src/temp/Home.png` para `assets/` ou removê-lo (arquivo solto).
