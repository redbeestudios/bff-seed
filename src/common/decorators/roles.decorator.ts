import { SetMetadata } from "@nestjs/common";
import { UserRole } from "../../common/enums";

export const ROLES_KEY = "roles";

/**
 * Requires one of the given roles to access an endpoint.
 * @example
 * @RequireRoles(UserRole.ADMIN)
 * @RequireRoles(UserRole.ADMIN, UserRole.USER)
 */
export const RequireRoles = (...roles: UserRole[]) =>
  SetMetadata(ROLES_KEY, roles);
