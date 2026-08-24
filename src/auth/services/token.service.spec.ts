import { Test, TestingModule } from "@nestjs/testing";
import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";
import { TokenService } from "./token.service";
import { EnvObjects } from "../../config/app.config";

describe("TokenService", () => {
  let service: TokenService;

  const tokenConfig = {
    jwtSecret: "test-secret",
    jwtExpiration: "3600",
    refreshTokenExpiration: "604800",
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TokenService,
        JwtService,
        {
          provide: ConfigService,
          useValue: {
            get: (key: string) =>
              key === EnvObjects.TOKEN_CONFIG ? tokenConfig : undefined,
          },
        },
      ],
    }).compile();

    service = module.get<TokenService>(TokenService);
  });

  const user = { id: "user-1", email: "user@example.com" };

  it("generates an access and refresh token pair", async () => {
    const tokens = await service.generateTokens(user);

    expect(tokens.accessToken).toBeDefined();
    expect(tokens.refreshToken).toBeDefined();
    expect(tokens.tokenType).toBe("Bearer");
    expect(tokens.expiresIn).toBe(3600);
    expect(tokens.refreshExpiresIn).toBe(604800);
  });

  it("validates a token it issued", async () => {
    const tokens = await service.generateTokens(user);
    const payload = await service.validateToken(tokens.accessToken);

    expect(payload.sub).toBe(user.id);
    expect(payload.type).toBe("access");
  });

  it("returns null for a blacklisted token", async () => {
    const tokens = await service.generateTokens(user);
    service.blacklistToken(tokens.accessToken);

    expect(await service.validateToken(tokens.accessToken)).toBeNull();
  });

  it("returns null for a malformed token", async () => {
    expect(await service.validateToken("not-a-jwt")).toBeNull();
  });

  it("issues a new access token from a valid refresh token", async () => {
    const tokens = await service.generateTokens(user);
    const refreshed = await service.refreshAccessToken(tokens.refreshToken);

    expect(refreshed).not.toBeNull();
    expect(refreshed.accessToken).toBeDefined();
    expect(refreshed.expiresIn).toBe(3600);
  });

  it("rejects refreshing with an access token", async () => {
    const tokens = await service.generateTokens(user);

    expect(await service.refreshAccessToken(tokens.accessToken)).toBeNull();
  });
});
