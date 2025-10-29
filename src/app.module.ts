import { ConfigifyModule } from "@itgorillaz/configify";
import { CacheModule } from "@nestjs/cache-manager";
import { Module } from "@nestjs/common";
import { APP_GUARD, APP_INTERCEPTOR, APP_PIPE } from "@nestjs/core";
import { ThrottlerGuard, ThrottlerModule } from "@nestjs/throttler";
import {
  createZodValidationPipe,
  ZodSerializerInterceptor,
  ZodValidationException,
} from "nestjs-zod";
import { ZodError } from "zod";
import { AppController } from "./app.controller";
import { AuthModule } from "./auth/auth.module";
import { DbModule } from "./db/db.module";
import { ResumeModule } from "./resume/resume.module";

@Module({
  imports: [
    // For app wide .env configs
    ConfigifyModule.forRootAsync(),

    // For rate limiting
    ThrottlerModule.forRoot({
      throttlers: [
        {
          ttl: 60000,
          limit: 20,
        },
      ],
    }),

    // For caching
    CacheModule.register({
      isGlobal: true,
    }),

    // My modules
    DbModule,
    AuthModule,
    ResumeModule,
  ],
  controllers: [AppController],
  providers: [
    // Pipe for Zod validation
    {
      provide: APP_PIPE,
      useClass: createZodValidationPipe({
        createValidationException: (error: ZodError) =>
          new ZodValidationException(error),
      }),
    },

    // Interceptor for Zod response dto serialization
    { provide: APP_INTERCEPTOR, useClass: ZodSerializerInterceptor },

    // Guard for rate limiting
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
