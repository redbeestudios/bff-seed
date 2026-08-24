import { Injectable, UnauthorizedException, Logger } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { ConfigService } from "@nestjs/config";
import * as jwksClient from "jwks-rsa";
import * as https from "https";
import { fromUnixTime, isBefore } from "date-fns";
import { UserRole } from "../../common/enums";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  private readonly logger = new Logger(JwtStrategy.name);

  constructor(configService: ConfigService) {
    const jwksUri = configService.get<string>("JWK_SET_URI");
    const issuerUrl = configService.get<string>("ISSUER_URL");
    const nodeEnv = configService.get<string>("NODE_ENV", "development");
    const isProduction = nodeEnv === "production";

    // Only attach an HTTPS agent when the JWKS endpoint is itself https:// —
    // passing one to an http:// endpoint throws "Protocol 'http:' not supported".
    const jwksUsesHttps = jwksUri?.startsWith("https://");
    const requestAgent = jwksUsesHttps
      ? new https.Agent({ rejectUnauthorized: isProduction })
      : undefined;

    const jwtSecret = configService.get<string>("JWT_SECRET", "defaultSecret");

    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      ...(jwksUri
        ? {
            secretOrKeyProvider: jwksClient.passportJwtSecret({
              cache: true,
              cacheMaxEntries: 5,
              cacheMaxAge: 600000, // 10 min
              rateLimit: true,
              jwksRequestsPerMinute: 60,
              jwksUri,
              ...(requestAgent && { requestAgent }),
            }),
          }
        : { secretOrKey: jwtSecret }),
      algorithms: ["RS256", "HS256"],
      // Issuer is only enforced in production, so dev/local tokens issued by
      // any IdP are accepted while pointing JWK_SET_URI at a local instance.
      issuer: isProduction ? issuerUrl : undefined,
    });
  }

  async validate(payload: any) {
    this.logger.debug(`Validating JWT for subject: ${payload.sub}`);

    if (!payload.sub) {
      this.logger.warn('Invalid token: missing "sub" claim');
      throw new UnauthorizedException('Invalid token: missing "sub" claim');
    }

    if (!payload.exp) {
      this.logger.warn("Invalid token: missing expiration claim");
      throw new UnauthorizedException("Invalid token: missing expiration");
    }

    if (isBefore(fromUnixTime(payload.exp), new Date())) {
      this.logger.warn(`Expired token for subject: ${payload.sub}`);
      throw new UnauthorizedException("Token expired");
    }

    return {
      userId: payload.sub,
      jti: payload.jti,
      email: payload.email || payload.preferred_username,
      username: payload.preferred_username,
      name: payload.name,
      role: payload.role as UserRole,
      permissions: payload.permissions || [],
      roles: payload.roles || [],
      scope: payload.scope,
      iat: payload.iat,
      exp: payload.exp,
    };
  }
}
