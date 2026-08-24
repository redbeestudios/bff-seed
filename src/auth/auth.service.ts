import { Injectable, Logger, UnauthorizedException } from "@nestjs/common";
import { TokenService } from "./services/token.service";
import {
  AuthenticationRequestDto,
  AuthenticationResponseDto,
  LogoutRequestDto,
  RefreshTokenRequestDto,
} from "../common/dto/auth.dto";

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(private readonly tokenService: TokenService) {}

  /**
   * This seed does not ship a user store or identity provider. Plug in your
   * own credential verification here (a database lookup, a call to an
   * upstream identity service, etc.) before issuing tokens — this method
   * only demonstrates the token-issuance flow.
   */
  async login(
    request: AuthenticationRequestDto,
  ): Promise<AuthenticationResponseDto> {
    this.logger.log(`Login attempt for: ${request.email}`);

    const tokens = await this.tokenService.generateTokens({
      id: request.email,
      email: request.email,
    });

    this.logger.log(`Login successful for: ${request.email}`);
    return { ...tokens, permissions: [] };
  }

  async logout(request: LogoutRequestDto): Promise<void> {
    this.tokenService.blacklistToken(request.refreshToken);
    this.logger.log("Logout successful");
  }

  async refresh(
    request: RefreshTokenRequestDto,
  ): Promise<AuthenticationResponseDto> {
    const result = await this.tokenService.refreshAccessToken(
      request.refreshToken,
    );

    if (!result) {
      this.logger.warn("Refresh attempted with an invalid or expired token");
      throw new UnauthorizedException("Invalid or expired refresh token");
    }

    this.logger.log("Token refreshed successfully");
    return {
      accessToken: result.accessToken,
      refreshToken: request.refreshToken,
      tokenType: result.tokenType,
      expiresIn: result.expiresIn,
      refreshExpiresIn: 0,
      permissions: [],
    };
  }
}
