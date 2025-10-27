import { HttpStatus } from "@nestjs/common";
import { createZodDto } from "nestjs-zod";
import z from "zod";

const MeResDtoSchema = z.object({
  message: z.string(),
  userDetails: z.object({
    id: z.string(),
    name: z.string(),
    email: z.email(),
  }),
  statusCode: z.enum(HttpStatus),
});

export class MeResDto extends createZodDto(MeResDtoSchema) {}
