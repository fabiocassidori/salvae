import type { CurrentUser } from "../model/user";

/** Usuário fixo mockado desta etapa (sem autenticação real). */
export const MOCK_USER: CurrentUser = {
  id: "usr-joao-silva",
  fullName: "João Miguel da Silva",
  email: "joao.silva@exemplo.com.br",
  phone: "+55 (11) 98765-4321",
  memberSince: "2023-03-01",
  avatarUrl: "https://picsum.photos/seed/joao-silva/200",
};
