import { ForbiddenException, ExecutionContext } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { RolesGuard } from "./roles.guard";
import { UserRole } from "../../common/enums";

function buildContext(user: any): ExecutionContext {
  return {
    switchToHttp: () => ({ getRequest: () => ({ user }) }),
    getHandler: () => ({}),
    getClass: () => ({}),
  } as unknown as ExecutionContext;
}

describe("RolesGuard", () => {
  let reflector: Reflector;
  let guard: RolesGuard;

  beforeEach(() => {
    reflector = new Reflector();
    guard = new RolesGuard(reflector);
  });

  it("allows access when no roles are required", () => {
    jest.spyOn(reflector, "getAllAndOverride").mockReturnValue(undefined);
    expect(guard.canActivate(buildContext({}))).toBe(true);
  });

  it("throws when there is no authenticated user", () => {
    jest
      .spyOn(reflector, "getAllAndOverride")
      .mockReturnValue([UserRole.ADMIN]);
    expect(() => guard.canActivate(buildContext(undefined))).toThrow(
      ForbiddenException,
    );
  });

  it("throws when the user lacks the required role", () => {
    jest
      .spyOn(reflector, "getAllAndOverride")
      .mockReturnValue([UserRole.ADMIN]);
    expect(() =>
      guard.canActivate(buildContext({ role: UserRole.USER })),
    ).toThrow(ForbiddenException);
  });

  it("allows access when the user has one of the required roles", () => {
    jest
      .spyOn(reflector, "getAllAndOverride")
      .mockReturnValue([UserRole.ADMIN, UserRole.USER]);
    expect(guard.canActivate(buildContext({ role: UserRole.USER }))).toBe(true);
  });
});
