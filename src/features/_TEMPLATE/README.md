# feature: \_TEMPLATE

Molde de uma fatia vertical em **MVVM** com **camada de repositório**. Copie:

```
cp -r src/features/_TEMPLATE src/features/<nome-da-feature>
```

## Camadas

| Pasta         | Papel (MVVM)    | Regras                                                               |
| ------------- | --------------- | -------------------------------------------------------------------- |
| `model/`      | Model (domínio) | entidades + schemas Zod + regras puras. Sem React/axios.             |
| `services/`   | Model (dados)   | **camada de repositório** (ver abaixo).                              |
| `viewmodels/` | ViewModel       | hooks `use<Tela>ViewModel`: estado de apresentação + ações. Sem JSX. |
| `views/`      | View            | `screens/` e `components/`: só renderização. 1 ViewModel por screen. |
| `index.ts`    | API pública     | única porta de entrada para outras fatias.                           |

## `services/` — camada de repositório

| Arquivo                | Papel                                                                    |
| ---------------------- | ------------------------------------------------------------------------ |
| `example.contract.ts`  | tipo do repositório — a interface (= contrato do backend C# .NET).       |
| `example.fixtures.ts`  | dados mockados crus.                                                     |
| `example.mock.ts`      | implementação MOCK (fixtures/estado em memória + `Zod.parse`).           |
| `example.http.ts`      | implementação HTTP (`httpClient` + `Zod.parse`).                         |
| `exampleRepository.ts` | `resolveDataSource({ mock, http })` — **o único símbolo que sai daqui**. |
| `exampleQueries.ts`    | hooks React Query que chamam o repositório.                              |

Fluxo: `views → viewmodels → services/*Queries → services/*Repository → (mock | http)`.
Estado de cliente puro (seleção, flags) fica num `selected<X>Store.ts` (Zustand),
acessado direto pela ViewModel — **não** passa pelo repositório.

As telas empilháveis são registradas em `src/app/navigation/RootNavigator.tsx`.
