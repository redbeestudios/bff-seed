import { UnauthorizedException, ExecutionContext } from "@nestjs/common";
import { JwtAuthGuard } from "./jwt.guard";
import { TokenBlacklistService } from "../../common/services/token-blacklist.service";

function buildContext(headers: Record<string, string>): ExecutionContext {
  return {
    switchToHttp: () => ({
      getRequest: () => ({ headers }),
    }),
  } as unknown as ExecutionContext;
}

describe("JwtAuthGuard", () => {
  let blacklist: TokenBlacklistService;
  let guard: JwtAuthGuard;

  beforeEach(() => {
    blacklist = new TokenBlacklistService();
    guard = new JwtAuthGuard(blacklist);
  });

  it("throws when no token is provided", () => {
    expect(() => guard.canActivate(buildContext({}))).toThrow(
      UnauthorizedException,
    );
  });

  it("throws when the token is blacklisted", () => {
    blacklist.addToBlacklist("revoked-token", "logout");
    expect(() =>
      guard.canActivate(
        buildContext({ authorization: "Bearer revoked-token" }),
      ),
    ).toThrow(UnauthorizedException);
  });

  describe("handleRequest", () => {
    it("returns the user on success", () => {
      const user = { email: "user@example.com" };
      expect(
        guard.handleRequest(null, user, null, {} as ExecutionContext),
      ).toBe(user);
    });

    it("throws when passport reports an error", () => {
      expect(() =>
        guard.handleRequest(
          new Error("invalid"),
          null,
          null,
          {} as ExecutionContext,
        ),
      ).toThrow("invalid");
    });

    it("throws Unauthorized when there is no user and no error", () => {
      expect(() =>
        guard.handleRequest(
          null,
          null,
          { message: "no auth header" },
          {} as ExecutionContext,
        ),
      ).toThrow(UnauthorizedException);
    });
  });
});
