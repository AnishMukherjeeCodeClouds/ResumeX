import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
  Logger,
} from "@nestjs/common";
import { ThrottlerException } from "@nestjs/throttler";
import { Response } from "express";
import { ZodValidationExceptionFilter } from "./zod-validation-exception.filter";

@Catch(ThrottlerException)
export class ThrottlerExceptionFilter implements ExceptionFilter {
  private logger = new Logger(ZodValidationExceptionFilter.name);

  catch(_, host: ArgumentsHost) {
    const response = host.switchToHttp().getResponse<Response>();
    response.status(HttpStatus.TOO_MANY_REQUESTS).json({
      message: "Too many requests, please try again later.",
      error: "Rate Limit Exceeded",
      statusCode: HttpStatus.TOO_MANY_REQUESTS,
    });
  }
}
