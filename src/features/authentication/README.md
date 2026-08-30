# feature: authentication

Login, cadastro, verificação por código (OTP/SMS) e ciclo de vida da sessão.

## Status nesta etapa

**Não implementada.** Por decisão do projeto, esta entrega usa um **usuário fixo
mockado** (ver `@/features/profile` → `useCurrentUser`), sem telas de login, para
permitir a navegação offline.

## Quando implementar (mesmo modelo MVVM + vertical slice)

- `model/` — schemas Zod de credenciais e sessão; regra de token expirado.
- `services/` — endpoints de auth + mutations; `sessionStore` (Zustand) com token.
- `viewmodels/` — `useSignInViewModel`, `useOtpViewModel`.
- `views/` — SignIn, SignUp, OtpVerification.
- Expor `useSession()` para o interceptor em `@/shared/api` e para o `RootNavigator`
  decidir entre fluxo autenticado e não autenticado.
