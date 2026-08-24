import { Test, TestingModule } from "@nestjs/testing";
import { AppController } from "./app.controller";

describe("AppController", () => {
  let controller: AppController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
    }).compile();

    controller = module.get<AppController>(AppController);
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });

  describe("getRoot", () => {
    it("returns the API root message", () => {
      const result = controller.getRoot();

      expect(result).toHaveProperty("message", "BFF Seed API");
      expect(result).toHaveProperty("version");
    });
  });

  describe("getHealth", () => {
    it("returns health status", () => {
      const result = controller.getHealth();

      expect(result).toHaveProperty("status", "ok");
      expect(result).toHaveProperty("timestamp");
      expect(result).toHaveProperty("uptime");
      expect(result).toHaveProperty("environment");
      expect(result).toHaveProperty("version");
    });
  });

  describe("getActuatorHealth", () => {
    it("returns actuator-shaped health status", () => {
      const result = controller.getActuatorHealth();

      expect(result).toHaveProperty("status", "UP");
      expect(result.components.livenessState.status).toBe("UP");
      expect(result.components.readinessState.status).toBe("UP");
    });
  });

  describe("getLiveness", () => {
    it("returns liveness status", () => {
      expect(controller.getLiveness()).toEqual({ status: "UP" });
    });
  });

  describe("getReadiness", () => {
    it("returns readiness status", () => {
      expect(controller.getReadiness()).toEqual({ status: "UP" });
    });
  });
});
