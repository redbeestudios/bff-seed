import { Injectable, NestMiddleware } from "@nestjs/common";
import { Request, Response, NextFunction } from "express";
import rateLimit, { ipKeyGenerator } from "express-rate-limit";

@Injectable()
export class AuthRateLimitMiddleware implements NestMiddleware {
  private readonly authRateLimit = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 5,
    message: {
      error: "Authentication rate limit exceeded",
      message:
        "Too many authentication attempts. Limit: 5 attempts per 15 minutes.",
      retryAfter: "15 minutes",
    },
    standardHeaders: true,
    legacyHeaders: false,
    skipSuccessfulRequests: true,
    skipFailedRequests: false,
    keyGenerator: (req: Request) =>
      `${ipKeyGenerator(req.ip)}-${req.get("User-Agent")}`,
  });

  use(req: Request, res: Response, next: NextFunction) {
    this.authRateLimit(req, res, next);
  }
}
