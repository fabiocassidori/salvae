// API pública da feature — só o que outras fatias podem consumir.
export { ExampleListScreen } from "./views/screens/ExampleListScreen";
export { useExamplesQuery, exampleKeys } from "./services/exampleQueries";
export type { Example } from "./model/example";
