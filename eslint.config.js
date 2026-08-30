// https://docs.expo.dev/guides/using-eslint/ (Flat config, SDK 57)
const { defineConfig } = require("eslint/config");
const expoConfig = require("eslint-config-expo/flat");
const eslintPluginPrettierRecommended = require("eslint-plugin-prettier/recommended");

module.exports = defineConfig([
  expoConfig,
  eslintPluginPrettierRecommended,

  { ignores: ["dist/*", "node_modules/*", ".expo/*", "babel.config.js"] },

  // ─── Fronteiras de arquitetura (vertical slice) ──────────────────────────────
  {
    files: ["src/**/*.{ts,tsx}"],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            {
              group: ["@/features/*/*"],
              message:
                'Importe outra feature apenas pelo barrel público: "@/features/<feature>". O interior da fatia é privado.',
            },
          ],
        },
      ],
    },
  },

  // shared/ não pode depender de features/ nem de app/
  {
    files: ["src/shared/**/*.{ts,tsx}"],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            {
              group: ["@/features/*", "@/features/*/*", "@/app", "@/app/*"],
              message: "A camada `shared` não pode depender de `features/` nem de `app/`.",
            },
          ],
        },
      ],
    },
  },

  // ─── Fronteiras MVVM dentro de uma fatia ─────────────────────────────────────
  // View só conversa com a ViewModel (mais `shared` e `navigation`).
  {
    files: ["src/features/*/views/**/*.{ts,tsx}"],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            {
              group: ["../services/**", "../../services/**", "../model/**", "../../model/**"],
              message:
                "A View não acessa `services/` nem `model/` diretamente. Passe pela ViewModel.",
            },
          ],
        },
      ],
    },
  },

  // ViewModel não importa JSX/telas.
  {
    files: ["src/features/*/viewmodels/**/*.{ts,tsx}"],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            {
              group: ["../views/**", "../../views/**"],
              message: "A ViewModel não conhece a View. Ela expõe estado + ações; a View consome.",
            },
          ],
        },
      ],
    },
  },

  // Testes podem importar o que precisarem.
  {
    files: ["**/*.test.{ts,tsx}", "**/__tests__/**/*.{ts,tsx}"],
    rules: { "no-restricted-imports": "off" },
  },
]);
