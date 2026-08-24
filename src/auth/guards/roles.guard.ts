import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Logger,
} from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { ROLES_KEY } from "../../common/decorators/roles.decorator";
import { UserRole } from "../../common/enums";

/**
 * Validates roles at the endpoint level.
 *
 * Usage:
 * @UseGuards(JwtAuthGuard, RolesGuard)
 * @RequireRoles(UserRole.ADMIN)
 *
 * Grants access if the authenticated user has at least one of the required roles.
 */
@Injectable()
export class RolesGuard implements CanActivate {
  private readonly logger = new Logger(RolesGuard.name);

  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!requiredRoles || requiredRoles.length === 0) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user) {
      this.logger.warn(
        "Unauthenticated user attempted to access a role-protected resource",
      );
      throw new ForbiddenException("User not authenticated");
    }

    const userRole: UserRole | undefined = user.role;
    const hasRole = requiredRoles.includes(userRole);

    if (!hasRole) {
      this.logger.warn(
        `Access denied. User ${user.email || user.username} with role "${userRole}" ` +
          `lacks any of the required roles: [${requiredRoles.join(", ")}]`,
      );
      throw new ForbiddenException(
        "You do not have the required role to access this resource",
      );
    }

    return true;
  }
}
