import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Logger,
} from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { PERMISSIONS_KEY } from "../../common/decorators/permissions.decorator";
import { Permission } from "../../common/enums";

/**
 * Validates permissions at the endpoint level.
 *
 * Usage:
 * @UseGuards(JwtAuthGuard, PermissionsGuard)
 * @RequirePermissions(Permission.MANAGE)
 *
 * Grants access if the authenticated user has at least one of the required permissions.
 */
@Injectable()
export class PermissionsGuard implements CanActivate {
  private readonly logger = new Logger(PermissionsGuard.name);

  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredPermissions = this.reflector.getAllAndOverride<
      (Permission | string)[]
    >(PERMISSIONS_KEY, [context.getHandler(), context.getClass()]);

    if (!requiredPermissions || requiredPermissions.length === 0) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user) {
      this.logger.warn(
        "Unauthenticated user attempted to access a permission-protected resource",
      );
      throw new ForbiddenException("User not authenticated");
    }

    const userPermissions = user.permissions || [];
    const hasPermission = requiredPermissions.some((permission) =>
      userPermissions.includes(permission),
    );

    if (!hasPermission) {
      this.logger.warn(
        `Access denied. User ${user.email || user.username} lacks any of the required ` +
          `permissions: [${requiredPermissions.join(", ")}]`,
      );
      throw new ForbiddenException(
        "You do not have the required permissions to access this resource",
      );
    }

    return true;
  }
}
