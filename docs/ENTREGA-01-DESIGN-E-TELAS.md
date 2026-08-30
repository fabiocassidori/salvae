# Entrega 01 — Design System, Telas e Dados Mockados

**App:** Salvaê — resgate de alimentos próximos do vencimento.
**Escopo desta etapa:** design system + telas navegáveis + dados mockados
(offline), estruturados para virar contrato do backend em **C# .NET**.
**Stack e arquitetura:** ver [`ARCHITECTURE.md`](./ARCHITECTURE.md).

---

## 1. Como rodar

```bash
yarn install
yarn start          # Expo — abrir no Expo Go / emulador
yarn typecheck      # tsc --noEmit
yarn lint           # ESLint (flat config) + regras de fronteira
yarn test           # Jest (regras de domínio puras)
```

> As imagens usam URLs `picsum.photos` como placeholder; **offline elas não
> carregam** e o card mostra o fundo neutro — comportamento esperado nesta etapa.

---

## 2. Conceito e glossário aplicados

O app **não** é um clone de iFood: o diferencial é comida **próxima do
vencimento, própria para consumo**, num modelo de **compra no app** (carrinho +
checkout + pagamento) com **retirada no local ou entrega**.

Glossário de marca usado literalmente em telas, tipos e DTOs
(fonte: `contexto-design.md` §2 e `contexto-negocio.md` §1):

| Termo                        | Significado no produto                                                                     |
| ---------------------------- | ------------------------------------------------------------------------------------------ |
| **Salvado**                  | O item resgatado (entidade `Salvado`).                                                     |
| **Estabelecimento parceiro** | O vendedor (entidade `Establishment`).                                                     |
| **Janela de Salvamento**     | Contagem regressiva até a **oferta** expirar (`offerExpiresAt`, chip "encerra em 45 min"). |
| **Janela de retirada**       | Intervalo para retirar/receber (`pickupWindow`, "18:00 – 19:30").                          |
| **Impacto Salvo**            | Economia (preço original − atual) **+** massa de comida resgatada (kg).                    |
| **Selo Salvaê de Segurança** | Bloco obrigatório em todo Salvado: prazo, conservação, responsável.                        |
| **Pedido**                   | A compra (`Order`) — usamos "Pedido", não "Reserva".                                       |

Decisões desta etapa (registradas do alinhamento com o cliente):

- Termo **"Pedido"** e **compra no app** prevalecem sobre o glossário antigo
  ("Reservar" / "sem pagamento no app"). As telas do protótipo que diziam
  "Reserva" foram geradas como **"Pedido"**.
- **Pagamento:** cartão e Pix no app **+** opção "Pagar na retirada".
- **Recebimento:** o usuário escolhe **Retirada** (sem taxa) ou **Entrega**
  (taxa fixa mock de R$ 6,99).
- **Autenticação:** usuário fixo mockado (João Silva), sem telas de login.
- **Gamificação (`impact`):** fatia completa — contador, níveis
  Bronze/Prata/Ouro e "Salvaê Streak".
- **Catálogo:** concentrado na fatia `establishments` (Salvados como subárea).

---

## 3. Design System (`src/shared/`)

Implementação fiel a `contexto-design.md`. Nada de valores fora dos tokens.

### 3.1 Tokens

| Token                                  | Valor                                                                          | Uso                                                                |
| -------------------------------------- | ------------------------------------------------------------------------------ | ------------------------------------------------------------------ |
| `colors.brandPrimary`                  | `#1E7A4C`                                                                      | Ações primárias, selos, aba ativa                                  |
| `colors.urgency` / `urgencyBg`         | `#8A5300` / `#FDF0D9`                                                          | **Exclusivo** do chip de contagem regressiva / status "aguardando" |
| `colors.textPrimary` / `textSecondary` | `#22252A` / `#5B6068`                                                          | Texto base / metadados                                             |
| `colors.surfaceBase` / `surfaceBg`     | `#FFFFFF` / `#F4F5F6`                                                          | Cards e barras / fundo de tela                                     |
| `colors.feedbackError`                 | `#B3261E`                                                                      | **Somente** erro de sistema (nunca prazo)                          |
| `spacing`                              | 4 / 8 / 16 / 24 / 32                                                           | Grade base 8                                                       |
| `radius`                               | card/field 8, button 12, chip 24                                               |                                                                    |
| `screenMargin`                         | 16                                                                             | Margem lateral de tela                                             |
| `minTouchTarget`                       | 48                                                                             | Alvo de toque mínimo (WCAG 2.5.5)                                  |
| `typography`                           | `titulo` 24/32 bold · `subtitulo` 18/24 medium · `corpo` 16/24 · `apoio` 14/20 | Escala restrita; mínimo 14                                         |
| `fontFamily`                           | `Inter_400/500/700`                                                            | Carregada em `useAppFonts()`; app segura a UI até carregar         |

Acessibilidade transversal:

- `Text` força `textAlign: "left"` e só aceita as 4 variantes (sem tamanho livre).
- Toda informação de tempo/segurança/preço tem **redundância** ícone + texto
  (WCAG 1.4.1) — nunca só cor.
- Vermelho jamais comunica prazo; o "ponto de novidade" do sino é verde.
- Alvos de toque de 48dp em botões, abas, steppers, ícones de header.

### 3.2 Componentes reutilizáveis (`src/shared/ui/`)

| Componente                                                                                                              | Papel                                                                                                                     |
| ----------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------- |
| `Text`                                                                                                                  | Tipografia restrita + alinhamento à esquerda                                                                              |
| `Screen`                                                                                                                | Container de tela (safe area, fundo, margem, footer fixo)                                                                 |
| `Card`                                                                                                                  | Superfície branca raio 8, opcionalmente tocável                                                                           |
| `PrimaryButton` / `SecondaryButton`                                                                                     | Botões (altura 48, rótulo no infinitivo, 1 primário por tela)                                                             |
| `OfferCard`                                                                                                             | **Card de Oferta** (§6): imagem 72, nome, `SafeBadge`, `CountdownChip` (nunca omitido), `PriceTag`; toque no card inteiro |
| `SafetySeal`                                                                                                            | **Selo Salvaê de Segurança**: borda verde 1dp, 3 linhas obrigatórias                                                      |
| `SafeBadge`                                                                                                             | Selo compacto "Consumo Seguro"                                                                                            |
| `CountdownChip`                                                                                                         | Chip da Janela de Salvamento (`#FDF0D9`/`#8A5300`, relógio, auto-refresh 1 min)                                           |
| `PriceTag`                                                                                                              | Preço original riscado + atual + "Impacto salvo R$ X"                                                                     |
| `Money`                                                                                                                 | Formatação BRL a partir de centavos                                                                                       |
| `FilterChip`                                                                                                            | Chip de filtro/ordenação selecionável                                                                                     |
| `SectionHeader`                                                                                                         | Título de seção + ação "Ver tudo"                                                                                         |
| `SelectableRow`                                                                                                         | Linha estilo rádio (tipo de recebimento, forma de pagamento)                                                              |
| `ListRow`                                                                                                               | Linha de menu (Perfil) com chevron / variante destrutiva                                                                  |
| `InfoRow`                                                                                                               | Ícone + rótulo/valor (Selo, cards Local/Resumo)                                                                           |
| `AddressCard`                                                                                                           | Cartão de endereço com etiqueta "PRINCIPAL"                                                                               |
| `TextField`                                                                                                             | Campo de formulário com erro (único uso do vermelho)                                                                      |
| `QuantityStepper`                                                                                                       | +/- de quantidade na sacola (alvos 48dp)                                                                                  |
| `StatusPill`                                                                                                            | Selo de status do pedido (âmbar p/ aguardando, verde p/ concluído)                                                        |
| `Avatar`, `IconTile`, `Tag`, `Divider`, `EmptyState`, `SearchField`, `AppHeader`, `ScreenHeader`, `SafeAreaInsetBottom` | Apoio                                                                                                                     |
| `AppTabBar` (`src/app/navigation`)                                                                                      | Barra de abas com aba ativa em "pílula" verde                                                                             |

### 3.3 Utilitários (`src/shared/utils/`)

`formatCurrencyBRL(cents)`, `formatWeightKg(grams)`, `formatPickupWindow(a,b)`,
`getCountdown(expiresAtISO)` → `{ totalMinutes, expired, label }`.

---

## 4. Mapa de telas

| #   | Tela                                                     | Origem                          | Fatia / Rota                       |
| --- | -------------------------------------------------------- | ------------------------------- | ---------------------------------- |
| 1   | **Início** (feed "Salvados Perto de Você")               | protótipo                       | `establishments` · `InicioTab`     |
| 2   | **Explorar** (busca + ordenação)                         | protótipo                       | `establishments` · `ExplorarTab`   |
| 3   | **Detalhe do Salvado** (hero, Selo, sobre, preço)        | protótipo                       | `establishments` · `SalvadoDetail` |
| 4   | **Ver tudo** (lista completa de Salvados)                | fluxo                           | `establishments` · `SalvadoList`   |
| 5   | **Perfil do Estabelecimento**                            | fluxo                           | `establishments` · `Establishment` |
| 6   | **Sacola**                                               | fluxo                           | `cart` · `Cart`                    |
| 7   | **Confirmar Pedido** (recebimento + pagamento + resumo)  | protótipo ("Confirmar Reserva") | `checkout` · `Checkout`            |
| 8   | **Pedido confirmado** (sucesso, nº do pedido)            | fluxo                           | `orders` · `OrderConfirmed`        |
| 9   | **Meus Pedidos** (em andamento + histórico)              | protótipo ("Minhas Reservas")   | `orders` · `PedidosTab`            |
| 10  | **Detalhe do Pedido** (linha do tempo, itens, pagamento) | fluxo ("Ver Detalhes")          | `orders` · `OrderDetail`           |
| 11  | **Perfil** (dados, endereços, impacto, config, sair)     | protótipo                       | `profile` · `PerfilTab`            |
| 12  | **Editar Perfil**                                        | fluxo                           | `profile` · `EditProfile`          |
| 13  | **Configurações da Conta**                               | fluxo                           | `profile` · `Settings`             |
| 14  | **Meus Endereços**                                       | protótipo (bloco do Perfil)     | `addresses` · `AddressList`        |
| 15  | **Adicionar / Editar Endereço**                          | fluxo                           | `addresses` · `AddressForm`        |
| 16  | **Novo Cartão**                                          | fluxo                           | `payments` · `AddCard`             |
| 17  | **Meu Impacto** (níveis, streak, estatísticas)           | fluxo                           | `impact` · `Impact`                |
| 18  | **Notificações**                                         | fluxo (ícone de sino)           | `notifications` · `Notifications`  |

### Navegação

`RootStack` (native-stack) = **`Tabs`** (Início · Explorar · Pedidos · Perfil,
via `AppTabBar` custom) **+** telas empilháveis transversais (Detalhe, Sacola,
Checkout, Pedido, telas do Perfil). Cada fatia expõe suas telas pelo `index.ts`;
a montagem fica em [`src/app/navigation/RootNavigator.tsx`](../src/app/navigation/RootNavigator.tsx).
Contrato de rotas tipado em `src/app/navigation/routes.ts` (`RootStackParamList`,
`TabScreenProps`, `RootStackScreenProps`).

Fluxo de compra: `Detalhe → (Adicionar à sacola) → Sacola → Checkout → Pedido
confirmado → Detalhe do Pedido`. Ao confirmar, a sacola é esvaziada.

---

## 5. Modelo de dados mockado → contrato do backend C# .NET

Convenções: **dinheiro em centavos** (`int`), **datas em ISO 8601** (`string`),
**IDs `string`**, **enums estáveis** (constantes em MAIÚSCULAS). Todo schema é
Zod e a validação roda na borda do repositório (`*.parse`), então trocar mock
por `HttpClient` real não muda os tipos.

### 5.1 `Establishment` — `src/features/establishments/model/establishment.ts`

| Campo                  | Tipo                         | Notas                                                          |
| ---------------------- | ---------------------------- | -------------------------------------------------------------- |
| `id`                   | string                       |                                                                |
| `name`                 | string                       |                                                                |
| `category`             | enum `EstablishmentCategory` | `BAKERY` `GROCERY` `PRODUCE` `RESTAURANT` `BUTCHER` `PHARMACY` |
| `logoUrl` / `coverUrl` | string \| null               | URL                                                            |
| `addressLine`          | string                       |                                                                |
| `distanceMeters`       | int ≥ 0                      | usado para ordenação por proximidade                           |
| `rating`               | number 0–5                   | avaliação geral                                                |
| `safetyRating`         | number 0–5                   | avaliação **de segurança do produto** (separada)               |
| `isVerifiedPartner`    | bool                         | curadoria de parceiros                                         |

### 5.2 `Salvado` — `src/features/establishments/model/salvado.ts`

| Campo                                   | Tipo                                                                         | Notas                                                    |
| --------------------------------------- | ---------------------------------------------------------------------------- | -------------------------------------------------------- |
| `id`, `establishmentId`                 | string                                                                       |                                                          |
| `name`, `description`                   | string                                                                       |                                                          |
| `imageUrl`                              | string (URL)                                                                 |                                                          |
| `category`                              | enum `SalvadoCategory`                                                       | `HOT_MEAL` `BAKERY` `GROCERY` `PRODUCE` `DAIRY` `SWEETS` |
| `kind`                                  | enum `SalvadoKind`                                                           | `REGULAR` \| `SURPRISE_BAG` (Caixa Surpresa)             |
| `originalPriceInCents` / `priceInCents` | int ≥ 0                                                                      |                                                          |
| `weightGrams`                           | int > 0                                                                      | base do Impacto Salvo em kg                              |
| `quantityAvailable`                     | int ≥ 0                                                                      |                                                          |
| `publishedAt`                           | ISO                                                                          |                                                          |
| `offerExpiresAt`                        | ISO                                                                          | **Janela de Salvamento**                                 |
| `pickupWindow`                          | `{ date, startTime, endTime, label }`                                        | **Janela de retirada**                                   |
| `safetySeal`                            | `{ availability, conservation, responsible, consumeWithinHours: int\|null }` | Selo obrigatório                                         |
| `isSafe`                                | bool                                                                         | aprovado nos critérios de segurança                      |

Regras puras: `impactValueInCents`, `impactWeightGrams`, `discountPercent`,
`isOfferOpen(now)`.

### 5.3 `CartLine` / `Cart` — `src/features/cart/model/cart.ts`

`Cart = { establishmentId, establishmentName, establishmentAddressLine, lines[] }`
(uma loja por vez). `CartLine` é um **snapshot** do Salvado
(`salvadoId, name, imageUrl, unitPriceInCents, originalUnitPriceInCents,
weightGrams, quantity, maxQuantity, pickupWindowLabel`).
Regras: `cartSubtotalInCents`, `cartImpact` (`{valueInCents, weightGrams}`),
`cartItemCount`, `setLineQuantity` (limita ao estoque; zera → esvazia).

### 5.4 `Address` — `src/features/addresses/model/address.ts`

`id, label, kind (HOME|WORK|OTHER), street, number, complement, district, city,
state (2), zipCode, reference, isDefault`.

### 5.5 `PaymentMethod` — `src/features/payments/model/paymentMethod.ts`

`id, type (CREDIT_CARD|PIX|PAY_ON_PICKUP), label, brand|null, last4|null, isDefault`.

### 5.6 `Order` — `src/features/orders/model/order.ts`

| Campo                                                     | Tipo                                                              | Notas                                                                             |
| --------------------------------------------------------- | ----------------------------------------------------------------- | --------------------------------------------------------------------------------- |
| `id`                                                      | string                                                            |                                                                                   |
| `code`                                                    | string                                                            | legível, ex.: `SV-892A`                                                           |
| `status`                                                  | enum `OrderStatus`                                                | `PLACED` `PREPARING` `READY_FOR_PICKUP` `OUT_FOR_DELIVERY` `COMPLETED` `CANCELED` |
| `fulfillmentType`                                         | enum `FulfillmentType`                                            | `PICKUP` \| `DELIVERY`                                                            |
| `createdAt`                                               | ISO                                                               |                                                                                   |
| `establishment`                                           | `{ id, name, addressLine }`                                       | snapshot                                                                          |
| `lines`                                                   | `OrderLine[]` = `{ salvadoId, name, quantity, unitPriceInCents }` |                                                                                   |
| `fulfillmentWindowLabel`                                  | string                                                            | "Retire entre 18:00 e 19:30" / "Entrega hoje…"                                    |
| `deliveryAddressLine`                                     | string \| null                                                    | quando `DELIVERY`                                                                 |
| `subtotalInCents` / `deliveryFeeInCents` / `totalInCents` | int ≥ 0                                                           |                                                                                   |
| `paymentLabel`                                            | string                                                            | ex.: "Visa •••• 4821" / "Pagar na retirada"                                       |
| `paidInApp`                                               | bool                                                              |                                                                                   |
| `impactValueInCents` / `impactWeightGrams`                | int ≥ 0                                                           | Impacto Salvo do pedido                                                           |

Regras: `isOpenOrder`, `statusLabel(order)` (sensível a retirada/entrega),
`timelineSteps(order)`. Criação via `CreateOrderInput` (checkout).

### 5.7 `ImpactSummary` — `src/features/impact/model/impact.ts`

`totalWeightGrams, totalValueInCents, mealsDonated, ordersCount, streakDays`.
Níveis `BRONZE` (0 kg) / `SILVER` (≥ 10 kg) / `GOLD` (≥ 50 kg) via `levelFor`.
`co2eKgAvoided` = 2,5 kg CO₂e por kg (proxy).

### 5.8 `AppNotification` — `src/features/notifications/model/notification.ts`

`id, type (OFFER_NEARBY|ORDER_UPDATE|FAVORITE_PUBLISHED|IMPACT|SYSTEM), title,
body, createdAt, read, salvadoId|null, orderId|null`.

### 5.9 `CurrentUser` — `src/features/profile/model/user.ts`

`id, fullName, email, phone, memberSince (ISO date), avatarUrl|null`.
Usuário fixo mockado nesta etapa.

### Onde estão os mocks

`src/features/*/services/*.mock.ts` (ou o próprio `*Store.ts` / `*Queries.ts`).
Os repositórios (`*Repository.ts`) já fazem `schema.parse(...)` — trocar o corpo
por chamada HTTP é a única mudança para integrar o backend.

---

## 6. Cobertura de testes desta etapa

`yarn test` — 18 testes de regra de domínio pura:
`salvado` (impacto, desconto, oferta aberta), `cart` (subtotal, impacto, limite
de estoque), `order` (rótulo de status, linha do tempo), `impact` (níveis,
CO₂e), `utils` (moeda, peso, contagem regressiva).

---

## 7. Pendências / próximos passos

- Autenticação real (`authentication`) + token no interceptor `@/shared/api`.
- Persistência de sacola/sessão/preferências (`AsyncStorage` + `zustand/middleware`).
- Substituir `picsum.photos` por assets/CDN reais; estados de imagem com fallback.
- Backend C# .NET expondo os contratos da seção 5; repositórios trocam mock por HTTP.
- Telas de teste (ViewModel/Componente) por fatia; CI com `typecheck + lint + test`.
- `favorites` com tela dedicada; `coupons` / "Compre 1, Salve 1" / doações
  ("Salvados Solidários"); mapa em tempo real; Clube Salvaê.
- `notifications` com push real (`expo-notifications`).
