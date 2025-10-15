import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
  Logger,
} from "@nestjs/common";
import { Response } from "express";
import { ZodValidationException } from "nestjs-zod";
import { ZodError } from "zod";

@Catch(ZodValidationException)
export class ZodValidationExceptionFilter implements ExceptionFilter {
  private logger = new Logger(ZodValidationExceptionFilter.name);

  catch(exception: ZodValidationException, host: ArgumentsHost) {
    const zodError = exception.getZodError();
    const response = host.switchToHttp().getResponse<Response>();

    if (zodError instanceof ZodError) {
      this.logger.error(`ZodSerializationException: ${zodError.message}`);

      response.status(HttpStatus.BAD_REQUEST).json({
        message: zodError.issues[0].message,
        error: "Validation Failed",
        statusCode: HttpStatus.BAD_REQUEST,
      });
    }
  }
}
