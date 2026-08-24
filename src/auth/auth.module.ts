import {
  Module,
  MiddlewareConsumer,
  NestModule,
  RequestMethod,
} from "@nestjs/common";
import { PassportModule } from "@nestjs/passport";
import { ConfigModule } from "@nestjs/config";
import { JwtModule } from "@nestjs/jwt";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { JwtStrategy } from "./strategies/jwt.strategy";
import { TokenService } from "./services/token.service";
import { TokenBlacklistService } from "../common/services/token-blacklist.service";
import { AuthRateLimitMiddleware } from "../common/middleware/auth-rate-limit.middleware";

@Module({
  imports: [
    ConfigModule,
    JwtModule.register({}),
    PassportModule.register({ defaultStrategy: "jwt" }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, TokenService, TokenBlacklistService],
  exports: [TokenBlacklistService, JwtStrategy, PassportModule],
})
export class AuthModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthRateLimitMiddleware)
      .forRoutes({ path: "auth/login", method: RequestMethod.POST });
  }
}
