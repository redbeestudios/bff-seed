import { Controller, Get } from "@nestjs/common";
import { ApiTags, ApiOperation, ApiResponse } from "@nestjs/swagger";

@ApiTags("health")
@Controller()
export class AppController {
  @Get()
  @ApiOperation({
    summary: "Root endpoint",
    description: "API root",
  })
  getRoot() {
    return {
      message: "BFF Seed API",
      version: process.env.npm_package_version || "1.0.0",
      documentation: process.env.NODE_ENV !== "production" ? "/api" : undefined,
    };
  }

  @Get("health")
  @ApiOperation({
    summary: "Health check",
    description: "Reports whether the application is up",
  })
  @ApiResponse({ status: 200, description: "Application is healthy" })
  getHealth() {
    return {
      status: "ok",
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: process.env.NODE_ENV || "development",
      version: process.env.npm_package_version || "1.0.0",
    };
  }

  @Get("actuator/health")
  @ApiOperation({
    summary: "Actuator-compatible health check",
    description:
      "Health endpoint shaped like Spring Boot Actuator, for infra that expects it",
  })
  getActuatorHealth() {
    return {
      status: "UP",
      components: {
        livenessState: { status: "UP" },
        readinessState: { status: "UP" },
      },
    };
  }

  @Get("actuator/health/liveness")
  @ApiOperation({
    summary: "Liveness probe",
    description: "Liveness endpoint for Kubernetes",
  })
  getLiveness() {
    return { status: "UP" };
  }

  @Get("actuator/health/readiness")
  @ApiOperation({
    summary: "Readiness probe",
    description: "Readiness endpoint for Kubernetes",
  })
  getReadiness() {
    return { status: "UP" };
  }
}
