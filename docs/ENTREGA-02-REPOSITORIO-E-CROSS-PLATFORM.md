# Entrega 02 — Camada de Repositório + Compatibilidade Android/iOS

Continuação da [Entrega 01](./ENTREGA-01-DESIGN-E-TELAS.md). Dois trabalhos:

1. Uma **camada de repositório** por fatia, com a lógica de busca centralizada e
   uma fonte de dados plugável: **HTTP**, **store Zustand** ou **dados mockados**.
2. Um passe de **compatibilidade cross-platform** nas telas (Android + iOS).

---

## 1. Análise do cenário do repositório

### É viável? **Sim.** É recomendado? **Sim, com um recorte.**

O projeto já tinha `*Repository.ts` para os dados "de servidor" (Salvados,
pedidos, impacto). O que faltava:

- um **contrato explícito** por fatia (o tipo do repositório) que também serve de
  contrato do backend C# .NET;
- um **seletor de fonte** único (`mock` ↔ `http`) — para a migração ser uma
  variável de ambiente, não um _refactor_;
- levar para o mesmo padrão as fatias que usavam **um store Zustand como "banco"**
  (`addresses`, `payments`, `notifications`, `profile`).

### O recorte importante

A proposta original listava três fontes atrás do repositório: **HTTP**, **store
Zustand** e **dados mockados**. Implementado assim, com uma ressalva:

- **HTTP** e **mock** são as duas _implementações_ do repositório (`*.http.ts` e
  `*.mock.ts`). A `*.mock.ts` guarda o estado em memória (array/objeto de módulo)
  — é o "store" da fase offline. Trocar para HTTP é trocar a implementação.
- **Zustand não fica atrás de um repositório assíncrono.** Um repositório é
  `async` (retorna `Promise`); esconder atrás dele o _conteúdo da sacola_ ou o
  _endereço selecionado_ quebraria a reatividade (a tela não re-renderiza quando
  um `Promise` resolve sem um cache no meio). Esse é **estado de cliente**, não
  dado a buscar. Ele continua em Zustand, acessado direto pela ViewModel.
- Onde o "store" era na verdade uma **lista com CRUD** (endereços, formas de
  pagamento, notificações, perfil), isso É dado de servidor: virou
  `*Repository` + **React Query** + um slice Zustand mínimo só para o **id
  selecionado**. Essa já é a forma final com o backend — nada muda além da
  implementação da fonte.

Ganhos: uma única fronteira por domínio; a migração para o backend é
`EXPO_PUBLIC_DATA_SOURCE=http` + ajuste de paths; testabilidade (injeta-se um
fake); e o `*.contract.ts` documenta a API esperada do C#.

---

## 2. O que foi implementado

### 2.1 Seletor de fonte — `src/shared/data/`

```ts
// EXPO_PUBLIC_DATA_SOURCE === "http" ? http : mock   (padrão: "mock")
export const DATA_SOURCE: "mock" | "http";
export function resolveDataSource<T>(impls: { mock: T; http: T }): T;
```

Também exposto em `src/shared/config/env.ts` (`env.dataSource`, validado por Zod).

### 2.2 Anatomia da camada `services/` de cada fatia

| Arquivo               | Papel                                                                                                          |
| --------------------- | -------------------------------------------------------------------------------------------------------------- |
| `<x>.contract.ts`     | **Tipo do repositório** — a interface. É o contrato esperado do backend C#.                                    |
| `<x>.fixtures.ts`     | Dados mockados crus (arrays/objetos), sem lógica.                                                              |
| `<x>.mock.ts`         | Implementação do contrato usando fixtures / estado em memória + `Zod.parse`. Exporta `__reset<X>` para testes. |
| `<x>.http.ts`         | Implementação do contrato via `httpClient` (`@/shared/api`) + `Zod.parse`. Paths são a proposta de rotas.      |
| `<x>Repository.ts`    | `resolveDataSource({ mock, http })` — **o único símbolo que ViewModels/queries importam**.                     |
| `<x>Queries.ts`       | Hooks React Query (`use…Query`, `use…Mutation`) que chamam o repositório. Invalidação de cache nas mutations.  |
| `selected<X>Store.ts` | (quando aplicável) slice Zustand só com o **id selecionado** (cliente).                                        |

Fluxo: `views → viewmodels → services/*Queries → services/*Repository → (*.mock | *.http)`.

### 2.3 Repositórios por fatia (contratos = contrato do backend)

| Fatia            | Repositório (`*.contract.ts`)                                                                                            | Rotas HTTP propostas                                                                                                           |
| ---------------- | ------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------ |
| `establishments` | `getFeed`, `searchSalvados`, `getSalvadoById`, `getSalvadosByEstablishment`, `getEstablishments`, `getEstablishmentById` | `/salvados/feed`, `/salvados`, `/salvados/:id`, `/estabelecimentos/:id/salvados`, `/estabelecimentos`, `/estabelecimentos/:id` |
| `orders`         | `getOrders`, `getOrderById`, `createOrder(CreateOrderInput)`                                                             | `GET/POST /pedidos`, `GET /pedidos/:id`                                                                                        |
| `addresses`      | `getAddresses`, `saveAddress(AddressDraft)`, `deleteAddress(id)`                                                         | `GET /enderecos`, `POST/PUT /enderecos[/:id]`, `DELETE /enderecos/:id`                                                         |
| `payments`       | `getMethods`, `addCard(NewCardInput)`                                                                                    | `GET /pagamentos/metodos`, `POST /pagamentos/cartoes`                                                                          |
| `notifications`  | `getNotifications`, `markRead(id)`, `markAllRead`                                                                        | `GET /notificacoes`, `POST /notificacoes/:id/lida`, `POST /notificacoes/lidas`                                                 |
| `profile`        | `getCurrentUser`, `updateProfile(ProfilePatch)`                                                                          | `GET /perfil`, `PATCH /perfil`                                                                                                 |
| `impact`         | `getSummary`                                                                                                             | `GET /impacto/resumo`                                                                                                          |

### 2.4 O que permanece em Zustand (estado de cliente)

| Store                                     | Guarda                                       |
| ----------------------------------------- | -------------------------------------------- |
| `cart/services/cartStore`                 | conteúdo da sacola (linhas, estabelecimento) |
| `addresses/services/selectedAddressStore` | id do endereço de entrega ativo              |
| `payments/services/selectedPaymentStore`  | id da forma de pagamento ativa               |
| `favorites/services/favoritesStore`       | ids de estabelecimentos favoritos            |

`useSelectedAddress()` / `useSelectedPaymentMethod()` combinam a lista
(repositório) com o id (store); sem seleção explícita usam o item `isDefault`.

### 2.5 Como ligar o backend depois

1. `EXPO_PUBLIC_DATA_SOURCE=http` (`.env` / `app.config`).
2. `EXPO_PUBLIC_API_BASE_URL=https://...` (já lido em `@/shared/config`).
3. Conferir/ajustar os paths e os _payloads_ em cada `*.http.ts`.
4. Token de sessão: preencher o interceptor em `src/shared/api/httpClient.ts`.

Nenhuma ViewModel, tela, presenter ou hook de query muda.

---

## 3. Compatibilidade Android/iOS — o que mudou nas telas

| Área                        | Problema (antes)                                                                                                                                              | Correção                                                                                                                                                                                                      |
| --------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Tipografia**              | tokens combinavam `fontFamily: Inter_700Bold` **e** `fontWeight: "700"` → _faux bold_ (negrito sintético) no Android                                          | `fontWeight` removido dos tokens — o peso vem da própria família Inter; fallback nativo por plataforma (`fontFallback`)                                                                                       |
| **Texto (base)**            | `includeFontPadding` do Android adiciona padding no glifo e desalinha texto/ícone e o `lineHeight` do design                                                  | `Text` aplica `includeFontPadding: false` no Android; `maxFontSizeMultiplier` (1.4) limita fontes gigantes do sistema sem quebrar layout                                                                      |
| **Status bar / notch**      | `SafeAreaView` do `Screen` pintava o inset superior de cinza, deixando uma faixa acima dos cabeçalhos brancos; e no notch/ilha o conteúdo podia colar no topo | `AppHeader`, `ScreenHeader` e os cabeçalhos locais aplicam `useSafeAreaInsets().top` com fundo branco; `Screen` deixou de pedir o edge `top` por padrão; botão "voltar" flutuante do Detalhe usa `insets.top` |
| **Teclado**                 | formulários (endereço, cartão, editar perfil) tinham o campo coberto pelo teclado                                                                             | `Screen` ganhou `avoidKeyboard` → `KeyboardAvoidingView` com `behavior` por plataforma (`padding` no iOS; `adjustResize` do Android faz o resto); `app.json` → `android.softwareKeyboardLayoutMode: "resize"` |
| **Sombra / elevação**       | cards e barras só tinham borda; sem separação visual ao rolar; risco de `shadow*` (iOS) sem `elevation` (Android)                                             | helper `elevation(1                                                                                                                                                                                           | 2   | 3)`com`Platform.select`(iOS`shadow*`, Android `elevation`); aplicado a `Card`, cabeçalhos, `AppTabBar` e rodapés fixos |
| **Feedback de toque**       | só `opacity` no press                                                                                                                                         | `android_ripple` em `PrimaryButton`/`SecondaryButton` (com `overflow: hidden` p/ recortar), `ListRow` e itens da `AppTabBar`; iOS mantém o press-opacity                                                      |
| **Scroll**                  | `keyboardDismissMode` fixo                                                                                                                                    | `interactive` no iOS, `on-drag` no Android; barras de rolagem ocultas                                                                                                                                         |
| **Tema**                    | app poderia herdar dark mode do SO                                                                                                                            | `app.json` já fixa `userInterfaceStyle: "light"`; adicionado `backgroundColor` global para o flash de inicialização                                                                                           |
| **Carregamento assíncrono** | telas que liam de store síncrono agora leem de React Query                                                                                                    | `ProfileScreen` e afins ganharam estado de _loading_ explícito                                                                                                                                                |

Bundle verificado para **as duas plataformas** (`npx expo export --platform android --platform ios`) — compila sem erros.

---

## 4. Verificação

```
yarn typecheck   → OK
yarn lint        → OK
yarn test        → 25 testes, 8 suites  (inclui repositório: orders.mock, addresses.mock, dataSource)
expo export (android + ios) → OK
```

---

## 5. Pendências / próximos passos

- Backend C# .NET implementando os contratos da §2.3; então `EXPO_PUBLIC_DATA_SOURCE=http`.
- Testes de ViewModel (`renderHook` + `QueryClientProvider`) e de tela.
- Persistir os slices de cliente (`cart`, seleção de endereço/pagamento) com
  `zustand/middleware` + `AsyncStorage`.
- `favorites` e `authentication` seguindo o mesmo padrão de repositório.
- Ripple/realce de toque também em `SelectableRow` e `FilterChip` (cosmético).
