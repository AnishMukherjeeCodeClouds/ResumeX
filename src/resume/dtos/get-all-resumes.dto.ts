import { HttpStatus } from "@nestjs/common";
import { createZodDto } from "nestjs-zod";
import z from "zod";

const GetAllResumesResDtoSchema = z.object({
  message: z.string(),
  resumes: z.array(
    z.object({
      id: z.string(),
      title: z.string(),
      template: z.string(),
      createdAt: z.date().transform((val) => val.toDateString()),
    }),
  ),
  statusCode: z.enum(HttpStatus),
});

export class GetAllResumesResDto extends createZodDto(
  GetAllResumesResDtoSchema,
) {}
