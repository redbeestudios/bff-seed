import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { AuthModule } from "./auth/auth.module";
import { ThrottlingModule } from "./common/modules/throttling.module";
import { AppController } from "./app.controller";
import { appConfig } from "./config/app.config";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ".env",
      load: [appConfig],
    }),
    ThrottlingModule,
    AuthModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
