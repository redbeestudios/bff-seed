import {
  Injectable,
  ExecutionContext,
  UnauthorizedException,
  Logger,
} from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { Observable } from "rxjs";
import { TokenBlacklistService } from "../../common/services/token-blacklist.service";

@Injectable()
export class JwtAuthGuard extends AuthGuard("jwt") {
  private readonly logger = new Logger(JwtAuthGuard.name);

  constructor(private tokenBlacklistService: TokenBlacklistService) {
    super();
  }

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);

    if (!token) {
      this.logger.warn("No authentication token provided");
      throw new UnauthorizedException("No token provided");
    }

    if (this.tokenBlacklistService.isBlacklisted(token)) {
      this.logger.warn(
        `Revoked token attempted access: ${token.substring(0, 20)}...`,
      );
      throw new UnauthorizedException("Token revoked");
    }

    return super.canActivate(context);
  }

  handleRequest(err: any, user: any, info: any, _context: ExecutionContext) {
    if (err || !user) {
      const errorMessage = info?.message || err?.message || "Unauthorized";
      this.logger.warn(`Authentication failed: ${errorMessage}`);
      throw err || new UnauthorizedException(errorMessage);
    }

    this.logger.debug(
      `Authenticated user: ${user.email || user.username || user.userId}`,
    );
    return user;
  }

  private extractTokenFromHeader(request: any): string | undefined {
    const [type, token] = request.headers.authorization?.split(" ") ?? [];
    return type === "Bearer" ? token : undefined;
  }
}
