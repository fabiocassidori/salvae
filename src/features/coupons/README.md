# feature: coupons

Cupons e promoções. **Não implementada nesta etapa.**

No Salvaê, a economia é comunicada como **"Impacto Salvo"** (ver
`@/shared/ui` → `PriceTag` e `@/features/impact`), não como "desconto". Cupons
entram depois como um complemento (código promocional, "Clube Salvaê",
"Compre 1, Salve 1").

## Quando implementar

- `model/` — schema Zod de cupom + cálculo de desconto (puro).
- `services/` — `useCouponsQuery`, `useValidateCouponMutation`; store do cupom aplicado.
- `viewmodels/` — `useApplyCouponViewModel`.
- `views/` — CouponList, ApplyCoupon.
- Expor `useAppliedCoupon()` para o `@/features/checkout`.
