import { z } from "zod";

/**
 * Usuário autenticado. Nesta etapa é um usuário fixo mockado (sem login).
 * Schema = contrato do backend C# .NET.
 */
export const currentUserSchema = z.object({
  id: z.string(),
  fullName: z.string(),
  email: z.string().email(),
  phone: z.string(),
  /** ISO date do início da conta. */
  memberSince: z.string(),
  avatarUrl: z.string().url().nullable(),
});
export type CurrentUser = z.infer<typeof currentUserSchema>;

export function displayName(user: CurrentUser): string {
  const [first, second] = user.fullName.split(" ");
  return second ? `${first} ${second}` : first;
}

export function memberSinceLabel(user: CurrentUser): string {
  const d = new Date(user.memberSince);
  const month = d.toLocaleDateString("pt-BR", { month: "long" });
  return `Membro desde ${month[0].toUpperCase()}${month.slice(1)} de ${d.getFullYear()}`;
}
