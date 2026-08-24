import { appConfig } from "./app.config";

describe("appConfig", () => {
  const originalEnv = { ...process.env };

  afterEach(() => {
    process.env = { ...originalEnv };
  });

  it("falls back to defaults when env vars are not set", () => {
    delete process.env.PORT;
    delete process.env.JWT_SECRET;
    delete process.env.JWT_EXPIRATION;
    delete process.env.REFRESH_TOKEN_EXPIRATION;

    const config = appConfig();

    expect(config.port).toBe(3000);
    expect(config.tokenConfig).toEqual({
      jwtSecret: "defaultSecret",
      jwtExpiration: "3600",
      refreshTokenExpiration: "604800",
    });
  });

  it("reads values from environment variables when present", () => {
    process.env.PORT = "4000";
    process.env.JWT_SECRET = "super-secret";
    process.env.JWT_EXPIRATION = "900";
    process.env.REFRESH_TOKEN_EXPIRATION = "1209600";

    const config = appConfig();

    expect(config.port).toBe(4000);
    expect(config.tokenConfig).toEqual({
      jwtSecret: "super-secret",
      jwtExpiration: "900",
      refreshTokenExpiration: "1209600",
    });
  });
});
