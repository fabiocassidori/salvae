// API pública da fatia `profile`.
export { ProfileScreen } from "./views/screens/ProfileScreen";
export { EditProfileScreen } from "./views/screens/EditProfileScreen";
export { SettingsScreen } from "./views/screens/SettingsScreen";
export { useCurrentUser } from "./viewmodels/userHooks";

// Camada de repositório + hooks de query
export { profileRepository } from "./services/profileRepository";
export type { ProfileRepository, ProfilePatch } from "./services/profileRepository";
export { useCurrentUserQuery } from "./services/profileQueries";

export type { CurrentUser } from "./model/user";
