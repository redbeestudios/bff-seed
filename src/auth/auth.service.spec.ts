import { UnauthorizedException } from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";
import { AuthService } from "./auth.service";
import { TokenService } from "./services/token.service";

describe("AuthService", () => {
  let service: AuthService;
  let tokenService: jest.Mocked<TokenService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: TokenService,
          useValue: {
            generateTokens: jest.fn(),
            blacklistToken: jest.fn(),
            refreshAccessToken: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    tokenService = module.get(TokenService);
  });

  describe("login", () => {
    it("issues tokens for the given credentials", async () => {
      tokenService.generateTokens.mockResolvedValue({
        accessToken: "access-token",
        refreshToken: "refresh-token",
        tokenType: "Bearer",
        expiresIn: 3600,
        refreshExpiresIn: 604800,
      });

      const result = await service.login({
        email: "user@example.com",
        password: "irrelevant",
      });

      expect(tokenService.generateTokens).toHaveBeenCalledWith({
        id: "user@example.com",
        email: "user@example.com",
      });
      expect(result.accessToken).toBe("access-token");
      expect(result.permissions).toEqual([]);
    });
  });

  describe("logout", () => {
    it("blacklists the refresh token", async () => {
      await service.logout({ refreshToken: "refresh-token" });

      expect(tokenService.blacklistToken).toHaveBeenCalledWith("refresh-token");
    });
  });

  describe("refresh", () => {
    it("returns a new access token", async () => {
      tokenService.refreshAccessToken.mockResolvedValue({
        accessToken: "new-access-token",
        tokenType: "Bearer",
        expiresIn: 3600,
      });

      const result = await service.refresh({ refreshToken: "refresh-token" });

      expect(result.accessToken).toBe("new-access-token");
      expect(result.refreshToken).toBe("refresh-token");
    });

    it("throws when the refresh token is invalid or expired", async () => {
      tokenService.refreshAccessToken.mockResolvedValue(null);

      await expect(
        service.refresh({ refreshToken: "bad-token" }),
      ).rejects.toThrow(UnauthorizedException);
    });
  });
});
