import { ForbiddenException, ExecutionContext } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { PermissionsGuard } from "./permissions.guard";
import { Permission } from "../../common/enums";

function buildContext(user: any): ExecutionContext {
  return {
    switchToHttp: () => ({ getRequest: () => ({ user }) }),
    getHandler: () => ({}),
    getClass: () => ({}),
  } as unknown as ExecutionContext;
}

describe("PermissionsGuard", () => {
  let reflector: Reflector;
  let guard: PermissionsGuard;

  beforeEach(() => {
    reflector = new Reflector();
    guard = new PermissionsGuard(reflector);
  });

  it("allows access when no permissions are required", () => {
    jest.spyOn(reflector, "getAllAndOverride").mockReturnValue(undefined);
    expect(guard.canActivate(buildContext({}))).toBe(true);
  });

  it("throws when there is no authenticated user", () => {
    jest
      .spyOn(reflector, "getAllAndOverride")
      .mockReturnValue([Permission.MANAGE]);
    expect(() => guard.canActivate(buildContext(undefined))).toThrow(
      ForbiddenException,
    );
  });

  it("throws when the user lacks the required permission", () => {
    jest
      .spyOn(reflector, "getAllAndOverride")
      .mockReturnValue([Permission.MANAGE]);
    expect(() =>
      guard.canActivate(buildContext({ permissions: [Permission.READ] })),
    ).toThrow(ForbiddenException);
  });

  it("allows access when the user has one of the required permissions", () => {
    jest
      .spyOn(reflector, "getAllAndOverride")
      .mockReturnValue([Permission.READ, Permission.WRITE]);
    expect(
      guard.canActivate(buildContext({ permissions: [Permission.READ] })),
    ).toBe(true);
  });
});
