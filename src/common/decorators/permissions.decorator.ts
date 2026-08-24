import { SetMetadata } from "@nestjs/common";
import { Permission } from "../../common/enums";

export const PERMISSIONS_KEY = "permissions";

/**
 * Requires one of the given permissions to access an endpoint.
 * @example
 * @RequirePermissions(Permission.MANAGE)
 * @RequirePermissions(Permission.READ, Permission.WRITE)
 */
export const RequirePermissions = (...permissions: (Permission | string)[]) =>
  SetMetadata(PERMISSIONS_KEY, permissions);
