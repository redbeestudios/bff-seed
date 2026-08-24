import { ExecutionContext } from "@nestjs/common";
import { UserInfoDto } from "../dto/auth.dto";

describe("CurrentUser decorator", () => {
  function extractFactory(data: string | undefined, ctx: ExecutionContext) {
    const request = ctx.switchToHttp().getRequest<{ user: UserInfoDto }>();
    return data ? (request.user as any)?.[data] : request.user;
  }

  function buildContext(user: Partial<UserInfoDto>): ExecutionContext {
    return {
      switchToHttp: () => ({
        getRequest: () => ({ user }),
      }),
    } as unknown as ExecutionContext;
  }

  it("returns the full user object when no key is requested", () => {
    const user: Partial<UserInfoDto> = {
      userId: "1",
      email: "user@example.com",
    };
    const ctx = buildContext(user);

    expect(extractFactory(undefined, ctx)).toEqual(user);
  });

  it("returns a single field when a key is requested", () => {
    const user: Partial<UserInfoDto> = {
      userId: "1",
      email: "user@example.com",
    };
    const ctx = buildContext(user);

    expect(extractFactory("email", ctx)).toBe("user@example.com");
  });
});
