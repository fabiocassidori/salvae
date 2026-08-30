# `features/` — fatias verticais (MVVM)

Uma pasta por funcionalidade de negócio. Cada fatia é **autocontida** e expõe
uma API pública mínima pelo seu `index.ts`.

## Anatomia de uma feature

```
features/<feature>/
├── model/          # MODEL (domínio): entidades + schemas Zod + regras puras. Sem React/axios.
├── services/       # CAMADA DE REPOSITÓRIO:
│   ├── <x>.contract.ts     #   interface do repositório (= contrato do backend C#)
│   ├── <x>.fixtures.ts     #   dados mockados crus
│   ├── <x>.mock.ts         #   implementação MOCK (fixtures + Zod.parse)
│   ├── <x>.http.ts         #   implementação HTTP (httpClient + Zod.parse)
│   ├── <x>Repository.ts    #   resolveDataSource({ mock, http }) — o único símbolo público
│   ├── <x>Queries.ts       #   hooks React Query que chamam o repositório
│   └── selected<X>Store.ts #   (quando houver) slice Zustand só do id selecionado
├── viewmodels/     # VIEWMODEL: hooks use<Tela>ViewModel — estado de apresentação + ações. Sem JSX.
├── views/          # VIEW: screens/ + components/ — só renderização. 1 ViewModel por screen.
├── index.ts        # API PÚBLICA — única porta de entrada para outras fatias
└── README.md       # (opcional) escopo, o que expõe, de quem depende
```

Crie só as pastas que a feature usar. As telas são registradas em
`src/app/navigation/RootNavigator.tsx` (a fatia expõe a tela pelo barrel; a
navegação é montada na camada `app/`).

## Regras

- **Importe outra feature só pelo barrel**: `@/features/orders`, nunca
  `@/features/orders/services/ordersRepository`.
- **View → ViewModel → services/model** (nunca pular etapas). Reforçado por ESLint.
- **ViewModel não tem JSX**; **View não faz fetch nem acessa store**.
- **Validação Zod na borda** (`services/…Repository.ts`), não nas telas.
- **Sem import circular** entre features. Se A↔B, extraia o comum para `shared/`.
- Teste ao lado do arquivo: `salvado.test.ts` junto de `salvado.ts`.

## Mapa de features (Salvaê)

| Feature          | Responsabilidade                                                              | Status       |
| ---------------- | ----------------------------------------------------------------------------- | ------------ |
| `establishments` | Salvados + parceiros: Início, Explorar, Detalhe, Ver tudo, Perfil do parceiro | implementada |
| `cart`           | sacola (Zustand + regras puras)                                               | implementada |
| `checkout`       | recebimento (retirada/entrega) + pagamento + criação do pedido                | implementada |
| `orders`         | "Pedido": lista, detalhe (linha do tempo), confirmação                        | implementada |
| `payments`       | formas de pagamento (cartão, Pix, pagar na retirada)                          | implementada |
| `addresses`      | CRUD de endereços + endereço de entrega ativo                                 | implementada |
| `profile`        | Perfil, Editar, Configurações + usuário mockado                               | implementada |
| `impact`         | Impacto Salvo: níveis Bronze/Prata/Ouro, Salvaê Streak                        | implementada |
| `notifications`  | central de notificações + badge do sino                                       | implementada |
| `favorites`      | estabelecimentos favoritos (store + hooks)                                    | parcial      |
| `authentication` | login, cadastro, OTP, sessão                                                  | README       |
| `coupons`        | cupons, "Compre 1, Salve 1", doações                                          | README       |

Copie `_TEMPLATE/` para criar uma nova fatia.
