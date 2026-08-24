import { Test, TestingModule } from "@nestjs/testing";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";

describe("AuthController", () => {
  let controller: AuthController;
  let authService: jest.Mocked<AuthService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: {
            login: jest.fn(),
            logout: jest.fn(),
            refresh: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    authService = module.get(AuthService);
  });

  it("delegates login to AuthService", async () => {
    const request = { email: "user@example.com", password: "password123" };
    const response = { accessToken: "a", refreshToken: "r" } as any;
    authService.login.mockResolvedValue(response);

    await expect(controller.login(request)).resolves.toBe(response);
    expect(authService.login).toHaveBeenCalledWith(request);
  });

  it("delegates logout to AuthService", async () => {
    const request = { refreshToken: "r" };
    await controller.logout(request);

    expect(authService.logout).toHaveBeenCalledWith(request);
  });

  it("delegates refresh to AuthService", async () => {
    const request = { refreshToken: "r" };
    const response = { accessToken: "a" } as any;
    authService.refresh.mockResolvedValue(response);

    await expect(controller.refresh(request)).resolves.toBe(response);
    expect(authService.refresh).toHaveBeenCalledWith(request);
  });
});
