import { HttpStatus } from "@nestjs/common";
import { createZodDto } from "nestjs-zod";
import z from "zod";

const RefreshReqDtoSchema = z.object({
  refreshToken: z.jwt("Refresh Token is required"),
});

export class RefreshReqDto extends createZodDto(RefreshReqDtoSchema) {}

const RefreshResDtoSchema = z.object({
  message: z.string(),
  accessToken: z.jwt(),
  refreshToken: z.jwt(),
  statusCode: z.enum(HttpStatus),
});

export class RefreshResDto extends createZodDto(RefreshResDtoSchema) {}
