import { HttpStatus } from "@nestjs/common";
import { createZodDto } from "nestjs-zod";
import z from "zod";

const LogoutDtoSchema = z.object({
  message: z.string(),
  statusCode: z.enum(HttpStatus),
});

export class LogoutDto extends createZodDto(LogoutDtoSchema) {}
