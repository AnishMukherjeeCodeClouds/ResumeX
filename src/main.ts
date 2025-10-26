import { NestFactory } from "@nestjs/core";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import { cleanupOpenApiDoc } from "nestjs-zod";
import { AppConfig } from "./app.config";
import { AppModule } from "./app.module";
import { ThrottlerExceptionFilter } from "./filters/throttler-exception.filter";
import { ZodValidationExceptionFilter } from "./filters/zod-validation-exception.filter";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // For handling cookies
  app.use(cookieParser());

  // Security for common vulnerabilities
  app.use(helmet());

  app.useGlobalFilters(
    // Global filter for ZodValidationException (Dto validation errors)
    new ZodValidationExceptionFilter(),

    // Global filter for ThrottlerException (Rate limiting errors)
    new ThrottlerExceptionFilter(),
  );

  // Swagger documentation
  const config = new DocumentBuilder()
    .setTitle("ResumeX")
    .setDescription(
      "Documentation for ResumeX: The professional Resume Builder",
    )
    .setVersion("1.0.0")
    .addBearerAuth()
    .build();

  const swaggerDocument = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup("api", app, cleanupOpenApiDoc(swaggerDocument));

  const appConfig = app.get(AppConfig);
  await app.listen(appConfig.port);
}
void bootstrap();
