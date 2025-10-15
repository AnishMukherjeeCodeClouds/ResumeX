import { NestFactory } from "@nestjs/core";
import helmet from "helmet";
import { AppConfig } from "./app.config";
import { AppModule } from "./app.module";
import { ThrottlerExceptionFilter } from "./filters/throttler-exception.filter";
import { ZodValidationExceptionFilter } from "./filters/zod-validation-exception.filter";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Security for common vulnerabilities
  app.use(helmet());

  const appConfig = app.get(AppConfig);

  app.useGlobalFilters(
    // Global filter for ZodValidationException (Dto validation errors)
    new ZodValidationExceptionFilter(),

    // Global filter for ThrottlerException (Rate limiting errors)
    new ThrottlerExceptionFilter(),
  );
  await app.listen(appConfig.port);
}
void bootstrap();
