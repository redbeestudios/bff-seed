import { Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";
import { EnvObjects, ITokenConfig } from "../../config/app.config";

@Injectable()
export class TokenService {
  private readonly blacklistedTokens: Set<string> = new Set();
  private readonly tokenConfig: ITokenConfig;

  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {
    this.tokenConfig = this.configService.get<ITokenConfig>(
      EnvObjects.TOKEN_CONFIG,
    );
  }

  async generateTokens(user: { id: string; email: string }) {
    const [accessToken, refreshToken] = await Promise.all([
      this.generateAccessToken(user),
      this.generateRefreshToken(user),
    ]);

    return {
      accessToken,
      refreshToken,
      tokenType: "Bearer",
      expiresIn: Number(this.tokenConfig.jwtExpiration),
      refreshExpiresIn: Number(this.tokenConfig.refreshTokenExpiration),
    };
  }

  private async generateAccessToken(user: { id: string; email: string }) {
    const payload = {
      sub: user.id,
      email: user.email,
      type: "access",
    };

    return this.jwtService.signAsync(payload, {
      expiresIn: Number(this.tokenConfig.jwtExpiration),
      secret: this.tokenConfig.jwtSecret,
    });
  }

  private async generateRefreshToken(user: { id: string; email: string }) {
    const payload = {
      sub: user.id,
      email: user.email,
      type: "refresh",
    };

    return this.jwtService.signAsync(payload, {
      expiresIn: Number(this.tokenConfig.refreshTokenExpiration),
      secret: this.tokenConfig.jwtSecret,
    });
  }

  async validateToken(token: string): Promise<any> {
    if (this.isTokenBlacklisted(token)) {
      return null;
    }

    try {
      return await this.jwtService.verifyAsync(token, {
        secret: this.tokenConfig.jwtSecret,
      });
    } catch {
      return null;
    }
  }

  blacklistToken(token: string): void {
    this.blacklistedTokens.add(token);
  }

  isTokenBlacklisted(token: string): boolean {
    return this.blacklistedTokens.has(token);
  }

  async refreshAccessToken(refreshToken: string): Promise<any> {
    const payload = await this.validateToken(refreshToken);

    if (!payload || payload.type !== "refresh") {
      return null;
    }

    const user = {
      id: payload.sub,
      email: payload.email,
    };

    const accessToken = await this.generateAccessToken(user);

    return {
      accessToken,
      tokenType: "Bearer",
      expiresIn: Number(this.tokenConfig.jwtExpiration),
    };
  }
}
