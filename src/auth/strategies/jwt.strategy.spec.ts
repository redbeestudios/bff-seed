import { UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtStrategy } from "./jwt.strategy";

function buildStrategy(env: Record<string, string> = {}) {
  const configService = {
    get: (key: string, defaultValue?: string) => env[key] ?? defaultValue,
  } as unknown as ConfigService;

  return new JwtStrategy(configService);
}

describe("JwtStrategy", () => {
  const futureExp = Math.floor(Date.now() / 1000) + 3600;
  const pastExp = Math.floor(Date.now() / 1000) - 3600;

  it("rejects a payload without a sub claim", async () => {
    const strategy = buildStrategy();
    await expect(strategy.validate({ exp: futureExp })).rejects.toThrow(
      UnauthorizedException,
    );
  });

  it("rejects a payload without an exp claim", async () => {
    const strategy = buildStrategy();
    await expect(strategy.validate({ sub: "user-1" })).rejects.toThrow(
      UnauthorizedException,
    );
  });

  it("rejects an expired token", async () => {
    const strategy = buildStrategy();
    await expect(
      strategy.validate({ sub: "user-1", exp: pastExp }),
    ).rejects.toThrow(UnauthorizedException);
  });

  it("maps a valid payload to a normalized user object", async () => {
    const strategy = buildStrategy();
    const user = await strategy.validate({
      sub: "user-1",
      exp: futureExp,
      iat: futureExp - 3600,
      email: "user@example.com",
      role: "ADMIN",
      permissions: ["read"],
      roles: ["admin"],
    });

    expect(user).toEqual({
      userId: "user-1",
      jti: undefined,
      email: "user@example.com",
      username: undefined,
      name: undefined,
      role: "ADMIN",
      permissions: ["read"],
      roles: ["admin"],
      scope: undefined,
      iat: futureExp - 3600,
      exp: futureExp,
    });
  });

  it("does not attach an HTTPS agent for an http:// JWKS endpoint", () => {
    expect(() =>
      buildStrategy({ JWK_SET_URI: "http://localhost:8080/certs" }),
    ).not.toThrow();
  });
});
