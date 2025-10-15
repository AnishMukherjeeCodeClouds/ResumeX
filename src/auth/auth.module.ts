import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { DbModule } from "src/db/db.module";
import { AuthConfig } from "./auth.config";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";

@Module({
  imports: [
    DbModule,
    JwtModule.registerAsync({
      inject: [AuthConfig],
      useFactory: (config: AuthConfig) => ({
        global: true,
        secret: config.jwtSecret,
        signOptions: {
          algorithm: "HS512",
        },
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService],
  exports: [JwtModule],
})
export class AuthModule {}
